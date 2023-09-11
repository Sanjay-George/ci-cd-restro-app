/* File author: Sanjay George */
const validateInt = (a) => {
  if (!a || isNaN(parseInt(a))) {
    return false;
  }
  return true;
};

const isStringUndefinedOrEmpty = (s) => {
  if (!s || !s.length) {
    return true;
  }
  return false;
};
const hochshuleEmailValidation = (value) => {
  if (/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@hs-fulda.de/.test(value)) {
    return true;
  } else {
    return false;
  }
};

module.exports = {
  validateInt,
  isStringUndefinedOrEmpty,
  hochshuleEmailValidation,
};
