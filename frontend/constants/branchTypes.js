export const getListByType = (type) => {
  switch (type) {
    case 'open':
      return [
        { id: 1, name: 'is empty' },
        { id: 2, name: 'is not empty' },
      ];
    case 'quiz':
      return [
        { id: 3, name: 'true' },
        { id: 4, name: 'false ' },
      ];
    case 'multiple':
      return [
        { id: 5, name: 'is' },
        { id: 6, name: 'is not ' },
        { id: 7, name: 'is any of' },
        { id: 8, name: 'is none of' },
      ];
    case 'rate':
      return [
        { id: 9, name: 'is empty' },
        { id: 10, name: 'is not empty' },
        { id: 11, name: 'equal' },
        { id: 12, name: 'not equal' },
      ];
    case 'number':
      return [
        { id: 13, name: 'is empty' },
        { id: 14, name: 'is not empty' },
        { id: 15, name: 'equal' },
        { id: 16, name: 'not equal' },
      ];
    case 'email':
      return [
        { id: 17, name: 'is empty' },
        { id: 18, name: 'is not empty' },
      ];
    case 'link':
      return [
        { id: 19, name: 'is empty' },
        { id: 20, name: 'is not empty' },
      ];
    case 'address':
      return [
        { id: 21, name: 'is empty' },
        { id: 22, name: 'is not empty' },
      ];
    default:
      return [
        { id: 23, name: 'is empty' },
        { id: 24, name: 'is not empty' },
      ];
  }
};
export const getRuleForCurrentType = (type, value, choise) => {
  switch (type) {
    case 'is empty': {
      return !value || !value.length;
    }
    case 'true': {
      return choise.name === value;
    }
    case 'false': {
      return choise.name !== value;
    }
    case 'is not empty': {
      return !!value && value.length;
    }
    case 'is': {
      return (
        (choise.length &&
          choise.filter((item) => value.every((val) => val === item.name)).length ===
            choise.length) ||
        choise.name === value
      );
    }
    case 'is not': {
      return (
        (choise.length &&
          !choise.filter((item) => value.every((val) => val === item.name)).length) ||
        choise.name !== value
      );
    }
    case 'is any of': {
      return choise.filter((item) => value.some((val) => val === item.name)).length;
    }
    case 'is none of': {
      return !choise.filter((item) => value.some((val) => val === item.name)).length;
    }
    case 'equal': {
      return +choise.name === +value;
    }
    case 'not equal': {
      return +choise.name !== +value;
    }
    case 'contains': {
      return value;
    }
    case 'does not contain': {
      return value;
    }
    default: {
      return false;
    }
  }
};
