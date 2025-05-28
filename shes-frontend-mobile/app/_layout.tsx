import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemeProvider } from './styles/themes'; // Your custom theme provider
import AppNavigator from './AppNavigator'; // ✅ Import your custom navigator

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null; // Optional: splash screen while fonts load
  }

  return (
    <ThemeProvider>
      <NavThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AppNavigator /> {/* ✅ Use your role-aware navigation here */}
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </NavThemeProvider>
    </ThemeProvider>
  );
}
