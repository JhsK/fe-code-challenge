import { Modal } from "../../Modal";
import { useFormModal } from "../hooks/useFormModal";

interface FormModalProps {
  modalId: string;
}

export function FormModal({ modalId }: FormModalProps) {
  const {
    formData,
    errors,
    isSubmitting,
    handleInputChange,
    handleSubmit,
    handleClose,
  } = useFormModal({ modalId });

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <Modal isOpen={true} onClose={handleClose}>
      <Modal.Header>신청서 작성</Modal.Header>

      <Modal.Body>
        {/* 오류 메시지 영역 - 스크린리더를 위한 live region */}
        {hasErrors && (
          <div
            role="alert"
            aria-live="polite"
            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md"
          >
            <h3 className="text-sm font-medium text-red-800 mb-2">
              입력 정보를 확인해주세요
            </h3>
            <ul className="text-sm text-red-700 space-y-1">
              {Object.keys(errors).map((field) => {
                const message = errors[field as keyof typeof errors];
                return message ? <li key={field}>• {message}</li> : null;
              })}
            </ul>
          </div>
        )}

        <form id="modal-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200 ${
                errors.name
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-blue-500 focus:border-transparent"
              }`}
              placeholder="이름을 입력해주세요"
            />
            {errors.name && (
              <p
                id="name-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              이메일 <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200 ${
                errors.email
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-blue-500 focus:border-transparent"
              }`}
              placeholder="example@email.com"
            />
            {errors.email && (
              <p
                id="email-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="yearOfExperience"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              FE 경력 연차 <span className="text-red-500">*</span>
            </label>
            <select
              id="yearOfExperience"
              name="yearOfExperience"
              value={formData.yearOfExperience}
              onChange={handleInputChange}
              required
              aria-invalid={!!errors.yearOfExperience}
              aria-describedby={
                errors.yearOfExperience ? "yearOfExperience-error" : undefined
              }
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200 ${
                errors.yearOfExperience
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-blue-500 focus:border-transparent"
              }`}
            >
              <option value="">선택해주세요</option>
              <option value="0~3년">0~3년</option>
              <option value="4~7년">4~7년</option>
              <option value="8년 이상">8년 이상</option>
            </select>
            {errors.yearOfExperience && (
              <p
                id="yearOfExperience-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                {errors.yearOfExperience}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="githubLink"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Github 링크 (선택)
            </label>
            <input
              type="url"
              id="githubLink"
              name="githubLink"
              value={formData.githubLink}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              placeholder="https://github.com/username"
            />
          </div>
        </form>
      </Modal.Body>

      <Modal.Footer>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            취소
          </button>
          <button
            type="submit"
            form="modal-form"
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "제출 중..." : "제출하기"}
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
