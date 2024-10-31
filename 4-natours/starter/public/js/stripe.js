import axios from 'axios';
import { showAlert } from './alerts';

const stripe = new Stripe(
  'pk_test_51QE99YLw9CUIvBGgh7MBiHxxlWaZdLWDJP0SNbFcR8dxq9GkvCMIpGIuhOLhdAm3uTrTVUYaD03lrZxEeNgtkYE000gjecQnCi'
);

export const bookTour = async (tourId) => {
  try {
    //   // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    //   // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
    // console.log(session);
    // window.location.replace(session.data.session.url);
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
