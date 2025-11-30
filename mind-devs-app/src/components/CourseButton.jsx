import React from 'react';

const CourseButton = ({ title, icon, bgColor, statusText, isDisabled }) => {
    const baseClasses = `
    relative w-full max-w-2xl py-6 px-8 rounded-2xl
    flex items-center justify-between
    font-bold text-3xl text-mind-dark
    transform transition-transform active:translate-y-1 active:translate-x-1
    border-2 border-mind-dark
    shadow-hard select-none
  `;

    const stateClasses = isDisabled
        ? `opacity-90 cursor-not-allowed ${bgColor}`
        : `hover:-translate-y-1 hover:-translate-x-1 cursor-pointer ${bgColor}`;

    return (
        <div className={`${baseClasses} ${stateClasses}`}>
            <span>{title}</span>
            <div className="flex flex-col items-center">
                <span className="text-5xl mb-1">{icon}</span>
                {statusText && (
                    <span className="text-sm font-normal text-mind-dark opacity-70">
                        {statusText}
                    </span>
                )}
            </div>
        </div>
    );
};

export default CourseButton;