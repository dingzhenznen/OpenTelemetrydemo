# MeterDemo

基于 OpenTelemetry JS 文档的 Node metrics demo。

## 运行

```bash
pnpm install
pnpm dev
```

访问：

```bash
http://localhost:8081/rolldice?rolls=3
```

控制台会每 10 秒输出一次指标，包括：

- `http.server.requests`
- `dice.requests.counter`
- `dice.rolls.counter`
- `dice.rolls.histogram`

