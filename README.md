解一下 jackson 产生的引用结构。jackson 产生的引用结构大概是这样的，其中 `@id:` 是可配置的：
```json
{
    "@id":"@id:cf1f315b-a5b4-4313-a945-f5f2d6e90532",
    "id":1,
    "department":{
        "@id":"@id:1072f8d5-61e1-46eb-bb4e-b45f3504b669",
        "id":3,
        "department":{
            "@id":"@id:8bc5cd50-376b-47e4-afee-6d2392e70c52",
            "id":2,
            "department":"@id:cf1f315b-a5b4-4313-a945-f5f2d6e90532"
        }
    }
}
```

Usage:
```js
// 直接使用默认 prefix ，即 @id:
const jkc = require('jackson-converter');
const obj = jkc.parse(someJsonString);

// 或者给定一个 prefix
const jkc = require('jackson-converter').getInstance('@id:');
const obj = jkc.parse(someJsonString);
```
