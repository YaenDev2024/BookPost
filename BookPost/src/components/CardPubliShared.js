import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ActivityIndicator, // Importar ActivityIndicator
} from 'react-native';
import {doc, onSnapshot} from '@firebase/firestore';
import {db} from '../../config';
import {useAuth} from '../hooks/Autentication';

const CardPubliShared = ({img, id_pub}) => {
  const [data, setPubs] = useState([]);
  const [imgperfil, setImgPerfil] = useState('');
  const {user} = useAuth();
  const [loading, setLoading] = useState(true); // Nuevo estado de carga
  const [name, setName] = useState('');
  useEffect(() => {
    if (id_pub) {
      console.log('ID Publicación:', id_pub);
      const docRef = doc(db, 'shared_publication', id_pub);
      const unsubscribe = onSnapshot(
        docRef,
        snapshot => {
          if (snapshot.exists()) {
            console.log('Snapshot exists for shared_publication');
            const docData = snapshot.data();
            console.log('Document Data:', docData);
            const docRef = doc(db, 'publications', docData.id_pub);
            const unsubscribe = onSnapshot(
              docRef,
              snapshot => {
                if (snapshot.exists()) {
                  const pubData = snapshot.data();
                  console.log('Datos obtenidos:', pubData.data);
                  setName(pubData.name);
                  setPubs(pubData.data);
                  setLoading(false); // Desactivar carga cuando los datos son obtenidos
                } else {
                  console.log('No snapshot found for publications');
                  setLoading(false);
                }
              },
              error => {
                console.error(
                  'Error al obtener el documento de publications:',
                  error,
                );
                setLoading(false); // Desactivar carga en caso de error
              },
            );
          } else {
            console.log('No snapshot found for shared_publication');
            setLoading(false);
          }
        },
        error => {
          console.error(
            'Error al obtener el documento de shared_publication:',
            error,
          );
          setLoading(false); // Desactivar carga en caso de error
        },
      );
      return () => unsubscribe();
    }
  }, [id_pub]);

  if (loading) {
    console.log('Still loading...');
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.headercard}>
        <TouchableOpacity style={styles.nameText}>
          <Image style={styles.imgPerfil} source={{uri: img}} />

          <Text style={{color: 'white', fontWeight: 'bold', marginLeft:10}}>{name}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.data}>
        {Array.isArray(data) && data.length > 0 ? (
          <>
            <Text style={styles.text}>{data[1]?.text}</Text>
            <View style={styles.imageContainer}>
              {data[0]?.img.length === 1 ? (
                <Image
                  source={{uri: data[0]?.img[0]}}
                  style={styles.singleImage}
                  resizeMode="cover"
                />
              ) : (
                data[0]?.img.map((item, index) => (
                  <Image
                    key={index}
                    source={{uri: item}}
                    style={[
                      styles.multiImage,
                      {marginRight: (index + 1) % 2 === 0 ? 0 : 5},
                    ]}
                    resizeMode="cover"
                  />
                ))
              )}
            </View>
          </>
        ) : (
          <Text style={styles.text}>No data available</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderColor: 'gray',
    borderWidth: 1,
    backgroundColor: '#353535',
    margin: -5,
    width: '100%',
    padding: 10,
    marginBottom: 15,
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
    flexDirection:'row',
    alignItems:'center'
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
    height: 250,
    borderRadius: 10,
  },
  multiImage: {
    width: '48%',
    height: 150,
    borderRadius: 10,
    marginBottom: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 10,
  },
});

export default CardPubliShared;
