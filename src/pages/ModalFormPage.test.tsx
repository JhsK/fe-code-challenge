import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { ModalFormPage } from "./ModalFormPage";
import { modalManager } from "../Modal";

// alert 함수 모킹
const mockAlert = vi.fn();
window.alert = mockAlert;

describe("ModalFormPage", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    mockAlert.mockClear();
  });

  afterEach(() => {
    // 테스트 후 모든 모달 정리
    modalManager.closeAll();

    // body 스타일 정리
    document.body.style.overflow = "";
  });

  describe("기본 렌더링", () => {
    it("신청 폼 작성하기 버튼이 렌더링된다", () => {
      render(<ModalFormPage />);

      expect(screen.getByText("🚀 신청 폼 작성하기")).toBeInTheDocument();
    });

    it("초기에는 모달이 표시되지 않는다", () => {
      render(<ModalFormPage />);

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  describe("선언적 모달 호출", () => {
    it("신청 폼 작성하기 버튼 클릭 시 커스텀 모달이 열린다", async () => {
      render(<ModalFormPage />);

      const openButton = screen.getByText("🚀 신청 폼 작성하기");
      await user.click(openButton);

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });
      expect(screen.getByText("신청서 작성")).toBeInTheDocument();

      // 테스트 정리
      await user.click(screen.getByText("취소"));
    });

    it("커스텀 모달에 모든 폼 필드가 렌더링된다", async () => {
      render(<ModalFormPage />);

      await user.click(screen.getByText("🚀 신청 폼 작성하기"));

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      expect(screen.getByLabelText("이름")).toBeInTheDocument();
      expect(screen.getByLabelText("이메일")).toBeInTheDocument();
      expect(screen.getByLabelText("FE 경력 연차")).toBeInTheDocument();
      expect(screen.getByLabelText("Github 링크 (선택)")).toBeInTheDocument();
      expect(screen.getByText("제출하기")).toBeInTheDocument();
      expect(screen.getByText("취소")).toBeInTheDocument();

      // 테스트 정리
      await user.click(screen.getByText("취소"));
    });

    it("폼 제출 시 성공 메시지가 표시된다", async () => {
      render(<ModalFormPage />);

      await user.click(screen.getByText("🚀 신청 폼 작성하기"));

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      // 폼 필드 채우기
      await user.type(screen.getByLabelText("이름"), "홍길동");
      await user.type(screen.getByLabelText("이메일"), "hong@example.com");
      await user.selectOptions(screen.getByLabelText("FE 경력 연차"), "0~3년");
      await user.type(
        screen.getByLabelText("Github 링크 (선택)"),
        "https://github.com/hong"
      );

      // 폼 제출
      await user.click(screen.getByText("제출하기"));

      // 성공 alert 확인
      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith(
          expect.stringContaining("신청이 완료되었습니다!")
        );
      });

      // 모달이 닫혔는지 확인
      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });

    it("취소 버튼 클릭 시 모달이 닫힌다", async () => {
      render(<ModalFormPage />);

      await user.click(screen.getByText("🚀 신청 폼 작성하기"));

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      // 취소 버튼 클릭
      await user.click(screen.getByText("취소"));

      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });

    it("ESC 키로 모달을 닫을 수 있다", async () => {
      render(<ModalFormPage />);

      await user.click(screen.getByText("🚀 신청 폼 작성하기"));

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      // ESC 키로 닫기
      await user.keyboard("{Escape}");

      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });
  });

  describe("접근성", () => {
    it("폼 필드들이 올바른 라벨과 연결되어 있다", async () => {
      render(<ModalFormPage />);
      await user.click(screen.getByText("🚀 신청 폼 작성하기"));

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      const nameInput = screen.getByLabelText("이름");
      const emailInput = screen.getByLabelText("이메일");
      const yearSelect = screen.getByLabelText("FE 경력 연차");
      const messageInput = screen.getByLabelText("Github 링크 (선택)");

      expect(nameInput).toHaveAttribute("id", "name");
      expect(emailInput).toHaveAttribute("id", "email");
      expect(yearSelect).toHaveAttribute("id", "yearOfExperience");
      expect(messageInput).toHaveAttribute("id", "githubLink");

      // 테스트 정리
      await user.click(screen.getByText("취소"));
    });

    it("필수 필드가 required 속성을 가진다", async () => {
      render(<ModalFormPage />);
      await user.click(screen.getByText("🚀 신청 폼 작성하기"));

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      expect(screen.getByLabelText("이름")).toBeRequired();
      expect(screen.getByLabelText("이메일")).toBeRequired();
      expect(screen.getByLabelText("FE 경력 연차")).toBeRequired();
      expect(screen.getByLabelText("Github 링크 (선택)")).not.toBeRequired();

      // 테스트 정리
      await user.click(screen.getByText("취소"));
    });
  });
});
