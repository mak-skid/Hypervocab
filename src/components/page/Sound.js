import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Alert } from 'react-native';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { strings } from './strings';

export const AudioPlayer = (props) => {
    const { url } = props
    console.log("url: ", url);

    var Sound = require('react-native-sound');

    Sound.setCategory('Playback');

    var audio = new Sound(
        `${url}`,
        null,
        error => {
            if (error) {
                console.log('Failed to load the sound.', url);
            } else {
                //console.log('success')
            }
        }
    )
    
    const [playing, setPlaying] = useState();
    
    useEffect(() => {
        audio.setVolume(1);
        return () => {
            audio.release();
        };
    }, []);

    const playPause = () => {
        if (audio.isPlaying()) {
            audio.pause();
            setPlaying(false);
        } else {
            setPlaying(true);
            audio.play(success => {
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