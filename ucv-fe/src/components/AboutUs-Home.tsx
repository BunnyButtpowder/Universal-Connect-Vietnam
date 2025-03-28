import { ArrowUpRight } from "lucide-react"

export function AboutUsHome() {
    const stats = [
        {
            number: "03",
            icon: "🎓",
            title: "Successful",
            subtitle: "Tours Organized"
        },
        {
            number: "41",
            icon: "🏫",
            title: "Collaborations",
            subtitle: "with Schools"
        },
        {
            number: "06",
            icon: "👥",
            title: "Returning",
            subtitle: "UNIS"
        }
    ]

    return (
        <section className="container mx-auto px-4 sm:px-6 lg:px-20 py-12">
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
                                className="absolute bottom-5 right-5 bg-blue-500 hover:bg-blue-950 text-white text-xs min-w-[130px] px-4 py-3 rounded-full group flex items-center justify-between transition-all duration-300 hover:-translate-x-2 hover:min-w-[140px] cursor-pointer space-x-2"
                            >
                                <span>Get to Know Us Better</span>
                                <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Statistics Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:top-0 gap-8 ">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex items-center space-x-4">
                            <span className="text-5xl font-bold text-primary">{stat.number}</span>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-content">{stat.title}</span>
                                <span className="text-sm text-muted-foreground">{stat.subtitle}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
