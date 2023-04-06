import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, SafeAreaView, TextInput, TouchableOpacity, ScrollView, Dimensions, Modal, FlatList, Alert, Animated, StatusBar} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { styles, width, height } from '../style';
import { connect } from 'react-redux';
import { updateCardData, updateFolderList, updateSavedWordList, updateFavDictionaries } from '../../../actions';
import { Card, Button, Text } from 'react-native-elements';
// @ts-expect-error TS(6142): Module '../../ItemBox' was resolved to '/Users/Mak... Remove this comment to see the full error message
import { itemBoxStyles } from '../../ItemBox';
import { ejdictdb, UserDatabaseDB } from '../../openDatabase';
import { FAB } from 'react-native-elements';
// @ts-expect-error TS(6142): Module './Pagination' was resolved to '/Users/Mak/... Remove this comment to see the full error message
import Paginator from './Pagination';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { DictionaryList } from './DictionaryList';
import { useFocusEffect } from '@react-navigation/native';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import ShareMenu from 'react-native-share-menu';
// @ts-expect-error TS(6142): Module '../Sound' was resolved to '/Users/Mak/Hype... Remove this comment to see the full error message
import { AudioPlayer } from '../Sound';
import { strings } from '../strings';


function DictionaryScreen(props: any) {
    const { navigation, route } = props

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const fetchConfig = async () => {
                try {
                    const [favValues, value] = await Promise.all([AsyncStorage.getItem('FavDictionaries'), AsyncStorage.getItem('DefaultDictionary')]);
                    props.updateCardData(null);
                    if (value !== null && favValues !== null) {
                        const arr = JSON.parse(favValues);
                        const newArr = DictionaryList.filter(item => arr.includes(item.id));
                        setFavDictionaries(newArr);
                        setFavLoading(false);
                        setSelectedDictionary(value);
                        setDefaultDictionary(value);
                    } else if (value !== null && favValues === null) {
                        setFavLoading(false);
                        setSelectedDictionary(value);
                        setDefaultDictionary(value);
                    } else if (value === null && favValues === null){
                        setFavLoading(false);
                    } else {
                        setFavLoading(false);
                        // @ts-expect-error TS(2345): Argument of type 'string | null' is not assignable... Remove this comment to see the full error message
                        const arr = JSON.parse(favValues);
                        const newArr = DictionaryList.filter(item => arr.includes(item.id));
                        setFavDictionaries(newArr);
                    } 
                } catch(error) {
                    console.log('error');
                    setFavLoading(false);
                }
            }
            
            fetchConfig();
            
            return () => {
                isActive = false;
            };
        }, [])
    )
    
    const [isModalVisible, setModalVisible] = useState(false),
          [reloadScreen, setReloadScreen] = useState(true),
          [isLoading, setLoading] = useState(false),
          [isFavLoading, setFavLoading] = useState(true),
          [cardIndex, setCardIndex] = useState(null),
          [favDictionaries, setFavDictionaries] = useState(DictionaryList),
          // @ts-expect-error TS(2448): Block-scoped variable 'defaultDictionary' used bef... Remove this comment to see the full error message
          [selectedDictionary, setSelectedDictionary] = useState(defaultDictionary),
          [defaultDictionary, setDefaultDictionary] = useState(""),
          [inputWord, setInputWord] = useState(""),
          [sharedMimeType, setSharedMimeType] = useState(null);

    const handleShare = useCallback((item) => {
        if (!item) {
            console.log("passing failed", item);
            return ;
        }

        const { mimeType, data, extraData } = item;
        
        console.log("app", item.data);

        setInputWord(data);
        setSharedMimeType(mimeType);
    }, []);

    useEffect(() => {
        ShareMenu.getInitialShare(handleShare);
    }, []);

    useEffect(() => {
        const listener = ShareMenu.addNewShareListener(handleShare);

        return () => {
            listener.remove();
        };
    }, []);
    

    const handleinputWord = async () => {
        setLoading(true)

        const controller = new AbortController();
        const timeout = setTimeout(() => {controller.abort()}, 5000 );

        switch (selectedDictionary) {
            case 'EJ': 
                ejdictdb.transaction((tx: any) => {
                    tx.executeSql(`SELECT item_id, word, mean, level FROM items WHERE word LIKE "${inputWord}";`,
                            [], (_: any, results: any) => {
                            console.log("Query completed");
                            const len = results.rows.length;
                            if (len > 0) {
                                const cardData = results.rows.raw();
                                props.updateCardData(cardData);
                                setReloadScreen(false);
                            }
                            else {
                                Alert.alert(strings.error, strings.noWordFound);
                            }
                        },
                        () => {
                            Alert.alert(strings.error, strings.couldNotFinishTheQuery)
                        }
                    )
                    setLoading(false);
                });
                break;
            /*case 'en_US':
            case 'en_GB':
            case 'fr':
            case 'es':
            case 'de':
            case 'it':
            case 'tr':
            case 'ja':
            case 'ko':
                */
            case 'en':
                try {
                    const data = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/${selectedDictionary}/${inputWord}`, 
                        {
                            signal: controller.signal,
                            method: 'GET',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        }
                    ).then(resp => resp.json())
                    .then(data => {
                        if (data.title) {
                            Alert.alert(data.title, data.message);
                        } else {
                            props.updateCardData(data);
                        }
                        setLoading(false);
                    })
                } catch (error) {
                    Alert.alert(strings.error, strings.connectionErrorContact)
                }                
                clearTimeout(timeout);
                setLoading(false);
                break;
            /*case 'urban_dictionary':
                try {
                    const data = await fetch(`https://mashape-community-urban-dictionary.p.rapidapi.com/define?term=${inputWord}`, 
                        {
                            signal: controller.signal,
                            method: "GET",
                            headers: {
                                "x-rapidapi-host": "mashape-community-urban-dictionary.p.rapidapi.com",
                                "x-rapidapi-key": "a9fb0095e3msh7092e19dd0034e9p1261a5jsnb924703f4137",
                            }
                        }
                    ).then(resp => resp.json())
                    .then(data => console.log(data) && setLoading(false))
                } catch (error) {
                    Alert.alert('Error', "Connection error or Request timed out.")
                }
                clearTimeout(timeout);
                setLoading(false);
                break;
                */
            default:
                setLoading(false);
                Alert.alert('', strings.selectADictionary)
                break;
        }
    }
    
    if (reloadScreen) {
        UserDatabaseDB.transaction((tx: any) => {
            tx.executeSql(
              `SELECT name FROM sqlite_master WHERE (type = "table") AND (name != "sqlite_sequence" AND name != "android_metadata");`, [], 
                (_: any, results: any) => {
                    const folderList = results.rows.raw();
                    props.updateFolderList(folderList);
                    setReloadScreen(false)
                }, () => { 
                    Alert.alert(strings.error, strings.databaseConnectionError)
                }
            )
        })
    }

    const folderToSave = (item: any) => {
        // @ts-expect-error TS(2538): Type 'null' cannot be used as an index type.
        const stringifiedPhonetics = escape(JSON.stringify(props.cardData[cardIndex].phonetics));
        // @ts-expect-error TS(2538): Type 'null' cannot be used as an index type.
        const stringifiedMeanings = escape(JSON.stringify(props.cardData[cardIndex].meanings));
        const folderToInsert = item.name
        
        // @ts-expect-error TS(2538): Type 'null' cannot be used as an index type.
        if (props.cardData[cardIndex].mean == null) {
            UserDatabaseDB.transaction((tx: any) => {
                tx.executeSql(
                    `INSERT INTO "${folderToInsert}" (word, phonetics, origin, meanings)
                    // @ts-expect-error TS(2538): Type 'null' cannot be used as an index type.
                    VALUES ("${props.cardData[cardIndex].word}", 
                            "${stringifiedPhonetics}", 
                            // @ts-expect-error TS(2538): Type 'null' cannot be used as an index type.
                            "${props.cardData[cardIndex].origin}",
                            "${stringifiedMeanings}");`,[],
                    () => {
                        console.log('inserted a word to a folder');
                        setReloadScreen(true);
                        setModalVisible(false);
                        Alert.alert(strings.saved, strings.successfullySavedTo + folderToInsert + strings.successfullySavedToJapanese);
                    }, 
                    () => Alert.alert(strings.error, strings.duplicateFoundChooseDifferentFolder)
                )
            })
        } else {
            UserDatabaseDB.transaction((tx: any) => {
                tx.executeSql(
                    `INSERT INTO "${folderToInsert}" (word, mean)
                    // @ts-expect-error TS(2538): Type 'null' cannot be used as an index type.
                    VALUES ("${props.cardData[cardIndex].word}", 
                            // @ts-expect-error TS(2538): Type 'null' cannot be used as an index type.
                            "${props.cardData[cardIndex].mean.replaceAll("/","\n\n")}");`,[],
                    () => {
                        console.log('inserted a word to a folder');
                        setReloadScreen(true);
                        setModalVisible(false);
                        Alert.alert(strings.saved, strings.successfullySavedTo + folderToInsert + strings.successfullySavedToJapanese);
                    }, 
                    () => Alert.alert(strings.error, strings.duplicateFoundChooseDifferentFolder)
                )
            })
        }       
    }
    

    const cardWindowWidth = Dimensions.get('window').width * 0.9;

    const Cards = () => {
        const [currentIndex, setCurrentIndex] = useState(0);

        const scrollX = useRef(new Animated.Value(0)).current;

        const viewableItemsChanged = useRef(({
            viewableItems
        }: any) => {
            setCurrentIndex(viewableItems[0].index)
            console.log(viewableItems);
        }).current;
        
        const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50}).current;

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
            const [isThesaurusVisibleIndex, setThesaurusVisibleIndex] = useState([])
            
            const onPressHandler = (item: any) => {
                // @ts-expect-error TS(2345): Argument of type 'any' is not assignable to parame... Remove this comment to see the full error message
                if (isThesaurusVisibleIndex.includes(item)) {
                    setThesaurusVisibleIndex(isThesaurusVisibleIndex.filter(value => value !== item))
                } else {
                    // @ts-expect-error TS(2322): Type 'any' is not assignable to type 'never'.
                    setThesaurusVisibleIndex([...isThesaurusVisibleIndex, item]);
                }
            }

            const CardContent = (index: any) => {
                switch (selectedDictionary) {
                    case 'EJ':
                        return (
                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                            <Card containerStyle={{backgroundColor:'black', width: cardWindowWidth, borderRadius:5}}>
                                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                <Text style={{color:'white',fontSize:30,fontWeight:"bold",margin:10}}>
                                    {props.cardData[index].word}
                                </Text> 
                                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                <Text style={{color:'white',fontSize:18}}>
                                    {props.cardData[index].mean.split("/").join("\n\n")}{/* here it's an alternative for replaceAll("/")}*/}
                                </Text>
                                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                <View style={{margin:10, alignItems:"center"}}>
                                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                    <Text style={{color:"white",fontSize:11}}>
                                        {strings.dataRetrievedFromEJDict}
                                    </Text>
                                </View>
                            </Card>
                        )
                    /*case 'en_US':
                    case 'en_GB':
                    case 'fr':
                    case 'es':
                    case 'de':
                    case 'it':
                    case 'tr':
                    case 'ja':
                    case 'ko':
                        */
                    case 'en':
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        const mappedDifinition = (item: any) => <View>
                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                            <Text style={{color: 'grey', fontSize:18}}>{item.partOfSpeech}</Text>
                            {item.definitions.map((item: any, index: any) =>
                                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                <View style={{borderBottomWidth:10}}>
                                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                    <Text style={{color:'white', fontSize:18}}>{item.definition}</Text>
                                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                    <Text style={{color:'lightgrey', fontStyle:'italic', fontSize:18}}>{item.example}</Text>
                                    {(item.synonyms.length || item.antonyms.length > 0) &&
                                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                        <TouchableOpacity onPress={() => onPressHandler(item)} style={{alignItems:'flex-start'}}>
                                            // @ts-expect-error TS(2345): Argument of type 'any' is not assignable to parame... Remove this comment to see the full error message
                                            {!isThesaurusVisibleIndex.includes(item) &&
                                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                            <Icon name='ellipsis1' type='antdesign' color='white' />
                                            }
                                            // @ts-expect-error TS(2345): Argument of type 'any' is not assignable to parame... Remove this comment to see the full error message
                                            {isThesaurusVisibleIndex.includes(item) &&
                                                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                                <View style={{flexDirection:'row', flexWrap:'wrap'}}>  
                                                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                                    {item.synonyms.map((item: any) => <Button buttonStyle={{backgroundColor:"green", borderRadius:40}}
                                                            onPress={() => {
                                                                setInputWord(item)
                                                            }} 
                                                            title={item} 
                                                            titleStyle={{color:'white', fontSize: 18}}/>
                                                    )}
                                                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                                    {item.antonyms.map((item: any) => <Button buttonStyle={{backgroundColor:"red", borderRadius:40}} 
                                                            onPress={() => {
                                                                setInputWord(item)
                                                            }} 
                                                            title={item} 
                                                            titleStyle={{color:'white', fontSize: 18}}/>
                                                    )}
                                                </View>
                                            }
                                        </TouchableOpacity>
                                    }
                                </View>
                                )}
                        </View>

                        return (
                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                            <Card containerStyle={{backgroundColor:'black', width: cardWindowWidth, borderRadius:5}}>
                                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                <Text style={{color:'white',fontSize:30,fontWeight:"bold",marginTop:10, marginLeft:10}}>
                                    {props.cardData[index].word}
                                </Text>
                                {props.cardData[index].phonetics.map((item: any, index: any)=> 
                                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                    <View style={{flexDirection:'row'}}>
                                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                        {item.text != undefined && <Text style={{color:'white', fontSize:18}} key={index}>| {item.text} |</Text>}
                                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                        {item.audio != (undefined || "") && <AudioPlayer url={item.audio}/>}
                                    </View>)}
                                {props.cardData[index].meanings.map(mappedDifinition)}
                                {props.cardData[index].origin != undefined && 
                                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                    <View>
                                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                        <Text style={{color:'white', fontWeight: 'bold', fontSize:18}}>{strings.origin}</Text>
                                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                        <Text style={{color:'white', fontSize:18}}>{props.cardData[index].origin}</Text>
                                    </View>}
                                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                <View style={{margin:10, alignItems:"center"}}>
                                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                    <Text style={{color:"white",fontSize:13}}>
                                        {strings.dataRetrievedFromWikitionary}
                                    </Text>
                                </View>
                            </Card>
                        );
                }
            }
            
            return (
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <View style={{flex:40, marginTop: 10, alignItems:'center'}}>
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <FlatList
                        style={{backgroundColor:'black'}}
                        pagingEnabled={true}
                        horizontal={true}
                        data={props.cardData}
                        keyExtractor={(item, index) => 'key'+index}
                        showsHorizontalScrollIndicator={false}
                        // @ts-expect-error TS(2339): Property '_' does not exist on type 'ListRenderIte... Remove this comment to see the full error message
                        renderItem={({_, index})=> {
                            return (
                                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                <ScrollView vertical>
                                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                    <TouchableOpacity 
                                        style={{padding: 5}}
                                        // @ts-expect-error TS(2362): The left-hand side of an arithmetic operation must... Remove this comment to see the full error message
                                        onPress={() => setModalVisible(true) & setCardIndex(index)}
                                        >
                                        {CardContent(index)}                        
                                    </TouchableOpacity>
                                </ScrollView>
                            )
                        }}
                        onScroll={Animated.event([{nativeEvent: {contentOffset: {x: scrollX}}}], {
                            useNativeDriver: false,
                        })}
                        onViewableItemsChanged={viewableItemsChanged}
                        viewabilityConfig={viewConfig}
                        scrollEventThrottle={32}
                        ListEmptyComponent={() => {
                            if (inputWord === '') {
                                return (
                                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                    <View style={{alignItems: 'center', margin: width*0.1}}>
                                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                        <Text style={{color:'grey', fontSize:20}}>{strings.searchResultShownHere}</Text>
                                    </View>
                                )
                            } else {
                                return (
                                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                    <View style={{justifyContent:'center'}}>
                                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                        <Button 
                                            buttonStyle={{margin:width*0.05, width: width*0.9, height:height*0.65, borderColor:'white'}}
                                            title={strings.showResult}
                                            titleStyle={{color:'white', fontSize:20}}
                                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                            icon={<Icon name='arrowright' type='antdesign' color='white' />}
                                            iconRight={true}
                                            type='outline'
                                            onPress={handleinputWord}
                                        />
                                    </View>
                                )
                            }
                        }}
                    />
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    {props.cardData ? <Paginator data={props.cardData} scrollX={scrollX}/> : null}
                </View>
            )
        }
    }
    
    if (isFavLoading) {
        return (
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <SafeAreaView style={{flex:40, backgroundColor:'black', alignItems:"center", justifyContent:'center', paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0}}>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <StatusBar style='light' />
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <ActivityIndicator size='large' />
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <Text style={{color: 'grey',margin:10, fontSize:16}}>{strings.loading}</Text>
            </SafeAreaView>
        )
    } else {
        return (
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <SafeAreaView style={[styles.container, {paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0}]}>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <Modal 
                    animationType='fade'
                    transparent={true}
                    visible={isModalVisible}
                    onDismiss={() => setModalVisible(false)}>
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <View style={{
                        flex: 1,
                        justifyContent: "center",
                        backgroundColor: "rgba(0, 0, 0, 0.7)"
                        }}>
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <View style={{backgroundColor: 'black', marginVertical: height*0.2, flex: 1}}>
                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                            <Text style={{color: 'white', fontSize:20, margin:10, justifyContent:'center'}}>{strings.selectAFolderToSave}</Text>
                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                            <FlatList
                                style={{backgroundColor:'black'}}
                                data={props.folderList}
                                renderItem={({item})=> {
                                    return (
                                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                        <ScrollView vertical>
                                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                            <View style={itemBoxStyles.container}>
                                                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                                <TouchableOpacity 
                                                    style={{padding: 20}}
                                                    onPress={() => folderToSave(item) }
                                                    >
                                                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                                    <Text style={{color:'white', fontSize: 20}}>{item.name}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </ScrollView>
                                    )
                                }}
                                keyExtractor={(item) => item.name}
                                ListEmptyComponent={
                                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                    <View style={{alignItems: 'center', margin: width*0.1}}>
                                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                        <Text style={{color:'grey', fontSize:20}}>{strings.noFolderCreateFirst}</Text>
                                    </View>
                                }
                            />
                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                            <Button title='Cancel' onPress={() => setModalVisible(false)}/>
                        </View>
                    </View>       
                </Modal>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <StatusBar style='light' />
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <View style={styles.searchContainer}>
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <Icon name="text-search" type='material-community' size={30} color="white" />
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <TextInput
                        style={styles.input}
                        onChangeText={setInputWord}
                        onSubmitEditing={handleinputWord}
                        value={inputWord}
                        placeholder={strings.lookUpAWord}
                        keyboardType="default"
                    />
                </View>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <View style={styles.searchContainer}>
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <Icon name="book-open-page-variant" type='material-community' size={30} color="white" />
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <RNPickerSelect
                        // @ts-expect-error TS(2362): The left-hand side of an arithmetic operation must... Remove this comment to see the full error message
                        onValueChange={(value) => setSelectedDictionary(value) & props.updateCardData(null)}
                        placeholder={{label: strings.selectADictionary, color: 'grey'}}
                        // @ts-expect-error TS(2769): No overload matches this call.
                        style={{inputAndroid: [styles.input, {color:'black'}], inputIOS: styles.input}}
                        items={favDictionaries}
                        value={selectedDictionary}
                        useNativeAndroidPickerStyle={false}
                    />       
                </View>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <Cards />
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <FAB icon={{name: 'settings', type:'ionicons', color:'white'}} 
                    upperCase={true} 
                    color='#007AFF' 
                    placement='right'
                    onPress={() => navigation.navigate('SettingPage')}
                />   
            </SafeAreaView>
        );
    }
}

const mapStateToProps = (state: any) => {
    return { 
        cardData: state.cardData,
        folderList: state.folderList,
        savedWordList: state.savedWordList,
    }
};
    
const mapDispatchToProps = {updateCardData, updateFolderList, updateSavedWordList, updateFavDictionaries};
    
    
export default connect(mapStateToProps, mapDispatchToProps) (DictionaryScreen);
