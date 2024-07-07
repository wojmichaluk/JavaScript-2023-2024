import {
  Application,
  Router,
  Context,
} from "https://deno.land/x/oak/mod.ts";

import {
  dejsEngine,
  oakAdapter,
  viewEngine,
} from "https://deno.land/x/view_engine/mod.ts";

import {
  MongoClient,
  ObjectId,
  Database,
  Collection,
} from "https://deno.land/x/mongo@v0.32.0/mod.ts";

import logger from "https://deno.land/x/oak_logger/mod.ts";

const app: Application = new Application();
const router: Router = new Router({});
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

app.use(logger.logger);
app.use(logger.responseTime);
app.use(viewEngine(oakAdapter, dejsEngine, { viewRoot: "./views" }));

router.get("/", async (ctx: Context) => {
  const collection: Collection<UserSchema> = db.collection<UserSchema>("guests_alt");
  const guests: UserSchema[] = await collection.find().toArray();
  await ctx.render("guestbook_alt.ejs", { guests });
});

router.post("/", async (ctx: Context) => {
  const reqBodyValue: URLSearchParams = await ctx.request.body.form();
  const name: string|null = reqBodyValue.get("name");
  const area: string|null = reqBodyValue.get("area")
  
  if (name && area) {
    area.replace("\r", "").split("\n").join(" ");
    const collection: Collection<UserSchema> =
      db.collection<UserSchema>("guests_alt");
    const _insertId: ObjectId = await collection.insertOne({
      name: name,
      comment: area,
    });

    ctx.response.body = "Dodano wpis!\n";
    ctx.response.body += `Imię i nazwisko: ${name}\n`;
    ctx.response.body += `Treść wpisu: ${area}\n`;
  } else {
    ctx.response.body = "Błędne dane z formularza!\n";
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

console.log("App is listening to port: 8000");
await app.listen({ port: 8000 });
