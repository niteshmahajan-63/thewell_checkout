import React, { useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'
import { Navigate, useParams } from 'react-router-dom'
import { CheckoutProvider } from '../contexts/CheckoutContext'
import CheckoutContent from './CheckoutContent'
import { errorReportingService } from '../services/errorReportingService'
import { initializeGlobalErrorHandlers } from '../utils/globalErrorHandlers'
import ErrorBoundary from './ErrorBoundary'

const CheckoutPage: React.FC = () => {
    const { recordId } = useParams()

    if (!recordId || recordId.trim() === '') {
        return <Navigate to="/404" replace />
    }

    useEffect(() => {
        initializeGlobalErrorHandlers();

        if (recordId) {
            errorReportingService.setRecordId(recordId);
        }
    }, [recordId]);

    return (
        <ErrorBoundary componentName="App">
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
        </ErrorBoundary>
    )
}

export default CheckoutPage