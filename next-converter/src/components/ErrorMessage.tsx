'use client';

interface ErrorMessageProps {
  message: string;
  title?: string;
}

export default function ErrorMessage({ message, title }: ErrorMessageProps) {
  return (
    <div className="error-message">
      {title && <h3>{title}</h3>}
      <p>{message}</p>
    </div>
  );
}
