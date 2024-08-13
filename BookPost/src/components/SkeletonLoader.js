import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const CommentSkeleton = () => {
  return (
    <SkeletonPlaceholder>
      <View style={styles.container}>
        <View style={styles.avatar} />
        <View style={styles.textContainer}>
          <View style={styles.name} />
          <View style={styles.comment} />
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  textContainer: {
    marginLeft: 10,
    flex: 1,
  },
  name: {
    width: '50%',
    height: 10,
    borderRadius: 5,
  },
  comment: {
    marginTop: 5,
    width: '80%',
    height: 10,
    borderRadius: 5,
  },
});

export default CommentSkeleton;
