import { ArrowUpRight, ArrowRight } from "lucide-react"

export function DiscoverSchoolTourHome() {
    return (
        <section className="relative mx-auto px-4 sm:px-6 lg:px-20 py-12 overflow-hidden">
            {/* Decorative Image - Upper Left */}
            <img
                src="/vector.svg"
                alt="Decorative element"
                className="absolute -top-3 lg:-top-15 left-0 max-w-none w-[200%] lg:w-240 h-[180px] lg:h-70 pointer-events-none -z-1"
            />

            {/* Content Container */}
            <div className="relative z-10 bg-blue-100 rounded-xl mt-3 p-7">
                {/* Content Layout - 2 columns on desktop, stacked on mobile */}
                <div className="grid grid-cols-1 lg:grid-cols-6 mb-10">
                    <div className="space-y-6 lg:col-span-1 me-10">
                        <h3 className="text-header font-bold text-lg">DISCOVER OUR SCHOOL TOURS</h3>
                    </div>

                    <div className="lg:col-span-1"></div>

                    <div className="space-y-6 lg:col-span-4">
                        <h2 className="text-3xl lg:text-4xl font-medium text-content">
                            Exclusive access to prestigious state schools, hand-picked for their academic excellence.
                        </h2>

                        <p className="text-sm text-content">
                            As we know the intense schedule university reps have, we tailor our tours to be highly productive and fun at the same time. We want you to leave feeling you've experienced new parts of this beautiful country, enjoying the culinary gems along the way. You won't be disappointed.
                        </p>

                        <button className="flex items-center space-x-2 bg-content hover:bg-blue-500 text-white text-xs font-medium px-5 py-3 rounded-full group hover:translate-x-2 hover:min-w-[140px] transition-all duration-300 cursor-pointer">
                            <span>Explore All Our Tours</span>
                            <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </button>
                    </div>
                </div>

                {/* Tour Cards - 3 columns on desktop, stacked on mobile */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Tour Card 1 */}
                    <div className="bg-white hover:bg-sky-50 rounded-xl overflow-hidden cursor-pointer group/card transition-colors duration-300">
                        <div className="relative h-72 overflow-hidden rounded-xl">
                            <div className="absolute top-6 left-6 flex space-x-2 z-10 bg-white rounded-md px-3 py-2">
                                <span className="font-bold text-xs text-content">INCOMING • JULY 4</span>
                            </div>
                            <div className="h-full w-full p-3">
                                <div className="relative h-full w-full overflow-hidden rounded-xl">
                                    <img
                                        src="/hero-banner-1.png"
                                        alt="Students at school fair"
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-110"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="px-6 mb-6 space-y-3">
                            <h3 className="font-bold text-base text-content">Tour Spring 2025</h3>
                            <p className="text-xs text-slate-500 line-clamp-2 group-hover/card:text-blue-950 transition-colors duration-300">
                                Short Description At IUC, we're passionate about bridging the gap between international universities ...
                            </p>
                            <div className="flex justify-between items-center pt-2">
                                <button className="bg-blue-500 text-white text-xs min-w-[130px] px-2 py-2 rounded-full group flex items-center justify-between transition-all duration-300 cursor-pointer group-hover/card:translate-x-1 group-hover/card:min-w-[140px] group-hover/card:bg-blue-950">
                                    <div className="bg-white rounded-full p-1.5 flex items-center justify-center">
                                        <ArrowRight className="h-3 w-3 text-blue-500 transition-transform duration-300" />
                                    </div>
                                    <span className="flex-1 text-center group-hover:translate-x-1 transition-transform duration-300 font-medium group-hover/card:translate-x-1">Find out more</span>
                                </button>
                                <div className="flex items-center space-x-1 text-navy-800">
                                    <span className="text-xs">Start from</span>
                                    <span className="font-bold text-content">$2065</span>
                                    <span className="text-xs text-gray-500 font-medium">USD</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tour Card 2 */}
                    <div className="bg-white hover:bg-sky-50 rounded-xl overflow-hidden cursor-pointer group/card transition-colors duration-300">
                        <div className="relative h-72 overflow-hidden rounded-xl">
                            <div className="absolute top-6 left-6 flex space-x-2 z-10 bg-white rounded-md px-3 py-2">
                                <span className="font-bold text-xs text-content">INCOMING • JULY 4</span>
                            </div>
                            <div className="h-full w-full p-3">
                                <div className="relative h-full w-full overflow-hidden rounded-xl">
                                    <img
                                        src="/hero-banner-2.png"
                                        alt="Students at school fair"
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-110"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="px-6 mb-6 space-y-3">
                            <h3 className="font-bold text-base text-content">Tour Spring 2025</h3>
                            <p className="text-xs text-slate-500 line-clamp-2 group-hover/card:text-blue-950 transition-colors duration-300">
                                Short Description At IUC, we're passionate about bridging the gap between international universities ...
                            </p>
                            <div className="flex justify-between items-center pt-2">
                                <button className="bg-blue-500 text-white text-xs min-w-[130px] px-2 py-2 rounded-full group flex items-center justify-between transition-all duration-300 cursor-pointer group-hover/card:translate-x-1 group-hover/card:min-w-[140px] group-hover/card:bg-blue-950">
                                    <div className="bg-white rounded-full p-1.5 flex items-center justify-center">
                                        <ArrowRight className="h-3 w-3 text-blue-500 transition-transform duration-300" />
                                    </div>
                                    <span className="flex-1 text-center group-hover:translate-x-1 transition-transform duration-300 font-medium group-hover/card:translate-x-1">Find out more</span>
                                </button>
                                <div className="flex items-center space-x-1 text-navy-800">
                                    <span className="text-xs">Start from</span>
                                    <span className="font-bold text-content">$2065</span>
                                    <span className="text-xs text-gray-500 font-medium">USD</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tour Card 3 */}
                    <div className="bg-white hover:bg-sky-50 rounded-xl overflow-hidden cursor-pointer group/card transition-colors duration-300">
                        <div className="relative h-72 overflow-hidden rounded-xl">
                            <div className="absolute top-6 left-6 flex space-x-2 z-10 bg-white rounded-md px-3 py-2">
                                <span className="font-bold text-xs text-content">INCOMING • JULY 4</span>
                            </div>
                            <div className="h-full w-full p-3">
                                <div className="relative h-full w-full overflow-hidden rounded-xl">
                                    <img
                                        src="/hero-banner-3.png"
                                        alt="Students at school fair"
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-110"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="px-6 mb-6 space-y-3">
                            <h3 className="font-bold text-base text-content">Tour Spring 2025</h3>
                            <p className="text-xs text-slate-500 line-clamp-2 group-hover/card:text-blue-950 transition-colors duration-300">
                                Short Description At IUC, we're passionate about bridging the gap between international universities ...
                            </p>
                            <div className="flex justify-between items-center pt-2">
                                <button className="bg-blue-500 text-white text-xs min-w-[130px] px-2 py-2 rounded-full group flex items-center justify-between transition-all duration-300 cursor-pointer group-hover/card:translate-x-1 group-hover/card:min-w-[140px] group-hover/card:bg-blue-950">
                                    <div className="bg-white rounded-full p-1.5 flex items-center justify-center">
                                        <ArrowRight className="h-3 w-3 text-blue-500 transition-transform duration-300" />
                                    </div>
                                    <span className="flex-1 text-center group-hover:translate-x-1 transition-transform duration-300 font-medium group-hover/card:translate-x-1">Find out more</span>
                                </button>
                                <div className="flex items-center space-x-1 text-navy-800">
                                    <span className="text-xs">Start from</span>
                                    <span className="font-bold text-content">$2065</span>
                                    <span className="text-xs text-gray-500 font-medium">USD</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative Image - Lower Right */}
            <img
                src="/vector-1.svg"
                alt="Decorative element"
                className="absolute bottom-0 -right-50 lg:right-0 w-140 h-25 pointer-events-none -z-1"
            />
        </section>
    )
}