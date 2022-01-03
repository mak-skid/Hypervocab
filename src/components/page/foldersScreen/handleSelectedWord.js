import React, { useState } from 'react';
import { View, SafeAreaView, FlatList, Modal, Text, ScrollView, Alert, TouchableOpacity, StatusBar} from 'react-native';
import { Header, Icon, Button } from 'react-native-elements';
import { styles, width, height } from '../style';
import { updateFolderList, updateSavedWordList } from '../../../actions';
import { connect } from 'react-redux';
import { itemBoxStyles } from '../../ItemBox';
import { UserDatabaseDB } from '../../openDatabase';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { strings } from '../strings';


const HandleSelectedWord = (props) => {
    const {folderList, savedWordList, navigation, route} = props

    const [selectedIndex, setSelectedIndex] = useState([]),
          [isModalVisible, setModalVisible] = useState(false),
          [isTransferAllModalVisible, setTransferAllModalVisible] = useState(false),
          [reloadScreen, setReloadScreen] = useState(true);

    const browsingFolder = route.params.item;

    if (reloadScreen) {
        UserDatabaseDB.transaction(tx => {
            tx.executeSql(`SELECT item_id, word, mean, meanings, phonetics, level FROM '${browsingFolder}';`, [],
            (_, results) => {
                console.log('Got a saved list in the folder to edit: ' + browsingFolder);
                const savedWord = results.rows.raw()
                props.updateSavedWordList(savedWord)
                setReloadScreen(false)
            },
            () => alert(strings.errorOpeningFolder)
            )
        })
    }
    
    const onPressHandler = (index) => {
        if (selectedIndex.includes(index)) {
            setSelectedIndex(selectedIndex.filter(value => value !== index))
        } else {
            setSelectedIndex([...selectedIndex, index]);
        }
    }
    const { showActionSheetWithOptions } = useActionSheet();

    const handleRightComponent = () => {
        const options = [strings.deleteSelectedWords, strings.deleteAll, strings.transferSelectedWords, strings.transferAll, strings.resetAllLevels, strings.cancel];
        const destructiveButtonIndex = [0, 1];
        const cancelButtonIndex = 5;
    
        showActionSheetWithOptions(
        {
            options,
            cancelButtonIndex,
            destructiveButtonIndex,
        },
        buttonIndex => { 
            switch (buttonIndex) {
                case 0:
                    if (!selectedIndex.length) {
                        Alert.alert(null, strings.noCardsSelected)
                    } else {
                        Alert.alert(strings.confirm, strings.areYouSureToDelete, [{
                            text: 'Yes', 
                            onPress: 
                                () => {
                                    selectedIndex.map((item) => {
                                        UserDatabaseDB.transaction(tx => {
                                            tx.executeSql(`DELETE FROM '${browsingFolder}' WHERE item_id = ${savedWordList[item].item_id} `,[],
                                            (_, results) => {
                                                console.log('deleted words');
                                                const savedWord = results.rows.raw();
                                                props.updateSavedWordList(savedWord);
                                                setReloadScreen(true);
                                            },
                                            () => alert(strings)
                                            )
                                        })
                                    })
                                }
                            }, {
                            text:'No'
                            }
                        ])
                    }
                    break;
                case 1:
                    Alert.alert(strings.confirm, strings.areYouSureToDeleteGone, [{
                        text: 'Yes', 
                        onPress: 
                            () => {
                                UserDatabaseDB.transaction(tx => {
                                    tx.executeSql(`DELETE FROM '${browsingFolder}'`,[],
                                    (_, results) => {
                                        console.log('deleted words');
                                        const savedWord = results.rows.raw();
                                        props.updateSavedWordList(savedWord);
                                        setReloadScreen(true);
                                    },
                                    () => alert(strings.errorDeletingCards)
                                    )
                                })
                            }
                        }, {
                        text:'No'
                        }
                    ])
                    break;
                case 2:
                    if (!selectedIndex.length) {
                        Alert.alert(null, strings.noCardsSelected)
                    } else {
                        setModalVisible(true);
                    }
                    break;
                case 3:
                    setTransferAllModalVisible(true);
                    break;
                case 4:
                    Alert.alert(strings.confirm, strings.areYouSureToReset, [{
                        text: 'Yes', 
                        onPress: 
                            () => {
                                UserDatabaseDB.transaction(tx => {
                                    tx.executeSql(`UPDATE "${browsingFolder}" SET level = 0, due_date = null;`,[],
                                    (_, results) => {
                                        console.log('reset level');
                                        const savedWord = results.rows.raw();
                                        props.updateSavedWordList(savedWord);
                                        setReloadScreen(true);
                                    },
                                    () => alert('Error reset')
                                    )
                                })
                            }
                        }, {
                        text:'No'
                        }
                    ])
                default:
                    break;
            }
        },
        );
    }
    
    const TransferWords = (item) => {
        const folderToTransfer = item.name;
        Alert.alert(strings.confirm, strings.areYouSureToTransfer + folderToTransfer + strings.areYouSureToTransferJapanese, [{
            text: 'Yes', 
            onPress: 
                () => {
                    selectedIndex.map((item) => {
                        UserDatabaseDB.transaction(tx => {
                            tx.executeSql(`INSERT INTO "${folderToTransfer}" SELECT * FROM "${browsingFolder}" WHERE item_id = ${savedWordList[item].item_id} `,[],
                            (_, results) => {
                                console.log('transfered words');
                                const savedWord = results.rows.raw();
                                props.updateSavedWordList(savedWord);
                                setModalVisible(false);
                                setReloadScreen(true);
                            },
                            () => {
                                Alert.alert(strings.error, strings.duplicatesFoundTransferAreYouSure + folderToTransfer + strings.duplicateFoundYouMightLose, [{
                                    text: 'Yes', 
                                    onPress: 
                                        () => {
                                            UserDatabaseDB.transaction(tx => {
                                                tx.executeSql(`INSERT OR REPLACE INTO "${folderToTransfer}" SELECT * FROM "${browsingFolder}"`,[],
                                                (_, results) => {
                                                    console.log('transfered words');
                                                    const savedWord = results.rows.raw();
                                                    props.updateSavedWordList(savedWord);
                                                    setModalVisible(false);
                                                    setReloadScreen(true);
                                                },
                                                () => alert('Error transfering words')
                                                )
                                            })
                                        }
                                    }, {
                                    text:'No'
                                    }
                                ])
                            }
                            )
                        })
                    })
                }
            }, {
            text:'No'
            }
        ])  
    }

    const TransferAll = (item) => {
        const folderToTransfer = item.name;
        Alert.alert(strings.error, strings.areYouSureToTransferAll + folderToTransfer + strings.areYouSureToTransferAllJapanese, [{
            text: 'Yes', 
            onPress: 
                () => {
                    UserDatabaseDB.transaction(tx => {
                        tx.executeSql(`INSERT INTO '${folderToTransfer}' SELECT * FROM '${browsingFolder}'`,[],
                        (_, results) => {
                            console.log('transfered words');
                            const savedWord = results.rows.raw();
                            props.updateSavedWordList(savedWord);
                            setTransferAllModalVisible(false);
                            setReloadScreen(true);
                        },
                        () => {
                            Alert.alert(strings.error, strings.duplicatesFoundTransferAreYouSure + folderToTransfer + strings.duplicateFoundYouMightLose, [{
                                text: 'Yes', 
                                onPress: 
                                    () => {
                                        UserDatabaseDB.transaction(tx => {
                                            tx.executeSql(`INSERT OR REPLACE INTO '${folderToTransfer}' SELECT * FROM '${browsingFolder}'`,[],
                                            (_, results) => {
                                                console.log('transfered words');
                                                const savedWord = results.rows.raw();
                                                props.updateSavedWordList(savedWord);
                                                setTransferAllModalVisible(false);
                                                setReloadScreen(true);
                                            },
                                            () => alert('Error transfering words')
                                            )
                                        })
                                    }
                                }, {
                                text:'No'
                                }
                            ])
                        }   
                        )
                    })
                }
            }, {
            text:'No'
            }
        ])   
    }
    
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
                        leftComponent={<Icon name='arrowleft' type='antdesign' color='white' onPress={()=> navigation.navigate('BrowseFolder')}/>}
                        centerComponent={{text: strings.select, style:{color: 'white', fontSize:20}}}
                        rightComponent={<Icon name='ellipsis-horizontal' type='ionicon' color='white' onPress={() => handleRightComponent()}/>}
                    />
                    <Modal 
                        animationType='fade'
                        transparent={true}
                        visible={isModalVisible}
                        onDismiss={() => setModalVisible(false)}>
                        <View style={{
                            flex: 1,
                            justifyContent: "center",
                            backgroundColor: "rgba(0, 0, 0, 0.7)"
                            }}>
                            <View style={{backgroundColor: 'black', marginVertical: height*0.2, flex: 1}}>
                                <Text style={{color: 'white', fontSize:20, margin:10, justifyContent:'center'}}>{strings.selectAFolderToTransfer}</Text>
                                <FlatList
                                    style={{backgroundColor:'black'}}
                                    data={props.folderList.filter(item=>(item.name !==browsingFolder))}
                                    renderItem={({item, index})=> {
                                        return (
                                            <ScrollView vertical>
                                                <View style={itemBoxStyles.container}>
                                                    <TouchableOpacity 
                                                        style={{padding: 20}}
                                                        onPress={() => TransferWords(item)}
                                                        >
                                                        <Text style={{color:'white', fontSize: 20}}>{item.name}</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </ScrollView>
                                        )
                                    }}
                                    keyExtractor={(item) => 'Transfer to' + item.name}
                                    ListEmptyComponent={
                                        <View style={{alignItems: 'center', margin: width*0.1}}>
                                            <Text style={{color:'grey', fontSize:20}}>{strings.noFolderCreateFirst}</Text>
                                        </View>
                                    }
                                />
                                <Button title='Cancel' onPress={() => setModalVisible(false)}/>
                            </View>
                        </View>       
                    </Modal>
                    <Modal 
                        animationType='fade'
                        transparent={true}
                        visible={isTransferAllModalVisible}
                        onDismiss={() => setTransferAllModalVisible(false)}>
                        <View style={{
                            flex: 1,
                            justifyContent: "center",
                            backgroundColor: "rgba(0, 0, 0, 0.7)"
                            }}>
                            <View style={{backgroundColor: 'black', marginVertical: height*0.2, flex: 1}}>
                                <Text style={{color: 'white', fontSize:20, margin:10, justifyContent:'center'}}>Select a folder to transfer</Text>
                                <FlatList
                                    style={{backgroundColor:'black'}}
                                    data={props.folderList.filter(item=>(item.name !==browsingFolder))}
                                    renderItem={({item, index})=> {
                                        return (
                                            <ScrollView vertical>
                                                <View style={itemBoxStyles.container}>
                                                    <TouchableOpacity 
                                                        style={{padding: 20}}
                                                        onPress={() => TransferAll(item)}
                                                        >
                                                        <Text style={{color:'white', fontSize: 20}}>{item.name}</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </ScrollView>
                                        )
                                    }}
                                    keyExtractor={(item) => 'Transfer All to' + item.name}
                                    ListEmptyComponent={
                                        <View style={{alignItems: 'center', margin: width*0.1}}>
                                            <Text style={{color:'grey', fontSize:20}}>{strings.noFolderCreateFirst}</Text>
                                        </View>
                                    }
                                />
                                <Button title='Cancel' onPress={() => setTransferAllModalVisible(false)}/>
                            </View>
                        </View>       
                    </Modal>
                    <FlatList
                        style={{backgroundColor:'black'}}
                        data={savedWordList}
                        renderItem={({item, index})=> {
                            const backgroundColor = selectedIndex.includes(index) ? 'rgba(40, 40, 40, 1)' : 'black';
                            const parsedMeanings = JSON.parse(unescape(savedWordList[index].meanings));
                            return (
                                <ScrollView vertical>
                                    <TouchableOpacity onPress={() => onPressHandler(index)}>
                                        <View style={{borderColor:'grey', borderBottomWidth:1, backgroundColor:backgroundColor}}>
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
                        }}
                        keyExtractor={(item) => item.name}
                        ListEmptyComponent={
                            <View style={{alignItems: 'center', marginTop: height*0.2}}>
                                <Text style={{color:'grey', fontSize:20}}>{strings.noCardInFolder}</Text>
                            </View>
                        }
                    />
                </SafeAreaView>
        </View>
    )
}

const mapStateToProps = state => {
    return { 
        folderList: state.folderList,
        savedWordList: state.savedWordList,
    }
};

const mapDispatchToProps = {updateFolderList, updateSavedWordList};
    
    
export default connect(mapStateToProps, mapDispatchToProps) (HandleSelectedWord);