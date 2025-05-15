import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';

import { getMetrics, measure } from '../index.ts';

describe('web-metrics', () => {
  let originalPerformanceObserver;
  let originalWindow;
  let originalDocument;
  let originalNavigator;

  beforeEach(() => {
    // Save the original PerformanceObserver, window, document, navigator to restore it later
    originalPerformanceObserver = globalThis.PerformanceObserver;
    originalWindow = globalThis.window;
    originalDocument = globalThis.document;

    // Mock the window object, document, navigator and PerformanceObserver
    globalThis.window = {
      innerHeight: 800,
      innerWidth: 1280,
      addEventListener: () => {},
      removeEventListener: () => {},
    };
    globalThis.document = {
      visibilityState: 'visible',
    };

    globalThis.PerformanceObserver = class {
      static get supportedEntryTypes() {
        return [
          'paint',
          'largest-contentful-paint',
          'first-input',
          'layout-shift',
          'navigation',
          'event',
        ];
      }

      constructor(callback) {
        this.callback = callback;

        this._timer = null;
      }
      observe() {
        // Simulate performance entries
        clearTimeout(this._timer);
        this._timer = setTimeout(() => {
          this.callback({
            getEntries: () => [
              {
                entryType: 'paint',
                name: 'first-contentful-paint',
                startTime: 123,
              },
              {
                entryType: 'largest-contentful-paint',
                startTime: 456,
              },
              {
                entryType: 'first-input',
                startTime: 789,
                processingStart: 800,
                duration: 50,
              },
              {
                entryType: 'layout-shift',
                value: 0.1,
                hadRecentInput: true,
              },
              {
                entryType: 'layout-shift',
                value: 1,
                hadRecentInput: false,
              },
              {
                entryType: 'navigation',
                name: 'https://example.com',
                type: 'navigate',
                startTime: 0,
                redirectStart: 0,
                redirectEnd: 0,
                redirectCount: 0,
                loadEventStart: 1000,
                loadEventEnd: 1100,
                transferSize: 12345,
                decodedBodySize: 67890,
                domainLookupStart: 50,
                domainLookupEnd: 100,
                fetchStart: 0,
                connectStart: 100,
                connectEnd: 200,
                responseStart: 300,
                responseEnd: 400,
                requestStart: 250,
                domInteractive: 500,
                domContentLoadedEventStart: 600,
                domContentLoadedEventEnd: 700,
                domComplete: 800,
              },
            ],
          });
        }, 0);
      }
      disconnect() {}
    };
  });

  afterEach(() => {
    // Restore the original PerformanceObserver after each test
    globalThis.PerformanceObserver = originalPerformanceObserver;
    globalThis.window = originalWindow;
    globalThis.document = originalDocument;
  });

  it('should provide a valid API interface', () => {
    assert(measure);
    assert(getMetrics);
    assert(typeof measure === 'function');
    assert(typeof getMetrics === 'function');
  });

  it('should measure performance metrics using a mocked PerformanceObserver', async (t) => {
    //t.mock.method(globalThis.navigator, 'userAgent', {
    t.mock.getter(globalThis.navigator, 'userAgent', {
      value:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
    });

    measure();

    // Wait for the mock observer to process entries
    await new Promise((resolve) => setTimeout(resolve, 10));

    const metrics = getMetrics();
    assert(metrics);
    assert(metrics.navigation);
    assert(metrics.navigation.FCP.value === 123, 'FCP should be 123');
    assert(metrics.navigation.LCP.value === 456, 'LCP should be 456');
    assert(metrics.navigation.FID.value === 11, 'FID should be 11');
    assert(metrics.navigation.INP.value === 50, 'INP should be 50');
    assert(metrics.navigation.CLS.value === 1, 'CLS should be 1');
    assert(metrics.navigation.TTFB === 300, 'TTFB should be 300');
    assert(
      metrics.navigation.transferSize === 12345,
      'Transfer size should be 12345',
    );
    assert(
      metrics.navigation.decodedBodySize === 67890,
      'Decoded body size should be 67890',
    );
  });
});
