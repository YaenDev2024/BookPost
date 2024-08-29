import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import React, {useState} from 'react';
import {
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

const EditPerfilScreen = ({navigation}) => {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [placeholder, setPlaceholder] = useState('Selecciona una opcion');
  const [selectedValue, setSelectedValue] = useState(null);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShow(true);
    setMode('date');
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
              placeholder="Escriba su nombre completo."
              placeholderTextColor={'gray'}></TextInput>
            <Text style={styles.title}>Apellido/s: </Text>
            <TextInput
              style={styles.input}
              placeholder="Escriba sus apellidos."
              placeholderTextColor={'gray'}></TextInput>
            <Text style={styles.title}>Nombre de usuario: </Text>
            <TextInput
              style={styles.input}
              placeholder="Escriba su nombre de usuario."
              placeholderTextColor={'gray'}></TextInput>
            <Text style={styles.title}>Genero: </Text>
            <TextInput
              style={styles.input}
              placeholder="Escriba su nombre de usuario."
              placeholderTextColor={'gray'}></TextInput>
            <Text style={styles.title}>Intereses: </Text>
            <View style={styles.pickerContainer}>
              <RNPickerSelect
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
              onPress={showDatepicker}>
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
            <TouchableOpacity style={styles.save}>
              <Text style={{color: 'white'}}>Guardar datos</Text>
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
            style={styles.input}
            placeholder="Escriba su telefono."
            placeholderTextColor={'gray'}></TextInput>
          <Text style={styles.title}>Correo electronico: </Text>
          <TextInput
            style={styles.input}
            placeholder="Escriba su correo electronico."
            placeholderTextColor={'gray'}></TextInput>
          <Text style={styles.title}>Direccion: </Text>
          <TextInput
            style={styles.input}
            placeholder="Escriba su direccion."
            placeholderTextColor={'gray'}></TextInput>
          <Text style={styles.title}>Ciudad: </Text>
          <TextInput
            style={styles.input}
            placeholder="Escriba su ciudad."
            placeholderTextColor={'gray'}></TextInput>
          <TouchableOpacity style={styles.save}>
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
