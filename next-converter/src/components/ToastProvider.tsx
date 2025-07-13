'use client';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ToastProvider() {
  return (
    <ToastContainer
      position="bottom-center"
      autoClose={2000}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss={false}
      draggable={false}
      pauseOnHover={false}
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 80px)' }}
    />
  );
}
