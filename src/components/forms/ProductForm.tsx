import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Product, Category, ProductVariant } from '../../types';
import { useStore } from '../../context/StoreContext';
import { useNotifications } from '../../context/NotificationContext';
import { 
  Package, Tag, DollarSign, Barcode, Warehouse, AlertTriangle, 
  User, Calendar, Image as ImageIcon, Plus, Trash2, Layers 
} from 'lucide-react';

const productSchema = z.object({
  name: z.string().min(2, 'Le nom est trop court'),
  reference: z.string().min(2, 'La référence est requise'),
  description: z.string().min(10, 'La description doit faire au moins 10 caractères'),
  price: z.number().min(0, 'Le prix de vente doit être positif'),
  buyPrice: z.number().min(0, 'Le prix d\'achat doit être positif'),
  category: z.string().min(1, 'La catégorie est requise'),
  subCategory: z.string().optional(),
  stock: z.number().min(0, 'Le stock doit être positif'),
  lowStockThreshold: z.number().min(0, 'Le seuil doit être positif'),
  supplier: z.string().optional(),
  expiryDate: z.string().optional(),
  images: z.array(z.string()).min(1, 'Au moins une image est requise'),
  variants: z.array(z.object({
    id: z.string(),
    name: z.string(),
    options: z.array(z.object({
      name: z.string(),
      priceModifier: z.number().optional(),
      stock: z.number().optional()
    }))
  })).optional()
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
  onSuccess: () => void;
  categories: Category[];
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSuccess, categories }) => {
  const { addProduct, updateProduct, currentUser } = useStore();
  const { showNotification } = useNotifications();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');

  const { register, control, handleSubmit, setValue, watch, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product ? {
      name: product.name,
      reference: product.reference,
      description: product.description,
      price: product.price,
      buyPrice: product.buyPrice,
      category: product.category,
      subCategory: product.subCategory,
      stock: product.stock,
      lowStockThreshold: product.lowStockThreshold,
      supplier: product.supplier,
      expiryDate: product.expiryDate,
      images: product.images || [],
      variants: product.variants || []
    } : {
      stock: 0,
      lowStockThreshold: 5,
      price: 0,
      buyPrice: 0,
      images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'],
      variants: []
    }
  });

  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
    control,
    name: "variants"
  });

  const images = watch('images');

  const addImage = () => {
    if (newImageUrl.trim()) {
      setValue('images', [...images, newImageUrl]);
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setValue('images', images.filter((_, i) => i !== index));
  };

  const addVariantOption = (variantIndex: number) => {
    const currentVariants = watch('variants') || [];
    currentVariants[variantIndex].options.push({ name: '', priceModifier: 0, stock: 0 });
    setValue('variants', currentVariants);
  };

  const onSubmit = async (data: ProductFormData) => {
    if (!currentUser) return;
    setIsSubmitting(true);
    
    try {
      if (product) {
        updateProduct(product.id, data);
        showNotification('success', 'Produit mis à jour', `Le produit "${data.name}" a été modifié.`);
      } else {
        addProduct({
          ...data,
          ownerId: currentUser.uid,
          isPromo: false,
        });
        showNotification('success', 'Produit ajouté', `Le produit "${data.name}" est en ligne.`);
      }
      onSuccess();
    } catch (error) {
      showNotification('error', 'Erreur', 'Une erreur est survenue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const subCategories = categories.filter(c => c.parentId === categories.find(cat => cat.name === watch('category'))?.id);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Gallery */}
        <div className="space-y-6">
           <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <ImageIcon className="w-4 h-4" /> Galerie Photos
          </h4>
          <div className="grid grid-cols-4 gap-4">
             {images.map((url, i) => (
                <div key={i} className="aspect-square rounded-2xl bg-gris relative group overflow-hidden border border-gray-100">
                   <img src={url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                   <button 
                     type="button"
                     onClick={() => removeImage(i)}
                     className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                   ><Trash2 className="w-3 h-3" /></button>
                </div>
             ))}
             <div className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-2 text-center">
                <ImageIcon className="w-6 h-6 text-gray-300 mb-1" />
                <span className="text-[8px] font-bold text-gray-400">Max 5 Mo</span>
             </div>
          </div>
          <div className="flex gap-2">
             <input 
               value={newImageUrl}
               onChange={(e) => setNewImageUrl(e.target.value)}
               placeholder="URL de l'image (Unsplash, etc.)"
               className="flex-grow bg-gris border-none rounded-xl p-3 text-xs outline-none"
             />
             <button type="button" onClick={addImage} className="p-3 bg-secondary text-white rounded-xl"><Plus className="w-4 h-4" /></button>
          </div>
          {errors.images && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.images.message}</p>}
          
          <div className="space-y-6 pt-4 border-t border-gray-50">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Package className="w-4 h-4" /> Identité Produit
            </h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-secondary uppercase tracking-widest mb-2">Nom de l'article</label>
                <input 
                  {...register('name')}
                  className="w-full bg-gris border-none rounded-xl p-4 font-bold text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Ex: iPhone 15 Pro Max"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-[10px] font-black text-secondary uppercase tracking-widest mb-2">Référence</label>
                   <input {...register('reference')} className="w-full bg-gris border-none rounded-xl p-4 font-mono text-xs outline-none" />
                </div>
                <div>
                   <label className="block text-[10px] font-black text-secondary uppercase tracking-widest mb-2">Catégorie</label>
                   <select {...register('category')} className="w-full bg-gris border-none rounded-xl p-4 font-bold text-xs outline-none">
                     <option value="">Sélectionner</option>
                     {categories.filter(c => !c.parentId && c.isActive !== false).map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                     ))}
                   </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-secondary uppercase tracking-widest mb-2">Description Commerciale</label>
                <textarea {...register('description')} rows={3} className="w-full bg-gris border-none rounded-xl p-4 text-sm outline-none resize-none font-medium" />
              </div>
            </div>
          </div>
        </div>

        {/* Pricing, Variants, Stock */}
        <div className="space-y-8">
          <section className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <DollarSign className="w-4 h-4" /> Tarification & Stock
            </h4>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 bg-tris rounded-2xl border border-gray-50">
                 <label className="block text-[10px] font-black text-secondary uppercase mb-2">Prix d'Achat (Unité)</label>
                 <input type="number" {...register('buyPrice', { valueAsNumber: true })} className="w-full bg-transparent border-none font-black text-xl outline-none" />
              </div>
              <div className="p-4 bg-secondary text-white rounded-2xl shadow-xl shadow-secondary/20">
                 <label className="block text-[10px] font-black opacity-60 uppercase mb-2">Prix de Vente (Public)</label>
                 <input type="number" {...register('price', { valueAsNumber: true })} className="w-full bg-transparent border-none font-black text-xl outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                 <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Quantité Disponible</label>
                 <input type="number" {...register('stock', { valueAsNumber: true })} className="w-full bg-gris border-none rounded-xl p-4 font-black outline-none" />
              </div>
              <div>
                 <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Seuil d'Alerte</label>
                 <input type="number" {...register('lowStockThreshold', { valueAsNumber: true })} className="w-full bg-gris border-none rounded-xl p-4 font-black text-red-500 outline-none" />
              </div>
            </div>
          </section>

          {/* Variants */}
          <section className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Layers className="w-4 h-4" /> Variantes (Tailles, Couleurs...)
              </h4>
              <button 
                type="button" 
                onClick={() => appendVariant({ id: Math.random().toString(36).substr(2, 9), name: '', options: [] })}
                className="text-primary text-[10px] font-black uppercase hover:underline"
              >+ Ajouter Type</button>
            </div>

            <div className="space-y-6">
               {variantFields.map((field, vIndex) => (
                  <div key={field.id} className="p-4 bg-gris rounded-2xl relative border border-gray-50">
                     <button type="button" onClick={() => removeVariant(vIndex)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg"><Trash2 className="w-3 h-3" /></button>
                     <input 
                       {...register(`variants.${vIndex}.name`)}
                       className="bg-white px-3 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest outline-none mb-4 w-full"
                       placeholder="Ex: Taille ou Couleur"
                     />
                     <div className="space-y-3">
                        {watch(`variants.${vIndex}.options`)?.map((opt, oIndex) => (
                           <div key={oIndex} className="flex gap-2 items-center">
                              <input 
                                {...register(`variants.${vIndex}.options.${oIndex}.name`)}
                                className="flex-grow px-3 py-2 bg-white rounded-xl text-xs outline-none"
                                placeholder="Valeur (M, L, XL ou Bleu...)"
                              />
                              <input 
                                type="number"
                                {...register(`variants.${vIndex}.options.${oIndex}.priceModifier`, { valueAsNumber: true })}
                                className="w-16 px-2 py-2 bg-white rounded-xl text-[10px] font-bold"
                                placeholder="+/- F"
                              />
                           </div>
                        ))}
                        <button type="button" onClick={() => addVariantOption(vIndex)} className="text-[9px] font-black text-gray-400 uppercase hover:text-primary">+ Ajouter Option</button>
                     </div>
                  </div>
               ))}
               {variantFields.length === 0 && (
                  <p className="text-center py-4 text-gray-300 text-[10px] font-medium italic">Aucune variante configurée pour ce produit.</p>
               )}
            </div>
          </section>

          <section className="bg-secondary p-8 rounded-[40px] text-white space-y-4">
             <h4 className="font-black italic uppercase tracking-tighter flex items-center gap-2 text-primary"><AlertTriangle className="w-5 h-5 text-white" /> Intelligence Stocks</h4>
             <p className="text-[10px] font-medium opacity-80 leading-relaxed italic">
                En activant les seuils, SunuButik vous enverra automatiquement des alertes prédictives 5 jours avant la rupture totale théorique.
             </p>
          </section>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-8 border-t border-gray-100">
        <button 
          type="button" 
          onClick={onSuccess}
          className="px-8 py-4 bg-tris text-gray-500 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-gray-100 transition-all font-sans"
        >Annuler</button>
        <button 
          type="submit"
          disabled={isSubmitting}
          className="px-12 py-4 brand-gradient text-white rounded-2xl font-black uppercase italic tracking-tighter shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-sm"
        >
          {isSubmitting ? 'Publication...' : (product ? 'Mettre à jour l\'œuvre' : 'Lancer le produit')}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
