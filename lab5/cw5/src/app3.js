/**
 * @author Stanisław Polak <polak@agh.edu.pl>
 */

import express from "express";
import morgan from "morgan";
import * as mongodb from "mongodb";

/* *************************** */
/* Configuring the application */
/* *************************** */
const app = express();
app.locals.pretty = app.get("env") === "development"; // The resulting HTML code will be indented in the development environment

/* ************************************************ */

app.set("view engine", "pug");
app.use(express.static("public"));
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));

/* ******** */
/* "Routes" */
/* ******** */

/* ------------- */
/* Route 'GET /' */
/* ------------- */
app.get("/", async (request, response) => {
  const MongoClient = mongodb.default.MongoClient; 
  const client = new MongoClient(
    "mongodb+srv://<login>:<password>@aghcluster.ulbcupz.mongodb.net/?retryWrites=true&w=majority"
  );
  await client.connect();
  const db = client.db('AGH');
  const collection = db.collection('students');
  const students = await collection.find().toArray();
  response.render("index", { students }); // Render the 'index' view
  client.close();
});

/* ------------- */
/* Route 'GET /<faculty>' */
/* ------------- */
app.get("/:faculty", async (request, response) => {
  const MongoClient = mongodb.default.MongoClient; 
  const client = new MongoClient(
    "mongodb+srv://wojmichaluk:Nowaeragalaxy+2@aghcluster.ulbcupz.mongodb.net/?retryWrites=true&w=majority"
  );
  await client.connect();
  const db = client.db('AGH');
  const collection = db.collection('students');
  const students = await collection.find({ faculty: `${request.params.faculty}` }).toArray();
  response.render("index", { students }); // Render the 'index' view
  client.close();
});

/* ------------------- */
/* Route 'GET /submit' */
/* ------------------- */
app.get("/submit", (request, response) => {
  // Processing the form content, if the relative URL is '/submit', and the GET method was used to send data to the server'
  /* ************************************************** */
  // Setting an answer header — we inform the browser that the returned data is plain text
  response.set("Content-Type", "text/plain");
  /* ************************************************** */
  // Place given data (here: 'Hello <name>') in the body of the answer
  response.send(`Hello ${request.query.name}`); // Send a response to the browser
});


/* ------------------- */
/* Route 'POST /' */
/* ------------------- */
app.post("/", (request, response) => {
  // Processing the form content, if the relative URL is '/', and the POST method was used to send data to the server'
  /* ************************************************** */
  // Setting an answer header — we inform the browser that the returned data is plain text
  response.set("Content-Type", "text/plain");
  /* ************************************************** */
  // Place given data (here: 'Hello <name>') in the body of the answer
  response.send(`Hello ${request.body.name}`); // Send a response to the browser
});

/* ************************************************ */

app.listen(8000, () => {
  console.log("The server was started on port 8000");
  console.log('To stop the server, press "CTRL + C"');
});
