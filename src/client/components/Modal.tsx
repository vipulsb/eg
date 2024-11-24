import React from "react";

interface ModalProps {
  title?: string;
  body: React.ReactElement;
  errorMessage?: string;
}

const Modal: React.FC<ModalProps> = ({
  title,
  body,
  errorMessage,
}: ModalProps) => {
  return (
    <div className="flex justify-center items-center min-h-screen max-h-max bg-gray-100">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-8">
        {errorMessage && <p className="text-red-400 text-sm">{errorMessage}</p>}
        <h1 data-testid="modal-title" className="text-2xl font-bold mb-6 text-center">{title}</h1>
        {body}
      </div>
    </div>
  );
};

export default Modal;
