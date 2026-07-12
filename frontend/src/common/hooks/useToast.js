import { useContext } from "react";
import { ToastContext } from "@/app/AppProviders";

export default function useToast() {
  const ctx = useContext(ToastContext);
  return ctx || { push: () => {} };
}
