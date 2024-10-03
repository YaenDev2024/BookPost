import React, {useState} from 'react';
import {Button, ScrollView, TextInput, TouchableOpacity} from 'react-native';
import {Modal, StyleSheet, View, Text, Image} from 'react-native';
import MaterialC from 'react-native-vector-icons/MaterialCommunityIcons';
import {ModalToSeeFullPic} from './ModalToSeeFullPic';

const ModalChangeInformationUser = ({
  goBack,
  imgperfil,
  imgportada,
  lastinfo,
}) => {
  const [show, setShow] = useState(false);
  const [imgShow, setImgShow] = useState('');
  const onClose = isPortada => {
    if (show == true) {
      setShow(false);
    } else {
      if (isPortada === false) {
        setImgShow(imgperfil);
        setShow(true);
      } else {
        setImgShow(imgportada);
        setShow(true);
      }
    }
    //setShow(false);
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true}
      onRequestClose={goBack}>
      <View style={styles.containerPub}>
        <View style={styles.headerContainerTitle}>
          <TouchableOpacity onPress={goBack}>
            <MaterialC name="arrow-left" size={30} color={'#fff'} />
          </TouchableOpacity>
          <Text style={styles.headerTextTitle}>Presentacion</Text>
        </View>
        <ScrollView>
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Cambiar foto de perfil:</Text>
            <View style={styles.containerPhotos}>
              <TouchableOpacity
                onPress={() => onClose(false)}
                style={styles.containerPhoto}>
                <Image style={styles.img} source={{uri: imgperfil}} />
              </TouchableOpacity>
              <TouchableOpacity>
                <MaterialC
                  name="circle-edit-outline"
                  size={30}
                  color={'#fff'}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.title}>Cambiar foto de portada:</Text>
            <View style={styles.containerPhotos}>
              <TouchableOpacity
                onPress={() => onClose(true)}
                style={styles.containerPhoto}>
                <Image style={styles.img} source={{uri: imgportada}} />
              </TouchableOpacity>

              <TouchableOpacity>
                <MaterialC
                  name="circle-edit-outline"
                  size={30}
                  color={'#fff'}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.title}>
              Cambiar informacion personal de presentacion:
            </Text>
            <TextInput
              multiline={true}
              style={styles.input}
              placeholder={lastinfo}
              placeholderTextColor={'gray'}
            />
            {/* <Text style={styles.title}>
              Cambiar color principal del perfil:
            </Text>
            <TextInput
              multiline={true}
              style={styles.input}
              placeholder={'red'}
              placeholderTextColor={'gray'}
            /> */}
          </View>
          <Button title="Guardar cambios" />
        </ScrollView>
        {show ? <ModalToSeeFullPic onClose={onClose} uri={imgShow} /> : null}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  containerPub: {
    flex: 1,
    backgroundColor: '#353535',
    borderRadius: 10,
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
  contentContainer: {
    padding: 5,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 10,
  },
  containerPhotos: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  img: {
    width: '100%',
    height: 200,
    borderRadius: 100,
    borderWidth: 5,
    borderColor: 'white',
  },
  input: {
    width: '100%',
    height: 120,
    fontSize: 20,
    color: 'white',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
  },
  containerPhoto: {
    width: '50%',
    height: 200,
  },
});
export default ModalChangeInformationUser;
