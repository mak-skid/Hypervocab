import React, { useState } from 'react';
import { View, SafeAreaView, FlatList, StyleSheet, Text, ScrollView, Alert, StatusBar, Platform } from 'react-native';
import { Header, Icon } from 'react-native-elements';
import { styles, width, height } from '../style';
import { updateFolderList, updateSavedWordList } from '../../../actions';
import { connect } from 'react-redux';
import { ItemBox } from '../../ItemBox';
import prompt from 'react-native-prompt-android';
import { UserDatabaseDB } from '../../openDatabase';
import { strings } from '../strings';


function FolderScreen(props: any) {
    const {folderList, savedWordList, navigation} = props

    const [reloadScreen, setReloadScreen] = useState(true);
    if (reloadScreen) {
        UserDatabaseDB.transaction((tx: any) => {
            tx.executeSql(
            `SELECT name FROM sqlite_master WHERE (type = "table") AND (name != "sqlite_sequence" AND name != "android_metadata");`, [], 
                (_: any, results: any) => {
                    const folderList = results.rows.raw();
                    console.log('tables: ', results.rows.length);
                    props.updateFolderList(folderList);
                    setReloadScreen(false)
                }, () => { 
                    alert(strings.databaseConnectionError)
                }
            )
        })
    }
     
    const createDialog = () => {
        prompt(strings.createFolder, strings.setNewFolderName,[{
            text: strings.cancel},{
            text: 'OK', onPress: (setName) => createNewFolder(setName)
            }],{
            cancelable: false, defaultValue: 'New Folder', placeholder: 'placeholder'
            }
        )
    }

    const createNewFolder = (setName: any) => {
        var len = props.folderList.length
        const handleDB = UserDatabaseDB.transaction((tx: any) => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS "${setName}" (
                    item_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    word TEXT,
                    mean TEXT,
                    phonetics TEXT,
                    origin TEXT,
                    meanings TEXT,
                    level INTEGER DEFAULT 0,
                    due_date INTEGER
                    );`, [],
                (_: any, results: any) => {
                    console.log("Query: Folder Created");
                    setReloadScreen(true);
                }, () => { 
                    alert(strings.failedCreateFolder)
                }
            )
        })    

        if (setName === '') {
            alert(strings.setValidName)
        } else {
            if (len > 0) {
                for (var i = 0; i < len; i++) {
                    console.log(props.folderList[i].name);
                    const prevFolderName = props.folderList[i].name
                    if (setName === prevFolderName) {
                        alert(strings.folderNameDuplicate)
                    } else {
                        handleDB
                    }  
                }
            } else {
                handleDB
            }
        }
    }

    const deleteDialog = (index: any) => {
        Alert.alert(strings.confirm, strings.areYouSureToDeleteGone, [{
            text: 'Yes', onPress: () => {deleteFolder(index)}
            }, {text:'No'}
        ])
    }

    const deleteFolder = (item: any) => {
        const deleteValue = item.name
        UserDatabaseDB.transaction((tx: any) => {
            tx.executeSql(`DROP TABLE "${deleteValue}"`,[],
            (_: any, results: any) => {
                console.log('deleted a table: ' + deleteValue);
                setReloadScreen(true);
            },
            () => Alert.alert(strings.error,strings.errorDeletingFolder)
            )
        })  
    };

    const editDialog = (item: any) => {
        const prevValue = item.name
        prompt(strings.editFolderName, strings.insertFolderName,[{
            text: strings.cancel},{
            text: 'OK', onPress: (editedName) => editFolder(prevValue, editedName)
            }],{
            cancelable: false, defaultValue: prevValue,
            }
        )
    }

    const editFolder = (prevValue: any, editedName: any) => {
        if (editedName === '') {
            Alert.alert(strings.error, strings.setValidName)
        } else if (editedName === prevValue) {
            Alert.alert(strings.error, strings.editValidFolderName)
        } else {
            console.log('editFrom: ', prevValue);
            console.log('editTo: ', editedName)
            UserDatabaseDB.transaction((tx: any) => {
                tx.executeSql(`ALTER TABLE "${prevValue}" RENAME TO "${editedName}";`, [],
                (_: any, results: any) => {
                    console.log('edited a table name: ' + prevValue);
                    setReloadScreen(true);
                },
                () => Alert.alert(strings.error, strings.failedEditingFolderName)
                )
            })
        }   
    }

    const foldersRenderItem = ({item,index}: any)=> {
        return(
            <ScrollView> 
                <ItemBox 
                    data={item.name} 
                    handleDelete={() => deleteDialog(item)}
                    handleEdit={() => editDialog(item)}
                    handleBrowse={() => navigation.navigate('BrowseFolder', {index: index})}
                />
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
                    rightComponent={     
                        <Icon name='addfolder' type='antdesign' color='white' onPress={() => createDialog()} tvParallaxProperties={undefined}/>
                    }
                    centerComponent={{text: strings.folders, style:{color: 'white', fontSize:20}}}
                    />
                <FlatList
                    style={{backgroundColor:'black'}}
                    data={props.folderList}
                    renderItem={foldersRenderItem}
                    keyExtractor={(item) => item.name}
                    ListEmptyComponent={  
                        <View style={{alignItems: 'center', marginTop: height*0.2}}>
                            <Text style={{color:'grey', fontSize:20}}>{strings.noFolder}</Text>
                        </View>
                    }
                />   
                </SafeAreaView>
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
    
    
export default connect(mapStateToProps, mapDispatchToProps) (FolderScreen);



export const modalStyles = StyleSheet.create({
        viewWrapper: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.2)",
        },
        modalView: {
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            top: "50%",
            left: "50%",
            elevation: 5,
            transform: [{ translateX: -(width * 0.4) }, 
                        { translateY: -90 }],
            height: 180,
            width: width * 0.8,
            backgroundColor: "#fff",
            borderRadius: 7,
        },
        textInput: {
            width: "80%",
            borderRadius: 5,
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderColor: "rgba(0, 0, 0, 0.2)",
            borderWidth: 1,
            marginBottom: 8,
        },
});