import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, X, Mail, FileText, Trophy, Star, 
  AlertTriangle, CheckCircle, Clock, Zap, Info
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Notification } from '../../types';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const { notifications, markNotificationRead, currentUser } = useStore();

  const myNotifications = notifications.filter(n => n.userId === currentUser?.uid);
  const unreadCount = myNotifications.filter(n => !n.isRead).length;

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'report': return { icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' };
      case 'challenge': return { icon: Trophy, color: 'text-purple-500', bg: 'bg-purple-50' };
      case 'subscription': return { icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-50' };
      case 'payment': return { icon: Zap, color: 'text-green-500', bg: 'bg-green-50' };
      case 'security': return { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' };
      default: return { icon: Info, color: 'text-gray-500', bg: 'bg-gray-50' };
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-secondary/20 backdrop-blur-sm z-50 pointer-events-auto"
          />
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            className="fixed top-24 right-8 w-full max-w-md bg-white rounded-[40px] shadow-2xl border border-gray-100 z-50 overflow-hidden flex flex-col max-h-[80vh]"
          >
            <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-tris/30">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 brand-gradient rounded-xl flex items-center justify-center text-white shadow-lg">
                     <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-secondary tracking-tighter uppercase italic">Notifications <span className="text-primary italic">Live</span></h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{unreadCount} messages non lus</p>
                  </div>
               </div>
               <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-all"><X className="w-5 h-5 text-gray-400" /></button>
            </div>

            <div className="flex-grow overflow-y-auto divide-y divide-gray-50">
               {myNotifications.length > 0 ? myNotifications.map((n) => {
                 const { icon: Icon, color, bg } = getTypeIcon(n.type);
                 return (
                   <div 
                     key={n.id} 
                     onClick={() => markNotificationRead(n.id)}
                     className={`p-6 flex gap-4 cursor-pointer transition-all ${n.isRead ? 'opacity-60 grayscale' : 'hover:bg-tris/50'}`}
                   >
                     <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center ${bg} ${color}`}>
                        <Icon className="w-6 h-6" />
                     </div>
                     <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-start mb-1">
                           <h4 className="text-sm font-black text-secondary uppercase tracking-tight truncate">{n.title}</h4>
                           <span className="text-[8px] text-gray-400 font-bold uppercase whitespace-nowrap ml-2">
                              {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                           </span>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{n.message}</p>
                        {!n.isRead && <div className="mt-2 w-2 h-2 bg-primary rounded-full"></div>}
                     </div>
                   </div>
                 );
               }) : (
                 <div className="py-20 text-center flex flex-col items-center gap-4 text-gray-400 italic">
                    <Bell className="w-16 h-16 opacity-5" />
                    <p className="text-sm">Votre centre de notifications est vide.</p>
                 </div>
               )}
            </div>

            <div className="p-6 bg-tris/30 border-t border-gray-50 text-center">
               <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Marquer tout comme lu</button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
