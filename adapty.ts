import {adapty} from 'react-native-adapty';
import {MY_API_KEY} from './credentials';

export async function activateAdapty() {
  try {
    await adapty.activate(MY_API_KEY, {
      lockMethodsUntilReady: true,
    });
  } catch (error) {
    console.error('Failed to activate Adapty: ', error);
  }
}
