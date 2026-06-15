import React from 'react';
import { Card } from '../Card';
import './index.scss';

interface HeaderCardProps {
  title: string;
  subtitle?: string;
  badges?: React.ReactNode[];
  actions?: React.ReactNode[];
}

export const HeaderCard: React.FC<HeaderCardProps> = ({
  title,
  subtitle,
  badges = [],
  actions = [],
}) => {
  return (
    <Card>
      <div className="header-card">
        <div className="header-card__info">
          <h1 className="header-card__title">
            {title}
          </h1>

          {subtitle && (
            <p className="header-card__subtitle">
              {subtitle}
            </p>
          )}

          {badges.length > 0 && (
            <div className="header-card__badges">
              {badges.map((badge, idx) => (
                <div key={idx}>{badge}</div>
              ))}
            </div>
          )}
        </div>

        {actions.length > 0 && (
          <div className="header-card__actions">
            {actions.map((action, idx) => (
              <div key={idx}>{action}</div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};