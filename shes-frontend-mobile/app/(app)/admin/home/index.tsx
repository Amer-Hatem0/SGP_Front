import { View, Text } from 'react-native';
import { useTheme, makeStyles } from '../../../styles/themes';

export default function AdminHome() {
    const { theme } = useTheme();
    const styles = makeStyles(theme);
      return (
    <View style={{ 
      padding: theme.spacing.lg, 
      backgroundColor: theme.colors.background 
    }}>
      <Text style={{ 
        fontSize: 20, 
        color: theme.colors.error 
      }}>
        Welcome, Admin
      </Text>
    </View>
  );
}