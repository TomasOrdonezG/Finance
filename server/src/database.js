import { pool } from "./config.js";
import { throwSQLQueryError } from "./models.js";
import { throwErr } from "./lib/handleErrors.js";
// !!! Functions that interact with SQL database
const TABLENAME = "transactions";
function getFilterSQL(accounts, filters) {
    let filterSQL = "WHERE (" + accounts.map((account) => pool.format("account = ?", [account])).join("OR ") + ") AND ";
    if (filters) {
        // * Create SQL filter strings from object
        const { type, category, counterparty, notes, date } = filters;
        if (type) {
            filterSQL += pool.format(`type = ? AND `, [type]);
        }
        if (counterparty) {
            filterSQL += pool.format(" (counterparty LIKE CONCAT('%', ?, '%'))", [counterparty]) + " AND ";
        }
        if (category) {
            filterSQL += pool.format(" (category LIKE CONCAT('%', ?, '%'))", [category]) + " AND ";
        }
        if (notes) {
            filterSQL += pool.format(" (notes LIKE CONCAT('%', ?, '%'))", [notes]) + " AND ";
        }
        if (date) {
            if (date.min) {
                filterSQL += pool.format(`(date >= ?) AND `, [date.min]);
            }
            if (date.max) {
                filterSQL += pool.format(`(date <= ?) AND `, [date.max]);
            }
        }
    }
    // * Join filter conditions
    return filterSQL + "1 = 1 ";
}
export class Transactions {
    static async get(accounts, transactionListParams) {
        if (transactionListParams) {
            const { order, page } = transactionListParams;
            // * Query the database
            const filterSQL = getFilterSQL(accounts, transactionListParams.filters);
            const sql = `SELECT * FROM ${TABLENAME} ${filterSQL}ORDER BY ${order.by} ${order.sort === "descending" ? "DESC" : "ASC"} LIMIT ? OFFSET ?;`;
            const values = [Number(page.limit), Number(page.offset)];
            const response = await pool.query(sql, values).catch((err) => throwSQLQueryError(err, sql, values));
            return response[0];
        }
        else {
            const sql = `SELECT * FROM ${TABLENAME}`;
            const response = await pool.query(sql).catch((err) => throwSQLQueryError(err, sql));
            return response[0];
        }
    }
    static async count(accounts) {
        const filterSQL = getFilterSQL(accounts);
        const sql = `SELECT COUNT(*) AS row_count FROM ${TABLENAME} ${filterSQL};`;
        const response = await pool.query(sql).catch((err) => throwSQLQueryError(err, sql));
        const numberOfTransactions = Number(response[0][0]["row_count"]);
        return numberOfTransactions;
    }
}
export class Transaction {
    static async new(newTransaction) {
        const sql = `INSERT INTO ${TABLENAME} (account, date, type, amount, category, counterparty, notes) VALUES (?, ?, ?, ?, ?, ?, ?);`;
        const values = [
            newTransaction.account,
            newTransaction.date,
            newTransaction.type,
            newTransaction.amount,
            newTransaction.category,
            newTransaction.counterparty,
            newTransaction.notes,
        ];
        await pool.query(sql, values).catch((err) => throwSQLQueryError(err, sql, values));
    }
    static async get(id) {
        const sql = `SELECT * FROM ${TABLENAME} WHERE id = ?`;
        const values = [id];
        const response = await pool.query(sql, values).catch((err) => throwSQLQueryError(err, sql, values));
        return response[0][0];
    }
    static async edit(id, newTransactionData) {
        const sql = `UPDATE ${TABLENAME} SET date = ?, type = ?, amount = ?, category = ?, counterparty = ?, notes = ? WHERE id = ${id};`;
        const values = [
            newTransactionData.date,
            newTransactionData.type,
            newTransactionData.amount,
            newTransactionData.category,
            newTransactionData.counterparty,
            newTransactionData.notes,
        ];
        await pool.query(sql, values).catch((err) => throwSQLQueryError(err, sql, values));
    }
    static async delete(id) {
        const sql = `DELETE FROM ${TABLENAME} WHERE id = ?`;
        const values = [id];
        const transaction = await this.get(id).catch(throwErr);
        await pool.query(sql, values).catch((err) => throwSQLQueryError(err, sql, values));
        return transaction;
    }
}
export class Account {
    static async balance(accounts, transactionListParams) {
        const total = async (type) => {
            const sql = `SELECT SUM(amount) as total FROM ${TABLENAME} WHERE type = ? ${getFilterSQL(accounts, transactionListParams.filters).replace("WHERE", "AND")};`;
            const response = await pool.query(sql, [type]).catch((err) => throwSQLQueryError(err, sql, [type]));
            return response[0][0]["total"];
        };
        return (await total("income").catch(throwErr)) - (await total("expense").catch(throwErr));
    }
}
