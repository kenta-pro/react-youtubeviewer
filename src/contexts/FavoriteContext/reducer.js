export default (state, action) => {
  switch (action.type) {
    case "init": {
      const { ids } = action;
      return { ids, initialized: true };
    }
    case "add": {
      const { ids } = state;
      const { id } = action;
      const index = ids.indexOf(id);
      if (index !== -1) {
        return state;
      }
      ids.push(id);
      return { ...state, ids };
    }
    case "remove": {
      const { ids } = state;
      const { id } = action;
      const index = ids.indexOf(id);
      if (index === -1) {
        return state;
      }
      ids.splice(index, 1);
      return { ...state, ids };
    }
    default:
      throw new Error(`${action.type} is not defined.`);
  }
};
