import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const CommentUser = ({ user, data, img, date }) => {
    //console.log(date); // Añadir un log para ver el formato del date

    function timeAgo(firebaseTimestamp) {
        if (!firebaseTimestamp || !firebaseTimestamp.seconds) {
            return 'Fecha no válida'; // manejo de errores básico
        }

        const date = new Date(firebaseTimestamp.seconds * 1000 + firebaseTimestamp.nanoseconds / 1000000);
        const now = new Date();

        const diffInMs = now - date;
        const diffInMinutes = Math.floor(diffInMs / 60000);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInMinutes < 1) {
            return 'Hace un momento';
        } else if (diffInMinutes === 1) {
            return '1 minuto';
        } else if (diffInMinutes < 60) {
            return `${diffInMinutes} minutos`;
        } else if (diffInHours === 1) {
            return '1 h';
        } else if (diffInHours < 24) {
            return `${diffInHours} h`;
        } else if (diffInDays === 1) {
            return '1 d';
        } else {
            return `${diffInDays} d`;
        }
    }

    return (
        <>
            <View style={styles.container}>
                <Image style={styles.imgperfil} source={{ uri: img }} />
                <View style={styles.comment}>
                    <Text style={styles.text}>{user}</Text>
                    <Text style={styles.name}>{data}</Text>
                </View>
            </View>
            <View style={styles.date}>
                <Text style={styles.datetext}>{timeAgo(date)}</Text>
                <TouchableOpacity>
                    <Text style={styles.text}>Responder</Text>
                </TouchableOpacity>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row'
    },
    imgperfil: {
        width: 40,
        height: 40,
        borderRadius: 25,
    },
    comment: {
        flexDirection: 'column',
        marginLeft: 5,
        backgroundColor: '#4b4a4a',
        padding: 12,
        borderRadius: 20,
        maxWidth:'90%'
    },
    text: {
        color: 'white',
        fontWeight: "bold"
    },
    name: {
        color: 'white',
    },
    date: {
        flexDirection: 'row',
        position: 'static',
        left: 63
    }, datetext: {
        marginRight: 10,
        color: 'white',
        fontWeight: "bold"

    }
})

export default CommentUser;
