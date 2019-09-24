export default {
  data: [],
  orderMap: {},
  sec: 0,
  channelOnline: false,
  serverOnline: undefined,
  filterAll: {
    event: null,
    sec: null
  },
  filterActive: {
    event: null,
    sec: null
  },
  filterInactive: {
    event: null,
    sec: null
  }
};

export const defaultFilterState = {
  event: null,
  sec: null
};
