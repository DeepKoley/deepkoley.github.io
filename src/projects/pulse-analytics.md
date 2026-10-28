---
title: "PulseAnalytics IoT & Web Vitals"
description: "A high-throughput monitoring dashboard visualizing streaming edge metrics, latency heatmaps, and Core Web Vitals for distributed systems."
category: "Data & Infrastructure"
year: "2025"
status: "Production"
role: "Frontend Architect & Performance Engineer"
timeline: "6 Months"
demoUrl: "https://example.com"
githubUrl: "https://github.com"
image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
imageCaption: "High-density metrics overview with real-time anomaly detection and heatmaps"
tags:
  - React
  - Go
  - ClickHouse
  - WebSockets
  - Tailwind CSS
---

## Overview

PulseAnalytics processes millions of incoming telemetry points from serverless functions, microservices, and client browsers. It transforms raw distributed traces into actionable performance insights in real time.

## Key Features

- **Real-Time Latency Heatmaps:** Interactive quantile charts (p50, p90, p99) showing spikes the second they occur.
- **Web Vitals Attribution:** Diagnostic breakdowns tracing poor LCP, INP, and CLS scores directly back to offending scripts or asset hosts.
- **Microsecond Query Times:** Powered by ClickHouse on the backend with client-side canvas data visualization capable of rendering 100,000 datapoints smoothly.

```text
[ Client Beacon / Logs ] ──(HTTP/3)──▶ [ Ingestion Gateway (Go) ]
                                                │
                                                ▼
                                        [ ClickHouse OLAP ]
                                                │
                                    (WebSocket Push Stream)
                                                ▼
                                    [ PulseAnalytics Dashboard ]
```

## Results

- Decreased mean time to detection (MTTD) for critical incidents from 14 minutes to under 30 seconds.
- Handled sustained loads of 85,000 events/second without packet drops.
