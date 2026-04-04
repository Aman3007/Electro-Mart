import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useSelector } from 'react-redux';

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { user } = useSelector(state => state.auth);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post('/contact', data);
      toast.success('Message sent! We\'ll get back to you soon.');
      setSent(true);
      reset();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-500/10 border border-primary-500/20 text-3xl mb-4">📧</div>
        <h1 className="text-4xl font-bold font-display text-white mb-3">Get in Touch</h1>
        <p className="text-dark-300 max-w-lg mx-auto">
          Have a question or need help? We're here for you. Send us a message and we'll respond within 24 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact info */}
        <div className="space-y-4">
          {[
            { icon: '📧', title: 'Email', value: 'support@electromart.com', desc: 'We typically respond within 24 hours' },
            { icon: '💬', title: 'Live Chat', value: 'Available on all listings', desc: 'Chat directly with sellers' },
            { icon: '⚡', title: 'Quick Help', value: 'FAQ & Guides', desc: 'Find instant answers' },
          ].map(item => (
            <div key={item.title} className="glass-card p-5 flex gap-4">
              <div className="text-2xl">{item.icon}</div>
              <div>
                <h3 className="font-semibold text-white text-sm">{item.title}</h3>
                <p className="text-primary-400 text-sm">{item.value}</p>
                <p className="text-dark-400 text-xs mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}

          <div className="glass-card p-5">
            <h3 className="font-semibold text-white mb-3 text-sm">Common Questions</h3>
            <ul className="space-y-2 text-sm text-dark-300">
              <li className="hover:text-primary-400 transition-colors cursor-pointer">→ How to create a listing?</li>
              <li className="hover:text-primary-400 transition-colors cursor-pointer">→ Is payment secure?</li>
              <li className="hover:text-primary-400 transition-colors cursor-pointer">→ How does chat work?</li>
              <li className="hover:text-primary-400 transition-colors cursor-pointer">→ Can I edit my listing?</li>
            </ul>
          </div>
        </div>

        {/* Contact form */}
        <div className="lg:col-span-2">
          {sent ? (
            <div className="glass-card p-12 text-center animate-fade-in">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-2xl font-bold font-display text-white mb-3">Message Sent!</h3>
              <p className="text-dark-300 mb-6">
                Thank you for reaching out. Our team will get back to you within 24 hours.
              </p>
              <button onClick={() => setSent(false)} className="btn-primary px-8">
                Send Another Message
              </button>
            </div>
          ) : (
            <div className="glass-card p-8">
              <h2 className="text-xl font-bold font-display text-white mb-6">Send Us a Message</h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-200 mb-1.5">Your Name *</label>
                    <input
                      {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Too short' } })}
                      className="input-field"
                      placeholder="John Doe"
                    />
                    {errors.name && <p className="mt-1 text-xs text-danger">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-200 mb-1.5">Email Address *</label>
                    <input
                      type="email"
                      {...register('email', { required: 'Email is required' })}
                      className="input-field"
                      placeholder="you@example.com"
                    />
                    {errors.email && <p className="mt-1 text-xs text-danger">{errors.email.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-1.5">Subject *</label>
                  <input
                    {...register('subject', { required: 'Subject is required', minLength: { value: 3, message: 'Too short' } })}
                    className="input-field"
                    placeholder="What's this about?"
                  />
                  {errors.subject && <p className="mt-1 text-xs text-danger">{errors.subject.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-1.5">Message *</label>
                  <textarea
                    {...register('message', { required: 'Message is required', minLength: { value: 10, message: 'Please write at least 10 characters' } })}
                    className="input-field min-h-[140px] resize-y"
                    placeholder="Describe your question or issue in detail..."
                  />
                  {errors.message && <p className="mt-1 text-xs text-danger">{errors.message.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3 text-base"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending...
                    </span>
                  ) : '📧 Send Message'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;