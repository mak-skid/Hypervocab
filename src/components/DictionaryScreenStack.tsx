import { createStackNavigator } from "@react-navigation/stack";
// @ts-expect-error TS(6142): Module './page/dictionaryScreen/dictionarypage' wa... Remove this comment to see the full error message
import DictionaryScreen from './page/dictionaryScreen/dictionarypage'
// @ts-expect-error TS(6142): Module './page/dictionaryScreen/SettingPage' was r... Remove this comment to see the full error message
import SettingPage from "./page/dictionaryScreen/SettingPage";
import React from 'react';
// @ts-expect-error TS(6142): Module './page/dictionaryScreen/SelectFavDictionar... Remove this comment to see the full error message
import { SetFavDictionaries } from "./page/dictionaryScreen/SelectFavDictionary";

const DictionaryStack = createStackNavigator();

export const DictionaryStackScreen = () => (
    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    <DictionaryStack.Navigator>
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <DictionaryStack.Screen name="DictionaryScreen" component={DictionaryScreen} options={{headerShown:false}} />
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <DictionaryStack.Screen name="SettingPage" component={SettingPage} options={{headerShown:false}} />
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <DictionaryStack.Screen name="SetFavDictionaries" component={SetFavDictionaries} options={{headerShown:false}} />
    </DictionaryStack.Navigator>
)

