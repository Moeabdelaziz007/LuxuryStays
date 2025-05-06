import React, { useEffect, useState } from 'react';

export default function DomainCheck() {
  const [domain, setDomain] = useState<string>('');
  
  useEffect(() => {
    // Get the current domain
    const currentDomain = window.location.host;
    setDomain(currentDomain);
    
    // Log to console for debugging
    console.log('Current domain:', currentDomain);
  }, []);
  
  return (
    <div className="p-4 bg-black/80 border border-[#39FF14]/30 rounded-md">
      <h2 className="text-[#39FF14] text-lg font-bold mb-2">Domain Information</h2>
      <p className="text-white/90">Current Domain: <span className="text-[#39FF14]">{domain}</span></p>
      <p className="text-white/90 mt-2 text-sm">
        For Google login to work, you need to add this domain to your Firebase Authentication Authorized Domains list.
      </p>
    </div>
  );
}