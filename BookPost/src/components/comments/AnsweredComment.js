import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {db} from '../../../config';
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
} from '@firebase/firestore';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
const CommentContent = ({existUser, username, allText, answered_comments}) => {
  if (existUser) {
    return (
      <View style={styles.commentTextContainer}>
        <Text style={styles.commentText}>
          <TouchableOpacity>
            <Text style={styles.username}>{username}</Text>
          </TouchableOpacity>
          {allText}
        </Text>
      </View>
    );
  }
  return <Text style={styles.commentText}>{answered_comments}</Text>;
};
const AnsweredComment = ({date, iddoc, idcomm, idcomment}) => {
  const [answered_comments, setAnsweredComments] = useState('');
  const [user, setDataUser] = useState({});
  const [dates, setDate] = useState({});
  const [loading, setLoading] = useState(true);
  const [existUser, setExistUser] = useState(false);
  const [username, setUsername] = useState('');
  const [allText, setAllText] = useState('');

  const getCommnent = async () => {
    const dataComments = Array.isArray(iddoc) ? iddoc : [iddoc];
    dataComments.forEach(element => {
      const unsub = onSnapshot(doc(db, 'answer_comments', element), docGet => {
        const data = docGet.data();
        setAnsweredComments(data.data);
        setDate(data.date);
        const userRef = doc(db, 'users', data.id_user);
        const get = onSnapshot(userRef, doc => {
          setDataUser(doc.data());
          setLoading(false);
        });
      });
    });
  };

  const getUserIdExist = async text => {
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
      setExistUser(true);
    }
  };

  useEffect(() => {
    getCommnent();
  }, [iddoc]);

  useEffect(() => {
    if (answered_comments) {
      const firstSpaceIndex = answered_comments.indexOf(',');
      if (firstSpaceIndex !== -1) {
        const user = answered_comments.substring(0, firstSpaceIndex);
        const restoTexto = answered_comments.substring(firstSpaceIndex + 1);
        getUserIdExist(user);
        setUsername(user);
        setAllText(restoTexto);
      } else {
        setAllText(answered_comments);
      }
    }
  }, [answered_comments]);

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

  if (loading) {
    return (
      <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
          <SkeletonPlaceholder.Item width={30} height={30} borderRadius={15} />
          <SkeletonPlaceholder.Item marginLeft={10} flex={1}>
            <SkeletonPlaceholder.Item
              style={{backgroundColor: '#4b4a4a'}}
              width="50%"
              height={10}
              borderRadius={5}
            />
            <SkeletonPlaceholder.Item
              style={{backgroundColor: '#4b4a4a'}}
              marginTop={5}
              width="80%"
              height={10}
              borderRadius={5}
            />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
        <SkeletonPlaceholder.Item flexDirection="row" marginTop={10}>
          <SkeletonPlaceholder.Item
            style={{backgroundColor: '#4b4a4a'}}
            width="30%"
            height={10}
            borderRadius={5}
          />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <Image style={styles.imgperfil} source={{uri: user.img_profile}} />
        <View style={styles.comment}>
          <Text style={styles.text}>{user.username}</Text>
          <CommentContent
            existUser={existUser}
            username={username}
            allText={allText}
            answered_comments={answered_comments}
          />
        </View>
      </View>
      <View style={styles.date}>
        <Text style={styles.datetext}>{timeAgo(dates)}</Text>
        <TouchableOpacity onPress={() => idcomm(idcomment, user.username)}>
          <Text style={styles.text}>Responder</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: -10,
  },
  imgperfil: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  comment: {
    flexDirection: 'column',
    marginLeft: 10,
    backgroundColor: '#4b4a4a',
    padding: 12,
    borderRadius: 20,
    maxWidth: '85%',
    overflow: 'hidden', // Ensures text does not overflow
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
  commentTextContainer: {
    flexDirection: 'row',
  },
  username: {
    color: '#15a5cb',
    fontWeight: 'bold',
    marginRight: 0,
    marginBottom:-4
      },
  commentText: {
    color: 'white',
    flexShrink: 1, // Allows text to shrink and wrap inside the container
  },
  date: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    position: 'static',
    left: 65,
  },
  datetext: {
    marginRight: 10,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AnsweredComment;
