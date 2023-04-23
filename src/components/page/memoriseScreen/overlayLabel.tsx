import React from 'react'
import { View, Text } from 'react-native'
import { string } from 'prop-types'
import { styles } from '../style'

const OverlayLabel = ({label, color}: any) => (
    <View style={[styles.overlayLabel, { backgroundColor: color }]}>
        <Text style={[styles.overlayLabelText]}>{label}</Text>
    </View>
)

OverlayLabel.propTypes = {
    label: string.isRequired,
    color: string.isRequired,
}

export default OverlayLabel