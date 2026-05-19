import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';

import RootStack from './navigation/RootStack';
import { themeSchemes } from './styles/themeSchemes';

export default function App() {
  return (
    <PaperProvider theme={themeSchemes.defaultBlue}>
      <StatusBar style="auto" />
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
    </PaperProvider>
  );
}