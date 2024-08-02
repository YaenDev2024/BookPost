import React, {useState} from 'react';
import {Button, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import logo1 from '../../../assets/2.png';
import { auth, db } from '../../../config';
import { createUserWithEmailAndPassword } from '@firebase/auth';
import { addDoc, collection } from '@firebase/firestore';
const BirthdayScreenRegister = ({route,navigation}) => {


  const { user, pass } = route.params;

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };


  const saveCredentials = () =>{
    try {
      //const auth = getAuth();
      createUserWithEmailAndPassword(auth, user, pass)
        .then(async () => {
          try {
            const docRef = await addDoc(collection(db, 'users'), {
              username: user,
              mail: user,
              pass: pass,
              birthday: date
            });
          } catch (err) {
            console.error('Error adding document: ', err);
          }
        })
        .catch(err => {
          Alert.alert(err);
        });
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() =>navigation.goBack()}>
        <Icon name="arrow-left" size={30} color="#4b4b4b" />
      </TouchableOpacity>
      <View style={styles.logoContainer}>
        <Image style={styles.logoIcon} source={logo1} />
      </View>
      <View style={styles.containerForms}>
        <Text style={styles.label}>Your birthday?:</Text>
        <View>
          <Button onPress={showDatepicker} title="Show date picker!" />
        </View>
        <View>
          <Button onPress={showTimepicker} title="Show time picker!" />
        </View>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        )}
      </View>
      <View style={styles.containerBtns}>
        <TouchableOpacity style={styles.buttonLogin} onPress={saveCredentials}>
          <Text style={styles.buttonText}>Next</Text>
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
export default BirthdayScreenRegister;
