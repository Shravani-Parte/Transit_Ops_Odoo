import React from "react";
import AppProviders from "./app/AppProviders";
import AppRouter from "./router";

export default function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}
