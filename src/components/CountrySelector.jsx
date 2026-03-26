import React from 'react';
import { useLocale } from '../context/LocaleContext';

const CountrySelector = ({ showLabel = true }) => {
    const { getConfig, isAutoDetected } = useLocale();
    const config = getConfig();

    return (
        <div className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg backdrop-blur-sm">
            <span className="text-xl">{config.flag}</span>
            {showLabel && (
                <div className="flex flex-col">
                    <span className="text-white text-sm font-medium">
                        {config.currencySymbol} {config.currency}
                    </span>
                    {isAutoDetected && (
                        <span className="text-white/60 text-[10px]">
                            Detected
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default CountrySelector;