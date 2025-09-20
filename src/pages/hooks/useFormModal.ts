import { useState } from "react";
import { modalManager } from "../../Modal";
import type { FormData } from "../types";

interface Props {
  modalId: string;
}

export function useFormModal({ modalId }: Props) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    yearOfExperience: "",
    githubLink: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("폼 데이터:", formData);

    // 폼 데이터와 함께 모달 닫기
    modalManager.close(modalId, formData);
  };

  const handleClose = () => {
    modalManager.cancel(modalId);
  };

  return {
    formData,
    handleInputChange,
    handleSubmit,
    handleClose,
  };
}
