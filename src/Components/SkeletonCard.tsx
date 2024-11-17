// SkeletonCard.tsx
import React from "react";
import "./Skeleton.css";

const SkeletonCard: React.FC = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-icon"></div>
      <div className="skeleton-title"></div>
      <div className="skeleton-text"></div>
      <div className="skeleton-progress"></div>
    </div>
  );
};

export default SkeletonCard;
