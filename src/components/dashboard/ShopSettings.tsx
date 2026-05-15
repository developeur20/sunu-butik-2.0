import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Store, Globe, Mail, Phone, MapPin, Clock, Plus, Trash2, 
  Facebook, Instagram, Twitter, MessageCircle, Save, CheckCircle,
  Youtube
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useNotifications } from '../../context/NotificationContext';
import { ShopConfig } from '../../types';

const shopSchema = z.object({
  name: z.string().min(2, 'Le nom est trop court'),
  description: z.string().min(10, 'La description doit être détaillée'),
  address: z.string().min(5, 'L\'adresse est requise'),
  phones: z.array(z.string().min(8, 'Numéro invalide')),
  whatsapp: z.string().optional(),
  logo: z.string().optional(),
  supportEmail: z.string().email('Email invalide'),
  complaintEmail: z.string().email('Email invalide'),
  deliveryZones: z.array(z.object({
    zone: z.string(),
    price: z.number().min(0)
  })),
  socialLinks: z.array(z.object({
    platform: z.enum(['facebook', 'instagram', 'twitter', 'tiktok', 'youtube']),
    url: z.string().url('URL invalide')
  })),
  openingHours: z.array(z.object({
    day: z.string(),
    open: z.string(),
    close: z.string(),
    isClosed: z.boolean()
  }))
});

type ShopFormData = z.infer<typeof shopSchema>;

export default function ShopSettings() {
  const { currentUser, updateShopSettings } = useStore();
  const { showNotification } = useNotifications();

  const defaultHours = [
    { day: 'Lundi', open: '08:00', close: '18:00', isClosed: false },
    { day: 'Mardi', open: '08:00', close: '18:00', isClosed: false },
    { day: 'Mercredi', open: '08:00', close: '18:00', isClosed: false },
    { day: 'Jeudi', open: '08:00', close: '18:00', isClosed: false },
    { day: 'Vendredi', open: '08:00', close: '18:00', isClosed: false },
    { day: 'Samedi', open: '09:00', close: '15:00', isClosed: false },
    { day: 'Dimanche', open: '00:00', close: '00:00', isClosed: true },
  ];

  const { register, control, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<ShopFormData>({
    resolver: zodResolver(shopSchema),
    defaultValues: {
      name: currentUser?.shopConfig?.name || currentUser?.displayName + "'s Shop",
      description: currentUser?.shopConfig?.description || '',
      address: currentUser?.shopConfig?.address || '',
      phones: currentUser?.shopConfig?.phones?.length ? currentUser.shopConfig.phones : [''],
      whatsapp: currentUser?.shopConfig?.whatsapp || '',
      logo: currentUser?.shopConfig?.logo || '',
      supportEmail: currentUser?.shopConfig?.supportEmail || currentUser?.email,
      complaintEmail: currentUser?.shopConfig?.complaintEmail || currentUser?.email,
      deliveryZones: currentUser?.shopConfig?.deliveryZones || [],
      socialLinks: currentUser?.shopConfig?.socialLinks || [],
      openingHours: currentUser?.shopConfig?.openingHours?.length ? currentUser.shopConfig.openingHours : defaultHours
    }
  });

  const { fields: phoneFields, append: appendPhone, remove: removePhone } = useFieldArray({
    control,
    name: "phones" as any
  });

  const { fields: zoneFields, append: appendZone, remove: removeZone } = useFieldArray({
    control,
    name: "deliveryZones"
  });

  const { fields: socialFields, append: appendSocial, remove: removeSocial } = useFieldArray({
    control,
    name: "socialLinks"
  });

  const logo = watch('logo');

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue('logo', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: ShopFormData) => {
    updateShopSettings(data);
    showNotification('success', 'Boutique mise à jour', 'Toutes les modifications ont été enregistrées avec succès.');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h3 className="text-2xl font-black text-secondary tracking-tighter uppercase italic">Identité de la <span className="text-primary italic">Marque</span></h3>
           <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Personnalisez l'apparence et les infos de votre boutique</p>
        </div>
        <button 
           onClick={handleSubmit(onSubmit)}
           disabled={isSubmitting}
           className="flex items-center gap-2 px-8 py-4 brand-gradient text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all disabled:opacity-50"
        >
           <Save className="w-5 h-5" /> {isSubmitting ? 'Enregistrement...' : 'Enregistrer tout'}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          {/* General Info */}
          <section className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
            <h4 className="text-lg font-bold mb-6 flex items-center gap-3">
               <Store className="w-5 h-5 text-primary" /> Informations Générales
            </h4>
            
            <div className="mb-10 flex flex-col items-center justify-center">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 italic">Logo de la Boutique</label>
              <div className="relative group">
                <div className="w-32 h-32 rounded-[24px] bg-tris border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden hover:border-primary/50 transition-all cursor-pointer shadow-inner">
                  {logo ? (
                    <img src={logo} alt="Shop Logo" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-4">
                      <Plus className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <span className="text-[8px] font-black uppercase text-gray-400">Choisir</span>
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                  />
                </div>
                {logo && (
                  <button 
                    type="button"
                    onClick={() => setValue('logo', '')}
                    className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
              <p className="mt-3 text-[10px] text-gray-400 font-bold uppercase tracking-tight italic">Format carré recommandé (PNG, JPG)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Nom de la Boutique</label>
                <input 
                  {...register('name')}
                  className="w-full px-6 py-4 bg-gris rounded-2xl border border-transparent focus:border-primary focus:bg-white outline-none transition-all text-sm font-bold"
                  placeholder="Ex: SunuButik Store"
                />
                {errors.name && <p className="mt-2 text-[10px] text-red-500 font-bold uppercase">{errors.name.message}</p>}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Description (Storytelling)</label>
                <textarea 
                  {...register('description')}
                  rows={4}
                  className="w-full px-6 py-4 bg-gris rounded-2xl border border-transparent focus:border-primary focus:bg-white outline-none transition-all text-sm font-medium resize-none"
                  placeholder="Racontez votre histoire..."
                />
                {errors.description && <p className="mt-2 text-[10px] text-red-500 font-bold uppercase">{errors.description.message}</p>}
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email d'Assistance</label>
                <div className="relative">
                  <input 
                    {...register('supportEmail')}
                    className="w-full pl-12 pr-6 py-4 bg-gris rounded-2xl border border-transparent focus:border-primary focus:bg-white outline-none transition-all text-sm font-bold"
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email de Réclamation</label>
                <div className="relative">
                  <input 
                    {...register('complaintEmail')}
                    className="w-full pl-12 pr-6 py-4 bg-gris rounded-2xl border border-transparent focus:border-primary focus:bg-white outline-none transition-all text-sm font-bold"
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          </section>

          {/* Contact & Location */}
          <section className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
            <h4 className="text-lg font-bold mb-6 flex items-center gap-3">
               <MapPin className="w-5 h-5 text-primary" /> Contact & Localisation
            </h4>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Adresse Physique</label>
                <div className="relative">
                   <input 
                    {...register('address')}
                    className="w-full pl-12 pr-6 py-4 bg-gris rounded-2xl border border-transparent focus:border-primary focus:bg-white outline-none transition-all text-sm font-bold"
                   />
                   <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Numéros de Téléphone</label>
                    <button type="button" onClick={() => appendPhone('')} className="text-primary hover:underline text-[10px] font-black uppercase tracking-widest">+ Ajouter</button>
                  </div>
                  <div className="space-y-3">
                    {phoneFields.map((field, index) => (
                      <div key={field.id} className="relative group">
                        <input 
                          {...register(`phones.${index}` as any)}
                          className="w-full pl-12 pr-12 py-4 bg-gris rounded-2xl border border-transparent focus:border-primary focus:bg-white outline-none transition-all text-sm font-bold"
                          placeholder="+221 7X XXX XX XX"
                        />
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        {phoneFields.length > 1 && (
                          <button 
                            type="button" 
                            onClick={() => removePhone(index)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-red-500 transition-colors"
                          ><Trash2 className="w-4 h-4" /></button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Numéro WhatsApp Business</label>
                  <div className="relative">
                    <input 
                      {...register('whatsapp')}
                      className="w-full pl-12 pr-6 py-4 bg-gris rounded-2xl border border-transparent focus:border-primary focus:bg-white outline-none transition-all text-sm font-bold"
                      placeholder="+221 7X XXX XX XX"
                    />
                    <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Social Links */}
          <section className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
               <h4 className="text-lg font-bold flex items-center gap-3">
                  <Globe className="w-5 h-5 text-primary" /> Réseaux Sociaux
               </h4>
               <button 
                type="button" 
                onClick={() => appendSocial({ platform: 'facebook', url: '' })}
                className="p-3 bg-tris rounded-xl text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
               ><Plus className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              {socialFields.map((field, index) => (
                <div key={field.id} className="flex gap-4 items-center animate-in slide-in-from-right-4 duration-300">
                  <select 
                    {...register(`socialLinks.${index}.platform`)}
                    className="px-4 py-4 bg-gris rounded-2xl outline-none font-bold text-xs w-32"
                  >
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                    <option value="twitter">X (Twitter)</option>
                    <option value="tiktok">TikTok</option>
                    <option value="youtube">YouTube</option>
                  </select>
                  <input 
                    {...register(`socialLinks.${index}.url`)}
                    className="flex-grow px-6 py-4 bg-gris rounded-2xl border border-transparent focus:border-primary focus:bg-white outline-none transition-all text-sm font-bold"
                    placeholder="https://..."
                  />
                  <button 
                    type="button" 
                    onClick={() => removeSocial(index)}
                    className="p-4 text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                  ><Trash2 className="w-5 h-5" /></button>
                </div>
              ))}
              {socialFields.length === 0 && (
                <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-[32px] text-gray-400 text-xs italic font-medium">
                  Aucun réseau social lié. Connectez-vous avec vos clients.
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          {/* Opening Hours */}
          <section className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm h-fit">
            <h4 className="text-lg font-bold mb-6 flex items-center gap-3">
               <Clock className="w-5 h-5 text-primary" /> Horaires d'Ouverture
            </h4>
            <div className="space-y-4">
              {defaultHours.map((_, index) => (
                <div key={index} className="flex items-center justify-between gap-4">
                  <span className="text-xs font-black text-secondary w-20 uppercase tracking-tighter italic">{register(`openingHours.${index}.day`).name}</span>
                  <div className="flex items-center gap-2">
                    <input 
                      type="time" 
                      disabled={false} // Would need a watch() but for simplicity
                      {...register(`openingHours.${index}.open`)}
                      className="px-2 py-2 bg-gris rounded-lg text-[10px] font-bold outline-none" 
                    />
                    <span className="text-gray-300">-</span>
                    <input 
                      type="time" 
                      {...register(`openingHours.${index}.close`)}
                      className="px-2 py-2 bg-gris rounded-lg text-[10px] font-bold outline-none" 
                    />
                  </div>
                  <input 
                    type="checkbox" 
                    {...register(`openingHours.${index}.isClosed`)}
                    className="w-4 h-4 rounded-md border-gray-200 checked:bg-primary"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Delivery Zones */}
          <section className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
               <h4 className="text-lg font-bold">Zones de Livraison</h4>
               <button 
                type="button" 
                onClick={() => appendZone({ zone: '', price: 0 })}
                className="text-primary hover:underline text-[10px] font-black uppercase"
               >+ Ajouter</button>
            </div>
            <div className="space-y-4">
              {zoneFields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-center">
                  <input 
                    {...register(`deliveryZones.${index}.zone`)}
                    className="flex-grow px-3 py-2 bg-gris rounded-xl text-xs font-bold outline-none"
                    placeholder="Zone/Quartier"
                  />
                  <input 
                    type="number"
                    {...register(`deliveryZones.${index}.price`, { valueAsNumber: true })}
                    className="w-20 px-3 py-2 bg-gris rounded-xl text-xs font-bold outline-none"
                    placeholder="Prix"
                  />
                  <button type="button" onClick={() => removeZone(index)} className="text-gray-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </section>

          <div className="p-8 brand-gradient rounded-[40px] text-white shadow-xl shadow-primary/20">
             <div className="flex items-center gap-3 mb-4">
               <CheckCircle className="w-6 h-6" />
               <h4 className="font-black italic uppercase tracking-tighter">Instant Sync</h4>
             </div>
             <p className="text-xs font-medium opacity-90 leading-relaxed italic">"Vos clients verront ces changements immédiatement sur votre page publique."</p>
          </div>
        </div>
      </div>
    </div>
  );
}
