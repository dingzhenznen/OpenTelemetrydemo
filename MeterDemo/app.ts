/*app.ts*/
import express, { type Express } from 'express';
import { metrics, trace } from '@opentelemetry/api';
import { rollTheDice } from './dice';

const meter = metrics.getMeter('meter-demo-app', '1.0.0');
const tracer = trace.getTracer('meter-demo-app', '1.0.0');
const httpRequestCounter = meter.createCounter('http.server.requests', {
  description: 'Counts incoming HTTP requests',
});

const PORT: number = parseInt(process.env.PORT || '8081');
const app: Express = express();

app.get('/rolldice', (req, res) => {
  tracer.startActiveSpan('rolldice.handler', (span) => {
    const rolls = req.query.rolls ? parseInt(req.query.rolls.toString(), 10) : NaN;

    httpRequestCounter.add(1, {
      route: '/rolldice',
      method: 'GET',
    });
    span.setAttribute('http.route', '/rolldice');

    try {
      if (isNaN(rolls)) {
        span.setAttribute('app.rolls_valid', false);
        res
          .status(400)
          .send("Request parameter 'rolls' is missing or not a number.");
        return;
      }

      span.setAttribute('app.rolls_valid', true);
      span.setAttribute('app.rolls', rolls);
      res.send(JSON.stringify(rollTheDice(rolls, 1, 6)));
    } finally {
      span.end();
    }
  });
});

app.listen(PORT, () => {
  console.log(`Listening for requests on http://localhost:${PORT}`);
  console.log('Trace and metrics export to console');
});
