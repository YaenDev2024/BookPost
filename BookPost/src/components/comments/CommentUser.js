import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AnsweredComment from './AnsweredComment';
import { doc, onSnapshot } from '@firebase/firestore';
import { db } from '../../../config'; 
import CommentSkeleton from '../SkeletonLoader';

const CommentUser = ({ user, data, img, date, iddoc, sendIdcomment }) => {
  const [haveAnswerCommnets, sethaveAnsweredComments] = useState(false);
  const [dataIdComment, setDataIdComment] = useState([]);
  const [loading, setLoading] = useState(true); 
  
  const checkCommnets = async () => {
    const unsub = onSnapshot(doc(db, 'comments', iddoc), doc => {
     
      const commentsAnsweredId = doc.data().comments_answered_id;

      if (commentsAnsweredId && Array.isArray(commentsAnsweredId)) {
        sethaveAnsweredComments(commentsAnsweredId.length > 0);
        setDataIdComment(commentsAnsweredId); 
      } else {
        sethaveAnsweredComments(false);
        setDataIdComment([]); 
      }

      setLoading(false); 
    });
  };

  useEffect(() => {
    checkCommnets();
    
  }, []);

  function timeAgo(firebaseTimestamp) {
    if (!firebaseTimestamp || !firebaseTimestamp.seconds) {
      return 'Fecha no válida'; 
    }

    const date = new Date(
      firebaseTimestamp.seconds * 1000 +
        firebaseTimestamp.nanoseconds / 1000000,
    );
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
      {loading ? ( 
        <CommentSkeleton />
      ) : (
        <>
          <View style={styles.container}>
            <Image style={styles.imgperfil} source={{ uri: img }} />
            <View style={styles.comment}>
              <Text style={styles.text}>{user}</Text>
              <Text style={styles.name}>{data}</Text>
            </View>
          </View>
          <View style={styles.date}>
          <Text style={styles.datetext}>{date ? timeAgo(date) : 'Fecha no válida'}</Text>
            <TouchableOpacity onPress={() => sendIdcomment(iddoc, user)}>
              <Text style={styles.text}>Responder</Text>
            </TouchableOpacity>
          </View>
          {haveAnswerCommnets &&
            Array.isArray(dataIdComment) &&
            dataIdComment
              .filter(item => item !== undefined)
              .map((item, index) => (
                <View key={index} style={styles.containeranswered}>
                  <AnsweredComment date={date} iddoc={item} idcomm={sendIdcomment} idcomment ={iddoc}/>
                </View>
              ))}
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
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
    maxWidth: '90%',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
  name: {
    color: 'white',
  },
  date: {
    flexDirection: 'row',
    position: 'static',
    left: 63,
    marginBottom: 10,
  },
  datetext: {
    marginRight: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  containeranswered: {
    paddingLeft: 70,
    marginBottom: 10,
    marginTop: 10,
  },
});

export default CommentUser;
