import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { transactionsRoute } from "./routes/transactions.js";
import { accountRoute } from "./routes/account.js";
// Init app
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/transactions", transactionsRoute);
app.use("/account", accountRoute);
app.listen(process.env.PORT, () => {
    console.log(`Running on port ${process.env.PORT}`);
});
