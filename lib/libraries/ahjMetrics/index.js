const expand = require('./expand');
const order = require('./orderBy');

module.exports = ({ahjs,orderBy,must}) => {
  const collection = expand(ahjs);
  console.log('EXPANDED:::\n',collection);
  console.log('EXPANDED:::COUNT\n',collection.length);
  return order({collection,orderBy,must});
};
