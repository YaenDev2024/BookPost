import React, {useEffect, useState} from 'react';
import {Alert, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import AnsweredComment from './AnsweredComment';
import {collection, doc, getDocs, onSnapshot, query, where} from '@firebase/firestore';
import {db} from '../../../config';
import CommentSkeleton from '../SkeletonLoader';
import { useNavigation } from '@react-navigation/native';

const CommentUser = ({user, data, img, date, iddoc, sendIdcomment, onClose}) => {
  const [haveAnswerCommnets, sethaveAnsweredComments] = useState(false);
  const [dataIdComment, setDataIdComment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadMoreComments, setloadMoreComments] = useState(false);
  const [commentsAnsweredId, setCommentsAnsweredId] = useState([]);
  const [dataUser, setDataUser] = useState([]);
  const navigation = useNavigation();
  const checkCommnets = async () => {
    const unsub = onSnapshot(doc(db, 'comments', iddoc), doc => {
      const commentsAnsweredId = doc.data().comments_answered_id;

      if (commentsAnsweredId && Array.isArray(commentsAnsweredId)) {
        sethaveAnsweredComments(commentsAnsweredId.length > 0);
        setCommentsAnsweredId(commentsAnsweredId);
        if (commentsAnsweredId.length === 1) {
          setloadMoreComments(true);
        }
        if (commentsAnsweredId.length === 0) {
          setloadMoreComments(true);
        }
        // Check if there are new comments that are not yet loaded
        const newComments = commentsAnsweredId.slice(dataIdComment.length);
        if (newComments.length > 0) {
          setDataIdComment(prevData => [...prevData, ...newComments]);
        }
      } else {
        sethaveAnsweredComments(false);
        setCommentsAnsweredId([]);
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
  const loadMore = () => {
    // Load all remaining comments at once
    const nextComments = commentsAnsweredId.slice(dataIdComment.length);
    if (nextComments.length > 0) {
      setDataIdComment(prevData => [...prevData, ...nextComments]);
      setloadMoreComments(true); // Disable the "load more" button
    } else {
      setloadMoreComments(true); // Disable the "load more" button if no comments left
    }
  };

  const goToPerfilUser = async text => {

      const userQuery = query(
        collection(db, 'users'),
        where('username', '==', text),
      );
      const commentsSnapshot = await getDocs(userQuery);
      const userData = commentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      if (userData.length > 0) {
        // setDataUser(userData[0].id);
        onClose();
        navigation.navigate('MainPageUser',{
          imgPerfil: img,
          username: text,
          idUser: userData[0].id,
        })

      }else{
        Alert.alert('El usuario no existe')
      }
    
  };

  return (
    <>
      {loading ? (
        <CommentSkeleton />
      ) : (
        <>
          <View style={styles.container}>
            <TouchableOpacity onPress={() => goToPerfilUser(user)}>
              <Image style={styles.imgperfil} source={{uri: img ? img : 'https://firebasestorage.googleapis.com/v0/b/bookpost-5011d.appspot.com/o/perfilpred.jpg?alt=media&token=3a1941b8-061d-4495-bad7-884f887832a1'}} />
            </TouchableOpacity>
            <View style={styles.comment}>
              <TouchableOpacity onPress={() => goToPerfilUser(user)}>
                <Text style={styles.text}>{user}</Text>
              </TouchableOpacity>
              <Text style={styles.name}>{data}</Text>
            </View>
          </View>
          <View style={styles.date}>
            <Text style={styles.datetext}>
              {date ? timeAgo(date) : 'Fecha no válida'}
            </Text>
            <TouchableOpacity onPress={() => sendIdcomment(iddoc, user)}>
              <Text style={styles.text}>Responder</Text>
            </TouchableOpacity>
          </View>
          {haveAnswerCommnets &&
          Array.isArray(dataIdComment) &&
          loadMoreComments
            ? dataIdComment
                .filter(item => item !== undefined)
                .map((item, index) => (
                  <View key={index} style={styles.containeranswered}>
                    <AnsweredComment
                      date={date}
                      iddoc={item}
                      idcomm={sendIdcomment}
                      idcomment={iddoc}
                      onClose={onClose}
                    />
                  </View>
                ))
            : null}
          {!loadMoreComments && (
            <TouchableOpacity onPress={loadMore}>
              <Text style={{alignSelf: 'center', marginBottom: 5}}>
                Ver mas comentarios
              </Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
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
