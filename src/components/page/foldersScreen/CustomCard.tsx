import React, { useState } from 'react';
import { View, ScrollView, Alert, StatusBar, Platform, TextInput } from 'react-native';
import { Header, Icon, Card } from 'react-native-elements';
import { styles, width } from '../style';
import { updateFolderList, updateSavedWordList } from '../../../actions';
import { connect } from 'react-redux';
import { UserDatabaseDB } from '../../openDatabase';
import { strings } from '../strings';


const CustomCard = (props: any) => {
    const {folderList, savedWordList, navigation, route} = props

    const [reloadScreen, setReloadScreen] = useState(true),
          [isEditCardWordValue, setEditCardWordValue] = useState(''),
          [isEditCardMeanValue, setEditCardMeanValue] = useState('');
          
    const SaveCustomCard = () => {
        const browsingFolder = route.params.item
        UserDatabaseDB.transaction((tx: any) => {
            tx.executeSql(
                `INSERT INTO "${browsingFolder}" (word, mean, level)
                 VALUES("${isEditCardWordValue}", "${isEditCardMeanValue}", 0);`,[],
            (_: any, results: any) => {
                console.log('saved word');
                setReloadScreen(true);
                Alert.alert('', strings.createdSuccessfully, [{text: 'OK', onPress: () => navigation.navigate('BrowseFolder')}])
            },
            () => alert(strings.errorSaving)
            )
        })
    }

    if (reloadScreen) {
        const browsingFolder = route.params.item
        UserDatabaseDB.transaction((tx: any) => {
            tx.executeSql(`SELECT item_id, word, mean, level, meanings, phonetics FROM "${browsingFolder}";`, [],
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
                    centerComponent={{text: 'Create a card', style:{color: 'white', fontSize:20}}}
                    rightComponent={<Icon name='save-alt' type='material' color='white' onPress={() => SaveCustomCard()} tvParallaxProperties={undefined}/>}
                />
                <ScrollView>
                <Card containerStyle={{backgroundColor:'black', width: width*0.9, borderRadius:5}}>
                    <TextInput 
                        style={{color:'white',fontSize:30,fontWeight:"bold",marginVertical:10}} 
                        defaultValue={isEditCardWordValue}
                        placeholder={strings.typeAWordHere}
                        placeholderTextColor="grey" 
                        onChangeText={setEditCardWordValue}
                        />
                    <TextInput 
                        style={{color:'white',fontSize:18}} 
                        multiline={true} 
                        defaultValue={isEditCardMeanValue} 
                        placeholder={strings.typeDefinitionAnswer}
                        placeholderTextColor="grey"
                        // @ts-expect-error TS(17001): JSX elements cannot have multiple attributes with ... Remove this comment to see the full error message
                        multiline={true}
                        onChangeText={setEditCardMeanValue}
                        /> 
                </Card>
                </ScrollView>
            </View>
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
    
    
export default connect(mapStateToProps, mapDispatchToProps) (CustomCard);