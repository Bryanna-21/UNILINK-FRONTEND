import React from "react";
import "../../styles/components/pageheader.css";

const PageHeader = ({
  title,
  subtitle = "",
  icon = null,
  actions = null,
  breadcrumbs = [],
}) => {
  return (
    <div className="page-header">

      <div className="page-header-top">

        <div className="page-header-info">

          {icon && (
            <div className="page-header-icon">
              {icon}
            </div>
          )}

          <div>

            <h1 className="page-title">
              {title}
            </h1>

            {subtitle && (
              <p className="page-subtitle">
                {subtitle}
              </p>
            )}

          </div>

        </div>

        {actions && (
          <div className="page-actions">
            {actions}
          </div>
        )}

      </div>

      {breadcrumbs.length > 0 && (
        <div className="breadcrumbs">

          {breadcrumbs.map((item, index) => (
            <React.Fragment key={index}>

              <span
                className={`breadcrumb ${
                  index === breadcrumbs.length - 1
                    ? "active"
                    : ""
                }`}
              >
                {item}
              </span>

              {index !== breadcrumbs.length - 1 && (
                <span className="separator">
                  /
                </span>
              )}

            </React.Fragment>
          ))}

        </div>
      )}

    </div>
  );
};

export default PageHeader;
