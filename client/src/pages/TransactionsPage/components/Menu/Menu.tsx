import React, { useContext } from "react";
import TransactionForm from "../TransactionForm/TransactionForm";
import "./Menu.css";
import { TransactionsPageContext, defaultTransactionListParams } from "../../TransactionsPage";
import { FilterFormPopUp } from "../FilterFormPopUp/FilterFormPopUp";
import { useToggle } from "../../../../hooks";

interface TogglePopUpFormButtonProps {
  toggleFormPopUp: () => void;
  label?: string;
  backgroundImageUrl?: string;
  style?: object;
}
const TogglePopUpFormButton = (props: TogglePopUpFormButtonProps): React.JSX.Element => {
  const { toggleFormPopUp, label, style, backgroundImageUrl } = props;
  return (
    <button
      className="form-item"
      onClick={(e) => {
        e.preventDefault();
        toggleFormPopUp();
      }}
      style={{ ...style, backgroundImage: `url(${backgroundImageUrl})` }}
    >
      {label}
    </button>
  );
};

export default function Menu() {
  // * Decontruct props and context
  const { setTransactionListParams } = useContext(TransactionsPageContext);

  // * Show form toggles
  const [showNewTransactionForm, newTransactionToggle] = useToggle();
  const [showFilterForm, filterFormToggle] = useToggle();

  // * Keyboard shortcuts
  // React.useEffect(() => {
  //   document.addEventListener("keydown", (e: KeyboardEvent) => {
  //     switch (e.key.toLowerCase()) {
  //       case "n":
  //         newTransactionToggle();
  //         break;
  //       case "f":
  //         filterFormToggle();
  //         break;
  //       case "r":
  //         setTransactionListParams(defaultTransactionListParams);
  //         break;
  //     }
  //   });
  // }, []);

  return (
    <div className="menu-wrapper">
      <form className="menu">
        <TogglePopUpFormButton backgroundImageUrl="https://static.thenounproject.com/png/953211-200.png" toggleFormPopUp={newTransactionToggle} />

        <TogglePopUpFormButton
          backgroundImageUrl="https://static.thenounproject.com/png/247545-200.png"
          style={{ backgroundPosition: "0px 1px", backgroundSize: "95%" }}
          toggleFormPopUp={filterFormToggle}
        />

        {showFilterForm && <FilterFormPopUp toggleForm={filterFormToggle} />}

        <button
          // * Reset
          onClick={() => setTransactionListParams(defaultTransactionListParams)}
          className="form-item"
          style={{
            backgroundImage: `url(https://images.freeimages.com/fic/images/icons/2770/ios_7_icons/512/reload.png)`,
            backgroundSize: "105%",
            backgroundPosition: "-0.5px -0.5px",
          }}
        />
      </form>
      {showNewTransactionForm && <TransactionForm toggleForm={newTransactionToggle} />}
    </div>
  );
}
