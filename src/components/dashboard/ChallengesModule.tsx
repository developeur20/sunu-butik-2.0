import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, Target, Star, Calendar, Users, Plus, 
  CheckCircle, Clock, Gift, TrendingUp, ChevronRight, X
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Challenge, Employee } from '../../types';

export default function ChallengesModule() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { challenges, employees, currentUser, addChallenge } = useStore();

  const myChallenges = useMemo(() => challenges.filter(c => c.shopId === currentUser?.uid), [challenges, currentUser]);
  const myEmployees = useMemo(() => employees.filter(e => e.ownerId === currentUser?.uid), [employees, currentUser]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <h3 className="text-3xl font-black text-secondary tracking-tighter uppercase italic">Challenges & <span className="text-primary italic">Objectifs</span></h3>
           <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-1">Motivez votre équipe avec des récompenses à la clé</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-3 px-8 py-4 brand-gradient text-white rounded-2xl font-black text-sm shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="w-5 h-5" /> Créer un challenge
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <ChallengeStat label="Challenges Actifs" value={myChallenges.filter(c => c.status === 'active').length.toString()} icon={Target} color="blue" />
         <ChallengeStat label="Objectifs Atteints" value={myChallenges.filter(c => c.status === 'completed').length.toString()} icon={CheckCircle} color="green" />
         <ChallengeStat label="Prime Totale Versée" value="45.000 F" icon={Gift} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Challenges List */}
        <div className="lg:col-span-2 space-y-6">
           <h4 className="text-lg font-black text-secondary uppercase tracking-widest flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" /> Challenges en cours
           </h4>
           
           {myChallenges.filter(c => c.status === 'active').map(c => (
             <div key={c.id} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm group hover:border-primary/20 transition-all relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                   <div className="flex items-center gap-5">
                      <div className="w-16 h-16 bg-tris rounded-[24px] flex items-center justify-center text-primary group-hover:rotate-12 transition-transform">
                         <Trophy className="w-8 h-8" />
                      </div>
                      <div>
                         <h5 className="text-xl font-black text-secondary tracking-tight">{c.title}</h5>
                         <p className="text-sm text-gray-400 mt-1">{c.description}</p>
                      </div>
                   </div>
                   <div className="flex flex-col items-end">
                      <span className="px-4 py-1.5 bg-green-50 text-green-600 text-[10px] font-black uppercase rounded-full tracking-widest">En cours</span>
                      <p className="text-[10px] text-gray-400 font-bold mt-2 flex items-center gap-1 uppercase tracking-widest">
                         <Clock className="w-3 h-3" /> Fin: {new Date(c.endDate).toLocaleDateString()}
                      </p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                   <div className="space-y-4">
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                         <span>Progression Global</span>
                         <span className="text-primary italic">65% Atteints</span>
                      </div>
                      <div className="w-full h-3 bg-tris rounded-full overflow-hidden">
                         <div className="h-full brand-gradient w-[65%] rounded-full shadow-lg shadow-primary/20"></div>
                      </div>
                   </div>
                   <div className="p-4 bg-tris rounded-2xl border border-gray-50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <Gift className="w-5 h-5 text-purple-500" />
                         <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Récompense</p>
                            <p className="text-sm font-bold text-secondary mt-1">{c.reward}</p>
                         </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300" />
                   </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                   <div className="flex -space-x-3">
                      {c.participants.map(pid => {
                         const emp = employees.find(e => e.id === pid);
                         return (
                           <div key={pid} className="w-10 h-10 rounded-full border-4 border-white brand-gradient flex items-center justify-center text-[10px] text-white font-black italic shadow-sm" title={emp?.name}>
                              {emp?.name[0]}
                           </div>
                         );
                      })}
                   </div>
                   <button className="text-xs font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-2">
                      Voir le classement <ChevronRight className="w-4 h-4" />
                   </button>
                </div>
             </div>
           ))}

           {myChallenges.filter(c => c.status === 'active').length === 0 && (
              <div className="py-20 bg-white rounded-[40px] border border-dashed border-gray-200 text-center flex flex-col items-center justify-center gap-4">
                 <div className="w-20 h-20 bg-tris rounded-full flex items-center justify-center text-gray-200">
                    <Trophy className="w-10 h-10 opacity-20" />
                 </div>
                 <h4 className="text-xl font-black text-secondary opacity-50 uppercase tracking-tighter">Pas de challenge actif</h4>
                 <p className="text-sm text-gray-400 max-w-xs mx-auto italic">Lancez une compétition pour booster vos ventes hebdomadaires !</p>
                 <button onClick={() => setIsModalOpen(true)} className="mt-4 px-8 py-3 bg-secondary text-white rounded-2xl font-bold shadow-lg hover:bg-primary transition-all text-sm uppercase tracking-widest">Démarrer maintenant</button>
              </div>
           )}
        </div>

        {/* Sidebar info */}
        <div className="space-y-8 h-fit sticky top-28">
           <div className="bg-secondary p-8 rounded-[40px] text-white shadow-xl shadow-secondary/20 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 brand-gradient rounded-full blur-[60px] opacity-20"></div>
              <div className="relative z-10">
                 <h4 className="text-lg font-black tracking-tight mb-4 flex items-center gap-2 uppercase">
                    <Star className="w-5 h-5 text-primary" /> Idées de Challenges
                 </h4>
                 <div className="space-y-4">
                    <IdeaItem title="Meilleur Vendeur Semaine" desc="Basé sur le nombre de ventes" />
                    <IdeaItem title="Plus gros CA" desc="Récompensez le gros client" />
                    <IdeaItem title="Fidélisator" desc="Nouveaux clients créés" />
                 </div>
              </div>
           </div>

           <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
              <h4 className="text-lg font-black text-secondary uppercase tracking-widest mb-6">Objectifs de Productivité</h4>
              <div className="space-y-6">
                 {[
                   { label: 'Heures de Travail', val: '95%', target: '100%', color: 'blue' },
                   { label: 'Conversion Client', val: '68%', target: '75%', color: 'green' },
                   { label: 'Réduction Pertes', val: '12%', target: '< 5%', color: 'purple' },
                 ].map((obj, i) => (
                    <div key={i} className="space-y-2">
                       <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                          <span className="text-gray-400">{obj.label}</span>
                          <span className="text-secondary">{obj.val} / {obj.target}</span>
                       </div>
                       <div className="w-full h-1.5 bg-tris rounded-full overflow-hidden">
                          <div className={`h-full bg-${obj.color}-500/50 brand-gradient`} style={{ width: obj.val }}></div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* Modal Placeholder Implementation */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-secondary/80 backdrop-blur-md"
            ></motion.div>
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl relative z-10 overflow-hidden"
            >
               <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-tris/30">
                  <h3 className="text-2xl font-black text-secondary tracking-tighter uppercase italic">Nouveau <span className="text-primary italic">Challenge</span></h3>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-xl transition-all"><X className="w-6 h-6 text-gray-400" /></button>
               </div>
               <div className="p-10 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Titre du challenge</label>
                         <input type="text" placeholder="Ex: Meilleur vendeur Mai" className="w-full px-5 py-4 bg-tris rounded-2xl border-none outline-none focus:ring-2 ring-primary/20 font-bold" />
                      </div>
                      <div className="space-y-2">
                         <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Type d'objectif</label>
                         <select className="w-full px-5 py-4 bg-tris rounded-2xl border-none outline-none focus:ring-2 ring-primary/20 font-bold">
                            <option>Chiffre d'Affaires</option>
                            <option>Nombre de ventes</option>
                            <option>Nouveaux clients</option>
                         </select>
                      </div>
                      <div className="space-y-2">
                         <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Valeur cible à atteindre</label>
                         <input type="number" placeholder="Ex: 500000" className="w-full px-5 py-4 bg-tris rounded-2xl border-none outline-none focus:ring-2 ring-primary/20 font-bold" />
                      </div>
                      <div className="space-y-2">
                         <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Récompense / Prime</label>
                         <input type="text" placeholder="Ex: 10.000 F cash" className="w-full px-5 py-4 bg-tris rounded-2xl border-none outline-none focus:ring-2 ring-primary/20 font-bold" />
                      </div>
                  </div>
                  
                  <div className="p-8 bg-tris rounded-[32px] border border-gray-50">
                      <h4 className="text-xs font-black text-secondary uppercase tracking-widest mb-6">Sélectionner les participants</h4>
                      <div className="flex flex-wrap gap-3">
                         {myEmployees.map(emp => (
                           <div key={emp.id} className="flex items-center gap-3 px-4 py-2 bg-white rounded-xl border border-gray-100 cursor-pointer hover:border-primary transition-all">
                              <div className="w-6 h-6 brand-gradient rounded-lg text-white font-black text-[8px] flex items-center justify-center">{emp.name[0]}</div>
                              <span className="text-xs font-bold text-secondary">{emp.name}</span>
                              <input type="checkbox" defaultChecked />
                           </div>
                         ))}
                         {myEmployees.length === 0 && <p className="text-xs text-info italic">Aucun employé disponible. Recrutez d'abord.</p>}
                      </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-4">
                     <button className="px-8 py-4 bg-secondary text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-secondary/20">Lancer le challenge</button>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function IdeaItem({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all cursor-pointer group">
       <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">{title}</p>
       <p className="text-[10px] text-gray-500 font-medium mt-1">{desc}</p>
    </div>
  );
}

function ChallengeStat({ label, value, icon: Icon, color }: { label: string, value: string, icon: any, color: 'blue' | 'green' | 'purple' }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-500',
    green: 'bg-green-50 text-green-500',
    purple: 'bg-purple-50 text-purple-500',
  };

  return (
    <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex items-center gap-6 group hover:shadow-2xl transition-all">
       <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center flex-shrink-0 ${colors[color]} group-hover:scale-110 transition-transform shadow-lg shadow-current/10`}>
          <Icon className="w-8 h-8" />
       </div>
       <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
          <h4 className="text-2xl font-black text-secondary tracking-tighter uppercase">{value}</h4>
       </div>
    </div>
  );
}
