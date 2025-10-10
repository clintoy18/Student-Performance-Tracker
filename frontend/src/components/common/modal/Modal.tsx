import React from "react";
import type { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md relative">
        <div className="p-6">
          {title && (
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            </div>
          )}
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          >
            ✕
          </button>

          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;