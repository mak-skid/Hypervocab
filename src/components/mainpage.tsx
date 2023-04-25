import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native'
import { Icon } from 'react-native-elements';
import { SafeAreaView } from 'react-native';
import { FoldersStackScreen } from './FolderScreenNavigation';
import { MemoriseStackScreen } from './MemoriseScreenNavigation';
import { DictionaryStackScreen } from './DictionaryScreenStack';


const Stack = createBottomTabNavigator();

export default function RootStack() {
    return (
        <SafeAreaView style={{backgroundColor: 'black', flex:1}}>
            <NavigationContainer>
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
                    <Stack.Screen
                        name="DictionaryStackScreen"
                        component={DictionaryStackScreen}
                        options={{
                            //tabBarShowLabel: false,
                            tabBarLabel: 'Dictionary',
                            tabBarIcon: (color) => (
                    
                              <Icon name='book-open-page-variant' type='material-community' size={33} color={color.color} tvParallaxProperties={undefined} />
                            ),
                          }}
                        />
          
                    <Stack.Screen
                        name="MemoriseStackScreen"
                        component={MemoriseStackScreen}
                        options={{
                            //tabBarShowLabel: false,
                            tabBarLabel: 'Memorise',
                            tabBarIcon: (color) => (
                    
                              <Icon name='head-sync' type='material-community' size={40} color={color.color} tvParallaxProperties={undefined} />
                            ),
                          }}
                        />
          
                    <Stack.Screen
                        name="FolderStackScreen"
                        component={FoldersStackScreen}
                        options={{
                            //tabBarShowLabel: false,
                            tabBarLabel: 'Folders',
                            tabBarIcon: (color) => (
                    
                              <Icon name='folder-multiple' type='material-community' size={30} color={color.color} tvParallaxProperties={undefined} />
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