import App from "./App.js";

import HomeComponent from "./HomeComponent";
import AboutComponent from "./AboutComponent";
import ContactsComponent from "./ContactsComponent";
import PersonComponent from "./PersonComponent";

const application = new App(
    {
        HomeComponent,
        AboutComponent,
        ContactsComponent,
        PersonComponent
    },
    [
        {
            path: '/',
            component: 'HomeComponent'
        },
        {
            path: '/about',
            component: 'AboutComponent'
        },
        {
            path: '/contacts',
            component: 'ContactsComponent'
        },
        {
            path: '/person/{name}',
            component: 'PersonComponent'
        }
    ]
);

application.run('/');
