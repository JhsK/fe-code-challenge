import type { ReactNode } from "react";

interface ModalBodyProps {
  children: ReactNode;
}

export function ModalBody({ children }: ModalBodyProps) {
  return (
    <div className="px-6 py-2 text-gray-700 max-h-96 overflow-y-auto">
      {children}
    </div>
  );
}
