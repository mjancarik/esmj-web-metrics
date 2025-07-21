## <small>0.1.5 (2025-07-21)</small>

* style: 💄 fix code style ([a0b6c5c](https://github.com/mjancarik/esmj-web-metrics/commit/a0b6c5c))
* fix: 🐛 returns type from getMetrics ([713e2a4](https://github.com/mjancarik/esmj-web-metrics/commit/713e2a4))



## <small>0.1.4 (2025-07-17)</small>

* fix: 🐛 browser which not support supportedEntryTypes property ([2131328](https://github.com/mjancarik/esmj-web-metrics/commit/2131328))



## <small>0.1.3 (2025-07-15)</small>

* style: 💄 fixed code style ([bd689a6](https://github.com/mjancarik/esmj-web-metrics/commit/bd689a6))
* fix: 🐛 not throwing error for old browsers ([c50af0f](https://github.com/mjancarik/esmj-web-metrics/commit/c50af0f))



## <small>0.1.2 (2025-06-28)</small>

* feat: 🎸 add TTI metric ([85a5f7a](https://github.com/mjancarik/esmj-web-metrics/commit/85a5f7a))



## <small>0.1.1 (2025-05-30)</small>

* fix: 🐛 ignore doc folder ([1e0e778](https://github.com/mjancarik/esmj-web-metrics/commit/1e0e778))
* docs: ✏️ add description notes to usage example ([f522d69](https://github.com/mjancarik/esmj-web-metrics/commit/f522d69))



## 0.1.0 (2025-05-21)

* feat: 🎸 add more metrics and connection info ([bd17b87](https://github.com/mjancarik/esmj-web-metrics/commit/bd17b87))



## <small>0.0.3 (2025-05-15)</small>

* feat: 🎸 add QUIC, TLS, queueing, worker metric ([574cbc5](https://github.com/mjancarik/esmj-web-metrics/commit/574cbc5))


### BREAKING CHANGE

* 🧨 The previous TCP metric use bad events for calculating which can be
missleading and it is replaced by QUIC metric. The QUIC metric contains
TCP and TLS metrics. The processing metric is calculated from
responseEnd to loadEventEnd.


## <small>0.0.2 (2025-05-12)</small>

* style: 💄 fixed code style ([31739c1](https://github.com/mjancarik/esmj-web-metrics/commit/31739c1))
* docs: ✏️ update documentation ([ff69797](https://github.com/mjancarik/esmj-web-metrics/commit/ff69797))
* feat: 🎸 init commit ([f34be59](https://github.com/mjancarik/esmj-web-metrics/commit/f34be59))



