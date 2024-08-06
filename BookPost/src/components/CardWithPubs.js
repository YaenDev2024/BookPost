import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MaterialC from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
} from '@firebase/firestore';
import {db} from '../../config';
import CommentsComp from './comments/CommentsComp';
import {useAuth} from '../hooks/Autentication';

const CardWithPubs = ({img, data, name, id_pub}) => {
  const [comments, setComments] = useState([]);
  const [show, setShow] = useState(false);
  const [isLiked, setLiked] = useState(false);
  const {user} = useAuth();
  const [userid, setUserID] = useState('');

  useEffect(() => {
    const commentsQuery = query(
      collection(db, 'comments'),
      where('id_pub', '==', id_pub),
    );

    const unsubscribe = onSnapshot(
      commentsQuery,
      snapshot => {
        const commentsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setComments(commentsData);
      },
      error => {
        console.error('Error al obtener los comentarios:', error);
      },
    );

    return () => unsubscribe();
  }, [id_pub]);

  useEffect(() => {
    getid();
  }, []);

  const getid = async () => {
    const userSearch = query(
      collection(db, 'users'),
      where('mail', '==', user.email),
    );
    const userSnapshot = await getDocs(userSearch);
    const userData = userSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setUserID(userData[0]?.id);
  };

  useEffect(() => {
    const likeQuery = query(
      collection(db, 'likes_by_users'),
      where('id_publication', '==', id_pub),
      where('id_user', '==', userid),
    );

    const unsubscribe = onSnapshot(
      likeQuery,
      snapshot => {
        const likesdata = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLiked(likesdata.length > 0);
      },
      error => {
        console.error('Error al obtener los likes:', error);
      },
    );

    return () => unsubscribe();
  }, [id_pub, userid]);

  const handleShowComments = () => {
    setShow(!show);
  };

  const saveLike = async () => {
    const userSearch = query(
      collection(db, 'users'),
      where('mail', '==', user.email),
    );
    const userSnapshot = await getDocs(userSearch);
    const userData = userSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (userData.length > 0) {
      const iduser = userData[0].id;

      const likeQuery = query(
        collection(db, 'likes_by_users'),
        where('id_publication', '==', id_pub),
        where('id_user', '==', iduser),
      );

      const likeSnapshot = await getDocs(likeQuery);

      if (likeSnapshot.empty) {
        const likedata = {
          id_publication: id_pub,
          id_user: iduser,
        };

        const likeDocRef = doc(collection(db, 'likes_by_users'));

        try {
          await setDoc(likeDocRef, likedata);
          setLiked(true);
        } catch (error) {
          console.error('Error al guardar el like:', error);
        }
      } else {
       
        const likeDocId = likeSnapshot.docs[0].id;
        try {
          await deleteDoc(doc(db, 'likes_by_users', likeDocId));
          setLiked(false);
        } catch (error) {
          console.error('Error al eliminar el like:', error);
        }
      }
    } else {
      console.error('No se encontraron datos del usuario.');
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.headercard}>
        <Image style={styles.imgPerfil} source={{uri: img}} />
        <Text style={styles.nameText}>{name}</Text>
        <TouchableOpacity>
          <MaterialC name="dots-vertical" size={25} color={'white'} />
        </TouchableOpacity>
      </View>
      <View style={styles.data}>
        <Text style={{color: 'white', fontWeight: '500'}}>{data}</Text>
        <TouchableOpacity style={styles.dataCom} onPress={handleShowComments}>
          <Text style={styles.commnets}>{comments.length} comentario</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footercard}>
        {!isLiked ? (
          <TouchableOpacity style={{marginRight: 10}} onPress={saveLike}>
            <MaterialC name="cards-heart-outline" size={25} color={'#e3e3e3'} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={{marginRight: 10}} onPress={saveLike}>
            <MaterialC name="cards-heart" size={25} color={'red'} />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={{marginRight: 10}}>
          <MaterialC name="message-outline" size={25} color={'#e3e3e3'} />
        </TouchableOpacity>
        <TouchableOpacity style={{marginRight: 10}}>
          <MaterialC name="share-variant-outline" size={25} color={'#e3e3e3'} />
        </TouchableOpacity>
      </View>
      <CommentsComp
        visible={show}
        onClose={handleShowComments}
        datacomments={comments}
        idpub={id_pub}
      />
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
  commnets: {
    color: 'white',
  },
});

export default CardWithPubs;
