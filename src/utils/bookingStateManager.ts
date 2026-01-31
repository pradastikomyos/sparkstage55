export interface BookingState {
    ticketId: number
    ticketName: string
    ticketType: string
    price: number
    date: string
    time: string
    quantity: number
    total: number
    timestamp: number
}

const BOOKING_STATE_KEY = 'booking_state'
const MAX_AGE_MS = 30 * 60 * 1000

export function preserveBookingState(state: Omit<BookingState, 'timestamp'>): void {
    const stateWithTimestamp: BookingState = {
        ...state,
        timestamp: Date.now()
    }

    try {
        sessionStorage.setItem(BOOKING_STATE_KEY, JSON.stringify(stateWithTimestamp))
    } catch (error) {
        console.error('Failed to preserve booking state:', error)
    }
}

export function restoreBookingState(): BookingState | null {
    try {
        const stored = sessionStorage.getItem(BOOKING_STATE_KEY)
        if (!stored) {
            return null
        }

        const state = JSON.parse(stored) as BookingState

        if (!isValidBookingState(state)) {
            clearBookingState()
            return null
        }

        if (Date.now() - state.timestamp > MAX_AGE_MS) {
            clearBookingState()
            return null
        }

        return state
    } catch (error) {
        console.error('Failed to restore booking state:', error)
        clearBookingState()
        return null
    }
}

export function clearBookingState(): void {
    try {
        sessionStorage.removeItem(BOOKING_STATE_KEY)
    } catch (error) {
        console.error('Failed to clear booking state:', error)
    }
}

function isValidBookingState(state: unknown): state is BookingState {
    if (!state || typeof state !== 'object') {
        return false
    }

    const s = state as Record<string, unknown>

    return (
        typeof s.ticketId === 'number' &&
        typeof s.ticketName === 'string' &&
        typeof s.ticketType === 'string' &&
        typeof s.price === 'number' &&
        typeof s.date === 'string' &&
        typeof s.time === 'string' &&
        typeof s.quantity === 'number' &&
        typeof s.total === 'number' &&
        typeof s.timestamp === 'number'
    )
}

export function hasBookingState(): boolean {
    try {
        return sessionStorage.getItem(BOOKING_STATE_KEY) !== null
    } catch {
        return false
    }
}

export function getBookingStateAge(): number | null {
    try {
        const stored = sessionStorage.getItem(BOOKING_STATE_KEY)
        if (!stored) {
            return null
        }

        const state = JSON.parse(stored) as BookingState
        if (typeof state.timestamp !== 'number') {
            return null
        }

        return Date.now() - state.timestamp
    } catch {
        return null
    }
}
