import React from 'react';

const Header: React.FC = () => {
    return (
        <header style={{ backgroundColor: '#1A1A1A', borderBottom: '1px solid #9A7F36' }}>
            <div className="max-w-full mx-auto px-4 sm:px-6">
                <div className="flex flex-col sm:flex-row items-center justify-between min-h-[5rem] sm:h-20 py-2 gap-4 sm:gap-0">
                    <div className="flex items-center">
                        <img
                            src={`${import.meta.env.BASE_URL}thewell-logo2.png`}
                            alt="The Well"
                            className="w-auto object-contain h-12 sm:h-[70px]"
                        />
                    </div>
                    <div className="text-center flex-1 sm:pr-6">
                        <h1
                            className="text-lg sm:text-xl md:text-2xl font-semibold uppercase tracking-widest"
                            style={{ color: '#BE9E44', fontFamily: '"Cinzel", serif', letterSpacing: '0.1em' }}
                        >
                            Secure Payment Checkout
                        </h1>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
