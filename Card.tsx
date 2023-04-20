import React, {ForwardedRef, PropsWithChildren, useMemo} from 'react';
import {StyleSheet, View, useColorScheme} from 'react-native';
import TinderCard from 'react-tinder-card';

type CardProps = PropsWithChildren<{
  onSwipeCompleted?: (direction: string) => void;
  onLeftScreen?: (id: string) => void;
  preventSwipe?: string[];
  synthetic?: boolean;
}>;

export const CARD_RADIUS = 12;

export const Card = React.forwardRef<any, CardProps>(
  (
    {
      children,
      preventSwipe = ['up', 'down'],
      onSwipeCompleted = () => undefined,
      onLeftScreen = () => undefined,
      synthetic = false,
    }: CardProps,
    ref: ForwardedRef<any>,
  ) => {
    const isDarkMode = useColorScheme() === 'dark';
    const styles = useMemo(() => getStyles(isDarkMode), [isDarkMode]);

    // if synthetic, we don't want to use the tinder card,
    // as it will cause issues with the pressables
    if (synthetic) {
      return (
        <View style={{...styles.container, marginLeft: 12}}>{children}</View>
      );
    }

    return (
      <TinderCard
        ref={ref}
        onSwipe={onSwipeCompleted}
        onCardLeftScreen={onLeftScreen}
        preventSwipe={preventSwipe}>
        <View style={styles.container}>{children}</View>
      </TinderCard>
    );
  },
);

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
