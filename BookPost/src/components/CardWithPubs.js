import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialC from 'react-native-vector-icons/MaterialCommunityIcons';
import { collection, query, where, onSnapshot } from '@firebase/firestore';
import { db } from '../../config';
import CommentsComp from './comments/CommentsComp';

const CardWithPubs = ({ img, data, name, id_pub }) => {
    const [comments, setComments] = useState([]);
    const [show, setShow] = useState(false);

    useEffect(() => {
        const commentsQuery = query(
            collection(db, 'comments'),
            where('id_pub', '==', id_pub)
        );

        const unsubscribe = onSnapshot(commentsQuery, (snapshot) => {
            const commentsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setComments(commentsData);
        }, (error) => {
            console.error('Error al obtener los comentarios:', error);
        });

        // Cleanup function to unsubscribe from the listener when the component unmounts
        return () => unsubscribe();
    }, [id_pub]);

    const handleShowComments = () => {
        setShow(!show);
    };

    return (
        <View style={styles.card}>
            <View style={styles.headercard}>
                <Image style={styles.imgPerfil} source={{ uri: img }} />
                <Text style={styles.nameText}>{name}</Text>
                <TouchableOpacity><MaterialC name="dots-vertical" size={25} color={'white'} /></TouchableOpacity>
            </View>
            <View style={styles.data}>
                <Text style={{ color: 'white', fontWeight: '500' }}>{data}</Text>
                <TouchableOpacity style={styles.dataCom} onPress={handleShowComments}>
                    <Text style={styles.commnets}>{comments.length} comentario</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.footercard}>
                <TouchableOpacity style={{ marginRight: 10 }}><MaterialC name="cards-heart-outline" size={25} color={'#e3e3e3'} /></TouchableOpacity>
                <TouchableOpacity style={{ marginRight: 10 }}><MaterialC name="message-outline" size={25} color={'#e3e3e3'} /></TouchableOpacity>
                <TouchableOpacity style={{ marginRight: 10 }}><MaterialC name="share-variant-outline" size={25} color={'#e3e3e3'} /></TouchableOpacity>
            </View>
            <CommentsComp visible={show} onClose={handleShowComments} datacomments={comments} idpub={id_pub}/>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#353535',
        height: 'auto',
        margin: -5,
        width: '100%',
        padding: 10,
    },
    headercard: {
        flexDirection: 'row',
        marginVertical: 0,
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
    },
    footercard: {
        flexDirection: 'row',
        padding: 10,
        marginTop: -20,
        width: '100%',
    },
    dataCom: {
        padding: 10,
        alignItems: 'flex-end',
    },
    data: {
        padding: 10,
    },
    commnets:{
        color:'white'
    }
});

export default CardWithPubs;
