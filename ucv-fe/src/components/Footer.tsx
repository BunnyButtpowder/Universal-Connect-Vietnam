import { Phone, Mail } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { useState, FormEvent } from "react"
import { useContentStore } from "../lib/contentStore"
import { useTranslatedContent } from "../hooks/useTranslatedContent"

export function Footer() {
    // Content store and translation hooks
    const getItemById = useContentStore(state => state.getItemById);
    const { getContentItem } = useTranslatedContent();

    // Get footer content from store
    const descriptionContent = getContentItem('footer-description') || getItemById('home', 'footer', 'footer-description')?.content || 
        "Help university representatives like you unlock access to these schools through expertly curated tours.";
    const phoneContent = getContentItem('footer-phone') || getItemById('home', 'footer', 'footer-phone')?.content || 
        "+84 (0)34444 8680";
    const email1Content = getContentItem('footer-email1') || getItemById('home', 'footer', 'footer-email1')?.content || 
        "info@ucv.com.vn";
    // const email2Content = getItemById('home', 'footer', 'footer-email2')?.content || 
    //     "bfwidemann@gmail.com";
    const copyrightContent = getContentItem('footer-copyright') || getItemById('home', 'footer', 'footer-copyright')?.content || 
        "2025©UCV. All rights reserved.";
    const contactHeadingContent = getContentItem('footer-contact-heading') || getItemById('home', 'footer', 'footer-contact-heading')?.content || 
        "GET IN TOUCH";
    const contactTitleContent = getContentItem('footer-contact-title') || getItemById('home', 'footer', 'footer-contact-title')?.content || 
        "Build partnerships, explore opportunities, and experience Vietnam's vibrant education landscape firsthand.";

    // Get region label content from store
    const northernRegionLabel = getContentItem('footer-region-northern') || getItemById('home', 'footer', 'footer-region-northern')?.content || 
        "Northern Vietnam (Hanoi and surrounding areas)";
    const centralRegionLabel = getContentItem('footer-region-central') || getItemById('home', 'footer', 'footer-region-central')?.content || 
        "Central Vietnam (Da Nang and surrounding areas)";
    const southernRegionLabel = getContentItem('footer-region-southern') || getItemById('home', 'footer', 'footer-region-southern')?.content || 
        "Southern Vietnam (HCMC and surrounding areas)";

    const [formData, setFormData] = useState({
        fullName: "",
        organization: "",
        email: "",
        tourRegions: {
            northern: false,
            central: false,
            southern: false
        },
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleCheckboxChange = (id: string) => {
        setFormData(prev => ({
            ...prev,
            tourRegions: {
                ...prev.tourRegions,
                [id]: !prev.tourRegions[id as keyof typeof prev.tourRegions]
            }
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Prepare tour regions array for API
            const tourRegions = [];
            if (formData.tourRegions.northern) tourRegions.push(northernRegionLabel);
            if (formData.tourRegions.central) tourRegions.push(centralRegionLabel);
            if (formData.tourRegions.southern) tourRegions.push(southernRegionLabel);

            // Prepare request body
            const requestBody = {
                fullname: formData.fullName,
                organization: formData.organization,
                email: formData.email,
                tourRegions: tourRegions,
                message: formData.message
            };

            // Send API request
            const response = await fetch("https://api.ucv.com.vn/contact/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                // Reset form on success
                setFormData({
                    fullName: "",
                    organization: "",
                    email: "",
                    tourRegions: {
                        northern: false,
                        central: false,
                        southern: false
                    },
                    message: ""
                });
                alert("Message sent successfully!");
            } else {
                alert("Failed to send message. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("An error occurred. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <footer className="bg-content text-white pb-12 lg:py-12 px-4 md:px-6 lg:px-20 rounded-t-3xl">
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
                            {descriptionContent}
                        </p>
                        
                        {/* Contact Info - Mobile & Desktop */}
                        <div className="flex flex-col mt-6">
                            <div className="ms-5 py-4 flex gap-6">
                                <div className="flex items-center mb-2">
                                    <Phone className="h-6 w-6 fill-[#438EFF] text-content" />
                                </div>
                                <div className="flex flex-col">
                                    <h5 className="text-white font-medium text-xs">HOTLINE</h5>
                                    <a href={`tel:${phoneContent}`} className="text-white hover:text-white text-xs">
                                        {phoneContent}
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
                                    <a href={`mailto:${email1Content}`} className="text-white hover:text-white text-xs">
                                        {email1Content}
                                    </a>
                                    {/* <a href={`mailto:${email2Content}`} className="text-white hover:text-white text-xs">
                                        {email2Content}
                                    </a> */}
                                </div>
                            </div>
                            <div className="h-[1px] bg-white/10" />
                        </div>

                        {/* Copyright */}
                        <div className="mt-10 lg:mt-40 text-xs text-white/20">
                            {copyrightContent}
                        </div>
                    </div>

                    <div className="lg:col-span-1"></div>

                    {/* Right Side */}
                    <div id="contact-section" className="space-y-6 lg:col-span-8 order-2 lg:order-2 mt-6 lg:mt-0">
                        {/* Get in Touch Section */}
                        <div className="">
                            <h4 className="font-semibold mb-2 text-header text-sm">{contactHeadingContent}</h4>
                            <h2 className="text-2xl lg:text-4xl text-white">
                                {contactTitleContent}
                            </h2>

                            {/* Contact Form */}
                            <div className="mt-8 footer-bg-color p-4 lg:p-6 rounded-lg">
                                <form className="space-y-6" onSubmit={handleSubmit}>
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
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                                required
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
                                                value={formData.organization}
                                                onChange={handleInputChange}
                                                required
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
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Region and Message - Adjust layout for mobile */}
                                    <div className="grid grid-cols-1 md:grid-cols-5 gap-y-6">
                                        {/* Preferred Tour Region */}
                                        <div className="space-y-2 col-span-2">
                                            <label className="block text-blue-400 text-sm">
                                                Preferred Tour Region
                                            </label>
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center">
                                                    <Checkbox 
                                                        id="northern" 
                                                        className="cursor-pointer data-[state=checked]:bg-blue-500 text-content"
                                                        checked={formData.tourRegions.northern}
                                                        onCheckedChange={() => handleCheckboxChange("northern")}
                                                    />
                                                    <label htmlFor="northern" className="ml-2 text-white text-sm cursor-pointer">
                                                        {northernRegionLabel}
                                                    </label>
                                                </div>
                                                <div className="flex items-center">
                                                    <Checkbox 
                                                        id="central" 
                                                        className="cursor-pointer data-[state=checked]:bg-blue-500 text-content"
                                                        checked={formData.tourRegions.central}
                                                        onCheckedChange={() => handleCheckboxChange("central")}
                                                    />
                                                    <label htmlFor="central" className="ml-2 text-white text-sm cursor-pointer">
                                                        {centralRegionLabel}
                                                    </label>
                                                </div>
                                                <div className="flex items-center">
                                                    <Checkbox 
                                                        id="southern" 
                                                        className="cursor-pointer data-[state=checked]:bg-blue-500 text-content"
                                                        checked={formData.tourRegions.southern}
                                                        onCheckedChange={() => handleCheckboxChange("southern")}
                                                    />
                                                    <label htmlFor="southern" className="ml-2 text-white text-sm cursor-pointer">
                                                        {southernRegionLabel}
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Message */}
                                        <div className="space-y-2 col-span-1 md:col-span-3">
                                            <label htmlFor="message" className="block text-blue-400 text-sm">
                                                Message
                                            </label>
                                            <textarea
                                                id="message"
                                                rows={2}
                                                placeholder="Anything else you'd like us to know?"
                                                className="text-xs w-full bg-transparent border-b border-gray-200 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400"
                                                value={formData.message}
                                                onChange={handleInputChange}
                                            ></textarea>
                                        </div>
                                    </div>

                                    {/* Send Message Button */}
                                    <div className="flex justify-center md:justify-end w-full">
                                        <button
                                            type="submit"
                                            className="w-full md:w-auto bg-blue-500 hover:bg-blue-950 text-white text-sm font-medium min-w-[130px] px-5 py-3 rounded-full group flex items-center justify-center transition-all duration-300 hover:-translate-x-2 hover:min-w-[140px] cursor-pointer space-x-2"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? "Sending..." : "Send Message"}
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
