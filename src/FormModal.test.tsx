import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { FormModal } from "./FormModal";
import { modalManager } from "./Modal";

describe("FormModal", () => {
  const user = userEvent.setup();
  const mockModalId = "test-modal-id";

  afterEach(() => {
    // 테스트 후 모든 모달 정리
    modalManager.closeAll();

    // body 스타일 정리
    document.body.style.overflow = "";
  });

  describe("기본 렌더링", () => {
    it("모든 폼 필드가 렌더링된다", () => {
      render(<FormModal modalId={mockModalId} />);

      expect(screen.getByText("신청서 작성")).toBeInTheDocument();
      expect(screen.getByLabelText("이름")).toBeInTheDocument();
      expect(screen.getByLabelText("이메일")).toBeInTheDocument();
      expect(screen.getByLabelText("FE 경력 연차")).toBeInTheDocument();
      expect(screen.getByLabelText("Github 링크 (선택)")).toBeInTheDocument();
      expect(screen.getByText("취소")).toBeInTheDocument();
      expect(screen.getByText("제출하기")).toBeInTheDocument();
    });

    it("필수 필드가 required 속성을 가진다", () => {
      render(<FormModal modalId={mockModalId} />);

      expect(screen.getByLabelText("이름")).toBeRequired();
      expect(screen.getByLabelText("이메일")).toBeRequired();
      expect(screen.getByLabelText("FE 경력 연차")).toBeRequired();
      expect(screen.getByLabelText("Github 링크 (선택)")).not.toBeRequired();
    });

    it("select 옵션이 올바르게 렌더링된다", () => {
      render(<FormModal modalId={mockModalId} />);

      const selectElement = screen.getByLabelText("FE 경력 연차");
      expect(selectElement).toBeInTheDocument();

      // 옵션들 확인
      expect(screen.getByText("선택해주세요")).toBeInTheDocument();
      expect(screen.getByText("0~3년")).toBeInTheDocument();
      expect(screen.getByText("4~7년")).toBeInTheDocument();
      expect(screen.getByText("8년 이상")).toBeInTheDocument();
    });
  });

  describe("폼 상호작용", () => {
    it("입력 필드에 값을 입력할 수 있다", async () => {
      render(<FormModal modalId={mockModalId} />);

      const nameInput = screen.getByLabelText("이름");
      const emailInput = screen.getByLabelText("이메일");
      const messageInput = screen.getByLabelText("Github 링크 (선택)");

      await user.type(nameInput, "홍길동");
      await user.type(emailInput, "hong@example.com");
      await user.type(messageInput, "https://github.com/hong");

      expect(nameInput).toHaveValue("홍길동");
      expect(emailInput).toHaveValue("hong@example.com");
      expect(messageInput).toHaveValue("https://github.com/hong");
    });

    it("select 필드에서 옵션을 선택할 수 있다", async () => {
      render(<FormModal modalId={mockModalId} />);

      const selectElement = screen.getByLabelText("FE 경력 연차");

      await user.selectOptions(selectElement, "0~3년");
      expect(selectElement).toHaveValue("0~3년");

      await user.selectOptions(selectElement, "4~7년");
      expect(selectElement).toHaveValue("4~7년");
    });
  });

  describe("폼 제출", () => {
    it("폼 제출 시 콘솔에 폼 데이터가 출력된다", async () => {
      const consoleSpy = vi.spyOn(console, "log");
      render(<FormModal modalId={mockModalId} />);

      // 필수 필드 채우기
      await user.type(screen.getByLabelText("이름"), "홍길동");
      await user.type(screen.getByLabelText("이메일"), "hong@example.com");
      await user.selectOptions(screen.getByLabelText("FE 경력 연차"), "0~3년");
      await user.type(
        screen.getByLabelText("Github 링크 (선택)"),
        "https://github.com/hong"
      );

      // 폼 제출
      await user.click(screen.getByText("제출하기"));

      expect(consoleSpy).toHaveBeenCalledWith("폼 데이터:", {
        name: "홍길동",
        email: "hong@example.com",
        yearOfExperience: "0~3년",
        githubLink: "https://github.com/hong",
      });

      consoleSpy.mockRestore();
    });

    it("빈 Github 링크 필드로도 제출할 수 있다", async () => {
      const consoleSpy = vi.spyOn(console, "log");
      render(<FormModal modalId={mockModalId} />);

      // 필수 필드만 채우기
      await user.type(screen.getByLabelText("이름"), "홍길동");
      await user.type(screen.getByLabelText("이메일"), "hong@example.com");
      await user.selectOptions(
        screen.getByLabelText("FE 경력 연차"),
        "8년 이상"
      );

      // 폼 제출
      await user.click(screen.getByText("제출하기"));

      expect(consoleSpy).toHaveBeenCalledWith("폼 데이터:", {
        name: "홍길동",
        email: "hong@example.com",
        yearOfExperience: "8년 이상",
        githubLink: "",
      });

      consoleSpy.mockRestore();
    });
  });

  describe("모달 취소", () => {
    it("취소 버튼을 클릭할 수 있다", async () => {
      render(<FormModal modalId={mockModalId} />);

      const cancelButton = screen.getByText("취소");
      expect(cancelButton).toBeInTheDocument();

      // 취소 버튼 클릭 (실제 동작은 modalManager에 의해 처리됨)
      await user.click(cancelButton);

      // 버튼이 클릭 가능한지 확인
      expect(cancelButton).toBeEnabled();
    });
  });

  describe("접근성", () => {
    it("폼 필드들이 올바른 라벨과 연결되어 있다", () => {
      render(<FormModal modalId={mockModalId} />);

      const nameInput = screen.getByLabelText("이름");
      const emailInput = screen.getByLabelText("이메일");
      const yearSelect = screen.getByLabelText("FE 경력 연차");
      const messageInput = screen.getByLabelText("Github 링크 (선택)");

      expect(nameInput).toHaveAttribute("id", "name");
      expect(emailInput).toHaveAttribute("id", "email");
      expect(yearSelect).toHaveAttribute("id", "yearOfExperience");
      expect(messageInput).toHaveAttribute("id", "githubLink");
    });
  });
});
