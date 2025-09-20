import { FormModal } from "./FormModal";
import { openModal } from "./Modal";

interface FormData {
  name: string;
  email: string;
  yearOfExperience: string;
  githubLink: string;
}

export function ModalFormPage() {
  const handleOpenModal = async () => {
    try {
      const result = await openModal<FormData | null>(FormModal);

      if (result) {
        // 제출 성공
        alert(
          `신청이 완료되었습니다!\n이름: ${result.name}\n이메일: ${result.email}\n경력: ${result.yearOfExperience}`
        );
      }
    } catch (error) {
      console.error("모달 오류:", error);
      alert("오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <section className="w-screen h-screen flex justify-center items-center bg-gray-50">
      <button
        onClick={handleOpenModal}
        className="rounded-lg bg-blue-500 text-white px-6 py-3 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
      >
        🚀 신청 폼 작성하기
      </button>
    </section>
  );
}
