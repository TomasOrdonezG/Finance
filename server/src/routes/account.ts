import express, { Response, Request } from "express";
import * as server from "../lib/serverResponses.js";
import * as db from "../database.js";
import { ServerResponseWithData, TransactionAccounts, TransactionListParams } from "../models.js";

// ! /chequings/account
export const accountRoute = express.Router();

// * GET /account/balance
accountRoute.get(
  "/balance",
  async (
    req: Request<{}, {}, {}, { transactionListParams: TransactionListParams; accounts: TransactionAccounts }>,
    res: Response<ServerResponseWithData<number>>
  ) => {
    try {
      const { transactionListParams, accounts } = req.query;
      const balance = await db.Account.balance(accounts, transactionListParams);
      server.successWithData<number>(res, "Successfully fetched account balance", parseFloat(balance.toFixed(2)));
    } catch (err) {
      server.fail(res, err);
    }
  }
);
