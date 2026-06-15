import React from 'react';
import './index.scss';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
  title,
  children,
  className = '',
  noPadding = false,
}) => {
  return (
    <div className={`card ${className}`}>
      {title && (
        <div className="card__header">
          <h3 className="card__title">
            {title}
          </h3>
        </div>
      )}

      <div className={`card__body ${noPadding ? 'card__body--no-padding' : ''}`}>
        {children}
      </div>
    </div>
  );
};