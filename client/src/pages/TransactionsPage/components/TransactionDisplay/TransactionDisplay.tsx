import React, { useState, useContext } from "react";
import "./TransactionDisplay.css";
import TransactionForm from "../TransactionForm/TransactionForm";
import * as db from "../../../../database";
import { Transaction } from "../../../../models";
import { handleServerError } from "../../../../lib/ErrorHandling";
import { privateData } from "../../../../config";
import { TransactionsPageContext } from "../../TransactionsPage";
import { useToggle } from "../../../../hooks";

export default function TransactionDisplay() {
  // * Decontruct context
  const { updateTransactions, updateAllTransactions, setTransactionListParams, transactionListParams, pagedTransactions } =
    useContext(TransactionsPageContext);

  // * Toggle form
  const [editId, setEditId] = useState<number>();
  const [showEditForm, toggleFormPopUp] = useToggle(false);

  // * Table sort functions
  const onTableHeaderClick = (e: React.MouseEvent<HTMLTableHeaderCellElement, MouseEvent>): void => {
    e.preventDefault();
    if (e.currentTarget?.dataset) {
      setTransactionListParams((v) => ({
        ...v,
        order: {
          by: e.currentTarget.dataset.label as keyof Transaction,
          sort: (() => {
            let defaultSortBy: "descending" | "ascending" = "ascending";
            if (e.currentTarget.dataset.label === "date" || e.currentTarget.dataset.label === "amount") {
              defaultSortBy = "descending";
            }

            if (transactionListParams.order.by === e.currentTarget.dataset.label) {
              return v.order.sort === "ascending" ? "descending" : "ascending";
            } else {
              return defaultSortBy;
            }
          })(),
        },
      }));
    }
  };
  const getFontWeight = (label: keyof Transaction): 700 | 400 => {
    return transactionListParams.order.by === label ? 700 : 400;
  };

  return (
    <div className="transaction-display">
      {showEditForm && <TransactionForm toggleForm={toggleFormPopUp} id={editId} />}
      <table>
        <thead>
          <tr key="labels">
            <th style={{ width: 20 }}>Edit</th>
            <th data-label="date" onClick={onTableHeaderClick} style={{ fontWeight: getFontWeight("date"), width: 80 }}>
              Date
            </th>
            <th data-label="amount" onClick={onTableHeaderClick} style={{ fontWeight: getFontWeight("amount"), width: 100 }}>
              Amount
            </th>
            <th data-label="category" onClick={onTableHeaderClick} style={{ fontWeight: getFontWeight("category"), width: 200 }}>
              Category
            </th>
            <th data-label="counterparty" onClick={onTableHeaderClick} style={{ fontWeight: getFontWeight("counterparty"), width: 200 }}>
              Counterparty
            </th>
            <th data-label="notes" onClick={onTableHeaderClick} style={{ fontWeight: getFontWeight("notes") }}>
              Notes
            </th>
            <th style={{ width: 20 }}>Del.</th>
          </tr>
        </thead>
        <tbody>
          {pagedTransactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>
                <button
                  className="edit-button"
                  onClick={() => {
                    toggleFormPopUp();
                    setEditId(transaction.id);
                  }}
                ></button>
              </td>
              <td>{new Date(transaction.date).toISOString().split("T")[0]}</td>
              <td
                style={{
                  backgroundColor: transaction.type === "income" ? "rgb(150, 200, 155)" : "rgb(255, 145, 145)",
                  color: "black",
                }}
              >
                {transaction.type === "income" ? `+` : `-`}
                {` $${privateData ? "--" : transaction.amount}`}
              </td>
              <td>{privateData ? "--" : transaction.category}</td>
              <td>{privateData ? "--" : transaction.counterparty}</td>
              <td>{privateData ? "--" : transaction.notes}</td>
              <td>
                <button
                  className="delete-button"
                  onClick={async () => {
                    if (window.confirm(`Do you really want to delete transaction of id ${transaction.id}?`)) {
                      await db.Transaction.delete(transaction.id).catch(handleServerError);
                      updateAllTransactions();
                      updateTransactions();
                    }
                  }}
                ></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
