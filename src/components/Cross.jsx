import React from 'react'
import { View, StyleSheet, Image } from 'react-native'
import imgCross from '../../assets/cross.png'

const Cross = () => {
    return (
        <View style={styles.cross}>
            <Image source={imgCross} resizeMode="contain" />
        </View>
    )
}

const styles = StyleSheet.create({
  cross: {
    width: 80,
    height: 80,
  },
  crossLine: {
    position: "absolute",
    left: 36,
    width: 10,
    height: 80,
    backgroundColor: "blue",
    transform: [
      {
        rotate: "45deg",
      }
    ],
  },
  crossLineReversed: {
    left: 36,
    width: 10,
    height: 80,
    backgroundColor: "blue",
    transform: [
      {
        rotate: "-45deg",
      },
    ],
  },
})
export default Cross;