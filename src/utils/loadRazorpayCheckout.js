const razorpayScriptUrl = 'https://checkout.razorpay.com/v1/checkout.js';

export function loadRazorpayCheckout() {
  if (window.Razorpay) {
    return Promise.resolve(window.Razorpay);
  }

  const existingScript = document.querySelector(`script[src="${razorpayScriptUrl}"]`);

  if (existingScript) {
    return new Promise((resolve, reject) => {
      existingScript.addEventListener('load', () => resolve(window.Razorpay), { once: true });
      existingScript.addEventListener('error', () => reject(new Error('Unable to load Razorpay Checkout')), {
        once: true,
      });
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = razorpayScriptUrl;
    script.async = true;

    script.onload = () => {
      if (window.Razorpay) {
        resolve(window.Razorpay);
        return;
      }

      reject(new Error('Razorpay Checkout did not initialize'));
    };

    script.onerror = () => {
      reject(new Error('Unable to load Razorpay Checkout'));
    };

    document.body.appendChild(script);
  });
}
