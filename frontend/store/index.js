import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', {
  state: () => ({ step: 0 }),
  getters: {
    getStep: (state) => state.step,
  },
  actions: {
    setValue(value) {
      this.step = value;
    },
  },
});
