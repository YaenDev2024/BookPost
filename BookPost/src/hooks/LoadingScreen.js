import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import * as Animatable from 'react-native-animatable';

const LoadingScreen = () => {
    const zoomOut = {
        0: {
            opacity: 1,
            scale: 1,
        },
        0.5: {
            opacity: 1,
            scale: 0.3,
        },
        1: {
            opacity: 0,
            scale: 0,
        },
    };
    return (
        <View style={styles.container}>
            <StatusBar
                translucent
                backgroundColor={'transparent'}
                barStyle="light-content"
            />
            <Animatable.View animation={zoomOut} easing="ease-out" iterationCount="infinite" style={styles.square} />
            <Animatable.View animation={zoomOut} easing="ease-in-out" iterationCount="infinite" delay={100} style={styles.square} />
            <Animatable.View animation={zoomOut} easing="ease-out" iterationCount="infinite" delay={200} style={styles.square} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        flexDirection: 'row'
    },
    square: {
        width: 20,
        height: 20,
        backgroundColor: 'white',
        margin: 5,
    },
});

export default LoadingScreen;
