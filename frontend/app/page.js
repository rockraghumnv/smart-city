import DashboardCard from '@/components/DashboardCard';
import { Bus, Shield, Leaf, Recycle } from 'lucide-react';

export default function Home() {
  const dashboardCards = [
    {
      title: "Green Commute",
      subtitle: "Track buses & crowd levels",
      icon: <Bus className="w-8 h-8" />,
      href: "/smartbus",
      gradientClass: "gradient-blue"
    },
    {
      title: "City Safety",
      subtitle: "AI event monitoring & alerts",
      icon: <Shield className="w-8 h-8" />,
      href: "/crowdguard",
      gradientClass: "gradient-red"
    },
    {
      title: "My Impact",
      subtitle: "Daily sustainability tracker",
      icon: <Leaf className="w-8 h-8" />,
      href: "/sustainability",
      gradientClass: "gradient-green"
    },
    {
      title: "Recycle Hub",
      subtitle: "Request pickups & earn rewards",
      icon: <Recycle className="w-8 h-8" />,
      href: "/recycle",
      gradientClass: "gradient-teal"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
          Welcome to <span className="text-green-600">GreenShift</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Your comprehensive smart city toolkit for sustainable living, safe commuting, 
          and environmental responsibility in Bengaluru.
        </p>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {dashboardCards.map((card, index) => (
          <DashboardCard
            key={index}
            title={card.title}
            subtitle={card.subtitle}
            icon={card.icon}
            href={card.href}
            gradientClass={card.gradientClass}
          />
        ))}
      </div>

      {/* Stats Section */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <div className="text-3xl font-bold text-green-600 mb-2">50K+</div>
          <div className="text-gray-600">Active Users</div>
        </div>
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <div className="text-3xl font-bold text-blue-600 mb-2">25K</div>
          <div className="text-gray-600">CO₂ Saved (kg)</div>
        </div>
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <div className="text-3xl font-bold text-teal-600 mb-2">15K</div>
          <div className="text-gray-600">Items Recycled</div>
        </div>
      </div>
    </div>
  );
}
