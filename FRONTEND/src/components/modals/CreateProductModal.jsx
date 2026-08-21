import React from "react";
import { ModalOverlay } from "../common/Modal";
import { NewWorkspaceFlow } from "../wizard/NewWorkspaceFlow";

export function CreateProductModal({ onClose }) {
  return (
    <ModalOverlay onClose={onClose}>
      <div className="w-full max-w-5xl max-h-[90vh] rounded-3xl overflow-hidden bg-white shadow-2xl">
        <NewWorkspaceFlow onClose={onClose} />
      </div>
    </ModalOverlay>
  );
}
