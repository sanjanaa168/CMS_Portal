import React from 'react';
import { Zap, Droplets, Wifi, Armchair, HelpCircle } from 'lucide-react';

export default function CategoryBadge({ category }) {
  const normalized = String(category || '').toLowerCase();

  let icon = <HelpCircle size={13} />;
  let label = category;

  if (normalized === 'electricity' || normalized === '1') {
    icon = <Zap size={13} color="#D97706" />;
    label = 'Electricity';
  } else if (normalized === 'water' || normalized === '2') {
    icon = <Droplets size={13} color="#0284C7" />;
    label = 'Water';
  } else if (normalized === 'wifi' || normalized === '3') {
    icon = <Wifi size={13} color="#7C3AED" />;
    label = 'WiFi';
  } else if (normalized === 'furniture' || normalized === '4') {
    icon = <Armchair size={13} color="#DB2777" />;
    label = 'Furniture';
  }

  return (
    <span className="badge badge-category">
      {icon}
      {label}
    </span>
  );
}
