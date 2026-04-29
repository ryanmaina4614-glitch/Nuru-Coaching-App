import { api } from './api.js';

// Application State
let state = {
  mode: 'login', // 'login', 'signup', 'reset'
  user: null,
  loading: true,
  error: null,
  success: null
};

// DOM Elements
const authContainer = document.getElementById('auth-container');
const bgOverlay = document.getElementById('bg-overlay');

function updateUI() {
  const root = document.getElementById('root');
  if (!root) return;

  if (state.loading) {
    root.innerHTML = `
      <div class="flex items-center justify-center min-h-screen bg-[#105554]">
        <div class="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    `;
    return;
  }

  if (state.user) {
    root.innerHTML = `
      <div class="min-h-screen bg-[#105554] flex flex-col items-center justify-center text-white p-6">
        <h1 class="text-5xl font-serif mb-6">Welcome Back</h1>
        <p class="text-xl opacity-60 mb-12">You are now part of the collective.</p>
        <button id="logout-btn" class="px-12 py-4 border border-white/20 rounded-full hover:bg-white/10 transition-all uppercase tracking-widest text-xs font-bold">
          Sign Out
        </button>
      </div>
    `;
    document.getElementById('logout-btn')?.addEventListener('click', handleLogout);
    return;
  }

  // Auth Layout
  root.innerHTML = `
    <div class="min-h-screen bg-white flex flex-col md:flex-row font-sans text-[#1A1A1A] overflow-hidden">
      <!-- Image Sidebar (Visible on Desktop) -->
      <div class="hidden md:flex w-1/2 bg-[#105554] relative items-center justify-center p-20 overflow-hidden">
        <div class="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2670&auto=format&fit=crop" 
            alt="Editorial Interior" 
            class="w-full h-full object-cover opacity-50"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/20 to-transparent"></div>
        </div>

        <div class="z-10 relative text-center">
          <div class="mb-12 inline-block">
            <span class="text-[11px] uppercase tracking-[0.5em] text-white/40 font-bold border-b border-white/20 pb-2">Nuru Coaching</span>
          </div>
          <h1 class="text-6xl lg:text-7xl text-white font-serif mb-8 leading-tight tracking-tight">
            Design your <br/> <span class="italic opacity-80">own evolution.</span>
          </h1>
          <p class="text-white/60 text-sm max-w-md mx-auto leading-relaxed mb-12 font-medium tracking-tight">
            "Empowering your journey towards clarity and growth. Access your personalized coaching dashboard."
          </p>
          <div class="text-[10px] uppercase tracking-widest opacity-40 font-semibold text-white">
            TRUSTED GUIDANCE — EST. 2026
          </div>
        </div>
      </div>

      <!-- Auth Column -->
      <div class="flex-1 bg-[#105554] md:bg-white flex items-center justify-center p-8 md:p-20 overflow-y-auto">
        <div id="auth-content" class="w-full max-w-sm">
          ${renderAuthMode()}
        </div>
      </div>
    </div>
  `;

  attachEventListeners();
}

function renderAuthMode() {
  if (state.mode === 'login') return renderLogin();
  if (state.mode === 'signup') return renderSignup();
  if (state.mode === 'reset') return renderReset();
  return '';
}

function renderLogin() {
  return `
    <div class="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div class="mb-12">
        <h2 class="text-4xl font-serif mb-3 text-white md:text-[#1A1A1A]">Welcome back.</h2>
        <p class="text-sm text-white/60 md:text-gray-400 font-medium tracking-tight">
          Don't have an account? 
          <button id="goto-signup" class="text-white md:text-[#1A1A1A] underline underline-offset-4 hover:opacity-70 transition-opacity">
            Create one now
          </button>
        </p>
      </div>

      <form id="login-form" class="space-y-6">
        ${state.error ? `
          <div class="bg-red-500/10 text-red-200 md:bg-red-50 md:text-red-600 p-4 text-xs font-bold uppercase tracking-widest flex items-center gap-3 border border-red-500/20 md:border-red-100 rounded-xl">
            <span>⚠️</span>
            ${state.error}
          </div>
        ` : ''}
        
        <div class="space-y-4">
          <div class="group">
            <label class="text-[10px] uppercase tracking-[0.2em] text-white/50 md:text-gray-400 font-bold mb-2 ml-4 block">
              Email Address
            </label>
            <input 
              type="email" 
              name="email"
              required
              class="w-full bg-white/5 md:bg-gray-50 border border-white/10 md:border-gray-100 rounded-full py-4 px-6 focus:outline-none focus:border-white/40 md:focus:border-[#105554] focus:bg-white/10 md:focus:bg-white transition-all font-sans text-base text-white md:text-[#1A1A1A] placeholder:text-white/20 md:placeholder:text-gray-300"
              placeholder="name@example.com"
            />
          </div>
          <div class="group">
            <label class="text-[10px] uppercase tracking-[0.2em] text-white/50 md:text-gray-400 font-bold mb-2 ml-4 block">
              Password
            </label>
            <input 
              type="password" 
              name="password"
              required
              minlength="6"
              maxlength="15"
              class="w-full bg-white/5 md:bg-gray-50 border border-white/10 md:border-gray-100 rounded-full py-4 px-6 focus:outline-none focus:border-white/40 md:focus:border-[#105554] focus:bg-white/10 md:focus:bg-white transition-all font-sans text-base text-white md:text-[#1A1A1A] placeholder:text-white/20 md:placeholder:text-gray-300"
              placeholder="Should be atleast 6 characters"
            />
          </div>
        </div>

        <div class="flex items-center justify-between px-2">
          <label class="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" name="remember" class="w-3.5 h-3.5 border-white/20 rounded-sm accent-white focus:ring-0 bg-transparent" />
            <span class="text-[10px] uppercase tracking-wider text-white/40 md:text-gray-400 font-bold group-hover:text-white/70 md:group-hover:text-gray-600 transition-colors">Keep me signed in</span>
          </label>
          <button type="button" id="goto-reset" class="text-[10px] uppercase tracking-wider text-white/40 md:text-gray-400 font-bold hover:text-white/70 md:hover:text-gray-600">
            Lost Password?
          </button>
        </div>

        <button type="submit" class="w-full bg-white md:bg-[#105554] text-[#105554] md:text-white py-5 rounded-full uppercase tracking-[0.3em] text-[11px] font-bold hover:bg-opacity-90 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2 mt-4">
          Sign In to Account
        </button>
      </form>

      <div class="relative my-10">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-white/10 md:border-gray-100"></div>
        </div>
        <div class="relative flex justify-center text-[10px] uppercase tracking-[0.3em]">
          <span class="bg-[#105554] md:bg-white px-6 text-white/20 md:text-gray-300 font-bold">Or Connect Via</span>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <button class="social-login-btn flex items-center justify-center gap-3 border border-white/10 md:border-gray-100 bg-white/5 md:bg-gray-50 py-4 rounded-full hover:bg-white/10 md:hover:bg-white transition-all group" data-provider="google">
          <span class="text-[10px] uppercase tracking-widest font-bold text-white/60 md:text-gray-400 group-hover:text-white md:group-hover:text-[#1A1A1A]">Google</span>
        </button>
        <button class="social-login-btn flex items-center justify-center gap-3 border border-white/10 md:border-gray-100 bg-white/5 md:bg-gray-50 py-4 rounded-full hover:bg-white/10 md:hover:bg-white transition-all group" data-provider="facebook">
          <span class="text-[10px] uppercase tracking-widest font-bold text-white/60 md:text-gray-400 group-hover:text-white md:group-hover:text-[#1A1A1A]">Facebook</span>
        </button>
      </div>

      <div class="mt-12 text-[9px] text-white/30 md:text-gray-400 text-center uppercase tracking-[0.2em]">
        Privacy Policy &bull; Terms of Service &bull; &copy; 2026
      </div>
    </div>
  `;
}

function renderSignup() {
  return `
    <div class="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div class="mb-8">
        <h2 class="text-4xl font-serif mb-3 text-white md:text-[#1A1A1A]">Create profile.</h2>
        <p class="text-sm text-white/50 md:text-gray-400 font-medium tracking-tight">
          Already registered? 
          <button id="goto-login" class="text-white md:text-[#1A1A1A] underline underline-offset-4 hover:opacity-70 transition-opacity">
            Sign in instead
          </button>
        </p>
      </div>

      <form id="signup-form" class="space-y-6">
        ${state.error ? `
          <div class="bg-red-500/10 text-red-200 md:bg-red-50 md:text-red-600 p-4 text-xs font-bold uppercase tracking-widest flex items-center gap-3 border border-red-500/20 md:border-red-100 rounded-xl">
            <span>⚠️</span>
            ${state.error}
          </div>
        ` : ''}

        <div class="grid grid-cols-1 gap-4">
          <div class="group">
            <label class="text-[10px] uppercase tracking-[0.2em] text-white/50 md:text-gray-400 font-bold mb-2 ml-4 block">
              Full Name
            </label>
            <input 
              type="text" 
              name="name"
              required
              class="w-full bg-white/5 md:bg-gray-50 border border-white/10 md:border-gray-100 rounded-full py-4 px-6 focus:outline-none focus:border-white/40 md:focus:border-[#105554] focus:bg-white/10 md:focus:bg-white transition-all font-sans text-base text-white md:text-[#1A1A1A] placeholder:text-white/20 md:placeholder:text-gray-300"
              placeholder="Julian Voss"
            />
          </div>
          <div class="group">
            <label class="text-[10px] uppercase tracking-[0.2em] text-white/50 md:text-gray-400 font-bold mb-2 ml-4 block">
              Email Address
            </label>
            <input 
              type="email" 
              name="email"
              required
              class="w-full bg-white/5 md:bg-gray-50 border border-white/10 md:border-gray-100 rounded-full py-4 px-6 focus:outline-none focus:border-white/40 md:focus:border-[#105554] focus:bg-white/10 md:focus:bg-white transition-all font-sans text-base text-white md:text-[#1A1A1A] placeholder:text-white/20 md:placeholder:text-gray-300"
              placeholder="name@example.com"
            />
          </div>
          <div class="group space-y-2">
            <label class="text-[10px] uppercase tracking-[0.2em] text-white/50 md:text-gray-400 font-bold mb-2 ml-4 block">
              Password
            </label>
            <input 
              type="password" 
              name="password"
              required
              minlength="6"
              maxlength="15"
              id="signup-pw"
              class="w-full bg-white/5 md:bg-gray-50 border border-white/10 md:border-gray-100 rounded-full py-4 px-6 focus:outline-none focus:border-white/40 md:focus:border-[#105554] focus:bg-white/10 md:focus:bg-white transition-all font-sans text-base text-white md:text-[#1A1A1A] placeholder:text-white/20 md:placeholder:text-gray-300"
              placeholder="Should be atleast 6 characters"
            />
            
            <div id="password-strength" class="pt-2 px-4">
              <!-- Strength bars inserted here by JS -->
            </div>
          </div>
        </div>

        <div class="pt-4">
          <p class="text-[9px] text-white/30 md:text-gray-400 uppercase tracking-widest text-center italic mb-6">
            By joining, you agree to our curated standards of privacy and terms.
          </p>
          <button type="submit" class="w-full bg-white md:bg-[#105554] text-[#105554] md:text-white py-5 rounded-full uppercase tracking-[0.3em] text-[11px] font-bold hover:bg-opacity-90 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2">
            Join the Collective
          </button>
        </div>
      </form>

      <div class="mt-12 text-[9px] text-white/30 md:text-gray-400 text-center uppercase tracking-[0.2em]">
         Crafted for quality &bull; &copy; 2026
      </div>
    </div>
  `;
}

function renderReset() {
  return `
    <div class="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div class="mb-12">
        <h2 class="text-4xl font-serif mb-3 text-white md:text-[#1A1A1A]">Reset access.</h2>
        <p class="text-sm text-white/50 md:text-gray-400 font-medium tracking-tight">
          Remembered? 
          <button id="goto-login" class="text-white md:text-[#1A1A1A] underline underline-offset-4 hover:opacity-70 transition-opacity">
            Back to sign in
          </button>
        </p>
      </div>

      <form id="reset-form" class="space-y-8">
        ${state.error ? `
          <div class="bg-red-500/10 text-red-200 md:bg-red-50 md:text-red-600 p-4 text-xs font-bold uppercase tracking-widest flex items-center gap-3 border border-red-500/20 md:border-red-100 rounded-xl">
            <span>⚠️</span>
            ${state.error}
          </div>
        ` : ''}
        ${state.success ? `
          <div class="bg-emerald-500/10 text-emerald-200 md:bg-emerald-50 md:text-emerald-600 p-4 text-xs font-bold uppercase tracking-widest flex items-center gap-3 border border-emerald-500/20 md:border-emerald-100 rounded-xl">
            <span>✅</span>
            ${state.success}
          </div>
        ` : ''}
        <div class="group">
          <label class="text-[10px] uppercase tracking-[0.2em] text-white/50 md:text-gray-400 font-bold mb-2 ml-4 block">
            Email Address
          </label>
          <input 
            type="email" 
            name="email"
            required
            class="w-full bg-white/5 md:bg-gray-50 border border-white/10 md:border-gray-100 rounded-full py-4 px-6 focus:outline-none focus:border-white/40 md:focus:border-[#105554] focus:bg-white/10 md:focus:bg-white transition-all font-sans text-base text-white md:text-[#1A1A1A] placeholder:text-white/20 md:placeholder:text-gray-300"
            placeholder="name@example.com"
          />
        </div>

        <button type="submit" class="w-full bg-white md:bg-[#105554] text-[#105554] md:text-white py-5 rounded-full uppercase tracking-[0.3em] text-[11px] font-bold hover:bg-opacity-90 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2 mt-4">
          Send Reset Link
        </button>
      </form>

      <div class="mt-20 text-[9px] text-white/30 md:text-gray-400 text-center uppercase tracking-[0.2em]">
        A secure link will be dispatched shortly.
      </div>
    </div>
  `;
}

function attachEventListeners() {
  // Navigation
  document.getElementById('goto-signup')?.addEventListener('click', () => { state.mode = 'signup'; state.error = null; updateUI(); });
  document.getElementById('goto-login')?.addEventListener('click', () => { state.mode = 'login'; state.error = null; state.success = null; updateUI(); });
  document.getElementById('goto-reset')?.addEventListener('click', () => { state.mode = 'reset'; state.error = null; updateUI(); });

  // Forms
  document.getElementById('login-form')?.addEventListener('submit', handleLogin);
  document.getElementById('signup-form')?.addEventListener('submit', handleSignup);
  document.getElementById('reset-form')?.addEventListener('submit', handleReset);

  // Social
  document.querySelectorAll('.social-login-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const provider = btn.getAttribute('data-provider');
      api.socialLogin(provider);
    });
  });

  // Password Strength for Signup
  const signupPw = document.getElementById('signup-pw');
  if (signupPw) {
    signupPw.addEventListener('input', e => {
      const val = e.target.value;
      const strength = getPasswordStrength(val);
      renderPasswordStrength(strength, val);
    });
  }
}

function getPasswordStrength(password) {
  if (!password) return 0;
  let score = 0;
  if (password.length > 5) score++;
  if (/[A-Z]/.test(password) || /[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password) && password.length >= 8) score++;
  return score;
}

function renderPasswordStrength(strength, password) {
  const container = document.getElementById('password-strength');
  if (!container) return;

  const strengthText = strength === 0 ? 'Enter Password' : strength === 1 ? 'Vulnerable' : strength === 2 ? 'Moderate' : 'Formidable';
  const strengthColor = strength === 0 ? 'text-white/20' : strength === 1 ? 'text-red-400' : strength === 2 ? 'text-yellow-400' : 'text-emerald-400';

  container.innerHTML = `
    <div class="flex gap-1.5 h-1 mb-2">
      ${[1, 2, 3].map(level => `
        <div class="flex-1 rounded-full transition-all duration-500 ${
          strength >= level 
            ? strength === 1 ? 'bg-red-400' 
            : strength === 2 ? 'bg-yellow-400' 
            : 'bg-emerald-400'
            : 'bg-white/5'
        }"></div>
      `).join('')}
    </div>
    <div class="flex justify-between items-center text-[7px] uppercase tracking-[0.2em] font-bold">
      <span class="text-white/20 text-[8px]">Protection Level</span>
      <span class="${strengthColor} text-[8px]">${strengthText}</span>
    </div>
  `;
}

async function handleLogin(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const email = formData.get('email');
  const password = formData.get('password');
  const remember = formData.get('remember') === 'on';

  try {
    const { user, token } = await api.login(email, password);
    state.user = user;
    if (remember) localStorage.setItem('auth_token', token);
    else sessionStorage.setItem('auth_token', token);
    updateUI();
  } catch (err) {
    state.error = err.message;
    updateUI();
  }
}

async function handleSignup(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const email = formData.get('email');
  const password = formData.get('password');
  const name = formData.get('name');

  try {
    const { user, token } = await api.signup(email, password, name);
    state.user = user;
    localStorage.setItem('auth_token', token);
    updateUI();
  } catch (err) {
    state.error = err.message;
    updateUI();
  }
}

async function handleReset(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const email = formData.get('email');

  try {
    await api.resetPassword(email);
    state.success = 'Reset link sent to your inbox.';
    state.error = null;
    updateUI();
  } catch (err) {
    state.error = err.message;
    state.success = null;
    updateUI();
  }
}

function handleLogout() {
  state.user = null;
  localStorage.removeItem('auth_token');
  sessionStorage.removeItem('auth_token');
  updateUI();
}

// Initial session check
async function init() {
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  if (token) {
    try {
      state.user = await api.getMe(token);
    } catch (err) {
      localStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_token');
    }
  }
  state.loading = false;
  updateUI();
}

init();
