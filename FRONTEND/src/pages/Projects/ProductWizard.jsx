import React from "react";
import { NewWorkspaceFlow } from "../../components/wizard/NewWorkspaceFlow";

export function ProductWizard({ onClose }) {
  return <NewWorkspaceFlow onClose={onClose} />;
}
export default ProductWizard;
