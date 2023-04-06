import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
// @ts-expect-error TS(6142): Module './page/foldersScreen/folderpage' was resol... Remove this comment to see the full error message
import FolderScreen from './page/foldersScreen/folderpage';
// @ts-expect-error TS(6142): Module './page/foldersScreen/BrowseFolder' was res... Remove this comment to see the full error message
import BrowseFolder from './page/foldersScreen/BrowseFolder';
// @ts-expect-error TS(6142): Module './page/foldersScreen/EditCard' was resolve... Remove this comment to see the full error message
import EditCard from './page/foldersScreen/EditCard';
// @ts-expect-error TS(6142): Module './page/foldersScreen/handleSelectedWord' w... Remove this comment to see the full error message
import HandleSelectedWord from './page/foldersScreen/handleSelectedWord';
// @ts-expect-error TS(6142): Module './page/foldersScreen/CustomCard' was resol... Remove this comment to see the full error message
import CustomCard from './page/foldersScreen/CustomCard';

const FoldersStack = createStackNavigator();

export const FoldersStackScreen = () => (
    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    <FoldersStack.Navigator>
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <FoldersStack.Screen name="FolderScreen" component={FolderScreen} options={{headerShown:false}}/>
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <FoldersStack.Screen name="BrowseFolder" component={BrowseFolder} options={{headerShown:false}}/>
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <FoldersStack.Screen name="HandleSelectedWord" component={HandleSelectedWord} options={{headerShown:false}}/>
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <FoldersStack.Screen name="EditCard" component={EditCard} options={{headerShown:false}}/>
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <FoldersStack.Screen name="CustomCard" component={CustomCard} options={{headerShown: false}} />
    </FoldersStack.Navigator>
);
