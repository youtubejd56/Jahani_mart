import React, { useState } from 'react';
import SEO from '../components/SEO';

const OurStory = () => {
    const [expandedSections, setExpandedSections] = useState({});

    const toggleSection = (sectionId) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    return (
        <div className="bg-[#fdf9f0] min-h-screen text-[#2c1d12] font-sans pb-20">
            <SEO title="Our Story" description="Learn about Jahani Mart - Our mission to deliver premium quality products at the best prices across India." url="https://jahani-mart.onrender.com/our-story" />
            {/* Header / Title Section */}
            <div className="py-16 text-center">
                <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight uppercase text-[#013528]">ABOUT US</h1>
            </div>

            <div className="max-w-[1280px] mx-auto px-6 space-y-24">
                
                {/* Section 1: Introduction */}
                <div className="flex flex-col md:flex-row gap-12 items-center">
                    <div className="w-full md:w-1/2">
                        <img 
                            src="/img3.png" 
                            alt="Our Founding Story" 
                            className="w-full h-auto object-cover shadow-xl rounded-sm"
                        />
                    </div>
                    <div className="w-full md:w-1/2 space-y-4">
                        <h2 className="text-3xl font-serif font-bold text-[#321d10]">Our story</h2>
                        <div className="text-lg leading-relaxed space-y-4">
                            <p>
                                We are a family-run spice company founded in 2012 by mother and son duo Shashi and Sanjay Aggarwal. 
                                Everything we do is rooted in Shashi’s deep knowledge of spices and Indian Masalas and is powered by 
                                Sanjay’s love of cooking with flavours from around the world.
                            </p>
                            
                            {expandedSections['story1'] && (
                                <div className="animate-fadeIn space-y-4">
                                    <p>
                                        Sanjay says: "The idea that became Spice Kitchen was born on Christmas Day 2012, as mum (Shashi Aggarwal) 
                                        and I chatted about how nice it would be to create a spice-filled masia dabba for people to gift to their 
                                        food-loving family and friends."
                                    </p>
                                    <p className="font-bold border-l-4 border-amber-400 pl-4">
                                        Started with our Indian Spice Tin, packed with essential spices and mum's (now multi-award winning!) garam masala.
                                    </p>
                                </div>
                            )}

                            <button 
                                onClick={() => toggleSection('story1')}
                                className="text-[#00674F] font-bold text-sm border-b-2 border-[#00674F] uppercase tracking-wider pb-1 mt-4 block hover:opacity-75 transition-opacity"
                            >
                                {expandedSections['story1'] ? 'READ LESS' : 'READ MORE'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Section 2: Mamma Spice's Story - Reversed */}
                <div className="flex flex-col md:flex-row-reverse gap-12 items-center">
                    <div className="w-full md:w-1/2">
                        <img 
                            src="/img4.png" 
                            alt="Tradition and Detail" 
                            className="w-full h-auto object-cover shadow-xl rounded-sm"
                        />
                    </div>
                    <div className="w-full md:w-1/2 space-y-4">
                        <h2 className="text-3xl font-serif font-bold text-[#321d10]">Mamma Spice’s story</h2>
                        <div className="text-lg leading-relaxed space-y-4">
                            <p>
                                We have become pretty famous for our signature Spice Tin, and right at the beginning of our journey 
                                Mum decided to use recycled silk saris to 'dress' the tins beautifully.
                            </p>
                            
                            {expandedSections['story2'] && (
                                <div className="animate-fadeIn space-y-4">
                                    <p>
                                        To this day, our customers tell us that this detail makes our products super special. Mum now employs 
                                        a team of seamstresses who help her make the saris, and she's always conscious of hiring people 
                                        who might struggle to find work elsewhere.
                                    </p>
                                    <p>
                                        Shashi says: "Food has always been at the heart of my life, serving as a means of expressing love 
                                        to my family. These seasonings were prepared with a lovingly prepared family meal in mind."
                                    </p>
                                </div>
                            )}

                            <button 
                                onClick={() => toggleSection('story2')}
                                className="text-[#00674F] font-bold text-sm border-b-2 border-[#00674F] uppercase tracking-wider pb-1 mt-4 block hover:opacity-75 transition-opacity"
                            >
                                {expandedSections['story2'] ? 'READ LESS' : 'READ MORE'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Section 3: Starting Out */}
                <div className="flex flex-col md:flex-row gap-12 items-center">
                    <div className="w-full md:w-1/2">
                        <img 
                            src="/img2.png" 
                            alt="Beginnings" 
                            className="w-full h-auto object-cover shadow-xl rounded-sm"
                        />
                    </div>
                    <div className="w-full md:w-1/2 space-y-4">
                        <h2 className="text-3xl font-serif font-bold text-[#321d10]">Starting out</h2>
                        <div className="text-lg leading-relaxed space-y-4">
                            <p>
                                When we were just starting out, I started small and pitched up at Altrincham Market with a 
                                makeshift sign and some wooden tables, selling tins and serving mulled wine, often in 
                                freezing conditions.
                            </p>
                            
                            {expandedSections['story3'] && (
                                <div className="animate-fadeIn space-y-4">
                                    <p>
                                        We began to push further afield, attending the BBC Good Food Show and were approached to 
                                        appear on The Hairy Bikers in 2017. Me and mum were asked to cook for the CEO of eBay 
                                        and his team, and from there, things just mushroomed!
                                    </p>
                                </div>
                            )}

                            <button 
                                onClick={() => toggleSection('story3')}
                                className="text-[#00674F] font-bold text-sm border-b-2 border-[#00674F] uppercase tracking-wider pb-1 mt-4 block hover:opacity-75 transition-opacity"
                            >
                                {expandedSections['story3'] ? 'READ LESS' : 'READ MORE'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Section 4: Growing - Reversed */}
                <div className="flex flex-col md:flex-row-reverse gap-12 items-center">
                    <div className="w-full md:w-1/2">
                        <img 
                            src="/img1.png" 
                            alt="The Vision" 
                            className="w-full h-auto object-cover shadow-xl rounded-sm"
                        />
                    </div>
                    <div className="w-full md:w-1/2 space-y-4">
                        <h2 className="text-3xl font-serif font-bold text-[#321d10]">Growing</h2>
                        <div className="text-lg leading-relaxed space-y-4">
                            <p>
                                Then, as things started to really take off, we found our first little manufacturing space in Cheshire. 
                                We expanded our product range from our flagship Indian Spice Tin into World Spices and Gin collections.
                            </p>
                            
                            {expandedSections['story4'] && (
                                <div className="animate-fadeIn space-y-4">
                                    <p>
                                        I even created a special range of spice blends for babies and children after seeing how well 
                                        my young daughter Sara responded to new flavours. Spice Kitchen has always been about sharing 
                                        mine and my mother's passion for food with people from all corners of the world.
                                    </p>
                                </div>
                            )}

                            <button 
                                onClick={() => toggleSection('story4')}
                                className="text-[#00674F] font-bold text-sm border-b-2 border-[#00674F] uppercase tracking-wider pb-1 mt-4 block hover:opacity-75 transition-opacity"
                            >
                                {expandedSections['story4'] ? 'READ LESS' : 'READ MORE'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx="true">{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.4s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default OurStory;

