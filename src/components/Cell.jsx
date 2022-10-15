import React from 'react'
import { View, StyleSheet, Pressable, Image } from 'react-native'
import imgCross from '../../assets/meow.png'
import imgCircle from '../../assets/coffee.png'

const Cell = (props) => {
    const { cell, onPress } = props;

    return (
        <Pressable onPress={() => onPress()} style={styles.cell}>
            {cell === 'o' && <View><Image source={imgCircle} resizeMode="contain" /></View> }
            {cell === 'x' && <View><Image source={imgCross} resizeMode="contain" /></View> }
        </Pressable>
    )
}

const styles = StyleSheet.create({
    cell: {
        flex: 1,
        borderColor: "grey",
        alignItems: "center",
        justifyContent: "center",
    },
    circle: {
        position: "absolute",
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: "center",
        justifyContent: "center",
        borderColor: "red",
        mirgin: 10,
        borderWidth: 10,
    },
})
export default Cell;