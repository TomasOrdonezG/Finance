import React, { ChangeEvent, useEffect, useState, FormEvent, useContext } from "react";
import { TransactionParams } from "../../../../models";
import PopUpForm from "../../../../components/PopUpForm/PopUpForm";
import "./TransactionForm.css";
import * as db from "../../../../database";
import { handleServerError } from "../../../../lib/ErrorHandling";
import { TransactionsPageContext } from "../../TransactionsPage";

interface TransactionFormProps {
  toggleForm: () => void;
  id?: number;
}
export default function TransactionForm(props: TransactionFormProps) {
  // * Deconstruct props and context
  const { toggleForm, id } = props;
  const { updateTransactions, account } = useContext(TransactionsPageContext);

  // * Default form data
  const defaultFormData: TransactionParams = {
    account: account,
    date: new Date().toISOString().split("T")[0],
    type: "expense",
    amount: 0,
    category: "other",
    counterparty: "",
    notes: "",
  };
  const [formData, setFormData] = useState<TransactionParams>(defaultFormData);

  // * Set default form
  useEffect(() => {
    if (id) {
      db.Transaction.get(id)
        .then((oldTransaction) => {
          oldTransaction.date = new Date(oldTransaction.date).toISOString().split("T")[0];
          setFormData(oldTransaction);
        })
        .catch(handleServerError);
    }
  }, []);

  // * Change event in an input
  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = event.target;
    if (name === "amount") {
      setFormData((values) => ({ ...values, [name]: Number(value) }));
    }
    setFormData((values) => ({ ...values, [name]: value }));
  };

  // * JSX Return
  return (
    <PopUpForm
      onSubmit={async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (id) {
          await db.Transaction.edit(id, formData).catch(handleServerError);
          toggleForm();
        } else {
          await db.Transaction.new(formData).catch(handleServerError);
        }
        updateTransactions();
        setFormData(defaultFormData);
      }}
      toggleForm={toggleForm}
    >
      <label htmlFor="date">Date:</label>
      <input type="date" name="date" onChange={handleChange} value={formData.date} autoFocus />

      <label htmlFor="type">Type:</label>
      <select name="type" onChange={handleChange} value={formData.type}>
        <option value="expense">expense</option>
        <option value="income">income</option>
      </select>

      <label htmlFor="amount">Amount:</label>
      <input type="number" name="amount" onChange={handleChange} value={formData.amount} />

      <label htmlFor="category">Category:</label>
      <input name="category" onChange={handleChange} value={formData.category} />

      <label htmlFor="counterparty">Counterparty:</label>
      <input name="counterparty" onChange={handleChange} value={formData.counterparty} />

      <label htmlFor="notes">Notes:</label>
      <input name="notes" onChange={handleChange} value={formData.notes} />
    </PopUpForm>
  );
}
