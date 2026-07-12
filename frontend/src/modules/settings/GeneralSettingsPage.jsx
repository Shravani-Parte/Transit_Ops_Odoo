import React, { useState } from "react";
import Input from "@/common/components/Input";
import Select from "@/common/components/Select";
import Button from "@/common/components/Button";
import { db, saveDb, resetMockData } from "@/store/mockDb";
import useToast from "@/common/hooks/useToast";
import { Link } from "react-router-dom";

export default function GeneralSettingsPage() {
  const [settings, setSettings] = useState(db().settings);
  const { push } = useToast();
  const set = (k) => (e) => setSettings(s => ({ ...s, [k]: e.target.value }));
  const save = () => {
    const cur = db(); cur.settings = settings; saveDb(cur);
    push("Settings saved", "success");
  };
  return (
    <div className="space-y-4 pt-4 max-w-2xl">
      <h2>Settings</h2>
      <div className="card p-5 space-y-3">
        <div className="font-semibold">General</div>
        <Input label="Depot Name" value={settings.depot_name} onChange={set("depot_name")} />
        <div className="grid grid-cols-2 gap-3">
          <Select label="Currency" value={settings.currency} onChange={set("currency")}><option>INR</option></Select>
          <Select label="Distance Unit" value={settings.distance_unit} onChange={set("distance_unit")}><option>km</option><option>mi</option></Select>
        </div>
        <div className="flex justify-end"><Button onClick={save}>Save</Button></div>
      </div>
      <div className="card p-5 space-y-3">
        <div className="font-semibold">Access</div>
        <div className="text-sm text-text-muted">View the role-permission matrix (read-only) or manage your profile.</div>
        <div className="flex gap-2">
          <Link to="/settings/rbac"><Button variant="secondary">RBAC Matrix</Button></Link>
          <Link to="/settings/profile"><Button variant="secondary">Profile</Button></Link>
        </div>
      </div>
      <div className="card p-5 space-y-3">
        <div className="font-semibold">Demo Data</div>
        <div className="text-sm text-text-muted">Reset the local mock database back to its seed state.</div>
        <div><Button variant="danger" onClick={() => { resetMockData(); push("Mock data reset — reload the page", "info"); }}>Reset Demo Data</Button></div>
      </div>
    </div>
  );
}
