import Route from "./Route";

export default class Router
{
    constructor(options)
    {
        this._routes = [];

        this._current = null;

        this._mode =
            options && options.mode && options.mode === 'history'  && !!(history.pushState) ? 'history' : 'hash';

        this._root =
            options && options.root ? '/' + Router._clearSlashes(options.root) + '/' : '/';
    }

    getFragment()
    {
        let fragment = '';

        if (this._mode === 'history') {
            fragment = Router._clearSlashes(decodeURI(location.pathname + location.search));
            fragment = fragment.replace(/\?(.*)$/, '');
            fragment = this._root !== '/' ? fragment.replace(this._root, '') : fragment;
        } else {
            const match = window.location.href.match(/#(.*)$/);
            fragment = match ? match[1] : '';
        }

        return Router._clearSlashes(fragment);
    }

    add(path, handler)
    {
        this._routes.push({ route: Route.create(path), handler: handler});

        return this;
    }

    remove(path)
    {
        for (let i = 0; i < this._routes.length; i++) {
            if (path === this._routes[i].route.path) {
                this._routes.splice(i, 1);
                return this;
            }
        }

        return this;
    }

    clear()
    {
        this._routes = [];
        this._mode = '';
        this._root = '/';

        return this;
    }

    check(f)
    {
        let fragment = f || this.getFragment();

        if (fragment.charAt(0) !== '/') {
            fragment = '/' + fragment;
        }

        for (let i = 0; i < this._routes.length; i++) {
            const route = this._routes[i].route;
            const handler = this._routes[i].handler;

            if (route.match(fragment)) {
                handler.call({}, route.parameters || {});
                return this;
            }
        }

        return this;
    }

    watch()
    {
        const self = this;

        const fn = function() {
            if (self._current !== self.getFragment()) {
                self._current = self.getFragment();
                self.check(self._current);
            }
        };

        clearInterval(this._interval);

        this._interval = setInterval(fn, 50);

        return this;
    }

    nav(path)
    {
        path = path ? path : '';

        if(this._mode === 'history') {
            history.pushState(null, null, this._root + Router._clearSlashes(path));
        } else {
            window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + path;
        }

        return this;
    }

    static _clearSlashes(path)
    {
        return path.toString().replace(/\/$/, '').replace(/^\//, '');
    }
}
