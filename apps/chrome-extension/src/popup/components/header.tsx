import React from 'react';

import { config } from "@repo/shared/config";
import { AlertCircle, Book, ExternalLink, Info, RefreshCw } from 'lucide-react';
import { useThemeCustomizer } from '../hooks/use-theme-costomizer';

export const Header: React.FC = () => {
  const { isCompatible, hasChanges, siteInfo } = useThemeCustomizer();

  return (
    <header className="flex flex-col bg-gray-50 dark:bg-zinc-900 border-b border-gray-300 dark:border-zinc-700 -mx-8 -mt-8 px-4 py-4 mb-6">
      <div className="flex items-center justify-between px-4 py-8 mb-4 border-b border-gray-200 dark:border-zinc-700">
        <div className="flex items-center space-x-2">
          <span className='bg-black dark:bg-white w-10 h-10 rounded-md flex items-center justify-center'>
            <img src="https://mediaresource.sfo2.digitaloceanspaces.com/wp-content/uploads/2024/04/20161105/shadcn-ui-logo-EF735EC0E5-seeklogo.com.png" className='w-6 h-6 invert dark:invert-0' alt="Shadcn/UI UI Logo" />
          </span>
          <div>
            <h1 className="text-lg font-semibold m-0 text-gray-900 dark:text-zinc-100">{config.projectName}</h1>
            <span className='text-md opacity-80 text-gray-700 dark:text-zinc-300'>By <strong>{config.developerName}</strong></span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <a
            href="https://ui.shadcn.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-[#1d1d1f] dark:text-zinc-100 hover:bg-[#f5f5f7] dark:hover:bg-zinc-700 rounded-md transition-colors"
            aria-label="Shadcn UI Docs"
          >
            <Book size={18} />
          </a>
          <a
            href={config.purchaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-[#1d1d1f] dark:text-zinc-100 hover:bg-[#f5f5f7] dark:hover:bg-zinc-700 rounded-md transition-colors"
            aria-label="Extension page"
          >
            <ExternalLink size={18} />
          </a>
          <button
            onClick={() => {
              alert(`Created by ${config.developerName}\nGitHub: ${config.githubUrl}`);
            }}
            className="p-2 text-[#1d1d1f] dark:text-zinc-100 hover:bg-[#f5f5f7] dark:hover:bg-zinc-700 rounded-md transition-colors"
            aria-label="Credits"
          >
            <Info size={18} />
          </button>
        </div>
      </div>
      {siteInfo && (
        <div className="flex flex-col space-y-4 px-4">        
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <img src={siteInfo.favicon} alt="Site Favicon" className="w-10 h-10 rounded-md border border-gray-200 dark:border-zinc-700" />
              <div>
                <h2 className="text-md font-semibold line-clamp-1 text-gray-900 dark:text-zinc-100">{siteInfo.name}</h2>
                <p className="text-md text-gray-500 dark:text-zinc-400">{siteInfo.domain}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-zinc-300 mb-2">{siteInfo.description}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {siteInfo.keywords.slice(0, 3).map((keyword, index) => (
                <span key={index} className="px-2 py-1 text-sm bg-gray-200 dark:bg-zinc-700 text-gray-800 dark:text-zinc-200 rounded-full">{keyword}</span>
              ))}
            </div>
            <div className="flex space-x-4 items-center mt-4 pt-4 border-t border-gray-200 dark:border-zinc-700">
              <div className="flex items-center">
                {isCompatible ? (
                  <Info size={16} className="text-blue-600 dark:text-blue-400 mr-1" />
                ) : (
                  <AlertCircle size={16} className="text-yellow-600 dark:text-yellow-400 mr-1" />
                )}
                <span className="text-sm font-medium text-gray-800 dark:text-zinc-200">
                  {isCompatible ? 'Compatible' : 'Not Compatible'}
                </span>
              </div>
              <div className="flex items-center">
                <RefreshCw size={16} className={`mr-1 ${hasChanges ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-zinc-500'}`} />
                <span className="text-sm font-medium text-gray-800 dark:text-zinc-200">
                  {hasChanges ? 'Changes Detected' : 'No Changes'}
                </span>
              </div>
            </div>
          </div>        
        </div>
      )}
    </header>
  );
};