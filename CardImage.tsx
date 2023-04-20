import React from 'react';
import {Card} from './Card';
import {Image, StyleSheet} from 'react-native';

interface CardImageProps {
  onSwipeCompleted?: (direction: string) => void;
  url: string;
}

export function CardImage(props: CardImageProps): JSX.Element {
  return (
    <Card onSwipeCompleted={props.onSwipeCompleted}>
      <Image style={styles.image} source={{uri: props.url}} />
    </Card>
  );
}

const styles = StyleSheet.create({
  image: {width: '100%', height: 500, borderRadius: 12},
});
