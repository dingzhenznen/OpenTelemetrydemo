/*dice.ts*/
import { metrics, trace } from '@opentelemetry/api';

const meter = metrics.getMeter('dice-lib', '1.0.0');
const tracer = trace.getTracer('dice-lib', '1.0.0');

const rollCounter = meter.createCounter('dice.rolls.counter', {
  description: 'Counts how many dice rolls were performed',
});

const requestCounter = meter.createCounter('dice.requests.counter', {
  description: 'Counts how many rollTheDice requests were made',
});

const rollHistogram = meter.createHistogram('dice.rolls.histogram', {
  description: 'Distribution of roll counts per request',
});

function rollOnce(min: number, max: number) {
  rollCounter.add(1);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function rollTheDice(rolls: number, min: number, max: number) {
  return tracer.startActiveSpan('rollTheDice', (span) => {
    requestCounter.add(1, {
      'dice.min': min,
      'dice.max': max,
    });
    rollHistogram.record(rolls, {
      'dice.min': min,
      'dice.max': max,
    });
    span.setAttribute('dice.rolls', rolls);
    span.setAttribute('dice.min', min);
    span.setAttribute('dice.max', max);

    try {
      const result: number[] = [];
      for (let i = 0; i < rolls; i++) {
        result.push(rollOnce(min, max));
      }
      span.setAttribute('dice.result_count', result.length);
      return result;
    } finally {
      span.end();
    }
  });
}
