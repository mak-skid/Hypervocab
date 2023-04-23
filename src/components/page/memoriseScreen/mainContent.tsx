import React, {  } from 'react';
import { View, FlatList, Text, ScrollView, Alert, Pressable, SafeAreaView } from 'react-native';
import { AudioPlayer } from '../Sound';
import { strings } from '../strings';
import { height } from '../style';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

export function MainContent(props: any) {
    const {item, index, showContent} = props

    if (showContent == 0) { {/* if false*/}
        return (
            <View style={{justifyContent:'center', alignItems:'center'}}>
                <Text style={{color:'white', fontSize:20}}>{strings.answer}</Text>
            </View>
        )
    } else {
        if (item.mean) {
            return (
                <View>
                    <ScrollView showsVerticalScrollIndicator={true}>
                        <Text style={{ color: 'white', fontSize: 18 }}>
                            {item.mean.replaceAll("/", "\n\n")}
                        </Text>
                    </ScrollView>
                </View>
            );
        } else {
            const parsedMeanings = JSON.parse(unescape(item.meanings));
            const parsedPhonetics = JSON.parse(unescape(item.phonetics));
    
            return (
                <View>
                    {parsedPhonetics.map((item: any) => <View style={{ flexDirection: 'row' }}>
                        {item.text != undefined && <Text style={{ color: 'white', fontSize: 18 }} key={index}>| {item.text} |</Text>}
                        {item.audio != undefined && <AudioPlayer url={item.audio} />}
                    </View>
                    )}
                    <FlatList
                        data={parsedMeanings}
                        scrollEnabled={false}
                        keyExtractor={(index) => 'key' + index}
                        renderItem={({ item, index }) => {
                            const childData = parsedMeanings[index].definitions;
                            return (
                                <View>
                                    <Text style={{ color: 'grey', fontSize: 18, marginTop: 10 }}>{item.partOfSpeech}</Text>
                                    <FlatList
                                        data={childData}
                                        scrollEnabled={false}
                                        keyExtractor={(index) => 'key(childData)' + index}
                                        renderItem={({ item }) => {
                                            return (
                                                <View>
                                                    <Text style={{ color: 'white', fontSize: 18, borderRadius: 5, borderColor: 'black', borderWidth: 1 }}>{item.definition}</Text>
                                                    <Text style={{ color: 'grey', fontSize: 18, fontStyle: 'italic', borderRadius: 5, borderColor: 'black', borderWidth: 1 }}>
                                                        {item.example}
                                                    </Text>
                                                </View>
                                            );
                                        } } />
                                </View>
                            );
                        } } />
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18, marginTop: 10 }}>{strings.origin}</Text>
                    <Text style={{ color: 'white', fontSize: 18 }}>{item.origin}</Text>
                </View>
            );
        }
    }
}