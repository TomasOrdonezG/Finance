import axios from "axios";
import {
  Transaction as TransactionType,
  ServerResponseNoData,
  ServerResponseWithData,
  TransactionParams,
  TransactionListParams,
  TransactionAccounts,
} from "./models";
import { throwErr } from "./lib/ErrorHandling";
import { BACKEND_URL } from "./config";

// ! Backend urls
export const TRANSACTIONS_URL = `${BACKEND_URL}/transactions`;
export const ACCOUNT_URL = `${BACKEND_URL}/account`;

export class Transactions {
  static async get(accounts: TransactionAccounts, transactionListParams?: TransactionListParams): Promise<TransactionType[]> {
    const response = await axios
      .get<ServerResponseWithData<TransactionType[]>>(TRANSACTIONS_URL, {
        params: { transactionListParams: transactionListParams, accounts: accounts },
      })
      .catch(throwErr);
    const newTransactions = response.data.content;
    return newTransactions;
  }

  static async count(accounts: TransactionAccounts): Promise<number> {
    const response = await axios
      .get<ServerResponseWithData<number>>(`${TRANSACTIONS_URL}/amount`, {
        params: { accounts: accounts },
      })
      .catch(throwErr);
    const amount = response.data.content;
    return amount;
  }
}

export class Transaction {
  static async new(transactionParams: TransactionParams): Promise<void> {
    await axios.post<ServerResponseNoData>(TRANSACTIONS_URL, transactionParams).catch(throwErr);
  }

  static async get(id: number): Promise<TransactionType> {
    const response = await axios.get<ServerResponseWithData<TransactionType>>(`${TRANSACTIONS_URL}/${id}`).catch(throwErr);
    const transaction = response.data.content;
    return transaction;
  }

  static async edit(id: number, transactionParams: TransactionParams): Promise<void> {
    await axios.put<ServerResponseNoData>(`${TRANSACTIONS_URL}/${id}`, transactionParams).catch(throwErr);
  }

  static async delete(id: number): Promise<TransactionType> {
    const response = await axios.delete<ServerResponseWithData<TransactionType>>(`${TRANSACTIONS_URL}/${id}`).catch(throwErr);
    const transaction = response.data.content;
    return transaction;
  }
}

export class Account {
  static async balance(accounts: TransactionAccounts, transactionListParams: TransactionListParams): Promise<number> {
    const response = await axios
      .get<ServerResponseWithData<number>>(`${ACCOUNT_URL}/balance`, {
        params: { transactionListParams: transactionListParams, accounts: accounts },
      })
      .catch(throwErr);
    const accountBalance = response.data.content;
    return accountBalance;
  }
}
