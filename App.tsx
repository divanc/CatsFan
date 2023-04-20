import React, {useEffect, useMemo} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import {activateAdapty} from './adapty';

import {useCards} from './data';
import {CardImage} from './CardImage';
import {CardPaywall} from './CardPaywall';

activateAdapty();
function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const styles = useMemo(() => getStyles(isDarkMode), [isDarkMode]);

  const {cards, init, removeCard} = useCards();

  useEffect(() => {
    init(); // fetch initial cards
  }, []);

  return (
    <SafeAreaView style={styles.app}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={styles.app.backgroundColor}
      />

      <Text style={styles.headerText}>CatsFan</Text>
      <View style={styles.cardsContainer}>
        {cards.map((card, index) => {
          switch (card.type) {
            case 'paywall':
              return (
                <CardPaywall
                  key={card.id}
                  onSwipeCompleted={() => {}}
                  paywall={card.paywall}
                  products={card.products}
                />
              );
            case 'image':
              return (
                <CardImage
                  key={card.id}
                  onSwipeCompleted={() => removeCard(card, index)}
                  url={card.url}
                />
              );
          }
        })}
      </View>
    </SafeAreaView>
  );
}

function getStyles(dark: boolean) {
  return StyleSheet.create({
    app: {
      backgroundColor: dark ? 'rgb(44,44,46)' : '#fff',
      width: '100%',
      height: '100%',
    },
    headerText: {
      fontWeight: '700',
      fontSize: 32,
      marginHorizontal: 24,
      marginTop: 24,
      marginBottom: 12,
      color: dark ? '#fff' : '#000',
    },
    container: {
      marginTop: 32,
      paddingHorizontal: 24,
      fontWeight: '700',
    },
    cardsContainer: {
      width: '100%',
      paddingHorizontal: 12,
      height: 500,
    },
  });
}

export default App;
