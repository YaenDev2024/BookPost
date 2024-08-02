import React from 'react';
import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import img from '../../assets/2.png'
const HomeScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.maincontainer}>
      <StatusBar
        translucent
        backgroundColor={'transparent'}
        barStyle="light-content"
      />
      <Text style={styles.title}>BookPost</Text>
      <View style={styles.cardThink}>
        <Image source={img} style={styles.imgperfil} />
        <TextInput style={styles.inputthink} placeholder='Que piensas?' />
        <TouchableOpacity> <Image source={img} style={styles.imgperfil} /></TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  maincontainer: {
    backgroundColor: "black",
    alignItems: 'center',
    flexGrow: 1,
    paddingBottom: 20,
  },
  title: {
    color: 'white',
    marginTop: 50,
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginLeft: 30,
  },
  cardThink: {
    backgroundColor: 'white',
    height: 56,
    borderRadius: 10,
    margin: 10,
    width: '100%', // Para que el card tenga un ancho adecuado
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'row'
  },
  imgperfil: {
    height: 50,
    width: 50,
    borderRadius: 100,
    borderColor: 'gray'
  },
  inputthink: {
    borderColor: 'black',
    width: 100
  }

});

export default HomeScreen;
