import React from 'react'

const CardWithAds = () => {
    return (
        <View style={styles.card}>
          <Text>No hay publicaciones para mostrar</Text>
        </View>
      );
    };
    
    const styles = StyleSheet.create({
      card: {
        backgroundColor: '#353535',
        height: 56,
        borderRadius: 10,
        margin: 10,
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
      },
    });

export default CardWithAds