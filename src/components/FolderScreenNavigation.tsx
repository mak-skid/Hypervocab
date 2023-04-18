import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FolderScreen from './page/foldersScreen/folderpage';
import BrowseFolder from './page/foldersScreen/BrowseFolder';
import EditCard from './page/foldersScreen/EditCard';
import HandleSelectedWord from './page/foldersScreen/handleSelectedWord';
import CustomCard from './page/foldersScreen/CustomCard';

const FoldersStack = createStackNavigator();

export const FoldersStackScreen = () => (
    <FoldersStack.Navigator>
        <FoldersStack.Screen name="FolderScreen" component={FolderScreen} options={{headerShown:false}}/>
        <FoldersStack.Screen name="BrowseFolder" component={BrowseFolder} options={{headerShown:false}}/>
        <FoldersStack.Screen name="HandleSelectedWord" component={HandleSelectedWord} options={{headerShown:false}}/>
        <FoldersStack.Screen name="EditCard" component={EditCard} options={{headerShown:false}}/>
        <FoldersStack.Screen name="CustomCard" component={CustomCard} options={{headerShown: false}} />
    </FoldersStack.Navigator>
);
