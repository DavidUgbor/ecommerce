import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-500 mb-6">
      <Link to="/" className="flex items-center hover:text-accent transition-colors">
        <Home className="w-4 h-4" />
      </Link>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          {item.href && index < items.length - 1 ? (
            <Link to={item.href} className="hover:text-accent transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-primary-900 font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
