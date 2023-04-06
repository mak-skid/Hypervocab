import { createStackNavigator } from "@react-navigation/stack";
// @ts-expect-error TS(6142): Module './page/memoriseScreen/memorisepage' was re... Remove this comment to see the full error message
import MemoriseScreen from './page/memoriseScreen/memorisepage';
// @ts-expect-error TS(6142): Module './page/memoriseScreen/swipeCard' was resol... Remove this comment to see the full error message
import SwipeCard from "./page/memoriseScreen/swipeCard";
import React from 'react';

const MemoriseStack = createStackNavigator();

export const MemoriseStackScreen = () => (
    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    <MemoriseStack.Navigator>
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <MemoriseStack.Screen name="MemoriseScreen" component={MemoriseScreen} options={{headerShown:false}} />
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <MemoriseStack.Screen name="SwipeCard" component={SwipeCard} options={{headerShown:false}} />
    </MemoriseStack.Navigator>
)