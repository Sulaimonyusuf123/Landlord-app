import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Image,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export default function ChatScreen({ userId = '1', tenantId = '2' }) {
  const navigation = useNavigation();
  const [messages, setMessages] = useState([
    { _id: 1, text: 'Hello, how can I help with your rental unit?', createdAt: new Date(), user: { _id: 2 } },
    { _id: 2, text: 'I had a question about the lease renewal.', createdAt: new Date(Date.now() - 300000), user: { _id: 1 } },
  ]);
  
  const [inputText, setInputText] = useState('');
  
  const onSend = () => {
    if (inputText.trim() === '') return;
    
    // Add user message
    const newMessage = {
      _id: Date.now(),
      text: inputText,
      createdAt: new Date(),
      user: { _id: userId }
    };
    
    setMessages(prevMessages => [newMessage, ...prevMessages]);
    setInputText('');
    
    // Simulate response (would be replaced with backend integration)
    setTimeout(() => {
      const responseMessage = {
        _id: Date.now() + 1,
        text: `Thanks for your message! This is a simulated response. The backend integration will be added later.`,
        createdAt: new Date(),
        user: { _id: tenantId }
      };
      setMessages(prevMessages => [responseMessage, ...prevMessages]);
    }, 1000);
  };

  const goBack = () => {
    navigation.goBack();
  };

  const renderMessage = ({ item: message }) => {
    const isUser = message.user._id === userId;
    
    return (
      <View style={[
        styles.messageContainer,
        isUser ? styles.userMessageContainer : styles.otherMessageContainer
      ]}>
        {!isUser && (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>T</Text>
          </View>
        )}
        
        <View style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.otherBubble
        ]}>
          <Text style={[
            styles.messageText,
            isUser ? styles.userMessageText : styles.otherMessageText
          ]}>
            {message.text}
          </Text>
          <Text style={[
            styles.timeText,
            isUser ? styles.userTimeText : styles.otherTimeText
          ]}>
            {message.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        
        {isUser && (
          <View style={[styles.avatar, styles.userAvatar]}>
            <Text style={styles.userAvatarText}>Y</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <ImageBackground 
      source={require("../../assets/images/log01.png")}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.container}>
        {/* Header with Back Button and Logo */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={goBack}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          
          <View style={styles.logoContainer}>
            <Image 
              source={require("../../assets/images/log01.png")} 
              style={styles.logoImage} 
            />
          </View>
          
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>RentChat</Text>
            <Text style={styles.subtitle}>Tenant Communication Portal</Text>
          </View>
        </View>
        
        {/* Messages List */}
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item._id.toString()}
          contentContainerStyle={styles.messagesList}
          inverted={true}
        />
        
        {/* Input Area */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
          style={styles.inputContainer}
        >
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            onSubmitEditing={onSend}
            returnKeyType="send"
          />
          <TouchableOpacity 
            style={styles.sendButton}
            onPress={onSend}
            disabled={inputText.trim() === ''}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  header: {
    backgroundColor: '#17b8a6',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  backButton: {
    marginRight: 10,
    padding: 5,
  },
  logoContainer: {
    marginRight: 10,
  },
  logoImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: 'contain',
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#E0F2FE',
    fontSize: 12,
  },
  messagesList: {
    padding: 15,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 5,
    alignItems: 'flex-end',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  otherMessageContainer: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
  },
  userAvatar: {
    backgroundColor: '#60A5FA',
  },
  userAvatarText: {
    color: '#ffffff',
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 15,
    marginHorizontal: 5,
  },
  userBubble: {
    backgroundColor: '#3B82F6',
    borderTopRightRadius: 0,
  },
  otherBubble: {
    backgroundColor: 'white',
    borderTopLeftRadius: 0,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  messageText: {
    fontSize: 15,
  },
  userMessageText: {
    color: 'white',
  },
  otherMessageText: {
    color: '#374151',
  },
  timeText: {
    fontSize: 10,
    marginTop: 3,
    alignSelf: 'flex-end',
  },
  userTimeText: {
    color: '#BFDBFE',
  },
  otherTimeText: {
    color: '#9CA3AF',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 20,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: '500',
  },
});