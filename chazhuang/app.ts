/*app.ts*/
import express, { type Express } from 'express';
import { rollTheDice } from './dice';
import { trace } from '@opentelemetry/api';

const PORT: number = parseInt(process.env.PORT || '8080');
const app: Express = express();

const tracer = trace.getTracer('dice-server', '0.1.0');

app.get('/rolldice', (req, res) => {
  tracer.startActiveSpan('rolldice.handler', (span) => {
    const rolls = req.query.rolls ? parseInt(req.query.rolls.toString()) : NaN;
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
});
