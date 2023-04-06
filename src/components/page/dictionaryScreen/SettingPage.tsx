import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, FlatList, Modal, Text, ScrollView, TouchableOpacity, SectionList, Linking, ActivityIndicator, StatusBar } from 'react-native';
import { Header, Icon, Button } from 'react-native-elements';
import { styles, height } from '../style';
// @ts-expect-error TS(2305): Module '"../../../actions"' has no exported member... Remove this comment to see the full error message
import { updateSelectedLanguage } from '../../../actions';
import { connect } from 'react-redux';
// @ts-expect-error TS(6142): Module '../../ItemBox' was resolved to '/Users/Mak... Remove this comment to see the full error message
import { itemBoxStyles } from '../../ItemBox';
// @ts-expect-error TS(2732): Cannot find module '../../../../package.json'. Con... Remove this comment to see the full error message
import { version } from '../../../../package.json';
import { DictionaryList } from './DictionaryList';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { strings } from '../strings';
import { BannerAd, TestIds } from '@react-native-admob/admob';


const SettingPage = (props: any) => {
    const { navigation } = props

    const [isModalVisible, setModalVisible] = useState(false),
          [isLoading, setLoading] = useState(true),
          [defaultDictionary, setDefaultDictionary] = useState('');

    // @ts-expect-error TS(2345): Argument of type '() => Promise<void>' is not assi... Remove this comment to see the full error message
    useEffect(async() => {
        try {
            const value = await AsyncStorage.getItem('DefaultDictionary');
            if (value !== null) {
                const newValue = DictionaryList.filter(item => item.value.includes(value))
                setDefaultDictionary(newValue[0].label);
            }
            setLoading(false);
        } catch(e) {
            console.log('error');
        } 
    },[]);

    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    const arrowIcon = <Icon name='right' type='antdesign' color='white' />
    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    const defaultDictionaryIndicator =  isLoading ? <ActivityIndicator /> : defaultDictionary

    const data = [
        {
            title: strings.about, 
            data: [
                {desc: strings.guide, value: arrowIcon},
                {desc: strings.version, value: version}
            ]
        },
        {
            title: strings.dictionary, 
            data: [
                {desc: strings.defaultDict, value: defaultDictionaryIndicator},
                {desc: strings.favDict, value: arrowIcon}
            ]
        },
        {
            title: strings.others,
            data: [
                {desc: strings.contactUs, value: arrowIcon},
                {desc: strings.termsAndConditions, value: arrowIcon},
                {desc: strings.privacyPolicy, value: arrowIcon}
            ]
        }  
    ]

    const onPressHandler = (item: any) => {
        switch (item.desc) {
            case strings.guide:
                console.log('this is ', item.desc)
                Linking.openURL('https://hypervocab.app/guide/');
                break;
            case strings.version:
                console.log('this is ', item.desc)
                break;
            case strings.defaultDict:
                setModalVisible(true);
                console.log('this is ', item.desc)
                break;
            case strings.favDict:
                navigation.navigate('SetFavDictionaries');
                break;
            case strings.contactUs:
                console.log('this is ', item.desc)
                Linking.openURL('https://hypervocab.app/contact/');
                break;
            case strings.termsAndConditions:
                console.log('this is ', item.desc)
                Linking.openURL('https://hypervocab.app/terms-and-conditions/')
                break;
            case strings.privacyPolicy:
                Linking.openURL('https://hypervocab.app/privacy-policy/')
                break;
        }
    }

    const saveConfig = async (props: any) => {
        try {
            await AsyncStorage.setItem('DefaultDictionary', props.value)
            console.log(props.value);
            setDefaultDictionary(props.label);
        } catch (e) {
            alert(strings.failedToSaveConfig)
        }
    }

    const ModalForSetting = () => {
        return (
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
                        <Text style={{color: 'white', fontSize:20, margin:10, justifyContent:'center'}}>{strings.selectADictionaryToDefault}</Text>
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <FlatList
                            style={{backgroundColor:'black'}}
                            data={DictionaryList}
                            renderItem={({item})=> {
                                return (
                                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                    <ScrollView vertical>
                                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                        <View style={itemBoxStyles.container}>
                                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                            <TouchableOpacity 
                                                style={{padding: 20}}
                                                // @ts-expect-error TS(2362): The left-hand side of an arithmetic operation must... Remove this comment to see the full error message
                                                onPress={() => saveConfig(item) & setModalVisible(false) & setDefaultDictionary(item.label)}
                                                >
                                                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                                <Text style={{color:'white', fontSize: 20}}>{item.label}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </ScrollView>
                                )
                            }}
                            keyExtractor={(item) => item.label}
                        />
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <Button title='Cancel' onPress={() => setModalVisible(false)}/>
                    </View>
                </View>       
            </Modal>
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
                alignItems: 'stretch',
                justifyContent: 'space-between',
                flex: 1,
                }}>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <Header 
                    backgroundColor='black'
                    containerStyle={{ marginTop: ((StatusBar.currentHeight || 0) * -1) }}
                    leftComponent={
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <Icon name='arrowleft'
                              type='antdesign'
                              color='white' 
                              onPress={()=> navigation.navigate('DictionaryScreen')}
                        />}
                    centerComponent={{text: strings.settings, style:{color: 'white', fontSize:20}}}
                />
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <SectionList
                    sections={data}
                    keyExtractor={(item) => item.desc}
                    renderItem={({item}) => {
                        return (
                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                            <TouchableOpacity onPress={() => onPressHandler(item)}>
                                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                <View style={{backgroundColor:'rgb(40, 40, 40)', borderRadius:5, flexDirection:'row', justifyContent: 'space-between'}}>
                                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                    <Text style={{color:'white', fontSize:18, margin:10}}>
                                        {item.desc} 
                                    </Text>
                                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                    <Text style={{color:'white', fontSize:17, margin:10}}>
                                        {item.value} 
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )
                    }}
                    renderSectionHeader={({ section: { title } }) => (
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <Text style={{color:'white', margin:10, fontSize:18, fontWeight:'bold'}}>{title}</Text>
                      )}
                />
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <ModalForSetting />
            </SafeAreaView>
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <BannerAd size="ADAPTIVE_BANNER" unitId={TestIds.BANNER} />
        </View>
    )
}

const mapStateToProps = (state: any) => {
    return { 
        selectedLanguage: state.selectedLanguage,
    }
};
    
const mapDispatchToProps = { updateSelectedLanguage };
    
    
export default connect(mapStateToProps, mapDispatchToProps) (SettingPage);
