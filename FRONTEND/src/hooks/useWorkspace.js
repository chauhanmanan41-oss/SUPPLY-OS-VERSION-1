import { useCallback } from "react";
import { useNavigate } from "react-router";

export function useWorkspace() {
  const navigate = useNavigate();

  const openWizard = useCallback(() => {
    navigate("/projects/create");
  }, [navigate]);

  const closeWizard = useCallback(() => {
    navigate("/projects");
  }, [navigate]);

  const openWorkspace = useCallback((productId) => {
    if (productId) {
      navigate(`/workspace/${productId}`);
    } else {
      navigate("/projects");
    }
  }, [navigate]);

  const closeWorkspace = useCallback(() => {
    navigate("/projects");
  }, [navigate]);

  return {
    showWizard: false,
    openWizard,
    closeWizard,
    showWorkspace: false,
    workspaceProductId: null,
    openWorkspace,
    closeWorkspace,
  };
}
