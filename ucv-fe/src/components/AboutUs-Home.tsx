import { ArrowUpRight, School } from "lucide-react"
import { useContentStore } from "../lib/contentStore"

export function AboutUsHome() {
    const getItemById = useContentStore(state => state.getItemById);

    // Get content from store
    const headingContent = getItemById('home', 'aboutUs', 'aboutUs-heading')?.content ||
        "ABOUT US";
    const subheadingContent = getItemById('home', 'aboutUs', 'aboutUs-subheading')?.content ||
        "We're passionate about bridging the gap between international universities and Vietnam's top state schools.";
    const paragraph1Content = getItemById('home', 'aboutUs', 'aboutUs-paragraph1')?.content ||
        "At UCV, we're passionate about bridging the gap between international universities and Vietnam's top state schools. Based in the heart of Vietnam, we've spent years cultivating relationships with leading educational institutions in Central and Northern regions.";
    const paragraph2Content = getItemById('home', 'aboutUs', 'aboutUs-paragraph2')?.content ||
        "Our mission? To help university representatives like you unlock access to these schools. With our local expertise and tailored approach, we make your outreach seamless, impactful, and rewarding.";
    const buttonContent = getItemById('home', 'aboutUs', 'aboutUs-button')?.content ||
        "Get to Know Us Better";
    const imageContent = getItemById('home', 'aboutUs', 'aboutUs-image')?.content ||
        "/about-us.png";
    const tourHeadingContent = getItemById('home', 'aboutUs', 'aboutUs-tourHeading')?.content ||
        "Our tours are your key to Vietnam's top state schools.";

    // Location card content
    const locationTitleContent = getItemById('home', 'aboutUs', 'aboutUs-location-title')?.content || "LOCATIONS";
    const locationIconContent = getItemById('home', 'aboutUs', 'aboutUs-location-icon')?.content || "/map-pin.svg";
    const locationTextContent = getItemById('home', 'aboutUs', 'aboutUs-location-content')?.content ||
        "Currently we focus on Central (Da Nang & Hue) and Northern (Ha Noi & Hai Duong) Vietnam.\nWe will be expanding to Southern Vietnam in 2026, including HCMC.";

    // What We Offer card content
    const offerTitleContent = getItemById('home', 'aboutUs', 'aboutUs-offer-title')?.content || "WHAT WE OFFER";
    const offerIconContent = getItemById('home', 'aboutUs', 'aboutUs-offer-icon')?.content || "/edu.svg";
    const offerTextContent = getItemById('home', 'aboutUs', 'aboutUs-offer-content')?.content ||
        "Guided visits with school administrators and faculty.\nIn-school preparation before the tour through workshops.\nOpportunities to present your university and network with students through a mix of the following:\n- Panel talks\n- Elevator pitches\n- Workshops\n- Mini fairs\nCultural insights to enhance your experience.";

    // Our Support card content
    const supportTitleContent = getItemById('home', 'aboutUs', 'aboutUs-support-title')?.content || "OUR SUPPORT";
    const supportIconContent = getItemById('home', 'aboutUs', 'aboutUs-support-icon')?.content || "/support.svg";
    const supportTextContent = getItemById('home', 'aboutUs', 'aboutUs-support-content')?.content ||
        "2 - 3 school visits per day\nFull logistics (Support throughout the tour and school visits)\nOne stall at each school fair\nIntra and inter city transport (on the ground travel - not including flights)\nReception dinner\nDaily lunches\nCoffee breaks\nGroup dinners (75% of the time)\nHotel suggestions & discounts\n1 - 2 pages in university booklet for schools";

    const stat1 = getItemById('home', 'aboutUs', 'aboutUs-stat1');
    const stat2 = getItemById('home', 'aboutUs', 'aboutUs-stat2');
    const stat3 = getItemById('home', 'aboutUs', 'aboutUs-stat3');

    const stats = [
        {
            number: stat1?.content || "03",
            icon: <img src={stat1?.metadata?.icon || "/edu-icon.svg"} />,
            title: stat1?.metadata?.title || "Successful",
            subtitle: stat1?.metadata?.subtitle || "Tours Organized"
        },
        {
            number: stat2?.content || "41",
            icon: stat2?.metadata?.icon === "School"
                ? <School className="text-[#438EFF] w-7 h-7" />
                : <img src={stat2?.metadata?.icon || "/edu-icon.svg"} />,
            title: stat2?.metadata?.title || "Collaborations",
            subtitle: stat2?.metadata?.subtitle || "with Schools"
        },
        {
            number: stat3?.content || "06",
            icon: <img src={stat3?.metadata?.icon || "/person-icon.svg"} />,
            title: stat3?.metadata?.title || "Returning",
            subtitle: stat3?.metadata?.subtitle || "UNIS"
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
                            <h2 className="text-header font-bold">{headingContent}</h2>
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
                            {subheadingContent}
                        </h3>

                        <div className="space-y-4 grid grid-cols-1 lg:grid-cols-2 lg:gap-10">
                            <p className="text-sm text-content font-medium">
                                {paragraph1Content}
                            </p>

                            <p className="text-sm text-content font-medium">
                                {paragraph2Content}
                            </p>
                        </div>


                        <div className="mt-5 relative rounded-2xl overflow-hidden"
                            style={{
                                height: typeof window !== 'undefined' && window.innerWidth < 1024
                                    ? "440px"
                                    : "400px"
                            }}>
                            <img
                                src={imageContent}
                                alt="Group photo at Vietnamese school"
                                className="w-full h-full object-cover"
                            />
                            <a href="/about-us">
                                <button
                                    className="absolute bottom-5 right-5 md:right-5 left-5 md:left-auto w-[calc(100%-40px)] md:w-auto bg-blue-500 hover:bg-blue-950 text-white text-xs font-medium min-w-[130px] px-4 py-3 rounded-full group flex items-center justify-between transition-all duration-300 md:hover:-translate-x-2 md:hover:min-w-[140px] cursor-pointer space-x-2 justify-center"
                                >
                                    <span>{buttonContent}</span>
                                    <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                                </button>
                            </a>
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
                            {tourHeadingContent}
                        </h2>

                        {/* Three Cards - Grid on desktop, Stack on mobile */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Card 1 */}
                            <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="">
                                        <img src={locationIconContent} alt={locationTitleContent} className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-[#438EFF]">{locationTitleContent}</h3>
                                </div>
                                <div className="border-t border-accent-blue pt-4">
                                    <p className="text-xs text-content space-y-1 font-medium">
                                        {locationTextContent}
                                    </p>
                                    <p className="text-xs text-content space-y-1 font-medium mt-2">
                                        We will be expanding to Southern Vietnam in 2026, including HCMC.
                                    </p>
                                </div>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="">
                                        <img src={offerIconContent} alt={offerTitleContent} className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-[#438EFF]">{offerTitleContent}</h3>
                                </div>
                                <div className="border-t border-accent-blue pt-4">
                                    <ul className="list-disc pl-5 text-xs text-content space-y-1 font-medium">
                                        {offerTextContent.split('\n').map((item, index) => {
                                            // For opportunities block with nested items
                                            if (item.includes("Opportunities to present your university")) {
                                                return (
                                                    <li key={index}>
                                                        Opportunities to present your university and network with students through a mix of the following:
                                                        <ul className="list-disc pl-5 mt-2 space-y-1">
                                                            <li>Panel talks</li>
                                                            <li>Elevator pitches</li>
                                                            <li>Workshops</li>
                                                            <li>Mini fairs</li>
                                                        </ul>
                                                    </li>
                                                );
                                            }
                                            // Skip the nested items as they're included in the special case above
                                            if (item.startsWith('-')) return null;
                                            return <li key={index}>{item}</li>;
                                        })}
                                    </ul>
                                </div>
                            </div>

                            {/* Card 3 */}
                            <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="">
                                        <img src={supportIconContent} alt={supportTitleContent} className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-[#438EFF]">{supportTitleContent}</h3>
                                </div>
                                <div className="border-t border-accent-blue pt-4">
                                    <ul className="list-disc pl-5 text-xs text-content space-y-1 font-medium">
                                        {supportTextContent.split('\n').map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))}
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
