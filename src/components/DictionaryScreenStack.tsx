import { createStackNavigator } from "@react-navigation/stack";
import DictionaryScreen from './page/dictionaryScreen/dictionarypage'
import SettingPage from "./page/dictionaryScreen/SettingPage";
import React from 'react';
import { SetFavDictionaries } from "./page/dictionaryScreen/SelectFavDictionary";

const DictionaryStack = createStackNavigator();

export const DictionaryStackScreen = () => (
    <DictionaryStack.Navigator>
        <DictionaryStack.Screen name="DictionaryScreen" component={DictionaryScreen} options={{headerShown:false}} />
        <DictionaryStack.Screen name="SettingPage" component={SettingPage} options={{headerShown:false}} />
        <DictionaryStack.Screen name="SetFavDictionaries" component={SetFavDictionaries} options={{headerShown:false}} />
    </DictionaryStack.Navigator>
)

