import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import './App.css';

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="brand">DEV@Deakin</Link>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Sign Up</Link>
      </div>
    </nav>
  );
}

function Home() {
  return (
    <>
      <Navbar />
      <main className="home-page">
        <h1>Welcome to DEV@Deakin</h1>
        <p>Discover and share your ideas with the Deakin community.</p>
        <div className="home-buttons">
          <Link to="/login" className="button">Login</Link>
          <Link to="/register" className="button secondary">Create Account</Link>
        </div>
      </main>
      <footer>© DEV@Deakin</footer>
    </>
  );
}

function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleRegister(event) {
    event.preventDefault();
    setError('');

    if (fullName.trim().split(/\s+/).length < 2) {
      setError('Please enter your first and last name.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    try {
      setLoading(true);

      const result = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      await updateProfile(result.user, {
        displayName: fullName.trim()
      });

      await setDoc(doc(db, 'users', result.user.uid), {
        firstName: fullName.trim().split(/\s+/)[0],
        lastName: fullName.trim().split(/\s+/).slice(1).join(' '),
        email: email.trim()
      });
      navigate('/login', {
        state: { message: 'Registration successful. Please log in.' }
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="auth-page">
        <form className="auth-card" onSubmit={handleRegister}>
          <h1>Create an Account</h1>
          <p>Join the DEV@Deakin community</p>

          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            type="text"
            placeholder="Enter your first and last name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            autoComplete="name"
            required
          />

          <label htmlFor="registerEmail">Email Address</label>
          <input
            id="registerEmail"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          <label htmlFor="registerPassword">Password</label>
          <input
            id="registerPassword"
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            minLength="6"
            required
          />

          {error && <p className="error-message">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>

          <p className="switch-page">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </main>
      <footer>© DEV@Deakin</footer>
    </>
  );
}

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(event) {
    event.preventDefault();
    setError('');

    try {
      setLoading(true);

      await signInWithEmailAndPassword(auth, email.trim(), password);

      navigate('/');
    } catch {
      setError('Login failed. Check your email and password, or sign up for an account.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="auth-page">
        <form className="auth-card" onSubmit={handleLogin}>
          <h1>Welcome Back</h1>
          <p>Login to your DEV@Deakin account</p>

          <label htmlFor="loginEmail">Email Address</label>
          <input
            id="loginEmail"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          <label htmlFor="loginPassword">Password</label>
          <input
            id="loginPassword"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          {error && <p className="error-message">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <p className="switch-page">
            Don't have an account? <Link to="/register">Sign Up</Link>
          </p>
        </form>
      </main>
      <footer>© DEV@Deakin</footer>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;