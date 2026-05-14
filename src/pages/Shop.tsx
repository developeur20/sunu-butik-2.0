import { useState } from 'react';
import { motion } from 'motion/react';
import { Filter, Search, ShoppingBag, SlidersHorizontal, LayoutGrid, List, Star, Info, Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';

const CATEGORIES = [
  'Tous les produits', 'Téléphones', 'Informatique', 'Mode', 'Électroménager', 
  'Beauté', 'Maison', 'Accessoires', 'Gaming', 'Automobile'
];

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState('Tous les produits');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { products } = useStore();

  const filteredProducts = products.filter(p => 
    p.isActive && !p.isArchived && (activeCategory === 'Tous les produits' || p.category === activeCategory)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 space-y-8">
          <div>
            <h3 className="text-lg font-bold text-secondary mb-6 flex items-center gap-2">
              <Filter className="w-4 h-4" /> Catégories
            </h3>
            <div className="space-y-2">
              {CATEGORIES.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeCategory === cat 
                    ? 'bg-primary text-white shadow-lg' 
                    : 'text-gray-500 hover:bg-white hover:text-secondary'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-gray-100 space-y-6">
             <h3 className="font-bold text-secondary text-sm uppercase tracking-widest">Filtres</h3>
             <div>
               <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block">Prix maximum</label>
               <input type="range" className="w-full h-1.5 bg-gris rounded-lg appearance-none cursor-pointer accent-primary" />
               <div className="flex justify-between mt-2 text-xs font-bold text-secondary">
                 <span>0 FCFA</span>
                 <span>1 000 000+</span>
               </div>
             </div>
             
             <div>
               <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block">État</label>
               <div className="space-y-2">
                 <label className="flex items-center gap-2 text-sm text-gray-600">
                   <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" /> Neuf
                 </label>
                 <label className="flex items-center gap-2 text-sm text-gray-600">
                   <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" /> Occasion
                 </label>
               </div>
             </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-grow space-y-8">
          {/* Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <p className="text-sm font-medium text-gray-500">
                <span className="text-secondary font-bold">{filteredProducts.length}</span> produits trouvés
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-gris rounded-lg p-1">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary' : 'text-gray-400'}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow-sm text-primary' : 'text-gray-400'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              <select className="bg-gris border-none rounded-xl text-sm font-medium p-2 pr-8 outline-none focus:ring-1 focus:ring-primary">
                <option>Nouveautés</option>
                <option>Prix croissant</option>
                <option>Prix décroissant</option>
              </select>
            </div>
          </div>

          {/* Products Grid/List */}
          {filteredProducts.length > 0 ? (
            <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {filteredProducts.map(product => (
                // @ts-ignore
                <ProductCard key={product.id} product={product} viewMode={viewMode} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-32 bg-white rounded-[40px] border-2 border-dashed border-gray-100"
            >
              <div className="w-24 h-24 bg-gris rounded-full flex items-center justify-center mb-8 text-gray-300">
                <ShoppingBag className="w-12 h-12" />
              </div>
              <h2 className="text-2xl font-bold text-secondary mb-2">Aucun produit disponible</h2>
              <p className="text-gray-500 max-w-sm text-center">
                Désolé, il n'y a actuellement aucun produit dans la catégorie <span className="text-primary font-bold">"{activeCategory}"</span>. 
                Revenez plus tard !
              </p>
              <button 
                 onClick={() => setActiveCategory('Tous les produits')}
                 className="mt-8 px-8 py-3 bg-secondary text-white rounded-xl font-bold hover:bg-primary transition-all shadow-lg"
              >
                Voir d'autres catégories
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
}

function ProductCard({ product, viewMode }: ProductCardProps) {
  if (viewMode === 'list') {
    return (
      <div className="bg-white p-4 rounded-2xl border border-gray-50 flex gap-6 hover:shadow-md transition-all">
        <div className="w-32 h-32 bg-gris rounded-xl flex-shrink-0"></div>
        <div className="flex-grow flex flex-col justify-center">
           <h4 className="font-bold text-secondary">{product.name}</h4>
           <p className="text-sm text-gray-500 mb-2 truncate max-w-md">{product.description}</p>
           <p className="text-primary font-bold">{product.price.toLocaleString()} FCFA</p>
        </div>
        <div className="flex items-center gap-4">
           <Link to={`/product/${product.id}`} className="p-2 bg-gris rounded-lg hover:text-primary"><Info className="w-5 h-5" /></Link>
           <button className="p-3 bg-secondary text-white rounded-xl hover:bg-primary transition-all"><ShoppingBag className="w-5 h-5" /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white group rounded-[32px] border border-gray-50 overflow-hidden hover:shadow-2xl transition-all duration-500">
      <div className="aspect-square bg-gris relative overflow-hidden">
        {product.isPromo && (
           <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-full uppercase">Promo</div>
        )}
        <button className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-md rounded-full text-secondary opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-white">
          <Heart className="w-4 h-4" />
        </button>
      </div>
      <div className="p-6">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{product.category}</p>
        <h4 className="font-bold text-secondary group-hover:text-primary transition-colors mb-4 line-clamp-1">{product.name}</h4>
        <div className="flex items-center justify-between">
           <div>
             <p className="text-lg font-bold text-secondary">{product.price.toLocaleString()} FCFA</p>
             {product.oldPrice && <p className="text-xs text-gray-400 line-through">{product.oldPrice.toLocaleString()} FCFA</p>}
           </div>
           <button className="w-10 h-10 brand-gradient text-white rounded-xl flex items-center justify-center hover:shadow-lg transition-all scale-90 group-hover:scale-100">
             <ShoppingCart className="w-5 h-5" />
           </button>
        </div>
      </div>
    </div>
  );
}
