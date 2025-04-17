import { Navbar } from "@/components/Navbar";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, MapPin, Clock } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import React from "react";

// Define types for form data
interface FormData {
    fullName: string;
    organization: string;
    phone: string;
    email: string;
    wantCallback: boolean;
    selectedPackage: string;
    cities: {
        hue: boolean;
        danang: boolean;
        tamKy: boolean;
    };
    transfers: {
        hotel: boolean;
        travel: boolean;
    };
    // Step 3 fields
    headOffice: string;
    businessRegistration: string;
    legalRepresentative: string;
    position: string;
    accountNumber: string;
    bank: string;
    swift: string;
}

// Define validation errors interface
interface ValidationErrors {
    fullName?: string;
    organization?: string;
    phone?: string;
    email?: string;
    headOffice?: string;
    businessRegistration?: string;
    legalRepresentative?: string;
    position?: string;
    accountNumber?: string;
    bank?: string;
}

export default function SignUpForm() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        fullName: "",
        organization: "",
        phone: "",
        email: "",
        wantCallback: false,
        selectedPackage: "earlyBird",
        cities: {
            hue: true,
            danang: true,
            tamKy: true
        },
        transfers: {
            hotel: true,
            travel: true
        },
        // Step 3 fields initialized with empty values
        headOffice: "",
        businessRegistration: "",
        legalRepresentative: "",
        position: "",
        accountNumber: "",
        bank: "",
        swift: ""
    });
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
        
        // Mark field as touched
        setTouched(prev => ({
            ...prev,
            [id]: true
        }));
        
        // Clear error when user types
        if (errors[id as keyof ValidationErrors]) {
            setErrors(prev => ({
                ...prev,
                [id]: undefined
            }));
        }
    };

    const handleCheckboxChange = (id: string, checked: boolean | string) => {
        setFormData(prev => ({
            ...prev,
            [id]: checked === "indeterminate" ? false : !!checked
        }));
    };

    const handleCityChange = (city: string, checked: boolean | string) => {
        setFormData(prev => ({
            ...prev,
            cities: {
                ...prev.cities,
                [city]: checked === "indeterminate" ? false : !!checked
            }
        }));
    };

    const handleTransferChange = (transfer: string, checked: boolean | string) => {
        setFormData(prev => ({
            ...prev,
            transfers: {
                ...prev.transfers,
                [transfer]: checked === "indeterminate" ? false : !!checked
            }
        }));
    };

    const validateStep1 = (): boolean => {
        const newErrors: ValidationErrors = {};
        let isValid = true;

        if (!formData.fullName.trim()) {
            newErrors.fullName = "Full name is required";
            isValid = false;
        }

        if (!formData.organization.trim()) {
            newErrors.organization = "Organization is required";
            isValid = false;
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required";
            isValid = false;
        } else if (!/^\d{8,15}$/.test(formData.phone.trim())) {
            newErrors.phone = "Phone must be between 8-15 digits";
            isValid = false;
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            newErrors.email = "Please enter a valid email";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const validateStep3 = (): boolean => {
        const newErrors: ValidationErrors = {};
        let isValid = true;

        if (!formData.headOffice.trim()) {
            newErrors.headOffice = "Head office address is required";
            isValid = false;
        }

        if (!formData.businessRegistration.trim()) {
            newErrors.businessRegistration = "Business registration number is required";
            isValid = false;
        }

        if (!formData.legalRepresentative.trim()) {
            newErrors.legalRepresentative = "Legal representative is required";
            isValid = false;
        }

        if (!formData.position.trim()) {
            newErrors.position = "Position is required";
            isValid = false;
        }

        if (!formData.accountNumber.trim()) {
            newErrors.accountNumber = "Account number is required";
            isValid = false;
        }

        if (!formData.bank.trim()) {
            newErrors.bank = "Bank name is required";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const nextStep = () => {
        // Validate current step before proceeding
        if (currentStep === 1 && !validateStep1()) {
            // Mark all fields as touched to show errors
            setTouched({
                fullName: true,
                organization: true,
                phone: true,
                email: true
            });
            return;
        }
        
        // Step 2 doesn't need validation
        
        setCurrentStep(prev => prev + 1);
    };

    const prevStep = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = () => {
        // Validate step 3 before submitting
        if (!validateStep3()) {
            // Mark all step 3 fields as touched to show errors
            setTouched({
                ...touched,
                headOffice: true,
                businessRegistration: true,
                legalRepresentative: true,
                position: true,
                accountNumber: true,
                bank: true
            });
            return;
        }
        
        // Here you would typically send the form data to a server
        console.log("Form submitted with data:", formData);
        
        // Set the form as submitted to show success screen
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <div>
                <Navbar />
                <div className="mt-20">
                    <div className="mx-4 lg:mx-0 md:mx-6 lg:px-20 overflow-hidden relative flex flex-col">
                        {/* Decorative Image - Upper Left */}
                        <img
                            src="/vector.svg"
                            alt="Decorative element"
                            className="absolute -top-3 lg:top-10 left-0 lg:-left-20 max-w-none w-[200%] lg:w-300 h-[180px] lg:h-70 pointer-events-none -z-1"
                        />

                        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
                            <div className="max-w-lg mx-auto">
                                <img
                                    src="/party-popper.png"
                                    alt="Celebration"
                                    className="w-58 h-58 lg:w-68 lg:h-68 mx-auto mb-6"
                                />

                                <h1 className="text-4xl lg:text-5xl font-semibold text-content mb-6">You're all set!</h1>

                                <p className="text-content font-medium mb-8 text-sm">
                                    Thank you for completing the form. Our team will review your details and get in
                                    touch with you shortly. If you have any questions, feel free to reach out!
                                    <br /><br />
                                    Your contract will be emailed to you soon.
                                </p>

                                <Link
                                    to="/our-tours"
                                    className="inline-flex w-full md:w-auto items-center justify-center bg-blue-500 hover:bg-blue-950 text-white px-8 py-3 rounded-full font-semibold group flex items-center justify-center transition-all duration-300 hover:translate-x-2 hover:min-w-[140px] cursor-pointer space-x-2"
                                >
                                    Back to Tours
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                                </Link>
                            </div>
                        </div>

                        {/* Decorative Image - Lower Right */}
                        <img
                            src="/vector-1.svg"
                            alt="Decorative element"
                            className="absolute bottom-15 lg:bottom-0 -right-50 lg:right-0 w-140 h-25 pointer-events-none -z-1"
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className="mt-20">
                <div className="mx-4 lg:mx-0 md:mx-6 lg:px-20 overflow-hidden relative flex flex-col">
                    {/* Decorative Image - Upper Left */}
                    <img
                        src="/vector.svg"
                        alt="Decorative element"
                        className="absolute -top-3 lg:top-10 left-0 lg:-left-20 max-w-none w-[200%] lg:w-300 h-[180px] lg:h-70 pointer-events-none -z-1"
                    />
                    {/* Form Container */}
                    <div className="relative w-full h-auto mt-16 lg:mt-0 mb-30 lg:mb-40">
                        <div className="flex justify-center mb-4">
                            <Link to="/tour-details" className="flex items-center text-blue-600 hover:text-blue-800 font-semibold text-sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                View Tour Information Again
                            </Link>
                        </div>

                        <h1 className="text-4xl font-semibold text-center text-content mb-4">Join Our Next Tour</h1>

                        <p className="text-center text-content font-medium text-sm mb-5 max-w-3xl mx-auto lg:px-4">
                            Ready to connect with Vietnam's top state schools? Sign up now to secure your spot on one of our exclusive tours.
                            Simply fill out the form below, and we'll reach out with the next steps.
                        </p>

                        {/* Steps Tracker */}
                        <div className="flex justify-between max-w-3xl mx-auto mb-5">
                            <div className="flex flex-row gap-5 items-center">
                                <div className={`text-5xl font-semibold text-content`}>01</div>
                                <div className={`text-content font-medium lg:block ${currentStep === 1 ? '' : 'hidden'}`}>Basic <br />Information</div>
                            </div>

                            <div className="flex items-center hidden lg:flex">
                                <ArrowRight className="h-6 w-6 text-content" />
                            </div>

                            <div className="flex flex-row gap-5 items-center" style={{ opacity: currentStep < 2 ? 0.5 : 1 }}>
                                <div className={`text-5xl font-semibold text-content ${currentStep === 1 ? 'ms-20 lg:ms-0' : ''} ${currentStep < 4 ? 'transform-all duration-300 -translate-x-10 lg:translate-x-0' : ''}`}>02</div>
                                <div className={`text-content font-medium lg:block ${currentStep === 2 ? 'transform-all duration-300 -translate-x-10 lg:translate-x-0' : 'hidden'}`}>Tour <br />Package</div>
                            </div>
 
                            <div className={`flex items-center hidden lg:flex ${currentStep < 3 ? 'opacity-50' : ''}`}>
                                <ArrowRight className="h-6 w-6 text-content" />
                            </div>

                            <div className="flex flex-row gap-5 items-center" style={{ opacity: currentStep < 3 ? 0.5 : 1 }}>
                                <div className={`text-5xl font-semibold text-content ${currentStep === 3 ? 'transform-all duration-300 -translate-x-20 lg:translate-x-0' : ''}`}>03</div>
                                <div className={`text-content font-medium lg:block ${currentStep === 3 ? 'transform-all duration-300 -translate-x-20 lg:translate-x-0' : 'hidden'}`}>Details for <br />Contract</div>
                            </div>
                        </div>

                        {currentStep === 1 && (
                            <div className="tour-info-card-bg rounded-3xl p-6 max-w-3xl mx-auto">
                                <h2 className="text-xl font-bold text-content mb-2">Share Your Details & Let's Connect!</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label htmlFor="fullName" className="block text-blue-600 mb-2">
                                            Full name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="fullName"
                                            placeholder="What's your name?"
                                            className={`text-xs w-full bg-transparent border-b ${errors.fullName && touched.fullName ? 'border-red-500' : 'border-black'} py-2 placeholder-gray-400 focus:outline-none focus:border-blue-400`}
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                        />
                                        {errors.fullName && touched.fullName && (
                                            <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="organization" className="block text-blue-600 mb-2">
                                            University/Organization <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="organization"
                                            placeholder="Tell us what's on your mind!"
                                            className={`text-xs w-full bg-transparent border-b ${errors.organization && touched.organization ? 'border-red-500' : 'border-black'} py-2 placeholder-gray-400 focus:outline-none focus:border-blue-400`}
                                            value={formData.organization}
                                            onChange={handleInputChange}
                                        />
                                        {errors.organization && touched.organization && (
                                            <p className="text-red-500 text-xs mt-1">{errors.organization}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className="block text-blue-600 mb-2">
                                            Phone number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="phone"
                                            placeholder="Minimum 8 digits, maximum 15 digits"
                                            className={`text-xs w-full bg-transparent border-b ${errors.phone && touched.phone ? 'border-red-500' : 'border-black'} py-2 placeholder-gray-400 focus:outline-none focus:border-blue-400`}
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                        />
                                        {errors.phone && touched.phone && (
                                            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-blue-600 mb-2">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            placeholder="example@gmail.com"
                                            className={`text-xs w-full bg-transparent border-b ${errors.email && touched.email ? 'border-red-500' : 'border-black'} py-2 placeholder-gray-400 focus:outline-none focus:border-blue-400`}
                                            value={formData.email}
                                            onChange={handleInputChange}
                                        />
                                        {errors.email && touched.email && (
                                            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center mb-6">
                                    <Checkbox
                                        id="wantCallback"
                                        className="mr-2 mt-1 cursor-pointer data-[state=checked]:bg-blue-500"
                                        checked={formData.wantCallback}
                                        onCheckedChange={(checked) => handleCheckboxChange('wantCallback', checked)}
                                    />
                                    <label htmlFor="wantCallback" className="text-content font-medium text-xs pt-1 cursor-pointer">
                                        Check this box if you'd like to discuss any details - we're happy to schedule a call and answer your questions!
                                    </label>
                                </div>

                                <div className="flex justify-center">
                                    <button
                                        type="button"
                                        className="w-full md:w-auto bg-blue-500 hover:bg-blue-950 text-white text-sm font-semibold min-w-[130px] px-5 py-3 rounded-full group flex items-center justify-center transition-all duration-300 hover:translate-x-2 hover:min-w-[140px] cursor-pointer space-x-2"
                                        onClick={nextStep}
                                    >
                                        Next Step
                                        <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform duration-300" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="tour-info-card-bg rounded-3xl p-6 max-w-3xl mx-auto">
                                <h2 className="text-xl font-bold text-content mb-6">Tailor Your Tour</h2>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Tour Image */}
                                    <div className="md:col-span-1">
                                        <div className="relative rounded-xl overflow-hidden">
                                            <img
                                                src="/hero-banner-1.png"
                                                alt="Tour group"
                                                className="w-full h-auto"
                                            />
                                            <div className="absolute top-2 left-2 bg-white px-3 py-2 rounded-sm flex items-center text-xs">
                                                <span className="font-semibold mr-1 text-content">INCOMING</span>
                                                <span className="font-semibold text-content">• JULY 4</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tour Details */}
                                    <div className="md:col-span-2 space-y-4">
                                        <h3 className="text-xl font-bold text-content border-b-2 border-blue-200/70 pb-3">Tour Spring 2025</h3>

                                        <div className="flex items-center">
                                            <img src="/map-pin-blue-950.svg" className="h-5 w-5 mr-4 mt-1 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-bold uppercase text-content">LOCATION</p>
                                                <p className="text-xs text-content">Central Vietnam (Hue, Da Nang)</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center">
                                            <img src="/duration.svg" className="h-5 w-5 mr-4 mt-1 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-bold uppercase text-content">DURATION</p>
                                                <p className="text-xs text-content">We are aiming to visit 10 - 12 schools, in these 3 cities over 4 days.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Registration Options */}
                                <div className="mt-6 rounded-xl bg-white overflow-hidden">
                                    <div className="lg:grid grid-cols-4">
                                        <div className="p-3 bg-content text-white text-start font-semibold lg:border-r-3 border-white lg:col-span-3 text-sm">
                                            Registration
                                        </div>
                                        <div className="p-3 bg-content text-white text-start font-semibold lg:col-span-1 text-sm hidden lg:block">
                                            Returning University
                                        </div>
                                    </div>

                                    <div className="lg:grid grid-cols-4">
                                        <div className="p-3 lg:col-span-3">
                                            <div className="font-bold border-b-2 border-blue-200/70 text-content pb-3 text-md">Early Bird - 24 December 2024</div>
                                            <div className="my-3">
                                                <h4 className="font-bold text-content">Price include</h4>
                                                <ul className="m-3 text-sm list-disc list-inside text-content font-medium">
                                                    <li>9 - 11 school visits in 3 cities.</li>
                                                    <li>Support throughout the tour and school visits.</li>
                                                    <li>One stall at each school fair.</li>
                                                    <li>Reception dinner.</li>
                                                    <li>Refreshments and snacks between sessions.</li>
                                                    <li>Lunch, coffee and dinner on all 4 days (no dinner on final day).</li>
                                                    <li>Intra and inter city transport (in Hue, Danang and Tam Ky).</li>
                                                    <li>Hotel suggestions & discount.</li>
                                                </ul>
                                            </div>
                                            {/* Preferences */}
                                            <div className="my-1">
                                                <h4 className="font-bold text-content mb-4">Adjust everything to fit your preferences!</h4>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <p className="font-bold text-content text-sm mb-2">School Visits in Selected Cities</p>
                                                        <div className="space-y-2">
                                                            <div className="flex items-center">
                                                                <Checkbox
                                                                    id="hue"
                                                                    className="mr-2 cursor-pointer data-[state=checked]:bg-blue-500"
                                                                    checked={formData.cities.hue}
                                                                    onCheckedChange={(checked) => handleCityChange('hue', checked)}
                                                                />
                                                                <label htmlFor="hue" className="text-sm text-content font-medium cursor-pointer">Hue</label>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <Checkbox
                                                                    id="danang"
                                                                    className="mr-2 cursor-pointer data-[state=checked]:bg-blue-500"
                                                                    checked={formData.cities.danang}
                                                                    onCheckedChange={(checked) => handleCityChange('danang', checked)}
                                                                />
                                                                <label htmlFor="danang" className="text-sm text-content font-medium cursor-pointer">Danang</label>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <Checkbox
                                                                    id="tamKy"
                                                                    className="mr-2 cursor-pointer data-[state=checked]:bg-blue-500"
                                                                    checked={formData.cities.tamKy}
                                                                    onCheckedChange={(checked) => handleCityChange('tamKy', checked)}
                                                                />
                                                                <label htmlFor="tamKy" className="text-sm text-content font-medium cursor-pointer">Tam Ky/Hoi An</label>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <p className="font-bold text-content text-sm mb-2">Seamless Stay & City Transfers</p>
                                                        <div className="space-y-2">
                                                            <div className="flex items-center">
                                                                <Checkbox
                                                                    id="hotel"
                                                                    className="mr-2 cursor-pointer data-[state=checked]:bg-blue-500"
                                                                    checked={formData.transfers.hotel}
                                                                    onCheckedChange={(checked) => handleTransferChange('hotel', checked)}
                                                                />
                                                                <label htmlFor="hotel" className="text-sm text-content font-medium cursor-pointer">Hotel for 4 days</label>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <Checkbox
                                                                    id="travel"
                                                                    className="mr-2 cursor-pointer data-[state=checked]:bg-blue-500"
                                                                    checked={formData.transfers.travel}
                                                                    onCheckedChange={(checked) => handleTransferChange('travel', checked)}
                                                                />
                                                                <label htmlFor="travel" className="text-sm text-content font-medium cursor-pointer">Travel Between 3 Cities</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-4 lg:col-span-1 signup-form-bg flex items-center justify-center hidden lg:block">
                                            <div className="text-lg font-bold p-4 text-content">USD $1700</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Mobile display only */}
                                <div className="mt-5 rounded-xl signup-form-bg overflow-hidden lg:hidden">
                                    <div className="p-3 bg-content text-white text-start font-semibold text-sm">
                                        Returning University
                                    </div>
                                    <div className="px-3 py-4 lg:col-span-1 signup-form-bg flex items-center">
                                        <div className="text-lg font-bold text-content">USD $1700</div>
                                    </div>
                                </div>

                                <div className="mt-6 lg:mt-8 flex items-center justify-center gap-2">
                                    <button
                                        type="button"
                                        className="bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-50 text-sm font-semibold min-w-[100px] px-5 py-3 rounded-full transition-all duration-300 cursor-pointer flex items-center justify-center"
                                        onClick={prevStep}
                                    >
                                        Back
                                    </button>

                                    <button
                                        type="button"
                                        className="bg-blue-500 hover:bg-blue-950 text-white text-sm font-semibold min-w-[130px] px-5 py-3 rounded-full group flex items-center justify-center transition-all duration-300 hover:translate-x-2 hover:min-w-[140px] cursor-pointer space-x-2"
                                        onClick={nextStep}
                                    >
                                        Next Step
                                        <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform duration-300" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="tour-info-card-bg rounded-3xl p-6 max-w-3xl mx-auto">
                                <h2 className="text-lg font-bold text-content mb-2">Final Details for Your Tour</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label htmlFor="organization" className="block text-blue-600 mb-2">Organization</label>
                                        <input
                                            type="text"
                                            id="organization"
                                            value={formData.organization}
                                            readOnly
                                            className="text-xs w-full bg-transparent border-b border-black py-2 text-gray-700"
                                            placeholder="Autofill from form number 1"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="headOffice" className="block text-blue-600 mb-2">
                                            Head office address <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="headOffice"
                                            className={`text-xs w-full bg-transparent border-b ${errors.headOffice && touched.headOffice ? 'border-red-500' : 'border-black'} py-2 placeholder-gray-400 focus:outline-none focus:border-blue-400`}
                                            placeholder="Official address of your organization"
                                            value={formData.headOffice}
                                            onChange={handleInputChange}
                                        />
                                        {errors.headOffice && touched.headOffice && (
                                            <p className="text-red-500 text-xs mt-1">{errors.headOffice}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label htmlFor="businessRegistration" className="block text-blue-600 mb-2">
                                            Business registration number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="businessRegistration"
                                            className={`text-xs w-full bg-transparent border-b ${errors.businessRegistration && touched.businessRegistration ? 'border-red-500' : 'border-black'} py-2 placeholder-gray-400 focus:outline-none focus:border-blue-400`}
                                            placeholder="Your business registration number"
                                            value={formData.businessRegistration}
                                            onChange={handleInputChange}
                                        />
                                        {errors.businessRegistration && touched.businessRegistration && (
                                            <p className="text-red-500 text-xs mt-1">{errors.businessRegistration}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="legalRepresentative" className="block text-blue-600 mb-2">
                                            Legal representative <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="legalRepresentative"
                                            className={`text-xs w-full bg-transparent border-b ${errors.legalRepresentative && touched.legalRepresentative ? 'border-red-500' : 'border-black'} py-2 placeholder-gray-400 focus:outline-none focus:border-blue-400`}
                                            placeholder="Name of the authorized representative"
                                            value={formData.legalRepresentative}
                                            onChange={handleInputChange}
                                        />
                                        {errors.legalRepresentative && touched.legalRepresentative && (
                                            <p className="text-red-500 text-xs mt-1">{errors.legalRepresentative}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                    <div>
                                        <label htmlFor="position" className="block text-blue-600 mb-2">
                                            Position <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="position"
                                            className={`text-xs w-full bg-transparent border-b ${errors.position && touched.position ? 'border-red-500' : 'border-black'} py-2 placeholder-gray-400 focus:outline-none focus:border-blue-400`}
                                            placeholder="Your role within the organization"
                                            value={formData.position}
                                            onChange={handleInputChange}
                                        />
                                        {errors.position && touched.position && (
                                            <p className="text-red-500 text-xs mt-1">{errors.position}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className="block text-blue-600 mb-2">Phone</label>
                                        <input
                                            type="text"
                                            id="phone"
                                            value={formData.phone}
                                            readOnly
                                            className="text-xs w-full bg-transparent border-b border-black py-2 text-gray-700"
                                            placeholder="Minimum 8 digits, maximum 15 digits"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-blue-600 mb-2">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={formData.email}
                                            readOnly
                                            className="text-xs w-full bg-transparent border-b border-black py-2 text-gray-700"
                                            placeholder="example@gmail.com"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                    <div>
                                        <label htmlFor="accountNumber" className="block text-blue-600 mb-2">
                                            Company account number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="accountNumber"
                                            className={`text-xs w-full bg-transparent border-b ${errors.accountNumber && touched.accountNumber ? 'border-red-500' : 'border-black'} py-2 placeholder-gray-400 focus:outline-none focus:border-blue-400`}
                                            placeholder="Your company's account number"
                                            value={formData.accountNumber}
                                            onChange={handleInputChange}
                                        />
                                        {errors.accountNumber && touched.accountNumber && (
                                            <p className="text-red-500 text-xs mt-1">{errors.accountNumber}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="bank" className="block text-blue-600 mb-2">
                                            at bank <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="bank"
                                            className={`text-xs w-full bg-transparent border-b ${errors.bank && touched.bank ? 'border-red-500' : 'border-black'} py-2 placeholder-gray-400 focus:outline-none focus:border-blue-400`}
                                            placeholder="Where your company account is held"
                                            value={formData.bank}
                                            onChange={handleInputChange}
                                        />
                                        {errors.bank && touched.bank && (
                                            <p className="text-red-500 text-xs mt-1">{errors.bank}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="swift" className="block text-blue-600 mb-2">SWIFT (Optional)</label>
                                        <input
                                            type="text"
                                            id="swift"
                                            className="text-xs w-full bg-transparent border-b border-black py-2 placeholder-gray-400 focus:outline-none focus:border-blue-400"
                                            placeholder="SWIFT code"
                                            value={formData.swift}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 lg:mt-8 flex items-center justify-center gap-2">
                                    <button
                                        type="button"
                                        className="bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-50 text-sm font-semibold min-w-[100px] px-5 py-3 rounded-full transition-all duration-300 cursor-pointer flex items-center justify-center"
                                        onClick={prevStep}
                                    >
                                        Back
                                    </button>

                                    <button
                                        type="button"
                                        className="bg-blue-500 hover:bg-blue-950 text-white text-xs lg:text-sm font-semibold min-w-[130px] px-5 py-4 lg:py-3 rounded-full group flex items-center justify-center transition-all duration-300 hover:translate-x-2 hover:min-w-[140px] cursor-pointer space-x-2"
                                        onClick={handleSubmit}
                                    >
                                        Done! Let's Get Started
                                        <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform duration-300" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Decorative Image - Lower Right */}
                    <img
                        src="/vector-1.svg"
                        alt="Decorative element"
                        className="absolute bottom-15 lg:bottom-0 -right-50 lg:right-0 w-140 h-25 pointer-events-none -z-1"
                    />
                </div>
            </div>
        </div>
    );
}
