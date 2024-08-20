import {collection, onSnapshot, query, where} from '@firebase/firestore';
import React, {useEffect, useState} from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {db} from '../../../config';
import MaterialC from 'react-native-vector-icons/MaterialCommunityIcons';

const MainPageUser = ({route, navigation}) => {
  const {imgPerfil, username, idUser} = route.params;
  const [imgPort, setImgPort] = useState('');
  const [informationUser, setInformationUser] = useState('');
  const [followers, setFollowers] = useState(0);
  const [followed, setFollowed] = useState(0);
  const [isUserPerfil, setUserPerfil] = useState(true);
  const [isFollowed, setIsFollowed] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, 'perfil_information'),
      where('id_user', '==', idUser),
    );
    const unsub = onSnapshot(q, querySnapshot => {
      querySnapshot.forEach(doc => {
        setInformationUser(doc.data().information);
        setImgPort(doc.data().imgPortada);
        setFollowers(doc.data().followers);
        setFollowed(doc.data().followed);
      });
    });
    return () => unsub();
  }, []);

  useEffect(() => {}, []);

  return (
    <View style={styles.MainContainer}>
      <StatusBar
        translucent
        backgroundColor={'#353535'}
        barStyle="light-content"
      />
      <View style={styles.headerMainPagePerfil}>
        <Text style={styles.headerMainPageText}>Perfil</Text>
        <TouchableOpacity>
          <MaterialC name="account-cog-outline" size={35} color={'#fff'} />
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={styles.photoContainerUser}>
          <Image
            source={{
              uri: imgPerfil,
            }}
            style={styles.ImgPerfil}
          />

          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                backgroundColor: '#e46b2f',
                position: 'static',
                right: 150,
                width: 100,
              }}></View>
            <Image
              source={{
                uri: imgPort,
              }}
              style={styles.portadaImg}
            />
          </View>
        </View>

        <View style={styles.MainNameUserContainer}>
          <View>
            <Text style={styles.MainNameUserText}>{username}</Text>
          </View>

          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text>Seguidores</Text>
            <Text>{followers}</Text>
          </View>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text>Siguiendo</Text>
            <Text>{followed}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={
            isFollowed
              ? isUserPerfil
                ? styles.btnUserOwner
                : styles.btnFollow
              : isUserPerfil
              ? styles.btnUserOwner
              : styles.btnUnFollow
          }>
          {/* <MaterialC name="account-plus" size={35} color={'#fff'} /> */}
          {isFollowed ? (
            isUserPerfil ? (
              <Text>Editar Perfil</Text>
            ) : (
              <Text>Dejar de seguir</Text>
            )
          ) : isUserPerfil ? (
            <Text>Editar Perfil</Text>
          ) : (
            <Text>Seguir</Text>
          )}
        </TouchableOpacity>
        <View style={styles.MainInformationContainer}>
          <Text style={styles.MainInformationText}>Informacion</Text>
        </View>
        <View style={styles.MainInformationBio}>
          <Text style={styles.MainInformationBioText}>{informationUser}</Text>
        </View>

        <View style={styles.MainPublicationsContainer}>
          <Text style={styles.MainPublicationsText}>Publicaciones</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  MainContainer: {
    backgroundColor: '#272727',
    flex: 1,
    width: '100%',
    paddingTop: StatusBar.currentHeight,
  },
  headerMainPagePerfil: {
    backgroundColor: '#353535',
    padding: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerMainPageText: {
    fontSize: 30,
    color: 'white',
  },
  photoContainerUser: {
    flexDirection: 'row',
    backgroundColor: '#353535',
    marginTop: 3,
  },
  ImgPerfil: {
    width: 150,
    height: 150,
    borderRadius: 100,
    position: 'static',
    top: 80,
    left: 30,
    zIndex: 999999,
    borderColor: 'white',
    borderWidth: 5,
  },
  portadaImg: {
    width: 310,
    height: 300,
    zIndex: -1000,
    position: 'static',
    right: 150,
  },
  MainNameUserContainer: {
    backgroundColor: '#353535',
    padding: 10,
    marginTop: 4,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  MainNameUserText: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
    padding: 20,
  },
  MainInformationContainer: {
    backgroundColor: '#353535',
    padding: 10,
    marginTop: 4,
    alignItems: 'center',
  },
  MainInformationText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  MainInformationBio: {
    backgroundColor: '#353535',
    padding: 10,
    marginTop: 4,
    alignItems: 'center',
  },
  MainInformationBioText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  MainPublicationsContainer: {
    backgroundColor: '#353535',
    padding: 10,
    marginTop: 4,
    alignItems: 'flex-start',
  },
  MainPublicationsText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    padding: 20,
  },
  btnFollow: {
    backgroundColor: '#15a5cb',
    width: 200,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    alignSelf: 'center',
  },
  btnUnFollow: {
    backgroundColor: 'red',
    width: 200,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    alignSelf: 'center',
  },
  btnUserOwner: {
    backgroundColor: '#5e6d71',
    width: 200,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    alignSelf: 'center',
  },
});

export default MainPageUser;
