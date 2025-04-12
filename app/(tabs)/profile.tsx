import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // Add this for navigation
import log from "../../assets/images/log01.png";

const { height, width } = Dimensions.get('window');

const ProfileCard = () => {
  const router = useRouter(); // Hook for navigation
  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState('1234567890');
  const [occupation, setOccupation] = useState('Business Man');
  const [institution, setInstitution] = useState('MALIK, LTD.');
  const [nid, setNid] = useState('1234567890');

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const goBack = () => {
    router.back(); // Navigate back to the previous screen
  };

  return (
    <View style={styles.container}>
      {/* Full-page background image */}
      <ImageBackground 
        source={log} 
        style={styles.backgroundImage} 
        imageStyle={styles.backgroundImageStyle}
        resizeMode="cover"
      >
        {/* Content container */}
        <View style={styles.contentContainer}>
          {/* Top half with teal overlay */}
          <View style={styles.topHalf}>
            {/* Semi-transparent teal overlay */}
            <View style={styles.tealOverlay} />
            
            {/* Top content */}
            <View style={styles.topContent}>
              {/* Close button with × */}
              <TouchableOpacity style={styles.closeButton} onPress={goBack}>
                <Text style={styles.closeText}>×</Text>
              </TouchableOpacity>
              
              {/* Landlord info */}
              <View style={styles.landlordInfo}>
                <Text style={styles.landlordText}>LandLord</Text>
                <Text style={styles.emailText}>LandLord@malik.com</Text>
              </View>
            </View>
          </View>

          {/* Bottom half - card section */}
          <View style={styles.bottomHalf}>
            {/* White card with details */}
            <View style={styles.card}>
              {/* Phone */}
              <View style={styles.detailRow}>
                <Text style={styles.label}>Phone</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                  />
                ) : (
                  <Text style={styles.value}>{phone}</Text>
                )}
              </View>

              {/* Occupation */}
              <View style={styles.detailRow}>
                <Text style={styles.label}>Occupation</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.input}
                    value={occupation}
                    onChangeText={setOccupation}
                  />
                ) : (
                  <Text style={styles.value}>{occupation}</Text>
                )}
              </View>

              {/* Institution */}
              <View style={styles.detailRow}>
                <Text style={styles.label}>Institution</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.input}
                    value={institution}
                    onChangeText={setInstitution}
                  />
                ) : (
                  <Text style={styles.value}>{institution}</Text>
                )}
              </View>

              {/* NID No */}
              <View style={styles.detailRow}>
                <Text style={styles.label}>NID No.</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.input}
                    value={nid}
                    onChangeText={setNid}
                    keyboardType="numeric"
                  />
                ) : (
                  <Text style={styles.value}>{nid}</Text>
                )}
              </View>
            </View>

            {/* Edit button */}
            <TouchableOpacity style={styles.editButton} onPress={toggleEdit}>
              <Ionicons name="pencil" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backgroundImageStyle: {
    opacity: 0.2, // 20% opacity for the image
  },
  contentContainer: {
    flex: 1,
  },
  topHalf: {
    height: height * 0.45,
    position: 'relative',
  },
  tealOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#00C4B4', // Teal color
    opacity: 0.9, // Semi-transparent to allow blending with the background image
  },
  topContent: {
    position: 'relative',
    flex: 1,
    padding: 20,
    zIndex: 1, // Ensure content is above the overlay
  },
  closeButton: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  closeText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  landlordInfo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  landlordText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  emailText: {
    color: 'white',
    fontSize: 16,
    marginTop: 5,
  },
  bottomHalf: {
    flex: 1,
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    width: '85%',
    borderRadius: 10,
    padding: 20,
    marginTop: -40, // Pull the card up to overlap with the top half
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: '#888',
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 5,
    width: 150,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  editButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#00C4B4',
    borderRadius: 30,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
});

export default ProfileCard;