import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../Components/AuthLayout'; 
import { motion } from 'framer-motion'; 
import { Loader2 } from 'lucide-react';



const SignUp=()=> {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.password.length < 6) { 
        setError('Password must be at least 6 characters long.');
        return;
    }

    try {
      setLoading(true);
      const response = await fetch('https://ai-amigos-ethermail.onrender.com/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword, 
        }),
      });

      const data = await response.json();

      console.log('Signup attempt for:', formData.email); 

      if (!response.ok) {
        
        throw new Error(data.message || `Sign-up failed (Status: ${response.status})`);
      }

     
      console.log("Signup successful:", data);
      navigate('/login'); 

   
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
       console.error("Signup Error:", err); 
      
      if (err.message.includes('already exists')) {
        setError('An account with this email or username already exists.');
      } else if (err.message.includes('failed (Status: 5')) {
        setError('Something went wrong on our end. Please try again later.');
      } else {
        setError(err.message || 'An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
   
    if (error) setError('');
  };

  const cardVariants = {
      hidden: { opacity: 0, y: 30, scale: 0.95 },
      visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }
      }
  };


  return (
    <AuthLayout>
       <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/70 p-8 md:p-10 w-full" // Updated card style
       >
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          <span className="bg-gradient-to-r from-cyan-500 to-purple-600 bg-clip-text text-transparent">
            Join AetherMail
          </span>
        </h2>

        {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-red-600 bg-red-100 border border-red-300 rounded-md text-sm p-3 text-center mb-6"
              role="alert" 
            >
              {error}
            </motion.p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
         
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1.5">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-300 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition duration-200 text-gray-800 placeholder-gray-400 shadow-sm"
              placeholder="Choose a unique username"
              disabled={loading}
            />
          </div>

       
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email" 
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-300 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition duration-200 text-gray-800 placeholder-gray-400 shadow-sm"
              placeholder="you@example.com"
              disabled={loading}
            />
          </div>

       
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password" 
              required
              minLength={6} 
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-300 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition duration-200 text-gray-800 placeholder-gray-400 shadow-sm"
              placeholder="Create a strong password (min. 6 chars)"
              disabled={loading}
            />
          </div>

   
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-300 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition duration-200 text-gray-800 placeholder-gray-400 shadow-sm"
              placeholder="Re-enter your password"
              disabled={loading}
            />
          </div>

          <motion.button
            whileHover={{ scale: loading ? 1 : 1.03, y: loading ? 0 : -1, filter: loading ? 'none' : 'brightness(1.1)' }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            type="submit"
            className={`w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            <span>{loading ? 'Creating Account...' : 'Sign Up'}</span>
          </motion.button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-cyan-600 hover:text-cyan-800 transition-colors">
            Log In
          </Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
}

export default SignUp; 