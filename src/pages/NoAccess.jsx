// src/pages/NoAccess.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '../components/AppIcon';
import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';

const NoAccess = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <Logo 
          variant="icon"
          colorScheme="white"
          linkTo="/"
          className="mx-auto mb-6"
        />
        <Icon name="Lock" size={64} className="mx-auto text-gray-400 mb-6" />
        <h1 className="text-2xl font-heading-bold uppercase mb-4 text-white">Access Restricted</h1>
        <p className="text-gray-400 mb-6">
          You don't have permission to access this area. 
          If you believe this is an error, please contact support.
        </p>
        <div className="space-y-3">
          <Link to="/">
            <Button variant="default" fullWidth className="bg-accent hover:bg-accent/90">
              Return to Homepage
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" fullWidth className="border-white/20 text-white hover:bg-white/10">
              Try Different Account
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NoAccess;