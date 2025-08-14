import { useEffect, useCallback, useState } from 'react'
import { getCheckoutByRecordId } from '../services/checkoutService'

export const useCheckout = (recordId: string) => {
    const [clientSecret, setClientSecret] = useState<string | null>(null)
    const [completed, setCompleted] = useState<boolean | null>(null)
    const [amount, setAmount] = useState<string | null>(null)
    const [company, setCompany] = useState<string | null>(null)
    const [email, setEmail] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const loadCheckoutData = useCallback(async () => {
        if (!recordId || recordId.trim() === '') return

        try {
            setIsLoading(true)
            setError(null)

            const response = await getCheckoutByRecordId(recordId)
            const record = response.data.record

            setAmount(record.Total_Amount || null)
            setCompany(record.Company_Name || null)
            setEmail(record.Customer_Email || null)
            setClientSecret(response.data.client_secret || null)
            if(record.Payment_Status === 'succeeded') {
                setCompleted(true)
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to load checkout data')
        } finally {
            setIsLoading(false)
        }
    }, [recordId])

    useEffect(() => {
        loadCheckoutData()
    }, [loadCheckoutData])

    return {
        recordId,
        isLoading,
        error,
        amount,
        company,
        email,
        clientSecret,
        completed,
        setCompleted,
        loadCheckoutData,
    }
}
