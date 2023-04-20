import AsyncStorage from '@react-native-async-storage/async-storage';

// How many cards user have swiped
export const KEY_TODAY_VIEWS = '@views';
// When user last swiped a card (timestamp)
export const KEY_VIEWED_AT = '@viewed_at';
// Does user have premium
export const IS_PREMIUM = '@is_premium';

export async function getIsPremium(): Promise<boolean> {
  const isPremium = await AsyncStorage.getItem(IS_PREMIUM);
  return isPremium === 'true';
}

export async function setIsPremium(isPremium: boolean): Promise<void> {
  await AsyncStorage.setItem(IS_PREMIUM, isPremium.toString());
}

export async function getTodayViews(): Promise<number> {
  const lastViewTs = await AsyncStorage.getItem(KEY_VIEWED_AT);
  const now = Date.now();

  if (!lastViewTs) {
    return 0;
  }
  const diff = now - parseInt(lastViewTs, 10);
  // If it's been more than a day since last view, reset views
  if (diff > 24 * 60 * 60 * 1000) {
    await AsyncStorage.setItem(KEY_TODAY_VIEWS, '0');
    return 0;
  }

  const views = await AsyncStorage.getItem(KEY_TODAY_VIEWS);
  if (views) {
    return parseInt(views, 10);
  }

  return 0;
}

export async function getLastViewedAt(): Promise<number | null> {
  const lastViewTs = await AsyncStorage.getItem(KEY_VIEWED_AT);
  if (lastViewTs) {
    return parseInt(lastViewTs, 10);
  }

  return null;
}

export async function recordView(viewsAmount: number): Promise<void> {
  await AsyncStorage.setItem(KEY_VIEWED_AT, Date.now().toString());
  await AsyncStorage.setItem(KEY_TODAY_VIEWS, viewsAmount.toString());
}
