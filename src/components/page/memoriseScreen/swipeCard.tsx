import React, { useState, useRef, useCallback } from 'react';
import { View, SafeAreaView, FlatList, Text, ScrollView, Alert, Pressable, StatusBar } from 'react-native';
import { Header, Icon, Button, Card } from 'react-native-elements';
import { height, styles, width } from '../style';
import { updateFolderList, updateSavedWordList } from '../../../actions';
import { connect } from 'react-redux';
import { UserDatabaseDB } from '../../openDatabase';
import { useFocusEffect } from '@react-navigation/native';
// @ts-expect-error TS(6142): Module '../Sound' was resolved to '/Users/Mak/Hype... Remove this comment to see the full error message
import { AudioPlayer } from '../Sound';
import { strings } from '../strings';
import { BannerAd, TestIds } from '@react-native-admob/admob';


const SwipeCard = (props: any) => {
    const {savedWordList, navigation, route} = props

    const [reloadScreen, setReloadScreen] = useState(true);
    const FolderToMemorise = route.params.FolderToSwipe.name

    const time = new Date();

    const DatabaseAccess = useCallback(() => {
        UserDatabaseDB.transaction((tx: any) => {
            tx.executeSql(`SELECT item_id, word, mean, meanings, origin, phonetics, level, due_date FROM "${FolderToMemorise}" WHERE (level < 6) AND (due_date < ${time.getTime()} OR due_date IS NULL);`, [],
            (_: any, results: any) => {
                console.log('Got a saved list in the folder: ' + FolderToMemorise);
                const savedWord = results.rows.raw()
                props.updateSavedWordList(savedWord)
                setShowContent(false);
            },
            () => alert(strings.errorOpeningFolder)
            )
        })
    },[reloadScreen]);

    useFocusEffect(DatabaseAccess);
    
    const updateLevelNo = ({
        item_id
    }: any) => {   
        UserDatabaseDB.transaction((tx: any) => {
            tx.executeSql(
                `UPDATE "${FolderToMemorise}" SET level = 1, due_date = ${time.setMinutes(time.getMinutes()+1)} WHERE item_id = ${item_id};`, [],
            (_: any, results: any) => {
                console.log('Updated: ' + FolderToMemorise);
                setReloadScreen(true);
                DatabaseAccess();
            },
            () => alert(strings.errorUpdatingFolder)
            )
        })
    }

    const updateLevelSoSo = ({
        item_id,
        level
    }: any) => {
        UserDatabaseDB.transaction((tx: any) => {
            switch (level) {
                case 0:
                case 1:
                case 2:
                    tx.executeSql(
                        `UPDATE "${FolderToMemorise}" SET level = 2, due_date = ${time.setMinutes(time.getMinutes()+10)} WHERE item_id = ${item_id};`, [],
                        (_: any, results: any) => {
                            console.log('Updated: ' + FolderToMemorise);
                            setReloadScreen(true);
                        },
                        () => alert(strings.errorUpdatingFolder)
                    )
                    break;
                case 3:
                case 4:
                case 5: 
                    tx.executeSql(
                        `UPDATE "${FolderToMemorise}" SET level = 3, due_date = ${time.setDate(time.getDate()+1)} WHERE item_id = ${item_id};`, [],
                        (_: any, results: any) => {
                            console.log('Updated: ' + FolderToMemorise);
                            setReloadScreen(true);
                        },
                        () => alert(strings.errorUpdatingFolder)
                    )
                    break; 
                default:
                    setReloadScreen(true);
                    break;
            }    
        })
    }

    const updateLevelGood = ({
        item_id,
        level
    }: any) => {
        UserDatabaseDB.transaction((tx: any) => {
            switch (level) {
                case 0:
                case 1:
                case 2:
                    tx.executeSql(
                        `UPDATE "${FolderToMemorise}" SET level = 3, due_date = ${time.setDate(time.getDate()+1)} WHERE item_id = ${item_id};`, [],
                        (_: any, results: any) => {
                            console.log('Updated: ' + FolderToMemorise);
                            setReloadScreen(true);
                        },
                        () => alert(strings.errorUpdatingFolder)
                    )
                    break; 
                case 3:
                    tx.executeSql(
                        `UPDATE "${FolderToMemorise}" SET level = 4, due_date = ${time.setDate(time.getDate()+4)} WHERE item_id = ${item_id};`, [],
                        (_: any, results: any) => {
                            console.log('Updated: ' + FolderToMemorise);
                            setReloadScreen(true);
                        },
                        () => alert(strings.errorUpdatingFolder)
                    )
                    break; 
                case 4:
                    tx.executeSql(
                        `UPDATE "${FolderToMemorise}" SET level = 5, due_date = ${time.setDate(time.getDate()+7)} WHERE item_id = ${item_id};`, [],
                        (_: any, results: any) => {
                            console.log('Updated: ' + FolderToMemorise);
                            setReloadScreen(true);
                        },
                        () => alert(strings.errorUpdatingFolder)
                    )
                    break; 
                case 5: 
                    tx.executeSql(
                        `UPDATE "${FolderToMemorise}" SET level = 6, due_date = 0 WHERE item_id = ${item_id};`, [],
                        (_: any, results: any) => {
                            console.log('Updated: ' + FolderToMemorise);
                            Alert.alert(strings.congraturations, strings.clearedThisCard)
                            setReloadScreen(true);
                        },
                        () => alert(strings.errorUpdatingFolder)
                    )
                    break;
                default:
                    setReloadScreen(true);
                    break;
            }    
        })
    }

    const [currentIndex, setCurrentIndex] = useState(0),
          [showContent, setShowContent] = useState(false);

    const viewableItemsChanged = useRef(({
        viewableItems
    }: any) => {
        setCurrentIndex(viewableItems[0].index)
    }).current;

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50}).current;

    const refContainer = useRef(null);

    const mainRenderItem = ({
        item,
        index
    }: any) => {
        const onPressHandler = (index: any) => {
            if (savedWordList.length === 1) {
                Alert.alert(strings.finished, strings.finishedDetail);
            } else {
                // @ts-expect-error TS(2531): Object is possibly 'null'.
                refContainer.current.scrollToIndex({animated: true, index: index});
            }
        }

        const MainContent = () => {
            if (item.mean) {
                return (
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <View>
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <ScrollView showsVerticalScrollIndicator={true} vertical>
                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                            <Text style={{color:'white',fontSize:18}}>
                                {item.mean.replaceAll("/","\n\n")}
                            </Text>
                        </ScrollView>
                    </View>
                )
            } else {
                const parsedMeanings = JSON.parse(unescape(item.meanings))
                const parsedPhonetics = JSON.parse(unescape(item.phonetics))

                return (
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <View>
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        {parsedPhonetics.map((item: any) => <View style={{flexDirection: 'row'}}>
                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                            {item.text != undefined && <Text style={{color:'white', fontSize:18}} key={index}>| {item.text} |</Text>}
                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                            {item.audio != undefined && <AudioPlayer url={item.audio}/>}
                        </View>
                            )
                        }
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <FlatList
                            data={parsedMeanings}
                            scrollEnabled={false}
                            keyExtractor={(item, index) => 'key'+index}
                            renderItem={({item, index})=> {
                                const childData = parsedMeanings[index].definitions;
                                return (
                                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                    <View>
                                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                        <Text style={{color: 'grey', fontSize:18, marginTop: 10}}>{item.partOfSpeech}</Text>
                                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                        <FlatList
                                            data={childData}
                                            scrollEnabled={false}
                                            keyExtractor={(item, index)=> 'key(childData)' + index}
                                            renderItem={({item, index}) => {
                                                return (
                                                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                                    <View>
                                                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                                        <Text style={{color:'white',fontSize:18, borderRadius:5, borderColor:'black', borderWidth:1}}>{item.definition}</Text>
                                                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                                        <Text style={{color:'grey',fontSize:18, fontStyle: 'italic', borderRadius:5, borderColor:'black', borderWidth:1}}> 
                                                            {item.example} 
                                                        </Text>
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
                        <Text style={{color:'white',fontSize:18}}>{item.origin}</Text>
                    </View>
                );
            }
        }
    
        return (
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <View>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <Card containerStyle={{backgroundColor:'black', borderRadius:5, width:width*0.9, flex: 1}}>
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <Pressable onPress={() => setShowContent(true)} disabled={showContent} style={{height: height*0.65}} >
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <ScrollView showsVerticalScrollIndicator={false} scrollEnabled={showContent} contentContainerStyle={{flex:1, flexDirection:'column'}}>
                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                            <Text style={{color:'white',fontSize:30, fontWeight:"bold"}}>
                                {item.word}
                            </Text>
                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                            {showContent ? <MainContent /> : 
                                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                <View style={{justifyContent:'center', alignItems:'center', flex:1}}>
                                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                    <Text style={{color:'white', fontSize:20}}>{strings.answer}</Text>
                                </View>
                            }                        
                        </ScrollView>
                    </Pressable>
                </Card>
                {showContent ? 
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <View style={{justifyContent:'flex-end', backgroundColor:'black'}}>
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <View style={{flexDirection: 'row', justifyContent:'space-evenly', margin:10 }}>
                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                            <Button icon={<Icon name='close' type='material-community' color='white'/>} buttonStyle={{backgroundColor:'red', borderRadius:20, width: width*0.2}} onPress={() => onPressHandler(index) & updateLevelNo({item_id: item.item_id})}/>
                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                            <Button icon={<Icon name='triangle-outline' type='material-community' color='white'/>} buttonStyle={{backgroundColor:'orange', borderRadius:20, width: width*0.2}} onPress={() => onPressHandler(index) & updateLevelSoSo({item_id: item.item_id, level: item.level})}/>
                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                            <Button icon={<Icon name='circle-outline' type='material-community' color='white'/>} buttonStyle={{borderRadius:20, width: width*0.2}} onPress={() => onPressHandler(index) & updateLevelGood({item_id: item.item_id, level: item.level})}/>
                        </View>
                    </View>
                 : 
                    null
                }
            </View>
        )
    }

    return (
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <View style={[styles.container, {paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0}]}>
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <StatusBar style='light'/>
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <SafeAreaView style={{
                backgroundColor: 'black',
                alignItems: 'center',
                flex: 1,
                }}>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <Header 
                    backgroundColor='black'
                    containerStyle={{ marginTop: ((StatusBar.currentHeight || 0) * -1) }}
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    leftComponent={<Icon name='arrowleft' type='antdesign' color='white' onPress={()=> navigation.navigate('MemoriseScreen')}/>}
                    centerComponent={{text: strings.memorise, style:{color: 'white', fontSize:20}}}
                    rightComponent={{text: (props.savedWordList.length != 0) ? /*(currentIndex+1) + '/'*/ props.savedWordList.length : null, style:{color: 'white', fontSize:20}}}
                    />
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <FlatList
                    style={{backgroundColor:'black'}}
                    horizontal={true}
                    data={savedWordList}
                    pagingEnabled={true}
                    scrollEnabled={false}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => 'key'+index}
                    renderItem={mainRenderItem}
                    viewabilityConfig={viewConfig}
                    onViewableItemsChanged={viewableItemsChanged}
                    onScroll={() => setShowContent(false)}
                    ref={refContainer}
                    ListEmptyComponent={
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <View style={{alignItems: 'center', margin: width*0.1}}>
                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                            <Text style={{color:'grey', fontSize:20}}>{strings.noCardInFolder}</Text>
                        </View>
                    }
                />
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <BannerAd size="ADAPTIVE_BANNER" unitId={TestIds.BANNER} />                
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
    
    
export default connect(mapStateToProps, mapDispatchToProps) (SwipeCard);    