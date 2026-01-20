1. 目前cursor产物错误，仅简单地将 toml 文本弄进 md 文档里面。其实格式是不太匹配的。需要优化。其他的生成也需要检查是否符合要求。

2. template 机制变成一个可选机制。我提供了新的 核心prompt commands 和 agents.md。所有产物以这个为基准。template 默认内联进 commands 里，但支持定制。

3. 注意，生成的结果，完全以新提供的 核心prompt 为准
