import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { DefaultTheme, MD3Theme, PaperProvider } from 'react-native-paper';

import RootStack from './navigation/RootStack';

const theme: MD3Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#f97316",
    surfaceVariant: "#e5e7eb",
    secondary: "#e5e7eb"
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