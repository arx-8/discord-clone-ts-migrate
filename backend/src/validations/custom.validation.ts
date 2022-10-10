const objectId = (value: $TSFixMe, helpers: $TSFixMe) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

export default {
  objectId,
};
