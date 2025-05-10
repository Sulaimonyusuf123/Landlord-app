import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { getCurrentUser, logoutUser } from '../../lib/authService';
import { account } from '../../lib/appwrite';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState('');
  const [occupation, setOccupation] = useState('');
  const [institution, setInstitution] = useState('');
  const [nid, setNid] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const u = await getCurrentUser();
      if (u) {
        setUser(u);
        setPhone(u.prefs?.phone || '');
        setOccupation(u.prefs?.occupation || '');
        setInstitution(u.prefs?.institution || '');
        setNid(u.prefs?.nid || '');
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const saveChanges = async () => {
    try {
      await account.updatePrefs({ phone, occupation, institution, nid });
      Alert.alert('Saved', 'Your profile has been updated');
      setIsEditing(false);
    } catch (err) {
      Alert.alert('Error', 'Failed to save changes');
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.replace("/(auth)/login");
    } catch {
      Alert.alert("Error", "Failed to logout");
    }
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 40 }} size="large" color="teal" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{user.name}</Text>
      <Text style={styles.subtitle}>{user.email}</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Phone:</Text>
        {isEditing ? (
          <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        ) : (
          <Text style={styles.value}>{phone}</Text>
        )}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Occupation:</Text>
        {isEditing ? (
          <TextInput style={styles.input} value={occupation} onChangeText={setOccupation} />
        ) : (
          <Text style={styles.value}>{occupation}</Text>
        )}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Institution:</Text>
        {isEditing ? (
          <TextInput style={styles.input} value={institution} onChangeText={setInstitution} />
        ) : (
          <Text style={styles.value}>{institution}</Text>
        )}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>NID No.:</Text>
        {isEditing ? (
          <TextInput style={styles.input} value={nid} onChangeText={setNid} keyboardType="numeric" />
        ) : (
          <Text style={styles.value}>{nid}</Text>
        )}
      </View>

      <TouchableOpacity style={styles.button} onPress={isEditing ? saveChanges : () => setIsEditing(true)}>
        <Ionicons name={isEditing ? "checkmark" : "pencil"} size={20} color="white" />
        <Text style={styles.buttonText}>{isEditing ? "Save" : "Edit"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out" size={20} color="white" />
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: 'white', flex: 1 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  subtitle: { fontSize: 16, color: 'gray', marginBottom: 20 },
  field: { marginBottom: 15 },
  label: { fontWeight: 'bold', marginBottom: 5, color: '#555' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 5,
    fontSize: 16,
    backgroundColor: '#f9f9f9'
  },
  value: { fontSize: 16, color: '#333' },
  button: {
    marginTop: 30,
    backgroundColor: 'teal',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoutButton: {
    marginTop: 15,
    backgroundColor: '#f44336',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: { color: 'white', marginLeft: 10, fontSize: 16 }
});
