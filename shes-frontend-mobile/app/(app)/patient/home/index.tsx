import { View, Text, ScrollView, TextInput, Image } from 'react-native';
import { useTheme, makeStyles } from '../../../styles/themes';
import { FontAwesome } from '@expo/vector-icons';
import PatientSidebar from '../../../components/patient/Sidebar';

export default function PatientHome() {
const { theme } = useTheme();
    const styles = makeStyles(theme);
  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <PatientSidebar />
      <ScrollView style={{ flex: 1, padding: theme.spacing.lg, backgroundColor: theme.colors.background }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing.xl }}>
          <TextInput
            placeholder="Search here..."
            style={{
              width: '70%',
              padding: theme.spacing.md,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: theme.colors.border
            }}
          />
          <View style={{ flexDirection: 'row', gap: theme.spacing.md }}>
            <FontAwesome name="bell" size={24} color={theme.colors.text} />
            <FontAwesome name="comment" size={24} color={theme.colors.text} />
            <Image 
              source={{ uri: 'https://i.pravatar.cc/40' }} 
              style={{ width: 40, height: 40, borderRadius: 20 }}
            />
          </View>
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.lg }}>
          {[
            { icon: 'user-md', label: 'Doctors', count: '520', color: theme.colors.primary },
            { icon: 'user-nurse', label: 'Nurses', count: '6969', color: theme.colors.error },
            { icon: 'wheelchair', label: 'Patients', count: '7509', color: theme.colors.warning },
            { icon: 'medkit', label: 'Pharmacists', count: '2110', color: theme.colors.info }
          ].map((item, index) => (
            <View key={index} style={{
              width: '45%',
              backgroundColor: theme.colors.card,
              padding: theme.spacing.lg,
              borderRadius: theme.spacing.md,
              flexDirection: 'row',
              alignItems: 'center',
              gap: theme.spacing.md
            }}>
              <FontAwesome
               name={item.icon as any}
               size={28} 
               color={item.color} />
              <View>
                <Text style={{ fontSize: theme.typography.lg, fontWeight: 'bold' }}>{item.count}</Text>
                <Text style={{ color: theme.colors.textSecondary }}>{item.label}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}