import { Slot } from 'expo-router';
import { ThemeProvider } from './styles/themes';
import { AuthProvider } from '../context/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Slot /> {/* Renders whatever comes next: (auth), (app), etc */}
      </ThemeProvider>
    </AuthProvider>
  );
}
