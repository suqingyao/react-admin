import { DEFAULT_TIME_ZONE_OPTIONS } from '@nova-core/preferences';
import { getCurrentTimezone, setCurrentTimezone } from '@nova-core/shared/utils';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { createSecureStorage } from '../setup';

interface TimezoneHandler {
  getTimezone?: () => Promise<null | string | undefined>;
  getTimezoneOptions?: () => Promise<
    {
      label: string;
      value: string;
    }[]
  >;
  setTimezone?: (timezone: string) => Promise<void>;
}

const getDefaultTimezoneHandler = (): TimezoneHandler => {
  return {
    getTimezoneOptions: () => {
      return Promise.resolve(
        DEFAULT_TIME_ZONE_OPTIONS.map((item) => {
          return {
            label: item.label,
            value: item.timezone,
          };
        }),
      );
    },
  };
};

let customTimezoneHandler: null | Partial<TimezoneHandler> = null;

const setTimezoneHandler = (handler: Partial<TimezoneHandler>) => {
  customTimezoneHandler = handler;
};

const getTimezoneHandler = () => {
  return {
    ...getDefaultTimezoneHandler(),
    ...customTimezoneHandler,
  };
};

interface TimezoneState {
  timezone: string;
  setTimezone: (timezone: string) => Promise<void>;
  getTimezoneOptions: () => Promise<{ label: string; value: string }[]>;
  initTimezone: () => Promise<void>;
}

export const useTimezoneStore = create<TimezoneState>()(
  persist(
    (set, get) => ({
      timezone: getCurrentTimezone(),

      initTimezone: async () => {
        try {
          const timezoneHandler = getTimezoneHandler();
          const timezone = await timezoneHandler.getTimezone?.();
          if (timezone) {
            set({ timezone });
          }
          setCurrentTimezone(get().timezone);
        } catch (error) {
          console.error('Failed to initialize timezone:', error);
        }
      },

      setTimezone: async (timezone: string) => {
        const timezoneHandler = getTimezoneHandler();
        await timezoneHandler.setTimezone?.(timezone);
        set({ timezone });
        setCurrentTimezone(timezone);
      },

      getTimezoneOptions: async () => {
        const timezoneHandler = getTimezoneHandler();
        return (await timezoneHandler.getTimezoneOptions?.()) || [];
      },
    }),
    {
      name: 'core-timezone',
      storage: createJSONStorage(() => createSecureStorage('nova')),
      partialize: (state) => ({ timezone: state.timezone }),
    },
  ),
);

// Initialize on load if possible, or let consumer call it
// useTimezoneStore.getState().initTimezone();

export { setTimezoneHandler };
