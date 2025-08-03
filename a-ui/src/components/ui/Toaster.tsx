/**
 * Toaster Component
 * Simple toast notification component
 */

'use client';

import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export interface ToasterProps {
  className?: string;
  'data-testid'?: string;
}

export const Toaster: React.FC<ToasterProps> = ({
  className = '',
  'data-testid': testId = 'toaster',
}) => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      className={className}
      data-testid={testId}
    />
  );
};
