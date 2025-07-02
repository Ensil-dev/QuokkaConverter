'use client';
import React from 'react';

interface ErrorMessageProps {
  message: string;
  title?: string;
}

const ErrorMessage = React.memo(function ErrorMessage({ message, title }: ErrorMessageProps) {
  return (
    <div className="error-message">
      {title && <h3>{title}</h3>}
      <p>{message}</p>
    </div>
  );
});

export default ErrorMessage;
