import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Icon } from  'react-native-elements';
import { SafeAreaView } from 'react-native';
// @ts-expect-error TS(6142): Module './FolderScreenNavigation' was resolved to ... Remove this comment to see the full error message
import { FoldersStackScreen } from './FolderScreenNavigation';
// @ts-expect-error TS(6142): Module './MemoriseScreenNavigation' was resolved t... Remove this comment to see the full error message
import { MemoriseStackScreen } from './MemoriseScreenNavigation';
// @ts-expect-error TS(6142): Module './DictionaryScreenStack' was resolved to '... Remove this comment to see the full error message
import { DictionaryStackScreen } from './DictionaryScreenStack';


const Stack = createBottomTabNavigator();

export default function RootStack() {
    return (
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <SafeAreaView style={{backgroundColor: 'black', flex:1}}>
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <NavigationContainer>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <Stack.Navigator
                    initialRouteName="DictionaryScreen"
                    screenOptions={{
                      headerShown: false,
                      tabBarActiveTintColor: "white",
                      tabBarActiveBackgroundColor: "black",
                      tabBarInactiveBackgroundColor: "black",
                      tabBarLabelStyle: {fontSize: 13},
                      tabBarStyle: [{display: "flex"}, null]
                    }}>
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <Stack.Screen
                        name="DictionaryStackScreen"
                        component={DictionaryStackScreen}
                        options={{
                            //tabBarShowLabel: false,
                            tabBarLabel: 'Dictionary',
                            tabBarIcon: (color) => (
                              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                              <Icon name='book-open-page-variant' type='material-community' size={33} color={color.color} />
                            ),
                          }}
                        />
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <Stack.Screen
                        name="MemoriseStackScreen"
                        component={MemoriseStackScreen}
                        options={{
                            //tabBarShowLabel: false,
                            tabBarLabel: 'Memorise',
                            tabBarIcon: (color) => (
                              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                              <Icon name='head-sync' type='material-community' size={40} color={color.color} />
                            ),
                          }}
                        />
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <Stack.Screen
                        name="FolderStackScreen"
                        component={FoldersStackScreen}
                        options={{
                            //tabBarShowLabel: false,
                            tabBarLabel: 'Folders',
                            tabBarIcon: (color) => (
                              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                              <Icon name='folder-multiple' type='material-community' size={30} color={color.color} />
                            ),
                          }}
                        />
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaView>
    ); 
}

/*tabBarOptions={{
  activeTintColor:'white',
  activeBackgroundColor:'black',
  inactiveBackgroundColor:'black',
  labelStyle: {fontSize: 13},
  style: {borderTopWidth: 0.5, borderTopColor: 'grey'}}}*/