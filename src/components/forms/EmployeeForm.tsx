import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Shield, User, Phone, CheckCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Employee, Role } from '../../types';
import { useNotifications } from '../../context/NotificationContext';

const employeeSchema = z.object({
  email: z.string().email('Email invalide'),
  role: z.enum(['vendeur', 'manager', 'stockiste', 'support'] as const),
  phone: z.string().min(8, 'Téléphone invalide'),
  name: z.string().min(2, 'Nom trop court'),
  password: z.string().min(6, 'Mot de passe trop court (min 6)').optional(),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

interface EmployeeFormProps {
  employee?: Employee;
  onSuccess: () => void;
}

export default function EmployeeForm({ employee, onSuccess }: EmployeeFormProps) {
  const { addEmployee, updateEmployee, currentUser } = useStore();
  const { showNotification } = useNotifications();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: employee ? {
      email: employee.email,
      role: employee.role as any,
      name: employee.name || '',
      phone: employee.phone || '',
    } : {
      role: 'vendeur'
    },
  });

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      if (employee) {
        updateEmployee(employee.id, data);
        showNotification('success', 'Collaborateur mis à jour', `Les accès de ${data.name} ont été modifiés.`);
      } else {
        addEmployee({
          ...data,
          ownerId: currentUser?.uid || '',
          isActive: true,
          password: data.password || '123456' // Default if not provided
        });
        showNotification('success', 'Nouveau collaborateur', `${data.name} a été ajouté avec succès.`);
      }
      onSuccess();
    } catch (error) {
      showNotification('error', 'Erreur', 'Impossible d\'enregistrer les modifications.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Nom Complet</label>
          <div className="relative">
            <input
              {...register('name')}
              type="text"
              className="w-full pl-12 pr-4 py-4 bg-gris rounded-2xl border border-transparent focus:border-primary focus:bg-white outline-none transition-all text-sm font-bold"
              placeholder="Ex: Moussa Diop"
            />
            <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
        </div>

        {/* Role */}
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Rôle & Permissions</label>
          <div className="relative">
            <select
              {...register('role')}
              className="w-full pl-12 pr-4 py-4 bg-gris rounded-2xl border border-transparent focus:border-primary focus:bg-white outline-none transition-all text-sm font-bold appearance-none"
            >
              <option value="vendeur">Vendeur (Ventes & Clients)</option>
              <option value="manager">Manager (Contrôle total)</option>
              <option value="stockiste">Stockiste (Stocks uniquement)</option>
              <option value="support">Support (SAV)</option>
            </select>
            <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          {errors.role && <p className="mt-1 text-xs text-red-500">{errors.role.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email professionnel</label>
          <div className="relative">
            <input
              {...register('email')}
              type="email"
              className="w-full pl-12 pr-4 py-4 bg-gris rounded-2xl border border-transparent focus:border-primary focus:bg-white outline-none transition-all text-sm font-bold"
              placeholder="moussa@boutique.com"
            />
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Téléphone</label>
          <div className="relative">
            <input
              {...register('phone')}
              type="tel"
              className="w-full pl-12 pr-4 py-4 bg-gris rounded-2xl border border-transparent focus:border-primary focus:bg-white outline-none transition-all text-sm font-bold"
              placeholder="77 000 00 00"
            />
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
        </div>

        {/* Password */}
        <div className="md:col-span-2">
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
            {employee ? 'Nouveau Mot de Passe (laisser vide pour ne pas changer)' : 'Mot de Passe d\'accès'}
          </label>
          <div className="relative">
            <input
              {...register('password')}
              type="text"
              className="w-full pl-12 pr-4 py-4 bg-tris rounded-2xl border border-transparent focus:border-primary focus:bg-white outline-none transition-all text-sm font-bold"
              placeholder="Définissez un code d'accès"
            />
            <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          <p className="mt-2 text-[10px] text-gray-400 italic">L'employé utilisera ce code pour se connecter à son espace dédié.</p>
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
          {isSubmitting ? 'Enregistrement...' : employee ? 'Mettre à jour' : 'Ajouter au staff'}
        </button>
      </div>
    </form>
  );
}
