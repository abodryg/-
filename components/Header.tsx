import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
        مولّد فيديوهات VEO
      </h1>
      <p className="mt-3 text-lg text-gray-400 max-w-2xl mx-auto">
        حوّل أفكارك إلى فيديوهات مذهلة. صف رؤيتك، أضف صورة، ودع الذكاء الاصطناعي يبدع.
      </p>
    </header>
  );
};