import React, { useCallback, useState } from 'react';
import { View, SafeAreaView, FlatList, Text, ScrollView, TouchableOpacity, Alert, StatusBar, Platform } from 'react-native';
import { Header, Icon } from 'react-native-elements';
import { styles, height } from '../style';
import { updateFolderList, updateSavedWordList } from '../../../actions';
import { connect } from 'react-redux';
import { FAB } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';
import { UserDatabaseDB } from '../../openDatabase';
import { strings } from '../strings';


const BrowseFolder = (props: any) => {
    const {folderList, savedWordList, navigation, route} = props

    const [isBrowsingFolderName, setBrowsingFolderName] = useState("");

    useFocusEffect(useCallback(() => {
        const spliced = [...folderList].splice(route.params.index, 1);
        for (var i = 0; i < spliced.length; i++) {
            const browsingFolder = spliced[i].name
            UserDatabaseDB.transaction((tx: any) => {
                tx.executeSql(`SELECT item_id, word, mean, meanings, phonetics, origin, level FROM '${browsingFolder}';`, [],
                (_: any, results: any) => {
                    console.log('Got a saved list in the folder: ' + browsingFolder);
                    const savedWord = results.rows.raw()
                    props.updateSavedWordList(savedWord)
                    
                    setBrowsingFolderName(browsingFolder);
                },
                () => Alert.alert(strings.error, strings.errorOpeningFolder)
                )
            })
        }
    },[]))

    const savedWordsRenderItem = ({item,index}: any)=> {
        const parsedMeanings = JSON.parse(unescape(savedWordList[index].meanings));
        const parsedPhonetics = JSON.parse(unescape(savedWordList[index].phonetics));

        return (
            <ScrollView>
                <TouchableOpacity onPress={() => navigation.navigate('EditCard', {cardIndex: index, parsedPhonetics: parsedPhonetics, parsedMeanings: parsedMeanings, browsingFolder: isBrowsingFolderName})}>
                    <View style={{borderColor:'grey', borderBottomWidth:1}}>
                        <View style={{flexDirection:'row', justifyContent: 'space-between'}}>
                            <Text style={{color:'white', fontSize:15}}>{savedWordList[index].word}</Text>
                            <Text style={{color:'white', fontSize:15}}>level: {savedWordList[index].level}</Text>
                        </View>
                        {savedWordList[index].mean ? <Text numberOfLines={1} style={{color:'white', fontSize:15}}>{savedWordList[index].mean}</Text> : null}
                        {savedWordList[index].meanings ? <Text numberOfLines={1} style={{color:'white', fontSize:15}}>{parsedMeanings[0].definitions[0].definition}</Text> : null}
                    </View>
                </TouchableOpacity>
            </ScrollView>
        )
    }

    return (
        <View style={[styles.container, {paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0}]}>
            <StatusBar barStyle='light-content'/> 
            <SafeAreaView style={{
                backgroundColor: 'black',
                alignItems: 'stretch',
                justifyContent: 'space-between',
                flex: 1,
                }}> 
                <Header 
                    backgroundColor='black'
                    containerStyle={{ marginTop: ((StatusBar.currentHeight || 0) * -1) }} 
                    leftComponent={<Icon name='arrowleft' type='antdesign' color='white' onPress={() => navigation.navigate('FolderScreen')} tvParallaxProperties={undefined}/>}
                    centerComponent={{text: strings.browsing + isBrowsingFolderName + '"', style:{color: 'white', fontSize:20}}}
                    rightComponent={<Icon name='select1' type='antdesign' color='white' onPress={() => navigation.navigate('HandleSelectedWord', { item: isBrowsingFolderName })} tvParallaxProperties={undefined}/>}
                />
                <FlatList
                    style={{backgroundColor:'black'}}
                    data={props.savedWordList}
                    keyExtractor={(item, index) => 'key'+index}
                    renderItem={savedWordsRenderItem}
                    ListEmptyComponent={      
                        <View style={{alignItems: 'center', marginTop: height*0.2}}>
                            <Text style={{color:'grey', fontSize:20}}>{strings.noCardInFolder}</Text>
                        </View>
                    }
                />
                <FAB icon={{name: 'plus', type:'antdesign', color:'white'}} color='#007AFF' placement='right' onPress={() => {navigation.navigate('CustomCard',{item: isBrowsingFolderName})}}/>
            </SafeAreaView>
        </View>
    )
}

const mapStateToProps = (state: any) => {
    return { 
        folderList: state.folderList,
        savedWordList: state.savedWordList,
    }
};

const mapDispatchToProps = {updateFolderList, updateSavedWordList};
    
    
export default connect(mapStateToProps, mapDispatchToProps) (BrowseFolder);