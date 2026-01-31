import { supabase } from '../lib/supabase'
import { preserveBookingState, type BookingState } from './bookingStateManager'

export interface SessionErrorHandlerOptions {
    onSessionExpired?: (returnPath: string, state?: unknown) => void
    onNetworkError?: (error: Error) => void
    preserveState?: boolean
}

export class SessionErrorHandler {
    private options: SessionErrorHandlerOptions

    constructor(options: SessionErrorHandlerOptions = {}) {
        this.options = options
    }

    async handleAuthError(
        error: unknown,
        context: {
            returnPath: string
            state?: unknown
        }
    ): Promise<void> {
        const isExpired = this.isSessionExpiredError(error);
        const isNetwork = this.isNetworkError(error);

        if (isExpired) {
            if (this.options.preserveState && context.state) {
                preserveBookingState(context.state as BookingState)
            }

            await supabase.auth.signOut()

            if (this.options.onSessionExpired) {
                this.options.onSessionExpired(context.returnPath, context.state)
            } else {
                alert('Your session has expired for security. Please log in again to continue.');
            }
        } else if (isNetwork) {
            if (this.options.onNetworkError && error instanceof Error) {
                this.options.onNetworkError(error)
            } else {
                alert('We\'re having trouble connecting to the server. Please check your internet connection and try again.');
            }
        }
    }

    private isSessionExpiredError(error: unknown): boolean {
        if (error instanceof Response) {
            return error.status === 401
        }
        if (error && typeof error === 'object' && 'status' in error) {
            return (error as { status: number }).status === 401
        }
        if (error && typeof error === 'object' && 'type' in error) {
            const type = (error as { type?: unknown }).type
            return type === 'expired' || type === 'invalid'
        }
        return false
    }

    private isNetworkError(error: unknown): boolean {
        if (error instanceof Error) {
            return (
                error.message.includes('network') ||
                error.message.includes('timeout') ||
                error.message.includes('fetch')
            )
        }
        return false
    }
}
