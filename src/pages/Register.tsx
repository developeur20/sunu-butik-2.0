import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, ShieldCheck } from 'lucide-react';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Le nom doit faire au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit faire au moins 8 caractères'),
  confirmPassword: z.string().min(8, 'Le mot de passe doit faire au moins 8 caractères'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    console.log('Registration attempt:', data);
    // Simulating creation
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gris">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full space-y-8 bg-white p-10 rounded-[40px] shadow-2xl border border-gray-50"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold font-display text-secondary tracking-tight">Rejoignez-nous !</h2>
          <p className="mt-2 text-sm text-gray-400">
            Créez votre compte SUNU BUTIK 2.0 et commencez votre aventure.
          </p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-4 py-1">Nom complet</label>
            <div className="relative">
              <input
                {...register('fullName')}
                type="text"
                className="appearance-none block w-full px-12 py-4 border border-gray-100 rounded-2xl placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm bg-gris text-secondary font-medium"
                placeholder="Prénom Nom"
              />
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            {errors.fullName && <p className="mt-1 text-xs text-red-500 ml-4">{errors.fullName.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-4 py-1">Email</label>
            <div className="relative">
              <input
                {...register('email')}
                type="email"
                className="appearance-none block w-full px-12 py-4 border border-gray-100 rounded-2xl placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm bg-gris text-secondary font-medium"
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
                className="appearance-none block w-full px-12 py-4 border border-gray-100 rounded-2xl placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm bg-gris text-secondary font-medium"
                placeholder="••••••••"
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-500 ml-4">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-4 py-1">Confirmer mot de passe</label>
            <div className="relative">
              <input
                {...register('confirmPassword')}
                type="password"
                className="appearance-none block w-full px-12 py-4 border border-gray-100 rounded-2xl placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm bg-gris text-secondary font-medium"
                placeholder="••••••••"
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-500 ml-4">{errors.confirmPassword.message}</p>}
          </div>

          <div className="pt-4">
            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-2xl text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-xl disabled:opacity-50"
            >
              {isSubmitting ? 'Création...' : 'Créer un compte'}
            </button>
          </div>
        </form>

        <div className="text-center">
           <p className="text-xs text-gray-400 mt-4 leading-relaxed">
             En créant un compte, vous acceptez nos <Link to="/terms" className="text-secondary font-bold hover:underline">Conditions d'Utilisation</Link> et notre <Link to="/privacy" className="text-secondary font-bold hover:underline">Politique de Confidentialité</Link>.
           </p>
          <div className="h-px bg-gray-50 my-8"></div>
          <p className="text-xs text-gray-500">
            Vous avez déjà un compte ?{' '}
            <Link to="/login" className="font-bold text-secondary hover:text-primary underline underline-offset-4">
              Se connecter
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
