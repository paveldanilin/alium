import BaseComponent from "./Component/BaseComponent";

export default class HomeComponent extends BaseComponent {

    onActive()
    {
        this.username = this.username || 'Guest';
        this.counter = 0;

        const self = this;

        this.schedule(function () {
            self.counter = self.counter + 1;
        }, 1000);
    }

    set username(username)
    {
        this._username = username;
    }

    get username()
    {
        return this._username;
    }

    get counter()
    {
        return this._counter;
    }

    set counter(counter)
    {
        this._counter = counter;
    }
}
