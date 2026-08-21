import { BrowserRouter } from "react-router";
import { Toaster } from "sonner";
import { AppRoutes } from "./AppRoutes";
import { AuthProvider } from "../context/AuthContext";
import { WorkflowLockProvider } from "../context/WorkflowLockContext";
import { WorkflowGuardDialog } from "../components/workflow/WorkflowGuardDialog";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WorkflowLockProvider>
          <AppRoutes />
          <WorkflowGuardDialog />
          <Toaster position="bottom-center" richColors />
        </WorkflowLockProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
