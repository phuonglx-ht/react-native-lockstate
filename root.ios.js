import { NativeEventEmitter, NativeModules } from 'react-native';

const { RNLockState } = NativeModules;

class LockState extends NativeEventEmitter {
    _eventHandlers: Object;
    currentState: ?string;

    constructor() {
        super(RNLockState);

        this._eventHandlers = {
            change: new Map(),
            lockComplete: new Map(),
            screenChange: new Map(),
        };
        this.currentState = 'unknown';

        this.addListener('lockStateDidChange', (lockStateData) => {
            this.currentState = lockStateData.lockState;
        });
    }

    addEventListener(type: string, handler: Function) {
        if (type === 'change') {
            this._eventHandlers[type].set(
                handler,
                this.addListener('lockStateDidChange', (lockStateData) => {
                    handler(lockStateData)
                })
            );
        } else if (type === 'lockComplete') {
            this._eventHandlers[type].set(
                handler,
                this.addListener('lockComplete', (lockStateData) => {
                    handler(lockStateData)
                })
            );
        } else if (type === 'screenChange') {
            this._eventHandlers[type].set(
                handler,
                this.addListener('screenStateChange', (screenStateData) => {
                    handler(screenStateData)
                })
            );
        }
    }

    removeEventListener(type: string, handler: Function) {
        if (!this._eventHandlers[type].has(handler)) {
            return;
        }

        this._eventHandlers[type].get(handler).remove();
        this._eventHandlers[type].delete(handler);
    }
}

module.exports = new LockState();