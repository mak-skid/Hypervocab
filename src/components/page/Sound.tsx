import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Alert } from 'react-native';
import { Icon } from '@rneui/themed/dist/index';
import { strings } from './strings';
import Sound from 'react-native-sound';

export const AudioPlayer = (props: any) => {
    const { url } = props
    console.log("url: ", url);

    Sound.setCategory('Playback');

    const [playing, setPlaying] = useState<boolean>();
    
    const audio = new Sound(`${url}`, Sound.MAIN_BUNDLE,
        (error: any) => {
            if (error) {
                console.log('Failed to load the sound.', url);
            } else {
                //console.log('success')
            }
        }
    )

    const playPause = () => {
        

        if (audio.isPlaying()) {
            audio.pause();
            setPlaying(false);
        } else {
            setPlaying(true);
            audio.play((success: any) => {
            if (success) {
                setPlaying(false);
                console.log('successfully finished playing');
            } else {
                setPlaying(false);
                console.log('playback failed due to audio decoding errors');
                Alert.alert(strings.error, strings.failedToLoadTheSound);
            }
            });
        }
    };
    return (
        <TouchableOpacity 
            style={{
                marginHorizontal:10,
                paddingHorizontal:5, 
                backgroundColor:'white', 
                borderRadius:10
                }} 
            onPress={playPause}
        >

            <Icon
                type='ionicon'
                name={playing ? 'pause' : 'play'}
                size={18}
                color={'black'}
            />
        </TouchableOpacity>
    );
}