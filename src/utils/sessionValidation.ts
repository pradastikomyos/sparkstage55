import { supabase } from '../lib/supabase'
import type { Session, User } from '@supabase/supabase-js'

export interface ValidationResult {
    valid: boolean
    user?: User
    session?: Session
    error?: {
        type: 'expired' | 'invalid' | 'network'
        message: string
        retryable: boolean
    }
}

/**
 * Validates a session with retry logic and exponential backoff
 */
export async function validateSessionWithRetry(maxRetries = 3): Promise<ValidationResult> {
    let attempt = 0
    let backoffMs = 1000

    while (attempt < maxRetries) {
        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser()

            if (userError || !user) {
                return {
                    valid: false,
                    error: {
                        type: 'expired',
                        message: 'Your session has expired. Please log in again to continue.',
                        retryable: false
                    }
                }
            }

            const { data: { session }, error: sessionError } = await supabase.auth.getSession()

            if (sessionError || !session) {
                return {
                    valid: false,
                    error: {
                        type: 'invalid',
                        message: 'Your session is invalid. Please log in again.',
                        retryable: false
                    }
                }
            }

            if (isSessionExpired(session)) {
                return {
                    valid: false,
                    error: {
                        type: 'expired',
                        message: 'Your session has expired. Please log in again to continue.',
                        retryable: false
                    }
                }
            }

            return {
                valid: true,
                user,
                session
            }
        } catch (error) {
            attempt++

            const isNetworkError = error instanceof Error && (
                error.message.includes('network') ||
                error.message.includes('timeout') ||
                error.message.includes('fetch')
            )

            if (attempt >= maxRetries) {
                return {
                    valid: false,
                    error: {
                        type: 'network',
                        message: 'Unable to verify your session. Please check your connection and try again.',
                        retryable: true
                    }
                }
            }

            if (isNetworkError) {
                await new Promise(resolve => setTimeout(resolve, backoffMs))
                backoffMs *= 2
            } else {
                return {
                    valid: false,
                    error: {
                        type: 'invalid',
                        message: 'Unable to verify your session. Please try again.',
                        retryable: false
                    }
                }
            }
        }
    }

    return {
        valid: false,
        error: {
            type: 'network',
            message: 'Unable to verify your session. Please check your connection and try again.',
            retryable: true
        }
    }
}

export function isSessionExpired(session: Session): boolean {
    if (!session.expires_at) return false
    return new Date(session.expires_at * 1000) < new Date()
}

export async function validateSessionOnInit(timeoutMs = 5000): Promise<ValidationResult | null> {
    const timeoutPromise = new Promise<null>((resolve) => {
        setTimeout(() => resolve(null), timeoutMs)
    })

    const validationPromise = validateSessionWithRetry()

    const result = await Promise.race([validationPromise, timeoutPromise])
    return result
}
