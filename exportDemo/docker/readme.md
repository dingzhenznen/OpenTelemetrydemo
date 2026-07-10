docker run -p 4317:4317 -p 4318:4318 --rm -v $(pwd)/docker/collector-config.yaml:/etc/otelcol/config.yaml otel/opentelemetry-collector




docker run --rm \
  -e COLLECTOR_ZIPKIN_HOST_PORT=:9411 \
  -p 16686:16686 \
  -p 4317:4317 \
  -p 4318:4318 \
  -p 9411:9411 \
  jaegertracing/all-in-one:latest



这个 有 ui