import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { doc, onSnapshot } from '@firebase/firestore';
import { db } from '../../config';
import { useAuth } from '../hooks/Autentication';
import {
  GestureDetector,
  GestureHandlerRootView,
  Gesture,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  clamp,
} from 'react-native-reanimated';

const CardPubliShared = ({ img, id_pub }) => {
  const [data, setPubs] = useState([]);
  const [imgperfil, setImgPerfil] = useState('');
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const { width, height } = Dimensions.get('screen');

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
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    console.log(id_pub)
    if (id_pub) {
      const docRef = doc(db, 'shared_publication', id_pub);
      const unsubscribe = onSnapshot(
        docRef,
        snapshot => {
          if (snapshot.exists()) {
            const docData = snapshot.data();
            const pubRef = doc(db, 'publications', docData.id_pub);
            const unsubscribePub = onSnapshot(
              pubRef,
              snapshot => {
                if (snapshot.exists()) {
                  const pubData = snapshot.data();
                  const getNameRef = doc(db, 'users',pubData.id_user);
                  const getName = onSnapshot(getNameRef, doc=>{
                    setName(doc.data().username);
                    setImgPerfil(doc.data().img_profile)
                  }
                  )
                  setPubs(pubData.data);
                  setLoading(false);
                } else {
                  setLoading(false);
                }
              },
              error => {
                console.error('Error al obtener el documento de publications:', error);
                setLoading(false);
              },
            );
            return () => unsubscribePub();
          } else {
            setLoading(false);
          }
        },
        error => {
          console.error('Error al obtener el documento de shared_publication:', error);
          setLoading(false);
        },
      );
      return () => unsubscribe();
    }
  }, [id_pub]);

  if (loading) {
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
          <Image style={styles.imgPerfil} source={{ uri: imgperfil ? imgperfil : 'https://firebasestorage.googleapis.com/v0/b/bookpost-5011d.appspot.com/o/perfilpred.jpg?alt=media&token=3a1941b8-061d-4495-bad7-884f887832a1' }} />
          <Text style={{ color: 'white', fontWeight: 'bold', marginLeft: 10 }}>{name}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.data}>
        {Array.isArray(data) && data.length > 0 ? (
          <>
            <Text style={styles.text}>{data[1]?.text}</Text>
            <View style={styles.imageContainer}>
              {data[0]?.img.length === 1 ? (
                <GestureHandlerRootView style={styles.container}>
                  <GestureDetector gesture={pinch}>
                    <Animated.View style={[styles.singleImage, boxAnimatedStyles]}>
                      <Image
                        source={{ uri: data[0]?.img[0] ? data[0]?.img[0] : 'https://firebasestorage.googleapis.com/v0/b/bookpost-5011d.appspot.com/o/perfilpred.jpg?alt=media&token=3a1941b8-061d-4495-bad7-884f887832a1' }}
                        style={styles.singleImage}
                        resizeMode="cover"
                      />
                    </Animated.View>
                  </GestureDetector>
                </GestureHandlerRootView>
              ) : (
                data[0]?.img.map((item, index) => (
                  <GestureHandlerRootView style={styles.container} key={index}>
                    <GestureDetector gesture={pinch}>
                      <Animated.View style={[styles.multiImage, boxAnimatedStyles]}>
                        <Image
                          source={{ uri: item ? item : 'https://firebasestorage.googleapis.com/v0/b/bookpost-5011d.appspot.com/o/perfilpred.jpg?alt=media&token=3a1941b8-061d-4495-bad7-884f887832a1' }}
                          style={[
                            styles.multiImage,
                            { marginRight: (index + 1) % 2 === 0 ? 0 : 5 },
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
    flexDirection: 'row',
    alignItems: 'center',
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
