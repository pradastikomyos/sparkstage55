import { useEffect, useState, useCallback, useMemo } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { isAdmin as checkIsAdmin } from '../utils/auth';
import { validateSessionWithRetry } from '../utils/sessionValidation';
import { SessionErrorHandler } from '../utils/sessionErrorHandler';
import { AuthContext } from './authContext';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [initialized, setInitialized] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const errorHandler = useMemo(() => new SessionErrorHandler({}), []);

    const refreshSession = useCallback(async () => {
        try {
            const { data, error } = await supabase.auth.refreshSession();
            if (error) throw error;
            if (data.session) {
                setSession(data.session);
                setUser(data.session.user);
            }
        } catch (error) {
            console.error('[AuthContext] Refresh error:', error);
            throw error;
        }
    }, []);

    const checkAdminStatus = useCallback(async (userId: string | undefined) => {
        if (!userId) {
            setIsAdmin(false);
            return;
        }
        try {
            const adminStatus = await checkIsAdmin(userId);
            setIsAdmin(adminStatus);
        } catch {
            setIsAdmin(false);
        }
    }, []);

    const validateSession = useCallback(async (): Promise<boolean> => {
        const result = await validateSessionWithRetry();
        const finalErrorType = result.error?.type;

        if (result.valid && result.user && result.session) {
            setUser(result.user);
            setSession(result.session);
            await checkAdminStatus(result.user.id);
            return true;
        }

        try {
            await refreshSession();
            const retryResult = await validateSessionWithRetry();
            if (retryResult.valid && retryResult.user && retryResult.session) {
                setUser(retryResult.user);
                setSession(retryResult.session);
                await checkAdminStatus(retryResult.user.id);
                return true;
            }
        } catch (refreshError) {
            console.error('[AuthContext] Refresh failed:', refreshError);
        }

        if (finalErrorType !== 'network') {
            await supabase.auth.signOut();
        }
        setUser(null);
        setSession(null);
        setIsAdmin(false);
        return false;
    }, [checkAdminStatus, refreshSession]);

    useEffect(() => {
        let isMounted = true;
        let isInitializing = true;

        const initializeAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();

                if (!isMounted) return;

                if (session) {
                    const result = await validateSessionWithRetry();
                    if (!isMounted) return;

                    if (result.valid && result.user && result.session) {
                        setSession(result.session);
                        setUser(result.user);
                        await checkAdminStatus(result.user.id);
                    } else {
                        await errorHandler.handleAuthError(result.error || { status: 401 }, {
                            returnPath: window.location.pathname
                        });
                        setSession(null);
                        setUser(null);
                        setIsAdmin(false);
                    }
                } else {
                    setSession(null);
                    setUser(null);
                    setIsAdmin(false);
                }
            } catch (error) {
                if (!isMounted) return;
                await errorHandler.handleAuthError(error, { returnPath: window.location.pathname });
                setSession(null);
                setUser(null);
                setIsAdmin(false);
            } finally {
                isInitializing = false;
                if (isMounted) {
                    setInitialized(true);
                }
            }
        };

        initializeAuth();

        const { data } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (!isMounted) return;
                setSession(session);
                setUser(session?.user ?? null);

                if (isInitializing) return;

                if (event === 'SIGNED_OUT') {
                    setIsAdmin(false);
                } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                    if (session?.user?.id) {
                        const result = await validateSessionWithRetry();
                        if (result.valid && result.user) {
                            await checkAdminStatus(result.user.id);
                        } else if (event === 'TOKEN_REFRESHED') {
                            await supabase.auth.signOut();
                        }
                    }
                }
            }
        );

        return () => {
            isMounted = false;
            data?.subscription?.unsubscribe();
        };
    }, [checkAdminStatus, errorHandler]);

    const signIn = async (email: string, password: string) => {
        return await supabase.auth.signInWithPassword({ email, password });
    };

    const signUp = async (email: string, password: string, name: string) => {
        return await supabase.auth.signUp({
            email,
            password,
            options: { data: { name } },
        });
    };

    const signOut = async (): Promise<{ error: Error | null }> => {
        if (loggingOut) return { error: null };
        try {
            setLoggingOut(true);
            const { error } = await supabase.auth.signOut();
            return { error: error as Error | null };
        } catch (err) {
            return { error: err instanceof Error ? err : new Error('Logout failed') };
        } finally {
            setLoggingOut(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                session,
                initialized,
                isAdmin,
                loggingOut,
                signIn,
                signUp,
                signOut,
                validateSession,
                refreshSession
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
