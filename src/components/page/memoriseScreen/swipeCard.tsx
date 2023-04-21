import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, SafeAreaView, FlatList, Text, ScrollView, Alert, Pressable, StatusBar, Platform, ListRenderItemInfo} from 'react-native';
import { Header, Icon, Button, Card } from 'react-native-elements';
import { height, styles, width } from '../style';
import { updateFolderList, updateSavedWordList } from '../../../actions';
import { connect } from 'react-redux';
import { UserDatabaseDB } from '../../openDatabase';
import { useFocusEffect } from '@react-navigation/native';
import { AudioPlayer } from '../Sound';
import { strings } from '../strings';
import { BannerAd, TestIds } from '@react-native-admob/admob';
import Swiper from "react-native-deck-swiper";
import { Transaction, ResultSet } from 'react-native-sqlite-storage';


const SwipeCard = (props: any) => {
    const {savedWordList, navigation, route} = props

    const [reloadScreen, setReloadScreen] = useState(true);
    const FolderToMemorise = route.params.FolderToSwipe.name

    const time = new Date();

    const DatabaseAccess = useCallback(() => {
        UserDatabaseDB.transaction((tx: Transaction) => {
            tx.executeSql(`SELECT item_id, word, mean, meanings, origin, phonetics, level, due_date FROM "${FolderToMemorise}" WHERE (level < 6) AND (due_date < ${time.getTime()} OR due_date IS NULL);`, [],
            (_, results: ResultSet) => {
                console.log('Got a saved list in the folder: ' + FolderToMemorise);
                const savedWord = results.rows.raw()
                props.updateSavedWordList(savedWord)
                setShowContent(false);
            },
            () => {
                alert(strings.errorOpeningFolder)
            })
        })
    },[reloadScreen]);

    useFocusEffect(DatabaseAccess);
    
    const updateLevelNo = ({item_id}: any) => {   
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

    const updateLevelSoSo = ({item_id,level}: any) => {
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

    const updateLevelGood = ({item_id,level}: any) => {
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

    const [swipable, setSwipable] = useState(false),
          [showContent, setShowContent] = useState(false);   
    
    const refContainer = useRef<any>(null);
    
    const mainRenderItem = (item: any, index: any) => {
        
        // when the item is undefined, it means that the list is empty
        if (item == undefined) {
            return (
                <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                    <Text style={{color:'white', fontSize:18}}>{strings.noCardInFolder}</Text>
                </View>
            )
        }
    
        const onPressHandler = (index: any) => {
            if (savedWordList.length === 1) {
                Alert.alert(strings.finished, strings.finishedDetail);
            } else {
                refContainer.current.scrollToIndex({animated: true, index: index});
            }
        }
        
        const MainContent = () => {
            if (!showContent) {
                return (
                    <View style={{justifyContent:'center', alignItems:'center', flex:1}}>
                        <Text style={{color:'white', fontSize:20}}>{strings.answer}</Text>
                    </View>
                )
            } else {
                if (item.mean) {
                    return (
                        <View>
                            <ScrollView showsVerticalScrollIndicator={true}>  
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
                        <View>
                            {parsedPhonetics.map((item: any) => 
                                <View style={{flexDirection: 'row'}}>  
                                    {item.text != undefined && <Text style={{color:'white', fontSize:18}} key={index}>| {item.text} |</Text>}
                                    {item.audio != undefined && <AudioPlayer url={item.audio}/>}
                                </View>
                            )}
                            <FlatList
                                data={parsedMeanings}
                                scrollEnabled={false}
                                keyExtractor={(index) => 'key'+index}
                                renderItem={({item, index})=> {
                                    const childData = parsedMeanings[index].definitions;
                                    return (           
                                        <View>
                                            <Text style={{color: 'grey', fontSize:18, marginTop: 10}}>{item.partOfSpeech}</Text>
                                            <FlatList
                                                data={childData}
                                                scrollEnabled={false}
                                                keyExtractor={(index)=> 'key(childData)' + index}
                                                renderItem={({item}) => {
                                                    return (
                                                        <View>
                                                            <Text style={{color:'white',fontSize:18, borderRadius:5, borderColor:'black', borderWidth:1}}>{item.definition}</Text>
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
                            <Text style={{color:'white', fontWeight: 'bold', fontSize:18, marginTop:10}}>{strings.origin}</Text>
                            <Text style={{color:'white',fontSize:18}}>{item.origin}</Text>
                        </View>
                    );
                }
            }
        }

        return (
            <View style={{
                height: height*0.65,
                padding:10,
                backgroundColor: 'black',
                borderRadius: 5,
                borderColor: 'white',
                borderWidth: 1,
            }}>
                <Pressable 
                    onPress={() => {
                        setShowContent(true)
                        setSwipable(true)
                    }}
                    disabled={showContent} 
                    style={{height: height*0.65}} 
                >
                    <ScrollView showsVerticalScrollIndicator={false} scrollEnabled={showContent} contentContainerStyle={{flex:1, flexDirection:'column'}}>
                        <Text style={{color:'white',fontSize:30, fontWeight:"bold"}}>
                            {item.word}
                        </Text>
                        <MainContent />          
                    </ScrollView>
                </Pressable>
            </View>
        )
    }

    return (   
        <View style={[styles.container, {paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0}]}>
            <StatusBar barStyle='light-content'/>
            <SafeAreaView style={{
                backgroundColor: 'black',
                flex: 1,
                }}>
                <Header 
                    backgroundColor='black'
                    containerStyle={{ marginTop: ((StatusBar.currentHeight || 0) * -1) }} 
                    leftComponent={<Icon name='arrowleft' type='antdesign' color='white' onPress={() => navigation.navigate('MemoriseScreen')} tvParallaxProperties={undefined}/>}
                    centerComponent={{text: strings.memorise, style:{color: 'white', fontSize:20}}}
                    rightComponent={{text: (props.savedWordList.length != 0) ? /*(currentIndex+1) + '/'*/ props.savedWordList.length : null, style:{color: 'white', fontSize:20}}}
                />
                <View> 
                {/* wrapping Swiper with View so that it looks pretty */}
                    <Swiper
                        cards={savedWordList}
                        renderCard={mainRenderItem}
                        keyExtractor={index => 'swiperKey'+index}
                        key={savedWordList.length}
                        cardIndex={0}
                        backgroundColor={'black'}
                        stackSize={3}
                        horizontalSwipe={swipable}
                        verticalSwipe={swipable}
                        disableBottomSwipe={true}
                        onSwipedLeft={(index)=> updateLevelNo({item_id: savedWordList[index].item_id})}
                        onSwipedRight={(index) => updateLevelGood({item_id: savedWordList[index].item_id, level: savedWordList[index].level})}
                        onSwipedTop={(index) => updateLevelSoSo({item_id: savedWordList[index].item_id, level: savedWordList[index].level})}
                    />  
                </View>
            </SafeAreaView>
            {/*<BannerAd size="ADAPTIVE_BANNER" unitId={TestIds.BANNER} />*/}
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

function MainContent() {
    throw new Error('Function not implemented.');
}
