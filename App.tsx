import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { theme } from './styles/theme';

import RootStack from './navigation/RootStack';

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