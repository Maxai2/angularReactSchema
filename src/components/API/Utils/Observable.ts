import { FabricEvent } from '.';

class ObservableObject {
    private eventListeners: any;

    private removeEventListener = (eventName: string, handler?: (e: Partial<FabricEvent<Event>>) => void) => {
        if (!this.eventListeners[eventName]) {
            return;
        }
        let eventListener = this.eventListeners[eventName];
        if (handler) {
            eventListener[eventListener.indexOf(handler)] = false;
        }
        else {
            let k = eventListener.length;
            while (k--) {
                eventListener[k] = false;
            }
        }
    }

    public on = (eventName: string, handler: (e: Partial<FabricEvent<Event>>) => void): ObservableObject => {
        if (!this.eventListeners) {
            this.eventListeners = {};
        }

        if (!this.eventListeners[eventName]) {
            this.eventListeners[eventName] = [];
        }
        this.eventListeners[eventName].push(handler);
        return this;
    }

    public off = (eventName?: any, handler?: (e: Partial<FabricEvent<Event>>) => void): ObservableObject => {
        if (!this.eventListeners) {
            return this;
        }

        if (!eventName && !handler) {
            for (eventName in this.eventListeners) {
                this.removeEventListener(eventName);
            }
        }
        else {
            this.removeEventListener(eventName, handler);
        }
        return this;
    }

    public trigger = (eventName: string, options?: Partial<FabricEvent<Event>>): ObservableObject => {
        if (!this.eventListeners) {
            return this;
        }

        let listenersForEvent = this.eventListeners[eventName];
        if (!listenersForEvent) {
            return this;
        }

        for (let i = 0, len = listenersForEvent.length; i < len; i++) {
            listenersForEvent[i] && listenersForEvent[i].call(this, options || {});
        }
        this.eventListeners[eventName] = listenersForEvent.filter(value => {
            return value !== false;
        });

        return this;
    }
}

export default ObservableObject;