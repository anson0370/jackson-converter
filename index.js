function getInstance(prefix) {
  function isRef(obj) {
    return typeof obj === 'string' && obj.startsWith(prefix);
  }

  function visitJsonObj(jsonObj, parentObj, selfPath, refTargets) {
    // 如果是 ref 对象，则从 refTargets 中找到对象并替换掉
    // 首次进入 visitJsonObj 肯定不会是 ref 对象
    if (isRef(jsonObj)) {
      const refTarget = refTargets[jsonObj];
      if (refTarget == null) {
        throw new Error(`Can not find object for refId: ${jsonObj}`);
      }
      parentObj[selfPath] = refTarget;
      return;
    }
    // 如果对象本身有 @id 的属性，则存到引用对象里面
    const refId = jsonObj['@id'];
    if (refId != null) {
      refTargets[refId] = jsonObj;
    }
    
    if (isObj(jsonObj)) {
      Object.keys(jsonObj).forEach(objKey => {
        const nextObj = jsonObj[objKey];
        visitJsonObj(nextObj, jsonObj, objKey, refTargets);
      });
      return;
    }
    if (isArray(jsonObj)) {
      jsonObj.forEach((nextObj, arrayIndex) => {
        visitJsonObj(nextObj, jsonObj, arrayIndex, refTargets);
      });
      return;
    }
    return;
  }

  return {
    parse: (jsonString) => {
      const jsonObj = JSON.parse(jsonString);

      if (!isObj(jsonObj) && !isArray(jsonObj)) {
        return jsonObj;
      }

      const refTragets = {};

      visitJsonObj(jsonObj, null, null, refTragets);
      return jsonObj;
    }
  };
}

function isObj(obj) {
  return !isArray(obj) && typeof obj === 'object' && obj != null;
}

function isArray(obj) {
  return Array.isArray(obj);
}

module.exports = {
  parse: getInstance('@id:').parse,
  getInstance
}
