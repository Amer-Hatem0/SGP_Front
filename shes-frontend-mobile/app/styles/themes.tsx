import React, { createContext, useContext, ReactNode } from 'react';

type ShadowStyle = {
  elevation?: number;
  shadowColor?: string;
  shadowOffset?: { width: number; height: number };
  shadowOpacity?: number;
  shadowRadius?: number;
};

type Theme = {
  colors: {
    // Base colors
    text: string;
    textSecondary: string;
    primary: string;
    primaryDark: string;
    secondary: string;
    error: string;
    success: string;
    warning: string;
    info: string;
    background: string;
    backgroundSecondary: string;
    // Surfaces
    card: string;
    modal: string;
    header: string;
    
    // Interactive
    border: string;
    hover: string;
    active: string;
    disabled: string;
    
    // Specific components
    avatarBorder: string;
    buttonPrimary: string;
    buttonOutline: string;
    cancelButton: string;
    editButton: string;
    sentBubble: string;
    receivedBubble: string;
    headerBg: string;
  };
  spacing: {
    xxs: number;
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  typography: {
    xxs: number;
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  radii: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };
  shadows: {
    sm: ShadowStyle;
    md: ShadowStyle;
    lg: ShadowStyle;
  };
  transitions: {
    fast: string;
    normal: string;
    slow: string;
  };
};

// Light Theme (matches PatientDashboard.css)
const lightTheme: Theme = {
  colors: {
    // Base
    text: '#263238',
    textSecondary: '#666',
    primary: '#007bff', // was 25a6e9
    primaryDark: '#1B4C77',
    secondary: '#26c6da',
    error: '#ef5350',
    success: '#4caf50',
    warning: '#ff9800',
    info: '#007bff',
    background: '#f1f3f6',
    backgroundSecondary: '#e0e0e0',
    
    // Surfaces
    card: '#ffffff',
    modal: '#ffffff',
    header: '#d63b3b',
    
    // Interactive
    //border: '#dee2e6',
    border: '#e5e5ea',
    hover: 'rgba(0,0,0,0.05)',
    active: 'rgba(0,0,0,0.1)',
    disabled: '#adb5bd',
    
    // Components
    avatarBorder: '#ffffff',
    buttonPrimary: '#25a6e9',
    buttonOutline: '#25a6e9',
    cancelButton: '#ef5350',
    editButton: 'teal',
    sentBubble: '#007bff',
    receivedBubble: '#e5e5ea',
    headerBg: '#d63b3b'
  },
  spacing: {
    xxs: 4,
    xs: 6,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32
  },
  typography: {
    xxs: 10,
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32
  },
  radii: {
    xs: 4,
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
    full: 999
  },
  shadows: {
    sm: {
      elevation: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2
    },
    md: {
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4
    },
    lg: {
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 6
    }
  },
  transitions: {
    fast: '100ms ease',
    normal: '200ms ease',
    slow: '300ms ease'
  }
};

// Dark Theme
const darkTheme: Theme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    text: '#ffffff',
    textSecondary: '#adb5bd',
    background: '#121212',
    card: '#1e1e1e',
    modal: '#252525',
    border: '#333333',
    hover: 'rgba(255,255,255,0.05)',
    active: 'rgba(255,255,255,0.1)'
  }
};

// Context Setup
type ThemeContextType = {
  theme: Theme;
  toggleTheme?: () => void;
  isDark: boolean;
};

type TextInputStyle = TextStyle & {
  borderWidth?: number;
  borderColor?: string;
  borderRadius?: number;
  padding?: number;
  marginTop?: number;
  backgroundColor?: string;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  isDark: false
});

export function ThemeProvider({ 
  children,
  theme = lightTheme 
}: { 
  children: ReactNode; 
  theme?: Theme 
}) {
  return (
    <ThemeContext.Provider value={{ theme, isDark: theme === darkTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Helper function for component styles
import { ViewStyle, TextStyle, ImageStyle, StyleProp } from 'react-native';

export const makeStyles = (theme: Theme) => ({
  // ======================
  // Layout Components
  // ======================
  patientContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: 80,  // For navbar
      paddingBottom: 100  // For tabbar
  } as ViewStyle,

  // ======================
  // Cards & Containers
  // ======================
  patientCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.md
  } as ViewStyle,

  profileDetails: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.lg,
    borderRadius: theme.radii.md,
    ...theme.shadows.sm
  } as ViewStyle,

  // ======================
  // Profile Components
  // ======================
  profileHeader: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.lg,
    borderRadius: theme.radii.md,
    alignItems: 'center',
    ...theme.shadows.sm
  } as ViewStyle,

  profileField: {
    marginBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingBottom: theme.spacing.sm
  } as ViewStyle,

  // ======================
  // Images & Avatars
  // ======================
  patientAvatar: {
    width: 40,
    height: 40,
    borderRadius: theme.radii.full,
    borderWidth: 2,
    borderColor: theme.colors.avatarBorder
  } as ViewStyle,

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.avatarBorder
  } as ImageStyle,

  // ======================
  // Typography
  // ======================
  profileName: {
    fontSize: theme.typography.lg,
    fontWeight: 'bold',
    marginTop: theme.spacing.md,
    color: theme.colors.text
  } as TextStyle,

  profileRole: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sm
  } as TextStyle,

  fieldLabel: {
    fontWeight: 'bold',
    color: theme.colors.text,
    fontSize: theme.typography.md
  } as TextStyle,

  fieldValue: {
    color: theme.colors.text,
    fontSize: theme.typography.md,
    marginTop: theme.spacing.xs
  } as TextStyle,

  // ======================
  // Form Elements
  // ======================
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.sm,
    borderRadius: theme.radii.sm,
    marginTop: theme.spacing.xs,
    color: theme.colors.text,
    backgroundColor: theme.colors.background
  } as ViewStyle & { color?: string; backgroundColor?: string },


  // In your makeStyles function
textInput: {
  height: 40, // Recommended minimum height
  borderWidth: 1,
  borderColor: theme.colors.border,
  paddingHorizontal: theme.spacing.sm,
  paddingVertical: theme.spacing.xs,
  borderRadius: theme.radii.sm,
  marginTop: theme.spacing.xs,
  color: theme.colors.text,
  backgroundColor: theme.colors.background,
  fontSize: theme.typography.md,
  lineHeight: theme.typography.md * 1.5
} as TextStyle & {
  borderWidth?: number;
  borderColor?: string;
  borderRadius?: number;
  backgroundColor?: string;
},
  
  // ======================
  // Buttons
  // ======================
  buttonPrimary: {
    backgroundColor: theme.colors.buttonPrimary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radii.md
  } as ViewStyle,

  buttonOutline: {
    borderWidth: 1,
    borderColor: theme.colors.buttonOutline,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radii.md
  } as ViewStyle,

  button: {
    padding: theme.spacing.md,
    borderRadius: theme.radii.sm,
    marginTop: theme.spacing.md,
    alignItems: 'center'
  } as ViewStyle,

  editButton: {
    backgroundColor: theme.colors.primary
  } as ViewStyle,

  saveButton: {
    backgroundColor: theme.colors.success
  } as ViewStyle,

  buttonText: {
    color: 'white',
    fontWeight: '500'
  } as TextStyle,

  cancelButton: {
    backgroundColor: theme.colors.error,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radii.md
  } as ViewStyle,

  welcomeCard: {
  backgroundColor: theme.colors.card,
  borderWidth: 1,
  borderColor: theme.colors.border,
  borderRadius: theme.radii.lg,
  padding: theme.spacing.lg,
  marginBottom: theme.spacing.lg,
  ...theme.shadows.sm
} as ViewStyle,

cardTitle: {
  fontSize: theme.typography.lg,
  fontWeight: '600',
  marginBottom: theme.spacing.sm
} as TextStyle,

statCard: {
  backgroundColor: theme.colors.card,
  padding: theme.spacing.lg,
  borderRadius: theme.radii.md,
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing.md,
  ...theme.shadows.sm
} as ViewStyle
});

// Chat-specific styles
export const makeChatStyles = (theme: Theme) => ({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: theme.colors.header
  } as ViewStyle,
  doctorPanel: {
    width: 300,
    backgroundColor: theme.colors.card,
    borderRightWidth: 0.5,
    borderRightColor: theme.colors.border,
    padding: theme.spacing.md
  } as ViewStyle,
  doctorListContainer: {
    paddingBottom: theme.spacing.md
  } as ViewStyle,
  chatPanel: {
    flex: 1,
    backgroundColor: theme.colors.card
  } as ViewStyle,
  sidebarTitle: {
    fontSize: theme.typography.lg,
    marginBottom: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    textAlign: 'center',
    fontWeight: '600',
    color: theme.colors.text
  } as TextStyle,
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg
  } as ViewStyle,
  placeholder: {
    fontSize: theme.typography.md,
    textAlign: 'center',
    color: theme.colors.textSecondary
  } as TextStyle,
  // Responsive variants
  smallScreen: {
  wrapper: {
    flexDirection: 'column',
  } as ViewStyle,
  doctorPanel: {
    width: '100%',
    borderRightWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  } as ViewStyle,
  chatPanel: {
    height: '100%',
  } as ViewStyle,
  } as const,

  
});

export const makeMedicalStyles = (theme: Theme) => ({
  container: {
  flexGrow: 1,
  padding: theme.spacing.xl,
  backgroundColor: theme.colors.background,
} as ViewStyle,
  title: {
    fontSize: theme.typography.xl,
    fontWeight: 'bold',
    marginBottom: theme.spacing.lg,
    color: theme.colors.text,
  } as TextStyle,
  card: {
  // backgroundColor: theme.colors.card,
  // borderRadius: theme.radii.md,
  // padding: theme.spacing.lg,
  // marginBottom: theme.spacing.lg,
  // borderWidth: 1,
  // borderColor: theme.colors.border,
  // ...theme.shadows.sm,
  width: '100%',
  marginVertical: theme.spacing.sm,
  padding: theme.spacing.md,
  borderRadius: theme.radii.md,
  backgroundColor: theme.colors.card,
  shadowColor: theme.colors.buttonOutline,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3 // Android shadow
} as ViewStyle,

cardTitle: {
  fontSize: theme.typography.lg,
  fontWeight: '600',
  marginBottom: theme.spacing.sm,
  color: theme.colors.primaryDark,
} as TextStyle,

cardValue: {
  fontWeight: 'normal',
  color: theme.colors.text,
} as TextStyle,
  entry: {
    fontSize: theme.typography.md,
    marginBottom: theme.spacing.xs,
    color: theme.colors.text,
  } as TextStyle,
  label: {
    fontWeight: '600',
    color: theme.colors.text,
  } as TextStyle,
  emptyText: {
    textAlign: 'center',
    marginTop: theme.spacing.xxl,
    fontSize: theme.typography.lg,
    color: theme.colors.textSecondary,
  } as TextStyle,
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  } as ViewStyle,
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  } as ViewStyle,
  errorText: {
    fontSize: theme.typography.md,
    textAlign: 'center',
  } as TextStyle,
});

export const makeLoginStyles = (theme: Theme) => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#eff6ff',
  } as ViewStyle,
  formContainer: {
    marginHorizontal: theme.spacing.lg,
    padding: theme.spacing.xl,
    borderRadius: theme.radii.lg,
    backgroundColor: 'white',
    ...theme.shadows.md,
  } as ViewStyle,
  title: {
    fontSize: theme.typography.xl,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    color: '#1e40af',
  } as TextStyle,
  input: {
    height: 50,
    width: '100%', // Ensure full width
    borderWidth: 1,
    borderColor: '#93c5fd',
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    fontSize: theme.typography.md,
    color: theme.colors.text,
    backgroundColor: theme.colors.background,
  } as TextInputStyle,
  loginButton: {
    height: 50,
    width: '100%', // CRUCIAL FIX - Add width
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.radii.md,
    backgroundColor: '#1d4ed8',
    marginTop: theme.spacing.sm,
  } as ViewStyle,
  buttonPressed: {
    opacity: 0.8,
  } as ViewStyle,
  buttonDisabled: {
    backgroundColor: theme.colors.disabled,
  } as ViewStyle,
  buttonText: {
    color: 'white',
    fontSize: theme.typography.md,
    fontWeight: '600',
    padding: theme.spacing.md,
    width: '100%', // CRUCIAL FIX - Add width
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    borderRadius: theme.radii.md,
    backgroundColor: '#1d4ed8',
    marginTop: theme.spacing.sm,
    
  } as TextStyle,
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing.lg,
  } as ViewStyle,
  linkText: {
    color: '#1e40af',
    fontSize: theme.typography.sm,
    marginHorizontal: theme.spacing.sm,
  } as TextStyle,
  linkPressed: {
    opacity: 0.6,
  } as ViewStyle,
});

export const makeAppointmentStyles = (theme: Theme) => ({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
  } as ViewStyle,

  scrollContent: {
    flexGrow: 1,
    paddingTop: 80,  // For navbar
    paddingBottom: 100  // For tabbar
  } as ViewStyle,

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,

  title: {
    fontSize: theme.typography.xl,
    fontWeight: 'bold',
    marginBottom: theme.spacing.lg,
    color: theme.colors.text,
  } as TextStyle,

  emptyText: {
    textAlign: 'center',
    marginTop: theme.spacing.xl,
    fontSize: theme.typography.md,
    color: theme.colors.textSecondary,
  } as TextStyle,

  appointmentsContainer: {
    gap: theme.spacing.md,
  } as ViewStyle,

  appointmentCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
    ...theme.shadows.sm,
  } as ViewStyle,

  doctorName: {
    fontSize: theme.typography.lg,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
    color: theme.colors.text,
  } as TextStyle,

  appointmentText: {
    fontSize: theme.typography.md,
    marginBottom: theme.spacing.xs,
    color: theme.colors.text,
  } as TextStyle,

  actionsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  } as ViewStyle,

  cancelButton: {
    backgroundColor: theme.colors.error,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radii.sm,
  } as ViewStyle,

  rateButton: {
    backgroundColor: '#ffd700', // Keeping exact gold color
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radii.sm,
  } as ViewStyle,

  buttonText: {
    color: 'white',
    fontWeight: '500',
  } as TextStyle,

  buttonPressed: {
    opacity: 0.8,
  } as ViewStyle,

  buttonDisabled: {
    opacity: 0.6,
  } as ViewStyle,

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  } as ViewStyle,

  modalContent: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.lg,
  } as ViewStyle,

  modalTitle: {
    fontSize: theme.typography.lg,
    fontWeight: 'bold',
    marginBottom: theme.spacing.md,
    textAlign: 'center',
    color: theme.colors.text,
  } as TextStyle,

  ratingContainer: {
    justifyContent: 'center',
    marginVertical: theme.spacing.md,
  } as ViewStyle,

  commentInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.sm,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    minHeight: 100,
    textAlignVertical: 'top',
    color: theme.colors.text,
    backgroundColor: theme.colors.background,
  } as TextInputStyle,

  modalActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.md,
  } as ViewStyle,

  modalButton: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: theme.radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,

  cancelModalButton: {
    backgroundColor: theme.colors.textSecondary,
  } as ViewStyle,
});

// Add to themes.tsx
export const makeDoctorStyles = (theme: Theme) => ({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: theme.colors.background,
  } as ViewStyle,

  scrollContainer: {
    flexGrow: 1,
    paddingTop: 12,  // For navbar
      paddingBottom: 20,  // For tabbar
      paddingLeft: 12
  } as ViewStyle,

  title: {
    fontSize: theme.typography.xl,
    fontWeight: 'bold',
    marginBottom: theme.spacing.lg,
    color: theme.colors.text,
  } as TextStyle,

  doctorCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.sm,
    alignItems: 'center',
  } as ViewStyle,

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: theme.spacing.md,
  } as ImageStyle,

  doctorName: {
    fontWeight: 'bold',
    fontSize: theme.typography.lg,
    marginBottom: theme.spacing.xs,
    color: theme.colors.text,
  } as TextStyle,

  bookButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radii.full,
    marginTop: theme.spacing.md,
    color: 'black'
  } as ViewStyle,

  formInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    width: '100%',
  } as TextInputStyle,
});

export const makeRegisterStyles = (theme: Theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  } as ViewStyle,
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: theme.spacing.xl,
  } as ViewStyle,
  formContainer: {
    marginHorizontal: theme.spacing.lg,
    padding: theme.spacing.xl,
    borderRadius: theme.radii.lg,
    backgroundColor: theme.colors.card,
    ...theme.shadows.md,
  } as ViewStyle,
  title: {
    fontSize: theme.typography.xl,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    color: theme.colors.primary,
  } as TextStyle,
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
    gap: theme.spacing.md,
  } as ViewStyle,
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.typography.md,
    color: theme.colors.text,
    backgroundColor: theme.colors.background,
  } as TextStyle & {
    borderWidth?: number;
    borderColor?: string;
    borderRadius?: number;
    backgroundColor?: string;
  },
  fullWidthInput: {
    flex: 0,
    width: '100%',
  } as TextInputStyle,
  registerButton: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.primary,
    marginTop: theme.spacing.md,
  } as ViewStyle,
  buttonPressed: {
    opacity: 0.8,
  } as ViewStyle,
  buttonDisabled: {
    backgroundColor: theme.colors.disabled,
  } as ViewStyle,
  buttonText: {
    color: 'white',
    fontSize: theme.typography.md,
    fontWeight: '600',
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
  } as TextStyle,
  linksContainer: {
    marginTop: theme.spacing.lg,
    alignItems: 'center',
  } as ViewStyle,
  linkText: {
    color: theme.colors.primary,
    fontSize: theme.typography.sm,
  } as TextStyle,
  linkPressed: {
    opacity: 0.6,
  } as ViewStyle,
});

export const makeForgotPasswordStyles = (theme: Theme) => ({
  container: {
    flex: 1,
    backgroundColor: '#fffbeb',
  } as ViewStyle,
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: theme.spacing.xl,
  } as ViewStyle,
  formContainer: {
    marginHorizontal: theme.spacing.lg,
    padding: theme.spacing.xl,
    borderRadius: theme.radii.lg,
    backgroundColor: 'white',
    ...theme.shadows.md,
  } as ViewStyle,
  title: {
    fontSize: theme.typography.xl,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    color: '#b45309',
  } as TextStyle,
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#fcd34d',
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    fontSize: theme.typography.md,
    color: theme.colors.text,
    backgroundColor: 'white',
  } as TextStyle & {
    borderWidth?: number;
    borderColor?: string;
    borderRadius?: number;
    backgroundColor?: string;
  },
  submitButton: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.radii.md,
    marginTop: theme.spacing.sm,
    backgroundColor: '#d97706'
  } as ViewStyle,
  otpButton: {
    backgroundColor: theme.colors.warning,
  } as ViewStyle,
  resetButton: {
    backgroundColor: theme.colors.success,
  } as ViewStyle,
  buttonPressed: {
    opacity: 0.8,
  } as ViewStyle,
  buttonDisabled: {
    opacity: 0.6,
  } as ViewStyle,
  buttonText: {
    color: 'white',
    fontSize: theme.typography.md,
    fontWeight: '600',
    textAlign: 'center',
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
  } as TextStyle,
  linkText: {
    color: '#b45309',
    fontSize: theme.typography.sm,
    textAlign: 'center',
    marginTop: theme.spacing.lg,
  } as TextStyle,
  linkPressed: {
    opacity: 0.6,
  } as ViewStyle,
});

// Add to your themes.tsx file
export const makePatientHomeStyles = (theme: Theme) => ({
  // Layout
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingTop:0,
    backgroundColor: theme.colors.background,
  } as ViewStyle,

  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
      paddingBottom: 16,  // For tabbar
    backgroundColor: theme.colors.background,
  } as ViewStyle,

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  } as ViewStyle,

  welcomeText: {
    fontSize: theme.typography.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
  } as TextStyle,

  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  } as ViewStyle,

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: theme.colors.avatarBorder,
  } as ImageStyle,

  // Stats Section
  statsGrid: {
    flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  paddingHorizontal: 16,
  marginTop: 16,
  gap: 12,
  } as ViewStyle,

  statCard: {
     flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
  width: '100%',
  backgroundColor: theme.colors.card,
  padding: 8,
  borderRadius: 12,
  elevation: 2,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  maxWidth: '100%',
  overflow: 'hidden',
  } as ViewStyle,

  statCount: {
    fontSize: theme.typography.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
  } as TextStyle,
    statTextContainer: {
    flexShrink: 1,
    
  } as ViewStyle,

  statLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sm,
    flexShrink:1,
    overflow: 'hidden',
    padding: 0,
    gap: 8,
    alignItems: 'center',
    flexDirection: 'row',
  } as TextStyle,

  // Date Text
  dateText: {
    fontSize: theme.typography.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.md,
  } as TextStyle,

  // Info Cards
  infoCards: {
    gap: theme.spacing.lg,
    paddingHorizontal: 16,
    marginTop: 20,
    // marginBottom: theme.spacing.xl,
  } as ViewStyle,
  cardShadow: {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 3,
  elevation: 3,
} as ViewStyle,

  welcomeCard: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    padding: theme.spacing.lg,
    ...theme.shadows.sm,
    borderLeftWidth: 4, // Accent border
    shadowColor: '#000',
    shadowOffset: { width:0, height:1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation:2
  } as ViewStyle,

  cardTitle: {
    fontSize: theme.typography.lg,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  } as TextStyle,

  cardText: {
    fontSize: theme.typography.md,
    color: theme.colors.text,
  } as TextStyle,

  emptyText: {
    fontSize: theme.typography.md,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  } as TextStyle,
});

// Add to themes.tsx
export const makeProfileStyles = (theme: Theme) => ({
  container: {
    flexDirection: 'column',
    gap: theme.spacing.lg,
    padding: theme.spacing.lg,
  } as ViewStyle,

  leftCard: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.lg,
    borderRadius: theme.radii.lg,
    alignItems: 'center',
    maxWidth: 320,
    ...theme.shadows.sm,
  } as ViewStyle,

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: theme.spacing.md,
  } as ImageStyle,

  profileName: {
    fontSize: theme.typography.xl,
    fontWeight: 'bold',
    marginTop: theme.spacing.md,
    color: theme.colors.text,
  } as TextStyle,

  editButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.radii.sm,
    alignSelf: 'flex-end',
  } as ViewStyle,
});

export const makeReportStyles = (theme: Theme) => ({
  // Container
  container: {
    flex: 1,
    // flexDirection: 'row',
    backgroundColor: theme.colors.background,
    paddingTop: 80,  // For navbar
      paddingBottom: 100  // For tabbar
  } as ViewStyle,

  // Scroll Content
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.lg,
  } as ViewStyle,

  // Title
  title: {
    fontSize: theme.typography.xl,
    fontWeight: 'bold',
    marginBottom: theme.spacing.lg,
    color: theme.colors.text,
  } as TextStyle,

  // Upload Section
  uploadSection: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.lg,
    borderRadius: theme.radii.md,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.sm,
  } as ViewStyle,

  uploadButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.radii.sm,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  } as ViewStyle,

  uploadButtonPressed: {
    backgroundColor: theme.colors.primaryDark,
  } as ViewStyle,

  uploadButtonText: {
    color: 'white',
    fontWeight: '500',
  } as TextStyle,

  // Inputs
  textInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    color: theme.colors.text,
    backgroundColor: theme.colors.background,
  } as TextInputStyle,

  // Message
  messageSuccess: {
    color: theme.colors.success,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  } as TextStyle,

  messageError: {
    color: theme.colors.error,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  } as TextStyle,

  // Reports List
  reportsList: {
    gap: theme.spacing.md,
  } as ViewStyle,

  reportCard: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.radii.sm,
    ...theme.shadows.sm,
  } as ViewStyle,

  reportFileName: {
    fontSize: theme.typography.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  } as TextStyle,

  reportDescription: {
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  } as TextStyle,

  reportDate: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sm,
  } as TextStyle,

  // Actions
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: theme.spacing.sm,
    gap: theme.spacing.md,
  } as ViewStyle,

  actionButtonText: {
    color: theme.colors.primary,
  } as TextStyle,

  deleteButtonText: {
    color: theme.colors.error,
  } as TextStyle,

  // Empty State
  emptyText: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xl,
  } as TextStyle,

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,

  modalContent: {
    width: '90%',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
  } as ViewStyle,

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  } as ViewStyle,

  modalTitle: {
    fontSize: theme.typography.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
  } as TextStyle,

  modalCloseButton: {
    fontSize: theme.typography.xl,
  } as TextStyle,

  modalImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    marginBottom: theme.spacing.md,
  } as ImageStyle,

  shareButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.radii.sm,
    alignItems: 'center',
  } as ViewStyle,

  shareButtonText: {
    color: 'white',
    fontWeight: '500',
  } as TextStyle,
});

// Add to themes.tsx
export const makeChatBoxStyles = (theme: Theme) => ({
  // Container
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  } as ViewStyle,

  // Header
  header: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: theme.colors.card,
  } as ViewStyle,

  // Messages
  messagesContainer: {
    flex: 1,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.background,
  } as ViewStyle,

  messageContainer: {
    marginBottom: theme.spacing.sm,
  } as ViewStyle,

  sentContainer: {
    alignItems: 'flex-end',
  } as ViewStyle,

  receivedContainer: {
    alignItems: 'flex-start',
  } as ViewStyle,

  // Bubbles
  bubble: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radii.lg,
    maxWidth: '80%',
  } as ViewStyle,

  sentBubble: {
    backgroundColor: theme.colors.sentBubble,
  } as ViewStyle,

  receivedBubble: {
    backgroundColor: theme.colors.receivedBubble,
  } as ViewStyle,

  // Text
  sentText: {
    color: 'white',
    fontSize: theme.typography.md,
  } as TextStyle,

  receivedText: {
    color: theme.colors.text,
    fontSize: theme.typography.md,
  } as TextStyle,

  timeText: {
    fontSize: theme.typography.xs,
    marginTop: theme.spacing.xs,
    textAlign: 'right',
    opacity: 0.7,
    color: theme.colors.textSecondary
  } as TextStyle,

  // Input
  inputContainer: {
    flexDirection: 'row',
    padding: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    alignItems: 'center',
  } as ViewStyle,

  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    borderRadius: theme.radii.lg,
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    fontSize: theme.typography.md,
    color: theme.colors.text,
    backgroundColor: theme.colors.background,
  } as TextInputStyle,

  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
  } as ViewStyle,

  // Status
  readIndicator: {
    color: theme.colors.success,
    marginLeft: theme.spacing.xs,
    fontSize: theme.typography.sm,
  } as TextStyle,
  // Add these to makeChatBoxStyles in themes.tsx
backButton: {
  position: 'absolute',
  left: theme.spacing.md,
  padding: theme.spacing.xs,
} as ViewStyle,

headerText: {
  fontSize: theme.typography.lg,
  fontWeight: '600',
} as TextStyle,

loadingContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
} as ViewStyle,

messagesContent: {
  paddingVertical: theme.spacing.sm,
  paddingHorizontal: theme.spacing.md,
} as ViewStyle,

disabledButton: {
  opacity: 0.6,
} as ViewStyle,
});

export const makeDoctorListStyles = (theme: Theme) => ({
  container: {
    flex: 1,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.background,
  } as ViewStyle,

  doctorItem: {
    padding: theme.spacing.md,
    borderRadius: theme.radii.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    ...theme.shadows.sm,
  } as ViewStyle,

  doctorItemPressed: {
    backgroundColor: theme.colors.hover,
  } as ViewStyle,

  doctorName: {
    fontSize: theme.typography.md,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  } as TextStyle,

  doctorSpecialty: {
    fontSize: theme.typography.sm,
    color: theme.colors.textSecondary,
  } as TextStyle,

  selectedDoctorName: {
    color: 'white',
  } as TextStyle,

  selectedDoctorText: {
    color: 'rgba(255,255,255,0.8)',
  } as TextStyle,

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  } as ViewStyle,

  errorText: {
    fontSize: theme.typography.md,
    color: theme.colors.error,
    textAlign: 'center',
  } as TextStyle,
});

// Add to themes.tsx
export const makeVerifyEmailStyles = (theme: Theme) => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f0fdf4', // bg-green-50
  } as ViewStyle,
  card: {
    marginHorizontal: 24, // lg spacing
    padding: 40, // xl spacing
    borderRadius: 12, // lg radius
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5, // Android shadow
  } as ViewStyle,
  title: {
    fontSize: 24, // xl typography
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16, // md spacing
    color: '#166534', // text-green-800
  } as TextStyle,
  subtitle: {
    fontSize: 14, // sm typography
    textAlign: 'center',
    marginBottom: 32, // xl spacing
    color: '#6b7280', // text-gray-500
  } as TextStyle,
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#86efac', // border-green-300
    borderRadius: 8, // md radius
    paddingHorizontal: 16, // md spacing
    marginBottom: 24, // lg spacing
    fontSize: 16, // md typography
    color: '#1f2937', // text-gray-800
    backgroundColor: 'white',
  } as TextInputStyle,
  button: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8, // md radius
    backgroundColor: '#15803d', // bg-green-700
  } as ViewStyle,
  buttonPressed: {
    opacity: 0.8,
    backgroundColor: '#166534', // bg-green-800 (hover)
  } as ViewStyle,
  buttonDisabled: {
    opacity: 0.6,
  } as ViewStyle,
  buttonText: {
    color: 'white',
    fontSize: 16, // md typography
    fontWeight: '600',
  } as TextStyle,
});

export const makeDoctorSidebarStyles = (theme: Theme)=>({
  container: {
    width: 240,
    height: '100%',
    backgroundColor: '#1e293b',
    paddingVertical: 32,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  } as ViewStyle,
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    color: '#38bdf8',
    marginBottom: 32,
  } as TextStyle,
  nav: {
    flexDirection: 'column',
    gap: 12,
  } as ViewStyle,
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    fontSize: 16,
    color: '#cbd5e1',
  } as ViewStyle & {
    fontSize?: number;
    color?: string;
  },
  activeLink: {
    backgroundColor: '#38bdf8',
    color: '#1e293b',
    fontWeight: '600',
  } as ViewStyle & {
    color?: string;
    fontWeight?: TextStyle['fontWeight'];
  },
});
// Type exports
export type { Theme };