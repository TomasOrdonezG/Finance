import { RowDataPacket } from "mysql2";
import { pool } from "./config.js";
import { Transaction as TransactionType, TransactionParams, throwSQLQueryError, TransactionListParams, TransactionAccounts } from "./models.js";
import { throwErr } from "./lib/handleErrors.js";

// !!! Functions that interact with SQL database

const TABLENAME = "transactions";

function getFilterSQL(accounts: TransactionAccounts, filters?: TransactionListParams["filters"]): string {
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
  public static async get(accounts: TransactionAccounts, transactionListParams: TransactionListParams | undefined): Promise<TransactionType[]> {
    if (transactionListParams) {
      const { order, page } = transactionListParams;
      // * Query the database
      const filterSQL = getFilterSQL(accounts, transactionListParams.filters);
      const sql = `SELECT * FROM ${TABLENAME} ${filterSQL}ORDER BY ${order.by} ${order.sort === "descending" ? "DESC" : "ASC"} LIMIT ? OFFSET ?;`;
      const values = [Number(page.limit), Number(page.offset)];
      const response = await pool.query(sql, values).catch((err) => throwSQLQueryError(err, sql, values));
      return response[0] as TransactionType[];
    } else {
      const sql = `SELECT * FROM ${TABLENAME}`;
      const response = await pool.query(sql).catch((err) => throwSQLQueryError(err, sql));
      return response[0] as TransactionType[];
    }
  }

  public static async count(accounts: TransactionAccounts): Promise<number> {
    const filterSQL = getFilterSQL(accounts);
    const sql = `SELECT COUNT(*) AS row_count FROM ${TABLENAME} ${filterSQL};`;
    const response = await pool.query<RowDataPacket[]>(sql).catch((err) => throwSQLQueryError(err, sql));
    const numberOfTransactions = Number(response[0][0]["row_count"]);
    return numberOfTransactions;
  }
}

export class Transaction {
  public static async new(newTransaction: TransactionParams): Promise<void> {
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

  public static async get(id: number): Promise<TransactionType> {
    const sql = `SELECT * FROM ${TABLENAME} WHERE id = ?`;
    const values = [id];
    const response = await pool.query<RowDataPacket[]>(sql, values).catch((err) => throwSQLQueryError(err, sql, values));
    return response[0][0] as TransactionType;
  }

  public static async edit(id: number, newTransactionData: TransactionParams): Promise<void> {
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

  public static async delete(id: number): Promise<TransactionType> {
    const sql = `DELETE FROM ${TABLENAME} WHERE id = ?`;
    const values = [id];
    const transaction = await this.get(id).catch(throwErr);
    await pool.query(sql, values).catch((err) => throwSQLQueryError(err, sql, values));
    return transaction;
  }
}

export class Account {
  public static async balance(accounts: TransactionAccounts, transactionListParams: TransactionListParams): Promise<number> {
    const total = async (type: "income" | "expense"): Promise<number> => {
      const sql = `SELECT SUM(amount) as total FROM ${TABLENAME} WHERE type = ? ${getFilterSQL(accounts, transactionListParams.filters).replace(
        "WHERE",
        "AND"
      )};`;
      const response = await pool.query<RowDataPacket[]>(sql, [type]).catch((err) => throwSQLQueryError(err, sql, [type]));
      return response[0][0]["total"] as number;
    };
    return (await total("income").catch(throwErr)) - (await total("expense").catch(throwErr));
  }
}
