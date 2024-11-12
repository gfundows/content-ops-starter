import React, { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ text, speed = 150 }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(currentIndex + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  useEffect(() => {
    setDisplayText('');
    setCurrentIndex(0);
  }, [text]);

  const renderText = () => {
    if (text === 'parKInfo') {
      const parts = displayText.split('K');
      if (parts.length < 2) return displayText;
      
      return (
        <>
          <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
            {parts[0]}
          </span>
          <span className="inline-block scale-x-[-1] text-blue-400">K</span>
          <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
            {parts[1]}
          </span>
        </>
      );
    }

    return (
      <span className="text-gray-600 dark:text-gray-400 text-sm">
        {displayText}
      </span>
    );
  };

  return (
    <div className={text === 'parKInfo' ? 'font-bold text-4xl' : ''}>
      {renderText()}
      <span className="animate-blink text-blue-400">|</span>
    </div>
  );
};

export default TypewriterText;