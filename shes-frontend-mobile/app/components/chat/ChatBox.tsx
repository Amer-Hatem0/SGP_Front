// app/components/chat/ChatBox.tsx
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { useTheme, makeChatBoxStyles } from '../../styles/themes';
import axios from 'axios';
import API_BASE_URL from '../../../config/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

interface Message {
  messageID: number;
  senderUserID: number;
  content: string;
  sentAt: string;
  isRead?: number;
}

interface ChatBoxProps {
  receiverId: string;
  receiverName: string;
  onBack?: () => void;
}

export default function ChatBox({ receiverId, receiverName, onBack }: ChatBoxProps) {
  const { theme } = useTheme();
  const styles = makeChatBoxStyles(theme);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  const [senderId, setSenderId] = useState<number | null>(null);

  // Load user data and set sender ID
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (!userData) return;
        
        const token = JSON.parse(userData).token;
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setSenderId(parseInt(decoded.sub));
      } catch (error) {
        console.error('Failed to decode token:', error);
        setError('Failed to authenticate');
      }
    };
    loadUser();
  }, []);

  const fetchMessages = async () => {
    if (!senderId || !receiverId) return;
    
    try {
      const userData = await AsyncStorage.getItem('user');
      if (!userData) return;
      
      const token = JSON.parse(userData).token;
      const res = await axios.get(
        `${API_BASE_URL}/Chat/conversation/${senderId}/${receiverId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(res.data);
      scrollToBottom();
    } catch (error) {
      console.error("Error loading messages:", error);
      setError('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  const markAllUnreadAsRead = async (msgs: Message[]) => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (!userData) return;
      
      const token = JSON.parse(userData).token;
      for (const msg of msgs) {
        if (msg.isRead === 0 && msg.senderUserID === parseInt(receiverId)) {
          await axios.put(
            `${API_BASE_URL}/Chat/MarkAsRead/${msg.messageID}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      }
    } catch (err) {
      console.error("Failed to mark messages as read", err);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !senderId) return;
    
    try {
      setIsLoading(true);
      const userData = await AsyncStorage.getItem('user');
      if (!userData) return;
      
      const token = JSON.parse(userData).token;
      await axios.post(
        `${API_BASE_URL}/Chat/send`,
        {
          senderUserID: senderId,
          receiverUserID: receiverId,
          content: newMessage
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewMessage('');
      await fetchMessages();
    } catch (error) {
      console.error("Failed to send message:", error);
      setError('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    if (!receiverId || !senderId) return;
    
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [receiverId, senderId]);

  useEffect(() => {
    if (messages.length > 0) {
      markAllUnreadAsRead(messages);
    }
  }, [messages]);

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={{ color: theme.colors.error }}>{error}</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={styles.container}
    keyboardVerticalOffset={90}
  >
      {/* Header */}
    <View style={styles.header}>
      {onBack && (
        <TouchableOpacity 
          style={styles.backButton}
          onPress={onBack}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      )}
        <Text style={[styles.headerText, { color: theme.colors.text }]}>
        👤 {receiverName || 'الطبيب'}
      </Text>
    </View>

      {/* Messages Area */}
    {isLoading && messages.length === 0 ? (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    ) : (
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={scrollToBottom}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) => (
          <View
            key={msg.messageID}
            style={[
              styles.messageContainer,
              msg.senderUserID === senderId 
                ? styles.sentContainer 
                : styles.receivedContainer
            ]}
          >
            <View
              style={[
                styles.bubble,
                msg.senderUserID === senderId
                  ? styles.sentBubble
                  : styles.receivedBubble
              ]}
            >
              <Text style={
                msg.senderUserID === senderId 
                  ? styles.sentText 
                  : styles.receivedText
              }>
                {msg.content}
              </Text>
              <Text style={[
                styles.timeText,
                msg.senderUserID === senderId 
                  ? { color: 'rgba(255,255,255,0.7)' }
                  : { color: theme.colors.textSecondary }
              ]}>
                {new Date(new Date(msg.sentAt).getTime() + 3 * 60 * 60 * 1000)
                  .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
            {msg.isRead === 1 && (
              <Text style={styles.readIndicator}>✓✓</Text>
            )}
            {msg.isRead === 0 && (
              <Text style={styles.readIndicator}>✓</Text>
            )}
          </View>
        ))}
      </ScrollView>
    )}

    {/* Input Area */}
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Write your message here..."
        placeholderTextColor={theme.colors.textSecondary}
        value={newMessage}
        onChangeText={setNewMessage}
        onSubmitEditing={sendMessage}
        editable={!isLoading}
        multiline
      />
      <TouchableOpacity
        style={[
          styles.sendButton,
          isLoading && styles.disabledButton
        ]}
        onPress={sendMessage}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Ionicons name="send" size={20} color="white" />
        )}
      </TouchableOpacity>
    </View>
  </KeyboardAvoidingView>
  );
}