import 'dotenv/config'
import process from "node:process";
import connection from "./postgres/connect";
import app from "./server";

const PORT = process.env.PORT || 4242

connection.connect().then().catch((err) => {
  console.log(err);
  process.exit(1);
})

app.listen(PORT);
