import React from 'react';
import {
  Alert,
  Button,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Dimensions} from 'react-native';
import {TextInput} from 'react-native';
import logo from '../../assets/bookpost.png';
import logo1 from '../../assets/2.png';

const {width, height} = Dimensions.get('window');

const Login = ({navigation}) => {

  const ToRegister = () =>{
    navigation.push('Sign Up');
  }

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor={'transparent'}
        barStyle="dark-content"
      />

      <View style={styles.logoContainer}>
        <Image style={styles.logoIcon} source={logo1} />
        <Image style={styles.imgLogo} source={logo} />
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
        <Text style={styles.pass}>Forgot your password?</Text>
        <TouchableOpacity style={styles.buttonLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonLogin} onPress={() =>ToRegister()}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <View style={styles.footer}>
          <Text>BookPost Inc 2024.</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16, // Añadir un padding general
    backgroundColor: '#f9f9f9', // Color de fondo más suave
  },
  logoContainer: {
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  logoIcon: {
    width: 110,
    height: 100,
    marginBottom: 10,
  },
  imgLogo: {
    width: 290,
    height: 290,
    marginBottom: 20,
  },
  containerForms: {
    width: '100%', // Ocupar todo el ancho
    marginBottom: 20,
    marginTop: -50,
  },
  label: {
    color: 'black',
    marginBottom: 5,
    fontSize: 16,
    marginLeft: 20,
  },
  input: {
    height: 50,
    marginBottom: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    borderColor: '#adadad',
    marginLeft: 20,
    marginRight: 35,
  },
  buttonLogin: {
    backgroundColor: '#4b4b4b',
    width: 200, // Usa un porcentaje para hacerlo responsivo
    height: 50, // Aumenta la altura para hacer el botón más grande
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
    marginTop: 'auto', // Colocar el footer al final
    paddingVertical: 20,
  },
});

export default Login;
