import React, { useState } from 'react';
import { 
  Wallet, Plus, Trash2, Edit2, ShieldCheck, 
  Smartphone, Building2, Landmark, Check
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useNotifications } from '../../context/NotificationContext';
import { PaymentMethod } from '../../types';
import Modal from '../ui/Modal';

const PAYMENT_TYPES = [
  { id: 'wave', label: 'Wave', icon: Smartphone, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'orange_money', label: 'Orange Money', icon: Smartphone, color: 'text-orange-500', bg: 'bg-orange-50' },
  { id: 'free_money', label: 'Free Money', icon: Smartphone, color: 'text-red-500', bg: 'bg-red-50' },
  { id: 'bank', label: 'Banque', icon: Landmark, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { id: 'cash', label: 'Espèces', icon: Wallet, color: 'text-green-500', bg: 'bg-green-50' },
  { id: 'delivery', label: 'À la livraison', icon: Building2, color: 'text-gray-500', bg: 'bg-gray-50' },
];

export default function PaymentMethodsList() {
  const { currentUser, addPaymentMethod, updatePaymentMethod, deletePaymentMethod } = useStore();
  const { showNotification } = useNotifications();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);

  const methods = currentUser?.paymentMethods || [];

  const handleToggle = (id: string, active: boolean) => {
    updatePaymentMethod(id, { isActive: active });
    showNotification('info', active ? 'Activé' : 'Désactivé', 'Le moyen de paiement a été mis à jour.');
  };

  const handleDelete = (id: string) => {
    if (confirm('Supprimer ce moyen de paiement ?')) {
      deletePaymentMethod(id);
      showNotification('success', 'Supprimé', 'Configuration retirée.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
           <h3 className="text-2xl font-black text-secondary tracking-tighter uppercase italic">Flux de <span className="text-primary italic">Paiement</span></h3>
           <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Configurez comment vos clients peuvent vous payer</p>
        </div>
        <button 
           onClick={() => { setEditingMethod(null); setIsModalOpen(true); }}
           className="flex items-center gap-2 px-6 py-3 brand-gradient text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all"
        >
           <Plus className="w-5 h-5" /> Nouveau Compte
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {methods.length > 0 ? methods.map((m) => {
          const typeInfo = PAYMENT_TYPES.find(t => t.id === m.type) || PAYMENT_TYPES[0];
          return (
            <div key={m.id} className={`p-6 rounded-[32px] border transition-all hover:shadow-xl group relative overflow-hidden ${m.isActive ? 'bg-white border-gray-100' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
               <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 rounded-2xl ${typeInfo.bg} ${typeInfo.color}`}>
                     <typeInfo.icon className="w-6 h-6" />
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button onClick={() => handleDelete(m.id)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
                  </div>
               </div>

               <div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{typeInfo.label}</p>
                 <h4 className="text-lg font-black text-secondary mt-1">{m.accountName}</h4>
                 <p className="text-sm font-mono text-primary font-bold mt-2 bg-tris px-3 py-1 rounded-lg w-fit">{m.accountNumber}</p>
                 {m.provider && <p className="text-[8px] text-gray-400 mt-1 uppercase font-black tracking-tighter">{m.provider}</p>}
               </div>

               <div className="mt-8 flex items-center justify-between pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-2">
                     <div className={`w-2 h-2 rounded-full ${m.isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                     <span className="text-[10px] font-bold text-gray-500 uppercase">{m.isActive ? 'En service' : 'Hors ligne'}</span>
                  </div>
                  <button 
                    onClick={() => handleToggle(m.id, !m.isActive)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${m.isActive ? 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500' : 'bg-primary text-white shadow-lg'}`}
                  >
                    {m.isActive ? 'Désactiver' : 'Activer'}
                  </button>
               </div>
            </div>
          );
        }) : (
          <div className="col-span-full py-20 bg-white rounded-[40px] border border-dashed border-gray-200 text-center flex flex-col items-center justify-center">
             <div className="w-20 h-20 bg-tris rounded-full flex items-center justify-center mb-6">
                <Wallet className="w-10 h-10 text-primary opacity-20" />
             </div>
             <h4 className="text-xl font-bold text-secondary opacity-50 italic">Aucun moyen de paiement configuré</h4>
             <p className="text-gray-400 text-sm max-w-xs mx-auto mt-2 font-medium">Ajoutez vos comptes Wave, Orange Money ou bancaires pour faciliter vos encaissements.</p>
             <button onClick={() => setIsModalOpen(true)} className="mt-8 px-8 py-3 bg-secondary text-white rounded-2xl font-bold shadow-lg hover:bg-primary transition-all uppercase text-xs tracking-widest">Configurer maintenant</button>
          </div>
        )}
      </div>

      <div className="bg-primary/5 p-8 rounded-[40px] border border-primary/10 flex flex-col md:flex-row items-center gap-6">
         <div className="p-5 bg-white rounded-3xl shadow-lg">
            <ShieldCheck className="w-10 h-10 text-primary" />
         </div>
         <div>
            <h4 className="text-lg font-black text-secondary tracking-tighter uppercase italic">Sécurité & Payouts</h4>
            <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-xl italic">
               "Nous ne stockons pas vos accès. Seules les informations de réception publique sont affichées à vos clients. Assurez-vous que les numéros sont corrects pour éviter toute erreur de transfert."
            </p>
         </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nouveau Moyen de Paiement"
      >
        <PaymentMethodForm onSuccess={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}

function PaymentMethodForm({ onSuccess }: { onSuccess: () => void }) {
  const { addPaymentMethod } = useStore();
  const [formData, setFormData] = useState({
    type: 'wave',
    provider: '',
    accountName: '',
    accountNumber: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPaymentMethod(formData as any);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Type de Payout</label>
        <div className="grid grid-cols-3 gap-3">
          {PAYMENT_TYPES.map(type => (
            <button
               key={type.id}
               type="button"
               onClick={() => setFormData({ ...formData, type: type.id })}
               className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-3 transition-all ${formData.type === type.id ? 'border-primary bg-primary/5 shadow-inner' : 'border-gray-100 bg-white hover:border-primary/20'}`}
            >
               <type.icon className={`w-6 h-6 ${formData.type === type.id ? 'text-primary' : 'text-gray-400'}`} />
               <span className={`text-[10px] font-black uppercase tracking-widest ${formData.type === type.id ? 'text-primary' : 'text-gray-400'}`}>{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
           <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Nom du Titulaire</label>
           <input 
             required
             value={formData.accountName}
             onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
             placeholder="Ex: Babacar DIOP"
             className="w-full px-6 py-4 bg-gris rounded-2xl border border-transparent focus:border-primary focus:bg-white outline-none transition-all text-sm font-bold"
           />
        </div>
        <div>
           <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Numéro / Identifiant</label>
           <input 
             required
             value={formData.accountNumber}
             onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
             placeholder="+221 7X XXX XX XX"
             className="w-full px-6 py-4 bg-gris rounded-2xl border border-transparent focus:border-primary focus:bg-white outline-none transition-all text-sm font-bold"
           />
        </div>
      </div>

      {formData.type === 'bank' && (
        <div className="animate-in slide-in-from-top-4 duration-300">
           <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Nom de la Banque</label>
           <input 
             required
             value={formData.provider}
             onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
             placeholder="Ex: CBAO, Ecobank..."
             className="w-full px-6 py-4 bg-gris rounded-2xl border border-transparent focus:border-primary focus:bg-white outline-none transition-all text-sm font-bold"
           />
        </div>
      )}

      <div className="pt-6 border-t border-gray-100 flex gap-4">
         <button 
           type="button" 
           onClick={onSuccess}
           className="flex-grow py-4 bg-gris text-gray-500 rounded-2xl font-bold hover:bg-gray-200 transition-all uppercase text-[10px] tracking-widest"
         >Annuler</button>
         <button 
           type="submit"
           className="flex-grow py-4 brand-gradient text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all uppercase text-[10px] tracking-widest flex items-center justify-center gap-2"
         ><Check className="w-4 h-4" /> Enregistrer le compte</button>
      </div>
    </form>
  );
}
