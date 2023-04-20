import {useRef, useState} from 'react';
import {AdaptyPaywall, AdaptyProduct, adapty} from 'react-native-adapty';
import {fetchImages} from './images';
import {MY_PAYWALL_ID} from './credentials';
import {getLastViewedAt, getTodayViews, recordView} from './helpers';

type CardInfo =
  | {type: 'image'; id: string; url: string}
  | {
      type: 'paywall';
      id: string;
      paywall: Promise<AdaptyPaywall>;
      products: Promise<AdaptyProduct[]>;
    };

interface CardsResult {
  cards: CardInfo[];
  fetchMore: (currentCard?: CardInfo) => Promise<void>;
  removeCard: (card: CardInfo, index: number) => void;
  init: () => Promise<void>;
}

// When to start fetching new data
export const TOLERANCE = 2;
// Where to insert a paywall
export const PAYWALL_POSITION = 2;

export function useCards(): CardsResult {
  const [cards, setCards] = useState<CardsResult['cards']>([]);
  const page = useRef<number>(0);
  const shouldPresentPaywall = useRef<boolean>(true);
  const sessionViews = useRef<number>(0);
  const lastViewedAt = useRef<number | null>(null); // Date timestamp

  const init = async () => {
    sessionViews.current = await getTodayViews();
    console.log('sessionViews.current', sessionViews.current);
    lastViewedAt.current = await getLastViewedAt();
    console.log('lastViewedAt.current', lastViewedAt.current);

    await fetchMore();
  };

  const removeCard = async (card: CardInfo, index: number) => {
    sessionViews.current += 1;
    recordView(sessionViews.current);

    if (index === TOLERANCE) {
      fetchMore(card);
    }
  };

  const fetchMore = async (currentCard?: CardInfo) => {
    const images = await fetchImages(page.current);

    const result = images.map<CardInfo>(value => {
      return {
        type: 'image',
        // // CatAPI returns duplicates, so we mark them with page number, so React keys are unique
        id: page.current + '__' + value.id,
        url: value.url,
      };
    });

    const requestedAtIndex = cards.findIndex(v => v.id === currentCard?.id);
    const newCards = [...result, ...cards.slice(0, requestedAtIndex)];

    // insert a paywall at the third position, if user is not subscribed
    if (shouldPresentPaywall) {
      const paywallPromise = adapty.getPaywall(MY_PAYWALL_ID);
      const productsPromise = paywallPromise.then(paywall =>
        adapty.getPaywallProducts(paywall),
      );

      // viewing is from the last to first
      const index =
        newCards.length - Math.max(PAYWALL_POSITION - sessionViews.current, 0);
      newCards.splice(index, 0, {
        type: 'paywall',
        id: 'paywall_' + page.current,
        paywall: paywallPromise,
        products: productsPromise,
      });
    }

    console.log('commiting', newCards);

    page.current += 1;
    setCards(newCards);
  };

  return {
    cards,
    init,
    fetchMore,
    removeCard,
  };
}
