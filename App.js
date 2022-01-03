import React from 'react';
import { Provider } from 'react-redux';
import store from './src/store';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import RootStack from './src/components/mainpage';

export default class App extends React.Component {
    render () {
        return (
            <Provider store={store}>
                <ActionSheetProvider>
                    <RootStack />
                </ActionSheetProvider>
            </Provider>
        )
    }
}