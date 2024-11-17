import React, {useRef, useEffect} from 'react';
import { PanResponder, TouchableOpacity } from 'react-native';
import { Animated, Modal, StyleSheet, Text, View, Dimensions } from 'react-native';
import MaterialC from 'react-native-vector-icons/MaterialCommunityIcons';

const { height } = Dimensions.get('window');

const ModalOptionsPub = ({ visible, onClose, isUser }) => {
    const pan = useRef(new Animated.Value(height)).current;

    useEffect(() => {
        if (visible) {
            Animated.timing(pan, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                return Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
            },
            onPanResponderMove: (evt, gestureState) => {
                if (gestureState.dy > 0) {
                    pan.setValue(gestureState.dy);
                }
            },
            onPanResponderRelease: (evt, gestureState) => {
                if (gestureState.dy > 100) {
                    onClose();
                } else {
                    Animated.spring(pan, { toValue: 0, useNativeDriver: true }).start();
                }
            },
        })
    ).current;

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="none"
            onRequestClose={onClose}>
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={onClose}>
                <Animated.View style={[styles.modalContainer, { transform: [{ translateY: pan }] }]} {...panResponder.panHandlers}>
                    <View style={styles.handle} />
                    {isUser ? (
                        <View style={styles.optionsContainer}>
                            <TouchableOpacity style={styles.option}>
                                <MaterialC name="pencil" size={22} color="white" />
                                <Text style={styles.optionText}>Editar publicación</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.option, styles.deleteOption]}>
                                <MaterialC name="delete" size={22} color="#ff4d4d" />
                                <Text style={[styles.optionText, styles.deleteText]}>Borrar publicación</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.optionsContainer}>
                            <TouchableOpacity style={styles.option}>
                                <MaterialC name="flag" size={22} color="white" />
                                <Text style={styles.optionText}>Reportar publicación</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </Animated.View>
            </TouchableOpacity>
        </Modal>
    );
};


const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#2c2c2e',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 10,
        paddingBottom: 20,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 10,
    },
    handle: {
        width: 50,
        height: 5,
        backgroundColor: '#888',
        borderRadius: 2.5,
        alignSelf: 'center',
        marginBottom: 15,
    },
    optionsContainer: {
        marginTop: 10,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 10,
        backgroundColor: '#3a3a3c',
        marginBottom: 8,
    },
    deleteOption: {
        backgroundColor: '#4d0000',
    },
    optionText: {
        color: 'white',
        marginLeft: 12,
        fontSize: 16,
        fontWeight: '500',
    },
    deleteText: {
        color: '#ff4d4d',
        fontWeight: '600',
    },
});

export default ModalOptionsPub;
