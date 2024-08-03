import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import img from '../../assets/2.png';
import { auth, db } from '../../config';
import { collection, getDocs, onSnapshot, query, where } from '@firebase/firestore';
import { useAuth } from '../hooks/Autentication';
import LoadingScreen from '../hooks/LoadingScreen';
import CardWithoutPubs from '../components/CardWithoutPubs';
import CardWithPubs from '../components/CardWithPubs';
import MaterialC from 'react-native-vector-icons/MaterialCommunityIcons';


const HomeScreen = () => {
  const [dataPubs, setPubs] = useState([]);
  const [usermail, setMail] = useState('');
  const [imgp, setImgP] = useState('');
  const [load, setLoad] = useState(true)
  const [refreshing, setRefreshing] = useState(false);


  const [existPub, setExistPub] = useState(false);

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (err) {
      console.log('Error al cerrar sesión: ', err.message);
    }
  };

  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, 'publications'));
        const unsuscribe = onSnapshot(q, (querySnapshot) => {
          const updatedProducts = [];
          querySnapshot.forEach((doc) => {
            updatedProducts.push({ id: doc.id, ...doc.data() });
          });
          setPubs(updatedProducts);
        });
        return unsuscribe;
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchData();

    if (dataPubs.length > 1) {
      setExistPub
    }
    console.log(dataPubs)
  }, [refreshing]);

  useEffect(() => {
    if (user) {
      setMail(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (usermail) {
      setdataofuser();
    }
  }, [usermail]);

  const setdataofuser = async () => {
    const q = query(
      collection(db, 'users'),
      where('mail', '==', usermail)
    );

    try {
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log('No se encontraron datos para el usuario.');
      } else {
        querySnapshot.forEach((doc) => {
          setImgP(doc.data().img_profile);
        });
      }
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };


  setTimeout(() => {
    setLoad(false)
  }, 1500);
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000); // Simula el tiempo de carga
  };

  return (
    <ScrollView contentContainerStyle={styles.maincontainer} refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }>
      <StatusBar
        translucent
        backgroundColor={'transparent'}
        barStyle="light-content"
      />
      {load ? <LoadingScreen /> : <>
        <View style={styles.headerContainer}>
          <Text style={styles.titleLeft}>BookPost</Text>
          <TouchableOpacity onPress={handleLogout}>
            <Image source={{ uri: imgp }} style={styles.imgPerfil} />
          </TouchableOpacity>
        </View>
        <View style={styles.cardThink}>
          <Image source={{ uri: imgp }} style={styles.imgPerfil} />
          <TextInput style={styles.inputThink} placeholder="¿Qué piensas?" placeholderTextColor="gray" />
          <TouchableOpacity style={styles.button}><MaterialC name="file-image-plus-outline" size={35} color={'black'} />
          </TouchableOpacity>
        </View>

        {existPub ?
          <CardWithoutPubs /> : <>
            {dataPubs.map((item, index) => (
              <CardWithPubs key={index} likes={item.likes} commentsqty={item.commnets_qty} data={item.data} datecreated={item.datecreate} img={item.img_perfil} name={item.name} />
            ))}
          </>
        }
      </>
      }
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  maincontainer: {
    backgroundColor: 'black',
    alignItems: 'center',
    flexGrow: 1,
    paddingBottom: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: '100%',
    paddingHorizontal: 30,
    marginTop: 50,
  },
  titleLeft: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
    position: 'relative',
    top: -10
  },
  titleRight: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  },
  cardThink: {
    backgroundColor: 'white',
    height: 56,
    borderRadius: 10,
    margin: 10,
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
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
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 10,
    height: 40,
    color: 'black',
  },
  button: {
    padding: 5,
  },
  buttonImage: {
    height: 40,
    width: 40,
  }
});

export default HomeScreen;
