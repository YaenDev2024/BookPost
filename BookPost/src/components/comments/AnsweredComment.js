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

const AnsweredComment = ({date, iddoc, idcomm, idcomment}) => {
  const [answered_comments, setAnsweredCommnets] = useState('');
  const [user, setDataUser] = useState([]);
  const [dates, setDate] = useState([]);
  const [loading, setLoading] = useState(true); // Estado para manejar la carga
  const [existUser, setExistUser] = useState(false);
  const [username, serUsername] = useState('');
  const [alltext, setAllText] = useState('');
  const getCommnent = async () => {
    const dataComments = [];

    if (Array.isArray(iddoc)) {
      dataComments.push(...iddoc);
    } else if (iddoc) {
      dataComments.push(iddoc);
    }

    dataComments.forEach(element => {
      const unsub = onSnapshot(doc(db, 'answer_comments', element), docget => {
        setAnsweredCommnets(docget.data().data);
        setDate(docget.data().date);
        const get = onSnapshot(doc(db, 'users', docget.data().id_user), doc => {
          setDataUser(doc.data());
          setLoading(false);
        });
      });
    });
  };

  const getuseridexist = async text => {
    const userw = query(collection(db, 'users'), where('username', '==', text));
    const commentsSnapshot = await getDocs(userw);
    const userdata = commentsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    if (userdata.length > 0) {
      setExistUser(true);
    }
  };

  useEffect(() => {
    getCommnent();
  }, [iddoc]);

  useEffect(() => {
    if (answered_comments) {
      const firstSpaceIndex = answered_comments.indexOf(' ');
      if (firstSpaceIndex !== -1) {
        const user = answered_comments.substring(0, firstSpaceIndex);
        const restoTexto = answered_comments.substring(firstSpaceIndex + 1);
        getuseridexist(user);
        serUsername(user);
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
          <SkeletonPlaceholder.Item width={30} height={30} borderRadius={25} />
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
          <Text style={styles.name}>
            {existUser ? (
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity>
                  <Text style={{color: '#58f4fe'}}>{username + ''}</Text>
                </TouchableOpacity>
                <Text style={styles.name}>{alltext}</Text>
              </View>
            ) : (
              answered_comments
            )}
          </Text>
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
    marginTop: -15,
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
  },
  datetext: {
    marginRight: 10,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AnsweredComment;
