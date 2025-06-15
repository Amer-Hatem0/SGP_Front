import { View, Text, ScrollView, Pressable, Alert, TextInput, Image, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import axios from 'axios';
import { useTheme, makeReportStyles } from '../../../styles/themes';
import API_BASE_URL from '../../../../config/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Report = {
  reportID: number;
  fileName: string;
  uploadedAt: string;
  description?: string;
  fileUrl?: string;
};

export default function ReportManager() {
  const [reports, setReports] = useState<Report[]>([]);
  const [message, setMessage] = useState('');
  const [description, setDescription] = useState('');
  const [search, setSearch] = useState('');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const { theme } = useTheme();
  const styles = makeReportStyles(theme);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const userString = await AsyncStorage.getItem('user');
      if (!userString) throw new Error('Authentication required');
      
      const user = JSON.parse(userString);
      const token = user.token;
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const userId = decoded?.userId || decoded?.sub;

      const patientRes = await axios.get(
        `${API_BASE_URL}/Patient/PatientIdByUserId/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const reportsRes = await axios.get(
        `${API_BASE_URL}/ReportFile/Patient/${patientRes.data.patientId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReports(reportsRes.data);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      Alert.alert("Error", "Failed to load reports");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true
      });

      if (!result.assets || result.assets.length === 0) return;

      const file = result.assets[0];
      const userString = await AsyncStorage.getItem('user');
      if (!userString) throw new Error('Authentication required');
      
      const user = JSON.parse(userString);
      const token = user.token;
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const userId = decoded?.userId || decoded?.sub;

      const patientRes = await axios.get(
        `${API_BASE_URL}/Patient/PatientIdByUserId/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const formData = new FormData();
      formData.append('ReportFile', {
        uri: file.uri,
        name: file.name || 'report.pdf',
        type: file.mimeType || 'application/octet-stream'
      } as any);
      formData.append('PatientId', patientRes.data.patientId);
      formData.append('Description', description);

      await axios.post(`${API_BASE_URL}/ReportFile/Upload`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage('Upload successful');
      setDescription('');
      fetchReports();
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert("Error", "Upload failed");
    }
  };

  const handleDownload = async (report: Report) => {
    try {
      const userString = await AsyncStorage.getItem('user');
      if (!userString) throw new Error('Authentication required');
      
      const user = JSON.parse(userString);
      const token = user.token;

      // For PDFs and non-image files
      if (!report.fileName.match(/\.(jpg|jpeg|png|gif)$/i)) {
        const downloadRes = await FileSystem.downloadAsync(
          `${API_BASE_URL}/ReportFile/Download/${report.reportID}`,
          FileSystem.documentDirectory + report.fileName,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(downloadRes.uri);
        } else {
          Alert.alert("Success", `Downloaded to ${downloadRes.uri}`);
        }
        return;
      }

      // For images - show in preview modal
      setSelectedReport(report);
      setIsPreviewVisible(true);
    } catch (error) {
      console.error("Download failed:", error);
      Alert.alert("Error", "Download failed");
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this report?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const userString = await AsyncStorage.getItem('user');
              if (!userString) throw new Error('Authentication required');
              
              const user = JSON.parse(userString);
              const token = user.token;

              await axios.delete(`${API_BASE_URL}/ReportFile/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
              });

              setReports(prev => prev.filter(r => r.reportID !== id));
              setMessage('Deleted successfully');
            } catch (error) {
              console.error("Delete failed:", error);
              Alert.alert("Error", "Failed to delete report");
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  const filteredReports = reports.filter(r =>
    r.fileName.toLowerCase().includes(search.toLowerCase()) ||
    (r.description?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
  <View style={styles.container}>
    
    <ScrollView 
      style={styles.scrollContent}
      contentContainerStyle={{ paddingBottom: theme.spacing.xl }}
    >
      <Text style={styles.title}>
        Medical Reports
      </Text>

      {/* Upload Section */}
      <View style={styles.uploadSection}>
        <Pressable
          onPress={handleUpload}
          style={({ pressed }) => [
            styles.uploadButton,
            pressed && styles.uploadButtonPressed
          ]}
        >
          <Text style={styles.uploadButtonText}>
            Select File to Upload
          </Text>
        </Pressable>

        <TextInput
          placeholder="Description (optional)"
          value={description}
          onChangeText={setDescription}
          style={styles.textInput}
        />

        {message ? (
          <Text style={message.includes('success') ? styles.messageSuccess : styles.messageError}>
            {message}
          </Text>
        ) : null}
      </View>

      {/* Search */}
      <TextInput
        placeholder="Search reports..."
        value={search}
        onChangeText={setSearch}
        style={styles.textInput}
      />

      {/* Reports List */}
      {isLoading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : filteredReports.length === 0 ? (
        <Text style={styles.emptyText}>
          {search ? 'No matching reports' : 'No reports available'}
        </Text>
      ) : (
        <View style={styles.reportsList}>
          {filteredReports.map(report => (
            <View 
              key={report.reportID} 
              style={styles.reportCard}
            >
              <Pressable onPress={() => handleDownload(report)}>
                <Text style={styles.reportFileName}>
                  {report.fileName}
                </Text>
                {report.description ? (
                  <Text style={styles.reportDescription}>
                    {report.description}
                  </Text>
                ) : null}
                <Text style={styles.reportDate}>
                  Uploaded: {report.uploadedAt?.split('T')[0]}
                </Text>
              </Pressable>

              <View style={styles.cardActions}>
                <Pressable onPress={() => handleDownload(report)}>
                  <Text style={styles.actionButtonText}>Download</Text>
                </Pressable>
                <Pressable onPress={() => handleDelete(report.reportID)}>
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>

    {/* Image Preview Modal */}
    <Modal
      visible={isPreviewVisible}
      transparent={true}
      onRequestClose={() => setIsPreviewVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {selectedReport?.fileName}
            </Text>
            <Pressable onPress={() => setIsPreviewVisible(false)}>
              <Text style={styles.modalCloseButton}>×</Text>
            </Pressable>
          </View>

          {selectedReport?.fileUrl && (
            <Image
              source={{ uri: `${API_BASE_URL}${selectedReport.fileUrl}` }}
              style={styles.modalImage}
            />
          )}

          <Pressable
            onPress={() => {
              setIsPreviewVisible(false);
              if (selectedReport) {
                Sharing.shareAsync(`${API_BASE_URL}${selectedReport.fileUrl}`);
              }
            }}
            style={styles.shareButton}
          >
            <Text style={styles.shareButtonText}>Share</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  </View>
);
}