/*instrumentation.ts*/
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import {
  ConsoleMetricExporter,
  PeriodicExportingMetricReader,
} from '@opentelemetry/sdk-metrics';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import {
  defaultResource,
  resourceFromAttributes,
} from '@opentelemetry/resources';
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';

const resource = defaultResource().merge(
  resourceFromAttributes({
    [ATTR_SERVICE_NAME]: 'meter-demo',
    [ATTR_SERVICE_VERSION]: '1.0.0',
  }),
);

const metricReader = new PeriodicExportingMetricReader({
  exporter: new ConsoleMetricExporter(),
  exportIntervalMillis: 10000,
});

const sdk = new NodeSDK({
  resource,
  traceExporter: new OTLPTraceExporter({
    // 可选 - 默认 URL 为 http://localhost:4318/v1/traces
    url: 'http://localhost:4318/v1/traces',
    // 可选 - 每个请求要发送的自定义头信息，默认为空
    headers: {},
  }),
  metricReader,
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
