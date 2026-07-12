import { AuthProvider } from '../auth/AuthContext';
import { UIProvider } from '../store/uiStore';

export default function AppProviders({ children }) {
  return (
    <UIProvider>
      <AuthProvider>{children}</AuthProvider>
    </UIProvider>
  );
}
