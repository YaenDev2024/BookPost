import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Button,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialC from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import {doc, getDoc, onSnapshot, updateDoc} from '@firebase/firestore';
import {useAuth} from '../hooks/Autentication';
import {db} from '../../config';

const EditPerfilScreen = ({route, navigation}) => {
  const {idUser} = route.params;

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [placeholder, setPlaceholder] = useState('Selecciona una opcion');
  const [selectedValue, setSelectedValue] = useState(null);

  const [fullName, setFullName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [Genero, setGenero] = useState('');
  const [Intereses, setIntereses] = useState('');

  const [updating, setUpdating] = useState(false);

  const {user} = useAuth();

  const [disabled, setDisabled] = useState(false);
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShow(true);
    setMode('date');
  };

  // section to take de all info user --this information is registered at the moment the user created the account

  useEffect(() => {
    const docRef = doc(db, 'users', idUser);
    const fetchUserInformation = async () => {
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        if (docSnap.data().isAlready === true) {
          setDisabled(true);
        }
        console.log('Document data:', docSnap.data());
        setFullName(docSnap.data().name);
        setLastName(docSnap.data().lastname);
        setUserName(docSnap.data().username);
        setEmail(docSnap.data().mail);
        setDate(docSnap.data().birthday.toDate());
        if (
          docSnap.data().intereses === '' ||
          docSnap.data().intereses === undefined
        ) {
          setIntereses('');
        } else {
          setIntereses(docSnap.data().intereses);
        }
        if (
          docSnap.data().genero === '' ||
          docSnap.data().genero === undefined
        ) {
          setGenero('');
        } else {
          setGenero(docSnap.data().genero);
        }
        if (docSnap.data().phone === '' || docSnap.data().phone === undefined) {
          setPhone('');
        } else {
          setPhone(docSnap.data().phone);
        }
        if (
          docSnap.data().address === '' ||
          docSnap.data().address === undefined
        ) {
          setAddress('');
        } else {
          setAddress(docSnap.data().address);
        }
        if (docSnap.data().city === '' || docSnap.data().city === undefined) {
          setCity('');
        } else {
          setCity(docSnap.data().city);
        }
        if (
          docSnap.data().country === '' ||
          docSnap.data().country === undefined
        ) {
          setCountry('');
        } else {
          setCountry(docSnap.data().country);
        }
      } else {
        // docSnap.data() will be undefined in this case
        console.log('No such document!');
      }
    };
    fetchUserInformation();
  }, []);

  const saveInformationPersonal = async () => {
    setUpdating(true);

    const userInfo = doc(db, 'users', idUser);
    try {
      await updateDoc(userInfo, {
        name: fullName,
        lastname: lastName,
        username: userName,
        mail: email,
        birthday: date,
        intereses: selectedValue,
        genero: Genero,
        phone: phone,
        address: address,
        city: city,
        country: country,
        isAlready: true,
      });

      console.log('Datos actualizados correctamente');
    } catch (error) {
      console.error('Error al actualizar los datos: ', error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor={'#353535'}
        barStyle="light-content"
      />
      <View style={styles.headerEditPerfil}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialC name="arrow-left" size={30} color={'#fff'} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar perfil</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <View style={styles.headerInformationPersonal}>
            <Text style={styles.title}>Informacion personal</Text>
            <Text style={styles.subtitle}>
              Puedes cambiar tus datos personales una vez cada mes.
            </Text>
          </View>
          <View style={styles.containerContent}>
            <Text style={styles.title}>Nombre/s: </Text>
            <TextInput
              style={styles.input}
              value={fullName}
              readOnly={disabled}
              placeholder="Escriba su nombre completo."
              placeholderTextColor={'gray'}
              onChangeText={text => setFullName(text)}></TextInput>
            <Text style={styles.title}>Apellido/s: </Text>
            <TextInput
              style={styles.input}
              readOnly={disabled}
              placeholder="Escriba sus apellidos."
              value={lastName}
              onChangeText={text => setLastName(text)}
              placeholderTextColor={'gray'}></TextInput>
            <Text style={styles.title}>Nombre de usuario: </Text>
            <TextInput
              readOnly={disabled}
              style={styles.input}
              onChangeText={text => setUserName(text)}
              placeholder="Escriba su nombre de usuario."
              value={userName}
              placeholderTextColor={'gray'}></TextInput>
            <Text style={styles.title}>Genero: </Text>
            <TextInput
              readOnly={disabled}
              style={styles.input}
              onChangeText={text => setGenero(text)}
              placeholder="Escriba su nombre de usuario."
              value={Genero}
              placeholderTextColor={'gray'}></TextInput>
            <Text style={styles.title}>Intereses: </Text>
            <View style={styles.pickerContainer}>
              <RNPickerSelect
                disabled={disabled}
                placeholder={{label: 'Selecciona una opción', value: null}}
                onValueChange={value => setSelectedValue(value)}
                style={pickerSelectStyles}
                items={[
                  {label: 'Hombres', value: 'Hombres'},
                  {label: 'Mujeres', value: 'Mujeres'},
                  {label: 'Prefiero no especificar', value: 'null'},
                ]}
              />
            </View>
            <Text style={styles.title}>Fecha de cumpleaños: </Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={showDatepicker}
              disabled={disabled}>
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
            <TouchableOpacity
              style={styles.save}
              disabled={disabled}
              onPress={saveInformationPersonal}>
              {updating ? (
                <ActivityIndicator color={'white'} />
              ) : (
                <Text style={{color: 'white'}}>Guardar datos</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.headerInformationPersonal}>
          <Text style={styles.title}>Informacion de contacto</Text>
          <Text style={styles.subtitle}>
            Puedes cambiar tus datos de contacto.
          </Text>
        </View>
        <View style={styles.containerContent}>
          <Text style={styles.title}>Numero de telefono: </Text>
          <TextInput
            readOnly={disabled}
            style={styles.input}
            placeholder="Escriba su telefono."
            value={phone}
            placeholderTextColor={'gray'}></TextInput>
          <Text style={styles.title}>Correo electronico: </Text>
          <TextInput
            readOnly={disabled}
            style={styles.input}
            placeholder="Escriba su correo electronico."
            value={email}
            placeholderTextColor={'gray'}></TextInput>
          <Text style={styles.title}>Direccion: </Text>
          <TextInput
            readOnly={disabled}
            style={styles.input}
            placeholder="Escriba su direccion."
            value={address}
            placeholderTextColor={'gray'}></TextInput>
          <Text style={styles.title}>Ciudad: </Text>
          <TextInput
            readOnly={disabled}
            style={styles.input}
            placeholder="Escriba su ciudad."
            value={city}
            placeholderTextColor={'gray'}></TextInput>
          <Text style={styles.title}>Pais: </Text>
          <TextInput
            readOnly={disabled}
            style={styles.input}
            placeholder="Escriba su Pais."
            value={country}
            placeholderTextColor={'gray'}></TextInput>
          <TouchableOpacity style={styles.save} disabled={disabled}>
            <Text style={{color: 'white'}}>Guardar datos</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'white',
    paddingRight: 30, // to ensure the text is never behind the icon
    backgroundColor: '#353535',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'white',
    paddingRight: 30, // to ensure the text is never behind the icon
    backgroundColor: '#353535',
  },
  iconContainer: {
    top: 10,
    right: 12,
  },
});
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#353535',
    width: '100%',
    paddingTop: StatusBar.currentHeight,
  },
  headerEditPerfil: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#353535',
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 25,
    marginLeft: 10,
  },
  headerInformationPersonal: {
    padding: 10,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },
  title: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#a9a9a9',
    fontSize: 14,
  },
  containerContent: {
    padding: 10,
  },
  save: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 5,
  },
  input: {
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    color: 'white',
    marginBottom: 10,
  },
  datePickerButton: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#2196F3',
    backgroundColor: 'transparent',
    marginBottom: 12,
    marginTop: 12,
  },
  datePickerText: {
    fontSize: 16,
    color: '#fff',
  },
  footerEditPerfil: {
    borderTopColor: 'gray',
    borderTopWidth: 1,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    backgroundColor: '#353535',
    marginBottom: 10,
    marginTop: 10,
  },
});

export default EditPerfilScreen;
