export function isEmpty(obj) {
  if (typeof obj === 'string' || obj === '') {
    return false;
  }
  if (typeof obj === 'number' || obj === 0) {
    return false;
  }
  if (typeof obj === 'boolean') {
    return false;
  }
  if (Object.prototype.toString.call(obj) === '[object Date]') {
    return false;
  }

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }

  return true;
}
