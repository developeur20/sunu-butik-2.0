import { motion } from 'motion/react';
import { Check, Shield, Zap, Award, Crown, Users, TrendingUp, Globe, Briefcase } from 'lucide-react';
import { PLANS, PlanId } from '../types';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';

const PLAN_ICONS: Record<PlanId, any> = {
  basic: Shield,
  standard: Zap,
  premium: Crown,
  business_pro: Briefcase,
};

const PLAN_COLORS: Record<PlanId, string> = {
  basic: 'text-blue-500 bg-blue-50',
  standard: 'text-indigo-500 bg-indigo-50',
  premium: 'text-primary bg-red-50',
  business_pro: 'text-secondary bg-gray-100',
};

export default function Subscriptions() {
  const { updateSubscription, currentUser } = useStore();
  const navigate = useNavigate();

  const handleSelectPlan = (planId: PlanId) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    updateSubscription(currentUser.uid, planId);
    navigate('/dashboard');
  };
  return (
    <div className="py-20 space-y-24">
      {/* Header */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest"
        >
          <Award className="w-4 h-4" /> Solutions Business
        </motion.div>
        <h1 className="text-4xl sm:text-6xl font-bold font-display text-secondary leading-tight">
          Passez à la Vitesse Supérieure avec <span className="text-primary italic">SUNU BUTIK Business</span>.
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Choisissez le plan qui correspond à la taille de votre entreprise. Gérez vos stocks, vos équipes et vos ventes avec des outils professionnels.
        </p>
      </section>

      {/* Plans Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {(Object.keys(PLANS) as PlanId[]).map((planId, index) => {
            const plan = PLANS[planId];
            const Icon = PLAN_ICONS[planId];
            const isPremium = planId === 'premium' || planId === 'business_pro';

            return (
              <motion.div 
                key={planId}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative flex flex-col p-8 rounded-[40px] bg-white border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 group ${isPremium ? 'ring-2 ring-primary ring-offset-4 ring-offset-gris' : ''}`}
              >
                {planId === 'premium' && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">
                    Le plus populaire
                  </div>
                )}
                
                <div className="mb-8 flex items-center justify-between">
                  <div className={`w-14 h-14 rounded-2xl ${PLAN_COLORS[planId]} flex items-center justify-center`}>
                    <Icon className="w-8 h-8" />
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-secondary mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-secondary">{plan.price.toLocaleString()}</span>
                    <span className="text-sm font-medium text-gray-400">FCFA / mois</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-10 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex gap-3 text-sm text-gray-600">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => handleSelectPlan(planId)}
                  className={`w-full py-4 rounded-2xl font-bold transition-all ${isPremium ? 'bg-primary text-white hover:bg-secondary shadow-lg' : 'bg-secondary text-white hover:bg-primary'}`}
                >
                  Choisir ce plan
                </button>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Feature highlight */}
      <section className="bg-secondary text-white py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold font-display mb-6">Gestion d'Équipe Intégrée</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Chaque plan vous permet de déléguer des tâches à vos collaborateurs en toute sécurité.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4 p-8 rounded-3xl bg-white/5 border border-white/10">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold">Multi-utilisateurs</h4>
              <p className="text-gray-400 text-sm">Ajoutez des employés selon vos besoins et votre abonnement.</p>
            </div>
            <div className="space-y-4 p-8 rounded-3xl bg-white/5 border border-white/10">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-500">
                <Shield className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold">Permissions Précises</h4>
              <p className="text-gray-400 text-sm">Contrôlez qui peut voir les stocks, gérer les ventes ou voir la caisse.</p>
            </div>
            <div className="space-y-4 p-8 rounded-3xl bg-white/5 border border-white/10">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-green-500">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold">Suivi d'Activité</h4>
              <p className="text-gray-400 text-sm">Gardez un œil sur les actions effectuées par chaque membre de l'équipe.</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-[100px] rounded-full"></div>
      </section>

      {/* FAQ Hook */}
      <section className="max-w-3xl mx-auto px-4 text-center">
        <h3 className="text-2xl font-bold text-secondary mb-4">Une question sur nos tarifs ?</h3>
        <p className="text-gray-500 mb-8">Notre équipe support est disponible par WhatsApp pour vous conseiller sur le meilleur plan pour votre activité.</p>
        <button className="px-8 py-4 bg-green-500 text-white rounded-2xl font-bold hover:shadow-xl transition-all inline-flex items-center gap-2">
          Contactez un Expert <Globe className="w-5 h-5" />
        </button>
      </section>
    </div>
  );
}
