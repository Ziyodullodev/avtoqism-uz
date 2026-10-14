import React from 'react';
import HeroCarSelector from '@/components/home/HeroCarSelector';
import FeatureCategories from '@/components/home/FeatureCategories';
import PopularVehicles from '@/components/home/PopularVehicles';
import FeaturedParts from '@/components/home/FeaturedParts';
import VinBanner from '@/components/home/VinBanner';

export default function HomePage() {
  return (
    <div className="space-y-0">
      <HeroCarSelector />
      <FeatureCategories />
      <PopularVehicles />
      <FeaturedParts />
      <VinBanner />
    </div>
  );
}
