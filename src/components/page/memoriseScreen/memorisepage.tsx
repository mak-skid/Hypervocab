import React from 'react';
import { View, SafeAreaView, FlatList, Text, ScrollView, TouchableOpacity, StatusBar} from 'react-native';
import { Header } from 'react-native-elements';
import { styles, height } from '../style';
import { updateFolderList, updateSavedWordList } from '../../../actions';
import { connect } from 'react-redux';
// @ts-expect-error TS(6142): Module '../../ItemBox' was resolved to '/Users/Mak... Remove this comment to see the full error message
import { itemBoxStyles } from '../../ItemBox';
import { strings } from '../strings';
import { BannerAd, TestIds } from '@react-native-admob/admob';

function MemoriseScreen(props: any) {
    const {folderList, savedWordList, navigation} = props
    
    return(
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <View style={[styles.container, {paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0}]}>
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <StatusBar style='light'/>
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <SafeAreaView style={{
                backgroundColor: 'black',
                alignItems: 'stretch',
                justifyContent: 'space-between',
                flex: 1,
                }}>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <Header 
                    backgroundColor='black'
                    containerStyle={{ marginTop: ((StatusBar.currentHeight || 0) * -1) }}
                    centerComponent={{text: strings.startMemorizing, style:{color: 'white', fontSize:20}}}
                />
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <FlatList
                    style={{backgroundColor:'black'}}
                    data={folderList}
                    renderItem={({item, index})=> {
                        return (
                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                            <ScrollView vertical>
                                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                <View style={itemBoxStyles.container}>
                                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                    <TouchableOpacity 
                                        style={{padding: 20}}
                                        onPress={() => navigation.navigate('SwipeCard', {FolderToSwipe: item})}
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
                        <View style={{alignItems: 'center', marginTop: height*0.2}}>
                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                            <Text style={{color:'grey', fontSize:20}}>{strings.noFolder}</Text>
                        </View>
                    }
                /> 
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <BannerAd size="ADAPTIVE_BANNER" unitId={TestIds.BANNER} />
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