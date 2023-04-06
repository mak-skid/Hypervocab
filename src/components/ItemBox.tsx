import React from 'react';
import { View, TouchableOpacity, Text, Animated, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { Swipeable } from 'react-native-gesture-handler';
import { width } from '../components/page/style';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


export const ItemBox = (props: any) => {
    const swipeToDelete = (progress: any, dragX: any) => {
        const scale = dragX.interpolate({
            inputRange: [0, 500],
            outputRange: [0.9, 0]
        });

        return (
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <View style={itemBoxStyles.deleteBox}>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <TouchableOpacity onPress={props.handleDelete}>
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <Animated.View style={{transform:[{scale: scale}]}}>
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <Icon type='material-community' name='delete' color='white' size={30}/>
                    </Animated.View>
                </TouchableOpacity>
            </View>
        )
    }
    const swipeToEdit = (progress: any, dragX: any) => {
        const scale = dragX.interpolate({
            inputRange: [0, 80],
            outputRange: [0.85, 1]
        });

        return (
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <View style={itemBoxStyles.editBox}>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <TouchableOpacity onPress={props.handleEdit}>
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <Animated.View style={{transform:[{scale: scale}]}}>
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <MaterialIcons name='drive-file-rename-outline' color='white' size={30}/>
                    </Animated.View>
                </TouchableOpacity>
            </View>
        )
    }
    return (
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <Swipeable renderRightActions={swipeToDelete} renderLeftActions={swipeToEdit}>
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <TouchableOpacity onPress={props.handleBrowse}>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <View style={[itemBoxStyles.container, {padding: 20}]}>
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <Text style={{color:'white', fontSize: 20}}>{props.data}</Text>
                </View>
            </TouchableOpacity>
        </Swipeable>   
    )
}

export const itemBoxStyles = StyleSheet.create({
    deleteBox: {
        backgroundColor:'red',
        margin:5, 
        borderRadius: 5, 
        justifyContent:'center',
        alignItems:'center',
        width: width*0.2
    },
    editBox: {
        backgroundColor:'rgb(100, 100, 100)',
        margin:5, 
        borderRadius: 5, 
        justifyContent:'center',
        alignItems:'center',
        width: width*0.2
    },
    container: {
        backgroundColor:'rgb(100, 100, 100)',
        margin: 5, 
        borderRadius:5,
    } , 
});