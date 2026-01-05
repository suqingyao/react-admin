import { breakpointsTailwind } from '@nova-core/hooks';
import { StorageManager } from '@nova-core/shared/cache';
import { isMacOs, merge } from '@nova-core/shared/utils';
import type { DeepPartial } from '@nova-core/typings';
import { createStore } from 'zustand/vanilla';
import { defaultPreferences } from './config';
import type { InitialOptions, Preferences } from './types';
import { updateCSSVariables } from './update-css-variables';

const STORAGE_KEY = 'preferences';
const STORAGE_KEY_LOCALE = `${STORAGE_KEY}-locale`;
const STORAGE_KEY_THEME = `${STORAGE_KEY}-theme`;

class PreferenceManager {
  private cache: null | StorageManager = null;
  private initialPreferences: Preferences = defaultPreferences;
  private isInitialized: boolean = false;

  // Zustand store for reactivity
  public store = createStore<Preferences>(() => defaultPreferences);

  constructor() {
    this.cache = new StorageManager();
    // Initialize store with loaded prefs
    this.store.setState(this.loadPreferences());
  }

  // Debounced save to avoid frequent cache writes
  private debouncedSave = (() => {
    let timeout: any;
    return (preference: Preferences) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        this._savePreferences(preference);
      }, 150);
    };
  })();

  clearCache() {
    [STORAGE_KEY, STORAGE_KEY_LOCALE, STORAGE_KEY_THEME].forEach((key) => {
      this.cache?.removeItem(key);
    });
  }

  public getInitialPreferences() {
    return this.initialPreferences;
  }

  public getPreferences() {
    return this.store.getState();
  }

  public async initPreferences({ namespace, overrides }: InitialOptions) {
    if (this.isInitialized) {
      return;
    }
    this.cache = new StorageManager({ prefix: namespace });
    this.initialPreferences = merge({}, overrides, defaultPreferences);

    const mergedPreference = merge({}, this.loadCachedPreferences() || {}, this.initialPreferences);

    this.updatePreferences(mergedPreference);
    this.setupWatcher();
    this.initPlatform();
    this.isInitialized = true;
  }

  resetPreferences() {
    const newState = { ...this.initialPreferences };
    this.store.setState(newState);
    this.debouncedSave(newState);

    [STORAGE_KEY, STORAGE_KEY_THEME, STORAGE_KEY_LOCALE].forEach((key) => {
      this.cache?.removeItem(key);
    });
    this.updatePreferences(newState);
  }

  public updatePreferences(updates: DeepPartial<Preferences>) {
    const currentState = this.store.getState();
    const mergedState = merge({}, currentState, updates);

    this.store.setState(mergedState);
    this.handleUpdates(updates);
    this.debouncedSave(mergedState);
  }

  private _savePreferences(preference: Preferences) {
    this.cache?.setItem(STORAGE_KEY, preference);
    this.cache?.setItem(STORAGE_KEY_LOCALE, preference.app.locale);
    this.cache?.setItem(STORAGE_KEY_THEME, preference.theme.mode);
  }

  private handleUpdates(updates: DeepPartial<Preferences>) {
    const themeUpdates = updates.theme || {};
    const appUpdates = updates.app || {};
    const currentState = this.store.getState();

    if (themeUpdates && Object.keys(themeUpdates).length > 0) {
      updateCSSVariables(currentState);
    }

    if (Reflect.has(appUpdates, 'colorGrayMode') || Reflect.has(appUpdates, 'colorWeakMode')) {
      this.updateColorMode(currentState);
    }
  }

  private initPlatform() {
    if (typeof document === 'undefined') return;
    const dom = document.documentElement;
    dom.dataset.platform = isMacOs() ? 'macOs' : 'window';
  }

  private loadCachedPreferences() {
    return this.cache?.getItem<Preferences>(STORAGE_KEY);
  }

  private loadPreferences(): Preferences {
    return this.loadCachedPreferences() || { ...defaultPreferences };
  }

  private setupWatcher() {
    if (this.isInitialized || typeof window === 'undefined') {
      return;
    }

    // Window resize listener for isMobile
    // Using breakpointsTailwind constant for consistency with hooks
    const updateMobile = () => {
      const width = window.innerWidth;
      // md: 768px from Tailwind defaults
      const mdBreakpoint =
        typeof breakpointsTailwind.md === 'number'
          ? breakpointsTailwind.md
          : parseInt(breakpointsTailwind.md as string, 10);

      const isMobile = width < mdBreakpoint;

      if (this.store.getState().app.isMobile !== isMobile) {
        this.updatePreferences({
          app: { isMobile },
        });
      }
    };

    window.addEventListener('resize', updateMobile);
    updateMobile(); // Initial check

    // System theme listener
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', ({ matches: isDark }) => {
        if (this.store.getState().theme.mode === 'auto') {
          this.updatePreferences({
            theme: { mode: isDark ? 'dark' : 'light' },
          });
          this.updatePreferences({
            theme: { mode: 'auto' },
          });
        }
      });
  }

  private updateColorMode(preference: Preferences) {
    if (preference.app && typeof document !== 'undefined') {
      const { colorGrayMode, colorWeakMode } = preference.app;
      const dom = document.documentElement;
      const COLOR_WEAK = 'invert-mode';
      const COLOR_GRAY = 'grayscale-mode';
      colorWeakMode ? dom.classList.add(COLOR_WEAK) : dom.classList.remove(COLOR_WEAK);
      colorGrayMode ? dom.classList.add(COLOR_GRAY) : dom.classList.remove(COLOR_GRAY);
    }
  }
}

const preferencesManager = new PreferenceManager();
export { PreferenceManager, preferencesManager };
