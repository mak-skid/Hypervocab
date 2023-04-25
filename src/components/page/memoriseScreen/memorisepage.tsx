import React from 'react';
import { View, SafeAreaView, FlatList, Text, ScrollView, TouchableOpacity, StatusBar, Platform} from 'react-native';
import { Header } from 'react-native-elements';
import { styles, height } from '../style';
import { updateFolderList, updateSavedWordList } from '../../../actions';
import { connect } from 'react-redux';
import { itemBoxStyles } from '../../ItemBox';
import { strings } from '../strings';

function MemoriseScreen(props: any) {
    const {folderList, savedWordList, navigation} = props
    
    return(
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
                    centerComponent={{text: strings.startMemorizing, style:{color: 'white', fontSize:20}}}
                />
                <FlatList
                    style={{backgroundColor:'black'}}
                    data={folderList}
                    renderItem={({item, index})=> {
                        return (
                            <ScrollView>
                                <View style={itemBoxStyles.container}>
                                    <TouchableOpacity 
                                        style={{padding: 20}}
                                        onPress={() => navigation.navigate('SwipeCard', {FolderToSwipe: item})}
                                        >
                                        <Text style={{color:'white', fontSize: 20}}>{item.name}</Text>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                        )
                    }}
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
    
    
export default connect(mapStateToProps, mapDispatchToProps) (MemoriseScreen);    