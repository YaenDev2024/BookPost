import React, {useEffect, useState, useRef} from 'react';
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
  Alert,
  FlatList,
  Platform,
} from 'react-native';
import img from '../../assets/2.png';
import {auth, db} from '../../config';
import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  query,
  startAfter,
  where,
} from '@firebase/firestore';
import {useAuth} from '../hooks/Autentication';
import LoadingScreen from '../hooks/LoadingScreen';
import CardWithoutPubs from '../components/CardWithoutPubs';
import CardWithPubs from '../components/CardWithPubs';
import MaterialC from 'react-native-vector-icons/MaterialCommunityIcons';
import VerticalPanResponder from '../components/comments/CommentModal';
import PublicationModal from '../components/publish/PublicationModal';
import SharePubModal from '../components/publish/SharePubModal';
import {getAuth} from '@firebase/auth';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  useForeground,
} from 'react-native-google-mobile-ads';
import CardWithAds from '../components/CardWithAds';
import NativeAdView from "react-native-admob-native-ads";
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import ModalOptionsPub from '../components/Publications/ModalOptionsPub';

const {height} = Dimensions.get('screen');
const {width} = Dimensions.get('screen');
const HomeScreen = ({navigation}) => {
  const [dataPubs, setPubs] = useState([]);
  const [usermail, setMail] = useState('');
  const [imgp, setImgP] = useState('');
  const [load, setLoad] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [existPub, setExistPub] = useState(false);
  const [count, setCount] = useState(0);
  const [isVisible, setVisible] = useState(false);
  const [isVisibleOptions, setVisibleOptions] = useState(false);
  const [dataidpub, setDataidpub] = useState('');
  const [visibleModalPub, setVisibleModalPub] = useState(false);
  const [username, setUsername] = useState('');
  const [isShareVisible, setShareVisible] = useState(false);
  const [idUser, setIdUser] = useState('');
  const [lastVisible, setLastVisible] = useState(null);
  function formatTimeRemaining(timestamp) {
    const date = new Date((timestamp.seconds * 1000) + (timestamp.nanoseconds / 1000000));
    
    return formatDistanceToNow(date, { 
      addSuffix: true,
      locale: es // Para tener el resultado en español
    });
  }
  const adUnitId = __DEV__
    ? TestIds.ADAPTIVE_BANNER
    : 'ca-app-pub-3477493054350988/4075718325';

  const getData = text => {
    setDataidpub(text);
  };

  const {user} = useAuth();

  const closeModal = () => {
    setVisible(false);
    setVisibleModalPub(false);
    setShareVisible(false);
  };

  const goToMainPage = () => {
    navigation.navigate('MainPageUser', {
      imgPerfil: imgp,
      username: username,
      idUser: idUser,
    });
  };


 

  



  useEffect(() => {
    setLoad(true);
    setRefreshing(false);

    const fetchData = async () => {
      try {
        const q = query(collection(db, 'publications'), limit(4));
        const unsubscribe = onSnapshot(q, querySnapshot => {
          const updatedProducts = [];
          querySnapshot.forEach(doc => {
            updatedProducts.push({id: doc.id, ...doc.data()});
          });
          setPubs([]);
          setPubs(updatedProducts);
          setExistPub(updatedProducts.length > 0);
          setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        });
        return unsubscribe;
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };
    var promResuelta = fetchData();

    promResuelta.then(
      function (result) {
        console.log('Promesa resuelta: ', result);
        setLoad(false);
      },
      function (error) {
        console.error('Error en la promesa: ', error);
      },
    );
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

  const setDataOfUser = () => {
    const q = query(collection(db, 'users'), where('mail', '==', usermail));
    const unsubscribe = onSnapshot(
      q,
      querySnapshot => {
        if (querySnapshot.empty) {
          console.log('No se encontraron datos para el usuario.');
        } else {
          querySnapshot.forEach(doc => {
            setIdUser(doc.id);
            setImgP(doc.data().img_profile);
            setUsername(doc.data().username);
          });
        }
      },
      error => {
        console.error('Error al obtener los datos:', error);
      },
    );

    // Opcional: devuelve la función de cancelación para usarla más adelante
    return unsubscribe;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoad(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
  };

  const setModalOpen = () => {
    setVisibleModalPub(true);
  };
  const setVisibleOptionsOn = () => {
    setVisibleOptions(true);
  };
  const loadMorePubs = async () => {
    if (!lastVisible) {
      scrollToTop();
      setRefreshing(true);

      return;
    } // No cargar más si no hay más datos

    try {
      const q = query(
        collection(db, 'publications'),
        startAfter(lastVisible),
        limit(4),
      );

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const updatedProducts = [];
        querySnapshot.forEach(doc => {
          updatedProducts.push({id: doc.id, ...doc.data()});
        });

        // Eliminar duplicados basados en el id
        const newPubs = [...dataPubs, ...updatedProducts];
        const uniquePubs = Array.from(new Set(newPubs.map(pub => pub.id))).map(
          id => {
            return newPubs.find(pub => pub.id === id);
          },
        );

        setPubs(uniquePubs);
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      } else {
        setLastVisible(null);
      }
    } catch (error) {
      console.error('Error al cargar más publicaciones:', error);
    }
  };
  const combineDataWithAds = (pubs) => {
    const dataWithAds = [];
    pubs.forEach((pub, index) => {
        dataWithAds.push(pub);
        // Insertar un anuncio después de cada 3 publicaciones
        if ((index + 1) % 2 === 0) {
            dataWithAds.push({ isAd: true, id: `ad-${index}` }); // Identificador único para el anuncio
        }
    });
    return dataWithAds;
};





const combinedData = combineDataWithAds(dataPubs);
  const bannerRef = useRef(null);
  useForeground(() => {
    Platform.OS === 'ios' && bannerRef.current?.load();
  });
  const renderItem = ({ item }) => {

    console.log(item);


    if (item.isAd) {
        return <CardWithAds key={item.id} />;
    }
    return (
        <CardWithPubs
            key={item.id}
            likes={item.likes}
            commentsqty={item.commnets_qty}
            data={item.data}
            datecreated={item.datecreate}
            img={item.img_perfil}
            id_user={item.id_user}
            id_pub={item.id}
            style={styles.card}
            setVisible={setVisible}
            shareVisible={setShareVisible}
            sendid={getData}
            timeAgo={formatTimeRemaining(item.datecreated)}
            isVisibleOptions = {setVisibleOptionsOn}
        />
    );
};

  const flatListRef = useRef(null);

  const scrollToTop = () => {
    flatListRef.current.scrollToOffset({offset: 0, animated: true});
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
            <Text onPress={scrollToTop} style={styles.titleLeft}>BookPost</Text>
            <TouchableOpacity onPress={goToMainPage}>
              <Image
                source={{
                  uri: imgp
                    ? imgp
                    : 'https://firebasestorage.googleapis.com/v0/b/bookpost-5011d.appspot.com/o/perfilpred.jpg?alt=media&token=3a1941b8-061d-4495-bad7-884f887832a1',
                }}
                style={styles.imgPerfil}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.cardThink}>
            <TouchableOpacity onPress={goToMainPage}>
              <Image
                source={{
                  uri: imgp
                    ? imgp
                    : 'https://firebasestorage.googleapis.com/v0/b/bookpost-5011d.appspot.com/o/perfilpred.jpg?alt=media&token=3a1941b8-061d-4495-bad7-884f887832a1',
                }}
                style={styles.imgPerfil}
              />
            </TouchableOpacity>
            <TextInput
              style={styles.inputThink}
              placeholder="¿Qué piensas?"
              placeholderTextColor="white"
              onPress={setModalOpen}
            />
            <TouchableOpacity style={styles.button} onPress={setModalOpen}>
              <MaterialC
                name="file-image-plus-outline"
                size={35}
                color={'#1f9c0d'}
              />
            </TouchableOpacity>
          </View>

          <FlatList
            style={styles.scrollView}
            data={combinedData}
            keyExtractor={item => item.isAd ? item.id : item.id}
            renderItem={renderItem}
            onEndReached={loadMorePubs}
            onEndReachedThreshold={0.1}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ref={flatListRef}
            showsVerticalScrollIndicator={false}
          />

          {/* <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            <View style={styles.cardThink}>
              <TouchableOpacity onPress={goToMainPage}>
                <Image
                  source={{
                    uri: imgp
                      ? imgp
                      : 'https://firebasestorage.googleapis.com/v0/b/bookpost-5011d.appspot.com/o/perfilpred.jpg?alt=media&token=3a1941b8-061d-4495-bad7-884f887832a1',
                  }}
                  style={styles.imgPerfil}
                />
              </TouchableOpacity>
              <TextInput
                style={styles.inputThink}
                placeholder="¿Qué piensas?"
                placeholderTextColor="white"
                onPress={setModalOpen}
              />
              <TouchableOpacity style={styles.button} onPress={setModalOpen}>
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
                  id_user={item.id_user}
                  id_pub={item.id}
                  style={styles.card}
                  setVisible={setVisible}
                  shareVisible={setShareVisible}
                  sendid={getData}
                />
              ))
            )}
          </ScrollView> */}
          {setVisibleOptions ? (
            <ModalOptionsPub
              visible={isVisibleOptions}
              onClose={() => setVisibleOptions(false)}
              isUser={true}
            />
          ) : null}

          {isVisible ? (
            //id, img_profile, username
            <VerticalPanResponder idpub={dataidpub} onClose={closeModal} />
          ) : (
            ''
          )}
          {visibleModalPub ? (
            <PublicationModal
              onClose={closeModal}
              imgPerfil={imgp}
              user={username}
              id_user={idUser}
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
    backgroundColor: '#353535',
    padding: 10,
    marginTop: height * 0.03,
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
    marginBottom: 0,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
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
