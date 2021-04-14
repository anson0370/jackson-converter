const test = require('ava');
const jacksonConverter = require('../index');
const jacksonConverterPrefixAssigned = require('../index').getInstance('@id:');

test('object', t => {
  const jsonStr = `{
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
}`;
  const obj = jacksonConverter.parse(jsonStr);

  t.is(obj.id, 1);
  t.is(obj['@id'], undefined);
  t.is(obj.department.id, 3);
  t.is(obj.department.department.id, 2);
  t.is(obj.department.department.department, obj);
});

test('array', t => {
  const jsonStr = `{
    "@id":"@id:1312b20a-52b1-4042-8332-4dc9029d99b0",
    "id":1,
    "department":{
        "@id":"@id:277d635d-3f4f-45d5-8852-6437f2c4fc70",
        "id":3,
        "department":{
            "@id":"@id:c12b43ae-fa7c-4ad4-a84f-6fe1652f1fc9",
            "id":2,
            "department":"@id:1312b20a-52b1-4042-8332-4dc9029d99b0"
        },
        "children":[
            "@id:1312b20a-52b1-4042-8332-4dc9029d99b0",
            "@id:c12b43ae-fa7c-4ad4-a84f-6fe1652f1fc9",
            "@id:277d635d-3f4f-45d5-8852-6437f2c4fc70"
        ]
    },
    "children":[
        "@id:1312b20a-52b1-4042-8332-4dc9029d99b0",
        "@id:c12b43ae-fa7c-4ad4-a84f-6fe1652f1fc9",
        "@id:277d635d-3f4f-45d5-8852-6437f2c4fc70"
    ]
}`;
  const obj = jacksonConverterPrefixAssigned.parse(jsonStr);

  t.is(obj.id, 1);
  t.is(obj.children[0], obj);
  t.is(obj.children[1], obj.department.department);
  t.is(obj.children[2], obj.department);
  t.is(obj.department.children[0], obj.children[0]);
});

test('case', t => {
  const jsonStr = `{"res":[{"@id":"@id:3b0eb666-1c4e-44c8-966a-ebcf273677f5","id":"6f7da0036bab80aa5caf8b493bbb8807","createdAt":1616575637000,"updatedAt":1617785467000,"createdBy":{"@id":"@id:2df2c8c6-6c54-4d42-bb95-3b6130fc6b6b"},"updatedBy":{"@id":"@id:6d859072-12f4-43fc-be69-6c17496f12c6"},"key":"gaia_zh-CN","originalKey":"zh-CN","desc":"简体中文","locale":"zh-CN","enabled":true},{"@id":"@id:41b6138c-058c-4bb5-9cc0-8ac79419ae08","id":"9a62883f9c85a5833200cc52a7529ae6","createdAt":1616654994000,"updatedAt":1617349028000,"createdBy":{"@id":"@id:fcee7e7c-b53b-4a5a-ba4c-0e70ffacfb97"},"updatedBy":{"@id":"@id:ad1be6e1-f04a-4104-b8f4-e4ca7b147a72"},"key":"gaia_en-US","originalKey":"en-US","desc":"English Language","locale":"en-US","enabled":true}],"code":200,"success":true}`;

  const obj = jacksonConverter.parse(jsonStr);
  t.is(obj.res[0].id, '6f7da0036bab80aa5caf8b493bbb8807');
});

test('@id after', t => {
  const jsonStr = `{
    "id":1,
    "department":{
        "id":3,
        "department":{
            "id":2,
            "department":"@id:cf1f315b-a5b4-4313-a945-f5f2d6e90532",
            "@id":"@id:8bc5cd50-376b-47e4-afee-6d2392e70c52"
        },
        "@id":"@id:1072f8d5-61e1-46eb-bb4e-b45f3504b669"
    },
    "@id":"@id:cf1f315b-a5b4-4313-a945-f5f2d6e90532"
}`;
  const obj = jacksonConverter.parse(jsonStr);

  t.is(obj.id, 1);
  t.is(obj['@id'], undefined);
  t.is(obj.department.id, 3);
  t.is(obj.department.department.id, 2);
  t.is(obj.department.department.department, obj);
});

test('stringify', t => {
  const obj1 = {key: 1};
  const obj2 = {key: 2};
  obj1.obj = obj2;
  obj2.obj = obj1;

  const jsonStr = jacksonConverter.stringify(obj1);
  console.log(jsonStr);
  t.pass();

  const obj = jacksonConverter.parse(jsonStr);
  t.is(obj.obj.key, 2);
  t.is(obj.obj.obj.key, 1);
});
