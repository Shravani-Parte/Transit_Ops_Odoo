<<<<<<< HEAD
import React from "react";
import useAuth from "@/auth/useAuth";
import { ROLE_LABELS } from "@/config/constants";

export default function ProfilePage() {
  const { user } = useAuth();
  if (!user) return null;
  const Row = ({ l, v }) => <div className="flex justify-between py-2 border-b border-border last:border-b-0 text-sm"><span className="text-text-muted">{l}</span><span className="font-medium">{v}</span></div>;
  return (
    <div className="space-y-4 pt-4 max-w-xl">
      <h2>Profile</h2>
      <div className="card p-5">
        <Row l="Name" v={user.name} />
        <Row l="Email" v={user.email} />
        <Row l="Role" v={ROLE_LABELS[user.role] || user.role} />
        <Row l="Status" v={user.status} />
=======

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
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
      </div>
    </div>
  );
}
