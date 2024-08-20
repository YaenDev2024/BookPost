import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,PanResponder,Animated,
  Alert
} from 'react-native';
import CommentUser from './CommentUser';
import MaterialC from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../hooks/Autentication';
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
import { db } from '../../../config';

const Comments = ({ boxAnimatedStyles, onClose, idpub }) => {
  const { user } = useAuth();
  const [comment, setComment] = useState('');
  const [datacomments, setdatacommentsComment] = useState([]);
  const [morethanone, setMorethan] = useState(true);
  const [isOneLike, setOneLike] = useState(false);
  const [oneLike, setOnelikeName] = useState('');
  const [allNames, setAllNames] = useState([]);
  const pan = useRef(new Animated.Value(0)).current;
  const [isVisible, setIsVisible] = useState(true); 

    
    
  useEffect(() => {
    const commentsQuery = query(
      collection(db, 'comments'),
      where('id_pub', '==', idpub),
    );

    const unsubscribe = onSnapshot(
      commentsQuery,
      snapshot => {
        const commentsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setdatacommentsComment(commentsData);
      },
      error => {
        console.error('Error al obtener los comentarios:', error);
      },
    );
    return () => unsubscribe();
  }, [idpub]);

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
        const { id, img_profile, username } = commentsData[0];

        await addDoc(collection(db, 'comments'), {
          data: comment,
          date: serverTimestamp(),
          id_pub: idpub,
          id_user: id,
          img_perfil: img_profile,
          username: username,
        });

        setComment('');
      } else {
        console.error('No user data found.');
      }
    } catch (error) {
      console.error('Error al guardar el comentario:', error);
    }
  };
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      },
      onPanResponderMove: (evt, gestureState) => {
        // Solo permitimos el movimiento en el eje Y
        pan.setValue(gestureState.dy);
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy > 100) {
          setIsVisible(false); // Ocultamos la vista
        } else {
          Animated.spring(pan, { toValue: 0, useNativeDriver: true }).start(); // Regresamos a la posición original
        }
      },
    })
  ).current;
  return (
    <Animated.View style={[styles.box, boxAnimatedStyles]}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialC name="close" size={25} color={'white'} />
          </TouchableOpacity>
          <View style={styles.headerlikes}  {...panResponder.panHandlers}>
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
          <ScrollView style={styles.scrollContainer}>
            {datacomments.map((item, index) => (
              <CommentUser
                key={index}
                data={item.data}
                user={item.username}
                img={item.img_perfil}
                date={item.date}
                iddoc={item.date}
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
            <TouchableOpacity onPress={saveComment}>
              <MaterialC
                style={{ padding: 10, marginTop: 10 }}
                name="send"
                size={35}
                color={'white'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  box: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalView: {
    width: '100%',
    height: '100%',
    backgroundColor: '#353535',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
    elevation: 5,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginRight: 15,
  },
  headerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 5,
  },
  headerlikes: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  scrollContainer: {
    flex: 1,
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    width: '90%',
    color: 'white',
  },
  inputs: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
});

export default Comments;
