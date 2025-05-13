import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Flip, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './context/AuthContext.tsx';
import { BlogProvider } from './context/BlogContext.tsx';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AuthProvider>
      <BlogProvider>
        <App />
        <ToastContainer position="top-center" transition={Flip} />
      </BlogProvider>
    </AuthProvider>
  </BrowserRouter>
);
