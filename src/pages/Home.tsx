import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronRight, ArrowRight, Star, ShoppingBag, Zap, Award, Sparkles } from 'lucide-react';

const CATEGORIES = [
  { name: 'Téléphones', icon: '📱', color: 'bg-blue-100 text-blue-600' },
  { name: 'Informatique', icon: '💻', color: 'bg-purple-100 text-purple-600' },
  { name: 'Mode', icon: '👕', color: 'bg-red-100 text-red-600' },
  { name: 'Électroménager', icon: '🧊', color: 'bg-green-100 text-green-600' },
  { name: 'Beauté', icon: '💄', color: 'bg-pink-100 text-pink-600' },
  { name: 'Maison', icon: '🏠', color: 'bg-orange-100 text-orange-600' },
  { name: 'Accessoires', icon: '⌚', color: 'bg-cyan-100 text-cyan-600' },
  { name: 'Gaming', icon: '🎮', color: 'bg-indigo-100 text-indigo-600' },
];

export default function Home() {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-secondary py-12 sm:py-20">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-full bg-accent/20 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-white space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-widest text-primary">
                <Sparkles className="w-4 h-4" /> Nouvelle Expérience Shopping
              </div>
              <h1 className="text-5xl sm:text-7xl font-bold font-display leading-[1.1] tracking-tight">
                Découvrez le Meilleur du <span className="text-primary italic">Sénégal</span> en un Clic.
              </h1>
              <p className="text-lg text-gray-300 max-w-lg leading-relaxed">
                Connectez-vous à SUNU BUTIK 2.0 pour des produits authentiques, des promos exclusives et une livraison ultra-rapide chez vous.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link to="/shop" className="px-8 py-4 bg-primary text-white rounded-2xl font-bold flex items-center gap-2 hover:shadow-2xl hover:scale-105 transition-all">
                  Découvrir la Boutique <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/subscriptions" className="px-8 py-4 bg-white/10 text-white border border-white/20 rounded-2xl font-bold hover:bg-white/20 transition-all backdrop-blur-sm">
                  Devenir Vendeur
                </Link>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative hidden lg:block"
            >
              <div className="aspect-square rounded-[40px] overflow-hidden shadow-2xl brand-gradient p-1">
                <div className="w-full h-full bg-noir rounded-[38px] flex items-center justify-center relative overflow-hidden">
                   {/* Abstract tech shapes */}
                   <div className="absolute inset-0 opacity-20">
                     <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full"></div>
                     <div className="absolute bottom-20 right-20 w-64 h-64 border border-primary rounded-full"></div>
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-white/10 rotate-45"></div>
                   </div>
                   <div className="text-center z-10 p-12">
                     <ShoppingBag className="w-24 h-24 text-primary mx-auto mb-6" />
                     <h2 className="text-4xl font-bold text-white mb-4">SUNU BUTIK 2.0</h2>
                     <p className="text-gray-400">Le futur du e-commerce africain est ici.</p>
                   </div>
                </div>
              </div>
              {/* Floating badges */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 p-4 glass-card rounded-2xl flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white"><Zap className="w-5 h-5" /></div>
                <div>
                  <p className="font-bold text-sm text-secondary">Ventes Flash</p>
                  <p className="text-xs text-gray-500">Jusqu'à -50%</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-secondary font-display">Parcourir par Catégories</h2>
            <p className="text-gray-500 mt-1">Trouvez exactement ce que vous cherchez.</p>
          </div>
          <Link to="/shop" className="text-primary font-bold flex items-center gap-1 group">
            Tout voir <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 sm:gap-6">
          {CATEGORIES.map((cat, i) => (
            <motion.div 
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
            >
              <Link to={`/shop?category=${cat.name}`} className="group block text-center">
                <div className={`aspect-square rounded-3xl ${cat.color} flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm group-hover:shadow-xl`}>
                  {cat.icon}
                </div>
                <span className="text-sm font-bold text-secondary group-hover:text-primary transition-colors">{cat.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Empty Products Sections as per requirement */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        <EmptyProductList title="Produits Populaires" subtitle="Les articles les plus demandés en ce moment." />
        
        {/* Banner Break */}
        <div className="brand-gradient rounded-3xl p-10 sm:p-16 text-white overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
            <Award className="w-full h-full -rotate-12 translate-x-1/4" />
          </div>
          <div className="relative z-10 max-w-2xl">
            <h3 className="text-4xl font-bold mb-6">Devenez un Vendeur Premium</h3>
            <p className="text-lg text-white/80 mb-8 leading-relaxed">
              Propulsez votre business avec Sunu Butik 2.0. Bénéficiez d'une visibilité maximale et gérez votre équipe de manière professionnelle.
            </p>
            <Link to="/subscriptions" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-secondary rounded-2xl font-bold hover:shadow-xl transition-all">
              Voir les plans d'abonnement <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <EmptyProductList title="Promotions du Jour" subtitle="Profitez des meilleures réductions avant qu'il ne soit trop tard." />
        <EmptyProductList title="Nouveautés" subtitle="Les derniers arrivages sélectionnés pour vous." />
      </section>
    </div>
  );
}

function EmptyProductList({ title, subtitle }: { title: string, subtitle: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-bold text-secondary font-display">{title}</h2>
          <p className="text-gray-500 mt-1">{subtitle}</p>
        </div>
      </div>
      
      <div className="bg-white rounded-[40px] border-2 border-dashed border-gray-100 p-16 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-gris rounded-full flex items-center justify-center mb-6 text-gray-300">
           <ShoppingBag className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-bold text-secondary mb-2">Aucun produit à afficher</h3>
        <p className="text-gray-500 max-w-sm">
          Cette section sera alimentée dès que les premiers vendeurs auront publié leurs articles.
        </p>
      </div>
    </div>
  );
}
