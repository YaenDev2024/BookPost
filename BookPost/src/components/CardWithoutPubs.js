import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const CardWithoutPubs = () => {
  return (
    <View style={styles.card}>
        <Text>No hay publicaciones para mostrar</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        height: 56,
        borderRadius: 10,
        margin: 10,
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
      },
});

export default CardWithoutPubs