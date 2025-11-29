export function tryParseJSON<T>(json: string): T | null {
  try {
    return JSON.parse(json);
  }
  catch (error) {
    console.error('Error parsing JSON:', error);
    return null;
  }
}

export function tryJSONStringify<T>(obj: T): string | null {
  try {
    return JSON.stringify(obj);
  }
  catch (error) {
    console.error('Error stringifying JSON:', error);
    return null;
  }
}

export function cn(...classes: Array<string | number | boolean | undefined | null>) {
  return classes.filter(Boolean).join(' ');
}
