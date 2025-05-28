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
    primary: '#25a6e9',
    primaryDark: '#1B4C77',
    secondary: '#26c6da',
    error: '#ef5350',
    success: '#4caf50',
    warning: '#ff9800',
    info: '#007bff',
    background: '#f1f3f6',
    
    // Surfaces
    card: '#ffffff',
    modal: '#ffffff',
    header: '#ffffff',
    
    // Interactive
    border: '#dee2e6',
    hover: 'rgba(0,0,0,0.05)',
    active: 'rgba(0,0,0,0.1)',
    disabled: '#adb5bd',
    
    // Components
    avatarBorder: '#ffffff',
    buttonPrimary: '#25a6e9',
    buttonOutline: '#25a6e9',
    cancelButton: '#ef5350',
    editButton: 'teal'
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
    backgroundColor: theme.colors.background
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
    borderRadius: theme.radii.full,
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
  } as ViewStyle
});

// Chat-specific styles
export const makeChatStyles = (theme: Theme) => ({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: theme.colors.background
  } as ViewStyle,
  doctorPanel: {
    width: 300,
    backgroundColor: theme.colors.card,
    borderRightWidth: 0.5,
    borderRightColor: theme.colors.border
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
      flexDirection: 'column'
    } as ViewStyle,
    doctorPanel: {
      width: '100%'
    } as ViewStyle
  }
});

export const makeMedicalStyles = (theme: Theme) => ({
  container: {
    flexGrow: 1,
    padding: theme.spacing.lg,
  } as ViewStyle,
  title: {
    fontSize: theme.typography.xl,
    fontWeight: 'bold',
    marginBottom: theme.spacing.lg,
    color: theme.colors.text,
  } as TextStyle,
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  } as ViewStyle,
  cardTitle: {
    fontSize: theme.typography.lg,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
    color: theme.colors.primary,
  } as TextStyle,
  cardValue: {
    color: theme.colors.text,
    fontWeight: 'normal',
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
    marginTop: theme.spacing.xl,
    fontSize: theme.typography.md,
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
    backgroundColor: theme.colors.background,
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
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    fontSize: theme.typography.md,
    color: theme.colors.text,
    backgroundColor: theme.colors.background,
  } as TextInputStyle,
  loginButton: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.primary,
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
  } as TextStyle,
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing.lg,
  } as ViewStyle,
  linkText: {
    color: theme.colors.primary,
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
    padding: theme.spacing.lg,
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
    backgroundColor: theme.colors.primary,
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
    backgroundColor: 'rgba(0,0,0,0.5)',
  } as ViewStyle,

  modalContent: {
    width: '90%',
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
    justifyContent: 'space-around',
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
// Type exports
export type { Theme };