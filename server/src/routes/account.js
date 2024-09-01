import express from "express";
import * as server from "../lib/serverResponses.js";
import * as db from "../database.js";
// ! /chequings/account
export const accountRoute = express.Router();
// * GET /account/balance
accountRoute.get("/balance", async (req, res) => {
    try {
        const { transactionListParams, accounts } = req.query;
        const balance = await db.Account.balance(accounts, transactionListParams);
        server.successWithData(res, "Successfully fetched account balance", parseFloat(balance.toFixed(2)));
    }
    catch (err) {
        server.fail(res, err);
    }
});
