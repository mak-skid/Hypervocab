import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Alert } from 'react-native';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { strings } from './strings';

export const AudioPlayer = (props: any) => {
    const { url } = props
    console.log("url: ", url);

    var Sound = require('react-native-sound');

    Sound.setCategory('Playback');

    var audio = new Sound(
        `${url}`,
        null,
        (error: any) => {
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
            // @ts-expect-error TS(2345): Argument of type 'false' is not assignable to para... Remove this comment to see the full error message
            setPlaying(false);
        } else {
            // @ts-expect-error TS(2345): Argument of type 'true' is not assignable to param... Remove this comment to see the full error message
            setPlaying(true);
            audio.play((success: any) => {
            if (success) {
                // @ts-expect-error TS(2345): Argument of type 'false' is not assignable to para... Remove this comment to see the full error message
                setPlaying(false);
                console.log('successfully finished playing');
            } else {
                // @ts-expect-error TS(2345): Argument of type 'false' is not assignable to para... Remove this comment to see the full error message
                setPlaying(false);
                console.log('playback failed due to audio decoding errors');
                Alert.alert(strings.error, strings.failedToLoadTheSound);
            }
            });
        }
    };
    return (
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <TouchableOpacity 
            style={{
                marginHorizontal:10,
                paddingHorizontal:5, 
                backgroundColor:'white', 
                borderRadius:10
                }} 
            onPress={playPause}
        >
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <Icon
                type='ionicon'
                name={playing ? 'pause' : 'play'}
                size={18}
                color={'black'}
            />
        </TouchableOpacity>
    );
}