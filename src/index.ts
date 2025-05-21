//EXTENDING
type NavigatorConnection = Navigator & {
  connection?: {
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
    saveData?: boolean;
    type?: string;
  };
};

type UndefinedNumber = number | undefined;
type UndefinedString = string | undefined;
type WebMetricsType =
  | {
      value: UndefinedNumber;
    }
  | undefined;
type Metrics = {
  navigation: {
    redirect: UndefinedNumber;
    appCache: UndefinedNumber;
    DNS: UndefinedNumber;
    TCP: UndefinedNumber;
    TLS: UndefinedNumber;
    QUIC: UndefinedNumber;
    queueing: UndefinedNumber;
    worker: UndefinedNumber;
    request: UndefinedNumber;
    response: UndefinedNumber;
    processingToDI: UndefinedNumber;
    processingToDCL: UndefinedNumber;
    processingDCL: UndefinedNumber;
    processingToDC: UndefinedNumber;
    processingL: UndefinedNumber;
    processing: UndefinedNumber;
    TTFB: UndefinedNumber;
    HTML: UndefinedNumber;
    resource: UndefinedNumber;
    navigation: UndefinedNumber;
    redirectCount: UndefinedNumber;
    transferSize: UndefinedNumber;
    decodedBodySize: UndefinedNumber;
    type: UndefinedString;
    name: UndefinedString;
  };
  device: {
    width: number;
    height: number;
    visibilityState: DocumentVisibilityState;
    bfcache: boolean;
    mobile: boolean;
    userAgent: string;
    connection?: {
      effectiveType: UndefinedString;
      downlink: UndefinedNumber;
      rtt: UndefinedNumber;
      saveData?: boolean;
    };
  };
};

const NAVIGATION = 'navigation';
const PAINT = 'paint';
const LARGEST_CONTENTFUL_PAINT = 'largest-contentful-paint';
const FIRST_INPUT = 'first-input';
const LAYOUT_SHIFT = 'layout-shift';
const EVENT = 'event';
const FIRST_CONTENTFUL_PAINT = 'first-contentful-paint';
const round = Math.round.bind(Math) as (value: number) => number;

let FCP: WebMetricsType;
let LCP: WebMetricsType;
let FI: WebMetricsType;
let FID: WebMetricsType;
let INP: WebMetricsType;
let CLS: WebMetricsType;
let bfcache = false;

let observer: PerformanceObserver | undefined;
let metrics: Metrics | undefined;

function diff(end, start): number | undefined {
  const result = end - start;

  return !Number.isNaN(result) && result >= 0 ? round(result) : undefined;
}

export function measure() {
  if (
    typeof PerformanceObserver === 'undefined' ||
    typeof window === 'undefined' ||
    observer ||
    !PerformanceObserver.supportedEntryTypes.includes(LARGEST_CONTENTFUL_PAINT)
  ) {
    return;
  }

  window.addEventListener(
    'pageshow',
    (event: PageTransitionEvent) => {
      bfcache = event.persisted;
    },
    { once: true },
  );

  try {
    observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        const { entryType, name, startTime, duration } = entry;

        if (entryType === PAINT && name === FIRST_CONTENTFUL_PAINT) {
          FCP = {
            value: round(startTime),
          };
        }
        if (entryType === LARGEST_CONTENTFUL_PAINT) {
          LCP = {
            value: round(startTime),
            // TODO other properties
            //duration: round(duration),
            //loadTime: round((entry as LargestContentfulPaint).loadTime),
            //renderTime: round((entry as LargestContentfulPaint).renderTime),
          };
        }
        if (entryType === FIRST_INPUT) {
          FID = {
            value: round(
              (entry as PerformanceEventTiming).processingStart - startTime,
            ),
          };
          FI = {
            value: round(startTime),
            // TODO other properties
            //duration: round(duration),
            // delay: round(
            //   (entry as PerformanceEventTiming).processingStart - startTime,
            // ),
            // name,
          };

          if (!INP) {
            INP = {
              value: round(duration),
            };
          }
        }
        // @ts-ignore
        if (entryType === LAYOUT_SHIFT && !entry.hadRecentInput) {
          CLS = {
            // TODO other properties
            // @ts-ignore
            value: CLS.value + entry.value,
          };
        }

        if (
          entryType === EVENT &&
          ['pointerup', 'pointerdown', 'click', 'keydown', 'keyup'].includes(
            name,
          ) &&
          //  (entry as PerformanceEventTiming).interactionId &&
          (!INP || (INP?.value ?? 0) < duration)
        ) {
          INP = {
            // TODO other properties
            value: round(duration),
          };
        }

        if (entryType === NAVIGATION) {
          const {
            name,
            type,
            startTime,
            redirectEnd,
            redirectStart,
            workerStart,
            redirectCount,
            loadEventStart,
            loadEventEnd,
            transferSize,
            decodedBodySize,
            domainLookupStart,
            domainLookupEnd,
            fetchStart,
            connectEnd,
            connectStart,
            secureConnectionStart,
            responseStart,
            responseEnd,
            requestStart,
            domInteractive,
            domContentLoadedEventStart,
            domContentLoadedEventEnd,
            domComplete,
          } = entry as PerformanceNavigationTiming;

          const { innerHeight, innerWidth } = window;
          const { userAgent, connection } = navigator as NavigatorConnection;

          // fetchStart - startTime => waiting on main thread || worker init phase

          metrics = {
            navigation: {
              redirect: diff(redirectEnd, redirectStart),
              worker: diff(fetchStart, workerStart),
              appCache: diff(domainLookupStart, fetchStart),
              DNS: diff(domainLookupEnd, domainLookupStart),
              TCP: diff(secureConnectionStart, connectStart),
              TLS: diff(connectEnd, secureConnectionStart),
              QUIC: diff(connectEnd, connectStart),
              queueing: diff(requestStart, fetchStart),
              request: diff(responseStart, requestStart),
              response: diff(responseEnd, responseStart),
              TTFB: diff(responseStart, startTime),
              HTML: diff(responseEnd, requestStart),
              resource: diff(responseEnd, startTime),
              processingToDI: diff(domInteractive, responseEnd),
              processingToDCL: diff(domContentLoadedEventStart, domInteractive),
              processingDCL: diff(
                domContentLoadedEventEnd,
                domContentLoadedEventStart,
              ),
              processingToDC: diff(domComplete, domContentLoadedEventEnd),
              processingL: diff(loadEventEnd, loadEventStart),
              processing: diff(loadEventEnd, responseEnd),
              navigation: round(loadEventEnd),
              redirectCount,
              transferSize,
              decodedBodySize,
              type,
              name,
            },
            device: {
              width: innerWidth,
              height: innerHeight,
              visibilityState: document.visibilityState,
              bfcache,
              mobile:
                /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                  userAgent,
                ),
              userAgent,
            },
          };

          if (connection) {
            const { effectiveType, downlink, rtt, saveData } = connection;
            metrics.device.connection = {
              effectiveType,
              downlink,
              rtt,
              saveData,
            };
          }
        }
      });
    });
    [
      NAVIGATION,
      PAINT,
      LARGEST_CONTENTFUL_PAINT,
      LAYOUT_SHIFT,
      EVENT,
      FIRST_INPUT,
    ].forEach((type) => {
      if (type === LAYOUT_SHIFT) {
        // @ts-ignore
        CLS = {
          value: 0,
        };
      }

      observer?.observe({
        type,
        // @ts-ignore
        durationThreshold: 32,
        buffered: true,
      });
    });
  } catch (e) {
    console.error(e);
  }
}

export function getMetrics() {
  if (
    typeof window === 'undefined' ||
    !PerformanceObserver.supportedEntryTypes.includes(LARGEST_CONTENTFUL_PAINT)
  ) {
    return undefined;
  }

  return {
    ...metrics,
    navigation: {
      ...metrics?.navigation,
      FCP,
      FI,
      FID,
      LCP,
      CLS,
      INP,
    },
  };
}
