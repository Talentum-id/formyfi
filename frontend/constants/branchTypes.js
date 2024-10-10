export const getListByType = (type) => {
  switch (type) {
    case 'open':
      return [
        { id: 1, name: 'is empty' },
        { id: 2, name: 'is not empty' },
      ];
    case 'quiz':
      return [
        { id: 1, name: 'true' },
        { id: 2, name: 'false ' },
      ];
    case 'multiple':
      return [
        { id: 1, name: 'is' },
        { id: 2, name: 'is not ' },
        { id: 3, name: 'is any of' },
        { id: 4, name: 'is none of' },
      ];
    case 'rate':
      return [
        { id: 1, name: 'is empty' },
        { id: 2, name: 'is not empty' },
        { id: 3, name: 'equal' },
        { id: 4, name: 'not equal' },
      ];
    case 'number':
      return [
        { id: 1, name: 'is empty' },
        { id: 2, name: 'is not empty' },
        { id: 3, name: 'equal' },
        { id: 4, name: 'not equal' },
      ];
    case 'email':
      return [
        { id: 1, name: 'contains' },
        { id: 2, name: 'does not contain' },
        { id: 3, name: 'is' },
        { id: 4, name: 'is not' },
      ];
    case 'link':
      return [
        { id: 1, name: 'is empty' },
        { id: 2, name: 'is not empty' },
      ];
    case 'address':
      return [
        { id: 1, name: 'is empty' },
        { id: 2, name: 'is not empty' },
        { id: 3, name: 'contains' },
        { id: 4, name: 'does not contain' },
      ];
    default:
      return [
        { id: 1, name: 'is empty' },
        { id: 2, name: 'is not empty' },
      ];
  }
};
export const getRuleForCurrentType = (type, value, choise) => {
  switch (type) {
    case 'is empty': {
      return !value;
    }
    case 'is not empty': {
      return !!value;
    }
    case 'is': {
      return (
        choise.filter((item) => value.every((val) => val === item.name)).length === choise.length
      );
    }
    case 'is not': {
      return !choise.filter((item) => value.some((val) => val === item.name)).length;
    }
    case 'is any of': {
      return choise.filter((item) => value.some((val) => val === item.name)).length;
    }
    case 'is none of': {
      return !choise.filter((item) => value.some((val) => val === item.name)).length;
    }
    default: {
      return false;
    }
  }
};
