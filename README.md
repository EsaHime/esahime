# EsaHime

EsaHime is a cli tool to create project by using Esahime templates.

## Install

```
npm install @lancercomet/esahime -g
```

## 使用

### esahime init

`init` 命令用于使用预设模板快速初始化项目.

### esahime config

`config` 命令用于对程序进行配置.

### esahime version

`version` 命令用于查看程序当前版本.

### esahime help

`help` 命令用于查看程序说明.

### node ./bin/esahime

研发阶段如果需要运行脚本, 请执行此命令.

## 示例

```bash
# 创建新项目.
esahime init

# 设置程序的 Gitlab 配置.
esahime config gitlab
```

## Gitlab Token

EsaHime 的 init 功能需要访问 Gitlab，为了安全起见，程序自身没有预设 Token，需要您手动提供一个 Token 至程序.

当您没有设置 Token 时，执行 `esahime init` 程序将提醒您进行添加.

请至 [Gitlab 设置](https://git.bilibili.co/profile/personal_access_tokens) 中创建一个 Token，权限选中 API，并使用 `esahime config gitlab` 命令填入.

Token 保存在用户目录的 `.esahime/setting` 文件中.
