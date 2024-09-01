import React, { createContext, useEffect, useState } from "react";
import TransactionDisplay from "./components/TransactionDisplay/TransactionDisplay";
import { privateData } from "../../config";
import { Transaction, TransactionListParams } from "../../models";
import * as db from "../../database";
import Menu from "./components/Menu/Menu";
import { useFetch } from "../../hooks";
import { useLocation } from "react-router-dom";

// * Constants
export const defaultTransactionListParams: TransactionListParams = {
  page: {
    limit: 10,
    offset: 0,
  },
  order: {
    sort: "descending",
    by: "date",
  },
};

// * Context
// #region
interface TransactionsPageContextType {
  pagedTransactions: Transaction[];
  allTransactions: Transaction[];
  transactionListParams: TransactionListParams;
  setTransactionListParams: React.Dispatch<React.SetStateAction<TransactionListParams>>;
  updateTransactions: () => void;
  updateAllTransactions: () => void;
  account: string;
}
const TransactionsPageContextDefault: TransactionsPageContextType = {
  pagedTransactions: [],
  allTransactions: [],
  transactionListParams: defaultTransactionListParams,
  setTransactionListParams: () => {},
  updateTransactions: async () => {},
  updateAllTransactions: () => {},
  account: "",
};
export const TransactionsPageContext = createContext<TransactionsPageContextType>(TransactionsPageContextDefault);
// #endregion

interface TransactionsPageProps {
  account: string;
}
export function TransactionsPage(props: TransactionsPageProps) {
  // * Deconstruct props
  const { account } = props;

  // * Page constants
  const [accounts, setAccounts] = useState<string[]>([account]);
  const title = account.charAt(0).toUpperCase() + account.slice(1);
  document.title = `Finance - ${title}`;
  const location = useLocation();

  // * States
  const [transactionListParams, setTransactionListParams] = useState<TransactionListParams>(defaultTransactionListParams);
  const [allTransactions, updateAllTransactions] = useFetch<Transaction[]>([], db.Transactions.get, [accounts]);

  // * States depending on filters, paging and sorting parameters
  const [pagedTransactions, updatePagedTransactions] = useFetch<Transaction[]>([], db.Transactions.get, [accounts, transactionListParams]);
  const [accountBalance, updateAccountBalance] = useFetch<number>(0, db.Account.balance, [accounts, transactionListParams]);
  const [transactionAmount, updateTransactionAmount] = useFetch<number>(0, db.Transactions.count, [accounts]);
  const updateTransactions = () => {
    updatePagedTransactions();
    updateAccountBalance();
    updateTransactionAmount();
  };
  useEffect(() => {
    updateTransactions();
    setAccounts([account]);
  }, [location.pathname]);

  // * Page nav functions
  const scroll = (direction: "right" | "left"): void => {
    switch (direction) {
      case "left":
        setTransactionListParams((v) => ({
          ...v,
          page: { ...v.page, offset: Math.max(v.page.offset - v.page.limit, 0) },
        }));
        break;
      case "right":
        setTransactionListParams((v) => ({
          ...v,
          page: { ...v.page, offset: Math.min(v.page.offset + v.page.limit, transactionAmount - v.page.limit) },
        }));
        break;
    }
  };

  return (
    <TransactionsPageContext.Provider
      value={{
        pagedTransactions: pagedTransactions,
        allTransactions: allTransactions,
        transactionListParams: transactionListParams,
        setTransactionListParams: setTransactionListParams,
        updateTransactions: updateTransactions,
        updateAllTransactions: updateAllTransactions,
        account: account,
      }}
    >
      <div className="transactions">
        <div className="summary">
          <h2 className="title">{title}</h2>
          <h2>${privateData ? "--" : accountBalance}</h2>
        </div>

        <Menu />
        <TransactionDisplay />

        <nav className="page-nav">
          <button className="page-button" onClick={() => scroll("left")}>
            &lt;
          </button>
          <input
            className="limit-input"
            value={transactionListParams.page.limit}
            type="number"
            onChange={(e) => {
              setTransactionListParams((v) => ({ ...v, page: { ...v.page, limit: Number(e.target.value) } }));
            }}
          ></input>
          <button className="page-button" onClick={() => scroll("right")}>
            &gt;
          </button>
        </nav>
      </div>
    </TransactionsPageContext.Provider>
  );
}
