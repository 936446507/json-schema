## json-schema

### 可添加自定义提示语的表单校验

> 现版本：v1.1.0

```javascript
import validate from 'json-schema';
const result = validate(json, schema);
// schema
{
  required: ['key'],
  properties: {
    key: {
      type: 'string',
      minLength: 1,
      enum: ['value']
    },
  },
};
// 错误结果集，若无错误返回[]
[{
    key: '',  // 校验错误key
    message: '' // 校验错误提示语
}, ...]
```

### Schema key word 表
> type Required = (string | {key: string, message: string})[]

|    key     | 必填 |   类型   | 版本  |    日期    |          描述           |
| :--------: | :--: | :------: | :---: | :--------: | :---------------------: |
|  required  |  否  | Required | 1.0.0 | 2020.06.03 | json存在的key集合,可自定义提示语 |
| properties |  否  |  Properties  | 1.0.0 | 2020.06.03 | json中key的表单规则定义 |

#### Properties key表

> type Type =  | 'string' | 'number' | 'boolean' | 'null' | 'object' | 'array'

|    key    | 必填 |             类型              | 版本  |    日期    |         描述         | 使用类型限制  |
| :-------: | :--: | :---------------------------: | :---: | :--------: | :------------------: | :-----------: |
|   type    |  否  |             Type              | 1.0.0 | 2020.06.03 |         类型         |               |
| messages  |  否  | {[key in Properties]: string} | 1.0.0 | 2020.06.03 | 自定义校验规则提示语 |               |
|   enum    |  否  |      (string\|number)[]       | 1.0.0 | 2020.06.03 |        枚举值        | string,number |
| minLength |  否  |            number             | 1.0.0 | 2020.06.03 |       最小长度       | string,array  |
| maxLength |  否  |            number             | 1.0.0 | 2020.06.03 |       最大长度       | string,array  |
|  minNum   |  否  |            number             | 1.0.0 | 2020.06.03 |        最小值        |    number     |
|  maxNum   |  否  |            number             | 1.0.0 | 2020.06.03 |        最大值        |    number     |
|  pattern   |  否  |            string             | 1.1.0 | 2020.12.24 |        匹配正则        |    string     |
|  multipleOf   |  否  |            number             | 1.1.0 | 2020.12.24 |        数值满足倍数        |    number     |
|  exclusiveMinNum   |  否  |            number             | 1.1.0 | 2020.12.24 |        开区间最小值        |    number     |
|  exclusiveMaxNum   |  否  |            number             | 1.1.0 | 2020.12.24 |        开区间最大值        |    number     |
|  items   |  否  |            Properties, Properties[]             | 1.1.0 | 2020.12.24 |        数组成员类型        |    array     |
|  minItems   |  否  |            number             | 1.1.0 | 2020.12.24 |        数组元素最小个数        |    array     |
|  maxItems   |  否  |            number             | 1.1.0 | 2020.12.24 |        数组元素最大个数        |    array     |
|  uniqueItems   |  否  |            boolean             | 1.1.0 | 2020.12.24 |        数组元素是否必须唯一        |    array     |