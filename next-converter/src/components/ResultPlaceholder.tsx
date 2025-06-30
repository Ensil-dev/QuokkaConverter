'use client';
import React from 'react';

interface InfoItem {
  label: string;
  value: React.ReactNode;
}

interface ResultPlaceholderProps {
  icon: React.ReactNode;
  title: string;
  message: string;
  info: InfoItem[];
  ready?: boolean;
}

export default function ResultPlaceholder({
  icon,
  title,
  message,
  info,
  ready = false,
}: ResultPlaceholderProps) {
  return (
    <div className={`result-placeholder${ready ? ' ready' : ''}`}>
      <div className="placeholder-content">
        <div className="placeholder-icon">{icon}</div>
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="placeholder-info">
          {info.map(({ label, value }, i) => (
            <div key={i} className="placeholder-item">
              <span className="placeholder-label">{label}</span>
              <span className="placeholder-value">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
