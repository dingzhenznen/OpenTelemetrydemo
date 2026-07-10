# OpenTelemetrydemo
OpenTelemetrydemo

getStart   自动插桩
chazhuang  手动插桩
MeterDemo  插桩 + 指标  

MeterDemo  手动 注册 trace 和 metric

https://opentelemetry.io/zh/docs/languages/js/instrumentation/

初始化 -> 获取 tracer -> 创建 span -> exporter 输出

在  getStart  chazhuang  MeterDemo   exporter 都是  console


下面的文档中 exporter 是各种 web 服务，把 输入的数据导出到 web 服务。记录和 分析
https://opentelemetry.io/zh/docs/languages/js/exporters/

