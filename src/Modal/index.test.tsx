import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, type Mock } from "vitest";
import Modal from "./Modal";

describe("Modal", () => {
  const mockOnClose = vi.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    mockOnClose.mockClear();
    // body의 overflow 스타일 초기화
    document.body.style.overflow = "";
  });

  afterEach(() => {
    // 각 테스트 후 body 스타일 정리
    document.body.style.overflow = "";
  });

  describe("기본 렌더링", () => {
    it("isOpen이 false일 때 모달이 렌더링되지 않는다", () => {
      render(
        <Modal isOpen={false} onClose={mockOnClose}>
          <Modal.Header>테스트 모달</Modal.Header>
          <Modal.Body>테스트 내용</Modal.Body>
        </Modal>
      );

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("isOpen이 true일 때 모달이 렌더링된다", () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <Modal.Header>테스트 모달</Modal.Header>
          <Modal.Body>테스트 내용</Modal.Body>
        </Modal>
      );

      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("테스트 모달")).toBeInTheDocument();
      expect(screen.getByText("테스트 내용")).toBeInTheDocument();
    });

    it("올바른 ARIA 속성들이 설정된다", () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <Modal.Header>테스트 모달</Modal.Header>
          <Modal.Body>테스트 내용</Modal.Body>
        </Modal>
      );

      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("aria-modal", "true");
      expect(dialog).toHaveAttribute("aria-labelledby", "modal-title");

      const title = screen.getByText("테스트 모달");
      expect(title).toHaveAttribute("id", "modal-title");
    });
  });

  describe("모달 닫기 기능", () => {
    it("배경 오버레이 클릭 시 모달이 닫힌다", async () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <Modal.Header>테스트 모달</Modal.Header>
          <Modal.Body>테스트 내용</Modal.Body>
        </Modal>
      );

      const overlay = screen.getByRole("dialog").firstChild as HTMLElement;
      await user.click(overlay);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("ESC 키 입력 시 모달이 닫힌다", async () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <Modal.Header>테스트 모달</Modal.Header>
          <Modal.Body>테스트 내용</Modal.Body>
        </Modal>
      );

      await user.keyboard("{Escape}");

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("헤더의 닫기 버튼 클릭 시 모달이 닫힌다", async () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <Modal.Header>테스트 모달</Modal.Header>
          <Modal.Body>테스트 내용</Modal.Body>
        </Modal>
      );

      const closeButton = screen.getByLabelText("모달 닫기");
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("포커스 관리", () => {
    it("모달이 열릴 때 첫 번째 포커스 가능한 요소에 포커스가 이동한다", async () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <Modal.Header>테스트 모달</Modal.Header>
          <Modal.Body>
            <button>첫 번째 버튼</button>
            <button>두 번째 버튼</button>
          </Modal.Body>
        </Modal>
      );

      // 실제로는 닫기 버튼이 DOM 순서상 첫 번째 포커스 가능한 요소
      await waitFor(() => {
        expect(screen.getByLabelText("모달 닫기")).toHaveFocus();
      });
    });

    it("Tab 키로 포커스가 모달 내부에서만 순환한다", async () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <Modal.Header>테스트 모달</Modal.Header>
          <Modal.Body>
            <button>첫 번째 버튼</button>
            <button>두 번째 버튼</button>
          </Modal.Body>
        </Modal>
      );

      // 닫기 버튼에서 시작
      await waitFor(() => {
        expect(screen.getByLabelText("모달 닫기")).toHaveFocus();
      });

      // Tab으로 다음 요소로 이동
      await user.tab();
      expect(screen.getByText("첫 번째 버튼")).toHaveFocus();

      // Tab으로 다음 요소로 이동
      await user.tab();
      expect(screen.getByText("두 번째 버튼")).toHaveFocus();

      // 마지막 요소에서 Tab 시 첫 번째 요소로 순환
      await user.tab();
      expect(screen.getByLabelText("모달 닫기")).toHaveFocus();
    });

    it("Shift+Tab으로 역방향 포커스 이동이 가능하다", async () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <Modal.Header>테스트 모달</Modal.Header>
          <Modal.Body>
            <button>첫 번째 버튼</button>
            <button>두 번째 버튼</button>
          </Modal.Body>
        </Modal>
      );

      // 닫기 버튼에서 시작
      await waitFor(() => {
        expect(screen.getByLabelText("모달 닫기")).toHaveFocus();
      });

      // 첫 번째 요소에서 Shift+Tab 시 마지막 요소로 이동
      await user.tab({ shift: true });
      expect(screen.getByText("두 번째 버튼")).toHaveFocus();
    });
  });

  describe("배경 스크롤 방지", () => {
    it("모달이 열릴 때 body 스크롤이 차단된다", () => {
      const { rerender } = render(
        <Modal isOpen={false} onClose={mockOnClose}>
          <Modal.Header>테스트 모달</Modal.Header>
        </Modal>
      );

      expect(document.body.style.overflow).toBe("");

      rerender(
        <Modal isOpen={true} onClose={mockOnClose}>
          <Modal.Header>테스트 모달</Modal.Header>
        </Modal>
      );

      expect(document.body.style.overflow).toBe("hidden");
    });
  });

  describe("합성 컴포넌트 패턴", () => {
    it("Modal.Header가 올바르게 렌더링된다", () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <Modal.Header>헤더 제목</Modal.Header>
        </Modal>
      );

      expect(screen.getByText("헤더 제목")).toBeInTheDocument();
      expect(screen.getByLabelText("모달 닫기")).toBeInTheDocument();
    });

    it("Modal.Header에서 showCloseButton=false일 때 닫기 버튼이 표시되지 않는다", () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <Modal.Header showCloseButton={false}>헤더 제목</Modal.Header>
        </Modal>
      );

      expect(screen.getByText("헤더 제목")).toBeInTheDocument();
      expect(screen.queryByLabelText("모달 닫기")).not.toBeInTheDocument();
    });

    it("Modal.Body가 올바르게 렌더링된다", () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <Modal.Body>바디 내용</Modal.Body>
        </Modal>
      );

      expect(screen.getByText("바디 내용")).toBeInTheDocument();
    });

    it("Modal.Footer가 올바르게 렌더링된다", () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <Modal.Footer>
            <button>확인</button>
            <button>취소</button>
          </Modal.Footer>
        </Modal>
      );

      expect(screen.getByText("확인")).toBeInTheDocument();
      expect(screen.getByText("취소")).toBeInTheDocument();
    });

    it("모든 합성 컴포넌트가 함께 올바르게 작동한다", () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <Modal.Header>완전한 모달</Modal.Header>
          <Modal.Body>
            <p>모달 내용입니다.</p>
            <input placeholder="입력 필드" />
          </Modal.Body>
          <Modal.Footer>
            <button>저장</button>
            <button>취소</button>
          </Modal.Footer>
        </Modal>
      );

      expect(screen.getByText("완전한 모달")).toBeInTheDocument();
      expect(screen.getByText("모달 내용입니다.")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("입력 필드")).toBeInTheDocument();
      expect(screen.getByText("저장")).toBeInTheDocument();
      expect(screen.getByText("취소")).toBeInTheDocument();
    });
  });

  describe("Context 에러 처리", () => {
    it("Modal 외부에서 Modal.Header 사용 시 에러가 발생한다", () => {
      // 콘솔 에러 억제
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      expect(() => {
        render(<Modal.Header>잘못된 사용</Modal.Header>);
      }).toThrow("Modal 하위 컴포넌트는 Modal 내부에서만 사용할 수 있습니다.");

      consoleSpy.mockRestore();
    });
  });

  describe("키보드 이벤트", () => {
    it("모달이 닫혀있을 때 키보드 이벤트가 처리되지 않는다", async () => {
      render(
        <Modal isOpen={false} onClose={mockOnClose}>
          <Modal.Header>테스트 모달</Modal.Header>
        </Modal>
      );

      await user.keyboard("{Escape}");

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it("일반 키 입력은 모달 닫기에 영향을 주지 않는다", async () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <Modal.Header>테스트 모달</Modal.Header>
          <Modal.Body>
            <input placeholder="텍스트 입력" />
          </Modal.Body>
        </Modal>
      );

      const input = screen.getByPlaceholderText("텍스트 입력");
      await user.click(input);
      await user.keyboard("hello world");

      expect(mockOnClose).not.toHaveBeenCalled();
      expect(input).toHaveValue("hello world");
    });
  });
});
