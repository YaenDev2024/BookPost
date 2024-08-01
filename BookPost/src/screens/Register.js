import React from 'react';
import {Alert, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import logo from '../../assets/bookpost.png';
import logo1 from '../../assets/2.png';

const Register = ({navigation}) => {

 const nextPage = () =>{
  Alert.alert('s')
   navigation.navigate('NextBirthday')
 }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton}>
        <Icon name="arrow-left" size={30} color="#4F8EF7" />
      </TouchableOpacity>

      <View style={styles.logoContainer}>
        <Image style={styles.logoIcon} source={logo1} />
      </View>
      
      <View style={styles.containerForms}>
        <Text style={styles.label}>User or Mail:</Text>
        <TextInput style={styles.input} placeholder="Enter your email" />
        <Text style={styles.label}>Password:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          secureTextEntry
        />
      </View>
      
      <View style={styles.containerBtns}>
        <TouchableOpacity style={styles.buttonLogin}>
          <Text style={styles.buttonText} onPress={() => nextPage()}>Next</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.footer}>
        <Text>BookPost Inc 2024.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  backButton: {
    alignSelf: 'flex-start',
    margin: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoIcon: {
    width: 110,
    height: 100,
    marginBottom: 10,
  },
  containerForms: {
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  label: {
    color: 'black',
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    height: 50,
    marginBottom: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    borderColor: '#adadad',
  },
  buttonLogin: {
    backgroundColor: '#4b4b4b',
    width:200,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  containerBtns: {
    alignItems: 'center',
  },
  footer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 'auto',
    paddingVertical: 20,
  },
});

export default Register;
