import express from "express";
import jwt from "jsonwebtoken";
import cors from "cors";
import bodyParser from "body-parser";
import router from "./router/auth";

const app = express();
const PORT = 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(
  cors({
    credentials: true,
  })
);

app.use(router);

app.listen(PORT, () => {
  console.log(`server running in PORT: ${PORT}`);
});
