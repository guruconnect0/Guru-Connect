import { motion } from 'motion/react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export function StatCard({ label, value, growth, isPositive, icon: Icon, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-5 hover:border-[#00CFE8]/30 transition-all group hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-white/5 rounded-xl group-hover:bg-[#00CFE8]/10 transition-colors">
          <Icon className="w-5 h-5 text-[#00CFE8]" />
        </div>
        {growth !== undefined && (
          <span className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
            {isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
            {growth}
          </span>
        )}
      </div>
      <h3 className="text-gray-400 text-sm font-medium">{label}</h3>
      <p className="text-3xl font-bold text-white mt-1">{value}</p>
    </motion.div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-5 animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="w-11 h-11 bg-white/5 rounded-xl" />
        <div className="w-16 h-6 bg-white/5 rounded-full" />
      </div>
      <div className="h-3 w-24 bg-white/5 rounded mb-2" />
      <div className="h-8 w-20 bg-white/5 rounded" />
    </div>
  );
}
