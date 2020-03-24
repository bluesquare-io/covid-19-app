import {Navigation} from 'react-native-navigation';

import Main from './screens/Main';

Navigation.registerComponent('Main', () => Main);

Navigation.events().registerAppLaunchedListener(() => {
    Navigation.setRoot({
        root: {
            component: { name: 'Main' }
        }
    });
});
