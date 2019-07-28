export default class BaseComponent {

    constructor()
    {
        this._htmlElement = null;
        this._models = {};
        this._intervals = [];
    }

    onCreate(parameters)
    {
        console.log('onCreate');
    }

    onChange(property, oldValue, newValue)
    {
        console.log(`onChange(${property})`);
    }

    onActive()
    {
        console.log('onActive');
    }

    getHtmlElement()
    {
        return this._htmlElement;
    }

    update()
    {
        for (let modelIdx in this._models) {
            this._updateModel(modelIdx, this[modelIdx]);
        }
    }

    schedule(f, interval)
    {
        this._intervals.push(setInterval(f, interval));
    }

    _onChange(property, oldValue, newValue)
    {
        if (oldValue === newValue) {
            return;
        }

        if (this.onChange(property, oldValue, newValue) === false) {
            return;
        }

        this._updateModel(property, newValue);
    }

    _destroy()
    {
        for (let i = 0 ; i < this._intervals.length; i++) {
            clearInterval(this._intervals[i]);
        }
        this._intervals = [];
    }

    _updateModel(property, newValue)
    {
        const modelList = this._models[property] || null;

        if (modelList === null) {
            return;
        }

        let value = null;

        if (typeof newValue === 'function') {
            value = newValue();
        } else {
            value = newValue || null;
        }

        modelList.forEach(function (model) {
            if (model.tagName === 'input') {
                model.htmlElement.value = value;
            } else {
                model.htmlElement.textContent = value;
            }
        });
    }

    _setHtmlElement(htmlElement)
    {
        this._htmlElement = htmlElement;
    }

    _bindModels()
    {
        const elementsWithModel = document.querySelectorAll('[model]');
        const component         = this;
        this._models            = {};

        Array.from(elementsWithModel).forEach((function(element) {

            const model = component._parseModelExpression(element.getAttribute('model'));

            component._bindModel(model, element);
        }));

        this._addListeners();
    }

    _bindModel(model, element)
    {
        if (! this._models.hasOwnProperty(model.value)) {
            this._models[model.value] = [];
        }

        this._models[model.value].push({
            meta:           model,
            htmlElement:    element,
            tagName:        element.tagName.toLowerCase()
        });
    }

    _addListeners()
    {
        const component = this;

        for (let modelName in this._models) {
            const modelList = this._models[modelName];

            for (let modelIdx in modelList) {
                const model = modelList[modelIdx];

                if (model.tagName === 'input') {
                    model.htmlElement.addEventListener('input', function () {
                        component[model.meta.value] = model.htmlElement.value;
                    });
                }
            }

        }
    }

    _parseModelExpression(model)
    {
        if (! model.includes('(')) {
            return {
                type: 'property',
                value: model
            };
        }

        const bs = model.indexOf('(');
        const be = model.indexOf(')');

        const modelName = model.substr(0, bs);

        console.log(modelName);

        return {
            type: 'method',
            value: modelName
        };
    }
}
