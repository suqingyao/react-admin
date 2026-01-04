import { EventEmitter } from '@suqingyao/utils';

interface Events {
  triggerFireworks: string | undefined;
}

const eventEmitter = new EventEmitter<Events>();

export default eventEmitter;
