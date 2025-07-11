import { LoaderCircle } from 'lucide-react';

const Logo = () => {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8b5cf6" /> 
          <stop offset="50%" stopColor="#ec4899" /> 
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
      </defs>
      <LoaderCircle stroke="url(#grad1)" strokeWidth="3" />
    </svg>
  );
}

export default Logo