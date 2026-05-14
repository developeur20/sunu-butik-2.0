import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, CreditCard, ShieldCheck, Truck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-noir text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Features Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-white/5 mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-sm">Livraison Rapide</p>
              <p className="text-xs text-gray-400">Partout au Sénégal</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-sm">Paiement Sécurisé</p>
              <p className="text-xs text-gray-400">Orange Money, Wave, CB</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-sm">Garantie Qualité</p>
              <p className="text-xs text-gray-400">Produits certifiés</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-sm">Support 24/7</p>
              <p className="text-xs text-gray-400">Une équipe à votre écoute</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 brand-gradient rounded-lg flex items-center justify-center text-white font-bold text-lg">S</div>
              <span className="text-xl font-bold font-display tracking-tight">SUNU<span className="text-primary">BUTIK</span></span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Votre marketplace de confiance au Sénégal. Nous connectons les meilleurs vendeurs avec des clients exigeants pour une expérience shopping unique.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Plateforme</h4>
            <ul className="space-y-4">
              <li><Link to="/shop" className="text-gray-400 hover:text-white transition-colors text-sm">Boutique</Link></li>
              <li><Link to="/subscriptions" className="text-gray-400 hover:text-white transition-colors text-sm">Vendre sur Sunu Butik</Link></li>
              <li><Link to="/promotions" className="text-gray-400 hover:text-white transition-colors text-sm">Promotions</Link></li>
              <li><Link to="/nouveautes" className="text-gray-400 hover:text-white transition-colors text-sm">Nouveautés</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-bold mb-6">Aide & Contact</h4>
            <ul className="space-y-4">
              <li><Link to="/faq" className="text-gray-400 hover:text-white transition-colors text-sm">FAQ</Link></li>
              <li><Link to="/livraison" className="text-gray-400 hover:text-white transition-colors text-sm">Suivre ma commande</Link></li>
              <li><Link to="/retours" className="text-gray-400 hover:text-white transition-colors text-sm">Politique de retour</Link></li>
              <li><Link to="/mentions-legales" className="text-gray-400 hover:text-white transition-colors text-sm">Mentions légales</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-bold mb-6">Newsletter</h4>
            <p className="text-gray-400 text-sm mb-4">Inscrivez-vous pour recevoir nos meilleures offres.</p>
            <form className="relative">
              <input 
                type="email" 
                placeholder="Votre email" 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary transition-colors"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white p-2 rounded-lg hover:shadow-lg transition-all">
                <Mail className="w-4 h-4" />
              </button>
            </form>
            <div className="mt-8 flex items-center gap-2">
              <div className="w-8 h-5 bg-white/10 rounded flex items-center justify-center text-[10px]">VISA</div>
              <div className="w-8 h-5 bg-white/10 rounded flex items-center justify-center text-[10px]">OM</div>
              <div className="w-8 h-5 bg-white/10 rounded flex items-center justify-center text-[10px]">WAVE</div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">
            © 2024 SUNU BUTIK 2.0. Tous droits réservés. Design by Ngary Service Pro.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-gray-500 hover:text-white text-xs">Confidentialité</Link>
            <Link to="/terms" className="text-gray-500 hover:text-white text-xs">Conditions d'utilisation</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
