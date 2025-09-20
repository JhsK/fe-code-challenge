import { screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Modal from "./Modal";
import { modalManager, openModal } from "./ModalManager";

// 테스트용 컴포넌트
interface TestModalProps {
  modalId: string;
  title?: string;
}

const TestModal = ({ modalId, title = "테스트 모달" }: TestModalProps) => {
  const handleClose = () => {
    modalManager.cancel(modalId);
  };

  const handleSubmit = () => {
    modalManager.close(modalId, { success: true, title });
  };

  return (
    <Modal isOpen={true} onClose={handleClose}>
      <Modal.Header>{title}</Modal.Header>
      <Modal.Body>
        <p>테스트 모달 내용입니다.</p>
      </Modal.Body>
      <Modal.Footer>
        <button onClick={handleClose}>취소</button>
        <button onClick={handleSubmit}>확인</button>
      </Modal.Footer>
    </Modal>
  );
};

describe("ModalManager", () => {
  const user = userEvent.setup();

  afterEach(async () => {
    // 모든 모달 정리
    await act(async () => {
      modalManager.closeAll();
    });

    // DOM에서 모달 컨테이너 제거
    const modalContainers = document.querySelectorAll('[id^="modal-"]');
    modalContainers.forEach((container) => container.remove());

    // body 스타일 정리
    document.body.style.overflow = "";
  });

  describe("컴포넌트와 props를 직접 전달하는 방식", () => {
    it("컴포넌트를 직접 전달해서 모달을 열 수 있다", async () => {
      let modalPromise: Promise<{ success: boolean; title: string }>;

      await act(async () => {
        modalPromise = openModal<{ success: boolean; title: string }>(
          TestModal
        );
      });

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      expect(screen.getByText("테스트 모달")).toBeInTheDocument();
      expect(screen.getByText("테스트 모달 내용입니다.")).toBeInTheDocument();

      // 확인 버튼 클릭
      await user.click(screen.getByText("확인"));

      const result = await modalPromise!;
      expect(result).toEqual({ success: true, title: "테스트 모달" });
    });

    it("props를 전달해서 모달을 커스터마이징할 수 있다", async () => {
      let modalPromise: Promise<{ success: boolean; title: string }>;

      await act(async () => {
        modalPromise = openModal<{ success: boolean; title: string }>(
          TestModal,
          { title: "커스텀 제목" }
        );
      });

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      expect(screen.getByText("커스텀 제목")).toBeInTheDocument();

      // 확인 버튼 클릭
      await user.click(screen.getByText("확인"));

      const result = await modalPromise!;
      expect(result).toEqual({ success: true, title: "커스텀 제목" });
    });

    it("취소 시 null을 반환한다", async () => {
      let modalPromise: Promise<{
        success: boolean;
        title: string;
      } | null>;

      await act(async () => {
        modalPromise = openModal<{
          success: boolean;
          title: string;
        } | null>(TestModal);
      });

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      // 취소 버튼 클릭
      await user.click(screen.getByText("취소"));

      const result = await modalPromise!;
      expect(result).toBeNull();
    });

    it("modalId가 자동으로 생성되어 전달된다", async () => {
      const TestModalWithId = ({ modalId }: { modalId: string }) => {
        return (
          <Modal isOpen={true} onClose={() => modalManager.cancel(modalId)}>
            <Modal.Header>Modal ID 테스트</Modal.Header>
            <Modal.Body>
              <p data-testid="modal-id">{modalId}</p>
            </Modal.Body>
          </Modal>
        );
      };

      await act(async () => {
        openModal(TestModalWithId);
      });

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      const modalIdElement = screen.getByTestId("modal-id");
      expect(modalIdElement.textContent).toMatch(/^modal-\d+-\d+\.\d+$/);
    });
  });
});
