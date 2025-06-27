import React from 'react';
import '../styles/Tools.css';

export default function Tools() {
  const tools = [
    { name: 'Rockshox service manuals', href: 'https://www.sram.com/en/service/manuals--documents/user-manuals?filters=brand|RockShox,language|English&showRecent=false&page=1' },
    { name: 'Silca Tire pressure calculator', href: 'https://silca.cc/en-eu/pages/pro-tire-pressure-calculator?srsltid=AfmBOor78d9FdQ9jK7_knWr8riidCrGMA_mkdIOXiAWdtIddMOQqEh7U' },
    { name: 'Spoke length calculator', href: 'https://spokes-calculator.dtswiss.com/en/calculator' },
    { name: 'Shimano manuals', href: 'https://si.shimano.com/en/' },
  ];

  return (
    <div className="page-container tools-container">
      <h1>Tools</h1>
      <ul className="tools-list">
        {tools.map(tool => (
          <li key={tool.href} className="tool-item">
            <a
              href={tool.href}
              target="_blank"
              rel="noopener noreferrer"
              className="tool-link"
            >
              {tool.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
