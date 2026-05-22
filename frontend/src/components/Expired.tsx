import React from 'react'

const Expired: React.FC = () => {
    return (
        <div className="space-y-8">
            <div className="text-center mt-8 px-4">
                <div className="inline-block p-6 sm:p-10 max-w-md mx-auto" style={{ backgroundColor: '#BE9E44', borderTop: '2px solid #BE9E44' }}>
                    <h2
                        className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 uppercase"
                        style={{ color: '#333333', fontFamily: '"Cinzel", serif', letterSpacing: '0.08em' }}
                    >
                        Link Expired
                    </h2>
                    <p className="text-sm sm:text-base" style={{ color: '#333333' }}>
                        The link you're trying to access is no longer valid. Please contact{' '}
                        <span style={{ color: '#333333', fontWeight: 600 }}>The Well</span>{' '}
                        to request a new link.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Expired