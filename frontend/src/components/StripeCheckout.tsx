import React from 'react'
import { Button } from './ui/button'
import {
    Elements,
    PaymentElement
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import type { Appearance as StripeAppearance, StripeElementsOptions } from '@stripe/stripe-js'
import { env } from '../config/env'
import { useCheckoutContext } from '../contexts/CheckoutContext'
import { downloadInvoice } from '../services/checkoutService'

interface Appearance extends StripeAppearance {
    layout?: {
        type: 'tabs' | 'accordion' | 'spacedAccordionItems';
        defaultCollapsed?: boolean;
    };
}

const stripePromise = loadStripe(env.STRIPE_PUBLISHABLE_KEY);

const CheckoutForm: React.FC = () => {
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    }

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-4 sm:mb-6 max-w-lg mx-auto">
                <div className="border border-gray-300 rounded-md p-3 sm:p-4 bg-white shadow-sm transition-all hover:shadow">
                    <PaymentElement
                        options={{
                            layout: {
                                type: 'tabs',
                                defaultCollapsed: false,
                                radios: false,
                                spacedAccordionItems: false
                            },
                            paymentMethodOrder: ['card', 'us_bank_account', 'customer_balance'],
                        }}
                    />
                </div>
            </div>

            <div className="max-w-lg mx-auto">
                <Button
                    type="submit"
                    className={`px-6 py-3 w-full rounded-md font-medium transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg`}
                    style={{
                        backgroundColor: '#BE9E44',
                        color: '#fff',
                    }}
                >
                    Pay Now
                </Button>
            </div>
        </form>
    );
};

const StripeCheckout: React.FC = () => {
    const { recordId, amount, clientSecret, error } = useCheckoutContext();
    

    const appearance: Appearance = {
        theme: 'flat',
        variables: {
            fontFamily: ' "Gill Sans", sans-serif',
            fontLineHeight: '1.5',
            borderRadius: '10px',
            colorBackground: '#F6F8FA',
            accessibleColorOnColorPrimary: '#262626'
        },
        layout: {
            type: 'tabs',
            defaultCollapsed: false,
        },
        rules: {
            '.Block': {
                backgroundColor: 'var(--colorBackground)',
                boxShadow: 'none',
                padding: '12px'
            },
            '.Input': {
                padding: '12px'
            },
            '.Input:disabled, .Input--invalid:disabled': {
                color: 'lightgray'
            },
            '.Tab': {
                padding: '10px 12px 8px 12px',
                border: 'none'
            },
            '.Tab:hover': {
                border: 'none',
                boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)'
            },
            '.Tab--selected, .Tab--selected:focus, .Tab--selected:hover': {
                border: 'none',
                backgroundColor: '#fff',
                boxShadow: '0 0 0 1.5px var(--colorPrimaryText), 0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)'
            },
            '.Label': {
                fontWeight: '500'
            }
        }
    };

    const options: StripeElementsOptions = {
        clientSecret: clientSecret || '',
        appearance,
    };

    const handleDownloadInvoice = async () => {
        try {
            const data = await downloadInvoice(recordId);
            if (data) {
                window.open(data.data, '_blank');
            } else {
                console.error('Could not download invoice. Please contact support.');
            }
        } catch (err) {
            console.error('Error downloading invoice:', err);
        }
    };

    return (
        <div className="w-full min-h-screen flex flex-col lg:flex-row bg-gray-50 overflow-x-hidden">
            {/* Left Panel */}
            <div className="w-full lg:w-1/2 flex flex-col py-3 px-4 sm:px-5 relative bg-white">
                {/* Rest of the content centered */}
                <div className="flex flex-1">
                    <div className="flex flex-col items-center justify-center w-full">
                        {/* Logo - Aligned with image left edge */}
                        <div className="mb-8 lg:mb-20 w-full max-w-[30rem] px-4 sm:px-0 text-left">
                            <div className="flex items-center">
                                <div className="flex items-center justify-center w-20 h-20 sm:w-30 sm:h-30 bg-black rounded-lg mr-2 p-3 sm:p-4">
                                    <img src="/thewell-logo.png" alt="The Well Logo" className="h-12 w-12 sm:h-16 sm:w-16 rounded" />
                                </div>
                                <span className="text-black text-xl sm:text-2xl font-semibold tracking-tight">
                                    THE WELL
                                </span>
                            </div>
                        </div>

                        {/* Plan Information - Aligned with image left edge */}
                        <div className="mb-8 w-full max-w-[30rem] px-4 sm:px-0 text-left">
                            <div className="inline-flex items-center py-1 rounded-full bg-white/10 mb-3">
                                <span className="text-black text-sm font-medium">{'Company'}</span>
                            </div>
                            <div className="flex items-baseline justify-start">
                                <span className="text-xl sm:text-2xl font-bold text-black leading-none">
                                    ${amount ? Number(amount).toFixed(2) : '0.00'}
                                </span>
                            </div>
                        </div>

                        {/* Center Section - Large Visual Card */}
                        <div className="flex items-center justify-center mb-6 relative w-full px-4 sm:px-0">
                            <img
                                src="/78792.jpg"
                                alt="Visual Card"
                                className="w-full max-w-[30rem] h-auto aspect-[16/9] object-cover rounded-2xl shadow-2xl border border-white/20 bg-white/10 backdrop-blur-sm"
                            />
                            <button
                                className="absolute top-4 left-1/2 transform -translate-x-1/2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-lg transition-all duration-200 text-sm sm:text-base font-medium"
                                style={{
                                    backgroundColor: '#BE9E44',
                                    color: '#fff',
                                    transition: 'background-color 0.2s ease-in-out'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#967D35'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#BE9E44'}
                                onClick={handleDownloadInvoice}
                            >
                                Download Invoice
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            {/* Right Panel */}
            <div className="w-full lg:w-1/2 flex flex-col justify-start lg:justify-center px-4 sm:px-8 py-4 bg-white min-h-screen overflow-y-auto">
                <div className="max-w-lg mx-auto w-full px-4 sm:px-0">
                    {/* Header */}
                    <div className="mb-4">
                        <h1 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 leading-tight">
                            Complete Your Payment
                        </h1>
                        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                            Your payment receipt will be ready to download after you complete the payment.
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-2 sm:p-3 mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
                            <div className="flex items-start">
                                <svg className="h-3 w-3 sm:h-4 sm:w-4 text-red-400 mr-2 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <div>
                                    <span className="font-medium text-xs sm:text-sm">Payment Error</span>
                                    <p className="mt-1 text-xs sm:text-sm">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Payment Form */}
                    {!clientSecret ? (
                        <div className="flex flex-col items-center justify-center py-4 sm:py-6">
                            <div className="relative">
                                <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-2 border-gray-200 border-t-well-primary"></div>
                                <div className="absolute inset-0 rounded-full border-2 border-gray-100"></div>
                            </div>
                            <p className="mt-3 text-gray-500 text-xs sm:text-sm">Initializing secure payment...</p>
                        </div>
                    ) : (
                        <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200">
                            <Elements stripe={stripePromise} options={options}>
                                <CheckoutForm />
                            </Elements>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StripeCheckout