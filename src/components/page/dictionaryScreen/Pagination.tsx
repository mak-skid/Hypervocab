import React from 'react';
import { View, StyleSheet, Animated, useWindowDimensions } from 'react-native';

const Paginator = ({data, scrollX}: any) => {
    const { width } = useWindowDimensions();
    return (
        <View style={{flexDirection:'row', alignContent:"center", height:20}}>
            {data && data.map((_: any, i: any) => {
                const inputRange = [(i - 1)*width, i*width, (i + 1)*width];

                const dotWidth = scrollX.interpolate({
                    inputRange,
                    outputRange: [8, 16, 8],
                    extrapolate: 'clamp',
                })

                return (  
                    <Animated.View style={[styles.dot, {width: dotWidth}]} key={i.toString()} />
                )
            })}
        </View>
    );
}
export default Paginator;

const styles = StyleSheet.create({
    dot: {
        height:8,
        borderRadius:4,
        backgroundColor:'white',
        marginHorizontal:8,
        opacity:0.7,
    }
})