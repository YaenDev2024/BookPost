import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import MaterialC from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
} from '@firebase/firestore';
import {db} from '../../config';
import {useAuth} from '../hooks/Autentication';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  clamp,
} from 'react-native-reanimated';
import CardPubliShared from './CardPubliShared';
import {useNavigation} from '@react-navigation/native';

const CardWithPubs = ({
  img,
  data,
  name,
  id_pub,
  setVisible,
  sendid,
  shareVisible,
  id_user,
}) => {
  const [comments, setComments] = useState([]);
  const [isLiked, setLiked] = useState(false);
  const {user} = useAuth();
  const [userid, setUserID] = useState('');
  const {width} = Dimensions.get('screen');
  const [imgperfil, setImgPerfil] = useState('');
  const [imgOfUser, setImgofuser] = useState('');
  const [username, setUsername] = useState('');

  const navigation = useNavigation();

  useEffect(() => {
    const commentsQuery = query(
      collection(db, 'comments'),
      where('id_pub', '==', id_pub),
    );

    const unsubscribe = onSnapshot(
      commentsQuery,
      snapshot => {
        const commentsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setComments(commentsData);
      },
      error => {
        console.error('Error al obtener los comentarios:', error);
      },
    );

    return () => unsubscribe();
  }, [id_pub]);

  useEffect(() => {
    getid();
  }, []);

  const getid = async () => {
    const userSearch = query(
      collection(db, 'users'),
      where('mail', '==', user.email),
    );
    const userSnapshot = await getDocs(userSearch);
    const userData = userSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setUserID(userData[0]?.id);
    setImgPerfil(userData[0]?.img_profile);
  };

  useEffect(() => {
    const likeQuery = query(
      collection(db, 'likes_by_users'),
      where('id_publication', '==', id_pub),
      where('id_user', '==', userid),
    );

    const unsubscribe = onSnapshot(
      likeQuery,
      snapshot => {
        const likesdata = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLiked(likesdata.length > 0);
      },
      error => {
        console.error('Error al obtener los likes:', error);
      },
    );

    return () => unsubscribe();
  }, [id_pub, userid]);

  useEffect(() => {
    const q = query(
      collection(db, 'publications'),
      where('id_user', '==', id_user),
    );

    const unsuscribe = onSnapshot(q, querySnapshot => {
      const updatedProducts = [];
      querySnapshot.forEach(docs => {
        const unsubs = onSnapshot(
          doc(db, 'users', docs.data().id_user),
          doct => {
            
            setImgofuser(doct.data().img_profile);
            setUsername(doct.data().username);
          },
        );
      });
    });
  }, []);

  const handleShowComments = () => {
    setVisible(prev => !prev);
    sendid(id_pub);
  };

  const saveLike = async () => {
    const userSearch = query(
      collection(db, 'users'),
      where('mail', '==', user.email),
    );
    const userSnapshot = await getDocs(userSearch);
    const userData = userSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (userData.length > 0) {
      const iduser = userData[0].id;

      const likeQuery = query(
        collection(db, 'likes_by_users'),
        where('id_publication', '==', id_pub),
        where('id_user', '==', iduser),
      );

      const likeSnapshot = await getDocs(likeQuery);

      if (likeSnapshot.empty) {
        const likedata = {
          id_publication: id_pub,
          id_user: iduser,
        };

        const likeDocRef = doc(collection(db, 'likes_by_users'));

        try {
          await setDoc(likeDocRef, likedata);
          setLiked(true);
        } catch (error) {
          console.error('Error al guardar el like:', error);
        }
      } else {
        const likeDocId = likeSnapshot.docs[0].id;
        try {
          await deleteDoc(doc(db, 'likes_by_users', likeDocId));
          setLiked(false);
        } catch (error) {
          console.error('Error al eliminar el like:', error);
        }
      }
    } else {
      console.error('No se encontraron datos del usuario.');
    }
  };

  const handleSharePost = () => {
    shareVisible(prev => !prev);
    sendid(id_pub);
  };

  const {height} = Dimensions.get('screen');

  const scale = useSharedValue(1);
  const startScale = useSharedValue(0);

  const pinch = Gesture.Pinch()
    .onStart(() => {
      startScale.value = scale.value;
    })
    .onUpdate(event => {
      scale.value = clamp(
        startScale.value * event.scale,
        0.8,
        Math.min(width / 100, height / 100),
      );
    })
    .onEnd(() => {
      scale.value = withSpring(1, {
        damping: 8,
        stiffness: 50,
      });
    });

  const boxAnimatedStyles = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  const goToPerfilUser = async text => {
    const userQuery = query(
      collection(db, 'users'),
      where('username', '==', text),
    );
    const commentsSnapshot = await getDocs(userQuery);
    const userData = commentsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    if (userData.length > 0) {
      // setDataUser(userData[0].id);
      // onClose();
      navigation.navigate('MainPageUser', {
        imgPerfil: img,
        username: text,
        idUser: userData[0].id,
      });
    } else {
      Alert.alert('El usuario no existe');
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.headercard}>
        <TouchableOpacity style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}} onPress={() => goToPerfilUser(username)}>
          <Image style={styles.imgPerfil} source={{uri: imgOfUser ? imgOfUser : 'https://firebasestorage.googleapis.com/v0/b/bookpost-5011d.appspot.com/o/perfilpred.jpg?alt=media&token=3a1941b8-061d-4495-bad7-884f887832a1'}} />
          <Text style={styles.nameText}>{username}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.data}>
        {Array.isArray(data) && data.length > 1 ? (
          <>
            <Text style={styles.text}>{data[1].text}</Text>
            <View style={styles.imageContainer}>
              {data[0].img.length === 1 ? (
                <GestureHandlerRootView style={styles.container}>
                  <GestureDetector gesture={pinch}>
                    <Animated.View
                      style={[styles.singleImage, boxAnimatedStyles]}>
                      <Image
                        source={{uri: data[0].img[0] ? data[0].img[0] : 'https://firebasestorage.googleapis.com/v0/b/bookpost-5011d.appspot.com/o/perfilpred.jpg?alt=media&token=3a1941b8-061d-4495-bad7-884f887832a1'}}
                        resizeMode="cover"
                        style={styles.singleImage}
                      />
                    </Animated.View>
                  </GestureDetector>
                </GestureHandlerRootView>
              ) : data[2]?.id.length > 0 ? (
                // <Text style={styles.text}>{data[2]?.id}</Text>
                <CardPubliShared
                  img={imgperfil}
                  name={username}
                  id_pub={data[2]?.id}
                />
              ) : (
                data[0].img.map((item, index) => (
                  <GestureHandlerRootView style={styles.container}>
                    <GestureDetector gesture={pinch}>
                      <Animated.View
                        style={[styles.singleImage, boxAnimatedStyles]}>
                        <Image
                          key={index}
                          source={{uri: item ? item : 'https://firebasestorage.googleapis.com/v0/b/bookpost-5011d.appspot.com/o/perfilpred.jpg?alt=media&token=3a1941b8-061d-4495-bad7-884f887832a1'}}
                          style={[
                            styles.multiImage,
                            {marginRight: (index + 1) % 2 === 0 ? 0 : 5},
                          ]}
                          resizeMode="cover"
                        />
                      </Animated.View>
                    </GestureDetector>
                  </GestureHandlerRootView>
                ))
              )}
            </View>
          </>
        ) : (
          <Text style={styles.text}>{data}</Text>
        )}
        <TouchableOpacity style={styles.dataCom} onPress={handleShowComments}>
          <Text style={styles.commnets}>{comments.length} comentario</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footercard}>
        {!isLiked ? (
          <TouchableOpacity style={{marginRight: 10}} onPress={saveLike}>
            <MaterialC name="cards-heart-outline" size={25} color={'#e3e3e3'} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={{marginRight: 10}} onPress={saveLike}>
            <MaterialC name="cards-heart" size={25} color={'red'} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={{marginRight: 10}}
          onPress={handleShowComments}>
          <MaterialC name="message-outline" size={25} color={'#e3e3e3'} />
        </TouchableOpacity>
        <TouchableOpacity style={{marginRight: 10}} onPress={handleSharePost}>
          <MaterialC name="share-variant-outline" size={25} color={'#e3e3e3'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#353535',
    margin: -5,
    width: '100%',
    padding: 10,
    marginBottom: 15,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headercard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imgPerfil: {
    height: 40,
    width: 40,
    borderRadius: 20,
    borderColor: 'white',
    borderWidth: 1,
  },
  nameText: {
    flex: 1,
    marginLeft: 10,
    color: 'white',
    fontWeight: '500',
  },
  data: {
    padding: 10,
  },
  text: {
    color: 'white',
    fontWeight: '500',
    marginBottom: 10,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  singleImage: {
    width: '100%',
    height: 500,
    borderRadius: 10,
  },
  multiImage: {
    width: '48%',
    height: 150,
    borderRadius: 10,
    marginBottom: 5,
  },
  footercard: {
    flexDirection: 'row',
    padding: 10,
    marginTop: -20,
    width: '100%',
  },
  dataCom: {
    padding: 10,
    alignItems: 'flex-end',
  },
  commnets: {
    color: 'white',
    fontWeight: '500',
  },
});

export default CardWithPubs;
