"use client";

import 'bootstrap/dist/css/bootstrap.min.css';

import './globals.css';
import '@/styles/custom.css';
import { ReduxProvider } from '@/redux/ReduxProvider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          {children}
          <ToastContainer/>
        </ReduxProvider>
      </body>
    </html>
  );
}
