import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import { useCheckout } from '../hooks/useCheckout'

interface CheckoutContextType {
  recordId: string
  clientSecret: string | null
  invoiceType: string | null
  deactivatedLink: string | null
  amount: string | null
  company: string | null
  email: string | null
  error: string | null
  completed: boolean | null
  setCompleted: (completed: boolean | null) => void
  nextAction: boolean
  setnextAction: (nextAction: boolean) => void
  isLoading: boolean
  loadCheckoutData: () => Promise<void>
}

interface CheckoutProviderProps {
  children: ReactNode
  recordId: string
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined)

export const CheckoutProvider = ({ children, recordId }: CheckoutProviderProps) => {
	const CheckoutState = useCheckout(recordId)

	return (
		<CheckoutContext.Provider value={CheckoutState}>
			{children}
		</CheckoutContext.Provider>
	)
}

export const useCheckoutContext = (): CheckoutContextType => {
	const context = useContext(CheckoutContext)
	if (!context) {
		throw new Error('useCheckoutContext must be used within an CheckoutProvider')
	}
	return context
}
