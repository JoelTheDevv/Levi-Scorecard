import { useState } from 'react';
import { LockKeyhole, LogIn, ShieldCheck, KeyRound } from 'lucide-react';import { useNavigate } from 'react-router-dom';
import { useScoreboard } from '@/hooks/useScoreboard';

import { WhiteLogo } from '@/components/common/WhiteLogo';
import { Logo } from '@/components/common/Logo';

import { changePassword, login } from '@/api/api';

export function LoginPage() {
  const navigate = useNavigate();
  const scoreboard = useScoreboard();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [secretCode, setSecretCode] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

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

  const handleChangePassword = async () => {
  setPasswordMessage('');
  setPasswordError('');

  if (!email.trim() || !currentPassword || !newPassword || !secretCode) {
    setPasswordError('Please fill in all fields.');
    return;
  }

  try {
    setIsLoading(true);

    const message = await changePassword(
      email.trim(),
      currentPassword,
      newPassword,
      secretCode
    );

    setPasswordMessage(message);
    setPassword('');
    setCurrentPassword('');
    setNewPassword('');
    setSecretCode('');
  } catch (error) {
    setPasswordError(
      error instanceof Error ? error.message : 'Password change failed.'
    );
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

          <button
  type="button"
  className="back-button"
  onClick={() => {
    setShowChangePassword(!showChangePassword);
    setPasswordError('');
    setPasswordMessage('');
  }}
>
  {showChangePassword ? 'Back to login' : 'Change password'}
</button>

{showChangePassword && (
  <div className="change-password-form">
    <h3>Change Password</h3>

    <label>
      Current Password
      <input
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />
    </label>

    <label>
      New Password
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
    </label>

    <label>
      Secret Code
      <input
        type="password"
        value={secretCode}
        onChange={(e) => setSecretCode(e.target.value)}
      />
    </label>

    {passwordError && (
      <div className="login-error">{passwordError}</div>
    )}

    {passwordMessage && (
      <div className="login-success">{passwordMessage}</div>
    )}

    <button
      className="primary-button full-button"
      onClick={handleChangePassword}
      disabled={isLoading}
    >
      <KeyRound size={16} />
      {isLoading ? 'Changing...' : 'Update Password'}
    </button>
  </div>
)}

        </div>
      </div>
    </div>
  );
}
