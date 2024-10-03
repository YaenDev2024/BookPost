import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Platform,
  Text,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  useForeground,
} from 'react-native-google-mobile-ads';
import MaterialC from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');
const BANNER_WIDTH = width - 20; // Ajusta según el diseño

const CardWithAds = ({ ids }) => {
  const adUnitId = !__DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-3477493054350988/4075718325W';
  const bannerRef = useRef(null);

  const [loaded, setLoaded] = useState(false);
  const [adLoaded, setAdLoaded] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current; 

  useForeground(() => {
    Platform.OS === 'ios' && bannerRef.current?.load();
  });

  useEffect(() => {
    if (!adLoaded) {
     
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    } else {
      // Resetea la opacidad a 0 cuando adLoaded es true
      fadeAnim.setValue(0);
    }
  }, [adLoaded, fadeAnim]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
      setTimeout(() => {
        setAdLoaded(false);
      }, 1000);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {adLoaded ? (
          <View style={styles.withoutads}>
            <Text style={{color:'white'}}>
              Cargando publicidad una vez cargada se te recompensara por verla
            </Text>
            {loaded ? (
              <MaterialC
                name="check-circle"
                size={50}
                style={{ alignSelf: 'center', color: 'green' }}
              />
            ) : (
              <ActivityIndicator size={50} />
            )}
          </View>
        ) : (
          <Animated.View style={[styles.adContainer, { opacity: fadeAnim }]}>
            <Text>Publicidad pagada: $0.01</Text>
            <BannerAd
              ref={bannerRef}
              unitId={adUnitId}
              size={BannerAdSize.MEDIUM_RECTANGLE}
              key={ids}
            />
          </Animated.View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#353535',
    overflow: 'hidden',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    marginTop: -5,
    marginBottom: 10,
    flexDirection: 'row',
    height:400
  },
  withoutads: {
    padding: 50,
    flexDirection: 'column',
  },
  adContainer: {
    width: BANNER_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CardWithAds;
