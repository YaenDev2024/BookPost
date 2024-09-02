import React, {useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Platform,
  Text,
  ActivityIndicatorBase,
  ActivityIndicator,
} from 'react-native';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  useForeground,
} from 'react-native-google-mobile-ads';
import MaterialC from 'react-native-vector-icons/MaterialCommunityIcons';

const CardWithAds = ({ids}) => {
  const adUnitId = !__DEV__
    ? TestIds.BANNER
    : 'ca-app-pub-3477493054350988/4075718325';
  const bannerRef = useRef(null);

  const [loaded, setLoaded] = useState(false);
  const [adLoaded, setAdLoaded] = useState(true);
  useForeground(() => {
    Platform.OS === 'ios' && bannerRef.current?.load();
  });

  setTimeout(() => {
    setLoaded(true)
    setTimeout(() => {
      setAdLoaded(false)
    }, 1000);
  }, 1000);
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {adLoaded ? (
          <View style={styles.withoutads}>
            <Text>
              Cargando publicidad una vez cargada se te recompensara por verla
            </Text>
            {loaded ? (
              <MaterialC 
              name='check-circle' size={50} style={{alignSelf:'center', color:'green'}}/>
            ) : (
              <ActivityIndicator size={50} />
            )}
          </View>
        ) : (
          <BannerAd
            ref={bannerRef}
            unitId={adUnitId}
            size={BannerAdSize.INLINE_ADAPTIVE_BANNER} 
            key={ids}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 15,
  },
  card: {
    backgroundColor: '#353535',
    overflow: 'hidden',
    width: '100%', // Ajustar al 90% del ancho de la pantalla
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    elevation: 4, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    marginTop: -25,
    marginBottom: -5,
    flexDirection: 'row',
  },
  withoutads: {
    padding: 50,
    flexDirection: 'column',
  },
});

export default CardWithAds;
