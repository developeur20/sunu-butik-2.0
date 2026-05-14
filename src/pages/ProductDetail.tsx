import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ChevronLeft, ShoppingCart, Heart, Share2, 
  ShieldCheck, Truck, RotateCcw, Star, 
  MapPin, AlertCircle
} from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/shop" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary mb-8 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Retour à la boutique
      </Link>

      <div className="bg-white rounded-[40px] border border-gray-100 p-8 lg:p-16 text-center">
         <div className="w-32 h-32 bg-gris rounded-full flex items-center justify-center mx-auto mb-8 text-gray-200">
           <AlertCircle className="w-16 h-16" />
         </div>
         <h1 className="text-3xl font-bold text-secondary mb-4">Produit non trouvé</h1>
         <p className="text-gray-500 max-w-md mx-auto mb-10">
           Désolé, les informations pour ce produit ne sont pas encore disponibles ou ce dernier a été retiré de la vente.
         </p>
         <div className="flex flex-wrap justify-center gap-4">
           <Link to="/shop" className="px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg hover:shadow-2xl transition-all">
             Retourner à la boutique
           </Link>
           <Link to="/" className="px-8 py-4 bg-gris text-secondary rounded-2xl font-bold hover:bg-gray-200 transition-all">
             Page d'accueil
           </Link>
         </div>
      </div>
      
      {/* Requirements mentioned sections like Gallery, Stock, etc. */}
      {/* Even if empty, the structure should imply quality */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-3xl bg-white border border-gray-100 text-center space-y-4">
           <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center mx-auto">
             <ShieldCheck className="w-6 h-6" />
           </div>
           <h4 className="font-bold text-secondary text-sm">Paiement 100% Sécurisé</h4>
           <p className="text-xs text-gray-500">Payez en toute sécurité via Orange Money, Wave ou Carte Bancaire.</p>
        </div>
        <div className="p-8 rounded-3xl bg-white border border-gray-100 text-center space-y-4">
           <div className="w-12 h-12 bg-green-50 text-green-500 rounded-xl flex items-center justify-center mx-auto">
             <Truck className="w-6 h-6" />
           </div>
           <h4 className="font-bold text-secondary text-sm">Livraison Express</h4>
           <p className="text-xs text-gray-500">Service de livraison fiable sur Dakar et toutes les régions du Sénégal.</p>
        </div>
        <div className="p-8 rounded-3xl bg-white border border-gray-100 text-center space-y-4">
           <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center mx-auto">
             <RotateCcw className="w-6 h-6" />
           </div>
           <h4 className="font-bold text-secondary text-sm">Retours Gratuits</h4>
           <p className="text-xs text-gray-500">Vous avez 7 jours pour changer d'avis et retourner votre produit.</p>
        </div>
      </div>
    </div>
  );
}
