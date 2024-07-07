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

const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Error: invalid form data</title>
  <style>
    td {
        border: 1px solid #000; 
        padding: 15px;
        text-align: left;
    }
    th {
        background-color: #04AA6D;
        padding: 8px;
        color: white;
    }
  </style>
  </head>
  <body>
    <h1>Error: invalid form data</h1>
  </body>
</html>`;

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

studentRouter.post('/', (req, res) => {
  var student_id = Number(req.body.student_id);
  var studentName = findStudentNameById(student_id);

  if (studentName === null) {
    res.send(htmlTemplate);
  }

  var grades = findGrades(student_id);
  var headerMessage = `Wykaz ocen dla studenta ${studentName} (id: ${student_id})`;
  var titleMessage = "Wykaz ocen";

  var table = buildTable(grades, headerMessage, titleMessage);
  res.send(table);
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
  res.set("Content-Type", "text/html; charset=utf-8");

  var student = Number(req.body.student);
  var subject = Number(req.body.subject);
  var grade = req.body.grade;

  var paramsServed = await serveAddParams(student, subject, grade);

  if (paramsServed === null) {
    res.send(htmlTemplate);
  } else {
    var studentName = findStudentNameById(student);
    var courseName = findCourseNameById(subject);
    var headerMessage = `Dodano ocenę: ${grade} studentowi ${studentName} (id: ${student}) z przedmiotu ${courseName} (id: ${subject})`;
    var titleMessage = "Dodano ocenę";

    var table = buildTable(paramsServed, headerMessage, titleMessage);
    res.send(table);
  }
});

teacherRouter.post("/modify", async (req, res) => {
  res.set("Content-Type", "text/html; charset=utf-8");

  var student = Number(req.body.student);
  var subject = Number(req.body.subject);
  var grade = req.body.grade;
  var index = Number(req.body.index);

  var paramsServed = await serveModifyParams(student, subject, grade, index);

  if (paramsServed === null) {
    res.send(htmlTemplate);
  } else {
    var studentName = findStudentNameById(student);
    var courseName = findCourseNameById(subject);
    var headerMessage = `Zmodyfikowano ocenę o indeksie: ${index} na: ${grade} studentowi ${studentName} (id: ${student}) z przedmiotu ${courseName} (id: ${subject})`;
    var titleMessage = "Zmodyfikowano ocenę";

    var table = buildTable(paramsServed, headerMessage, titleMessage);
    res.send(table);
  }
});

teacherRouter.post("/delete", async (req, res) => {
  res.set("Content-Type", "text/html; charset=utf-8");

  var student = Number(req.body.student);
  var subject = Number(req.body.subject);
  var index = Number(req.body.index);

  var paramsServed = await serveDeleteParams(student, subject, index);

  if (paramsServed === null) {
    res.send(htmlTemplate);
  } else {
    var studentName = findStudentNameById(student);
    var courseName = findCourseNameById(subject);
    var headerMessage = `Usunięto dawną ocenę o indeksie: ${index} studentowi ${studentName} (id: ${student}) z przedmiotu ${courseName} (id: ${subject})`;
    var titleMessage = "Usunięto ocenę";

    var table = buildTable(paramsServed, headerMessage, titleMessage);
    res.send(table);
  }
});

async function prepareStudentsList() {
  await client.connect();
  const db = client.db("AGH");
  const collection = db.collection("project_students");
  students = await collection.find().toArray();
  await client.close();

  var selectList = document.getElementById("students_list");

  for (let student of students) {
    let option = document.createElement("option");
    let text = document.createTextNode(student.name);

    option.setAttribute("value", student.id);
    option.appendChild(text);
    selectList.appendChild(option);
  }
}

async function prepareCoursesList() {
  await client.connect();
  const db = client.db("AGH");
  const collection = db.collection("project_courses");
  courses = await collection.find().toArray();
  await client.close();
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

function buildTable(grades, headerMessage, titleMessage) {
  var html = htmlTemplate.slice();
  var tempHtml = new JSDOM(html);
  var tempDocument = tempHtml.window.document;

  var body = tempDocument.getElementsByTagName("body")[0];
  var head = tempDocument.getElementsByTagName("head")[0];
  var table = tempDocument.createElement("table");

  var h1 = body.getElementsByTagName("h1")[0];
  h1.textContent = headerMessage;

  var title = head.getElementsByTagName("title")[0];
  title.textContent = titleMessage;

  var header = tempDocument.createElement("tr");
  var th1 = tempDocument.createElement("th");
  var th2 = tempDocument.createElement("th");

  th1.textContent = "Przedmiot";
  th1.style.fontWeight = "bold";
  th2.textContent = "Lista ocen";
  th2.style.fontWeight = "bold";

  header.appendChild(th1);
  header.appendChild(th2);
  table.appendChild(header);

  for (const record of grades) {
    var row = tempDocument.createElement("tr");
    var td1 = tempDocument.createElement("td");
    var td2 = tempDocument.createElement("td");

    td1.textContent = `${record["name"]}`;
    td2.textContent = `${record["grades"].toString()}`;

    row.appendChild(td1);
    row.appendChild(td2);
    table.appendChild(row);
  }

  body.appendChild(table);
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
