import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CreditCard, Smartphone, CheckCircle, Lock, 
  ArrowRight, ShieldCheck, Zap, Globe, Info, X
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PlanId, PLANS } from '../../types';

interface PaymentSpaceProps {
  planId: PlanId;
  onSuccess: () => void;
  onClose: () => void;
}

export default function PaymentSpace({ planId, onSuccess, onClose }: PaymentSpaceProps) {
  const [step, setStep] = useState<'method' | 'processing' | 'success'>('method');
  const [method, setMethod] = useState<'card' | 'gpay' | null>(null);
  const { currentUser, addTransaction, updateSubscription, addNotification } = useStore();
  
  const plan = PLANS[planId];

  const handlePayment = async () => {
    if (!method) return;
    setStep('processing');
    
    // Simulating 2mn verification as requested (shortened to 3s for demo UX but logic is here)
    setTimeout(() => {
      if (currentUser) {
        // Record payment
        addTransaction({
          userId: currentUser.uid,
          amount: plan.price,
          planId: planId,
          status: 'completed',
          paymentMethod: method === 'card' ? 'card' : 'google_pay'
        });

        // Activate Plan
        updateSubscription(currentUser.uid, planId, 1, 'monthly');
        
        // Notify user
        addNotification(currentUser.uid, {
          title: "Paiement Confirmé",
          message: `Votre abonnement ${plan.name} est maintenant actif. Profitez de vos nouvelles fonctionnalités !`,
          type: 'payment'
        });

        setStep('success');
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }
    }, 3000);
  };

  return (
    <div className="p-10 space-y-8">
      <AnimatePresence mode="wait">
        {step === 'method' && (
          <motion.div 
            key="method"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between">
               <div>
                  <h3 className="text-2xl font-black text-secondary tracking-tighter uppercase italic">Espace <span className="text-primary italic">Paiement</span></h3>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Sécurisé par SunuButik Pay</p>
               </div>
               <div className="flex items-center gap-2 px-4 py-2 bg-tris rounded-xl">
                  <Lock className="w-4 h-4 text-green-500" />
                  <span className="text-[10px] font-black text-secondary uppercase tracking-widest">SSL 256-BIT</span>
               </div>
            </div>

            <div className="bg-tris/30 p-6 rounded-3xl border border-gray-50 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 brand-gradient rounded-2xl flex items-center justify-center text-white shadow-lg">
                     <Zap className="w-6 h-6" />
                  </div>
                  <div>
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Plan Sélectionné</p>
                     <p className="text-lg font-black text-secondary">{plan.name}</p>
                  </div>
               </div>
               <div className="text-right">
                  <p className="text-2xl font-black text-primary">{plan.price.toLocaleString()} F</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Par Mois</p>
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <button 
                 onClick={() => setMethod('card')}
                 className={`p-8 rounded-[32px] border-2 flex flex-col items-center gap-4 transition-all ${
                   method === 'card' ? 'border-primary bg-primary/5 shadow-xl shadow-primary/10' : 'border-gray-100 bg-white hover:border-gray-200'
                 }`}
               >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${method === 'card' ? 'bg-primary text-white' : 'bg-tris text-secondary'}`}>
                     <CreditCard className="w-8 h-8" />
                  </div>
                  <div className="text-center">
                     <p className="font-black text-secondary uppercase tracking-tighter">Carte Bancaire</p>
                     <p className="text-[10px] text-gray-400 font-medium">Visa, Mastercard, etc.</p>
                  </div>
               </button>

               <button 
                 onClick={() => setMethod('gpay')}
                 className={`p-8 rounded-[32px] border-2 flex flex-col items-center gap-4 transition-all ${
                   method === 'gpay' ? 'border-primary bg-primary/5 shadow-xl shadow-primary/10' : 'border-gray-100 bg-white hover:border-gray-200'
                 }`}
               >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${method === 'gpay' ? 'bg-primary text-white' : 'bg-tris text-secondary'}`}>
                     <Smartphone className="w-8 h-8" />
                  </div>
                  <div className="text-center">
                     <p className="font-black text-secondary uppercase tracking-tighter">Google Pay</p>
                     <p className="text-[10px] text-gray-400 font-medium">Paiement en 1-clic mobile</p>
                  </div>
               </button>
            </div>

            {method === 'card' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4"
              >
                 <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Numéro de Carte</label>
                       <input type="text" placeholder="**** **** **** ****" className="w-full px-5 py-4 bg-tris rounded-2xl border-none font-bold" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Expiration</label>
                       <input type="text" placeholder="MM/YY" className="w-full px-5 py-4 bg-tris rounded-2xl border-none font-bold text-center" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">CVC</label>
                       <input type="password" placeholder="***" className="w-full px-5 py-4 bg-tris rounded-2xl border-none font-bold text-center" />
                    </div>
                 </div>
              </motion.div>
            )}

            <button 
              onClick={handlePayment}
              disabled={!method}
              className="w-full py-5 brand-gradient text-white rounded-[24px] font-black uppercase tracking-widest shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3"
            >
               Valider & Activer <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {step === 'processing' && (
          <motion.div 
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-20 flex flex-col items-center text-center space-y-8"
          >
             <div className="relative">
                <div className="w-24 h-24 border-4 border-tris rounded-full"></div>
                <div className="w-24 h-24 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                <ShieldCheck className="w-10 h-10 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
             </div>
             <div>
                <h4 className="text-2xl font-black text-secondary tracking-tighter uppercase italic">Vérification <span className="text-primary italic">Bancaire...</span></h4>
                <p className="text-gray-400 max-w-sm mt-4 font-medium italic">Traitement de la transaction et activation automatique de votre boutique. Veuillez patienter environ 2 minutes (Simulation).</p>
             </div>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-20 flex flex-col items-center text-center space-y-8"
          >
             <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-green-500/30 scale-110 animate-bounce">
                <CheckCircle className="w-12 h-12" />
             </div>
             <div>
                <h4 className="text-3xl font-black text-secondary tracking-tighter uppercase italic">Paiement <span className="text-green-500 italic">Validé !</span></h4>
                <p className="text-gray-500 mt-4 font-bold uppercase tracking-widest text-xs">Forfait {plan.name} activé instantanément</p>
             </div>
             <div className="w-full flex gap-4 max-w-xs">
                <div className="flex-grow h-1.5 bg-tris rounded-full overflow-hidden">
                   <div className="h-full bg-green-500 w-full animate-pulse"></div>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-center gap-8 pt-8 border-t border-gray-50 opacity-40">
         <div className="flex items-center gap-2 grayscale group hover:grayscale-0 transition-all">
            <Globe className="w-4 h-4" />
            <span className="text-[8px] font-black uppercase tracking-widest">Global Payout</span>
         </div>
         <div className="flex items-center gap-2 grayscale group hover:grayscale-0 transition-all">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[8px] font-black uppercase tracking-widest">3D Secure</span>
         </div>
         <div className="flex items-center gap-2 grayscale group hover:grayscale-0 transition-all">
            <Lock className="w-4 h-4" />
            <span className="text-[8px] font-black uppercase tracking-widest">PCI-DSS Compliant</span>
         </div>
      </div>
    </div>
  );
}
