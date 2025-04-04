import { Phone, Mail } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

export function Footer() {
    return (
        <footer className="bg-content text-white pb-12 lg:py-12 px-4 md:px-6 lg:px-20 mt-20 rounded-t-3xl">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Left Side - Logo and Description */}
                    <div className="space-y-4 lg:col-span-3 order-1 lg:order-0">
                        <div className="flex justify-center lg:justify-start">
                            <a href="/" className="flex items-center gap-2">
                                <img
                                    src="/ucv-logo-white.svg"
                                    alt="UCV Logo"
                                    width={40}
                                    height={40}
                                    className="h-12 w-auto"
                                />
                                <div className="flex flex-col ps-2">
                                    <span className="text-xs font-medium text-white">UNIVERSAL</span>
                                    <span className="text-xs font-medium text-white">CONNECT</span>
                                    <span className="text-xs font-medium text-white">VN</span>
                                </div>
                            </a>
                        </div>

                        <p className="text-xs max-w-md text-white/50 text-center lg:text-left">
                            Help university representatives like you unlock access to
                            these schools through expertly curated tours.
                        </p>
                        
                        {/* Contact Info - Mobile & Desktop */}
                        <div className="flex flex-col mt-6">
                            <div className="ms-5 py-4 flex gap-6">
                                <div className="flex items-center mb-2">
                                    <Phone className="h-6 w-6 fill-[#438EFF] text-content" />
                                </div>
                                <div className="flex flex-col">
                                    <h5 className="text-white font-medium text-xs">HOTLINE</h5>
                                    <a href="tel:+84034444868" className="text-white hover:text-white text-xs">
                                        +84 (0)34444 8680
                                    </a>
                                </div>
                            </div>
                            <div className="h-[1px] bg-white/10" />
                            <div className="ms-5 py-4 flex gap-6">
                                <div className="flex items-center mb-2">
                                    <Mail className="h-6 w-6 fill-[#438EFF] text-content" />
                                </div>
                                <div className="flex flex-col">
                                    <h5 className="text-white font-medium text-xs">EMAIL</h5>
                                    <a href="mailto:bernd@iucconsulting.com" className="text-white hover:text-white text-xs">
                                        bernd@iucconsulting.com
                                    </a>
                                    <a href="mailto:bfwidemann@gmail.com" className="text-white hover:text-white text-xs">
                                        bfwidemann@gmail.com
                                    </a>
                                </div>
                            </div>
                            <div className="h-[1px] bg-white/10" />
                        </div>

                        {/* Copyright */}
                        <div className="mt-10 lg:mt-40 text-xs text-white/20">
                            2025©UCV. All rights reserved.
                        </div>
                    </div>

                    <div className="lg:col-span-1"></div>

                    {/* Right Side */}
                    <div id="contact-section" className="space-y-6 lg:col-span-8 order-2 lg:order-2 mt-6 lg:mt-0">
                        {/* Get in Touch Section */}
                        <div className="">
                            <h4 className="font-semibold mb-2 text-header text-sm">GET IN TOUCH</h4>
                            <h2 className="text-2xl lg:text-4xl text-white">
                                Build partnerships, explore opportunities, and experience Vietnam's vibrant education landscape firsthand.
                            </h2>

                            {/* Contact Form */}
                            <div className="mt-8 footer-bg-color p-4 lg:p-6 rounded-lg">
                                <form className="space-y-6">
                                    {/* Input Fields - Mobile stacked, Desktop in row */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 md:gap-4">
                                        {/* Full Name */}
                                        <div className="space-y-2">
                                            <label htmlFor="fullName" className="block text-blue-400 text-sm">
                                                Full name
                                            </label>
                                            <input
                                                type="text"
                                                id="fullName"
                                                placeholder="What's your name?"
                                                className="text-xs w-full bg-transparent border-b border-gray-200 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400"
                                            />
                                        </div>

                                        {/* University/Organization */}
                                        <div className="space-y-2">
                                            <label htmlFor="organization" className="block text-blue-400 text-sm">
                                                University/Organization
                                            </label>
                                            <input
                                                type="text"
                                                id="organization"
                                                placeholder="Your university, school, or organization name"
                                                className="text-xs w-full bg-transparent border-b border-gray-200 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400"
                                            />
                                        </div>

                                        {/* Email */}
                                        <div className="space-y-2">
                                            <label htmlFor="email" className="block text-blue-400 text-sm">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                placeholder="example@gmail.com"
                                                className="text-xs w-full bg-transparent border-b border-gray-200 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400"
                                            />
                                        </div>
                                    </div>

                                    {/* Region and Message - Adjust layout for mobile */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 md:gap-4">
                                        {/* Preferred Tour Region */}
                                        <div className="space-y-2 col-span-1">
                                            <label className="block text-blue-400 text-sm">
                                                Preferred Tour Region
                                            </label>
                                            <div className="flex flex-row gap-8">
                                                <div className="flex items-center me-10 lg:me-4">
                                                    <Checkbox 
                                                        id="central" 
                                                        className="cursor-pointer data-[state=checked]:bg-blue-500 text-content" 
                                                    />
                                                    <label htmlFor="central" className="ml-2 text-white text-sm cursor-pointer">
                                                        Central
                                                    </label>
                                                </div>
                                                <div className="flex items-center">
                                                    <Checkbox 
                                                        id="northernVietnam" 
                                                        className="cursor-pointer data-[state=checked]:bg-blue-500 text-content" 
                                                    />
                                                    <label htmlFor="northernVietnam" className="ml-2 text-white text-sm cursor-pointer">
                                                        Northern Vietnam
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Message */}
                                        <div className="space-y-2 col-span-1 md:col-span-2">
                                            <label htmlFor="message" className="block text-blue-400 text-sm">
                                                Message
                                            </label>
                                            <textarea
                                                id="message"
                                                rows={2}
                                                placeholder="Anything else you'd like us to know?"
                                                className="text-xs w-full bg-transparent border-b border-gray-200 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400"
                                            ></textarea>
                                        </div>
                                    </div>

                                    {/* Send Message Button */}
                                    <div className="flex justify-center md:justify-end w-full">
                                        <button
                                            type="submit"
                                            className="w-full md:w-auto bg-blue-500 hover:bg-blue-950 text-white text-sm font-medium min-w-[130px] px-5 py-3 rounded-full group flex items-center justify-center transition-all duration-300 hover:-translate-x-2 hover:min-w-[140px] cursor-pointer space-x-2"
                                        >
                                            Send Message
                                            <img src="/send-icon.svg" alt="Send Icon" className="h-3 w-3 ms-2 group-hover:translate-x-1 transition-transform duration-300" />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
