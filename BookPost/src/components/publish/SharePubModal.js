import {
  addDoc,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from '@firebase/firestore';
import React, {useRef, useState} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PanResponder,
  Animated,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {Image} from 'react-native-animatable';
import {db} from '../../../config';

const SharePubModal = ({visible, onClose, imgPerfil, user, idUser, idpub}) => {
  const pan = useRef(new Animated.Value(0)).current;
  const [data, setData] = useState([]);
  const [text, setText] = useState('');
  const [disabled, setDisabled] = useState(false);
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      },
      onPanResponderMove: (evt, gestureState) => {
        pan.setValue(gestureState.dy);
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy > 100) {
          onClose();
        } else {
          Animated.spring(pan, {toValue: 0, useNativeDriver: true}).start();
        }
      },
    }),
  ).current;

  const sharePost = async () => {
    setDisabled(true);
    await addDoc(collection(db, 'shared_publication'), {
      id_pub: idpub,
      id_user: idUser,
    });

    const refPub = collection(db, 'shared_publication');
    const pubQuery = query(refPub, where('id_pub', '==', idpub), limit(1));
    var idpubshared = '';
    const unsubscribe = onSnapshot(pubQuery, snapshot => {
      snapshot.docChanges().forEach(async change => {
        const pushared = {id: change.doc.id, ...change.doc.data()};

        const localTimestamp = new Date();

        const arr = [];
        arr.push({img: []});
        arr.push({text: text});
        arr.push({id: pushared.id});

        await addDoc(collection(db, 'publications'), {
          comment: '',
          comments_qty: 0,
          data: arr,
          datecreated: localTimestamp,
          img_perfil: imgPerfil,
          likes: 0,
          name: user,
        });
      });
      onClose();
    });

    return () => unsubscribe();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}>
      <Animated.View
        style={[styles.container, {transform: [{translateY: pan}]}]}>
        <View style={styles.overlay}>
          <View style={styles.modalContainer} {...panResponder.panHandlers}>
            <View style={styles.headerModal}>
              <View style={styles.line}></View>
            </View>

            <View style={styles.containerUser}>
              <Image style={styles.imgPerfil} source={{uri: imgPerfil}} />
              <Text style={styles.hname}>{user}</Text>
            </View>
            <View style={styles.containerInput}>
              <TextInput
                placeholder="Escribe lo que piensas"
                multiline={true}
                onChangeText={text => setText(text)}></TextInput>
            </View>
            {disabled ? <ActivityIndicator /> : null}

            <View style={styles.footerbtn}>
              {disabled ? null : (
                <TouchableOpacity style={styles.btnShare} onPress={sharePost}>
                  <Text>Compartir</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  overlay: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '100%',
    padding: 20,
    backgroundColor: '#353535',
    borderRadius: 20,
    height: 350,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  modalContent: {
    fontSize: 16,
    color: 'white',
    marginBottom: 20,
  },
  closeButton: {
    alignSelf: 'center',
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  headerModal: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  line: {
    width: '30%',
    height: 5,
    backgroundColor: '#6d6d6d',
    borderRadius: 2.5,
  },
  containerUser: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  imgPerfil: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 10,
  },
  containerInput: {
    width: '100%',
    height: 175,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  hname: {
    color: 'white',
    fontSize: 16,
  },
  footerbtn: {
    width: '100%',
    alignItems: 'flex-end',
  },
  btnShare: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 10,
  },
});

export default SharePubModal;
