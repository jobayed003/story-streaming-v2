import { loadStripe } from '@stripe/stripe-js';

let stripePromise;

const initializeStripe = async () => {
  if (!stripePromise) {
    stripePromise = await loadStripe(
      'pk_test_51M4RdvBSRclYDGVltxADAvX6SZ7oCITDY5bEhLiV9ByLVfx8iuiuiMrstWZd9x8A2c1wS8A5vPyIRI1BXbS10NDg00anW6lO8u'
    );
  }
  return stripePromise;
};
export default initializeStripe;
