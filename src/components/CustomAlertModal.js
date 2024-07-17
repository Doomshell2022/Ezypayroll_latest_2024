import React, {useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  BackHandler,
  TouchableOpacity,
} from 'react-native';

const DeveloperModeAlert = ({visible, onClose}) => {
  // Handle Android back button press
  useEffect(() => {
    const backAction = () => {
      // Show an alert to the user
      // alert('Please click the button to close the modal.');
      return true; // Prevent default behavior (i.e., closing the modal)
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove(); // Clean up the event listener on unmount
  }, []);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        // Do nothing on request close
      }}>
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          <Text style={styles.title}>Developer Mode Enabled</Text>
          <Text style={styles.message}>
            Your developer mode is on. Please turn it off, otherwise you can't
            use the app.
          </Text>
          {/* <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Close Modal</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default DeveloperModeAlert;
