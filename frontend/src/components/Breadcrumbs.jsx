import React from 'react';
import { Link } from 'react-router-dom';
import { FaChevronRight, FaHome } from 'react-icons/fa';

const Breadcrumbs = ({ items }) => {
  return (
    <nav className="flex mb-6 text-sm font-medium" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3 list-none p-0">
        <li className="inline-flex items-center">
          <Link
            to="/"
            className="inline-flex items-center text-[var(--text-muted)] hover:text-blue-600 transition-colors"
          >
            <FaHome className="mr-2.5 w-4 h-4" />
            Home
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={item.path}>
            <div className="flex items-center">
              <FaChevronRight className="w-3 h-3 text-[var(--text-muted)] mx-1" />
              {index === items.length - 1 ? (
                <span className="ml-1 md:ml-2 text-[var(--text-main)] font-semibold truncate max-w-[200px] md:max-w-md">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="ml-1 md:ml-2 text-[var(--text-muted)] hover:text-blue-600 transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
