import React from 'react'
import CheckoutHeader from './CheckoutHeader'
import PaymentForm from './PaymentForm'

const CheckoutContent: React.FC = () => {
    return (
        <div className="space-y-8">
            <CheckoutHeader />
            <PaymentForm />
        </div>
    )
}

export default CheckoutContent