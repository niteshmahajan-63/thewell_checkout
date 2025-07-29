import React from 'react'
import Header from './Header'
import Footer from './Footer'
import { Navigate, useParams } from 'react-router-dom'
import { CheckoutProvider } from '../contexts/CheckoutContext'
import CheckoutContent from './CheckoutContent'

const CheckoutPage: React.FC = () => {
    const { recordId } = useParams()

	if (!recordId || recordId.trim() === '') {
		return <Navigate to="/404" replace />
	}

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <Header />

            <main className="flex-1 bg-black">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <CheckoutProvider recordId={recordId}>
                        <CheckoutContent />
                    </CheckoutProvider>
                </div>
            </main>

            <Footer />
        </div>
    )
}

export default CheckoutPage