import express, { Express, Request, Response } from "npm:express@^4";

import {
  MongoClient,
  ObjectId,
  Database,
  Collection,
} from "https://deno.land/x/mongo@v0.32.0/mod.ts";

import "npm:pug@^3";
import morgan from "npm:morgan@^1";

const app: Express = express();
const client: MongoClient = new MongoClient();

await client.connect(
  "mongodb+srv://<login>:<password>@aghcluster.ulbcupz.mongodb.net?authMechanism=SCRAM-SHA-1"
);
const db: Database = client.database("AGH");

interface UserSchema {
  _id: ObjectId;
  name: string;
  comment: string;
}

app.set("view engine", "pug");
app.locals.pretty = app.get("env") === "development";

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));

app.get("/", async function (_req: Request, res: Response) { 
  const collection: Collection<UserSchema> = db.collection<UserSchema>("guests");
  const guests: UserSchema[] = await collection.find().toArray();
  res.render("guestbook", { guests });
});

app.post("/", async function (req: Request, res: Response) {
  const name: string = req.body.name;
  const area: string = req.body.area
    .replace("\r", "")
    .split("\n")
    .join(" ");

  const collection: Collection<UserSchema> = db.collection<UserSchema>("guests");
  const _insertId: ObjectId = await collection.insertOne({
    name: name,
    comment: area,
  });

  res.set({ "content-type": "text/plain; charset=utf-8" });
  res.write("Dodano wpis!\n");
  res.write(`Imię i nazwisko: ${name}\n`);
  res.write(`Treść wpisu: ${area}\n`);
  res.end();
});


app.listen(8000, function () {
  console.log("The application is available on port 8000");
});
