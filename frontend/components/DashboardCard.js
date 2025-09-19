'use client';

import Link from 'next/link';

export default function DashboardCard({ title, subtitle, icon, href, gradientClass }) {
  return (
    <Link href={href}>
      <div className={`${gradientClass} rounded-xl p-6 text-white cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl group`}>
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-4 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-white/90 text-sm">{subtitle}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
