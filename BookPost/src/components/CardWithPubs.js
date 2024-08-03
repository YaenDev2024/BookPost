import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import MaterialC from 'react-native-vector-icons/MaterialCommunityIcons';

const CardWithPubs = ({ img, data, likes, commentsqty, datecreated, name }) => {
    return (
        <View style={styles.card}>
            <View style={styles.headercard}>
                <Image style={styles.imgPerfil} source={{ uri: img }} />
                <Text style={styles.nameText}>{name}</Text>
                <TouchableOpacity><MaterialC name="dots-vertical" size={25} color={'black'} /></TouchableOpacity>
            </View>
            <View style={styles.data}>
                <Text style={{ color: 'black', fontWeight: '500' }}>{data}</Text>
                <TouchableOpacity style={styles.dataCom}><Text>{commentsqty} comments</Text></TouchableOpacity>
            </View>
            <View style={styles.footercard}>
                <TouchableOpacity style={{ marginRight: 10 }}><MaterialC name="cards-heart-outline" size={25} color={'black'} /></TouchableOpacity>
                <TouchableOpacity style={{ marginRight: 10 }}><MaterialC name="message-outline" size={25} color={'black'} /></TouchableOpacity>
                <TouchableOpacity style={{ marginRight: 10 }}><MaterialC name="share-variant-outline" size={25} color={'black'} /></TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        height: 'auto',
        borderRadius: 10,
        margin: 10,
        width: '90%',
        padding: 10,
    },
    headercard: {
        flexDirection: 'row',
        marginVertical: 0,
        justifyContent: 'space-between',
        alignItems: 'center', // Alinea verticalmente el contenido
    },
    imgPerfil: {
        height: 40,
        width: 40,
        borderRadius: 20,
        borderColor: 'gray',
        borderWidth: 1,
    },
    nameText: {
        flex: 1,
        marginLeft: 10,
        color: 'black', fontWeight: '500'
    },
    footercard: {
        flexDirection: 'row',
        padding: 10,
        marginTop: -20,
        width: '100%', // Asegúrate de que ocupe todo el ancho
    },
    dataCom: {
        padding: 10,
        alignItems: 'flex-end'
    },
    data: {
        padding: 10,
    }
});

export default CardWithPubs;