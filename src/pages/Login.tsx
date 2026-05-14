import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck, Mail as MailIcon } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit faire au moins 8 caractères'),
});

type LoginForm = z.infer<typeof loginSchema>;

interface LoginProps {
  onLogin: () => void;
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = useStore();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    // Mock authentication logic
    console.log('Login attempt:', data);
    
    // Admin check
    if (data.email === 'ngaryservicepro@gmail.com' && data.password === '123456789@') {
      login(data.email, 'admin');
      navigate('/admin');
      return;
    }

    // Default simulation as Customer
    login(data.email, 'customer');
    navigate('/');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gris">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white p-10 rounded-[40px] shadow-2xl border border-gray-50"
      >
        <div className="text-center">
          <div className="mx-auto w-16 h-16 brand-gradient rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-xl mb-6">S</div>
          <h2 className="text-3xl font-bold font-display text-secondary">Bon retour !</h2>
          <p className="mt-2 text-sm text-gray-500">
            Connectez-vous à SUNU BUTIK 2.0 pour continuer votre shopping.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-4 py-1">Email</label>
              <div className="relative">
                <input
                  {...register('email')}
                  type="email"
                  autoComplete="email"
                  className="appearance-none block w-full px-12 py-4 border border-gray-100 rounded-2xl placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm bg-gris"
                  placeholder="exemple@mail.com"
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500 ml-4">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-4 py-1">Mot de passe</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type="password"
                  autoComplete="current-password"
                  className="appearance-none block w-full px-12 py-4 border border-gray-100 rounded-2xl placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm bg-gris"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500 ml-4">{errors.password.message}</p>}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-xs font-medium text-gray-500">
                Se souvenir de moi
              </label>
            </div>

            <div className="text-xs">
              <Link to="/forgot-password" className="font-bold text-primary hover:text-secondary">
                Mot de passe oublié ?
              </Link>
            </div>
          </div>

          <div>
            <button
              disabled={isSubmitting}
              type="submit"
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-2xl text-white bg-secondary hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-xl disabled:opacity-50"
            >
               {isSubmitting ? 'Connexion en cours...' : 'Se Connecter'}
            </button>
          </div>
        </form>

        <div className="text-center pt-4">
          <p className="text-xs text-gray-500">
            Pas encore de compte ?{' '}
            <Link to="/register" className="font-bold text-primary hover:text-secondary underline underline-offset-4">
              Créer un compte gratuitement
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
