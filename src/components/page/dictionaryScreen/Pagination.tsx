import React from 'react';
import { View, StyleSheet, Animated, useWindowDimensions } from 'react-native';

// @ts-expect-error TS(2304): Cannot find name 'Paginator'.
export default Paginator = ({
    data,
    scrollX
}: any) => {
    const { width } = useWindowDimensions();
    return (
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <View style={{flexDirection:'row', alignContent:"center", height:20}}>
            {data && data.map((_: any, i: any) => {
                const inputRange = [(i - 1)*width, i*width, (i + 1)*width];

                const dotWidth = scrollX.interpolate({
                    inputRange,
                    outputRange: [8, 16, 8],
                    extrapolate: 'clamp',
                })

                return (
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <Animated.View style={[styles.dot, {width: dotWidth}]} key={i.toString()} />
                )
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    dot: {
        height:8,
        borderRadius:4,
        backgroundColor:'white',
        marginHorizontal:8,
        opacity:0.7,
    }
})