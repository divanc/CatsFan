import {useRef, useState} from 'react';
import {fetchImages} from './images';

type CardInfo =
  | {type: 'image'; id: string; url: string}
  | {type: 'paywall'; id: string; paywallId: string};

interface CardsResult {
  cards: CardInfo[];
  fetchMore: (currentCard?: CardInfo) => Promise<void>;
  removeCard: (card: CardInfo, index: number) => void;
}

// When to start fetching new data
export const TOLERANCE = 2;

export function useCards(): CardsResult {
  const [cards, setCards] = useState<CardsResult['cards']>([]);
  const page = useRef<number>(0);

  const removeCard = async (card: CardInfo, index: number) => {
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

    page.current += 1;
    setCards(newCards);
  };

  return {
    cards,
    fetchMore,
    removeCard,
  };
}
