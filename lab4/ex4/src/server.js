import fs from "node:fs";
import http from "node:http";
import { URL } from "node:url";
import { JSDOM } from "jsdom";

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

function prepareStudentsList() {
  fs.readFile("src/data/students.txt", (err, data) => {
    if (err) {
      throw err;
    }

    data = data
      .toString()
      .replace(/(\r\n|\n|\r)/gm, "\n");
    const data_array = data.split("\n");
    students = [];

    var student_id;
    var student_name;
    var selectList = document.getElementById("students_list");

    for (let i = 0; i < data_array.length; i++) {
      switch (i % 3) {
        case 0:
          student_id = Number(data_array[i]);
          break;

        case 1:
          student_name = data_array[i];
          break;

        default:
          students.push({ id: student_id, name: student_name });
          break;
      }
    }

    for (let student of students) {
      let option = document.createElement("option");
      let text = document.createTextNode(student.name);

      option.setAttribute("value", student.id);
      option.appendChild(text);
      selectList.appendChild(option);
    }
  });
}

function prepareCoursesList() {
  fs.readFile("src/data/courses.txt", (err, data) => {
    if (err) {
      throw err;
    }

    data = data
      .toString()
      .replace(/(\r\n|\n|\r)/gm, "\n");
    const data_array = data.split("\n");
    courses = [];

    let course_id;
    let course_name;

    for (let i = 0; i < data_array.length; i++) {
      switch (i % 3) {
        case 0:
          course_id = Number(data_array[i]);
          break;

        case 1:
          course_name = data_array[i];
          break;

        default:
          courses.push({ id: course_id, name: course_name });
          break;
      }
    }
  });
}

function prepareDict() {
  fs.readFile("src/data/dict.txt", (err, data) => {
    if (err) {
      throw err;
    }

    data = data
      .toString()
      .replace(/(\r\n|\n|\r)/gm, "\n");
    const data_array = data.split("\n");
    dict = [];

    let student_id;
    let course_id;
    let grades;

    for (let i = 0; i < data_array.length; i++) {
      switch (i % 4) {
        case 0:
          student_id = Number(data_array[i]);
          break;

        case 1:
          course_id = Number(data_array[i]);
          break;

        case 2:
          grades = data_array[i].split(" ");
          break;

        default:
          dict.push({
            student_id: student_id,
            course_id: course_id,
            grades: grades,
          });
          break;
      }
    }
  });
}

function modifyDictFile(data, params, mode) {
  var rows = data
    .toString()
    .replace(/(\r\n|\n|\r)/gm, "\n")
    .split("\n");
  var records = rows.length / 4;
  var [student_id, course_id, grade, index] = params;

  for (let i = 0; i < records; i++) {
    var curr_sid = rows[4 * i];
    var curr_cid = rows[4 * i + 1];
    var curr_grades = rows[4 * i + 2];

    if (student_id === curr_sid && course_id === curr_cid) {
      if (mode === "add") {
        curr_grades = curr_grades + " " + grade;
        rows[4 * i + 2] = curr_grades;
      } else if (mode === "modify") {
        let currGradesArray = curr_grades.split(" ");
        currGradesArray[index] = grade;
        rows[4 * i + 2] = currGradesArray.join(" ");
      } else {
        let currGradesArray = curr_grades.split(" ");
        currGradesArray.splice(Number(index), 1);
        rows[4 * i + 2] = currGradesArray.join(" ");
      }
    }
  }

  return rows.join("\n");
}

function getPrefix(url) {
  if (url.startsWith("GET /images/")) {
    return "GET /images/"
  } else {
    return url;
  }
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

function parseParams(str) {
  var tableParams = str.split("&");
  for (let i = 0; i < tableParams.length; i++) {
    tableParams[i] = tableParams[i].split("=");
  }

  var toRet = [];
  for (let param of tableParams) {
      toRet.push(param.slice(1).join(""));
  }

  return toRet;
}

function addServeParams(params) {
  var [student_id, course_id, grade, index] = params; //index is not important here
  if (findStudentNameById(Number(student_id)) === null) {
    return null;
  }

  const possibleGrades = ["2.0", "3.0", "3.5", "4.0", "4.5", "5.0"];
  if (!possibleGrades.includes(grade)) {
    return null;
  }

  var grades = findGrades(Number(student_id), Number(course_id));
  if (grades.length === 0) {
    return null;
  }

  grades[0]["grades"].push(grade);
  fs.readFile("src/data/dict.txt", (err, data) => {
    if (err) {
      throw(err);
    }

    var newData = modifyDictFile(data, params, "add");
    fs.writeFile("src/data/dict.txt", newData, (errw) => {
      if (errw) {
        throw(errw);
      }
    });
  });

  return grades;
}

function modifyServeParams(params) {
    var [student_id, course_id, grade, index] = params;
    if (isNaN(Number(index)) || index === "") {
      return null;
    }

    if (findStudentNameById(Number(student_id)) === null) {
      return null;
    }

    const possibleGrades = ["2.0", "3.0", "3.5", "4.0", "4.5", "5.0"];
    if (!possibleGrades.includes(grade)) {
      return null;
    }

    var grades = findGrades(Number(student_id), Number(course_id));
    if (grades.length === 0 || Number(index) < 0 || Number(index) >= grades[0]["grades"].length) {
      return null;
    }

    grades[0]["grades"][Number(index)] = grade;
    fs.readFile("src/data/dict.txt", (err, data) => {
      if (err) {
        throw err;
      }

      var newData = modifyDictFile(data, params, "modify");
      fs.writeFile("src/data/dict.txt", newData, (errw) => {
        if (errw) {
          throw errw;
        }
      });
    });

    return grades;
}

function deleteServeParams(params) {
  var [student_id, course_id, grade, index] = params;
  if (isNaN(Number(index)) || index === "") {
    return null;
  }

  if (findStudentNameById(Number(student_id)) === null) {
    return null;
  }

  var grades = findGrades(Number(student_id), Number(course_id));
  if (grades.length === 0 || Number(index) < 0 || Number(index) >= grades[0]["grades"].length) {
    return null;
  }

  grades[0]["grades"].splice(Number(index), 1);
  fs.readFile("src/data/dict.txt", (err, data) => {
    if (err) {
      throw err;
    }

    var newData = modifyDictFile(data, params, "delete");
    fs.writeFile("src/data/dict.txt", newData, (errw) => {
      if (errw) {
        throw errw;
      }
    });
  });

  return grades;
}

function requestListener(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  var body;

  const prefix = getPrefix([req.method, url.pathname].join(" "));
  const whole = [req.method, url.pathname].join(" ");

  if (url.pathname !== "/favicon.ico") {
    console.log(whole);
  }

  switch (prefix) {
    case "GET /":
    case "GET /favicon.ico":
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.write(dom.serialize());
      res.end();

      break;

    case "GET /images/":
      var pathname = whole.substring(4);

      fs.readFile(`src${pathname}`, function (err, image) {
        if (err) {
          throw err;
        }

        res.setHeader("Content-Type", "image/jpg");
        res.setHeader("Content-Length", "");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.write(image);
        res.end();
      });

      break;

    case "POST /subject":
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });

      body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", () => {
        var student_id = Number(body.split("=")[1]);
        var studentName = findStudentNameById(student_id);
        if (studentName === null) {
          res.end(htmlTemplate);
        }

        var grades = findGrades(student_id);
        var headerMessage = `Wykaz ocen dla studenta ${studentName} (id: ${student_id})`;
        var titleMessage = "Wykaz ocen"; 

        var table = buildTable(grades, headerMessage, titleMessage);
        res.end(table);
      });

      break;

    case "POST /add":
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });

      body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", () => {
        var params = parseParams(body);
        var paramsServed = addServeParams(params);

        if (paramsServed === null) {
          res.end(htmlTemplate);
        } else {
          var studentName = findStudentNameById(Number(params[0]));
          var courseName = findCourseNameById(Number(params[1]));
          var headerMessage = `Dodano ocenę: ${params[2]} studentowi ${studentName} (id: ${params[0]}) z przedmiotu ${courseName} (id: ${params[1]})`;
          var titleMessage = "Dodano ocenę";

          var table = buildTable(paramsServed, headerMessage, titleMessage);
          res.end(table);
        }
      });

      break;

    case "POST /modify":
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });

      body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", () => {
        var params = parseParams(body);
        var paramsServed = modifyServeParams(params);

        if (paramsServed === null) {
          res.end(htmlTemplate);
        } else {
          var studentName = findStudentNameById(Number(params[0]));
          var courseName = findCourseNameById(Number(params[1]));
          var headerMessage = `Zmodyfikowano ocenę o indeksie: ${params[3]} na: ${params[2]} studentowi ${studentName} (id: ${params[0]}) z przedmiotu ${courseName} (id: ${params[1]})`;
          var titleMessage = "Zmodyfikowano ocenę";

          var table = buildTable(paramsServed, headerMessage, titleMessage);
          res.end(table);
        }
      });

      break;

    case "POST /delete":
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });

      body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", () => {
        var params = parseParams(body);
        var paramsServed = deleteServeParams(params);

        if (paramsServed === null) {
          res.end(htmlTemplate);
        } else {
          var studentName = findStudentNameById(Number(params[0]));
          var courseName = findCourseNameById(Number(params[1]));
          var headerMessage = `Usunięto dawną ocenę o indeksie: ${params[3]} studentowi ${studentName} (id: ${params[0]}) z przedmiotu ${courseName} (id: ${params[1]})`;
          var titleMessage = "Usunięto ocenę";

          var table = buildTable(paramsServed, headerMessage, titleMessage);
          res.end(table);
        }
      });

      break;

    default:
      res.writeHead(501, { "Content-Type": "text/plain; charset=utf-8" });
      res.write("Error 501: Not implemented");
      res.end();

      break;
  }
}

function runServer() {
  fs.readFile("src/index.html", (err, data) => {
    if (err) {
      throw(err);
    }

    dom = new JSDOM(data);
    document = dom.window.document;

    prepareStudentsList();
    prepareCoursesList();
    prepareDict();

    const server = http.createServer(requestListener);
    server.listen(8000);
    console.log("The server was started on port 8000");
    console.log('To stop the server, press "CTRL + C"');
  })
}

runServer();
