import fs from "node:fs";
import { JSDOM } from "jsdom";
import express from "express";
import basicAuth from "express-basic-auth";
import morgan from "morgan";
import * as mongodb from "mongodb";

var dom;
var document;
var students;
var courses;
var dict;

const app = express();
const studentRouter = express.Router();
const teacherRouter = express.Router();

const MongoClient = mongodb.default.MongoClient;
const client = new MongoClient(
  "mongodb+srv://<login>:<password>@aghcluster.ulbcupz.mongodb.net/?retryWrites=true&w=majority"
);

app.use(express.static("public"));
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));

app.use('/student', studentRouter);
app.use('/teacher', teacherRouter);

app.get('/', (_req, res) => {
  res.set("Content-Type", "text/html");
  res.send(dom.serialize());
})

studentRouter.get('/', (req, res) => {
  var student_id = Number(req.query.student_id);
  var studentName = findStudentNameById(student_id);

  if (studentName === null) {
    res.send(
`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Error: invalid form data</title>
  <style>
    .my_td {
        border: 1px solid #000; 
        padding: 15px;
        text-align: left;
    }
    .my_th {
        background-color: #04AA6D;
        padding: 8px;
        color: white;
        font-weight: bold;
    }
  </style>
  </head>
  <body>
    <h1>Error: invalid form data</h1>
  </body>
</html>`
    );
  } else {
    var grades = findGrades(student_id);
    var headerMessage = `Wykaz ocen dla studenta ${studentName} (id: ${student_id})`;

    var studentGradeTable = inputTable(student_id, grades, headerMessage);
    res.send(studentGradeTable);
  }
})

teacherRouter.use(
  basicAuth({
    users: { admin: "superhaslo" },
    unauthorizedResponse: getUnauthorizedResponse,
    challenge: true,
  })
);

function getUnauthorizedResponse(req) {
  return req.auth
    ? "Credentials " + req.auth.user + ":" + req.auth.password + " rejected"
    : "No credentials provided";
}

teacherRouter.post("/add", async (req, res) => {
  var body = JSON.parse(req.body.args);

  var student = Number(body.student);
  var subject = Number(body.subject);
  var grade = body.grade;
  var type = body.type;

  res.set("Content-Type", `application/${type}`);

  var paramsServed = await serveAddParams(student, subject, grade);

  if (paramsServed === null) {
    if (type === "JSON") {
      result = {
        "Error": "Invalid form data",
      };

      res.json(result);
    } else {
      result = 
`<error>
  Invalid form data
</error>`;
      res.send(result);
    }
  } else {
    var studentName = findStudentNameById(student);
    var courseName = findCourseNameById(subject);
    var headerMessage = `Dodano ocenę: ${grade} studentowi ${studentName} (id: ${student}) z przedmiotu ${courseName} (id: ${subject})`;

    var result;

    if (type === "JSON") {
      result = {
        "Message": headerMessage,
        "Student id": student,
        "Student name": studentName,
        "Course id": subject,
        "Course name": courseName,
        "Added grade": grade,
      };

      res.json(result);
    } else {
      result = 
`<result>
  <message>${headerMessage}</message>
  <student_id>${student}</student_id>
  <student_name>${studentName}</student_name>
  <course_id>${subject}</course_id>
  <course_name>${courseName}</course_name>
  <added_grade>${grade}</added_grade>
</result>`;
      res.send(result);
    }
  }
});

teacherRouter.put("/modify", async (req, res) => {
  var body = JSON.parse(req.body.args);

  var student = Number(body.student);
  var subject = Number(body.subject);
  var grade = body.grade;
  var index = Number(body.index);
  var type = body.type;

  res.set("Content-Type", `application/${type}`);

  var paramsServed = await serveModifyParams(student, subject, grade, index);

  if (paramsServed === null) {
    if (type === "JSON") {
      result = {
        "Error": "Invalid form data",
      };

      res.json(result);
    } else {
      result = 
`<error>
  Invalid form data
</error>`;
      res.send(result);
    }
  } else {
    var studentName = findStudentNameById(student);
    var courseName = findCourseNameById(subject);
    var headerMessage = `Zmodyfikowano ocenę o indeksie: ${index} na: ${grade} studentowi ${studentName} (id: ${student}) z przedmiotu ${courseName} (id: ${subject})`;
    
    var result;

    if (type === "JSON") {
      result = {
        "Message": headerMessage,
        "Student id": student,
        "Student name": studentName,
        "Course id": subject,
        "Course name": courseName,
        "Modified grade": grade,
        "Modified grade index": index,
      };

      res.json(result);
    } else {
      result = 
`<result>
  <message>${headerMessage}</message>
  <student_id>${student}</student_id>
  <student_name>${studentName}</student_name>
  <course_id>${subject}</course_id>
  <course_name>${courseName}</course_name>
  <modified_grade>${grade}</modified_grade>
  <modified_grade_index>${index}</modified_grade_index>
</result>`;
      res.send(result);
    }
  }
});

teacherRouter.delete("/delete", async (req, res) => {
  var body = JSON.parse(req.body.args);

  var student = Number(body.student);
  var subject = Number(body.subject);
  var index = Number(body.index);
  var type = body.type;

  res.set("Content-Type", `application/${type}`);

  var paramsServed = await serveDeleteParams(student, subject, index);

  if (paramsServed === null) {
    if (type === "JSON") {
      result = {
        "Error": "Invalid form data",
      };

      res.json(result);
    } else {
      result = 
`<error>
  Invalid form data
</error>`;
      res.send(result);
    }
  } else {
    var studentName = findStudentNameById(student);
    var courseName = findCourseNameById(subject);
    var headerMessage = `Usunięto dawną ocenę o indeksie: ${index} studentowi ${studentName} (id: ${student}) z przedmiotu ${courseName} (id: ${subject})`;
    
    var result;

    if (type === "JSON") {
      result = {
        "Message": headerMessage,
        "Student id": student,
        "Student name": studentName,
        "Course id": subject,
        "Course name": courseName,
        "Deleted grade index": index,
      };

      res.json(result);
    } else {
      result =
`<result>
  <message>${headerMessage}</message>
  <student_id>${student}</student_id>
  <student_name>${studentName}</student_name>
  <course_id>${subject}</course_id>
  <course_name>${courseName}</course_name>
  <deleted_grade_index>${index}</deleted_grade_index>
</result>`;
      res.send(result);
    }
  }
});

async function prepareStudentsList() {
  await client.connect();
  const db = client.db("AGH");
  const collection = db.collection("project_students");
  students = await collection.find().toArray();
  await client.close();

  var studentsForm = document.getElementById("students_form");

  for (let student of students) {
    let studentDiv = document.createElement("div");
    let button = document.createElement("button");
    let text = document.createTextNode(`${student.name} (id studenta: ${student.id})`);

    button.setAttribute("type", "submit");
    button.setAttribute("form", "students_form");
    button.setAttribute("formmethod", "get");
    button.setAttribute("name", "student_id");
    button.setAttribute("value", `${student.id}`);

    button.classList.add("my_butt");

    studentDiv.setAttribute("id", `student_${student.id}`);

    button.appendChild(text);
    studentDiv.appendChild(button);
    studentsForm.appendChild(studentDiv);
  }
}

async function prepareCoursesList() {
  await client.connect();
  const db = client.db("AGH");
  const collection = db.collection("project_courses");
  courses = await collection.find().toArray();
  await client.close();

  var coursesList = document.getElementById("courses_list");

  for (let course of courses) {
    let courseLI = document.createElement("li");
    let text = document.createTextNode(`${course.name} (id przedmiotu: ${course.id})`);

    courseLI.appendChild(text);
    coursesList.appendChild(courseLI);
  }
}

async function prepareDict() {
  await client.connect();
  const db = client.db("AGH");
  const collection = db.collection("project_dict");
  dict = await collection.find().toArray();
  await client.close();
}

function findStudentNameById(id) {
  for (const record of students) {
    if (record["id"] === id) {
      return record["name"];
    }
  }
  return null;
}

function findCourseNameById(id) {
  for (const record of courses) {
    if (record["id"] === id) {
      return record["name"];
    }
  }
  return null;
}

function findGrades(s_id, c_id = null) {
  var gradesArray = [];
  var coursesId = [];

  for (const record of dict) {
    if (record["student_id"] === s_id && (c_id === null || record["course_id"] === c_id)) {
      coursesId.push(record["course_id"]);
      gradesArray.push(record["grades"]);
    }
  }

  var coursesNames = [];
  for (const record of courses) {
    if (coursesId.includes(record["id"])) {
      coursesNames.push(record["name"]);
    }
  }

  var toReturn = [];
  for (let i = 0; i < gradesArray.length; i++) {
    toReturn.push({ name : `${coursesNames[i]} (id: ${coursesId[i]})`, grades : gradesArray[i] });
  }
  return toReturn;
}

function inputTable(studentId, grades, headerMessage) {
  var html = dom.serialize().slice();
  var tempHtml = new JSDOM(html);
  var tempDocument = tempHtml.window.document;

  var div = tempDocument.getElementById(`student_${studentId}`);
  var table = tempDocument.createElement("table");
  table.classList.add("my_tab");

  var h1 = tempDocument.createElement("h1");
  h1.textContent = headerMessage;

  var header = tempDocument.createElement("tr");
  var th1 = tempDocument.createElement("th");
  var th2 = tempDocument.createElement("th");

  th1.classList.add("my_th");
  th2.classList.add("my_th");

  th1.textContent = "Przedmiot";
  th2.textContent = "Lista ocen";

  header.appendChild(th1);
  header.appendChild(th2);
  table.appendChild(header);

  for (const record of grades) {
    var row = tempDocument.createElement("tr");
    var td1 = tempDocument.createElement("td");
    var td2 = tempDocument.createElement("td");

    td1.textContent = `${record["name"]}`;
    td2.textContent = `${record["grades"].toString()}`;

    td1.classList.add("my_td");
    td2.classList.add("my_td");

    row.appendChild(td1);
    row.appendChild(td2);
    table.appendChild(row);
  }

  div.appendChild(h1);
  div.appendChild(table);
  return tempHtml.serialize();
}

async function serveAddParams(student_id, course_id, grade) {
  if (findStudentNameById(student_id) === null) {
    return null;
  }

  const possibleGrades = ["2.0", "3.0", "3.5", "4.0", "4.5", "5.0"];
  if (!possibleGrades.includes(grade)) {
    return null;
  }

  var grades = findGrades(student_id, course_id);
  if (grades.length === 0) {
    return null;
  }

  grades[0]["grades"].push(grade);

  await client.connect();
  const db = client.db("AGH");
  const collection = db.collection("project_dict");

  var toUpdate = await collection.find({ student_id: student_id, course_id: course_id }).toArray();
  toUpdate[0].grades.push(grade);

  const filter = { student_id: student_id, course_id: course_id };
  const updateDictDocument = {
    $set: {
      grades: toUpdate[0].grades
    },
  };

  await collection.updateOne(filter, updateDictDocument);
  await client.close();

  return grades;
}

async function serveModifyParams(student_id, course_id, grade, index) {
  if (isNaN(index)) {
    return null;
  }

  if (findStudentNameById(student_id) === null) {
    return null;
  }

  const possibleGrades = ["2.0", "3.0", "3.5", "4.0", "4.5", "5.0"];
  if (!possibleGrades.includes(grade)) {
    return null;
  }

  var grades = findGrades(student_id, course_id);
  if (
    grades.length === 0 ||
    index < 0 ||
    index >= grades[0]["grades"].length
  ) {
    return null;
  }

  grades[0]["grades"][index] = grade;

  await client.connect();
  const db = client.db("AGH");
  const collection = db.collection("project_dict");

  var toUpdate = await collection
    .find({
      student_id: student_id,
      course_id: course_id,
    })
    .toArray();
  toUpdate[0].grades[index] = grade;

  const filter = { student_id: student_id, course_id: course_id };
  const updateDictDocument = {
    $set: {
      grades: toUpdate[0].grades,
    },
  };

  await collection.updateOne(filter, updateDictDocument);
  await client.close();

  return grades;
}

async function serveDeleteParams(student_id, course_id, index) {
  if (isNaN(index)) {
    return null;
  }

  if (findStudentNameById(student_id) === null) {
    return null;
  }

  var grades = findGrades(student_id, course_id);
  if (grades.length === 0 || index < 0 || index >= grades[0]["grades"].length) {
    return null;
  }

  grades[0]["grades"].splice(index, 1);

  await client.connect();
  const db = client.db("AGH");
  const collection = db.collection("project_dict");

  var toUpdate = await collection
    .find({
      student_id: student_id,
      course_id: course_id,
    })
    .toArray();
  toUpdate[0].grades.splice(index, 1);

  const filter = { student_id: student_id, course_id: course_id };
  const updateDictDocument = {
    $set: {
      grades: toUpdate[0].grades,
    },
  };

  await collection.updateOne(filter, updateDictDocument);
  await client.close();

  return grades;
}


function runServer() {
  fs.readFile("src/index.html", async (err, data) => {
    if (err) {
      throw(err);
    }

    dom = new JSDOM(data);
    document = dom.window.document;

    await prepareStudentsList();
    await prepareCoursesList();
    await prepareDict();

    app.listen(8000, () => {
      console.log("The server was started on port 8000");
      console.log('To stop the server, press "CTRL + C"');
    });
  })
}

runServer();
