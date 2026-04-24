import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { register as registerUser, clearError } from '../store/slices/authSlice';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(state => state.auth);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { role: 'buyer' }
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const onSubmit = async (data) => {
    const { confirmPassword, ...userData } = data;
    const result = await dispatch(registerUser(userData));
    if (registerUser.fulfilled.match(result)) {
      navigate('/dashboard');
    }
  };

  const watchRole = watch('role');

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary-500 flex items-center justify-center text-dark-950 text-3xl mx-auto mb-4">⚡</div>
          <h1 className="text-3xl font-bold font-display text-white mb-2">Create account</h1>
          <p className="text-dark-300">Join thousands of electronics traders</p>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-1.5">Full Name</label>
              <input
                type="text"
                {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } })}
                className="input-field"
                placeholder="John Doe"
              />
              {errors.name && <p className="mt-1 text-xs text-danger">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-200 mb-1.5">Email Address</label>
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                className="input-field"
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-1 text-xs text-danger">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-200 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
                  className="input-field pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-dark-400 hover:text-dark-200"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.275 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-danger">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-200 mb-1.5">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register('confirmPassword', {
                    required: 'Please confirm password',
                    validate: val => val === watch('password') || 'Passwords do not match'
                  })}
                  className="input-field pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-dark-400 hover:text-dark-200"
                >
                  {showConfirmPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.275 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-xs text-danger">{errors.confirmPassword.message}</p>}
            </div>

            {/* Role selection */}
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-2">I want to</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'buyer', label: '🛒 Buy', desc: 'Browse & buy' },
                  { value: 'seller', label: '🏪 Sell', desc: 'List items' },
                  { value: 'both', label: '🔄 Both', desc: 'Buy & sell' },
                ].map(opt => (
                  <label key={opt.value} className={`flex flex-col items-center p-3 rounded-xl border cursor-pointer transition-all ${watchRole === opt.value
                    ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                    : 'border-dark-600 hover:border-dark-500 text-dark-300'
                    }`}>
                    <input type="radio" value={opt.value} {...register('role')} className="hidden" />
                    <span className="text-lg">{opt.label}</span>
                    <span className="text-xs mt-0.5">{opt.desc}</span>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-center mt-6 text-dark-300 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="link-hover font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
