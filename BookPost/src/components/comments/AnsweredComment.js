import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../../../config';
import { collection, doc, onSnapshot, query, where } from '@firebase/firestore';

const AnsweredComment = ({date, iddoc}) => {

    const [answered_comments, setAnsweredCommnets] = useState('');
    const [user,setDataUser] = useState([]);
    const [dates,setDate] = useState([])

    const getCommnent = async () => {
        const dataComments = [];
    
        // Verifica si es un array
        if (Array.isArray(iddoc.comments_answered_id)) {
            dataComments.push(...iddoc.comments_answered_id);
        } else if (iddoc.comments_answered_id) {
            // Si no es un array, pero tiene un valor
            dataComments.push(iddoc.comments_answered_id);
        }
    
        dataComments.forEach(element => {
            const unsub = onSnapshot(doc(db, 'answer_comments', element), docget => {
                setAnsweredCommnets(docget.data().data);
                setDate(docget.data().date)
                const get =onSnapshot(doc(db,'users',docget .data().id_user), doc =>{
                    setDataUser(doc.data());
                })
            });
            
        });
    };
    
    useEffect(() => {
        getCommnent();

    }, [iddoc]);


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
                <Image style={styles.imgperfil} source={{ uri: user.img_profile }} />
                <View style={styles.comment}>
                    <Text style={styles.text}>{user.username}</Text>
                    <Text style={styles.name}>{answered_comments}</Text>
                </View>
            </View>
            <View style={styles.date}>
                <Text style={styles.datetext}>{timeAgo(dates)}</Text>
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
        width: 30,
        height: 30,
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
export default AnsweredComment