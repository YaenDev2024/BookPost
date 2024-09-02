import React from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialC from 'react-native-vector-icons/MaterialCommunityIcons';
import { auth } from '../../../config';

const EditPerfilInformation = ({route,navigation}) => {
  
  const {idUser} = route.params;
  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (err) {
      console.log('Error al cerrar sesión: ', err.message);
    }
  };
  return (
    <View style={styles.containerPerfil}>
      <StatusBar
        translucent
        backgroundColor={'#353535'}
        barStyle="light-content"
      />
      <View style={styles.headerContainerTitle}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialC name="arrow-left" size={30} color={'#fff'} />
        </TouchableOpacity>
        <Text style={styles.headerTextTitle}>Configuracion</Text>
      </View>
      <View style={styles.containerSettings}>
        <View style={styles.informationTitle}>
          <Text style={styles.titleInformation}>Informacion personal</Text>
          <Text style={styles.descriptionInformationSection}>
            Personaliza tu pefil y controla lo que las personas ven.
          </Text>
        </View>

        <TouchableOpacity style={styles.btnSettings} onPress={() => navigation.navigate('PerfilSettings',{idUser})}>
          <MaterialC name="account-edit-outline" size={18} color={'#fff'} />
          <Text style={styles.titleBtn}>Editar Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSettings}>
          <MaterialC name="text-account" size={18} color={'#fff'} />
          <Text style={styles.titleBtn}>Configuracion de la cuenta</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSettings}>
          <MaterialC name="contactless-payment" size={18} color={'#fff'} />
          <Text style={styles.titleBtn}>Configuracion de Pagos</Text>
        </TouchableOpacity>

        <View style={styles.informationTitle}>
          <Text style={styles.titleInformation}>Privacidad</Text>
          <Text style={styles.descriptionInformationSection}>
            Configura la privacidad de tu cuenta.
          </Text>
        </View>
        <TouchableOpacity style={styles.btnSettings}>
          <MaterialC name="newspaper-variant-multiple-outline" size={18} color={'#fff'} />
          <Text style={styles.titleBtn}>Feed</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSettings}>
          <MaterialC name="account-eye-outline" size={18} color={'#fff'} />
          <Text style={styles.titleBtn}>Privacidad de tu Cuenta</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSettings}>
          <MaterialC name="security" size={18} color={'#fff'} />
          <Text style={styles.titleBtn}>Seguridad</Text>
        </TouchableOpacity>

        <View style={styles.informationTitle}>
          <Text style={styles.titleInformation}>Soporte</Text>
          <Text style={styles.descriptionInformationSection}>
            Si tienes algun problema, o necesitas ayuda.
          </Text>
        </View>
        <TouchableOpacity style={styles.btnSettings}>
          <MaterialC name="help-circle-outline" size={18} color={'#fff'} />
          <Text style={styles.titleBtn}>Centro de ayuda</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSettings}>
          <MaterialC name="bug-check-outline" size={18} color={'#fff'} />
          <Text style={styles.titleBtn}>Reportar un problema</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSettings}>
          <MaterialC name="family-tree" size={18} color={'#fff'} />
          <Text style={styles.titleBtn}>Comunidad</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSettings} onPress={handleLogout}>
          <MaterialC name="logout" size={18} color={'#fff'} />
          <Text style={styles.titleBtn}>Cerrar Sesion</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerPerfil: {
    flex: 1,
    backgroundColor: '#353535',
    width: '100%',
    paddingTop: StatusBar.currentHeight,
  },
  headerContainerTitle: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    flexDirection: 'row',
  },
  headerTextTitle: {
    color: 'white',
    fontSize: 25,
    marginLeft: 10,
  },
  containerSettings: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginTop: 0,
  },
  informationTitle: {
    padding: 10,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    borderTopColor: 'gray',
    borderTopWidth: 1,
  },
  titleInformation: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  descriptionInformationSection: {
    color: '#a9a9a9',
    fontSize: 15,
  },
  btnSettings: {
    padding: 10,
    width: '100%',
    flexDirection: 'row',
  },
  titleBtn: {
    color: 'white',
    marginLeft: 5,
  },
});

export default EditPerfilInformation;
