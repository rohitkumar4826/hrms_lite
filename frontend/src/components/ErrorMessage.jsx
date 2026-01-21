import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
      <div className="flex-1">
        <h4 className="text-red-800 font-medium mb-1">Error</h4>
        <p className="text-red-700 text-sm">{message || 'An unexpected error occurred'}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-3 text-sm text-red-600 hover:text-red-800 font-medium underline"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;