import { useState } from 'react';
import { LockKeyhole, LogIn, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useScoreboard } from '@/hooks/useScoreboard';

import { WhiteLogo } from '@/components/common/WhiteLogo';
import { Logo } from '@/components/common/Logo';

import { login } from '@/api/api';

export function LoginPage() {
  const navigate = useNavigate();
  const scoreboard = useScoreboard();

  const [email, setEmail] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter your login credentials.');
      return;
    }

    try {
      setIsLoading(true);

      const response = await login(
        email.trim(),
        password
      );

      localStorage.setItem(
        'token',
        response.token
      );

      navigate('/controlcentre');
    } catch (error) {
      setError('Invalid login credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-side">
        <Logo />

        <div className="login-message">
          <span className="eyebrow">
            <LockKeyhole size={14} /> PRIVATE CONTROL CENTER
          </span>

          <h1>
            Make every
            <br />
            <em>moment</em> count.
          </h1>

          <p>
            The fastest way to keep your calling floor informed, motivated and
            moving forward.
          </p>

          <div className="login-proof">
          <div>
            <strong>{scoreboard.target}</strong>
            <span>daily target</span>
          </div>

          <div>
            <strong>{String(scoreboard.teams.length).padStart(2, '0')}</strong>
            <span>active teams</span>
          </div>

          <div>
            <strong>
              {String(scoreboard.rankedEmployees[0]?.transfers ?? 0).padStart(2, '0')}
            </strong>
            <span>top transfers</span>
          </div>
        </div>
        </div>

        <span className="login-foot">
          LEVI COMMUNICATIONS <b>·</b> PERFORMANCE SYSTEMS
        </span>
      </div>

      <div className="login-form-side">
        <button
          className="back-button"
          onClick={() => navigate('/scoreboard')}
        >
          ← Back to scoreboard
        </button>

        <div className="login-form">
          <div className="login-form-logo">
            <WhiteLogo compact />
          </div>

          <span className="eyebrow">WELCOME BACK</span>

          <h2>Sign in to control</h2>

          <p>Update the scorecard and keep your team in the race.</p>

          <label>
            Email address
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              disabled={isLoading}
            />
          </label>

          <label>
            Password
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              disabled={isLoading}
            />
          </label>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button
            className="primary-button full-button"
            onClick={handleLogin}
            disabled={isLoading}
          >
            <LogIn size={16} />
            {isLoading
              ? 'Signing in...'
              : 'Enter control center'}
          </button>

          <div className="demo-note">
            <ShieldCheck size={15} /> Demo mode is ready. No account setup
            required.
          </div>
        </div>
      </div>
    </div>
  );
}
