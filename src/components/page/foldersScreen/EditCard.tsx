import React, { useState } from 'react';
import { View, FlatList, Text, ScrollView, Alert, StatusBar} from 'react-native';
import { Header, Icon, Card } from 'react-native-elements';
import { styles, width } from '../style';
import { TextInput } from 'react-native';
import { updateFolderList, updateSavedWordList } from '../../../actions';
import { connect } from 'react-redux';
import { UserDatabaseDB } from '../../openDatabase';
import RNPickerSelect from 'react-native-picker-select';
// @ts-expect-error TS(6142): Module '../Sound' was resolved to '/Users/Mak/Hype... Remove this comment to see the full error message
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
                    // @ts-expect-error TS(2345): Argument of type 'null' is not assignable to param... Remove this comment to see the full error message
                    Alert.alert(null, strings.editedSuccessfully, [{text: 'OK', onPress: () => navigation.navigate('BrowseFolder')}]);
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
                    // @ts-expect-error TS(2345): Argument of type 'null' is not assignable to param... Remove this comment to see the full error message
                    Alert.alert(null, strings.editedSuccessfully, [{text: 'OK', onPress: () => navigation.navigate('BrowseFolder')}]);
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
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <View style={[styles.container, {paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0}]}>
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <StatusBar style='light'/>
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <View style={{backgroundColor:'black', flex:1}}>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <Header 
                    backgroundColor='black'
                    containerStyle={{ marginTop: ((StatusBar.currentHeight || 0) * -1) }}
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    leftComponent={<Icon name='arrowleft' type='antdesign' color='white' onPress={()=> navigation.navigate('BrowseFolder')}/>}
                    centerComponent={{text: strings.edit, style:{color: 'white', fontSize:20}}}
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    rightComponent={<Icon name='save-alt' type='material' color='white' onPress={()=> SaveEditedCard()}/>}
                />
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <ScrollView vertical>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <Card containerStyle={{backgroundColor:'black', width: width*0.9, borderRadius:5}}>
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <TextInput 
                        style={{color:'white',fontSize:30,fontWeight:"bold",marginVertical:10, borderColor:'black', borderWidth:1, borderRadius:5}} 
                        defaultValue={isEditCardWordValue}
                        scrollEnabled={false} 
                        onChangeText={setEditCardWordValue}
                        placeholder={strings.typeAWordHere}
                        placeholderTextColor="grey"
                        />
                    {isEditCardMeanValue ? 
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <View>
                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                            {parsedPhonetics.map((item: any) => <View style={{flexDirection:'row'}}>
                                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                {item.text != undefined && <Text style={{color:'white', fontSize:18}} key={item}>| {item.text} |</Text>}
                                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                {item.audio != undefined && <AudioPlayer url={item.audio}/>}
                            </View>
                                )
                            }
                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                            <FlatList
                                style={{backgroundColor:'black'}}
                                data={isEditCardMeaningsValue}
                                scrollEnabled={false}
                                keyExtractor={(item, index) => 'key'+index}
                                renderItem={({item, index})=> {
                                    const childData = isEditCardMeaningsValue[index].definitions;
                                    return (
                                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                        <View>
                                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
                                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                            <FlatList
                                                style={{backgroundColor: 'black'}}
                                                data={childData}
                                                scrollEnabled={false}
                                                keyExtractor={(item, index) => 'key(defintion)' + index}
                                                renderItem={({item, index}) => {
                                                    return (
                                                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                                        <View>
                                                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
                                                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                            <Text style={{color:'white', fontWeight: 'bold', fontSize:18, marginTop:10}}>{strings.origin}</Text>
                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <Text style={{color: 'white', fontSize: 18, marginTop:10, fontWeight: 'bold'}}>{strings.setLevel}</Text>
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <View style={{justifyContent: 'flex-start'}}>
                        // @ts-expect-error TS(2769): No overload matches this call.
                        <RNPickerSelect
                            onValueChange={(value) => setEditCardLevel(value)}
                            placeholder={{label: strings.selectLevel, color: 'grey'}}
                            style={{
                                inputAndroid: [styles.input, {color:'black', marginHorizontal: 0}], 
                                inputIOS: [styles.input, {width: width*0.8, marginHorizontal: 0, marginTop:10}]
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