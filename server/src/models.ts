import { pool } from "./config.js";

// #region General types
export type NumericalString = `${number}`;
export type BooleanString = "true" | "false";
// #endregion

// #region Transactions
export type Transaction = {
  id: number;
  account: string;
  date: string;
  type: "expense" | "income";
  amount: number;
  category: string;
  counterparty: string;
  notes: string;
};
export type TransactionParams = Omit<Transaction, "id">;
export type TransactionAccounts = string[];

// * List params
export type TransactionListParams = {
  page: {
    limit: number;
    offset: number;
  };
  order: {
    sort: "ascending" | "descending";
    by: keyof Transaction;
  };
  filters?: {
    type?: "income" | "expense";
    category?: string;
    counterparty?: string;
    notes?: string;
    amount?: {
      min?: number;
      max?: number;
    };
    date?: {
      min?: string;
      max?: string;
    };
  };
};
// #endregion

// #region Database
export type SQLQueryError = {
  message: string;
};
export function throwSQLQueryError(err: Error, sql: string, values?: (string | number)[]): never {
  throw {
    message: `${err.message}      ### Query given ###: ${values ? pool.format(sql, values) : sql}`,
  } as SQLQueryError;
}
// #endregion

// #region Server
export type ServerResponseWithData<ResponseData> = {
  message: string;
  content: ResponseData;
};
export type ServerResponseNoData = Omit<ServerResponseWithData<null>, "content">;
// #endregion
