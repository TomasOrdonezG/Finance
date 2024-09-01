import express from "express";
import * as server from "../lib/serverResponses.js";
import * as db from "../database.js";
// ! chequings/transactions
export const transactionsRoute = express.Router();
transactionsRoute
    .route("/")
    .post(async (req, res) => {
    const newTransaction = req.body;
    await db.Transaction.new(newTransaction).catch((err) => server.fail(res, err));
    server.successNoData(res, "Transaction added succesfully!");
})
    .get(async (req, res) => {
    try {
        const { transactionListParams, accounts } = req.query;
        const transactions = await db.Transactions.get(accounts, transactionListParams);
        server.successWithData(res, "Transactions fetched successfully", transactions);
    }
    catch (err) {
        server.fail(res, err);
    }
});
transactionsRoute
    .route("/amount")
    .get(async (req, res) => {
    try {
        const { accounts } = req.query;
        const amount = await db.Transactions.count(accounts);
        server.successWithData(res, "Successfully fetched amount of transactions", amount);
    }
    catch (err) {
        server.fail(res, err);
    }
});
transactionsRoute
    .route("/:id")
    .get(async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await db.Transaction.get(Number(id));
        server.successWithData(res, `Successfully fetched transaction with id ${id}`, transaction);
    }
    catch (err) {
        server.fail(res, err);
    }
})
    .put(async (req, res) => {
    const { id } = req.params;
    const newTransactionData = req.body;
    await db.Transaction.edit(Number(id), newTransactionData).catch((err) => server.fail(res, err));
    server.successNoData(res, "New transaction added successfully");
})
    .delete(async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTransaction = await db.Transaction.delete(Number(id));
        server.successWithData(res, `Successfully deleted transaction with id ${id}`, deletedTransaction);
    }
    catch (err) {
        server.fail(res, err);
    }
});
