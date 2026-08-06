const razorpayScriptUrl = 'https://checkout.razorpay.com/v1/checkout.js';

export function loadRazorpayCheckout() {
  if (window.Razorpay) {
    return Promise.resolve(true);
  }

  const existingScript = document.querySelector(`script[src="${razorpayScriptUrl}"]`);

  if (existingScript) {
    if (existingScript.dataset.razorpayLoaded === 'true') {
      return window.Razorpay
        ? Promise.resolve(true)
        : Promise.reject(new Error('Razorpay Checkout could not be loaded. Check your internet connection and try again.'));
    }

    return new Promise((resolve, reject) => {
      existingScript.addEventListener(
        'load',
        () => {
          if (window.Razorpay) {
            resolve(true);
            return;
          }
          reject(new Error('Razorpay Checkout could not be loaded. Check your internet connection and try again.'));
        },
        { once: true },
      );
      existingScript.addEventListener('error', () => reject(new Error('Razorpay Checkout could not be loaded. Check your internet connection and try again.')), {
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
        resolve(true);
        return;
      }

      reject(new Error('Razorpay Checkout could not be loaded. Check your internet connection and try again.'));
    };

    script.onerror = () => {
      script.remove();
      reject(new Error('Razorpay Checkout could not be loaded. Check your internet connection and try again.'));
    };

    document.body.appendChild(script);
  });
}
