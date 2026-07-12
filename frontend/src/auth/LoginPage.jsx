import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Truck } from "lucide-react";
import useAuth from "./useAuth";
import { login as apiLogin } from "./authApi";
import { ROLE_NAMES, ROLE_LABELS } from "@/config/constants";
import Button from "@/common/components/Button";

// Map roles to their default emails
const ROLE_EMAILS = {
  FleetManager: "ramesh@transitops.in",
  Dispatcher: "anita@transitops.in",
  SafetyOfficer: "vikram@transitops.in",
  FinancialAnalyst: "priya@transitops.in",
};

export default function LoginPage() {
  const [email, setEmail] = useState("ramesh@transitops.in");
  const [password, setPassword] = useState("password123");
  const [role, setRole] = useState("FleetManager");
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setEmail(ROLE_EMAILS[selectedRole]);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setErr("Enter email and password"); return; }
    setLoading(true);
    try {
      const u = await apiLogin(email, password);
      login(u);
      nav(loc.state?.from?.pathname || "/dashboard", { replace: true });
    } catch (error) {
      setErr(error.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="card w-full max-w-md p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 rounded bg-primary text-white flex items-center justify-center"><Truck size={18} /></div>
          <div>
            <div className="font-semibold text-lg">TransitOps</div>
            <div className="text-xs text-text-muted">Fleet & Transport Operations</div>
          </div>
        </div>
        <h2 className="text-xl font-semibold mb-1">Sign in</h2>
        <p className="text-xs text-text-muted mb-6">Select a role to explore the platform — this demo uses real backend data.</p>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label">Role</label>
            <div className="grid grid-cols-2 gap-2">
              {ROLE_NAMES.map(r => (
                <button
                  type="button"
                  key={r}
                  onClick={() => handleRoleSelect(r)}
                  className={`border rounded-md px-3 py-2 text-xs text-left ${role === r ? "border-primary bg-red-50 text-primary" : "border-border bg-white text-text hover:bg-table-rowHover"}`}
                >{ROLE_LABELS[r]}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {err && <div className="text-xs text-danger">{err}</div>}
          <Button type="submit" className="w-full justify-center" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>
  );
}
