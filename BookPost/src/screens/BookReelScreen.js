import React from 'react'
import { View,Text, StyleSheet } from 'react-native'

const BookReelScreen = () => {
  return (
    <View style={styles.Container}>
        <Text style={styles.title}>BookPost</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    Container:{
        backgroundColor: 'transparent',
        alignItems: 'center',
        flex: 1,
        width: '100%',
    },
    title:{
        color: 'white',
        fontSize: 25,
        marginTop: 10,
    }
})

export default BookReelScreen