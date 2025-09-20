import { type ComponentType, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";

interface ModalInstance {
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
  root: Root;
  container: HTMLDivElement;
}

class ModalManager {
  private instances: Map<string, ModalInstance> = new Map();

  open<T = any, P = any>(
    modalComponent: ComponentType<P & { modalId: string }>,
    props?: Omit<P, "modalId">,
    id?: string
  ): Promise<T> {
    const modalId = id || `modal-${Date.now()}-${Math.random()}`;
    const componentProps = (props || {}) as Omit<P, "modalId">;
    const modalElement = createElement(modalComponent, {
      ...componentProps,
      modalId,
    } as P & { modalId: string });

    return new Promise<T>((resolve, reject) => {
      // 컨테이너 생성
      const container = document.createElement("div");
      container.id = modalId;
      document.body.appendChild(container);

      // React 루트 생성
      const root = createRoot(container);

      // 인스턴스 저장
      this.instances.set(modalId, {
        resolve,
        reject,
        root,
        container,
      });

      root.render(modalElement);
    });
  }

  close<T = any>(id: string, result?: T): void {
    const instance = this.instances.get(id);
    if (!instance) return;

    // Promise 해결
    instance.resolve(result);

    // 정리
    this.cleanup(id);
  }

  cancel(id: string, reason?: any): void {
    const instance = this.instances.get(id);
    if (!instance) return;

    // Promise 거부 (또는 null로 해결)
    instance.resolve(null);

    // 정리
    this.cleanup(id);
  }

  private cleanup(id: string): void {
    const instance = this.instances.get(id);
    if (!instance) return;

    // React 언마운트
    setTimeout(() => {
      instance.root.unmount();

      // DOM에서 제거
      if (instance.container.parentNode) {
        instance.container.parentNode.removeChild(instance.container);
      }
    }, 0);

    // 인스턴스 제거
    this.instances.delete(id);
  }

  closeAll(): void {
    this.instances.forEach((_, id) => {
      this.cancel(id);
    });
  }
}

// 싱글톤 인스턴스
export const modalManager = new ModalManager();

export function openModal<T = any, P = any>(
  modalComponent: ComponentType<P & { modalId: string }>,
  props?: Omit<P, "modalId">,
  id?: string
): Promise<T> {
  return modalManager.open<T, P>(modalComponent, props, id);
}

export const closeModal = <T = any,>(id: string, result?: T): void => {
  modalManager.close(id, result);
};

export const cancelModal = (id: string): void => {
  modalManager.cancel(id);
};
