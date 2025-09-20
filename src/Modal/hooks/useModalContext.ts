import { createContext, useContext } from "react";

interface ModalContextType {
  modalRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
}

export const ModalContext = createContext<ModalContextType | null>(null);

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error(
      "Modal 하위 컴포넌트는 Modal 내부에서만 사용할 수 있습니다."
    );
  }
  return context;
};
