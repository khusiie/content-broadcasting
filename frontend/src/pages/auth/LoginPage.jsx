import { useState, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LogIn, UserPlus, Shield, GraduationCap, Tv } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import { loginSchema, registerSchema } from '../../utils/validators';
import Button from '../../components/ui/Button';
import FormField from '../../components/ui/FormField';
const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState('teacher');
  const { login, register: registerUser } = useAuth();
  const toast = useToast();
  const schema = useMemo(() => isLogin ? loginSchema : registerSchema, [isLogin]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'teacher',
    },
  });
  const handleRoleSelect = useCallback((role) => {
    setSelectedRole(role);
    setValue('role', role);
  }, [setValue]);
  const onSubmit = useCallback(async (formData) => {
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast.success('Login successful!');
      } else {
        await registerUser(formData.name, formData.email, formData.password, formData.role);
        toast.success('Registration successful! Please login.');
        setIsLogin(true);
        reset();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong. Please try again.');
    }
  }, [isLogin, login, registerUser, toast, reset]);
  const toggleMode = useCallback(() => {
    setIsLogin(prev => !prev);
    reset();
  }, [reset]);
  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md animate-fade-in">
          <div className="flex items-center gap-2.5 mb-12">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Tv size={20} className="text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">EDU-CAST</span>
          </div>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-gray-400">
              {isLogin
                ? 'Sign in to manage your broadcast content'
                : 'Join the educational broadcasting platform'
              }
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            {!isLogin && (
              <FormField label="Full Name" required error={errors.name?.message}>
                <input
                  type="text"
                  className="glass-input"
                  placeholder="John Doe"
                  {...register('name')}
                />
              </FormField>
            )}
            <FormField label="Email Address" required error={errors.email?.message}>
              <input
                type="email"
                className="glass-input"
                placeholder="name@school.com"
                {...register('email')}
              />
            </FormField>
            <FormField label="Password" required error={errors.password?.message}>
              <input
                type="password"
                className="glass-input"
                placeholder="••••••••"
                {...register('password')}
              />
            </FormField>
            {!isLogin && (
              <FormField label="Select Your Role" required error={errors.role?.message}>
                <div className="grid grid-cols-2 gap-3 mt-1">
                  <button
                    type="button"
                    className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border transition-all ${
                      selectedRole === 'teacher'
                        ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/30'
                        : 'border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-300'
                    }`}
                    onClick={() => handleRoleSelect('teacher')}
                  >
                    <GraduationCap size={18} />
                    <span className="font-medium">Teacher</span>
                  </button>
                  <button
                    type="button"
                    className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border transition-all ${
                      selectedRole === 'principal'
                        ? 'border-purple-500 bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/30'
                        : 'border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-300'
                    }`}
                    onClick={() => handleRoleSelect('principal')}
                  >
                    <Shield size={18} />
                    <span className="font-medium">Principal</span>
                  </button>
                </div>
              </FormField>
            )}
            <Button
              type="submit"
              loading={isSubmitting}
              fullWidth
              size="lg"
              icon={isLogin ? LogIn : UserPlus}
              className="mt-2"
            >
              {isSubmitting ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>
          <div className="mt-8 text-center text-sm text-gray-400">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={toggleMode}
              className="text-indigo-400 font-semibold hover:underline"
            >
              {isLogin ? 'Register Now' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
      <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden bg-gradient-to-br from-indigo-950/50 to-purple-950/50 border-l border-white/5">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 right-20 w-72 h-72 bg-indigo-500/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 text-center p-12 animate-fade-in" key={selectedRole}>
          <img
            src={selectedRole === 'teacher' ? '/teacher-illustration.png' : '/principal-illustration.png'}
            alt={selectedRole === 'teacher' ? 'Teacher' : 'Principal'}
            className="w-full max-w-md mx-auto mb-8 drop-shadow-2xl transition-all duration-500"
          />
          <h2 className="text-2xl font-bold mb-3">
            {selectedRole === 'teacher'
              ? 'Empower Your Students'
              : 'Lead With Clarity'
            }
          </h2>
          <p className="text-gray-400 max-w-sm mx-auto">
            {selectedRole === 'teacher'
              ? 'Upload, schedule, and broadcast educational content directly to student displays.'
              : 'Review, approve, and manage all educational content across your institution.'
            }
          </p>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
