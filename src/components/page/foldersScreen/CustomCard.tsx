import React, { useState } from 'react';
import { View, ScrollView, Alert, StatusBar } from 'react-native';
import { Header, Icon, Card } from 'react-native-elements';
import { styles, width } from '../style';
import { TextInput } from 'react-native';
import { updateFolderList, updateSavedWordList } from '../../../actions';
import { connect } from 'react-redux';
import { UserDatabaseDB } from '../../openDatabase';
import { strings } from '../strings';
import { BannerAd, TestIds } from '@react-native-admob/admob';


const CustomCard = (props) => {
    const {folderList, savedWordList, navigation, route} = props

    const [reloadScreen, setReloadScreen] = useState(true),
          [isEditCardWordValue, setEditCardWordValue] = useState(''),
          [isEditCardMeanValue, setEditCardMeanValue] = useState('');
          
    const SaveCustomCard = () => {
        const browsingFolder = route.params.item
        UserDatabaseDB.transaction(tx => {
            tx.executeSql(
                `INSERT INTO "${browsingFolder}" (word, mean, level)
                 VALUES("${isEditCardWordValue}", "${isEditCardMeanValue}", 0);`,[],
            (_, results) => {
                console.log('saved word');
                setReloadScreen(true);
                Alert.alert(null, strings.createdSuccessfully, [{text: 'OK', onPress: () => navigation.navigate('BrowseFolder')}])
            },
            () => alert(strings.errorSaving)
            )
        })
    }

    if (reloadScreen) {
        const browsingFolder = route.params.item
        UserDatabaseDB.transaction(tx => {
            tx.executeSql(`SELECT item_id, word, mean, level, meanings, phonetics FROM "${browsingFolder}";`, [],
            (_, results) => {
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
            <StatusBar style='light'/>
            <View style={{backgroundColor:'black', flex:1}}>
                <Header 
                    backgroundColor='black'
                    containerStyle={{ marginTop: ((StatusBar.currentHeight || 0) * -1) }}
                    leftComponent={<Icon name='arrowleft' type='antdesign' color='white' onPress={()=> navigation.navigate('BrowseFolder')}/>}
                    centerComponent={{text: 'Create a card', style:{color: 'white', fontSize:20}}}
                    rightComponent={<Icon name='save-alt' type='material' color='white' onPress={()=> SaveCustomCard()}/>}
                />
                <ScrollView vertical>
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
                        multiline={true}
                        onChangeText={setEditCardMeanValue}
                        /> 
                </Card>
                </ScrollView>
            </View>
            <BannerAd size="ADAPTIVE_BANNER" unitId={TestIds.BANNER} />
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
    
    
export default connect(mapStateToProps, mapDispatchToProps) (CustomCard);