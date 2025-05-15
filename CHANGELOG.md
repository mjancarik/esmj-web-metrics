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



