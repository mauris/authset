const accessMapping = require('./accessMapping');

module.exports = (permission) => {
  if (!permission) {
    return null;
  }
  
  const [resource, access] = permission.split(':');
  if (!resource) {
    return null;
  }
  
  if (!access) {
    // wildcard access
    return `${resource}:*`;
  }
  
  let newAccess = access.toUpperCase();
  if (accessMapping[newAccess]) {
    newAccess = accessMapping[newAccess];
  }
  return `${resource}:${newAccess}`;
}