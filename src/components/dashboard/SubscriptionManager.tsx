import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, Calendar, CreditCard, ChevronRight, CheckCircle, 
  AlertCircle, History, Zap, ShieldCheck, Clock, X
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PLANS, PlanId } from '../../types';
import PaymentSpace from './PaymentSpace';

export default function SubscriptionManager() {
  const { currentUser, subscriptions } = useStore();
  const [selectedPlan, setSelectedPlan] = useState<PlanId>(currentUser?.subscriptionId ? (subscriptions.find(s => s.id === currentUser.subscriptionId)?.planId || 'basic') : 'basic');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [duration, setDuration] = useState(1);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const sub = subscriptions.find(s => s.userId === currentUser?.uid);
  const plan = PLANS[selectedPlan];
  
  const totalPrice = plan.price * duration * (billingCycle === 'yearly' ? 10 : 1);

  const handlePay = () => {
    setIsPaymentOpen(true);
  };

  const isExpired = sub ? new Date(sub.endDate) < new Date() : false;
  const daysRemaining = sub ? Math.ceil((new Date(sub.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <h3 className="text-2xl font-black text-secondary tracking-tighter uppercase italic">Mon <span className="text-primary italic">Abonnement</span></h3>
           <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Gérez votre puissance et vos privilèges</p>
        </div>
        {sub && (
           <div className={`px-6 py-3 rounded-2xl flex items-center gap-3 border shadow-sm ${isExpired ? 'bg-red-50 border-red-100 text-red-500' : 'bg-green-50 border-green-100 text-green-500'}`}>
              {isExpired ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">{isExpired ? 'Expiré' : 'Actif'}</p>
                 <p className="text-sm font-bold">{isExpired ? 'Boutique suspendue' : `Expire dans ${daysRemaining} jours`}</p>
              </div>
           </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-2 space-y-10">
           {/* Current Status & Plan Selection */}
           <section className="space-y-6">
              <div className="flex bg-white p-2 rounded-3xl border border-gray-100 shadow-sm w-fit mx-auto md:mx-0">
                 <button 
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-8 py-3 rounded-2xl font-black text-xs uppercase transition-all ${billingCycle === 'monthly' ? 'bg-secondary text-white shadow-lg' : 'text-gray-400 hover:text-secondary'}`}
                 >Mensuel</button>
                 <button 
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-8 py-3 rounded-2xl font-black text-xs uppercase transition-all relative ${billingCycle === 'yearly' ? 'bg-secondary text-white shadow-lg' : 'text-gray-400 hover:text-secondary'}`}
                 >
                   Annuel
                   <span className="absolute -top-2 -right-2 bg-primary text-white text-[8px] px-2 py-1 rounded-full shadow-lg">2 MOIS OFFERTS</span>
                 </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                 {(Object.keys(PLANS) as PlanId[]).map((pid) => {
                    const p = PLANS[pid];
                    const isSelected = selectedPlan === pid;
                    return (
                      <button 
                        key={pid}
                        onClick={() => setSelectedPlan(pid)}
                        className={`p-6 rounded-[32px] border flex flex-col text-left transition-all relative group ${isSelected ? 'border-primary bg-primary/5 ring-4 ring-primary/10' : 'border-gray-100 bg-white hover:border-primary/20'}`}
                      >
                         {isSelected && <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-lg"><CheckCircle className="w-5 h-5" /></div>}
                         <h4 className="text-xs font-black uppercase tracking-tighter mb-1 text-gray-500">{p.name}</h4>
                         <p className="text-2xl font-black text-secondary tracking-tighter">{p.price.toLocaleString()} F</p>
                         <p className="text-[10px] text-gray-400 font-bold mb-4">/ mois</p>
                         <div className="mt-auto pt-4 border-t border-gray-50">
                            <p className="text-[8px] font-black uppercase text-gray-400 group-hover:text-primary transition-colors">Détails Privilèges <ChevronRight className="w-2 h-2 inline ml-1" /></p>
                         </div>
                      </button>
                    );
                 })}
              </div>
           </section>

           {/* Features Comparison */}
           <section className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <Zap className="w-40 h-40" />
              </div>
              <h4 className="text-xl font-black text-secondary uppercase italic tracking-tighter mb-8">Inclus dans votre <span className="text-primary italic">Abonnement</span></h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                 {plan.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-4 group">
                       <div className="w-6 h-6 rounded-lg bg-green-50 text-green-500 flex items-center justify-center flex-shrink-0 group-hover:bg-green-500 group-hover:text-white transition-all">
                          <CheckCircle className="w-4 h-4" />
                       </div>
                       <span className="text-sm font-bold text-gray-600 italic leading-none">{f}</span>
                    </div>
                 ))}
              </div>
           </section>

           {/* Payment History */}
           <section className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
              <h4 className="text-lg font-black text-secondary uppercase italic tracking-tighter mb-8 flex items-center gap-3">
                 <History className="w-6 h-6 text-primary" /> Historique des Paiements
              </h4>
              <div className="space-y-4">
                 {sub?.paymentHistory && sub.paymentHistory.length > 0 ? sub.paymentHistory.map((h, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-tris rounded-2xl border border-gray-50 hover:border-primary/20 transition-all group">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                             <CreditCard className="w-5 h-5 text-gray-400" />
                          </div>
                          <div>
                             <p className="text-sm font-bold text-secondary italic">Prolongation {h.period}</p>
                             <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{new Date(h.date).toLocaleDateString()} via {h.method}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-sm font-black text-secondary tracking-tight">{h.amount.toLocaleString()} F</p>
                          <span className="px-2 py-0.5 bg-green-50 text-green-500 text-[8px] font-black uppercase tracking-widest rounded-md mt-1 block">Validé</span>
                       </div>
                    </div>
                 )) : (
                    <div className="py-12 border-2 border-dashed border-gray-100 rounded-[32px] text-center text-gray-300 italic font-medium">
                       Aucun paiement enregistré pour le moment.
                    </div>
                 )}
              </div>
           </section>
        </div>

        <div className="space-y-8">
           {/* Summary Card */}
           <div className="bg-white p-8 rounded-[40px] border-4 border-primary shadow-2xl sticky top-24">
              <h4 className="text-center text-[10px] font-black text-primary uppercase tracking-widest mb-6">Récapitulatif Paiement Avancé</h4>
              <div className="space-y-6">
                 <div className="flex justify-between items-center text-xs text-gray-500 font-bold uppercase tracking-widest">
                    <span>Plan choisi</span>
                    <span className="text-secondary">{plan.name}</span>
                 </div>
                 <div className="flex justify-between items-center text-xs text-gray-500 font-bold uppercase tracking-widest">
                    <span>Cycle</span>
                    <span className="text-secondary">{billingCycle === 'yearly' ? 'Annuel (Economie 20%)' : 'Mensuel'}</span>
                 </div>
                 
                 <div className="pt-4 border-t border-gray-50">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 text-center">Quantité à payer</label>
                    <div className="flex items-center justify-center gap-6">
                       <button onClick={() => setDuration(Math.max(1, duration - 1))} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-tris transition-all">-</button>
                       <span className="text-4xl font-black italic tracking-tighter text-secondary">{duration}</span>
                       <button onClick={() => setDuration(duration + 1)} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-tris transition-all">+</button>
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 text-center mt-3 uppercase tracking-widest italic">{billingCycle === 'yearly' ? 'an(s) d\'avance' : 'mois d\'avance'}</p>
                 </div>

                 <div className="pt-6 border-t-2 border-dashed border-primary/20">
                    <div className="flex justify-between items-end mb-8">
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Total à régler</span>
                       <span className="text-4xl font-black text-primary tracking-tighter italic">{totalPrice.toLocaleString()} F</span>
                    </div>

                    <button 
                       onClick={handlePay}
                       className="w-full py-5 brand-gradient text-white rounded-[24px] font-black uppercase italic tracking-tighter shadow-xl shadow-primary/30 hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all text-xl"
                    >
                       Payer Maintenant
                    </button>
                    <p className="text-[8px] text-gray-400 text-center mt-4 uppercase font-black italic leading-relaxed">Activation instantanée après paiement mobile money ou banque.</p>
                 </div>
              </div>
           </div>

           {/* Alerts Information */}
           <div className="bg-secondary p-8 rounded-[40px] text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <AlertCircle className="w-20 h-20 rotate-12" />
              </div>
              <h4 className="flex items-center gap-2 font-black italic uppercase tracking-tighter mb-4 text-primary">
                 <ShieldCheck className="w-5 h-5 text-white" /> Système de Rappel
              </h4>
              <ul className="space-y-3">
                 <li className="text-[10px] font-bold opacity-80 flex gap-2"><Clock className="w-3 h-3 text-primary flex-shrink-0" /> Alerte à J-7 de l'expiration</li>
                 <li className="text-[10px] font-bold opacity-80 flex gap-2"><Clock className="w-3 h-3 text-primary flex-shrink-0" /> Notifications WhatsApp/Email</li>
                 <li className="text-[10px] font-bold opacity-80 flex gap-2"><Clock className="w-3 h-3 text-primary flex-shrink-0" /> Grace de 48h sans suspension</li>
                 <li className="text-[10px] font-bold opacity-80 flex gap-2"><Clock className="w-3 h-3 text-primary flex-shrink-0" /> Historique disponible à vie</li>
              </ul>
           </div>
        </div>
      </div>

      <AnimatePresence>
        {isPaymentOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-secondary/80 backdrop-blur-2xl"
              onClick={() => setIsPaymentOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[48px] shadow-2xl relative overflow-hidden z-10"
            >
              <button 
                onClick={() => setIsPaymentOpen(false)}
                className="absolute top-8 right-8 p-3 bg-tris rounded-2xl text-gray-400 hover:text-secondary transition-all z-20"
              >
                <X className="w-6 h-6" />
              </button>
              <PaymentSpace 
                planId={selectedPlan} 
                onSuccess={() => setIsPaymentOpen(false)} 
                onClose={() => setIsPaymentOpen(false)} 
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
