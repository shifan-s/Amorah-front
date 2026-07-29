const razorpayScriptUrl = 'https://checkout.razorpay.com/v1/checkout.js';

export function loadRazorpayCheckout() {
  if (window.Razorpay) {
    return Promise.resolve(window.Razorpay);
  }

  const existingScript = document.querySelector(`script[src="${razorpayScriptUrl}"]`);

  if (existingScript) {
    if (existingScript.dataset.razorpayLoaded === 'true') {
      return window.Razorpay
        ? Promise.resolve(window.Razorpay)
        : Promise.reject(new Error('Razorpay Checkout script failed to load'));
    }

    return new Promise((resolve, reject) => {
      existingScript.addEventListener(
        'load',
        () => {
          if (window.Razorpay) {
            resolve(window.Razorpay);
            return;
          }
          reject(new Error('Razorpay Checkout script failed to load'));
        },
        { once: true },
      );
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
      script.dataset.razorpayLoaded = 'true';
      if (window.Razorpay) {
        resolve(window.Razorpay);
        return;
      }

      reject(new Error('Razorpay Checkout script failed to load'));
    };

    script.onerror = () => {
      reject(new Error('Unable to load Razorpay Checkout'));
    };

    document.body.appendChild(script);
  });
}
