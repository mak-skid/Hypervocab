import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, FlatList, Text, ScrollView, Alert, TouchableOpacity, ActivityIndicator, StatusBar} from 'react-native';
import { Header, Icon } from 'react-native-elements';
import { styles } from '../style';
import { DictionaryList } from './DictionaryList';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { strings } from '../strings';


export const SetFavDictionaries = (props: any) => {
    const { navigation } = props

    // @ts-expect-error TS(2345): Argument of type '() => Promise<void>' is not assi... Remove this comment to see the full error message
    useEffect(async () => {
        try {
            // @ts-expect-error TS(2345): Argument of type 'void' is not assignable to param... Remove this comment to see the full error message
            const value = await AsyncStorage.getItem('FavDictionaries').then(setLoading(false));
            if (value !== null) {
                const arr = JSON.parse(value);
                setSelectedIndex(arr)
            }
            } catch(error) {
                setLoading(false);
                setSelectedIndex([]);
            } 
        }
    ,[])

    const saveConfig = async (props: any) => {
        console.log('saveConfig', props);
        try {
            await AsyncStorage.setItem('FavDictionaries', JSON.stringify(props)).then(
                // @ts-expect-error TS(2345): Argument of type 'void' is not assignable to param... Remove this comment to see the full error message
                Alert.alert('', strings.saved)
            )
        } catch (error) {
            alert(strings.failedToSaveConfig)
        }
    }

    const [selectedIndex, setSelectedIndex] = useState([]),
          [isLoading, setLoading] = useState(true);

    const onPressHandler = (index: any) => {
        console.log(selectedIndex);
        // @ts-expect-error TS(2345): Argument of type 'any' is not assignable to parame... Remove this comment to see the full error message
        if (selectedIndex.includes(index)) {
            setSelectedIndex(selectedIndex.filter(value => value !== index))
        } else {
            // @ts-expect-error TS(2322): Type 'any' is not assignable to type 'never'.
            setSelectedIndex([...selectedIndex, index]);
        }
    }

    if (isLoading) {
        return (
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <View style={{flex:40, marginTop: 10, alignItems:"center", justifyContent:'center'}}>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <ActivityIndicator size='large' />
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <Text style={{color: 'grey',margin:10, fontSize:16}}>{strings.loading}</Text>
            </View>
        )
    } else {
        return (
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <View style={[styles.container, {paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0}]}>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <StatusBar style='light'/>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <SafeAreaView style={{
                    backgroundColor: 'black',
                    alignItems: 'stretch',
                    justifyContent: 'space-between',
                    flex: 1,
                    }}>
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <Header 
                        backgroundColor='black'
                        containerStyle={{ marginTop: ((StatusBar.currentHeight || 0) * -1) }}
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        leftComponent={<Icon name='arrowleft' type='antdesign' color='white' onPress={()=> navigation.navigate('SettingPage')}/>}
                        centerComponent={{text: strings.favDict, style:{color: 'white', fontSize:20}}}
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        rightComponent={<Icon name='save-alt' type='material' color='white' onPress={()=> saveConfig(selectedIndex) & navigation.navigate('SettingPage')}/>}
                    />
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <FlatList
                        style={{backgroundColor:'black'}}
                        data={DictionaryList}
                        renderItem={({item, index})=> {
                            // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
                            const backgroundColor = selectedIndex.includes(index) ? 'rgba(40, 40, 40, 1)' : 'black'
                            return (
                                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                <ScrollView vertical>
                                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                    <TouchableOpacity onPress={() => onPressHandler(index)}>
                                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                        <View style={{borderColor:'grey', borderBottomWidth:1, borderTopWidth:1, backgroundColor: backgroundColor, flexDirection: 'row', justifyContent: 'space-between'}}>
                                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                            <Text style={{color:'white', fontSize:18, margin:10}}>{item.label}</Text>
                                            // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
                                            {selectedIndex.includes(index) && <Icon name='check' type='antdesign' color= 'white' style={{margin:10}}/>}
                                        </View>
                                    </TouchableOpacity>
                                </ScrollView>
                            )
                        }}
                        keyExtractor={(item) => item.label}
                    />
                </SafeAreaView>
            </View>
        )
    }
}
