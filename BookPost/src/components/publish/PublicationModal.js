import React, {useState} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import MaterialC from 'react-native-vector-icons/MaterialCommunityIcons';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import {addDoc, collection} from '@firebase/firestore';
import {db} from '../../../config';

const PublicationModal = ({visible, onClose, imgPerfil, user}) => {
  const [isLoadImage, setLoadImage] = useState(false);
  const [image, setImage] = useState([]);
  const [text, setText] = useState('');
  const [imgUrls, setImgUrls] = useState([]);
  const [isPublish,setPublish] =useState(true)
  const {height, width} = Dimensions.get('screen');

  const uploadImageToFirebase = async imageUri => {
    const filename = imageUri.substring(imageUri.lastIndexOf('/') + 1);
    const storageRef = storage().ref(`images/${filename}`);

    try {
      const uploadTask = storageRef.putFile(imageUri);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          snapshot => {
            console.log(
              'Progreso: ',
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
            );
          },
          error => {
            console.error('Error: ', error);
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await storageRef.getDownloadURL();
              console.log('URL disponible en: ', downloadURL);
              resolve(downloadURL);
            } catch (error) {
              console.error('Error al obtener el URL: ', error);
              reject(error);
            }
          },
        );
      });
    } catch (error) {
      console.error('Error al subir la imagen: ', error);
    }
  };

  const uploadImages = async () => {
    try {
      const urls = await Promise.all(
        image.map(img => uploadImageToFirebase(img.uri)),
      );
      setImgUrls(urls);
      return urls;
    } catch (error) {
      console.error('Error al subir imágenes: ', error);
      return [];
    }
  };

  const publish = async () => {
    try {
      setPublish(false)
      const urls = await uploadImages(); 

      const localTimestamp = new Date();
      const arr = [];
      arr.push({img: urls});
      arr.push({text: text});

      await addDoc(collection(db, 'publications'), {
        comment: text,
        comments_qty: 0,
        data: arr,
        datecreated: localTimestamp,
        img_perfil: imgPerfil,
        likes: 0,
        name: user,
      });
      setPublish(true)
      onClose(); 
    } catch (error) {
      console.error('Error al publicar: ', error);
    }
  };

  const selectImage = () => {
    launchImageLibrary({mediaType: 'photo', selectionLimit: 0}, response => {
      if (response.didCancel) {
        console.log('Usuario canceló la selección de imagen');
      } else if (response.errorCode) {
        console.log('Error del ImagePicker: ', response.errorCode);
      } else if (response.assets) {
        const selectedImages = response.assets.map(asset => ({
          uri: asset.uri,
          name: asset.fileName,
          type: asset.type,
        }));
        setImage([...image, ...selectedImages]);
        setLoadImage(true);
      }
    });
  };

  const takePhoto = () => {
    launchCamera({mediaType: 'photo', saveToPhotos: true}, response => {
      if (response.didCancel) {
        console.log('Usuario canceló la captura de foto');
      } else if (response.errorCode) {
        console.log('Error del ImagePicker: ', response.errorCode);
      } else if (response.assets) {
        const newImage = {
          uri: response.assets[0].uri,
          name: response.assets[0].fileName,
          type: response.assets[0].type,
        };
        setImage([...image, newImage]);
        setLoadImage(true);
      }
    });
  };

  const removeImg = index => {
    setImage(image.filter((_, i) => i !== index));
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.containerPub}>
        <View style={styles.headerModal}>
          <TouchableOpacity onPress={onClose}>
            <MaterialC name="arrow-left" size={25} color={'white'} />
          </TouchableOpacity>
          <Text style={styles.textHeader}>Crear publicación</Text>
        </View>

        <View style={styles.headerPubli}>
          <Image style={styles.imgProfile} source={{uri: imgPerfil}} />
          <Text style={styles.textName}>{user}</Text>
        </View>
        <View style={[styles.contentPub, {height: height * 0.7}]}>
          <TextInput
            placeholder="Crea una publicación con tu imaginación."
            style={styles.inputPub}
            multiline={true}
            onChangeText={text => setText(text)}></TextInput>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.imgLoaded}>
              {isLoadImage
                ? image.map((item, index) => (
                    <View key={index} style={{margin: 5}}>
                      <Image
                        source={{uri: item.uri}}
                        style={{width: 80, height: 80}}
                      />
                      <TouchableOpacity onPress={() => removeImg(index)}>
                        <MaterialC
                          name="close-circle-outline"
                          size={35}
                          color={'gray'}
                        />
                      </TouchableOpacity>
                    </View>
                  ))
                : null}
            </View>
          </ScrollView>
          {isPublish ? null : (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <Text>Publicando</Text>
              <ActivityIndicator />
            </View>
          )}
        </View>
        <View style={styles.footerPub}>
          <TouchableOpacity style={styles.buttonImg} onPress={selectImage}>
            <MaterialC
              name="file-image-plus-outline"
              size={35}
              color={'#1f9c0d'}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonImg} onPress={takePhoto}>
            <MaterialC name="camera-plus-outline" size={35} color={'#98b0e5'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonPub} onPress={publish}>
            <Text>Publicar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  containerPub: {
    flex: 1,
    backgroundColor: '#353535',
  },
  headerModal: {
    flexDirection: 'row',
    backgroundColor: '#353535',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  textHeader: {
    fontSize: 20,
    marginLeft: 10,
  },
  headerPubli: {
    flexDirection: 'row',
    padding: 30,
    alignItems: 'center',
  },
  imgProfile: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 100,
    width: 50,
    height: 50,
  },
  textName: {
    color: 'white',
    marginLeft: 10,
    fontSize: 20,
  },
  contentPub: {
    marginTop: -25,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  inputPub: {
    width: '100%',
    height: 'auto',
    fontSize: 20,
  },
  footerPub: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 10,
    alignItems: 'center',
  },
  buttonPub: {
    backgroundColor: '#1140ab',
    padding: 10,
    borderRadius: 5,
  },
  imgLoaded: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default PublicationModal;
