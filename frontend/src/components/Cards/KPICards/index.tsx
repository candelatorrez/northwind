import React from 'react';
import './index.scss';

interface KPICardProps {
  label: string;
  value: string | number;
  change?: number;
  unit?: string;
  highlight?: boolean;
  icon?: React.ReactNode;
}

export const KPICard: React.FC<KPICardProps> = ({
  label,
  value,
  change,
  unit = '',
  highlight = false,
  icon,
}) => {
  return (
    <div className={`kpi-card ${highlight ? 'kpi-card--highlight' : ''}`}>
      <div className="kpi-card__content">
        <div>
          <p className="kpi-card__label">{label}</p>

          <div className="kpi-card__value-container">
            <span className="kpi-card__value">{value}</span>

            {unit && (
              <span className="kpi-card__unit">
                {unit}
              </span>
            )}
          </div>

          {change !== undefined && (
            <p className="kpi-card__change">
              {change > 0 ? '↑' : '↓'} {Math.abs(change)}% from last month
            </p>
          )}
        </div>

        {icon && (
          <div className="kpi-card__icon">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};