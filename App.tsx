import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';

let IS_DARK_MODE = false;

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  IS_DARK_MODE = isDarkMode;

  return (
    <SafeAreaView style={styles.app}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={styles.app.backgroundColor}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  app: {
    backgroundColor: IS_DARK_MODE ? '#000' : '#fff',
  },
  container: {
    marginTop: 32,
    paddingHorizontal: 24,
    fontWeight: '700',
  },
});

export default App;
