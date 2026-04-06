import React from 'react';

const CategorySkeleton = ({ variant = 'card' }) => {
    if (variant === 'list') {
        return (
            <div className="flex items-center gap-3 px-4 py-2.5">
                <div className="w-8 h-8 rounded-full skeleton-bg min-w-8"></div>
                <div className="h-4 skeleton-bg rounded w-3/4"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center w-32 sm:w-36 md:w-44 lg:w-48 bg-white rounded-2xl overflow-hidden shadow-sm">
            <div className="w-full aspect-4/5 skeleton-bg"></div>
            <div className="py-3 px-2 w-full flex justify-center">
                <div className="h-4 skeleton-bg rounded w-2/3"></div>
            </div>
        </div>
    );
};

export default CategorySkeleton;
