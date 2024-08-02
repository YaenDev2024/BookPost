import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import logo from '../../assets/bookpost.png';
import logo1 from '../../assets/2.png';

const Register = ({ navigation }) => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [fail, setFail] = useState(false);

  const [emptyInput, setEmptyInputUser] = useState(false);
  const [emptyPass, setEmptyPass] = useState(false);

  const handlePassword = (pass) => {
    setPassword(pass);
  }

  const handleUser = (user) => {
    setUser(user);
  }


  const nextPage = () => {
    navigation.navigate('NextBirthday')
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

    
    navigation.navigate('NextBirthday', {
      user: user,
      pass: password,
    });
  }



  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={30} color="#4b4b4b" />
      </TouchableOpacity>

      <View style={styles.logoContainer}>
        <Image style={styles.logoIcon} source={logo1} />
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
        <TouchableOpacity style={styles.buttonLogin} onPress={checkIfExist}>
          <Text style={styles.buttonText} >Next</Text>
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
  inputFail: {
    height: 50,
    marginBottom: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    borderColor: 'red',
  },
});

export default Register;
