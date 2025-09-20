import type { ReactNode } from "react";

interface ModalFooterProps {
  children: ReactNode;
}

export function ModalFooter({ children }: ModalFooterProps) {
  return (
    <div className="px-6 py-4 pt-6 border-t border-gray-200">{children}</div>
  );
}
