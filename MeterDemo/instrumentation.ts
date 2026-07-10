/*instrumentation.ts*/
import opentelemetry from '@opentelemetry/api';
import {
  ConsoleMetricExporter,
  MeterProvider,
  PeriodicExportingMetricReader,
} from '@opentelemetry/sdk-metrics';
import {
  BatchSpanProcessor,
  ConsoleSpanExporter,
} from '@opentelemetry/sdk-trace-base';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
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

const meterProvider = new MeterProvider({
  resource,
  readers: [metricReader],
});

opentelemetry.metrics.setGlobalMeterProvider(meterProvider);

const traceProvider = new NodeTracerProvider({
  resource,
  spanProcessors: [new BatchSpanProcessor(new ConsoleSpanExporter())],
});

traceProvider.register();

