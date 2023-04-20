import React, {PropsWithChildren, useMemo} from 'react';
import {StyleSheet, View, useColorScheme} from 'react-native';
import TinderCard from 'react-tinder-card';

type CardProps = PropsWithChildren<{
  onSwipeCompleted?: (direction: string) => void;
  onLeftScreen?: (id: string) => void;
  preventSwipe?: string[];
}>;

export const CARD_RADIUS = 12;

export function Card({
  children,
  preventSwipe = ['top', 'bottom'],
  onSwipeCompleted = () => undefined,
  onLeftScreen = () => undefined,
}: CardProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const styles = useMemo(() => getStyles(isDarkMode), [isDarkMode]);

  return (
    <TinderCard
      onSwipe={onSwipeCompleted}
      onCardLeftScreen={onLeftScreen}
      preventSwipe={preventSwipe}>
      <View style={styles.container}>{children}</View>
    </TinderCard>
  );
}

function getStyles(dark: boolean) {
  return StyleSheet.create({
    container: {
      position: 'absolute',
      backgroundColor: dark ? '#rgb(28,28,30)' : '#ddd',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',

      height: 500,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: CARD_RADIUS,
      borderRadius: CARD_RADIUS,
      resizeMode: 'cover',
    },
  });
}
