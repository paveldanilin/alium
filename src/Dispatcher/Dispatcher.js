export default class Dispatcher
{
    constructor()
    {
        this._callbacks = {};
        this._isPending = {};
        this._isHandled = {};
        this._state = Dispatcher.STATE_WAITING;
        this._payload = null;
    }

    static get STATE_DISPATCHING() {
        return 'dispatching';
    }

    static get STATE_WAITING() {
        return 'waiting';
    }

    get state()
    {
        return this._state;
    }

    register(f)
    {
        if (typeof f !== 'function') {
            throw new Error('Could not register dispatcher callback, since it is not a function');
        }

        const callbackId = 'ID_' + Object.keys(this._callbacks).length.toString();

        this._callbacks[callbackId] = f;

        return callbackId;
    }

    dispatch(payload)
    {
        if (this.state === Dispatcher.STATE_DISPATCHING) {
            throw new Error('Dispatching is not fulfilled');
        }

        this._state = Dispatcher.STATE_DISPATCHING;
        this._payload = payload;

        for (let id in this._callbacks) {
            this._isPending[id] = false;
            this._isHandled[id] = false;
        }

        try {
            for (let id in this._callbacks) {

                if (this._isPending[id]) {
                    continue;
                }

                this._fireCallback(id);
            }
        } finally {
            this._state = Dispatcher.STATE_WAITING;
            this._payload = null;
        }
    }

    waitFor(ids)
    {
        if (! Array.isArray(ids)) {
            if (typeof ids === 'string') {
                ids = [ids];
            } else {
                throw new Error('Expected array of ids or string');
            }
        }

        if (this.state !== Dispatcher.STATE_DISPATCHING) {
            throw new Error('Must be invoked while dispatching');
        }

        for (let i = 0 ; i < ids.length; i++) {
            const id = ids[i];

            if (this._isPending[id]) {
                continue;
            }

            this._fireCallback(id);
        }
    }

    _fireCallback(id)
    {
        this._isPending[id] = true;
        this._callbacks[id](this._payload);
        this._isHandled[id] = true;
    }

}
