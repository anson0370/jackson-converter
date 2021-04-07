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
