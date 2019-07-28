import BaseComponent from "./Component/BaseComponent";

export default class PersonComponent extends BaseComponent{
    constructor()
    {
        super();
        this._personName = '';
    }

    onCreate(parameters)
    {
        this._personName = parameters.name || '';
    }
}
