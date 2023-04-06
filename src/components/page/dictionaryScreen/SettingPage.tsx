import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, FlatList, Modal, Text, ScrollView, TouchableOpacity, SectionList, Linking, ActivityIndicator, StatusBar, Platform } from 'react-native';
import { Header, Icon, Button } from 'react-native-elements';
import { styles, height } from '../style';
import { updateSelectedLanguage } from '../../../actions';
import { connect } from 'react-redux';
import { itemBoxStyles } from '../../ItemBox';
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

    useEffect(() => {(async() => {
        try {
            const value = await AsyncStorage.getItem('DefaultDictionary');
            if (value !== null) {
                const newValue = DictionaryList.filter(item => item.value.includes(value))
                setDefaultDictionary(newValue[0].label);
            }
            setLoading(false);
        } catch(e) {
            console.log('error');
        }})()
    },[]);

    const arrowIcon = <Icon name='right' type='antdesign' color='white' tvParallaxProperties={undefined} />
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
                        <Text style={{color: 'white', fontSize:20, margin:10, justifyContent:'center'}}>{strings.selectADictionaryToDefault}</Text>
                        <FlatList
                            style={{backgroundColor:'black'}}
                            data={DictionaryList}
                            renderItem={({item})=> {
                                return (
                                    <ScrollView>
                                        <View style={itemBoxStyles.container}>
                                            <TouchableOpacity 
                                                style={{padding: 20}}
                                                onPress={() => [saveConfig(item), setModalVisible(false), setDefaultDictionary(item.label)]}
                                                >
                                                <Text style={{color:'white', fontSize: 20}}>{item.label}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </ScrollView>
                                )
                            }}
                            keyExtractor={(item) => item.label}
                        />
                        <Button title='Cancel' onPress={() => setModalVisible(false)}/>
                    </View>
                </View>       
            </Modal>
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
                    leftComponent={
                        <Icon name='arrowleft' type='antdesign' color='white' onPress={() => navigation.navigate('DictionaryScreen')} tvParallaxProperties={undefined}/>
                    }
                    centerComponent={{text: strings.settings, style:{color: 'white', fontSize:20}}}/>
                <SectionList
                    sections={data}
                    keyExtractor={(item) => item.desc}
                    renderItem={({item}) => {
                        return (
                            <TouchableOpacity onPress={() => onPressHandler(item)}>
                                <View style={{backgroundColor:'rgb(40, 40, 40)', borderRadius:5, flexDirection:'row', justifyContent: 'space-between'}}>
                                    <Text style={{color:'white', fontSize:18, margin:10}}>
                                        {item.desc} 
                                    </Text>
                                    <Text style={{color:'white', fontSize:17, margin:10}}>
                                        {item.value} 
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )
                    }}
                    renderSectionHeader={({ section: { title } }) => (
                        <Text style={{color:'white', margin:10, fontSize:18, fontWeight:'bold'}}>{title}</Text>
                    )}
                />
                <ModalForSetting />
            </SafeAreaView>
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
