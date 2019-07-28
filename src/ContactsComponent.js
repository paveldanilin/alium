import BaseComponent from "./Component/BaseComponent";

export default class ContactsComponent extends BaseComponent{
    currentTime()
    {
        return (new Date()).toISOString();
    }
}
