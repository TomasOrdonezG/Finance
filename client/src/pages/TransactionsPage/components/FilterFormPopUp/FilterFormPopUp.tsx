import React, { SetStateAction, useContext, ChangeEvent } from "react";
import { TransactionListParams } from "../../../../models";
import { TogglePopUpFormButton } from "../../../../components/TogglePopUpFormButton/TogglePopUpFormButton";
import "./FilterFormPopUp.css";
import { TransactionsPageContext } from "../../TransactionsPage";

interface FilterDateProps {
  setTransactionListParams: React.Dispatch<SetStateAction<TransactionListParams>>;
  className?: string;
  valueMin: string | undefined;
  valueMax: string | undefined;
}
interface FilterTypeProps {
  setTransactionListParams: React.Dispatch<SetStateAction<TransactionListParams>>;
  className?: string;
  value: "income" | "expense" | undefined;
}
class FilterComponents {
  public static Date(props: FilterDateProps): React.JSX.Element {
    // * Min and Max date input filter
    const { setTransactionListParams, className, valueMin, valueMax } = props;
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
      const { name, value } = e.target;
      setTransactionListParams((v) => {
        if (value !== "") {
          return {
            ...v,
            filters: { ...v.filters, date: { ...v.filters?.date, [name]: value } },
          };
        } else if (v.filters?.date) {
          delete v.filters.date[name as "min" | "max"];
        }
        return { ...v };
      });
    };
    return (
      <div>
        <input value={valueMin} className={className} name="min" type="date" onChange={handleDateChange} />
        -
        <input value={valueMax} className={className} name="max" type="date" onChange={handleDateChange} />
      </div>
    );
  }

  public static Type(props: FilterTypeProps): React.JSX.Element {
    // * Type input filter
    const { setTransactionListParams, className, value } = props;
    const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const { value } = e.target;
      setTransactionListParams((v) => {
        if (value === "income" || value === "expense") {
          return { ...v, filters: { ...v.filters, type: value } };
        } else {
          delete v.filters?.type;
          return { ...v };
        }
      });
    };
    return (
      <select className={className} onChange={onChange} value={(() => (value ? value : "all"))()}>
        <option value="all">All</option>
        <option value="income">Income</option>
        <option value="expense">Expenses</option>
      </select>
    );
  }
}

interface FilterFormPopUpProps {
  toggleForm: () => void;
}
export function FilterFormPopUp(props: FilterFormPopUpProps): React.JSX.Element {
  // * Deconstruct props and context
  const { toggleForm } = props;
  const { transactionListParams, setTransactionListParams } = useContext(TransactionsPageContext);

  // * Value change handler for input elements
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { value, name } = event.target;
    setTransactionListParams((v) => {
      console.log(v);
      if (value !== "") {
        const out = { ...v, filters: { ...v.filters, [name]: value } };
        console.log(out);
        return out;
      } else if (v.filters) {
        delete v.filters[name as "counterparty" | "category" | "notes"];
      }
      return { ...v };
    });
  };

  return (
    <form className="filter-form">
      <TogglePopUpFormButton
        className="filter-form-item"
        toggleForm={toggleForm}
        backgroundImageUrl="https://icons-for-free.com/iconfiles/png/512/CLOSE-131994911256789607.png"
      />

      <FilterComponents.Date
        valueMin={transactionListParams.filters?.date?.min}
        valueMax={transactionListParams.filters?.date?.max}
        className="filter-form-item"
        setTransactionListParams={setTransactionListParams}
      />

      <FilterComponents.Type
        value={transactionListParams.filters?.type}
        className="filter-form-item"
        setTransactionListParams={setTransactionListParams}
      />

      <input className="filter-form-item" placeholder="Counterparty" name="counterparty" onChange={handleInputChange} />
      <input className="filter-form-item" placeholder="Category" name="category" onChange={handleInputChange} />
      <input className="filter-form-item" placeholder="Notes" name="notes" onChange={handleInputChange} />
    </form>
  );
}
