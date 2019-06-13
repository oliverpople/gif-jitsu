export default function ConvertArrayOfObjectsToArray(arrayOfObjects) {
  var twoDimArray = arrayOfObjects.map(function(obj) {
    return Object.keys(obj)
      .sort()
      .map(function(key) {
        return obj[key];
      });
  });
  var oneDimArray = [].concat(...twoDimArray);
  return oneDimArray;
}
