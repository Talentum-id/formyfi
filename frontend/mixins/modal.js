import { createApp } from 'vue';

const app = createApp({});
export const modal = createEmitter();

function createEmitter() {
  const events = {};

  return {
    on(event, callback) {
      if (!events[event]) {
        events[event] = [];
      }
      events[event].push(callback);
    },
    emit(event, ...args) {
      if (events[event]) {
        events[event].forEach((callback) => {
          callback(...args);
        });
      }
    },
    off(event, callback) {
      if (events[event]) {
        events[event] = events[event].filter((cb) => cb !== callback);
      }
    },
  };
}
