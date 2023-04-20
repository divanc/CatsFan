import React, {useEffect, useRef, useState} from 'react';
import {Card} from './Card';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  AdaptyError,
  AdaptyPaywall,
  AdaptyProduct,
  adapty,
} from 'react-native-adapty';

interface CardPaywallProps {
  onSwipeCompleted?: (direction: string) => void;
  paywall: Promise<AdaptyPaywall>;
  products: Promise<AdaptyProduct[]>;
}

export function CardPaywall(props: CardPaywallProps): JSX.Element {
  const [isLoading, setIsLoading] = useState(true);
  const [paywall, setPaywall] = useState<AdaptyPaywall>();
  const [products, setProducts] = useState<AdaptyProduct[]>([]);
  const [error, setError] = useState<AdaptyError | null>(null);
  const [isLocked, setIsLocked] = useState(true);

  const card = useRef<any>(null);

  useEffect(() => {
    async function fetch() {
      try {
        setError(null);
        const paywallResult = await props.paywall;
        const productsResult = await props.products;

        // log paywall opened
        adapty.logShowPaywall(paywallResult);

        setPaywall(paywallResult);
        setProducts(productsResult);
      } catch (error) {
        setError(error as AdaptyError);
      } finally {
        setIsLoading(false);
      }
    }

    fetch();
  }, []);

  async function tryPurchase(product: AdaptyProduct) {
    try {
      await adapty.makePurchase(product);
      setIsLocked(false);

      // wait until card is unlocked :(
      setTimeout(() => {
        card.current.swipe('left');
      }, 100);
    } catch (error) {
      setError(error as AdaptyError);
    }
  }

  const renderContent = (): React.ReactNode => {
    if (isLoading) {
      return <Text style={styles.titleText}>Loading...</Text>;
    }
    if (error) {
      return <Text style={styles.titleText}>{error.message}</Text>;
    }

    if (!paywall) {
      return <Text style={styles.titleText}>Paywall not found</Text>;
    }
    return (
      <View>
        <Text style={styles.titleText}>{paywall?.name}</Text>
        <Text style={styles.descriptionText}>
          Join to get unlimited access to images of cats
        </Text>

        <View style={styles.productListContainer}>
          {products.map(product => (
            <TouchableOpacity
              key={product.vendorProductId}
              activeOpacity={0.5}
              onPress={() => tryPurchase(product)}>
              <View style={styles.productContainer}>
                <Text style={styles.productTitleText}>
                  {product.localizedTitle}
                </Text>
                <Text style={styles.productPriceText}>
                  {product.localizedPrice}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <Card
      onSwipeCompleted={props.onSwipeCompleted}
      synthetic={isLocked}
      preventSwipe={['up', 'left', 'down', 'right']}
      ref={card}>
      {renderContent()}
    </Card>
  );
}

const styles = StyleSheet.create({
  titleText: {
    color: 'white',
    fontSize: 16,
    paddingLeft: 10,
    fontWeight: '500',
  },
  descriptionText: {
    color: 'white',
    marginTop: 8,
    marginBottom: 8,
    paddingLeft: 10,
    maxWidth: 210,
  },
  productListContainer: {
    marginTop: 8,
    width: '100%',
  },
  productContainer: {
    marginTop: 8,
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#0A84FF',
  },
  productTitleText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    flexGrow: 1,
    marginRight: 32,
  },
  productPriceText: {
    color: '#FF9F0A',
    fontWeight: '500',
    fontSize: 16,
  },
});
