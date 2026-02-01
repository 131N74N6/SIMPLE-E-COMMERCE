import { useEffect, useState } from 'react';
import type { User } from './custom-types';
import { useNavigate } from 'react-router-dom';

export default function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const initAuth = () => {
            try {
                const userExist = localStorage.getItem('user');
                if (userExist) {
                    const parsedUser = JSON.parse(userExist);
                    setUser(parsedUser);
                }
            } catch (err) {
                console.error("Failed to parse user from localStorage", err);
                localStorage.removeItem('user');
            } finally {
                setLoading(false); 
            }
        };

        initAuth();
    }, []);

    const signIn = async (password: string, username: string, signal?: AbortSignal) => {
        setLoading(true);
        setError(null);
        try {
            if (!username || !password) {
                setError('Isi semua input field');
                return;
            }

            const request = await fetch(`http://localhost:1234/auth/sign-in`, {
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password, username }),
                method: 'POST',
                signal
            });

            const response = await request.json();

            if (!request.ok) {
                const errorMessage = response.error || response.message || 'Gagal sign-in! Coba lagi nanti';
                setError(errorMessage);
            } else {
                const signedInUser = {
                    status: response.status,
                    token: response.token,
                    info: {
                        id: response.info.id,
                        email: response.info.email,
                        username: response.info.username
                    }
                }
                setUser(signedInUser);
                localStorage.setItem('user', JSON.stringify(signedInUser));
            } 
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    const signUp = async (created_at: string, email: string, username: string, password: string, signal?: AbortSignal) => {
        setLoading(true);
        setError(null);
        try {
            if (!username || !email || !password) {
                setError('Isi semua input field');
                return;
            }

            const request = await fetch(`http://localhost:1234/auth/sign-up`, {
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ created_at, email, password, username }),
                method: 'POST',
                signal
            });

            const response = await request.json();

            if (request.ok) {
                navigate('/sign-in');
            } else {
                const errorMessage = response.error || response.message || 'Gagal sign-up! Coba lagi nanti';
                setError(errorMessage);
            }
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    const signOut = async () => {
        setLoading(true);
        try {
            setUser(null);
            localStorage.removeItem('user');
            navigate('/signin');
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return { user, loading, error, signUp, signIn, signOut };
}