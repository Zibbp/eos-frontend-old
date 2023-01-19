import { useState, useEffect } from "react";

interface EventBus {
  on: (event: string, callback: (...args: any[]) => void) => void;
  off: (event: string, callback: (...args: any[]) => void) => void;
  emit: (event: string, ...args: any[]) => void;
}

let listeners: { [event: string]: Array<(...args: any[]) => void> } = {};

export const useEventBus = (): EventBus => {
  const [eventBus] = useState<EventBus>({
    on: (event, callback) => {
      if (!listeners[event]) {
        listeners[event] = [];
      }
      listeners[event].push(callback);
    },
    off: (event, callback) => {
      if (!listeners[event]) {
        return;
      }
      listeners[event] = listeners[event].filter((cb) => cb !== callback);
    },
    emit: (event, ...args) => {
      if (!listeners[event]) {
        return;
      }
      listeners[event].forEach((cb) => cb(...args));
    },
  });

  useEffect(() => {
    return () => {
      listeners = {};
    };
  }, []);

  return eventBus;
};

export default useEventBus;
