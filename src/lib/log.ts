const LOG_TAG = 'ReactAdmin';

const colorConfig = {
  DEBUG: 'bg-[#f5f5f5] text-[#333]',
  INFO: 'bg-[#e7f5ff] text-[#0059b3]',
  WARN: 'bg-[#fff5cc] text-[#805500]',
  ERROR: 'bg-[#ffe6e6] text-[#b30000]',
};

export default class Log {
  static log(tag: string, message: string, level: keyof typeof colorConfig = 'DEBUG') {
    const color = colorConfig[level] || colorConfig.DEBUG;
    // eslint-disable-next-line no-console
    console.log(`%c${LOG_TAG} ${tag} %c${message}`, color, '');
  }
}
