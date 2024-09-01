import React from "react";
import "./TogglePopUpFormButton.css";

interface TogglePopUpFormButtonProps {
  toggleForm?: (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  backgroundImageUrl?: string;
  className?: string;
}
export const TogglePopUpFormButton = ({
  toggleForm,
  backgroundImageUrl,
  className,
}: TogglePopUpFormButtonProps): React.JSX.Element => {
  return (
    <button className={className} onClick={toggleForm} style={{ backgroundImage: `url(${backgroundImageUrl})` }} />
  );
};
