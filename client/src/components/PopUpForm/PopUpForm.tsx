import { TogglePopUpFormButton } from "../TogglePopUpFormButton/TogglePopUpFormButton";
import "./PopUpForm.css";
import React, { FormEvent, ReactNode } from "react";

interface FormProps {
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
  toggleForm: () => void;
  children: ReactNode;
}
export default function PopUpForm({ onSubmit, toggleForm, children }: FormProps) {
  return (
    <form onSubmit={onSubmit} className="form-comp">
      <TogglePopUpFormButton
        toggleForm={(e?: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
          e?.preventDefault();
          toggleForm();
        }}
        backgroundImageUrl="https://icons-for-free.com/iconfiles/png/512/CLOSE-131994911256789607.png"
      />
      {children}
      {onSubmit && (
        <button
          className="toggle-button"
          style={{
            backgroundImage: "url(https://static.thenounproject.com/png/3244804-200.png)",
            backgroundPosition: "1px 0px",
            backgroundSize: "95%",
          }}
          type="submit"
        />
      )}
    </form>
  );
}
