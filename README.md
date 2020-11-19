JSON parser
================================================


当标准 JSON.parse 方法不能兼容非标 JSON 时，可以用本库提供的 Parser 类来解析 JSON。

除了支持标准 JSON 外，Parser 还支持无引号 key、单引号 key、单引号字符串、冗余尾逗号等，同时也支持 `//` 行注释和 `/**/` 块注释。

## 使用方法

```js
const jsonString = `
// 这里一段测试 json
{key: 'value'} /* 块注释也会被忽略 */
`

const parser = new Parser()

const json = parser.parse(jsonString)

console.log(json) // {"key":"value"}
```
