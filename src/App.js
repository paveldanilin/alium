import "@babel/polyfill";

import Router from "./Router/Router.js";
import HttpClient from "./HttpClient/HttpClient.js";
import Dispatcher from "./Dispatcher/Dispatcher.js";
import HttpRequest from "./HttpClient/HttpRequest";

export default class App
{
    constructor(components, routes)
    {
        this._router     = new Router();
        this._dispatcher = new Dispatcher();
        this._appElement = null;
        this._components = components || {};
        this._loadedComponents = {};
        this._currentComponenet = null;

        this._registerRoutes(routes);
    }

    http(options)
    {
        return HttpClient.create(options);
    }

    router()
    {
        return this._router;
    }

    dispatcher()
    {
        return this._dispatcher;
    }

    run(startPath)
    {
        this._appElement = document.querySelector('[application]');

        if (! this._appElement) {
            throw new Error('Not found application element');
        }

        /*
        this.dispatcher().register(function (payload) {
            const type = payload.type || null;

            if (type !== 'model-update') {
                return;
            }

            console.log(payload.component);
        });
        */

        this.router().watch().nav(startPath || '/');
    }

    _registerRoutes(routes)
    {
        const self = this;

        for (let routeIdx in routes) {
            const route     = routes[routeIdx];
            const path      = route.path || '/';
            const component = route.component || null;

            console.log(`registerRoute(${path}, ${component})`);

            this.router().add(path, function(parameters) {
                self._onRouteActivate(path, component, parameters);
            });
        }
    }

    _lookupComponent(component)
    {
        return this._components[component] || null;
    }

    _getComponent(component, parameters)
    {
        if (this._loadedComponents[component]) {
            return Promise.resolve(this._loadedComponents[component]);
        }

        const self = this;

        return new Promise(function(resolve, reject) {

            let realComponent = self._lookupComponent(component);

            if (realComponent) {
                realComponent = new realComponent();

                HttpRequest.fetch(
                    `templates/${component}.html`,
                    {responseFormat: HttpClient.RESPONSE_TEXT}).
                then((html) => {
                    const wrapper = document.createElement('div');

                    wrapper.innerHTML = html;

                    realComponent._setHtmlElement(wrapper.innerHTML);

                    realComponent.onCreate(parameters);

                    const proxyComponent = new Proxy(realComponent, {
                        set(target, property, value) {

                            const oldValue = target[property];

                            target[property] = value;

                            if (property.charAt(0) !== '_') {
                                realComponent._onChange(property, oldValue, value);

                                self.dispatcher().dispatch({
                                    type: 'model-update',
                                    component: realComponent,
                                    componentName: component,
                                    oldValue: oldValue,
                                    newValue: value,
                                    property: property
                                });
                            }

                            return true;
                        }
                    });

                    self._loadedComponents[component] = proxyComponent;

                    resolve(self._loadedComponents[component]);
                });
            } else {
                reject();
            }

        });
    }

    _onRouteActivate(path, component, parameters)
    {
        if (this._currentComponenet !== null) {
            this._currentComponenet._destroy();
        }

        console.log(`OnRouteActivate(${path}, ${component}, ${JSON.stringify(parameters)})`);

        this.dispatcher().dispatch({
            type: 'route-activate',
            path: path,
            component: component,
            parameters: parameters
        });

        const self = this;

        this._getComponent(component, parameters).then((component) => {
            self._appElement.innerHTML = component.getHtmlElement();

            self._currentComponenet = component;

            component._bindModels();
            component.onActive();
            component.update();
        });
    }
}
