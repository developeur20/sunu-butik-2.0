import React, { useState } from 'react';
import { 
  Tag, Plus, Edit2, Archive, RotateCcw, 
  ChevronRight, ChevronDown, Check, X,
  LayoutGrid, FolderTree, AlertCircle
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useNotifications } from '../../context/NotificationContext';
import { Category } from '../../types';
import Modal from '../ui/Modal';

export default function CategoryManager() {
  const { categories, addCategory, updateCategory, archiveProduct } = useStore();
  const { showNotification } = useNotifications();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [expandedCats, setExpandedCats] = useState<string[]>([]);

  const toggleExpand = (id: string) => {
    setExpandedCats(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleToggleActive = (id: string, active: boolean) => {
    updateCategory(id, { isActive: active });
    showNotification('info', active ? 'Activée' : 'Désactivée', 'Le statut de la catégorie a été mis à jour.');
  };

  const rootCategories = categories.filter(c => !c.parentId);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
           <h3 className="text-2xl font-black text-secondary tracking-tighter uppercase italic">Rayonnages <span className="text-primary italic">Digitaux</span></h3>
           <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Organisez votre boutique par univers et familles</p>
        </div>
        <button 
           onClick={() => { setEditingCategory(null); setIsModalOpen(true); }}
           className="flex items-center gap-2 px-6 py-3 brand-gradient text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all"
        >
           <Plus className="w-5 h-5" /> Nouveau Rayon
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2 space-y-4">
            {rootCategories.length > 0 ? rootCategories.map((cat) => {
               const isExpanded = expandedCats.includes(cat.id);
               const subCats = categories.filter(c => c.parentId === cat.id);
               
               return (
                  <div key={cat.id} className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden group">
                     <div className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <button onClick={() => toggleExpand(cat.id)} className="p-2 hover:bg-gris rounded-xl transition-all">
                              {isExpanded ? <ChevronDown className="w-5 h-5 text-primary" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
                           </button>
                           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl italic ${cat.isActive !== false ? 'brand-gradient text-white' : 'bg-gray-100 text-gray-400'}`}>
                              {cat.name[0].toUpperCase()}
                           </div>
                           <div>
                              <h4 className={`font-black uppercase tracking-tight ${cat.isActive !== false ? 'text-secondary' : 'text-gray-400 line-through'}`}>{cat.name}</h4>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{subCats.length} Sous-familles</p>
                           </div>
                        </div>

                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button 
                              onClick={() => { setEditingCategory(cat); setIsModalOpen(true); }}
                              className="p-2 bg-blue-50 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-all"
                           ><Edit2 className="w-4 h-4" /></button>
                           <button 
                              onClick={() => handleToggleActive(cat.id, cat.isActive === false)}
                              className={`p-2 rounded-lg transition-all ${cat.isActive !== false ? 'bg-orange-50 text-orange-500 hover:bg-orange-500' : 'bg-green-50 text-green-500 hover:bg-green-500'} hover:text-white`}
                           >
                              {cat.isActive !== false ? <Archive className="w-4 h-4" /> : <RotateCcw className="w-4 h-4" />}
                           </button>
                        </div>
                     </div>

                     {isExpanded && (
                        <div className="px-6 pb-6 pt-2 bg-tris space-y-2 border-t border-gray-50 animate-in slide-in-from-top-2">
                           {subCats.length > 0 ? subCats.map(sub => (
                              <div key={sub.id} className="flex items-center justify-between py-3 px-4 bg-white rounded-xl border border-gray-50 group/sub">
                                 <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                    <span className={`text-sm font-bold uppercase tracking-tight ${sub.isActive !== false ? 'text-secondary' : 'text-gray-400 line-through'}`}>{sub.name}</span>
                                 </div>
                                 <div className="flex items-center gap-2 opacity-0 group-hover/sub:opacity-100 transition-opacity">
                                    <button onClick={() => { setEditingCategory(sub); setIsModalOpen(true); }} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-md"><Edit2 className="w-3.5 h-3.5" /></button>
                                    <button onClick={() => handleToggleActive(sub.id, sub.isActive === false)} className="p-1.5 text-orange-500 hover:bg-orange-50 rounded-md">
                                       {sub.isActive !== false ? <Archive className="w-3.5 h-3.5" /> : <RotateCcw className="w-3.5 h-3.5" />}
                                    </button>
                                 </div>
                              </div>
                           )) : (
                              <p className="text-center py-4 text-[10px] text-gray-400 italic">Aucune sous-catégorie</p>
                           )}
                           <button 
                              onClick={() => { setEditingCategory(null); setIsModalOpen(true); }}
                              className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-[10px] font-black uppercase text-gray-400 hover:border-primary hover:text-primary transition-all"
                           >+ Ajouter une sous-famille</button>
                        </div>
                     )}
                  </div>
               );
            }) : (
               <div className="bg-white p-20 rounded-[40px] border border-dashed border-gray-200 text-center opacity-40 grayscale flex flex-col items-center">
                  <FolderTree className="w-16 h-16 mb-4" />
                  <p className="text-sm font-bold uppercase tracking-widest italic">Catalogue vide</p>
               </div>
            )}
         </div>

         <div className="space-y-6">
            <div className="bg-secondary p-8 rounded-[40px] text-white shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                  <LayoutGrid className="w-20 h-20 rotate-12" />
               </div>
               <h4 className="text-lg font-black uppercase italic tracking-tighter mb-4 text-primary">Conseils Expert</h4>
               <p className="text-xs font-medium opacity-80 leading-relaxed italic">
                  "Une structure claire aide vos clients à trouver plus vite. Limitez-vous à 2 niveaux de profondeur pour une navigation mobile fluide."
               </p>
               <div className="mt-8 flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                  <AlertCircle className="w-5 h-5 text-primary" />
                  <p className="text-[10px] font-bold uppercase opacity-60">Les rayons désactivés cachent aussi les produits associés.</p>
               </div>
            </div>

            <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
               <h4 className="text-sm font-black text-secondary uppercase tracking-widest mb-6">Statistiques Rayons</h4>
               <div className="space-y-4">
                  <StatRow label="Articles Actifs" value="128" />
                  <StatRow label="Articles en Stock" value="457" />
                  <StatRow label="Low Stock" value="12" alert />
               </div>
            </div>
         </div>
      </div>

      <Modal 
         isOpen={isModalOpen} 
         onClose={() => setIsModalOpen(false)} 
         title={editingCategory ? "Modifier le Rayon" : "Nouveau Rayon"}
      >
         <CategoryForm 
            category={editingCategory || undefined} 
            onSuccess={() => setIsModalOpen(false)} 
         />
      </Modal>
    </div>
  );
}

function StatRow({ label, value, alert }: { label: string, value: string, alert?: boolean }) {
   return (
      <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
         <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">{label}</span>
         <span className={`text-sm font-black italic tracking-tighter ${alert ? 'text-red-500' : 'text-secondary'}`}>{value}</span>
      </div>
   );
}

function CategoryForm({ category, onSuccess }: { category?: Category, onSuccess: () => void }) {
   const { categories, addCategory, updateCategory } = useStore();
   const [name, setName] = useState(category?.name || '');
   const [parentId, setParentId] = useState(category?.parentId || '');

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (category) {
         updateCategory(category.id, { name, parentId: parentId || undefined });
      } else {
         addCategory(name, parentId || undefined);
      }
      onSuccess();
   };

   return (
      <form onSubmit={handleSubmit} className="space-y-6">
         <div>
            <label className="block text-[10px] font-black text-secondary uppercase tracking-widest mb-2 ml-1">Nom du Rayon/Famille</label>
            <input 
               autoFocus
               value={name}
               onChange={(e) => setName(e.target.value)}
               placeholder="Ex: Électroménager, Vêtements Homme..."
               className="w-full px-6 py-4 bg-gris rounded-2xl border border-transparent focus:border-primary outline-none font-bold text-sm"
               required
            />
         </div>

         <div>
            <label className="block text-[10px] font-black text-secondary uppercase tracking-widest mb-2 ml-1">Catégorie Parente (Optionnel)</label>
            <select 
               value={parentId}
               onChange={(e) => setParentId(e.target.value)}
               className="w-full px-6 py-4 bg-gris rounded-2xl border border-transparent focus:border-primary outline-none font-bold text-sm appearance-none"
            >
               <option value="">Aucune (Catégorie Racine)</option>
               {categories.filter(c => !c.parentId && c.id !== category?.id).map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
               ))}
            </select>
         </div>

         <div className="pt-6 flex gap-4">
            <button type="button" onClick={onSuccess} className="flex-grow py-4 bg-gris text-gray-400 rounded-2xl font-bold uppercase text-[10px] tracking-widest">Annuler</button>
            <button type="submit" className="flex-grow py-4 brand-gradient text-white rounded-2xl font-black uppercase italic tracking-tighter shadow-xl shadow-primary/20">{category ? 'Mettre à jour' : 'Créer le rayon'}</button>
         </div>
      </form>
   );
}
