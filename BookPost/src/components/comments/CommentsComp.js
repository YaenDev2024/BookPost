import React, {useEffect, useState} from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import CommentUser from './CommentUser';
import MaterialC from 'react-native-vector-icons/MaterialCommunityIcons';
import {useAuth} from '../../hooks/Autentication';
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  serverTimestamp,
  onSnapshot,
  doc,
  getDoc,
} from '@firebase/firestore';
import {db} from '../../../config';

const CommentsComp = ({visible, onClose, datacomments, idpub}) => {
  const {user} = useAuth();
  const [comment, setComment] = useState('');
  const [morethanone, setMorethan] = useState(true);
  const [isOneLike, setOneLike] = useState(false);
  const [oneLike, setOnelikeName] = useState('');
  const [allNames, setAllNames] = useState([]);

  useEffect(() => {
    const likeQuery = query(
      collection(db, 'likes_by_users'),
      where('id_publication', '==', idpub),
    );

    const unsubscribe = onSnapshot(
      likeQuery,
      async snapshot => {
        const likesdata = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (likesdata.length === 0) {
          setOneLike(false);
          setAllNames([]);
          setMorethan(false);
        } else {
          const namesPromises = likesdata.map(async element => {
            const userDocRef = doc(db, 'users', element.id_user);
            const userDoc = await getDoc(userDocRef);
            return userDoc.data().username;
          });

          const names = await Promise.all(namesPromises);

          if (names.length === 1) {
            setOneLike(true);
            setOnelikeName(names[0]);
          } else {
            setOneLike(false);
            setOnelikeName(names[0]);
            setAllNames(names.slice(1));
            setMorethan(true);
          }
        }
      },
      error => {
        console.error('Error al obtener los likes:', error);
      },
    );

    return () => unsubscribe();
  }, [idpub]);

  const saveComment = async () => {
    try {
      const commentsQuery = query(
        collection(db, 'users'),
        where('mail', '==', user.email),
      );
      const commentsSnapshot = await getDocs(commentsQuery);
      const commentsData = commentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (commentsData.length > 0) {
        const {id, img_profile, username} = commentsData[0];

        await addDoc(collection(db, 'comments'), {
          data: comment,
          date: serverTimestamp(),
          id_pub: idpub,
          id_user: id,
          img_perfil: img_profile,
          username: username,
        });

        // Opcional: limpiar el campo de comentario después de guardarlo
        setComment('');
      } else {
        console.error('No user data found.');
      }
    } catch (error) {
      console.error('Error al obtener los comentarios:', error);
    }
  };

  const getLikesCount = () => {};
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialC name="close" size={25} color={'white'} />
          </TouchableOpacity>
          {/* This is header of the comments section */}
          <View style={styles.headerlikes}>
            {isOneLike ? (
              <>
                <MaterialC name="cards-heart" size={25} color={'red'} />
                <Text style={styles.headerText}>Le gusta a {oneLike}</Text>
              </>
            ) : morethanone ? (
              <>
                <MaterialC name="cards-heart" size={25} color={'red'} />
                <Text style={styles.headerText}>
                  Le gusta a {oneLike} y {allNames.length} más
                </Text>
              </>
            ) : (
              <Text style={styles.headerText}>No hay reacciones</Text>
            )}
          </View>
          <ScrollView style={{width: '100%'}}>
            {/* Comment by user */}
            {datacomments.map((item, index) => (
              <CommentUser
                key={index}
                data={item.data}
                user={item.username}
                img={item.img_perfil}
                date={item.date}
              />
            ))}
          </ScrollView>
          <View style={styles.inputs}>
            <TextInput
              style={styles.input}
              placeholder="Escribe un comentario..."
              placeholderTextColor={'gray'}
              value={comment}
              onChangeText={text => setComment(text)}
            />
            <TouchableOpacity onPress={() => saveComment()}>
              <MaterialC
                style={{padding: 10, marginTop: 10}}
                name="send"
                size={35}
                color={'white'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalView: {
    width: '100%',
    height: '100%',
    backgroundColor: '#353535',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    paddingTop: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  headerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    width: '90%',
  },
  headerlikes: {
    flexDirection: 'row',
    marginTop: -25,
    marginBottom: 20,
  },
  inputs: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default CommentsComp;
