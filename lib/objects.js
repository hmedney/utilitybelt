/* eslint-disable no-param-reassign */
function getUniqueValues(objectArray, prop) {
  const valueSet = objectArray.reduce((resultSet, element) => {
    resultSet.add(element[prop]);
    return resultSet;
  }, new Set());
  return Array.from(valueSet);
}

module.exports.groupElements = function groupElements(objectArray, props) {
  const rootGroup = [{entries: objectArray}];

  const addNextLevel = (groups, level) => {
    groups.forEach((group) => {
      if (level === props.length) {
        return;
      }

      // add this level
      const prop = props[level];
      const values = getUniqueValues(group.entries, prop);
      group.children = values.map((value) => ({
        prop,
        value,
        entries: group.entries.filter((object) => object[prop] === value)
      }));

      addNextLevel(group.children, level + 1);
    });
  };
  addNextLevel(rootGroup, 0);

  return rootGroup[0].children;
};

module.exports.pruneObject = function pruneObject(object, filter) {
  const pruned = {};
  const entries = Object.entries(object);
  entries.forEach((entry) => {
    const [key, value] = entry;
    if (filter({key, value}) === true) {
      pruned[key] = value;
    }
  });
  return pruned;
};

// iterate object and call (callback) for each value
// note: use jsonpath package instead
module.exports.iterateObject = function iterateObject(object, callback) {
  const concatPath = (a, b) => (a ? `${a}.${b}` : b);
  const iterateThisObject = (value, path = null) => {
    if (value != null && typeof value === 'object') {
      Object.entries(value).forEach(([k, v]) => {
        iterateThisObject(v, concatPath(path, k));
      });
    } else if (Array.isArray(value)) {
      value.forEach((v, i) => iterateThisObject(v, concatPath(path, `[${String(i)}]`)));
    } else {
      callback(path, value);
    }
  };
  return iterateThisObject(object);
};
