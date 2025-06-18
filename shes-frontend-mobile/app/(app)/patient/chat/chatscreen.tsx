// app/(app)/chat/chatscreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  useWindowDimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { useTheme, makeStyles, makeChatStyles } from '../../../styles/themes';
import DoctorList from '../../../components/DoctorList';
import ChatBox from '../../../components/chat/ChatBox';
import axios from 'axios';
import API_BASE_URL from '../../../../config/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ChatScreen() {
  const { theme } = useTheme();
  const styles = makeStyles(theme);
  const chatStyles = makeChatStyles(theme);
  const { width } = useWindowDimensions();

  const [selectedDoctor, setSelectedDoctor] = useState<{
    id: number | null;
    name: string;
  }>({ id: null, name: '' });

  const handleDoctorSelect = (id: number, name: string) => {
    setSelectedDoctor({ id, name });
  };
  const markAllAsReadFromDoctor = async (doctorId: number) => {
    try {
      console.log("Chat with doctor with id", doctorId);
      const userData = await AsyncStorage.getItem('user');
      if (!userData) return;
      
      const token = JSON.parse(userData).token;
      await axios.put(
        `${API_BASE_URL}/Chat/MarkAllFromSenderAsRead/${doctorId}`, 
        {}, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Failed to mark messages as read", err);
    }
  };

  const isSmallScreen = width < 768;
   const responsiveStyles = isSmallScreen ? chatStyles.smallScreen : {};
  return (
    <SafeAreaView style={chatStyles.wrapper}>
      {!isSmallScreen}
      
      <View style={[chatStyles.wrapper,chatStyles.smallScreen.wrapper]}>
        {(!isSmallScreen || !selectedDoctor.id) && (
          <View style={[chatStyles.doctorPanel,chatStyles.smallScreen.doctorPanel]}>
            <Text style={chatStyles.sidebarTitle}>
              The doctor 🩺
            </Text>
            <ScrollView contentContainerStyle={chatStyles.doctorListContainer}>
              <DoctorList 
                onSelectDoctor={(id,name)=>{
                  handleDoctorSelect(id,name);
                markAllAsReadFromDoctor(id);} }
                selectedDoctorId={selectedDoctor?.id} 
              />
            </ScrollView>
          </View>
        )}

        <View style={[chatStyles.chatPanel,chatStyles.smallScreen.chatPanel]}>
          {selectedDoctor.id ? (
            <ChatBox 
              receiverId={(selectedDoctor.id).toString()} 
              receiverName={selectedDoctor.name} 
              onBack={isSmallScreen ? () => setSelectedDoctor({ id: null, name: '' }) : undefined}
            />
          ) : (
            <View style={chatStyles.placeholderContainer}>
              <Text style={chatStyles.placeholder}>
                Choose a doctor to start the conversation
              </Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}