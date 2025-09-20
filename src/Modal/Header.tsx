import type { ReactNode } from "react";
import { useModalContext } from "./hooks/useModalContext";

interface Props {
  children: ReactNode;
  showCloseButton?: boolean;
}

export function ModalHeader({ children, showCloseButton = true }: Props) {
  const { onClose } = useModalContext();

  return (
    <div className="flex items-center justify-between p-6 pb-4">
      <h2 id="modal-title" className="text-xl font-semibold text-gray-900">
        {children}
      </h2>
      {showCloseButton && (
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md p-1"
          aria-label="모달 닫기"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
