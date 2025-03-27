import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

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
                {/* Header Section */}
                <div className="flex items-center">
                    <h2 className="text-primary font-medium">ABOUT US</h2>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Text Content */}
                    <div className="space-y-6">
                        <h3 className="text-4xl font-medium text-content leading-tight">
                            We're passionate about bridging the gap between international universities and Vietnam's top state schools.
                        </h3>
                        
                        <div className="space-y-4">
                            <p className="text-sm text-content">
                                At UCV, we're passionate about bridging the gap between international universities and Vietnam's top state schools. Based in the heart of Vietnam, we've spent years cultivating relationships with leading educational institutions in Central and Northern regions.
                            </p>
                            
                            <p className="text-sm text-content">
                                Our mission? To help university representatives like you unlock access to these schools. With our local expertise and tailored approach, we make your outreach seamless, impactful, and rewarding.
                            </p>
                        </div>

                        <Button 
                            variant="default" 
                            className="rounded-full group flex items-center space-x-2 hover:translate-x-2 transition-all duration-300"
                        >
                            <span>Get to Know Us Better</span>
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </Button>
                    </div>

                    {/* Right Column - Image */}
                    <div className="relative">
                        <div className="rounded-2xl overflow-hidden">
                            <img 
                                src="/about-us.png" 
                                alt="Group photo at Vietnamese school" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>

                {/* Statistics Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
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
