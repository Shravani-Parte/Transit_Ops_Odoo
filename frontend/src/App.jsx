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
