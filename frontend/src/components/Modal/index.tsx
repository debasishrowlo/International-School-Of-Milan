import React from "react";

const Modal = ({
  isOpen, 
  onClose: close, 
  children,
} : {
  isOpen: boolean, 
  onClose: () => void,
  children: React.ReactNode,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed z-20 top-0 left-0 w-screen h-screen flex justify-center items-center">
      <div className="absolute z-10 inset-0 bg-black/50"></div>
      <div className="relative z-20 w-full max-w-[75%] p-20 bg-white rounded-8 shadow-md transition-all" onClick={(e) => e.stopPropagation()}>
        <button className="absolute -top-10 right-10 text-36 text-neutral-800 transition-colors" onClick={close}>
          &times;
        </button>
        <div className="mt-10">{children}</div>
      </div>
    </div>
  );
};

export default Modal;