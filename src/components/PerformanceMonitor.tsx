"use client";
import { useEffect, useState } from 'react';

// Type definitions for Performance API
interface PerformanceEventTiming extends PerformanceEntry {
  processingStart: number;
  processingEnd: number;
  target?: EventTarget;
}

interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
  lastInputTime: number;
  sources?: LayoutShiftAttribution[];
}

interface LayoutShiftAttribution {
  node?: Node;
  currentRect: DOMRectReadOnly;
  previousRect: DOMRectReadOnly;
}

interface PerformanceMetrics {
  fcp: number | null;
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  ttfb: number | null;
}

const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
  });

  useEffect(() => {
    // Only run in browser and if PerformanceObserver is available
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    // Measure First Contentful Paint (FCP)
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        setMetrics(prev => ({ ...prev, fcp: fcpEntry.startTime }));
      }
    });
    fcpObserver.observe({ entryTypes: ['paint'] });

    // Measure Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }));
      }
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // Measure First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        const fidEntry = entry as PerformanceEventTiming;
        if (fidEntry.processingStart && fidEntry.startTime) {
          const fid = fidEntry.processingStart - fidEntry.startTime;
          setMetrics(prev => ({ ...prev, fid }));
        }
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });

    // Measure Cumulative Layout Shift (CLS)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        const clsEntry = entry as LayoutShift;
        if (!clsEntry.hadRecentInput) {
          clsValue += clsEntry.value;
          setMetrics(prev => ({ ...prev, cls: clsValue }));
        }
      });
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });

    // Measure Time to First Byte (TTFB)
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
      setMetrics(prev => ({ ...prev, ttfb }));
    }

    // Cleanup observers
    return () => {
      fcpObserver.disconnect();
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
    };
  }, []);

  // Calculate performance score
  const calculateScore = () => {
    let score = 100;
    
    // FCP penalty (target: < 1.8s)
    if (metrics.fcp && metrics.fcp > 1800) {
      score -= Math.min(20, (metrics.fcp - 1800) / 100);
    }
    
    // LCP penalty (target: < 2.5s)
    if (metrics.lcp && metrics.lcp > 2500) {
      score -= Math.min(25, (metrics.lcp - 2500) / 100);
    }
    
    // FID penalty (target: < 100ms)
    if (metrics.fid && metrics.fid > 100) {
      score -= Math.min(15, (metrics.fid - 100) / 10);
    }
    
    // CLS penalty (target: < 0.1)
    if (metrics.cls && metrics.cls > 0.1) {
      score -= Math.min(20, metrics.cls * 200);
    }
    
    return Math.max(0, Math.round(score));
  };

  const performanceScore = calculateScore();

  // Only show in development or when explicitly enabled
  if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_SHOW_PERFORMANCE) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700 z-50 max-w-xs">
      <h3 className="text-sm font-semibold mb-2 text-gray-800 dark:text-gray-200">
        Performance Monitor
      </h3>
      
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Score:</span>
          <span className={`font-medium ${
            performanceScore >= 90 ? 'text-green-600' : 
            performanceScore >= 70 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {performanceScore}/100
          </span>
        </div>
        
        {metrics.fcp && (
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">FCP:</span>
            <span className={`font-medium ${
              metrics.fcp < 1800 ? 'text-green-600' : 
              metrics.fcp < 3000 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {(metrics.fcp / 1000).toFixed(2)}s
            </span>
          </div>
        )}
        
        {metrics.lcp && (
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">LCP:</span>
            <span className={`font-medium ${
              metrics.lcp < 2500 ? 'text-green-600' : 
              metrics.lcp < 4000 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {(metrics.lcp / 1000).toFixed(2)}s
            </span>
          </div>
        )}
        
        {metrics.fid && (
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">FID:</span>
            <span className={`font-medium ${
              metrics.fid < 100 ? 'text-green-600' : 
              metrics.fid < 300 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {metrics.fid.toFixed(0)}ms
            </span>
          </div>
        )}
        
        {metrics.cls && (
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">CLS:</span>
            <span className={`font-medium ${
              metrics.cls < 0.1 ? 'text-green-600' : 
              metrics.cls < 0.25 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {metrics.cls.toFixed(3)}
            </span>
          </div>
        )}
        
        {metrics.ttfb && (
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">TTFB:</span>
            <span className={`font-medium ${
              metrics.ttfb < 800 ? 'text-green-600' : 
              metrics.ttfb < 1800 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {metrics.ttfb.toFixed(0)}ms
            </span>
          </div>
        )}
      </div>
      
      <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {performanceScore >= 90 ? 'Excellent' : 
           performanceScore >= 70 ? 'Good' : 
           performanceScore >= 50 ? 'Needs Improvement' : 'Poor'}
        </div>
      </div>
    </div>
  );
};

export default PerformanceMonitor;
