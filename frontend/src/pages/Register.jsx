import { useEffect } from 'react';
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
              <input
                type="password"
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
                className="input-field"
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-1 text-xs text-danger">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-200 mb-1.5">Confirm Password</label>
              <input
                type="password"
                {...register('confirmPassword', {
                  required: 'Please confirm password',
                  validate: val => val === watch('password') || 'Passwords do not match'
                })}
                className="input-field"
                placeholder="••••••••"
              />
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
              ) : 'Create Account 🚀'}
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