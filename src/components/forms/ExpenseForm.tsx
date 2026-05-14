import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { DollarSign, Calendar, Tag, FileText, CheckCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useNotifications } from '../../context/NotificationContext';

const expenseSchema = z.object({
  amount: z.number().min(1, 'Montant invalide'),
  category: z.string().min(2, 'Catégorie requise'),
  description: z.string().min(5, 'Description trop courte'),
  date: z.string().min(1, 'Date requise'),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

interface ExpenseFormProps {
  onSuccess: () => void;
}

export default function ExpenseForm({ onSuccess }: ExpenseFormProps) {
  const { addLog, currentUser } = useStore();
  const { showNotification } = useNotifications();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0]
    }
  });

  const onSubmit = async (data: ExpenseFormData) => {
    try {
      // For now, we only log it as we don't have a dedicated expenses state in Store (but we could add it)
      // We simulate success for the UI
      addLog({
        action: 'create',
        entityType: 'expense',
        entityId: 'EXP-' + Math.random().toString(36).substr(2, 5),
        details: `Dépense de ${data.amount} F pour "${data.description}" enregistrée.`
      });
      
      showNotification('success', 'Dépense enregistrée', `Le montant de ${data.amount} F a été ajouté à vos comptes.`);
      onSuccess();
    } catch (error) {
      showNotification('error', 'Erreur', 'Impossible d\'enregistrer la dépense.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Amount */}
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Montant (FCFA)</label>
          <div className="relative">
            <input
              {...register('amount', { valueAsNumber: true })}
              type="number"
              className="w-full pl-12 pr-4 py-4 bg-gris rounded-2xl border border-transparent focus:border-primary focus:bg-white outline-none transition-all text-sm font-bold"
              placeholder="0"
            />
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount.message}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Catégorie</label>
          <div className="relative">
            <select
              {...register('category')}
              className="w-full pl-12 pr-4 py-4 bg-gris rounded-2xl border border-transparent focus:border-primary focus:bg-white outline-none transition-all text-sm font-bold appearance-none"
            >
              <option value="loyer">Loyer & Charges</option>
              <option value="salaire">Salaires</option>
              <option value="marketing">Marketing & Pub</option>
              <option value="logistique">Logistique & Transport</option>
              <option value="autre">Autre dépense</option>
            </select>
            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>}
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Date de dépense</label>
          <div className="relative">
            <input
              {...register('date')}
              type="date"
              className="w-full pl-12 pr-4 py-4 bg-gris rounded-2xl border border-transparent focus:border-primary focus:bg-white outline-none transition-all text-sm font-bold"
            />
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Description</label>
          <div className="relative">
            <input
              {...register('description')}
              type="text"
              className="w-full pl-12 pr-4 py-4 bg-gris rounded-2xl border border-transparent focus:border-primary focus:bg-white outline-none transition-all text-sm font-bold"
              placeholder="Ex: Facture d'électricité février"
            />
            <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
        </div>
      </div>

      <div className="pt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onSuccess}
          className="px-8 py-4 bg-gris text-gray-500 rounded-2xl font-bold hover:bg-gray-200 transition-all"
        >
          Annuler
        </button>
        <button
          disabled={isSubmitting}
          type="submit"
          className="flex items-center gap-2 px-10 py-4 brand-gradient text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all disabled:opacity-50"
        >
          <CheckCircle className="w-5 h-5" />
          {isSubmitting ? 'Enregistrement...' : 'Enregistrer la dépense'}
        </button>
      </div>
    </form>
  );
}
