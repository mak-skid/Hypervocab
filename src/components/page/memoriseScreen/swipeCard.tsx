import React, { useState, useRef, useCallback } from 'react';
import { View, SafeAreaView, Text, ScrollView, Alert, Pressable, StatusBar, Platform} from 'react-native';
import { Header, Icon } from 'react-native-elements';
import { height, styles } from '../style';
import { updateFolderList, updateSavedWordList } from '../../../actions';
import { connect } from 'react-redux';
import { UserDatabaseDB } from '../../openDatabase';
import { useFocusEffect } from '@react-navigation/native';
import { strings } from '../strings';
import Swiper from "react-native-deck-swiper";
import { Transaction, ResultSet } from 'react-native-sqlite-storage'
import { MainContent } from './mainContent';
import OverlayLabel from './overlayLabel';


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
                setShowContent(0);
            },
            () => {
                alert(strings.errorOpeningFolder)
            })
        })
    },[reloadScreen]);

    useFocusEffect(DatabaseAccess);
    
    const updateLevelNo = ({item_id}: any) => {   
        UserDatabaseDB.transaction((tx: Transaction) => {
            tx.executeSql(
                `UPDATE "${FolderToMemorise}" SET level = 1, due_date = ${time.setMinutes(time.getMinutes()+1)} WHERE item_id = ${item_id};`, [],
            (_, results: ResultSet) => {
                console.log('Updated: ' + FolderToMemorise);
                setReloadScreen(true);
                DatabaseAccess();
            },
            () => alert(strings.errorUpdatingFolder)
            )
        })
    }

    const updateLevelSoSo = ({item_id, level}: any) => {
        UserDatabaseDB.transaction((tx: Transaction) => {
            switch (level) {
                case 0:
                case 1:
                case 2:
                    tx.executeSql(
                        `UPDATE "${FolderToMemorise}" SET level = 2, due_date = ${time.setMinutes(time.getMinutes()+10)} WHERE item_id = ${item_id};`, [],
                        (_, results: ResultSet) => {
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
                        (_, results: ResultSet) => {
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

    const updateLevelGood = ({item_id, level}: any) => {
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
          [showContent, setShowContent] = useState(0); // the type is number so that Swiper's key can take it
    
    const refContainer = useRef<any>(null);

    const mainRenderItem = (item: any, index: number) => {
        setSwipable(false)

        // when the item is undefined, it means that the list is empty
        if (item == undefined) {
            return (
                <View style={{ flex:0.8, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: 'white', fontSize: 18 }}>{strings.noCardInFolder}</Text>
                </View>   
            );
        }
        {/*
        const onPressHandler = (index: any) => {
            if (savedWordList.length === 1) {
                Alert.alert(strings.finished, strings.finishedDetail);
            } else {
                refContainer.current.scrollToIndex({ animated: true, index: index });
            }
        };
        */}

        return (
            <View style={{
                height: height*0.65,
                padding:10,
                backgroundColor: 'black',
                borderRadius: 5,
                borderColor: 'white',
                borderWidth: 1,
            }}> 
                <ScrollView scrollEnabled={!!showContent}>
                    <Text style={{color:'white',fontSize:30, fontWeight:"bold",}}>{item.word}</Text>
                    <Pressable onLongPress={() => setSwipable(true)} >
                        {!!!showContent ? 
                            <View style={{justifyContent:'center', alignItems:'center', height: height*0.55}}>
                                <Pressable onPress={() => setShowContent(1)}>
                                    <Text style={{color:'white', fontSize:20}}>{strings.answer}</Text>
                                </Pressable>
                            </View>
                        :
                            <MainContent item={item} index={index} showContent={!!showContent} />
                        }
                    </Pressable>
                </ScrollView>     
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
                    rightComponent={{text: (props.savedWordList.length != 0) ? /*(currentIndex+1) + '/'*/ savedWordList.length : null, style:{color: 'white', fontSize:20}}}
                />
                <View style={{backgroundColor:'orange'}}>
                {/* wrapping Swiper with View so that it looks pretty */}
                    <Swiper
                        cards={savedWordList}
                        renderCard={(cardItem: any, cardIndex: number) => mainRenderItem(cardItem, cardIndex)}
                        keyExtractor={index => 'swiperKey'+index}
                        key={showContent}
                        backgroundColor={'black'}
                        stackSize={1}
                        horizontalSwipe={swipable}
                        verticalSwipe={swipable}
                        disableBottomSwipe={true}
                        onSwipedLeft={(index)=> updateLevelNo({item_id: savedWordList[index].item_id})}
                        onSwipedRight={(index) => updateLevelGood({item_id: savedWordList[index].item_id, level: savedWordList[index].level})}
                        onSwipedTop={(index) => updateLevelSoSo({item_id: savedWordList[index].item_id, level: savedWordList[index].level})}
                        onTapCard={(index) => [setShowContent(1)]}
                        onSwipedAll={() => {
                            Alert.alert(strings.finished, strings.finishedDetail, [{text: 'OK', onPress: () =>{navigation.navigate('MemoriseScreen')}}])
                            
                        }}
                        overlayLabels={{
                            left: {
                                title: 'NOPE',
                                element: <OverlayLabel label="NOPE" color="#E5566D" />,
                                style: {
                                    wrapper: styles.overlayWrapper,
                                },
                            },
                            top: {
                                title: 'SO-SO',
                                element: <OverlayLabel label="SO-SO" color="#f5d623" />,
                                style: {
                                    wrapper: {
                                        ...styles.overlayWrapper,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    },
                                },
                            },
                            right: {
                                title: 'GOOD',
                                element: <OverlayLabel label="GOOD" color="#4CCC93" />,
                                style: {
                                    wrapper: {
                                        ...styles.overlayWrapper,
                                        alignItems: 'flex-start',
                                        marginLeft: 30,
                                    },
                                },
                            },
                        }}
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