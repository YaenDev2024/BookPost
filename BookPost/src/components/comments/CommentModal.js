import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  PanResponder,
  Animated,
  StyleSheet,
  Button,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
} from 'react-native';
import {useAuth} from '../../hooks/Autentication';
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  updateDoc,
  where,
} from '@firebase/firestore';
import {db} from '../../../config';
import MaterialC from 'react-native-vector-icons/MaterialCommunityIcons';
import CommentUser from './CommentUser';

const VerticalPanResponder = ({idpub, onClose, id, img_profile, username}) => {
  const pan = useRef(new Animated.Value(0)).current;
  const [isVisible, setIsVisible] = useState(true); // Estado para controlar la visibilidad
  const {user} = useAuth();
  const [comment, setComment] = useState('');
  const [datacomments, setdatacommentsComment] = useState([]);
  const [morethanone, setMorethan] = useState(true);
  const [isOneLike, setOneLike] = useState(false);
  const [oneLike, setOnelikeName] = useState('');
  const [allNames, setAllNames] = useState([]);
  const [resUser, setResUser] = useState('');
  const [res, setRes] = useState(false);
  const [idComment, setIdcomment] = useState('');
  const [idanswered, setIdAnswered] = useState('');
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [temp, setTemp] = useState(false);
  const [isDisabled, setisDisabled] = useState(false);

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
          onClose(); // Ocultamos la vista
        } else {
          Animated.spring(pan, {toValue: 0, useNativeDriver: true}).start(); // Regresamos a la posición original
        }
      },
    }),
  ).current;

  const handleShow = () => {
    setIsVisible(true);
    pan.setValue(0); // Reseteamos la posición
  };

  const loadCommnets = async (initialLoad = false) => {
    if (loading) return;
    setLoading(true);

    const commentsRef = collection(db, 'comments');
    let commentsQuery = query(
      commentsRef,
      where('id_pub', '==', idpub),
      orderBy('date', 'desc'),
      limit(initialLoad ? 5 : 4),
    );

    if (!initialLoad && lastVisible) {
      commentsQuery = query(
        commentsRef,
        where('id_pub', '==', idpub),
        orderBy('date', 'desc'),
        startAfter(lastVisible),
        limit(5),
      );
    }

    const snapshot = await getDocs(commentsQuery);
    const commentsData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    const existingIds = new Set(datacomments.map(comment => comment.id));

    const newComments = commentsData.filter(
      comment => !existingIds.has(comment.id),
    );

    if (newComments.length > 0) {
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      setdatacommentsComment(prevComments =>
        initialLoad ? newComments : [...prevComments, ...newComments],
      );
    }

    setLoading(false);
  };

  // Fetch comments
  useEffect(() => {
    const commentsRef = collection(db, 'comments');
    const commentsQuery = query(
      commentsRef,
      where('id_pub', '==', idpub),
      orderBy('date', 'desc'),
      limit(10),
    );

    const unsubscribe = onSnapshot(commentsQuery, snapshot => {
      setdatacommentsComment(prevComments => {
        const existingIds = new Set(prevComments.map(comment => comment.id));
        const newComments = [];

        snapshot.docChanges().forEach(change => {
          const comment = {id: change.doc.id, ...change.doc.data()};

          if (change.type === 'added' && !existingIds.has(comment.id)) {
            newComments.push(comment);
          } else if (change.type === 'modified') {
            prevComments = prevComments.map(prevComment =>
              prevComment.id === comment.id ? comment : prevComment,
            );
          } else if (change.type === 'removed') {
            prevComments = prevComments.filter(
              prevComment => prevComment.id !== comment.id,
            );
          }
        });

        return [...newComments, ...prevComments];
      });

      if (snapshot.docs.length > 0) {
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      }
    });

    return () => unsubscribe();
  }, [idpub]);

  // Fetch likes
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
      setisDisabled(true);
      if (comment !== null && comment !== undefined && comment.trim() !== '') {
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

          if (res === true) {
            const firstSpaceIndex = resUser.indexOf(' ');
            const user = resUser.substring(0, firstSpaceIndex);
            const docRef = await addDoc(collection(db, 'answer_comments'), {
              data: user + ', ' + comment,
              date: serverTimestamp(),
              id_user: id,
            });

            const newId = docRef.id;
            const setNewCommentToUSER = doc(db, 'comments', idComment);
            await updateDoc(setNewCommentToUSER, {
              comments_answered_id: arrayUnion(newId),
            });
          } else {
            const localTimestamp = new Date();
            await addDoc(collection(db, 'comments'), {
              comments_answered_id: [],
              data: comment,
              date: localTimestamp,
              id_pub: idpub,
              id_user: id,
              img_perfil: img_profile,
              username: username,
            });
          }

          setComment('');
          setRes(false);
          setResUser('');
          handleBlur();
          setisDisabled(false);
        } else {
          console.error('No user data found.');
        }
      } else {
        console.warn('El comentario está vacío.');
        setisDisabled(false);
      }
    } catch (error) {
      console.error('Error al guardar el comentario:', error);
    }
  };

  const setIdCommentSon = (text, user) => {
    handleFocus();
    setRes(true);
    setResUser(user + ' ');
    setIdcomment(text);
  };

  const cancelComment = () => {
    setRes(false);
    setResUser('');
    setComment('');
    handleBlur();
  };

  const textInputRef = useRef(null);

  const handleFocus = () => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  };
  const handleBlur = () => {
    if (textInputRef.current) {
      textInputRef.current.blur(); // Quitar foco
    }
  };
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={isVisible}
      onRequestClose={onClose}>
      <Animated.View
        style={[styles.container, {transform: [{translateY: pan}]}]}>
        {isVisible ? (
          <>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View style={styles.headerlikes} {...panResponder.panHandlers}>
                  {isOneLike ? (
                    <>
                      <MaterialC name="cards-heart" size={25} color={'red'} />
                      <Text style={styles.headerText}>
                        Le gusta a {oneLike}
                      </Text>
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
                  <TouchableOpacity
                    onPress={onClose}
                    style={styles.closeButton}>
                    <MaterialC name="close" size={25} color={'white'} />
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={datacomments}
                  renderItem={({item}) =>
                    temp ? (
                      <CommentUser
                        data={item.data}
                        user={item.username}
                        img={item.img_perfil}
                        date={item.date}
                        iddoc={item.id}
                        sendIdcomment={setIdCommentSon}
                        loading={loading}
                        onClose={onClose}
                      />
                    ) : (
                      <CommentUser
                        data={item.data}
                        user={item.username}
                        img={item.img_perfil}
                        date={item.date}
                        iddoc={item.id}
                        sendIdcomment={setIdCommentSon}
                        loading={loading}
                        onClose={onClose}

                      />
                    )
                  }
                  keyExtractor={item => item.id} // Asegúrate de usar un ID único
                  onEndReached={() => loadCommnets()} // Cargar más comentarios
                  onEndReachedThreshold={0.5} // Umbral para activar la carga
                  showsVerticalScrollIndicator={false}
                />
                {res ? (
                  <Text style={styles.res}>
                    Respondiendo:{' '}
                    <Text style={styles.resUser}>{resUser.trim()}</Text>{' '}
                    <Text onPress={cancelComment}>- Cancelar</Text>
                  </Text>
                ) : null}

                <View style={styles.inputs}>
                  <TextInput
                    ref={textInputRef}
                    style={styles.input}
                    placeholder="Escribe un comentario..."
                    placeholderTextColor={'gray'}
                    value={res ? resUser + comment : comment}
                    onChangeText={text => {
                      if (res && text.startsWith(resUser)) {
                        setComment(text.slice(resUser.length));
                        setIdAnswered(resUser);
                      } else {
                        setComment(text);
                      }
                    }}
                  />
                  <TouchableOpacity onPress={saveComment} disabled={isDisabled}>
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
          </>
        ) : (
          <View style={styles.container}>
            <Button title="Mostrar" onPress={handleShow} />
          </View>
        )}
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%', // Asegúrate de que ocupa todo el alto de la pantalla
  },
  header: {
    padding: 10,
    backgroundColor: '#eee',
    width: '100%',
    alignItems: 'center',
  },
  scrollView: {
    height: 500,
    width: '100%',
  },
  scrollContent: {
    padding: 10,
  },
  scrollText: {
    height: 40,
    lineHeight: 40,
    fontSize: 16,
    backgroundColor: '#ccc',
    marginVertical: 5,
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  modalView: {
    width: '100%',
    height: '100%', // Cambia esto para asegurar que el modal ocupa toda la pantalla
    backgroundColor: '#353535',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
    elevation: 5,
    paddingLeft: 10,
    paddingRight: 15,
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
    marginBottom: 5,
    backgroundColor: '#353535',
    paddingLeft: 15,
    alignItems: 'center',
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
    paddingBottom: 5,
  },
  res: {
    textAlign: 'auto',
    justifyContent: 'center',
    marginTop: 10,
    marginLeft: 10,
  },
  resUser: {
    fontWeight: 'bold',
    color: 'white',
  },
});

export default VerticalPanResponder;
