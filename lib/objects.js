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
