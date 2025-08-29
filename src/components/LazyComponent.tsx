"use client";
import React, { Suspense, lazy } from 'react';

interface LazyComponentProps {
  component: React.ComponentType<any>;
  fallback?: React.ReactNode;
  props?: any;
}

const LazyComponent: React.FC<LazyComponentProps> = ({ 
  component: Component, 
  fallback = <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-64 rounded-lg" />,
  props = {}
}) => {
  const LazyComponent = lazy(() => Promise.resolve({ default: Component }));

  return (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

export default LazyComponent;
