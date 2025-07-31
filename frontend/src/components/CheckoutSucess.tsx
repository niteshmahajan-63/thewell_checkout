import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { downloadReceipt } from '../services/checkoutService';

interface CheckoutSucessProps {
    recordId: string;
}

const CheckoutSucess: React.FC<CheckoutSucessProps> = ({ recordId }) => {
    const handleDownloadReceipt = async () => {
        try {
            const data = await downloadReceipt(recordId);
            if (data) {
                window.open(data.data, '_blank');
            } else {
                console.error('Could not download payment receipt. Please contact support.');
            }
        } catch (err) {
            console.error('Error downloading payment receipt:', err);
        }
    };
    return (
        <>
            <div className="w-full mx-auto space-y-4 sm:space-y-8 px-4 sm:px-0">
                <Card className="w-full bg-white border-gray-300 overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-well-dark via-well-primary to-well-light w-full">
                        <CardTitle className="text-center text-white font-bold text-lg sm:text-xl">
                            Payment Complete
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 min-h-[300px] sm:min-h-[400px] flex items-center justify-center bg-white w-full">
                        <div className="text-center w-full">
                            <div
                                className="rounded-xl p-4 sm:p-12 max-w-md mx-auto border-2"
                                style={{
                                    backgroundColor: '#d8c690',
                                    borderColor: '#CBB26A',
                                }}
                            >
                                <p className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4" style={{ color: '#000' }}>Payment Complete!</p>
                                <p className="text-base sm:text-lg" style={{ color: '#000' }}>Thank you for completing your payment.</p>
                                <button
                                    className="mt-6 sm:mt-8 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold shadow transition-colors"
                                    style={{ backgroundColor: '#BE9E44', color: '#fff', border: '1px solid #000', borderRadius: 0 }}
                                    onClick={handleDownloadReceipt}
                                >
                                    Download Payment Receipt
                                </button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

export default CheckoutSucess