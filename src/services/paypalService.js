

export const createPayment = async (amount) => {
  try {
    const res = await fetch('https://tu-backend.com/paypal/create-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error creando pago con PayPal:', error);
  }
};
