<<<<<<< HEAD
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
=======
import { RouterProvider } from 'react-router-dom';
import router from './router';
import AppProviders from './app/AppProviders';

function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}

export default App;
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
