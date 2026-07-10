/*dice.ts*/
import { trace } from '@opentelemetry/api';

const tracer = trace.getTracer('chazhuang-dice', '1.0.0');

function rollOnce(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function rollTheDice(rolls: number, min: number, max: number) {
  return tracer.startActiveSpan('rollTheDice', (span) => {
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
