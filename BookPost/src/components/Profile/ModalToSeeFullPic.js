import React from 'react';
import {Image, Modal, StyleSheet, View, TouchableOpacity} from 'react-native';
import {Text} from 'react-native-animatable';
import Icon from 'react-native-vector-icons/Ionicons'; // Para un ícono de cierre

export const ModalToSeeFullPic = ({onClose, uri, username}) => {
  return (
    <Modal style={styles.containermodal} animationType="fade" onRequestClose={onClose} transparent>
      <View style={styles.container}>
        <Image
          style={styles.img}
          source={{
            uri: uri,
          }}
          resizeMode="contain" 
        />
        {!username && <Text style={styles.username}>Siempre se feliz.</Text>}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  containermodal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)', 
  },
  img: {
    width: '100%',
    height: '80%', 
    marginBottom: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1, 
  },
  username: {
    color: '#fff',
    fontSize: 18,
    position: 'absolute',
    bottom: 40, // Espacio para que no esté pegado al borde
    textAlign: 'center',
  },
});

