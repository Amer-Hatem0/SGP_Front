// app/(app)/chat/chatscreen.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView,
  SafeAreaView,
  useWindowDimensions 
} from 'react-native';
import { useTheme, makeStyles, makeChatStyles } from '../../styles/themes';
import DoctorList from '../../components/DoctorList';
import ChatBox from '../../components/chat/ChatBox';
import PatientSidebar from '../../components/patient/Sidebar';

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

  const isSmallScreen = width < 768;

  return (
    <SafeAreaView style={styles.patientContainer}>
      {!isSmallScreen && <PatientSidebar />}
      
      <View style={chatStyles.wrapper}>
        {(!isSmallScreen || !selectedDoctor.id) && (
          <View style={chatStyles.doctorPanel}>
            <Text style={chatStyles.sidebarTitle}>
              The doctor 🩺
            </Text>
            <ScrollView contentContainerStyle={chatStyles.doctorListContainer}>
              <DoctorList 
                onSelectDoctor={handleDoctorSelect} 
                selectedDoctorId={selectedDoctor?.id} 
              />
            </ScrollView>
          </View>
        )}

        <View style={chatStyles.chatPanel}>
          {selectedDoctor.id ? (
            <ChatBox 
              receiverId={selectedDoctor.id} 
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