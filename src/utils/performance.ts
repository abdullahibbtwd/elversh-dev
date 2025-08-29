// Performance monitoring utilities

export interface PerformanceMetrics {
  fcp: number | null;
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  ttfb: number | null;
}

export const PERFORMANCE_TARGETS = {
  FCP: 1800, // 1.8 seconds
  LCP: 2500, // 2.5 seconds
  FID: 100,  // 100 milliseconds
  CLS: 0.1,  // 0.1
  TTFB: 800, // 800 milliseconds
};

export const calculatePerformanceScore = (metrics: PerformanceMetrics): number => {
  let score = 100;
  
  // FCP penalty (target: < 1.8s)
  if (metrics.fcp && metrics.fcp > PERFORMANCE_TARGETS.FCP) {
    score -= Math.min(20, (metrics.fcp - PERFORMANCE_TARGETS.FCP) / 100);
  }
  
  // LCP penalty (target: < 2.5s)
  if (metrics.lcp && metrics.lcp > PERFORMANCE_TARGETS.LCP) {
    score -= Math.min(25, (metrics.lcp - PERFORMANCE_TARGETS.LCP) / 100);
  }
  
  // FID penalty (target: < 100ms)
  if (metrics.fid && metrics.fid > PERFORMANCE_TARGETS.FID) {
    score -= Math.min(15, (metrics.fid - PERFORMANCE_TARGETS.FID) / 10);
  }
  
  // CLS penalty (target: < 0.1)
  if (metrics.cls && metrics.cls > PERFORMANCE_TARGETS.CLS) {
    score -= Math.min(20, metrics.cls * 200);
  }
  
  // TTFB penalty (target: < 800ms)
  if (metrics.ttfb && metrics.ttfb > PERFORMANCE_TARGETS.TTFB) {
    score -= Math.min(10, (metrics.ttfb - PERFORMANCE_TARGETS.TTFB) / 100);
  }
  
  return Math.max(0, Math.round(score));
};

export const getPerformanceGrade = (score: number): string => {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
};

export const getPerformanceStatus = (score: number): string => {
  if (score >= 90) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Needs Improvement';
  return 'Poor';
};

// Image optimization utilities
export const optimizeImageUrl = (url: string, width: number, quality: number = 75): string => {
  if (!url) return url;
  
  // If it's already a Next.js optimized image, return as is
  if (url.includes('_next/image')) return url;
  
  // For external images, you might want to use a CDN or image optimization service
  // For now, return the original URL
  return url;
};

// Bundle size monitoring
export const getBundleSize = async (): Promise<{ js: number; css: number; total: number }> => {
  if (typeof window === 'undefined') {
    return { js: 0, css: 0, total: 0 };
  }

  const resources = performance.getEntriesByType('resource');
  let jsSize = 0;
  let cssSize = 0;

  resources.forEach((resource) => {
    const resourceEntry = resource as PerformanceResourceTiming;
    if (resource.name.endsWith('.js')) {
      jsSize += resourceEntry.transferSize || 0;
    } else if (resource.name.endsWith('.css')) {
      cssSize += resourceEntry.transferSize || 0;
    }
  });

  return {
    js: Math.round(jsSize / 1024), // KB
    css: Math.round(cssSize / 1024), // KB
    total: Math.round((jsSize + cssSize) / 1024), // KB
  };
};

// Memory usage monitoring
export const getMemoryUsage = (): { used: number; total: number; percentage: number } | null => {
  if (typeof window === 'undefined' || !('memory' in performance)) {
    return null;
  }

  const memory = (performance as any).memory;
  return {
    used: Math.round(memory.usedJSHeapSize / 1024 / 1024), // MB
    total: Math.round(memory.totalJSHeapSize / 1024 / 1024), // MB
    percentage: Math.round((memory.usedJSHeapSize / memory.totalJSHeapSize) * 100),
  };
};

// Network performance monitoring
export const getNetworkInfo = (): { effectiveType: string; downlink: number; rtt: number } | null => {
  if (typeof window === 'undefined' || !('connection' in navigator)) {
    return null;
  }

  const connection = (navigator as any).connection;
  return {
    effectiveType: connection.effectiveType || 'unknown',
    downlink: connection.downlink || 0,
    rtt: connection.rtt || 0,
  };
};

// Performance recommendations
export const getPerformanceRecommendations = (metrics: PerformanceMetrics): string[] => {
  const recommendations: string[] = [];

  if (metrics.fcp && metrics.fcp > PERFORMANCE_TARGETS.FCP) {
    recommendations.push('Optimize First Contentful Paint by reducing critical resources');
  }

  if (metrics.lcp && metrics.lcp > PERFORMANCE_TARGETS.LCP) {
    recommendations.push('Optimize Largest Contentful Paint by improving image loading and server response time');
  }

  if (metrics.fid && metrics.fid > PERFORMANCE_TARGETS.FID) {
    recommendations.push('Reduce First Input Delay by minimizing JavaScript execution time');
  }

  if (metrics.cls && metrics.cls > PERFORMANCE_TARGETS.CLS) {
    recommendations.push('Fix Cumulative Layout Shift by setting proper image dimensions');
  }

  if (metrics.ttfb && metrics.ttfb > PERFORMANCE_TARGETS.TTFB) {
    recommendations.push('Improve Time to First Byte by optimizing server response time');
  }

  if (recommendations.length === 0) {
    recommendations.push('Great job! Your site is performing well.');
  }

  return recommendations;
};

// Preload critical resources
export const preloadCriticalResources = (): void => {
  if (typeof window === 'undefined') return;

  const criticalResources = [
    '/ev.png',
    '/opengraph-image.png',
    // Add other critical resources here
  ];

  criticalResources.forEach((resource) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = resource;
    document.head.appendChild(link);
  });
};

// Optimize fonts loading
export const optimizeFonts = (): void => {
  if (typeof window === 'undefined') return;

  // Add font-display: swap to improve perceived performance
  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-family: 'Inter';
      font-display: swap;
    }
  `;
  document.head.appendChild(style);
};
