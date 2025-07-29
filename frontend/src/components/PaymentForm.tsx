import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import StripeCheckout from './StripeCheckout'

const PaymentForm: React.FC = () => {

    return (
        <div className="w-full mx-auto space-y-8">
            <Card className="w-full bg-white border-gray-300 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-well-dark via-well-primary to-well-light w-full">
                    <CardTitle className="text-center text-white font-bold text-xl">
                        Complete Your Payment
                    </CardTitle>
                </CardHeader>
                <CardContent className={`p-6 min-h-[400px] flex items-center justify-center bg-white w-full`}>
                    <StripeCheckout />
                </CardContent>
            </Card>
        </div>
    )
}

export default PaymentForm