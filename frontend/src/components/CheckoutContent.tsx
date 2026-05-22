import React from 'react'
import CheckoutHeader from './CheckoutHeader'
import PaymentForm from './PaymentForm'
import { useCheckoutContext } from '../contexts/CheckoutContext';
import Expired from './Expired';
import NextAction from './NextAction';

const CheckoutContent: React.FC = () => {
    const { deactivatedLink, clientSecret, isLoading, nextAction } = useCheckoutContext();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-16">
				<div className="flex items-center space-x-3">
					<div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#BE9E44', borderTopColor: 'transparent' }}></div>
					<span style={{ color: '#C2BDB4', fontFamily: '"Inter", sans-serif', letterSpacing: '0.05em' }}>Loading...</span>
				</div>
			</div>
        );
    }

    if (deactivatedLink === null || deactivatedLink === undefined) {
        return null;
    }

    if (deactivatedLink === 'true') {
        return <Expired />;
    }

    if (!clientSecret) {
        return null;
    }

    return (
        <div className="space-y-8">
            <CheckoutHeader />
            {nextAction? <NextAction /> : <PaymentForm />}
        </div>
    );
}

export default CheckoutContent