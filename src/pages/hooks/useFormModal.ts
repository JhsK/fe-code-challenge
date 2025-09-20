import { useState } from "react";
import { modalManager } from "../../Modal";
import type { FormData } from "../types";

interface Props {
  modalId: string;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  yearOfExperience?: string;
}

export function useFormModal({ modalId }: Props) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    yearOfExperience: "",
    githubLink: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): ValidationErrors => {
    const newErrors: ValidationErrors = {};

    // 이름 검증
    if (!formData.name.trim()) {
      newErrors.name = "이름을 입력해주세요.";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "이름은 2글자 이상 입력해주세요.";
    }

    // 이메일 검증
    if (!formData.email.trim()) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "올바른 이메일 형식을 입력해주세요.";
    }

    // 경력 연차 검증
    if (!formData.yearOfExperience) {
      newErrors.yearOfExperience = "경력 연차를 선택해주세요.";
    }

    return newErrors;
  };

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

    // 입력 시 해당 필드의 오류 메시지 제거
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);

      // 첫 번째 오류 필드에 포커스
      const firstErrorField = Object.keys(validationErrors)[0];
      const errorElement = document.getElementById(firstErrorField);
      if (errorElement) {
        errorElement.focus();
      }

      return;
    }

    // 유효성 검증 통과 시 폼 데이터와 함께 모달 닫기
    console.log("폼 데이터:", formData);
    modalManager.close(modalId, formData);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    modalManager.cancel(modalId);
  };

  return {
    formData,
    errors,
    isSubmitting,
    handleInputChange,
    handleSubmit,
    handleClose,
  };
}
