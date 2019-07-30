'use strict';

const hasOwn = {}.hasOwnProperty;

module.exports = {
  toTitleCase(text) {
    return text.replace(/\w\S*/g, function titleCase(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  },

  capitalize(text) {
    return text.replace(/\w\S*/g, function capitalize(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1);
    });
  },

  pascalToCamelCase(name) {
    return name[0].toLowerCase() + name.substring(1);
  },

  isValidURL(value) {
    return /^((?:(?:(?:https?):)?\/\/)?)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
  },

  isArray(array) {
    return array !== null && array !== undefined && array.constructor === Array;
  },

  /**
   * Only verifies prop on object and not on prototype chain.
   */
  hasProperty(obj, key) {
    return obj !== null && obj !== undefined && Object.prototype.hasOwnProperty.call(obj, key);
  },

  containsValue(array, value) {
    var i;

    if(!this.isArray(array)) {
      throw TypeError('Invalid datatype');
    }

    for (i = 0; i < array.length; ++i) {
      if (array[i] === value) {
        return true;
      }
    }

    return false;
  },

  /**
   * Provide simple "Class" extension mechanism
   */
  protoExtend(sub) {
    const Super = this;
    const Constructor = hasOwn.call(sub, 'constructor')
      ? sub.constructor
      : function applyArgs(...args) {
        Super.apply(this, args);
      };

    Object.assign(Constructor, Super);
    Constructor.prototype = Object.create(Super.prototype);
    Object.assign(Constructor.prototype, sub);

    return Constructor;
  }
};
