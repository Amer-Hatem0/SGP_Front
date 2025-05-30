// app/(app)/patient/appointments/index.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  StyleSheet,
  Modal,
  TextInput,
  ActivityIndicator,
  StyleProp,
  ViewStyle
} from 'react-native';
import { useTheme, makeAppointmentStyles } from '../../../styles/themes';
import PatientSidebar from '../../../components/patient/Sidebar';
import axios from 'axios';
import API_BASE_URL from '../../../../config/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StarRating from 'react-native-star-rating-widget';

interface Appointment {
  appointmentId: number;
  doctorName: string;
  appointmentDate: string;
  statusName: string;
  doctorID?: number;
  patientID?: number;
  notes?: string;
}

export default function MyAppointments() {
  const { theme } = useTheme();
  const styles = makeAppointmentStyles(theme);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (!userData) {
          Alert.alert('Error', 'User not authenticated');
          return;
        }

        const { token } = JSON.parse(userData);
        const decoded = JSON.parse(atob(token.split('.')[1]));
        const userId = parseInt(decoded.userId || decoded.sub);

        // Get patientID from userID
        const patientRes = await axios.get(
          `${API_BASE_URL}/Patient/PatientIdByUserId/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const patientID = patientRes.data.patientId;

        // Fetch appointments
        const appointmentsRes = await axios.get(
          `${API_BASE_URL}/Appointment/Patient/${patientID}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setAppointments(appointmentsRes.data);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
        Alert.alert("Error", "Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleCancel = async (appointmentId: number) => {
    Alert.alert(
      "Confirm Cancellation",
      "Are you sure you want to cancel this appointment?",
      [
        { text: "No", style: "cancel" },
        { 
          text: "Yes", 
          onPress: async () => {
            try {
              const userData = await AsyncStorage.getItem('user');
              if (!userData) return;
              
              const { token } = JSON.parse(userData);
              await axios.delete(
                `${API_BASE_URL}/Appointment/Cancel/${appointmentId}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );

              setAppointments(prev => 
                prev.map(appt => 
                  appt.appointmentId === appointmentId 
                    ? { ...appt, statusName: "Cancelled" } 
                    : appt
                )
              );
              Alert.alert("Success", "Appointment cancelled");
            } catch (err) {
              console.error("Failed to cancel appointment:", err);
              Alert.alert("Error", "Failed to cancel appointment");
            }
          }
        }
      ]
    );
  };

  const handleOpenModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setRating(0);
    setComment('');
    setShowModal(true);
  };

  const handleSubmitFeedback = async () => {
    if (!rating) {
      Alert.alert("Error", "Please select a rating!");
      return;
    }

    if (!selectedAppointment) return;

    setSubmitting(true);
    try {
      const userData = await AsyncStorage.getItem('user');
      if (!userData) return;
      
      const { token } = JSON.parse(userData);
      const feedbackPayload = {
        FeedbackID: 0,
        DoctorID: selectedAppointment.doctorID,
        PatientID: selectedAppointment.patientID,
        DoctorUserID: selectedAppointment.doctorID,
        Rating: Math.round(rating),
        Comments: comment,
        SubmittedAt: new Date().toISOString()
      };

      await axios.post(
        `${API_BASE_URL}/Feedback/Add`,
        feedbackPayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowModal(false);
      Alert.alert("Success", "Feedback submitted successfully!");
    } catch (err) {
      console.error("Failed to submit feedback:", err);
      Alert.alert("Error", "Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

  const showCancelButton = (statusName: string) => 
    ["Pending", "Confirmed", "Rescheduled"].includes(statusName);

  const showRateButton = (statusName: string) => 
    statusName === "Completed";

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PatientSidebar />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>My Appointments</Text>

        {appointments.length === 0 ? (
          <Text style={styles.emptyText}>No appointments found.</Text>
        ) : (
          <View style={styles.appointmentsContainer}>
            {appointments.map(appt => (
              <View key={appt.appointmentId} style={styles.appointmentCard}>
                <Text style={styles.doctorName}>
                  {appt.doctorName || "Unknown"}
                </Text>
                <Text style={styles.appointmentText}>
                  Date: {appt.appointmentDate?.split('T')[0]}
                </Text>
                <Text style={styles.appointmentText}>
                  Time: {new Date(appt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
                <Text style={styles.appointmentText}>
                  Status: {appt.statusName}
                </Text>
                {appt.notes && (
                  <Text style={styles.appointmentText}>
                    Notes: {appt.notes}
                  </Text>
                )}

                <View style={styles.actionsContainer}>
                  {showCancelButton(appt.statusName) && (
                    <Pressable
                      onPress={() => handleCancel(appt.appointmentId)}
                      style={({ pressed }) => [
                        styles.cancelButton,
                        pressed && styles.buttonPressed
                      ]}
                    >
                      <Text style={styles.buttonText}>Cancel</Text>
                    </Pressable>
                  )}
                  {showRateButton(appt.statusName) && (
                    <Pressable
                      onPress={() => handleOpenModal(appt)}
                      style={({ pressed }) => [
                        styles.rateButton,
                        pressed && styles.buttonPressed
                      ]}
                    >
                      <Text style={styles.buttonText}>Rate Doctor</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Rating Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rate Doctor</Text>
            
            <StarRating
              rating={rating}
              onChange={(newRating: number) => setRating(newRating)}
              starSize={40}
              color={theme.colors.primary}
              style={styles.ratingContainer}
            />
            
            <TextInput
              style={styles.commentInput}
              placeholder="Write your comment (optional)"
              placeholderTextColor={theme.colors.textSecondary}
              multiline
              numberOfLines={4}
              value={comment}
              onChangeText={setComment}
            />
            
            <View style={styles.modalActions}>
              <Pressable
                onPress={() => setShowModal(false)}
                disabled={submitting}
                style={({ pressed }) => [
                  styles.modalButton,
                  styles.cancelModalButton,
                  pressed && styles.buttonPressed
                ]}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
              
              <Pressable
                onPress={handleSubmitFeedback}
                disabled={submitting}
                style={({ pressed }) => [
                  styles.modalButton,
                  pressed && styles.buttonPressed,
                  submitting && styles.buttonDisabled
                ]}
              >
                {submitting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.buttonText}>Submit</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}