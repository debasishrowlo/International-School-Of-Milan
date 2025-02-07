import React from "react";
import classnames from "classnames";
import { useSelector } from 'react-redux';
import { IoAdd } from 'react-icons/io5';

const AddButton = ({ onClick }) => {
  const { user } = useSelector((state) => state.auth);

  const canView = user && user.role === "admin" || user.role === "moderator" || user.role == 'creator'

  return (
    <button
      type="button"
      className={classnames("fixed bottom-30 right-30 size-60 flex items-center justify-center bg-black leading-60 text-36 font-bold text-white rounded-full shadow-md transition-all", {
        "block": canView,
        "hidden": !canView,
      })}
      onClick={onClick}
    >
      <IoAdd className="text-white" />
    </button>
  );
};

export default AddButton;
