import { locale } from 'dayjs';

import 'dayjs/locale/zh-cn';
import 'dayjs/locale/en';

/**
 * Set dayjs locale
 *
 * @param lang
 */
export function setDayjsLocale() {
  const localMap = {
    'en-US': 'en',
    'zh-CN': 'zh-cn',
  } satisfies Record<string, string>;

  locale(localMap['zh-CN']);
}
