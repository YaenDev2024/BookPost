import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const CardWithoutPubs = () => {
  return (
    <View style={styles.card}>
      <Text style={{color:'white'}}>No hay publicaciones para mostrar</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#353535',
    height: 56,
    borderRadius: 10,
    margin: 10,
    width: '95%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});

export default CardWithoutPubs;
