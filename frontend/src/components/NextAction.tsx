import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

const NextAction: React.FC = () => {
    return (
        <>
            <div className="w-full mx-auto space-y-4 sm:space-y-8 px-4 sm:px-0">
                <Card
                    className="w-full overflow-hidden"
                    style={{
                        border: '1px solid #BE9E44',
                        backgroundColor: '#BE9E44',
                    }}
                >
                    <CardHeader className="w-full" style={{ backgroundColor: '#BE9E44', padding: '1.25rem 1.5rem' }}>
                        <CardTitle
                            className="text-center font-semibold uppercase"
                            style={{ color: '#1A1A1A', fontFamily: '"Cinzel", serif', letterSpacing: '0.08em', fontSize: '1.05rem' }}
                        >
                            Microdeposit Verification Needed
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 min-h-[300px] sm:min-h-[400px] flex items-center justify-center w-full" style={{ backgroundColor: '#FFFFFF' }}>
                        <div className="text-center w-full">
                            <div
                                className="p-6 sm:p-10 max-w-md mx-auto"
                                style={{
                                    backgroundColor: '#BE9E44',
                                    border: '2px solid #BE9E44',
                                }}
                            >
                                <p
                                    className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 uppercase"
                                    style={{ color: '#1A1A1A', fontFamily: '"Cinzel", serif', letterSpacing: '0.07em' }}
                                >
                                    Verification Required
                                </p>
                                <p className="text-sm sm:text-base" style={{ color: '#333333' }}>
                                    We will send you an email to verify your bank account with microdeposits shortly. Please reach out to{' '}
                                    <a
                                        href="mailto:clientcare@emailthewell.com"
                                        style={{ fontWeight: 'bold', textDecoration: 'underline' }}
                                    >
                                        clientcare@emailthewell.com
                                    </a>{' '}
                                    if you do not receive this email within the next 5 minutes.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

export default NextAction