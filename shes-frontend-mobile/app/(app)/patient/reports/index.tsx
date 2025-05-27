import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import { useTheme, makeStyles } from '../../../styles/themes';
import PatientSidebar from '../../../components/patient/Sidebar';
import API_BASE_URL from '../../../../config/apiConfig';

type Report = {
  reportID: number;
  fileName: string;
  uploadedAt: string;
};

type DocumentResult = {
  assets: {
    uri: string;
    name: string;
    mimeType: string | null;
    size: number | null;
  }[] | null;
  canceled: boolean;
};

export default function ReportManager() {
  const [reports, setReports] = useState<Report[]>([]);
  const [message, setMessage] = useState('');
  const { theme } = useTheme();
  const styles = makeStyles(theme);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = user?.token;
      const decoded = token ? JSON.parse(atob(token.split('.')[1])) : null;
      const userId = decoded?.userId || decoded?.sub;

      if (!token || !userId) {
        throw new Error('Authentication required');
      }

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
    }
  };

  const handleUpload = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true
    });

    if (!result.assets || result.assets.length === 0) {
      return; // User canceled or no file selected
    }

    const file = result.assets[0];
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = user?.token;
    
    if (!token) {
      throw new Error('Authentication required');
    }

    const formData = new FormData();
    formData.append('ReportFile', {
      uri: file.uri,
      name: file.name || 'report.pdf',
      type: file.mimeType || 'application/octet-stream'
    } as any);

    await axios.post(`${API_BASE_URL}/ReportFile/Upload`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    setMessage('Upload successful');
    fetchReports(); // Refresh the list
  } catch (error) {
    console.error('Upload error:', error);
    Alert.alert("Error", "Upload failed");
  }
};

  const handleDownload = async (id: number) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = user?.token;
      
      if (!token) {
        throw new Error('Authentication required');
      }

      const downloadRes = await FileSystem.downloadAsync(
        `${API_BASE_URL}/ReportFile/Download/${id}`,
        FileSystem.documentDirectory + `report_${id}.pdf`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      Alert.alert("Success", `Downloaded to ${downloadRes.uri}`);
    } catch (error) {
      console.error("Download failed:", error);
      Alert.alert("Error", "Download failed");
    }
  };

  const handleDelete = async (id: number) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this report?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const user = JSON.parse(localStorage.getItem('user') || '{}');
              const token = user?.token;
              
              if (!token) {
                throw new Error('Authentication required');
              }

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

  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <PatientSidebar />
      <ScrollView style={{ flex: 1, padding: theme.spacing.lg }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: theme.spacing.lg }}>
          Medical Reports
        </Text>

        {message ? (
          <Text style={{ 
            color: message.includes('success') ? theme.colors.success : theme.colors.error,
            marginBottom: theme.spacing.md
          }}>
            {message}
          </Text>
        ) : null}

        <Pressable
          onPress={handleUpload}
          style={{
            backgroundColor: theme.colors.primary,
            padding: theme.spacing.md,
            borderRadius: 5,
            marginBottom: theme.spacing.lg
          }}
        >
          <Text style={{ color: 'white', textAlign: 'center' }}>Upload Report</Text>
        </Pressable>

        <View style={{ gap: theme.spacing.md }}>
          {reports.length === 0 ? (
            <Text>No reports available</Text>
          ) : (
            reports.map(report => (
              <View key={report.reportID} style={{
                backgroundColor: theme.colors.card,
                padding: theme.spacing.md,
                borderRadius: theme.radii.sm,
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}>
                <View>
                  <Text style={{ color: theme.colors.text }}>{report.fileName}</Text>
                  <Text style={{ color: theme.colors.textSecondary }}>
                    {report.uploadedAt?.split('T')[0]}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', gap: theme.spacing.md }}>
                  <Pressable onPress={() => handleDownload(report.reportID)}>
                    <Text style={{ color: theme.colors.primary }}>Download</Text>
                  </Pressable>
                  <Pressable onPress={() => handleDelete(report.reportID)}>
                    <Text style={{ color: theme.colors.error }}>Delete</Text>
                  </Pressable>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}