import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import logo1 from '../../../assets/2.png';
import { auth, db } from '../../../config';
import { createUserWithEmailAndPassword } from '@firebase/auth';
import { addDoc, collection } from '@firebase/firestore';

const BirthdayScreenRegister = ({ route, navigation }) => {
  const { user, pass } = route.params;

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const getdate = () => {
    const fechaActual = new Date();
    const dia = String(fechaActual.getDate()).padStart(2, '0');
    const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
    const anio = fechaActual.getFullYear();
    const horas = String(fechaActual.getHours()).padStart(2, '0');
    const minutos = String(fechaActual.getMinutes()).padStart(2, '0');
    const segundos = String(fechaActual.getSeconds()).padStart(2, '0');
    return `${dia}/${mes}/${anio} ${horas}:${minutos}:${segundos}`;
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShow(true);
    setMode('date');
  };

  const isAdult = (birthDate) => {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age > 18;
    }
    return age >= 18;
  };

  const saveCredentials = () => {
    if (!isAdult(date)) {
      Alert.alert('Error', 'You must be at least 18 years old to register.');
      return;
    }

    try {
      const datenow = getdate();
      createUserWithEmailAndPassword(auth, user, pass)
        .then(async () => {
          try {
            const docRef = await addDoc(collection(db, 'users'), {
              username: user,
              name: '',
              lastname: '',
              dateregister: datenow,
              img_profile: 'https://firebasestorage.googleapis.com/v0/b/bookpost-5011d.appspot.com/o/perfilpred.jpg?alt=media&token=3a1941b8-061d-4495-bad7-884f887832a1',
              mail: user,
              pass: pass,
              birthday: date
            });
          } catch (err) {
            console.error('Error adding document: ', err);
          }
        })
        .catch(err => {
          Alert.alert(err.message);
        });
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={30} color="#4b4b4b" />
      </TouchableOpacity>
      <View style={styles.logoContainer}>
        <Image style={styles.logoIcon} source={logo1} />
      </View>
      <View style={styles.containerForms}>
        <Text style={styles.label}>Your birthday:</Text>
        <TouchableOpacity style={styles.datePickerButton} onPress={showDatepicker}>
          <Text style={styles.datePickerText}>{date.toDateString()}</Text>
        </TouchableOpacity>
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
  datePickerButton: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#adadad',
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  datePickerText: {
    fontSize: 16,
    color: '#000',
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
