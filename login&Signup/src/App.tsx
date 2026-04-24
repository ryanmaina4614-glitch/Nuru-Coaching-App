/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Facebook, 
  Lock, 
  ChevronRight,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useAuth } from './lib/auth';

// Custom Google Icon Component
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

type AuthMode = 'login' | 'signup' | 'forgot-password';

export default function App() {
  const { user, login, signup, resetPassword, logout, signInWithGoogle, signInWithFacebook } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setIsSubmitting(true);
    try {
      await login(email, password, rememberMe);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setIsSubmitting(true);
    try {
      await signup(email, password, name);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setIsSubmitting(true);
    try {
      await resetPassword(email);
      setSuccess('Password reset link sent to your email.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    resetMessages();
    try {
      if (provider === 'google') await signInWithGoogle();
      else await signInWithFacebook();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return 0;
    let strength = 0;
    if (pwd.length > 5) strength++;
    if (pwd.length > 8) strength++;
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) strength++;
    return strength;
  };

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg p-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-brand-paper p-12 shadow-2xl rounded-sm text-center"
        >
          <div className="w-20 h-20 bg-brand-charcoal text-brand-bg rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-3xl font-serif mb-2">Welcome, {user.displayName || user.email}!</h1>
          <p className="text-gray-400 mb-10 italic">You have successfully entered the collective.</p>
          <button 
            onClick={() => logout()}
            className="flex items-center justify-center gap-3 w-full bg-brand-charcoal text-brand-bg py-4 uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-black transition-all"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg p-0 md:p-8">
      <motion.div 
        layout
        className="w-full max-w-[1100px] min-h-[700px] bg-brand-paper shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] flex flex-col md:flex-row overflow-hidden border border-black/5"
      >
        {/* Left Side: Brand Identity (Editorial Sidebar) */}
        <div className="w-full md:w-5/12 bg-brand-charcoal text-brand-bg p-12 flex flex-col justify-between relative overflow-hidden min-h-[400px] md:min-h-0">
          {/* Background Image Overlay */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2670&auto=format&fit=crop" 
              alt="Editorial Interior" 
              className="w-full h-full object-cover opacity-20 grayscale"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal via-brand-charcoal/40 to-transparent" />
          </div>

          <div className="z-10 relative">
            <div className="text-[10px] uppercase tracking-[0.4em] font-bold mb-10 opacity-70">
              The Nuru Collective
            </div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-serif leading-[0.85] italic mb-4"
            >
              Nuru <br/>Coaching
            </motion.h1>
            <div className="h-[2px] w-12 bg-brand-bg/40 mt-8 mb-4"></div>
          </div>
          
          <div className="absolute -bottom-20 -left-20 w-80 h-80 border border-brand-bg/10 rounded-full z-0" />
          
          <div className="z-10 relative">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm md:text-base leading-relaxed opacity-60 max-w-[280px] font-serif italic mb-8"
            >
              "Empowering your journey towards clarity and growth. Access your personalized coaching dashboard."
            </motion.p>
            <div className="text-[10px] uppercase tracking-widest opacity-40 font-semibold">
              TRUSTED GUIDANCE — EST. 2026
            </div>
          </div>
        </div>

        {/* Right Side: Forms */}
        <div className="w-full md:w-7/12 flex items-center justify-center p-8 md:p-20 relative">
          <AnimatePresence mode="wait">
            {mode === 'login' && (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full max-w-sm"
              >
                <div className="mb-12">
                  <h2 className="text-4xl font-serif mb-3 text-white">Welcome back.</h2>
                  <p className="text-sm text-white/60 font-medium tracking-tight">
                    Don't have an account?{' '}
                    <button 
                      onClick={() => setMode('signup')}
                      className="text-white underline underline-offset-4 hover:opacity-70 transition-opacity"
                    >
                      Create one now
                    </button>
                  </p>
                </div>

                <form className="space-y-6" onSubmit={handleLogin}>
                  {error && (
                    <div className="bg-red-500/10 text-red-200 p-4 text-xs font-bold uppercase tracking-widest flex items-center gap-3 border border-red-500/20 rounded-xl">
                      <AlertCircle size={16} />
                      {error}
                    </div>
                  )}
                  <div className="space-y-4">
                    <div className="group">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold mb-2 ml-4 block transition-colors group-focus-within:text-white">
                        Email Address
                      </label>
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-6 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all font-sans text-base text-white placeholder:text-white/20"
                        placeholder="name@example.com"
                      />
                    </div>
                    <div className="group">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold mb-2 ml-4 block transition-colors group-focus-within:text-white">
                        Password
                      </label>
                      <input 
                        type="password" 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-6 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all font-sans text-base text-white placeholder:text-white/20"
                        placeholder="Should be atleast 6 characters"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-2">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-3.5 h-3.5 border-white/20 rounded-sm accent-white focus:ring-0 bg-transparent" 
                      />
                      <span className="text-[10px] uppercase tracking-wider text-white/40 font-bold group-hover:text-white/70 transition-colors">Keep me signed in</span>
                    </label>
                    <button 
                      type="button"
                      onClick={() => setMode('forgot-password')}
                      className="text-[10px] uppercase tracking-wider text-white/40 font-bold hover:text-white/70"
                    >
                      Lost Password?
                    </button>
                  </div>

                  <button 
                    disabled={isSubmitting}
                    className="w-full bg-white text-[#105554] py-5 rounded-full uppercase tracking-[0.3em] text-[11px] font-bold hover:bg-opacity-90 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : 'Sign In to Account'}
                  </button>
                </form>

                <div className="relative my-10">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em]">
                    <span className="bg-brand-paper px-6 text-white/20 font-bold">Or Connect Via</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => handleSocialLogin('google')} className="flex items-center justify-center gap-3 border border-white/10 bg-white/5 py-4 rounded-full hover:bg-white/10 transition-all group">
                    <div className="grayscale group-hover:grayscale-0 opacity-50 group-hover:opacity-100 transition-all">
                      <GoogleIcon />
                    </div>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-white/60 group-hover:text-white">Google</span>
                  </button>
                  <button onClick={() => handleSocialLogin('facebook')} className="flex items-center justify-center gap-3 border border-white/10 bg-white/5 py-4 rounded-full hover:bg-white/10 transition-all group">
                    <Facebook size={14} className="text-white/40 group-hover:text-[#1877F2] transition-all" />
                    <span className="text-[10px] uppercase tracking-widest font-bold text-white/60 group-hover:text-white">Facebook</span>
                  </button>
                </div>

                <div className="mt-12 text-[9px] text-white/30 text-center uppercase tracking-[0.2em]">
                  Privacy Policy &bull; Terms of Service &bull; &copy; 2026
                </div>
              </motion.div>
            )}

            {mode === 'signup' && (
              <motion.div
                key="signup"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full max-w-sm"
              >
                <div className="mb-8">
                  <h2 className="text-4xl font-serif mb-3 text-white">Create profile.</h2>
                  <p className="text-sm text-white/50 font-medium tracking-tight">
                    Already registered?{' '}
                    <button 
                      onClick={() => setMode('login')}
                      className="text-white underline underline-offset-4 hover:opacity-70 transition-opacity"
                    >
                      Sign in instead
                    </button>
                  </p>
                </div>

                <form className="space-y-6" onSubmit={handleSignup}>
                  {error && (
                    <div className="bg-red-500/10 text-red-200 p-4 text-xs font-bold uppercase tracking-widest flex items-center gap-3 border border-red-500/20 rounded-xl">
                      <AlertCircle size={16} />
                      {error}
                    </div>
                  )}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="group">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold mb-2 ml-4 block transition-colors group-focus-within:text-white">
                        Full Name
                      </label>
                      <input 
                        required
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-6 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all font-sans text-base text-white placeholder:text-white/20"
                        placeholder="Julian Voss"
                      />
                    </div>
                    <div className="group">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold mb-2 ml-4 block transition-colors group-focus-within:text-white">
                        Email Address
                      </label>
                      <input 
                        required
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-6 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all font-sans text-base text-white placeholder:text-white/20"
                        placeholder="name@example.com"
                      />
                    </div>
                    <div className="group space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold mb-2 ml-4 block transition-colors group-focus-within:text-white">
                        Password
                      </label>
                      <input 
                        required
                        type="password" 
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-6 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all font-sans text-base text-white placeholder:text-white/20"
                        placeholder="Should be atleast 6 characters"
                      />
                      
                      {/* Password Strength Indicator */}
                      <div className="pt-2 px-4">
                        <div className="flex gap-1.5 h-1 mb-2">
                          {[1, 2, 3].map((level) => {
                            const strength = getPasswordStrength(password);
                            return (
                              <div 
                                key={level}
                                className={`flex-1 rounded-full transition-all duration-300 ${
                                  strength >= level 
                                    ? strength === 1 ? 'bg-red-400' 
                                    : strength === 2 ? 'bg-yellow-400' 
                                    : 'bg-emerald-400'
                                    : 'bg-white/5'
                                }`}
                              />
                            );
                          })}
                        </div>
                        <div className="flex justify-between items-center text-[7px] uppercase tracking-[0.2em] font-bold">
                          <span className="text-white/20 text-[8px]">Protection Level</span>
                          <span className={`${
                            getPasswordStrength(password) === 1 ? 'text-red-400' 
                            : getPasswordStrength(password) === 2 ? 'text-yellow-400' 
                            : getPasswordStrength(password) === 3 ? 'text-emerald-400'
                            : 'text-white/20'
                          } text-[8px]`}>
                            {getPasswordStrength(password) === 0 ? 'Enter Password'
                            : getPasswordStrength(password) === 1 ? 'Vulnerable'
                            : getPasswordStrength(password) === 2 ? 'Moderate'
                            : 'Formidable'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <p className="text-[9px] text-white/30 uppercase tracking-widest text-center italic mb-6">
                      By joining, you agree to our curated standards of privacy and terms.
                    </p>
                    <button 
                      disabled={isSubmitting}
                      className="w-full bg-white text-[#105554] py-5 rounded-full uppercase tracking-[0.3em] text-[11px] font-bold hover:bg-opacity-90 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : 'Join the Collective'}
                    </button>
                  </div>
                </form>

                <div className="mt-12 text-[9px] text-white/30 text-center uppercase tracking-[0.2em]">
                   Crafted for quality &bull; &copy; 2026
                </div>
              </motion.div>
            )}

            {mode === 'forgot-password' && (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full max-w-sm"
              >
                <div className="mb-12">
                  <h2 className="text-4xl font-serif mb-3 text-white">Reset access.</h2>
                  <p className="text-sm text-white/50 font-medium tracking-tight">
                    Remembered?{' '}
                    <button 
                      onClick={() => setMode('login')}
                      className="text-white underline underline-offset-4 hover:opacity-70 transition-opacity"
                    >
                      Back to sign in
                    </button>
                  </p>
                </div>

                <form className="space-y-8" onSubmit={handleResetPassword}>
                  {error && (
                    <div className="bg-red-500/10 text-red-200 p-4 text-xs font-bold uppercase tracking-widest flex items-center gap-3 border border-red-500/20 rounded-xl">
                      <AlertCircle size={16} />
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="bg-emerald-500/10 text-emerald-200 p-4 text-xs font-bold uppercase tracking-widest flex items-center gap-3 border border-emerald-500/20 rounded-xl">
                      <CheckCircle2 size={16} />
                      {success}
                    </div>
                  )}
                  <div className="group">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold mb-2 ml-4 block transition-colors group-focus-within:text-white">
                      Email Address
                    </label>
                    <input 
                      required
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-6 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all font-sans text-base text-white placeholder:text-white/20"
                      placeholder="name@example.com"
                    />
                  </div>

                  <button 
                    disabled={isSubmitting}
                    className="w-full bg-white text-[#105554] py-5 rounded-full uppercase tracking-[0.3em] text-[11px] font-bold hover:bg-opacity-90 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : 'Send Reset Link'}
                  </button>
                </form>

                <div className="mt-20 text-[9px] text-white/30 text-center uppercase tracking-[0.2em]">
                  A secure link will be dispatched shortly.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
