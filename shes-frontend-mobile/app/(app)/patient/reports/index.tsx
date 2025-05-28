import { View, Text, ScrollView, Pressable, Alert, TextInput, Image, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import axios from 'axios';
import { useTheme, makeStyles } from '../../../styles/themes';
import PatientSidebar from '../../../components/patient/Sidebar';
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
  const styles = makeStyles(theme);

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
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <PatientSidebar />
      
      <ScrollView 
        style={{ flex: 1, padding: theme.spacing.lg }}
        contentContainerStyle={{ paddingBottom: theme.spacing.xl }}
      >
        <Text style={{ 
          fontSize: theme.typography.xl, 
          fontWeight: 'bold', 
          marginBottom: theme.spacing.lg,
          color: theme.colors.text
        }}>
          Medical Reports
        </Text>

        {/* Upload Section */}
        <View style={{ 
          backgroundColor: theme.colors.card,
          padding: theme.spacing.lg,
          borderRadius: theme.radii.md,
          marginBottom: theme.spacing.lg,
          ...theme.shadows.sm
        }}>
          <Pressable
            onPress={handleUpload}
            style={({ pressed }) => ({
              backgroundColor: pressed ? theme.colors.primaryDark : theme.colors.primary,
              padding: theme.spacing.md,
              borderRadius: theme.radii.sm,
              marginBottom: theme.spacing.md,
              alignItems: 'center'
            })}
          >
            <Text style={{ color: 'white', fontWeight: '500' }}>
              Select File to Upload
            </Text>
          </Pressable>

          <TextInput
            placeholder="Description (optional)"
            value={description}
            onChangeText={setDescription}
            style={{
              borderWidth: 1,
              borderColor: theme.colors.border,
              borderRadius: theme.radii.sm,
              padding: theme.spacing.sm,
              marginBottom: theme.spacing.md,
              color: theme.colors.text
            }}
          />

          {message ? (
            <Text style={{ 
              color: message.includes('success') ? theme.colors.success : theme.colors.error,
              textAlign: 'center',
              marginBottom: theme.spacing.sm
            }}>
              {message}
            </Text>
          ) : null}
        </View>

        {/* Search */}
        <TextInput
          placeholder="Search reports..."
          value={search}
          onChangeText={setSearch}
          style={{
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: theme.radii.sm,
            padding: theme.spacing.sm,
            marginBottom: theme.spacing.lg,
            color: theme.colors.text
          }}
        />

        {/* Reports List */}
        {isLoading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        ) : filteredReports.length === 0 ? (
          <Text style={{ 
            textAlign: 'center', 
            color: theme.colors.textSecondary,
            marginTop: theme.spacing.xl
          }}>
            {search ? 'No matching reports' : 'No reports available'}
          </Text>
        ) : (
          <View style={{ gap: theme.spacing.md }}>
            {filteredReports.map(report => (
              <View 
                key={report.reportID} 
                style={{
                  backgroundColor: theme.colors.card,
                  padding: theme.spacing.md,
                  borderRadius: theme.radii.sm,
                  ...theme.shadows.sm
                }}
              >
                <Pressable onPress={() => handleDownload(report)}>
                  <Text style={{ 
                    fontSize: theme.typography.md,
                    fontWeight: '600',
                    color: theme.colors.text,
                    marginBottom: theme.spacing.xs
                  }}>
                    {report.fileName}
                  </Text>
                  {report.description ? (
                    <Text style={{ 
                      color: theme.colors.textSecondary,
                      marginBottom: theme.spacing.xs
                    }}>
                      {report.description}
                    </Text>
                  ) : null}
                  <Text style={{ 
                    color: theme.colors.textSecondary,
                    fontSize: theme.typography.sm
                  }}>
                    Uploaded: {report.uploadedAt?.split('T')[0]}
                  </Text>
                </Pressable>

                <View style={{ 
                  flexDirection: 'row', 
                  justifyContent: 'flex-end',
                  marginTop: theme.spacing.sm,
                  gap: theme.spacing.md
                }}>
                  <Pressable onPress={() => handleDownload(report)}>
                    <Text style={{ color: theme.colors.primary }}>Download</Text>
                  </Pressable>
                  <Pressable onPress={() => handleDelete(report.reportID)}>
                    <Text style={{ color: theme.colors.error }}>Delete</Text>
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
        <View style={{ 
          flex: 1, 
          backgroundColor: 'rgba(0,0,0,0.8)', 
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{ 
            width: '90%', 
            backgroundColor: theme.colors.card,
            borderRadius: theme.radii.lg,
            padding: theme.spacing.lg
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: theme.spacing.md
            }}>
              <Text style={{ 
                fontSize: theme.typography.lg,
                fontWeight: 'bold',
                color: theme.colors.text
              }}>
                {selectedReport?.fileName}
              </Text>
              <Pressable onPress={() => setIsPreviewVisible(false)}>
                <Text style={{ fontSize: theme.typography.xl }}>×</Text>
              </Pressable>
            </View>

            {selectedReport?.fileUrl && (
              <Image
                source={{ uri: `${API_BASE_URL}${selectedReport.fileUrl}` }}
                style={{
                  width: '100%',
                  height: 300,
                  resizeMode: 'contain',
                  marginBottom: theme.spacing.md
                }}
              />
            )}

            <Pressable
              onPress={() => {
                setIsPreviewVisible(false);
                if (selectedReport) {
                  Sharing.shareAsync(`${API_BASE_URL}${selectedReport.fileUrl}`);
                }
              }}
              style={{
                backgroundColor: theme.colors.primary,
                padding: theme.spacing.md,
                borderRadius: theme.radii.sm,
                alignItems: 'center'
              }}
            >
              <Text style={{ color: 'white', fontWeight: '500' }}>Share</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}