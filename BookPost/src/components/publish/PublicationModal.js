import React from 'react'
import { Modal, Text, View } from 'react-native'

const PublicationModal = ({visible, onClose}) => {
  return (
    <Modal 
    animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>

    <View>
        <Text>
            Hola
        </Text>
    </View>
    </Modal>
  )
}

export default PublicationModal