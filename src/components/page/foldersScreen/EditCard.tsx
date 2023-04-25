import React, { useState } from 'react';
import { View, FlatList, Text, ScrollView, Alert, StatusBar, Platform, TextInput } from 'react-native';
import { Header, Icon, Card } from 'react-native-elements';
import { styles, width } from '../style';
import { updateFolderList, updateSavedWordList } from '../../../actions';
import { connect } from 'react-redux';
import { UserDatabaseDB } from '../../openDatabase';
import RNPickerSelect  from 'react-native-picker-select';
import { AudioPlayer } from '../Sound';
import { strings } from '../strings';


const EditCard = (props: any) => {
    const { folderList, savedWordList, navigation, route } = props
    const { parsedPhonetics, parsedMeanings, cardIndex, browsingFolder } = route.params

    const [reloadScreen, setReloadScreen] = useState(false),
          [isEditCardWordValue, setEditCardWordValue] = useState(savedWordList[cardIndex].word),
          [isEditCardMeanValue, setEditCardMeanValue] = useState(savedWordList[cardIndex].mean),
          [isEditCardMeaningsValue, setEditMeaningsValue] = useState(parsedMeanings),
          [isEditCardOriginValue, setEditCardOriginValue] = useState(savedWordList[cardIndex].origin),
          [isEditCardLevel, setEditCardLevel] = useState(savedWordList[cardIndex].level);

    const SaveEditedCard = () => {
        const stringifiedMeanings = escape(JSON.stringify(isEditCardMeaningsValue));
        if (isEditCardMeanValue) {
            UserDatabaseDB.transaction((tx: any) => {
                tx.executeSql(
                    `UPDATE "${browsingFolder}" 
                    SET word = "${isEditCardWordValue}",
                        mean = "${isEditCardMeanValue}",
                        level = ${isEditCardLevel}
                    WHERE item_id = ${savedWordList[cardIndex].item_id};`,[],
                (_: any, results: any) => {
                    console.log('edited word');
                    Alert.alert('', strings.editedSuccessfully, [{text: 'OK', onPress: () => navigation.navigate('BrowseFolder')}]);
                    setReloadScreen(true);
                },
                () => alert(strings.errorEditingCard)
                )
            })
        } else {
            UserDatabaseDB.transaction((tx: any) => {
                tx.executeSql(
                    `UPDATE "${browsingFolder}" 
                    SET word = "${isEditCardWordValue}",
                        meanings = "${stringifiedMeanings}",
                        origin = "${isEditCardOriginValue}",
                        level = ${isEditCardLevel}
                    WHERE item_id = ${savedWordList[cardIndex].item_id};`,[],
                (_: any, results: any) => {
                    console.log('edited word');
                    Alert.alert('', strings.editedSuccessfully, [{text: 'OK', onPress: () => navigation.navigate('BrowseFolder')}]);
                    setReloadScreen(true);
                },
                () => alert(strings.errorEditingCard)
                )
            })
        }
    }

    if (reloadScreen) {
        UserDatabaseDB.transaction((tx: any) => {
            tx.executeSql(`SELECT item_id, word, mean, meanings, phonetics, origin, level FROM '${browsingFolder}';`, [],
            (_: any, results: any) => {
                const savedWord = results.rows.raw()
                props.updateSavedWordList(savedWord);
                setReloadScreen(false);
            },
            () => alert(strings.errorReloadingScreen)
            )
        })
    }

    return (
        <View style={[styles.container, {paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0}]}>
            <StatusBar barStyle='light-content'/>
            <View style={{backgroundColor:'black', flex:1}}>
                <Header 
                    backgroundColor='black'
                    containerStyle={{ marginTop: ((StatusBar.currentHeight || 0) * -1) }}
                    leftComponent={<Icon name='arrowleft' type='antdesign' color='white' onPress={() => navigation.navigate('BrowseFolder')} tvParallaxProperties={undefined}/>}
                    centerComponent={{text: strings.edit, style:{color: 'white', fontSize:20}}}
                    rightComponent={<Icon name='save-alt' type='material' color='white' onPress={() => SaveEditedCard()} tvParallaxProperties={undefined}/>}
                />
                <ScrollView>
                <Card containerStyle={{backgroundColor:'black', width: width*0.9, borderRadius:5}}>
                    <TextInput 
                        style={{color:'white',fontSize:30,fontWeight:"bold",marginVertical:10, borderColor:'black', borderWidth:1, borderRadius:5}} 
                        defaultValue={isEditCardWordValue}
                        scrollEnabled={false} 
                        onChangeText={setEditCardWordValue}
                        placeholder={strings.typeAWordHere}
                        placeholderTextColor="grey"
                        />
                    {isEditCardMeanValue ? 
                        <TextInput 
                            style={{color:'white',fontSize:18, backgroundColor:'black', borderRadius:5, borderColor:'black', borderWidth:1}} 
                            multiline={true} 
                            scrollEnabled={false}
                            defaultValue={isEditCardMeanValue} 
                            onChangeText={setEditCardMeanValue}
                            placeholder={strings.typeDefinition}
                            placeholderTextColor="grey"
                        /> : null}
                    {isEditCardMeaningsValue ? 
                        <View>
                            {parsedPhonetics.map((item: any) => <View style={{flexDirection:'row'}}>  
                                {item.text != undefined && <Text style={{color:'white', fontSize:18}} key={item}>| {item.text} |</Text>}
                                {item.audio != undefined && <AudioPlayer url={item.audio}/>}
                            </View>
                                )
                            }
                            <FlatList
                                style={{backgroundColor:'black'}}
                                data={isEditCardMeaningsValue}
                                scrollEnabled={false}
                                keyExtractor={(item, index) => 'key'+index}
                                renderItem={({item, index})=> {
                                    const childData = isEditCardMeaningsValue[index].definitions;
                                    return (           
                                        <View>
                                            <TextInput 
                                                style={{color: 'grey', fontSize:18, backgroundColor:'black', marginTop: 10}}
                                                defaultValue={isEditCardMeaningsValue[index].partOfSpeech}
                                                onChangeText={(txt) => {
                                                    isEditCardMeaningsValue[index].partOfSpeech = txt
                                                    setEditMeaningsValue([...isEditCardMeaningsValue])
                                                }}
                                                placeholder={strings.typeTypeOfSpeech}
                                                placeholderTextColor='grey'
                                                scrollEnabled={false}
                                            />
                                            <FlatList
                                                style={{backgroundColor: 'black'}}
                                                data={childData}
                                                scrollEnabled={false}
                                                keyExtractor={(item, index) => 'key(defintion)' + index}
                                                renderItem={({item, index}) => {
                                                    return (          
                                                        <View>
                                                            <TextInput 
                                                                style={{color:'white',fontSize:18, backgroundColor:'black', borderRadius:5, borderColor:'black', borderWidth:1}} 
                                                                multiline={true} 
                                                                scrollEnabled={false}
                                                                defaultValue={item.definition} 
                                                                onChangeText={(txt) => {
                                                                    childData[index].definition = txt
                                                                    setEditMeaningsValue([...isEditCardMeaningsValue])
                                                                }}
                                                                placeholder={strings.typeDefinition}
                                                                placeholderTextColor="grey"
                                                            />
                                                            <TextInput 
                                                                style={{color:'grey',fontSize:18, fontStyle: 'italic', backgroundColor:'black', borderRadius:5, borderColor:'black', borderWidth:1}} 
                                                                multiline={true}
                                                                scrollEnabled={false} 
                                                                defaultValue={item.example} 
                                                                onChangeText={(txt) => {
                                                                    childData[index].example = txt
                                                                    setEditMeaningsValue([...isEditCardMeaningsValue])
                                                                }}
                                                                placeholder={strings.typeExampleSentence}
                                                                placeholderTextColor="grey"
                                                            />
                                                        </View>
                                                    )
                                                }}
                                            /> 
                                        </View>
                                    )
                                }}
                            /> 
                            <Text style={{color:'white', fontWeight: 'bold', fontSize:18, marginTop:10}}>{strings.origin}</Text>
                            <TextInput 
                                style={{color:'white',fontSize:18, backgroundColor:'black'}} 
                                multiline={true}
                                scrollEnabled={false} 
                                defaultValue={isEditCardOriginValue} 
                                onChangeText={setEditCardOriginValue}
                                placeholder={strings.typeWordOrigin}
                                placeholderTextColor="grey"
                            />
                        </View>
                    : null}
                    <Text style={{color: 'white', fontSize: 18, marginTop:10, fontWeight: 'bold'}}>{strings.setLevel}</Text>
                    <View style={{justifyContent: 'flex-start'}}>
                        <RNPickerSelect
                            onValueChange={(value) => setEditCardLevel(value)}
                            placeholder={{label: strings.selectLevel, color: 'grey'}}
                            style={{
                                inputAndroid: {...styles.input, color:'black', marginHorizontal: 0}, 
                                inputIOS:{...styles.input, width: width*0.8, marginHorizontal: 0, marginTop:10}
                            }}
                            items={[
                                {label: strings.label0, value: 0},
                                {label: strings.label1, value: 1},
                                {label: strings.label2, value: 2},
                                {label: strings.label3, value: 3},
                                {label: strings.label4, value: 4},
                                {label: strings.label5, value: 5},
                                {label: strings.label6, value: 6}
                            ]}
                            value={isEditCardLevel}
                            useNativeAndroidPickerStyle={false}
                        />
                    </View>       
                </Card>
                </ScrollView>
            </View>
        </View>
    );
}

const mapStateToProps = (state: any) => {
    return { 
        folderList: state.folderList,
        savedWordList: state.savedWordList,
    }
};
    
const mapDispatchToProps = {updateFolderList, updateSavedWordList};
    
    
export default connect(mapStateToProps, mapDispatchToProps) (EditCard);