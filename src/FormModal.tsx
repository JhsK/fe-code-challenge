import { Modal } from "./Modal";
import { useFormModal } from "./useFormModal";

interface FormModalProps {
  modalId: string;
}

export function FormModal({ modalId }: FormModalProps) {
  const { formData, handleInputChange, handleSubmit, handleClose } =
    useFormModal({ modalId });

  return (
    <Modal isOpen={true} onClose={handleClose}>
      <Modal.Header>신청서 작성</Modal.Header>

      <Modal.Body>
        <form id="modal-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              이름
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="이름을 입력해주세요"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              이메일
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="example@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="yearOfExperience"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              FE 경력 연차
            </label>
            <select
              id="yearOfExperience"
              name="yearOfExperience"
              value={formData.yearOfExperience}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">선택해주세요</option>
              <option value="0~3년">0~3년</option>
              <option value="4~7년">4~7년</option>
              <option value="8년 이상">8년 이상</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="githubLink"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Github 링크 (선택)
            </label>
            <input
              type="text"
              id="githubLink"
              name="githubLink"
              value={formData.githubLink}
              onChange={handleInputChange}
              required={false}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder=""
            />
          </div>
        </form>
      </Modal.Body>

      <Modal.Footer>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
          >
            취소
          </button>
          <button
            type="submit"
            form="modal-form"
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            제출하기
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
