import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../services/useAuth';
import { EyeOff, Eye } from 'lucide-react';

export default function SignUp() {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const { error, signUp, user } = useAuth();
    const controllerRef = useRef<AbortController | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) navigate('/home', { replace: true });
    }, [user, navigate]);

    useEffect(() => {
        return () => {
            if (controllerRef.current) {
                controllerRef.current.abort();
            }
        };
    }, []);

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (controllerRef.current) {
            controllerRef.current.abort();
        }

        controllerRef.current = new AbortController();
        
        const getCurrentDate = new Date();
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();
        const trimmedUserName = username.trim();
        await signUp(getCurrentDate.toISOString(), trimmedEmail, trimmedUserName, trimmedPassword);
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-800 p-4">
            <div className="bg-blue-900/20 backdrop-blur-lg rounded-xl p-8 border-blue-400/30 shadow-lg">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Sign Up</h2>
                {error && <p className="text-orange-400 mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-3 rounded-lg bg-black/30 text-white border border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full mt-4 p-3 rounded-lg bg-black/30 text-white border border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <div className='flex items-center gap-3'>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full mt-4 p-3 rounded-lg bg-black/30 text-white border border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="flex cursor-pointer items-center text-gray-400 hover:text-white"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    <button
                        type="submit"
                        className="w-full mt-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
                    >
                        Daftar
                    </button>
                </form>
                <p className="mt-4 text-center text-blue-200">
                    Sudah punya akun?{' '}
                    <Link to="/sign-in" className="text-blue-400 underline">Masuk disini</Link>
                </p>
            </div>
        </div>
    );
}