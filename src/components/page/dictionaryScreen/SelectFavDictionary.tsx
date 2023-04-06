import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, FlatList, Text, ScrollView, Alert, TouchableOpacity, ActivityIndicator, StatusBar} from 'react-native';
import { Header, Icon } from 'react-native-elements';
import { styles } from '../style';
import { DictionaryList } from './DictionaryList';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { strings } from '../strings';


export const SetFavDictionaries = (props) => {
    const { navigation } = props

    useEffect(async () => {
        try {
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

    const saveConfig = async (props) => {
        console.log('saveConfig', props);
        try {
            await AsyncStorage.setItem('FavDictionaries', JSON.stringify(props)).then(
                Alert.alert('', strings.saved)
            )
        } catch (error) {
            alert(strings.failedToSaveConfig)
        }
    }

    const [selectedIndex, setSelectedIndex] = useState([]),
          [isLoading, setLoading] = useState(true);

    const onPressHandler = (index) => {
        console.log(selectedIndex);
        if (selectedIndex.includes(index)) {
            setSelectedIndex(selectedIndex.filter(value => value !== index))
        } else {
            setSelectedIndex([...selectedIndex, index]);
        }
    }

    if (isLoading) {
        return (
            <View style={{flex:40, marginTop: 10, alignItems:"center", justifyContent:'center'}}>
                <ActivityIndicator size='large' />
                <Text style={{color: 'grey',margin:10, fontSize:16}}>{strings.loading}</Text>
            </View>
        )
    } else {
        return (
            <View style={[styles.container, {paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0}]}>
                <StatusBar style='light'/>
                <SafeAreaView style={{
                    backgroundColor: 'black',
                    alignItems: 'stretch',
                    justifyContent: 'space-between',
                    flex: 1,
                    }}>
                    <Header 
                        backgroundColor='black'
                        containerStyle={{ marginTop: ((StatusBar.currentHeight || 0) * -1) }}
                        leftComponent={<Icon name='arrowleft' type='antdesign' color='white' onPress={()=> navigation.navigate('SettingPage')}/>}
                        centerComponent={{text: strings.favDict, style:{color: 'white', fontSize:20}}}
                        rightComponent={<Icon name='save-alt' type='material' color='white' onPress={()=> saveConfig(selectedIndex) & navigation.navigate('SettingPage')}/>}
                    />
                    <FlatList
                        style={{backgroundColor:'black'}}
                        data={DictionaryList}
                        renderItem={({item, index})=> {
                            const backgroundColor = selectedIndex.includes(index) ? 'rgba(40, 40, 40, 1)' : 'black'
                            return (
                                <ScrollView vertical>
                                    <TouchableOpacity onPress={() => onPressHandler(index)}>
                                        <View style={{borderColor:'grey', borderBottomWidth:1, borderTopWidth:1, backgroundColor: backgroundColor, flexDirection: 'row', justifyContent: 'space-between'}}>
                                            <Text style={{color:'white', fontSize:18, margin:10}}>{item.label}</Text>
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
