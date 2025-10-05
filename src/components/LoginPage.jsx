import React from 'react';
import { User, CheckCircle } from 'lucide-react';

const LoginPage = ({
  showForgotPassword,
  setShowForgotPassword,
  forgotPasswordSuccess,
  setForgotPasswordSuccess,
  forgotEmail,
  handleForgotEmailChange,
  forgotPasswordError,
  forgotPasswordLoading,
  handleForgotPassword,
  showRegister,
  setShowRegister,
  registerSuccess,
  setRegisterSuccess,
  registerData,
  handleRegisterChange,
  registerError,
  registerLoading,
  handleRegister,
  loginEmail,
  handleLoginEmailChange,
  loginPassword,
  handleLoginPasswordChange,
  loginError,
  loginLoading,
  handleLogin,
  setLoginError,
  setRegisterError,
  isRTL,
  t
}) => {
  return (
    <div className={`pt-24 pb-16 min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {showForgotPassword ? 'Reset Password' : showRegister ? 'Register' : 'Client Login'}
            </h1>
          </div>

          {showForgotPassword ? (
            forgotPasswordSuccess ? (
              <div className="space-y-6">
                <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-green-900 mb-2">Request Sent!</h3>
                  <p className="text-green-800 mb-4">We've received your password reset request.</p>
                  <p className="text-green-700">Our team will contact you via email within 24 hours to help you reset your password.</p>
                </div>
                <button
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotPasswordSuccess(false);
                  }}
                  className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
                >
                  Back to Login
                </button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); handleForgotPassword(e); }} className="space-y-6">
                <p className="text-gray-600 text-center">Enter your email address and we'll help you reset your password.</p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={handleForgotEmailChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="your@email.com"
                    autoComplete="email"
                  />
                </div>
                {forgotPasswordError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">{forgotPasswordError}</p>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={forgotPasswordLoading || !forgotEmail}
                  className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {forgotPasswordLoading ? 'Sending...' : 'Send Reset Request'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                  }}
                  className="w-full text-blue-900 hover:text-blue-700 font-medium"
                >
                  Back to Login
                </button>
              </form>
            )
          ) : !showRegister ? (
            <form onSubmit={(e) => { e.preventDefault(); handleLogin(e); }} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={handleLoginEmailChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="your@email.com"
                  autoComplete="email"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-blue-900 hover:text-blue-700"
                  >
                    Forgot Password?
                  </button>
                </div>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={handleLoginPasswordChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="password"
                  autoComplete="current-password"
                />
              </div>
              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{loginError}</p>
                </div>
              )}
              <button
                type="submit"
                disabled={loginLoading || !loginEmail || !loginPassword}
                className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loginLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          ) : registerSuccess ? (
            <div className="space-y-6">
              <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-green-900 mb-2">Registration Successful!</h3>
                <p className="text-green-800 mb-4">Thank you for registering with Euro Expat.</p>
                <p className="text-green-700">We will review your application and contact you within 24-48 hours to activate your account and discuss your residency needs.</p>
              </div>
              <button
                onClick={() => {
                  setShowRegister(false);
                  setRegisterSuccess(false);
                }}
                className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
              >
                Back to Login
              </button>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); handleRegister(e); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={registerData.name}
                  onChange={handleRegisterChange('name')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="John Doe"
                  autoComplete="name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={registerData.email}
                  onChange={handleRegisterChange('email')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="your@email.com"
                  autoComplete="email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={registerData.phone}
                  onChange={handleRegisterChange('phone')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="+351 XXX XXX XXX"
                  autoComplete="tel"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value={registerData.password}
                  onChange={handleRegisterChange('password')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="minimum 8 characters"
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={registerData.password_confirmation}
                  onChange={handleRegisterChange('password_confirmation')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="confirm password"
                  autoComplete="new-password"
                />
              </div>
              {registerError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{registerError}</p>
                </div>
              )}
              <button
                type="submit"
                disabled={registerLoading || !registerData.name || !registerData.email || !registerData.password}
                className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {registerLoading ? 'Registering...' : 'Register'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setShowRegister(!showRegister);
                setRegisterError('');
                setLoginError('');
              }}
              className="text-blue-900 hover:text-blue-700 font-medium"
            >
              {showRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(LoginPage);
