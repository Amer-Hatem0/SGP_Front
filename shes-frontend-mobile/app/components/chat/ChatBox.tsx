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
import { useTheme } from '../../styles/themes';
import axios from 'axios';
import API_BASE_URL from '../../../config/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

interface Message {
  messageID: number;
  senderUserID: number;
  content: string;
  sentAt: string;
}

interface ChatBoxProps {
  receiverId: number;
  receiverName: string;
  onBack?: () => void;
}

export default function ChatBox({ receiverId, receiverName, onBack }: ChatBoxProps) {
  const { theme } = useTheme();
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

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.error }}>{error}</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      keyboardVerticalOffset={90}
    >
      <View style={[styles.header, { backgroundColor: theme.colors.card }]}>
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
                msg.senderUserID === senderId ? styles.sentContainer : styles.receivedContainer
              ]}
            >
              <View
                style={[
                  styles.bubble,
                  msg.senderUserID === senderId
                    ? { backgroundColor: theme.colors.primary }
                    : { backgroundColor: theme.colors.border }
                ]}
              >
                <Text
                  style={msg.senderUserID === senderId ? styles.sentText : styles.receivedText}
                >
                  {msg.content}
                </Text>
                <Text style={styles.timeText}>
                  {new Date(new Date(msg.sentAt).getTime() + 3 * 60 * 60 * 1000)
                    .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      <View style={[styles.inputContainer, { borderTopColor: theme.colors.border }]}>
        <TextInput
          style={[
            styles.input,
            {
              borderColor: theme.colors.border,
              color: theme.colors.text,
              backgroundColor: theme.colors.card
            }
          ]}
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
            { backgroundColor: theme.colors.primary },
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    padding: 4,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  messageContainer: {
    marginBottom: 8,
  },
  sentContainer: {
    alignItems: 'flex-end',
  },
  receivedContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    maxWidth: '80%',
  },
  sentText: {
    color: 'white',
    fontSize: 16,
  },
  receivedText: {
    color: 'black',
    fontSize: 16,
  },
  timeText: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
    opacity: 0.7,
    color: 'rgba(255,255,255,0.7)',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingTop: 10,
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
});