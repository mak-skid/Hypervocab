import { createStackNavigator } from '@react-navigation/stack';
import MemoriseScreen from './page/memoriseScreen/memorisepage';
import SwipeCard from "./page/memoriseScreen/swipeCard";
import React from 'react';

const MemoriseStack = createStackNavigator();

export const MemoriseStackScreen = () => (
    <MemoriseStack.Navigator>
        <MemoriseStack.Screen name="MemoriseScreen" component={MemoriseScreen} options={{headerShown:false}} />
        <MemoriseStack.Screen name="SwipeCard" component={SwipeCard} options={{headerShown:false}} />
    </MemoriseStack.Navigator>
)