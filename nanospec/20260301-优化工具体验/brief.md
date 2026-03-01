1. 优化 /spec.init，去掉检测是否初始化的步骤，能调用 commands 就说明已经初始化了。
2. 优化 cli command 的体验：new 的时候，如果不带参，应该要进入交互模式，此时能看见一个默认名，再回车则创建，也可以用户修改后再回车。
   各种命令，要支持简写，nanospec switch 太长了，应该要 nanospec s 就能switch
