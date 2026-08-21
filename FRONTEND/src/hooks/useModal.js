import { useState, useCallback } from "react";

export function useModal() {
  const [modal, setModal] = useState(null);

  const openModal = useCallback((type) => setModal(type), []);
  const closeModal = useCallback(() => setModal(null), []);

  return { modal, openModal, closeModal };
}
