export const env = {
    STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
    API_URL: import.meta.env.VITE_API_URL || '',
    SOCKET_URL: import.meta.env.VITE_SOCKET_URL || 'https://checkout.thewell.solutions/payments',
};
