import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { DefaultTheme, MD3Theme, PaperProvider } from 'react-native-paper';

import RootStack from './navigation/RootStack';

export const theme: MD3Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#3b82f6",
    secondary: "e5e7eb",
    secondaryContainer: "#e5e7eb",
    surfaceVariant: "#e5e7eb",
  },
  roundness: 8
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <StatusBar style="auto" />
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
    </PaperProvider>
  );
}