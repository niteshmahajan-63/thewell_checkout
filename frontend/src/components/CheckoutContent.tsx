import React from 'react'
import CheckoutHeader from './CheckoutHeader'
import PaymentForm from './PaymentForm'
import { useCheckoutContext } from '../contexts/CheckoutContext';
import Expired from './Expired';

const CheckoutContent: React.FC = () => {
    const { deactivatedLink, clientSecret } = useCheckoutContext();

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
            <PaymentForm />
        </div>
    );
}

export default CheckoutContent