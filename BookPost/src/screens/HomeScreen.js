import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  TextInput,
  Modal,
  Dimensions,
} from 'react-native';
import img from '../../assets/2.png';
import {auth, db} from '../../config';
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from '@firebase/firestore';
import {useAuth} from '../hooks/Autentication';
import LoadingScreen from '../hooks/LoadingScreen';
import CardWithoutPubs from '../components/CardWithoutPubs';
import CardWithPubs from '../components/CardWithPubs';
import MaterialC from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  Directions,
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  withTiming,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import CommentsComp from '../components/comments/CommentsComp';
import Comments from '../components/comments/Comments';
import VerticalPanResponder from '../components/comments/CommentModal';
import PublicationModal from '../components/publish/PublicationModal';
import SharePubModal from '../components/publish/SharePubModal';

const HomeScreen = () => {
  const [dataPubs, setPubs] = useState([]);
  const [usermail, setMail] = useState('');
  const [imgp, setImgP] = useState('');
  const [load, setLoad] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [existPub, setExistPub] = useState(false);
  const {width, height} = Dimensions.get('screen');

  const [isVisible, setVisible] = useState(false);

  const [dataidpub, setDataidpub] = useState('');

  const [visibleModalPub, setVisibleModalPub] = useState(false);

  const [username, setUsername] = useState('');

  const [isShareVisible, setShareVisible] = useState(false);

  const [idUser, setIdUser] = useState('');

  const getData = text => {
    setDataidpub(text);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (err) {
      console.log('Error al cerrar sesión: ', err.message);
    }
  };
  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }
  const {user} = useAuth();

  const translationY = useSharedValue(0);
  const prevTranslationY = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{translateY: translationY.value}],
  }));

  const pan = Gesture.Pan()
    .minDistance(1)
    .onStart(() => {
      prevTranslationY.value = translationY.value;
    })
    .onUpdate(event => {
      const maxTranslateY = height / 2 - 50;

      const newTranslationY = clamp(
        prevTranslationY.value + event.translationY,
        -maxTranslateY,
        maxTranslateY,
      );

      translationY.value = newTranslationY;

      if (newTranslationY > 100) {
        resetModalPosition();
        setVisible(false);
      }
    });

  const resetModalPosition = () => {
    translationY.value = withSpring(0);
  };

  const closeModal = () => {
    setVisible(false);
    setVisibleModalPub(false);
    setShareVisible(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, 'publications'));
        const unsubscribe = onSnapshot(q, querySnapshot => {
          const updatedProducts = [];
          querySnapshot.forEach(doc => {
            updatedProducts.push({id: doc.id, ...doc.data()});
          });
          setPubs(updatedProducts);
          setExistPub(updatedProducts.length > 0);
        });
        return unsubscribe;
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchData();
  }, [refreshing]);

  useEffect(() => {
    if (user) {
      setMail(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (usermail) {
      setDataOfUser();
    }
  }, [usermail]);

  const setDataOfUser = async () => {
    const q = query(collection(db, 'users'), where('mail', '==', usermail));

    try {
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log('No se encontraron datos para el usuario.');
      } else {
        querySnapshot.forEach(doc => {
          setIdUser(doc.id);
          setImgP(doc.data().img_profile);
          setUsername(doc.data().username);
        });
      }
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoad(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const setModalOpen = () => {
    setVisibleModalPub(true);
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar
        translucent
        backgroundColor={'#353535'}
        barStyle="light-content"
      />
      {load ? (
        <LoadingScreen />
      ) : (
        <>
          <View style={styles.headerContainer}>
            <Text style={styles.titleLeft}>BookPost</Text>
            <TouchableOpacity onPress={handleLogout}>
              <Image source={{uri: imgp}} style={styles.imgPerfil} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}>
            <View style={styles.cardThink}>
              <Image source={{uri: imgp}} style={styles.imgPerfil} />
              <TextInput
                style={styles.inputThink}
                placeholder="¿Qué piensas?"
                placeholderTextColor="white"
                onPress={setModalOpen}
              />
              <TouchableOpacity style={styles.button}>
                <MaterialC
                  name="file-image-plus-outline"
                  size={35}
                  color={'#1f9c0d'}
                />
              </TouchableOpacity>
            </View>

            {!existPub ? (
              <CardWithoutPubs style={styles.card} />
            ) : (
              dataPubs.map((item, index) => (
                <CardWithPubs
                  key={index}
                  likes={item.likes}
                  commentsqty={item.commnets_qty}
                  data={item.data}
                  datecreated={item.datecreate}
                  img={item.img_perfil}
                  name={item.name}
                  id_pub={item.id}
                  style={styles.card}
                  setVisible={setVisible}
                  shareVisible={setShareVisible}
                  sendid={getData}
                />
              ))
            )}
          </ScrollView>
          {isVisible ? (
            <VerticalPanResponder idpub={dataidpub} onClose={closeModal} />
          ) : (
            ''
          )}
          {visibleModalPub ? (
            <PublicationModal
              onClose={closeModal}
              imgPerfil={imgp}
              user={username}
            />
          ) : null}
          {isShareVisible ? (
            <SharePubModal
              onClose={closeModal}
              imgPerfil={imgp}
              user={username}
              idUser={idUser}
              idpub={dataidpub}
            />
          ) : null}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#272727',
    alignItems: 'center',
    flex: 1,
    width: '100%',
  },
  scrollView: {
    width: '100%',
  },
  scrollViewContent: {
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: '100%',
    paddingHorizontal: 15,
    marginTop: 0,
    backgroundColor: '#353535',
    padding: 10,
    marginTop: 35,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },
  titleLeft: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    position: 'relative',
    top: -10,
  },
  cardThink: {
    backgroundColor: '#353535',
    height: 56,
    marginBottom: 10,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  imgPerfil: {
    height: 40,
    width: 40,
    borderRadius: 20,
    borderColor: 'gray',
    borderWidth: 1,
  },
  inputThink: {
    flex: 1,
    marginHorizontal: 10,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 10,
    height: 40,
    color: 'black',
  },
  button: {
    padding: 5,
  },
  card: {
    width: '100%', // Añadido para ocupar todo el ancho
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeScreen;
