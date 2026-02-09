import React from 'react';

interface AuthInputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon: React.ReactNode;
}

const AuthInputField: React.FC<AuthInputFieldProps> = ({ icon, className = '', ...props }) => {
    return (
        <div className="relative">
            <div className="absolute left-3 top-3 text-gray-400 pointer-events-none">
                {icon}
            </div>
            <input 
                {...props}
                className={`w-full bg-gray-50 text-gray-900 dark:bg-zinc-800 dark:text-white border border-gray-200 dark:border-zinc-700 rounded-lg py-2.5 pl-10 pr-4 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition dark:text-white ${className}`}
            />
        </div>
    );
};

export default AuthInputField;