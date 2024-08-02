import React, { useState } from 'react';
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
import { Dimensions } from 'react-native';
import { TextInput } from 'react-native';
import logo from '../../assets/bookpost.png';
import logo1 from '../../assets/2.png';
import { addDoc, collection, query, where, getDocs } from '@firebase/firestore';
import { db } from '../../config';

const { width, height } = Dimensions.get('window');

const Login = ({ navigation }) => {

  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [fail, setFail] = useState(false);

  const [emptyInput, setEmptyInputUser] = useState(false);
  const [emptyPass, setEmptyPass] = useState(false);

  const toRegister = () => {
    navigation.push('Sign Up');
  }

  const handlePassword = (pass) => {
    setPassword(pass);
  }

  const handleUser = (user) => {
    setUser(user);
  }

  const checkIfExist = async () => {
    let isEmpty = false;

    if (user === '' || user === undefined || user === null) {
      setEmptyInputUser(true);
      isEmpty = true;
    } else {
      setEmptyInputUser(false);
    }
    if (password === '' || password === undefined || password === null) {
      setEmptyPass(true);
      isEmpty = true;
    } else {
      setEmptyPass(false);
    }

    if (isEmpty) {
      setTimeout(() => {
        setEmptyPass(false);
        setEmptyInputUser(false);
        setFail(false);
      }, 2000);
      return;
    }

    const q = query(
      collection(db, 'users'),
      where('mail', '==', user),
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      setFail(true);
    } else {
      setFail(false);
      navigation.push('Home');
    }
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
        <TextInput
          style={emptyInput ? styles.inputFail : styles.input}
          onChangeText={handleUser}
          placeholder="Enter your email"
          value={user}
        />
        <Text style={styles.label}>Password:</Text>
        <TextInput
          style={emptyPass ? styles.inputFail : styles.input}
          onChangeText={handlePassword}
          placeholder="Enter your password"
          secureTextEntry
          value={password}
        />
        {fail ?
          <Text style={{ textAlign: 'center', color: 'red' }}>The user or mail doesn't exist! Please check!</Text> : null
        }
        {emptyInput && !emptyPass ?
          <Text style={{ textAlign: 'center', color: 'red' }}>The user input is empty! Please check!</Text> : null
        }
        {emptyPass && !emptyInput ?
          <Text style={{ textAlign: 'center', color: 'red' }}>The password input is empty! Please check!</Text> : null
        }
        {emptyInput && emptyPass ?
          <Text style={{ textAlign: 'center', color: 'red' }}>Both inputs are empty! Please check!</Text> : null
        }
      </View>

      <View style={styles.containerBtns}>
        <Text style={styles.pass}>Forgot your password?</Text>
        <TouchableOpacity style={styles.buttonLogin} onPress={checkIfExist}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonLogin} onPress={toRegister}>
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
    padding: 16,
    backgroundColor: '#f9f9f9',
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
    width: '100%',
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
  inputFail: {
    height: 50,
    marginBottom: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    borderColor: 'red',
    marginLeft: 20,
    marginRight: 35,
  },
  buttonLogin: {
    backgroundColor: '#4b4b4b',
    width: 200,
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

export default Login;
