import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ShoppingBasket, ArrowLeft, ChevronRight, Gavel, Trash2, ShoppingBag } from 'lucide-react';

export default function Cart() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-bold text-secondary font-display">Mon Panier</h1>
        <Link to="/shop" className="text-sm font-bold text-primary flex items-center gap-1 group">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Retour au shopping
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items List */}
        <div className="flex-grow">
          <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-sm">
            <div className="p-16 flex flex-col items-center justify-center text-center">
              <div className="w-32 h-32 bg-gris rounded-full flex items-center justify-center mb-8 text-gray-300">
                <ShoppingBasket className="w-16 h-16" />
              </div>
              <h2 className="text-2xl font-bold text-secondary mb-4">Votre panier est vide</h2>
              <p className="text-gray-500 max-w-sm mb-10">
                Vous n'avez pas encore ajouté de produits. Découvrez nos meilleures offres et commencez votre shopping !
              </p>
              <Link to="/shop" className="px-10 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg hover:shadow-2xl transition-all">
                Commencer mes achats
              </Link>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <aside className="w-full lg:w-96">
          <div className="bg-white rounded-[40px] border border-gray-100 p-10 shadow-sm sticky top-32">
            <h3 className="text-xl font-bold text-secondary mb-8">Résumé de la commande</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Sous-total</span>
                <span className="font-bold text-secondary">0 FCFA</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Livraison</span>
                <span className="text-green-500 font-bold uppercase text-[10px] tracking-widest bg-green-50 px-2 py-0.5 rounded">Gratuit</span>
              </div>
              <div className="h-px bg-gray-50 my-4"></div>
              <div className="flex justify-between text-lg font-bold text-secondary">
                <span>Total</span>
                <span className="text-primary italic">0 FCFA</span>
              </div>
            </div>

            <div className="mb-8">
               <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Code Promo</label>
               <div className="flex gap-2">
                 <input 
                   type="text" 
                   placeholder="CODE10" 
                   className="flex-grow bg-gris border-transparent rounded-xl py-3 px-4 text-sm outline-none focus:ring-1 focus:ring-primary"
                 />
                 <button className="bg-secondary text-white px-4 rounded-xl font-bold text-xs">Appliquer</button>
               </div>
            </div>

            <button disabled className="w-full py-4 bg-gray-200 text-gray-400 rounded-2xl font-bold cursor-not-allowed mb-6">
              Finaliser la commande
            </button>

            <div className="flex flex-col items-center gap-4 py-4 border-t border-gray-50 mt-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Paiement sécurisé via</p>
              <div className="flex gap-4">
                <div className="h-4 w-12 bg-gray-100 rounded opacity-50"></div>
                <div className="h-4 w-12 bg-gray-100 rounded opacity-50"></div>
                <div className="h-4 w-12 bg-gray-100 rounded opacity-50"></div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
