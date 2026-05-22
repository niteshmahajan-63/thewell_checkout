import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import StripeCheckout from './StripeCheckout'
import { useCheckoutContext } from '../contexts/CheckoutContext';
import CheckoutSucess from './CheckoutSucess';

const PaymentForm: React.FC = () => {
    const { completed, recordId } = useCheckoutContext();

    return (
        <>
            {completed ? (
                <CheckoutSucess recordId={recordId} />
            ) : (
                <div className="w-full mx-auto space-y-8">
                    <Card
                        className="w-full overflow-hidden"
                        style={{
                            backgroundColor: '#272727',
                            border: '1px solid #9A7F36',
                            borderTopWidth: '2px',
                            borderTopColor: '#BE9E44',
                        }}
                    >
                        <CardHeader className="bg-well-gold w-full">
                            <CardTitle className="text-center text-[#1A1A1A] font-bold text-xl">
                                Complete Your Payment
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 min-h-[400px] flex items-center justify-center w-full" style={{ backgroundColor: '#F8F5F0' }}>
                            {completed ? (
                                <CheckoutSucess recordId={recordId} />
                            ) : (
                                <StripeCheckout />
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
        </>

    )
}

export default PaymentForm