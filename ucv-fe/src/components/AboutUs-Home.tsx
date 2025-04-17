import { ArrowUpRight, School } from "lucide-react"

export function AboutUsHome() {
    const stats = [
        {
            number: "03",
            icon: <img src="/edu-icon.svg" />,
            title: "Successful",
            subtitle: "Tours Organized"
        },
        {
            number: "41",
            icon: <School className="text-[#438EFF] w-7 h-7" />,
            title: "Collaborations",
            subtitle: "with Schools"
        },
        {
            number: "06",
            icon: <img src="/person-icon.svg" />,
            title: "Returning",
            subtitle: "UNIS"
        }
    ]

    return (
        <section className="mx-auto px-4 sm:px-6 lg:px-20 pt-12 pb-3">
            <div className="flex flex-col space-y-8">
                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
                    {/* Left Content - 2 columns */}
                    <div className="space-y-6 lg:col-span-2 relative overflow-visible h-[400px] lg:h-auto">
                        <div className="flex items-center mb-0">
                            <h2 className="text-header font-bold">ABOUT US</h2>
                        </div>
                        <img
                            src="/about-us-vector.svg"
                            alt="Decorative element"
                            className="object-cover absolute -left-8 lg:-left-20 w-[110%] max-w-none lg:bottom-0 top-5 lg:top-auto"
                        />
                    </div>

                    {/* Right Content - 4 columns */}
                    <div className="relative lg:col-span-4 lg:top-0">
                        <h3 className="text-3xl font-medium text-content leading-tight mb-5">
                            We're passionate about bridging the gap between international universities and Vietnam's top state schools.
                        </h3>

                        <div className="space-y-4 grid grid-cols-1 lg:grid-cols-2 lg:gap-10">
                            <p className="text-sm text-content font-medium">
                                At UCV, we're passionate about bridging the gap between international universities and Vietnam's top state schools. Based in the heart of Vietnam, we've spent years cultivating relationships with leading educational institutions in Central and Northern regions.
                            </p>

                            <p className="text-sm text-content font-medium">
                                Our mission? To help university representatives like you unlock access to these schools. With our local expertise and tailored approach, we make your outreach seamless, impactful, and rewarding.
                            </p>
                        </div>


                        <div className="mt-5 relative rounded-2xl overflow-hidden"
                            style={{
                                height: typeof window !== 'undefined' && window.innerWidth < 1024
                                    ? "440px"
                                    : "400px"
                            }}>
                            <img
                                src="/about-us.png"
                                alt="Group photo at Vietnamese school"
                                className="w-full h-full object-cover"
                            />
                            <button
                                className="absolute bottom-5 right-5 md:right-5 left-5 md:left-auto w-[calc(100%-40px)] md:w-auto bg-blue-500 hover:bg-blue-950 text-white text-xs font-medium min-w-[130px] px-4 py-3 rounded-full group flex items-center justify-between transition-all duration-300 md:hover:-translate-x-2 md:hover:min-w-[140px] cursor-pointer space-x-2 justify-center"
                            >
                                <span>Get to Know Us Better</span>
                                <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Statistics Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:top-0 gap-8 border-y-1 border-accent-blue divide-y lg:divide-y-0 lg:divide-x-1 divide-blue-200">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex items-center space-x-4 py-5 px-5">
                            <div>{stat.icon}</div>
                            <span className="text-6xl font-medium text-content">{stat.number}</span>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-content">{stat.title}</span>
                                <span className="text-sm font-medium text-content">{stat.subtitle}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tour Information Section */}
                <div className="relative mt-7 -mx-4 sm:-mx-6 lg:-mx-20 px-4 sm:px-6 lg:px-20 pt-10 pb-16 bg-sky-50 overflow-hidden">
                    <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
                        <img
                            src="/Frame-9.png"
                            alt="Background"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="relative z-10 max-w-8xl">
                        <h2 className="text-3xl lg:text-4xl font-medium text-center text-content mb-12 mt-4">
                            Our tours are your key to Vietnam's top state schools.
                        </h2>

                        {/* Three Cards - Grid on desktop, Stack on mobile */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Card 1 */}
                            <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="">
                                        <img src="/map-pin.svg" alt="Map Pin" className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-[#438EFF]">LOCATIONS</h3>
                                </div>
                                <div className="border-t border-accent-blue pt-4">
                                    <p className="text-xs text-content space-y-1 font-medium">
                                        Currently we focus on Central and Northern Vietnam.
                                    </p>
                                </div>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="">
                                        <img src="/edu.svg" alt="Education Icon" className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-[#438EFF]">WHAT WE OFFER</h3>
                                </div>
                                <div className="border-t border-accent-blue pt-4">
                                    <ul className="list-disc pl-5 text-xs text-content space-y-1 font-medium">
                                        <li>Guided visits with school administrators and faculty.</li>
                                        <li>In-school preparation before the tour through workshops.</li>
                                        <li>
                                            Opportunities to present your university and network with students through a mix of the following:
                                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                                <li>Panel talks</li>
                                                <li>Elevator pitches</li>
                                                <li>Workshops</li>
                                                <li>Mini fairs</li>
                                            </ul>
                                        </li>
                                        <li>Cultural insights to enhance your experience.</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Card 3 */}
                            <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="">
                                        <img src="/support.svg" alt="Headphone Icon" className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-[#438EFF]">OUR SUPPORT</h3>
                                </div>
                                <div className="border-t border-accent-blue pt-4">
                                    <ul className="list-disc pl-5 text-xs text-content space-y-1 font-medium">
                                        <li>2 - 3 school visits per day</li>
                                        <li>Full logistics (Support throughout the tour and school visits)</li>
                                        <li>One stall at each school fair</li>
                                        <li>Intra and inter city transport (on the ground travel - not including flights)</li>
                                        <li>Reception dinner</li>
                                        <li>Daily lunches</li>
                                        <li>Coffee breaks</li>
                                        <li>Group dinners (75% of the time)</li>
                                        <li>Hotel suggestions & discounts</li>
                                        <li>1 - 2 pages in university booklet for schools</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
