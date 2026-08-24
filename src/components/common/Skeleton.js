import React from "react";
import "./Skeleton.css";

const Skeleton = ({
  variant = "card",
  rows = 3,
  count = 1,
}) => {
  const renderCard = (index) => (
    <div className="skeleton-card" key={index}>
      <div className="skeleton skeleton-avatar"></div>

      <div className="skeleton-content">

        <div className="skeleton skeleton-title"></div>

        <div className="skeleton skeleton-text"></div>

        <div className="skeleton skeleton-text short"></div>

      </div>
    </div>
  );

  const renderTable = (index) => (
    <div className="skeleton-table" key={index}>
      {Array.from({ length: rows }).map((_, row) => (
        <div className="skeleton-table-row" key={row}>
          <div className="skeleton skeleton-cell"></div>
          <div className="skeleton skeleton-cell"></div>
          <div className="skeleton skeleton-cell"></div>
          <div className="skeleton skeleton-cell"></div>
        </div>
      ))}
    </div>
  );

  const renderList = (index) => (
    <div className="skeleton-list" key={index}>
      {Array.from({ length: rows }).map((_, row) => (
        <div className="skeleton-list-item" key={row}>
          <div className="skeleton skeleton-avatar small"></div>

          <div className="skeleton-list-content">
            <div className="skeleton skeleton-title"></div>
            <div className="skeleton skeleton-text short"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSkeleton = (index) => {
    switch (variant) {
      case "table":
        return renderTable(index);

      case "list":
        return renderList(index);

      case "card":
      default:
        return renderCard(index);
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) =>
        renderSkeleton(index)
      )}
    </>
  );
};

export default Skeleton;
