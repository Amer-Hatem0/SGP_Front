import { View, Text } from 'react-native';
import { useTheme, makeStyles } from '../../../styles/themes';

export default function SupervisorHome() {
const { theme } = useTheme();
    const styles = makeStyles(theme);
      return (
    <View style={{ padding: theme.spacing.lg }}>
      <Text style={{ fontSize: 20, color: theme.colors.text }}>
        Welcome, Supervisor
      </Text>
    </View>
  );
}