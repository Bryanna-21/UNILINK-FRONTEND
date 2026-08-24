import React from "react";
import "../../styles/components/card.css";

const Card = ({
  children,
  title,
  subtitle,
  footer,
  icon,
  actions,
  className = "",
  onClick,
  hover = true,
  bordered = true,
  shadow = true,
  padding = true,
}) => {
  return (
    <div
      className={[
        "app-card",
        hover ? "card-hover" : "",
        bordered ? "card-bordered" : "",
        shadow ? "card-shadow" : "",
        padding ? "card-padding" : "",
        className,
      ].join(" ")}
      onClick={onClick}
    >
      {(title || subtitle || icon || actions) && (
        <div className="card-header">

          <div className="card-header-left">

            {icon && (
              <div className="card-icon">
                {icon}
              </div>
            )}

            <div>

              {title && (
                <h3 className="card-title">
                  {title}
                </h3>
              )}

              {subtitle && (
                <p className="card-subtitle">
                  {subtitle}
                </p>
              )}

            </div>

          </div>

          {actions && (
            <div className="card-actions">
              {actions}
            </div>
          )}

        </div>
      )}

      <div className="card-content">
        {children}
      </div>

      {footer && (
        <div className="card-footer">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
