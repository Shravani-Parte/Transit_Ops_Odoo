
import { useAuth } from '../../auth/useAuth';

export default function ProfilePage() {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Profile</h1>
      <div className="card p-6">
        <p>Name: {user?.full_name}</p>
        <p>Email: {user?.email}</p>
        <p>Role: {user?.role_name}</p>
      </div>
    </div>
  );
}
