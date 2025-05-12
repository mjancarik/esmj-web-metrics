# Web Metrics

A lightweight utility for collecting and analyzing web performance metrics, such as navigation timing, paint timing, and user interaction metrics. This package helps developers monitor and optimize the performance of their web applications.

## Installation

To install the package, use npm or yarn:

```bash
npm install @esmj/web-metrics
# or
yarn add @esmj/web-metrics
```

## Why Use This Package?

- **Comprehensive Metrics**: Collects a wide range of performance metrics, including navigation timing, paint timing, and user interactions.
- **Lightweight**: Minimal overhead for performance monitoring.
- **Easy Integration**: Simple API to integrate into your web application.
- **Device Information**: Provides device-specific details like screen dimensions and user agent.

## Usage

### Example

```typescript
import { measure, getMetrics } from '@esmj/web-metrics';

// Start measuring performance metrics
measure();

// Retrieve metrics after some time
setTimeout(() => {
  const metrics = getMetrics();
  console.log(metrics);
}, 5000);
```

### Data Structure

The `getMetrics` function returns an object with the following structure:

```typescript
type Metrics = {
  navigation: {
    redirect: number | undefined;
    appCache: number | undefined;
    DNS: number | undefined;
    TCP: number | undefined;
    request: number | undefined;
    response: number | undefined;
    processingToDI: number | undefined;
    processingToDCL: number | undefined;
    processingDCL: number | undefined;
    processingToDC: number | undefined;
    processingL: number | undefined;
    processing: number | undefined;
    HTML: number | undefined;
    TTFB: number | undefined;
    navigation: number | undefined;
    redirectCount: number | undefined;
    transferSize: number | undefined;
    decodedBodySize: number | undefined;
    type: string | undefined;
    name: string | undefined;
    FCP?: { value: number | undefined };
    FI?: { value: number | undefined };
    FID?: { value: number | undefined };
    LCP?: { value: number | undefined };
    CLS: { value: number | undefined };
    INP?: { value: number | undefined };
  };
  device: {
    width: number;
    height: number;
    visibilityState: DocumentVisibilityState;
    mobile: boolean;
    userAgent: string;
  };
};
```

### Notes

- Call `measure()` early in your application lifecycle to start collecting metrics.
- Use `getMetrics()` to retrieve the collected metrics at any point after initialization.
- For full functionality, the browser must support the PerformanceObserver API.
- The Safari browser is not supported because most metrics are corrupted.

## License

This package is licensed under the MIT License.