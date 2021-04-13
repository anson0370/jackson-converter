const { v4: uuidv4 } = require('uuid');

function getInstance(prefix) {
  function generateUUID() {
    return prefix + uuidv4();
  }

  function isRef(value) {
    return typeof value === 'string' && value.startsWith(prefix);
  }

  return {
    parse: (jsonString) => {
      const refTargets = {};

      return JSON.parse(jsonString, function(key, value) {
        // 如果 key 是 @id 则把 this 放到引用池里备用
        if (key == '@id') {
          refTargets[value] = this;
          // 这里避免问题，直接不返回 @id 本身
          return undefined;
        }
        // 如果 value 是一个 ref 格式的字符串，则去引用池里找一下引用并替换掉
        if (isRef(value)) {
          const refTarget = refTargets[value];
          if (refTarget == null) {
            throw new Error(`Can not find object for refId: ${value}`);
          }
          return refTarget;
        }
        // 除此之外的情况都直接返回
        return value;
      });
    },
    stringify: (obj) => {
      return JSON.stringify(obj, function(key, value) {
        // 只处理 object
        if (isObj(value)) {
          // 如果 object 没有 @id ，生成一个
          if (value['@id'] == null) {
            const uuid = generateUUID();
            // 给原对象塞一个，必须塞，因为返回时为了保证顺序，是一个新对象。
            // 如果不给原对象塞会导致同对象再次被遍历到的时候仍然是没有 @id 的，就会爆栈
            value['@id'] = uuid;
            return {'@id': uuid, ...value};
          }
          // 如果有，返回 @id 的值
          return value['@id'];
        }
        // 其余情况直接返回
        return value;
      });
    }
  };
}

function isObj(obj) {
  return !Array.isArray(obj) && typeof obj === 'object' && obj != null;
}

const defaultInstance = getInstance('@id:');

module.exports = {
  parse: defaultInstance.parse,
  stringify: defaultInstance.stringify,
  getInstance
}
