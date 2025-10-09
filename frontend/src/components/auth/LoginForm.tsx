import React, { useState } from 'react';
import TextInputField from '../common/TextInputField';
import Button from '../common/Button';

const LoginForm = ({ onLogin, isLoading = false, error = null }) => {
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({ userId, password });
  };

  return (
    <form onSubmit={handleSubmit} className="">
      <TextInputField
        id="userId"
        label="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        placeholder="Enter your user ID"
        required
      />

      <TextInputField
        id="password"
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        required
      />

      {error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}
      
      <Button
        className="w-full bg-gray-900 text-white py-3 rounded hover:bg-gray-800 disabled:opacity-50"
        label={isLoading ? 'Signing in...' : 'Sign in'}
        type="submit"
        disabled={isLoading}
      />
    </form>
  );
};

export default LoginForm;