import { Navbar } from "@/components/Navbar";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import React from "react";
import { useContentStore } from "@/lib/contentStore";
import { ContentItem } from "@/lib/types";
import { processAllTemplates } from "@/utils/documentProcessor";

// Define types for form data
interface FormData {
    fullName: string;
    organization: string;
    phone: string;
    email: string;
    wantCallback: boolean;
    selectedPackage: string;
    cities: {
        hanoiHaiDuong: boolean;
        hueDaNang: boolean;
    };
    transfers: {
        hotel: boolean;
        travel: boolean;
        flight: boolean;
    };
    // Step 3 fields
    headOffice: string;
    businessRegistration: string;
    legalRepresentative: string;
    position: string;
    accountNumber: string;
    bank: string;
    swift: string;
    tourId: string;
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

// Define tour-specific data
interface TourData {
    id: string;
    title: string;
    date: string;
    image: string;
    location: string;
    duration: string;
    returnLink: string;
}

// Tour data mapping
const TOURS_DATA: Record<string, TourData> = {
    fallTour2025: {
        id: "fallTour2025",
        title: "Fall Tour 2025",
        date: "1 - 8 OCTOBER 2025",
        image: "/hero-banner-1.png",
        location: "Central Vietnam (Hue, Da Nang)",
        duration: "We are aiming to visit 10 - 12 schools, in these 3 cities over 4 days.",
        returnLink: "/tour-details"
    },
    springTour2026: {
        id: "springTour2026",
        title: "Spring Tour 2026",
        date: "31 MARCH - 10 APRIL 2026",
        image: "/hero-banner-2.png",
        location: "Northern Vietnam (Hanoi, Hai Duong)",
        duration: "10 schools across 3 northern cities over 5 days.",
        returnLink: "/spring-tour-details"
    }
};

// Helper function to get content item by ID
const getContentById = (items: ContentItem[] | undefined, id: string): string => {
    if (!items) return "";
    const item = items.find(item => item.id === id);
    return item ? item.content : "";
};

export default function SignUpForm() {
    const { tourId = "fallTour2025" } = useParams<{ tourId: string }>();
    const getPageContent = useContentStore(state => state.getPageContent);
    const [signUpFormContent, setSignUpFormContent] = useState(getPageContent('signup-form'));
    const [currentTour, setCurrentTour] = useState<TourData | null>(null);

    useEffect(() => {
        const content = getPageContent('signup-form');
        if (content) {
            setSignUpFormContent(content);
        }

        // Set the current tour data
        if (tourId && TOURS_DATA[tourId]) {
            setCurrentTour(TOURS_DATA[tourId]);

            // Update form data based on selected tour
            setFormData(prev => ({
                ...prev,
                tourId: tourId,
                // For Fall Tour (Central Vietnam), activate Hue & Da Nang
                // For Spring Tour (Northern Vietnam), activate Hanoi & Hai Duong
                cities: {
                    hanoiHaiDuong: tourId === 'springTour2026', // True for Spring Tour
                    hueDaNang: tourId === 'fallTour2025' // True for Fall Tour
                }
            }));
        } else {
            // Default to fall tour if not found
            setCurrentTour(TOURS_DATA.fallTour2025);
        }
    }, [getPageContent, tourId]);

    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isProcessingDocuments, setIsProcessingDocuments] = useState(false);
    const [, setDocumentProcessingComplete] = useState(false);
    const [processingError, setProcessingError] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormData>({
        fullName: "",
        organization: "",
        phone: "",
        email: "",
        wantCallback: false,
        selectedPackage: "earlyBird",
        cities: {
            hanoiHaiDuong: true,
            hueDaNang: true
        },
        transfers: {
            hotel: true,
            travel: true,
            flight: true
        },
        // Step 3 fields initialized with empty values
        headOffice: "",
        businessRegistration: "",
        legalRepresentative: "",
        position: "",
        accountNumber: "",
        bank: "",
        swift: "",
        tourId: tourId || "fallTour2025"
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

        console.log('Validating step 3 fields:', formData);

        if (!formData.headOffice.trim()) {
            newErrors.headOffice = "Head office address is required";
            isValid = false;
            console.log('Head office validation failed');
        }

        if (!formData.legalRepresentative.trim()) {
            newErrors.legalRepresentative = "Legal representative is required";
            isValid = false;
            console.log('Legal representative validation failed');
        }

        if (!formData.position.trim()) {
            newErrors.position = "Position is required";
            isValid = false;
            console.log('Position validation failed');
        }

        setErrors(newErrors);
        console.log('Step 3 validation result:', isValid ? 'Valid' : 'Invalid', newErrors);
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

    const handleSubmit = async () => {
        // Validate step 3 before submitting
        if (!validateStep3()) {
            // Mark all step 3 fields as touched to show errors
            setTouched({
                ...touched,
                headOffice: true,
                legalRepresentative: true,
                position: true
            });
            return;
        }

        // Pre-process data before submission to ensure valid formats
        const processedFormData = {
            ...formData,
            // Ensure phone and email are properly formatted 
            phone: formData.phone.trim(),
            email: formData.email.trim()
        };

        // Set processing state
        console.log('Starting submission process');
        setIsProcessingDocuments(true);
        setProcessingError(null);

        try {
            console.log('Beginning document processing with processed data:', processedFormData);
            // Process document templates with processed form data
            await processAllTemplates(processedFormData);
            console.log("Document templates processed successfully");

            // Log form submission for debugging
            console.log("Form submitted with data:", processedFormData);

            // Set document processing complete
            setDocumentProcessingComplete(true);

            // Set the form as submitted to show success screen
            setIsSubmitted(true);
        } catch (error: any) {
            console.error("Error processing document templates:", error);
            const errorMessage = error?.message || "An unknown error occurred";
            console.error("Error message:", errorMessage);

            // Show the error to the user
            setProcessingError(`An error occurred while processing your registration documents: ${errorMessage}. Please try again.`);

            // Don't set isSubmitted to true on error
            setIsProcessingDocuments(false);

            // Alert for debugging in case the console isn't visible
            alert(`Document processing failed: ${errorMessage}. Check the console for more details.`);
        }
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

                                <h1 className="text-4xl lg:text-5xl font-semibold text-content mb-6">
                                    {getContentById(signUpFormContent?.sections.successSection?.items, 'success-heading')}
                                </h1>

                                <p className="text-content font-medium mb-4 text-sm">
                                    {getContentById(signUpFormContent?.sections.successSection?.items, 'success-message')}
                                </p>

                                {processingError && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                                        <p className="text-red-800 font-medium text-sm">
                                            {processingError}
                                        </p>
                                        <button
                                            onClick={() => {
                                                setProcessingError(null);
                                                handleSubmit();
                                            }}
                                            className="mt-2 text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-xs font-medium"
                                        >
                                            Try Again
                                        </button>
                                    </div>
                                )}

                                <Link
                                    to="/our-tours"
                                    className="inline-flex w-full md:w-auto items-center justify-center bg-blue-500 hover:bg-blue-950 text-white px-8 py-3 rounded-full font-semibold group flex items-center justify-center transition-all duration-300 hover:translate-x-2 hover:min-w-[140px] cursor-pointer space-x-2"
                                >
                                    {getContentById(signUpFormContent?.sections.successSection?.items, 'success-button')}
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
                            <Link to={currentTour?.returnLink || "/tour-details"} className="flex items-center text-blue-600 hover:text-blue-800 font-semibold text-sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                View Tour Information Again
                            </Link>
                        </div>

                        <h1 className="text-4xl font-semibold text-center text-content mb-4">
                            {getContentById(signUpFormContent?.sections.headerSection?.items, 'signup-header-title')}
                        </h1>

                        <p className="text-center text-content font-medium text-sm mb-5 max-w-3xl mx-auto lg:px-4">
                            {getContentById(signUpFormContent?.sections.headerSection?.items, 'signup-header-description')}
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
                                <h2 className="text-xl font-bold text-content mb-2">
                                    {getContentById(signUpFormContent?.sections.step1Section?.items, 'step1-heading')}
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label htmlFor="fullName" className="block text-blue-600 mb-2">
                                            {getContentById(signUpFormContent?.sections.step1Section?.items, 'step1-fullname-label')} <span className="text-red-500">*</span>
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
                                            {getContentById(signUpFormContent?.sections.step1Section?.items, 'step1-organization-label')} <span className="text-red-500">*</span>
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
                                            {getContentById(signUpFormContent?.sections.step1Section?.items, 'step1-phone-label')} <span className="text-red-500">*</span>
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
                                            {getContentById(signUpFormContent?.sections.step1Section?.items, 'step1-email-label')} <span className="text-red-500">*</span>
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
                                        {getContentById(signUpFormContent?.sections.step1Section?.items, 'step1-callback-label')}
                                    </label>
                                </div>

                                <div className="flex justify-center">
                                    <button
                                        type="button"
                                        className="w-full md:w-auto bg-blue-500 hover:bg-blue-950 text-white text-sm font-semibold min-w-[130px] px-5 py-3 rounded-full group flex items-center justify-center transition-all duration-300 hover:translate-x-2 hover:min-w-[140px] cursor-pointer space-x-2"
                                        onClick={nextStep}
                                    >
                                        {getContentById(signUpFormContent?.sections.step1Section?.items, 'step1-next-button')}
                                        <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform duration-300" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="tour-info-card-bg rounded-3xl p-6 max-w-3xl mx-auto">
                                <h2 className="text-xl font-bold text-content mb-6">
                                    {getContentById(signUpFormContent?.sections.step2Section?.items, 'step2-heading')}
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Tour Image */}
                                    <div className="md:col-span-1">
                                        <div className="relative rounded-xl overflow-hidden">
                                            <img
                                                src={currentTour?.image || "/hero-banner-1.png"}
                                                alt="Tour group"
                                                className="w-full h-auto"
                                            />
                                            <div className="absolute top-2 left-2 bg-white px-3 py-2 rounded-sm flex items-center text-xs">
                                                <span className="font-semibold mr-1 text-content">
                                                    {currentTour?.date || getContentById(signUpFormContent?.sections.step2Section?.items, 'step2-tour-date')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tour Details */}
                                    <div className="md:col-span-2 space-y-4">
                                        <h3 className="text-xl font-bold text-content border-b-2 border-blue-200/70 pb-3">
                                            {currentTour?.title || getContentById(signUpFormContent?.sections.step2Section?.items, 'step2-tour-title')}
                                        </h3>

                                        <div className="flex items-center">
                                            <img src="/map-pin-blue-950.svg" className="h-5 w-5 mr-4 mt-1 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-bold uppercase text-content">
                                                    {getContentById(signUpFormContent?.sections.step2Section?.items, 'step2-location-title')}
                                                </p>
                                                <p className="text-xs text-content">
                                                    {currentTour?.location || getContentById(signUpFormContent?.sections.step2Section?.items, 'step2-location-content')}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center">
                                            <img src="/duration.svg" className="h-5 w-5 mr-4 mt-1 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-bold uppercase text-content">
                                                    {getContentById(signUpFormContent?.sections.step2Section?.items, 'step2-duration-title')}
                                                </p>
                                                <p className="text-xs text-content">
                                                    {currentTour?.duration || getContentById(signUpFormContent?.sections.step2Section?.items, 'step2-duration-content')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Registration Options */}
                                <div className="mt-6 rounded-xl bg-white overflow-hidden">
                                    <div className="lg:grid grid-cols-4">
                                        <div className="p-3 bg-content text-white text-start font-semibold lg:border-r-3 border-white lg:col-span-3 text-sm">
                                            {getContentById(signUpFormContent?.sections.step2Section?.items, 'step2-registration-title')}
                                        </div>
                                        <div className="p-3 bg-content text-white text-start font-semibold lg:col-span-1 text-sm hidden lg:block">
                                            {getContentById(signUpFormContent?.sections.step2Section?.items, 'step2-returning-title')}
                                        </div>
                                    </div>

                                    <div className="lg:grid grid-cols-4">
                                        <div className="p-3 lg:col-span-3">
                                            <div className="font-bold border-b-2 border-blue-200/70 text-content pb-3 text-md">
                                                {getContentById(signUpFormContent?.sections.step2Section?.items, 'step2-earlybird-title')}
                                            </div>
                                            <div className="my-3">
                                                <h4 className="font-bold text-content">
                                                    {getContentById(signUpFormContent?.sections.step2Section?.items, 'step2-include-title')}
                                                </h4>
                                                <ul className="m-3 text-sm list-disc list-inside text-content font-medium">
                                                    {getContentById(signUpFormContent?.sections.step2Section?.items, 'step2-include-list')
                                                        .split('\n')
                                                        .map((item, index) => (
                                                            <li key={index}>{item}</li>
                                                        ))
                                                    }
                                                </ul>
                                            </div>
                                            {/* Preferences */}
                                            <div className="my-1">
                                                <h4 className="font-bold text-content mb-4">
                                                    {getContentById(signUpFormContent?.sections.step2Section?.items, 'step2-preferences-title')}
                                                </h4>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <p className="font-bold text-content text-sm mb-2">
                                                            {getContentById(signUpFormContent?.sections.step2Section?.items, 'step2-cities-title')}
                                                        </p>
                                                        <div className="space-y-2">
                                                            <div className="flex items-center">
                                                                <Checkbox
                                                                    id="hanoiHaiDuong"
                                                                    className="mr-2 cursor-pointer data-[state=checked]:bg-blue-500"
                                                                    checked={formData.cities.hanoiHaiDuong}
                                                                    onCheckedChange={(checked) => handleCityChange('hanoiHaiDuong', checked)}
                                                                />
                                                                <label htmlFor="hanoiHaiDuong" className="text-sm text-content font-medium cursor-pointer">
                                                                    {getContentById(signUpFormContent?.sections.step2Section?.items, 'step2-hanoiHaiDuong-label') || "Ha Noi & Hai Duong"}
                                                                </label>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <Checkbox
                                                                    id="hueDaNang"
                                                                    className="mr-2 cursor-pointer data-[state=checked]:bg-blue-500"
                                                                    checked={formData.cities.hueDaNang}
                                                                    onCheckedChange={(checked) => handleCityChange('hueDaNang', checked)}
                                                                />
                                                                <label htmlFor="hueDaNang" className="text-sm text-content font-medium cursor-pointer">
                                                                    {getContentById(signUpFormContent?.sections.step2Section?.items, 'step2-hueDaNang-label') || "Hue & Da Nang"}
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <p className="font-bold text-content text-sm mb-2">
                                                            {getContentById(signUpFormContent?.sections.step2Section?.items, 'step2-transfers-title')}
                                                        </p>
                                                        <div className="space-y-2">
                                                            <div className="flex items-center">
                                                                <Checkbox
                                                                    id="hotel"
                                                                    className="mr-2 cursor-pointer data-[state=checked]:bg-blue-500"
                                                                    checked={formData.transfers.hotel}
                                                                    onCheckedChange={(checked) => handleTransferChange('hotel', checked)}
                                                                />
                                                                <label htmlFor="hotel" className="text-sm text-content font-medium cursor-pointer">
                                                                    {getContentById(signUpFormContent?.sections.step2Section?.items, 'step2-hotel-label') || "Accommodation for Northern Vietnam tour"}
                                                                </label>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <Checkbox
                                                                    id="travel"
                                                                    className="mr-2 cursor-pointer data-[state=checked]:bg-blue-500"
                                                                    checked={formData.transfers.travel}
                                                                    onCheckedChange={(checked) => handleTransferChange('travel', checked)}
                                                                />
                                                                <label htmlFor="travel" className="text-sm text-content font-medium cursor-pointer">
                                                                    {getContentById(signUpFormContent?.sections.step2Section?.items, 'step2-travel-label') || "Accommodation for Central Vietnam tour"}
                                                                </label>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <Checkbox
                                                                    id="flight"
                                                                    className="mr-2 cursor-pointer data-[state=checked]:bg-blue-500"
                                                                    checked={formData.transfers.flight}
                                                                    onCheckedChange={(checked) => handleTransferChange('flight', checked)}
                                                                />
                                                                <label htmlFor="flight" className="text-sm text-content font-medium cursor-pointer">
                                                                    {getContentById(signUpFormContent?.sections.step2Section?.items, 'step2-flight-label') || "One way flight from Hanoi (Northern Vietnam) to Hue (Central Vietnam)"}
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-4 lg:col-span-1 signup-form-bg flex items-center justify-center hidden lg:block">
                                            <div className="text-lg font-bold p-4 text-content">
                                                {getContentById(signUpFormContent?.sections.step2Section?.items, 'step2-price')}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Mobile display only */}
                                <div className="mt-5 rounded-xl signup-form-bg overflow-hidden lg:hidden">
                                    <div className="p-3 bg-content text-white text-start font-semibold text-sm">
                                        {getContentById(signUpFormContent?.sections.step2Section?.items, 'step2-returning-title')}
                                    </div>
                                    <div className="px-3 py-4 lg:col-span-1 signup-form-bg flex items-center">
                                        <div className="text-lg font-bold text-content">
                                            {getContentById(signUpFormContent?.sections.step2Section?.items, 'step2-price')}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 lg:mt-8 flex items-center justify-center gap-2">
                                    <button
                                        type="button"
                                        className="bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-50 text-sm font-semibold min-w-[100px] px-5 py-3 rounded-full transition-all duration-300 cursor-pointer flex items-center justify-center"
                                        onClick={prevStep}
                                    >
                                        {getContentById(signUpFormContent?.sections.step2Section?.items, 'step2-back-button')}
                                    </button>

                                    <button
                                        type="button"
                                        className="bg-blue-500 hover:bg-blue-950 text-white text-sm font-semibold min-w-[130px] px-5 py-3 rounded-full group flex items-center justify-center transition-all duration-300 hover:translate-x-2 hover:min-w-[140px] cursor-pointer space-x-2"
                                        onClick={nextStep}
                                    >
                                        {getContentById(signUpFormContent?.sections.step2Section?.items, 'step2-next-button')}
                                        <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform duration-300" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="tour-info-card-bg rounded-3xl p-6 max-w-3xl mx-auto">
                                <h2 className="text-lg font-bold text-content mb-2">
                                    {getContentById(signUpFormContent?.sections.step3Section?.items, 'step3-heading')}
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label htmlFor="organization" className="block text-blue-600 mb-2">
                                            {getContentById(signUpFormContent?.sections.step3Section?.items, 'step3-organization-label')}
                                        </label>
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
                                            {getContentById(signUpFormContent?.sections.step3Section?.items, 'step3-headoffice-label')} <span className="text-red-500">*</span>
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

                                <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-6">
                                    <div>
                                        <label htmlFor="legalRepresentative" className="block text-blue-600 mb-2">
                                            {getContentById(signUpFormContent?.sections.step3Section?.items, 'step3-representative-label')} <span className="text-red-500">*</span>
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

                                    {/* <div>
                                        <label htmlFor="businessRegistration" className="block text-blue-600 mb-2">
                                            {getContentById(signUpFormContent?.sections.step3Section?.items, 'step3-registration-label')} <span className="text-gray-500 text-xs">(optional)</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="businessRegistration"
                                            className={`text-xs w-full bg-transparent border-b ${errors.businessRegistration && touched.businessRegistration ? 'border-red-500' : 'border-black'} py-2 placeholder-gray-400 focus:outline-none focus:border-blue-400`}
                                            placeholder="Business registration number"
                                            value={formData.businessRegistration}
                                            onChange={handleInputChange}
                                        />
                                        {errors.businessRegistration && touched.businessRegistration && (
                                            <p className="text-red-500 text-xs mt-1">{errors.businessRegistration}</p>
                                        )}
                                    </div> */}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                    <div>
                                        <label htmlFor="position" className="block text-blue-600 mb-2">
                                            {getContentById(signUpFormContent?.sections.step3Section?.items, 'step3-position-label')} <span className="text-red-500">*</span>
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
                                        <label htmlFor="phone" className="block text-blue-600 mb-2">
                                            {getContentById(signUpFormContent?.sections.step3Section?.items, 'step3-phone-label')}
                                        </label>
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
                                        <label htmlFor="email" className="block text-blue-600 mb-2">
                                            {getContentById(signUpFormContent?.sections.step3Section?.items, 'step3-email-label')}
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={formData.email}
                                            readOnly
                                            className="text-xs w-full bg-transparent border-b border-black py-2 text-gray-700"
                                            placeholder="example@gmail.com"
                                        />
                                    </div>

                                    {/* <div>
                                        <label htmlFor="accountNumber" className="block text-blue-600 mb-2">
                                            {getContentById(signUpFormContent?.sections.step3Section?.items, 'step3-account-label')} <span className="text-gray-500 text-xs">(optional)</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="accountNumber"
                                            className={`text-xs w-full bg-transparent border-b ${errors.accountNumber && touched.accountNumber ? 'border-red-500' : 'border-black'} py-2 placeholder-gray-400 focus:outline-none focus:border-blue-400`}
                                            placeholder="Account number"
                                            value={formData.accountNumber}
                                            onChange={handleInputChange}
                                        />
                                        {errors.accountNumber && touched.accountNumber && (
                                            <p className="text-red-500 text-xs mt-1">{errors.accountNumber}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="bank" className="block text-blue-600 mb-2">
                                            {getContentById(signUpFormContent?.sections.step3Section?.items, 'step3-bank-label')} <span className="text-gray-500 text-xs">(optional)</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="bank"
                                            className={`text-xs w-full bg-transparent border-b ${errors.bank && touched.bank ? 'border-red-500' : 'border-black'} py-2 placeholder-gray-400 focus:outline-none focus:border-blue-400`}
                                            placeholder="Bank name"
                                            value={formData.bank}
                                            onChange={handleInputChange}
                                        />
                                        {errors.bank && touched.bank && (
                                            <p className="text-red-500 text-xs mt-1">{errors.bank}</p>
                                        )}
                                    </div> */}
                                </div>

                                <div className="mt-6 lg:mt-8 flex items-center justify-center gap-2">
                                    <button
                                        type="button"
                                        className="bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-50 text-sm font-semibold min-w-[100px] px-5 py-3 rounded-full transition-all duration-300 cursor-pointer flex items-center justify-center"
                                        onClick={prevStep}
                                    >
                                        {getContentById(signUpFormContent?.sections.step3Section?.items, 'step3-back-button')}
                                    </button>

                                    <button
                                        type="button"
                                        className="bg-blue-500 hover:bg-blue-950 text-white text-xs lg:text-sm font-semibold min-w-[130px] px-5 py-4 lg:py-3 rounded-full group flex items-center justify-center transition-all duration-300 hover:translate-x-2 hover:min-w-[140px] cursor-pointer space-x-2"
                                        onClick={handleSubmit}
                                        disabled={isProcessingDocuments}
                                    >
                                        {isProcessingDocuments ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                {getContentById(signUpFormContent?.sections.step3Section?.items, 'step3-submit-button')}
                                                <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform duration-300" />
                                            </>
                                        )}
                                    </button>

                                    {/* Temporary debug button - remove in production */}
                                    {/* <button
                                        type="button"
                                        className="bg-red-500 hover:bg-red-700 text-white text-xs px-3 py-2 rounded-md"
                                        onClick={() => {
                                            console.log("Testing docx libraries...");
                                            try {
                                                alert(`Libraries check: PizZip (${typeof PizZip}), Docxtemplater (${typeof Docxtemplater}), saveAs (${typeof saveAs})`);
                                                
                                                // Log the current form data
                                                console.log("Current form data:", formData);
                                                
                                                // Test file fetch
                                                fetch('/VN_template.docx')
                                                    .then(response => {
                                                        if (!response.ok) {
                                                            throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
                                                        }
                                                        return response.arrayBuffer();
                                                    })
                                                    .then(data => {
                                                        console.log("Template fetch successful:", data.byteLength, "bytes");
                                                        alert(`Template fetch successful: ${data.byteLength} bytes`);
                                                        
                                                        // Analyze template content
                                                        try {
                                                            const zip = new PizZip(data);
                                                            const doc = zip.files['word/document.xml'];
                                                            if (doc) {
                                                                const content = doc.asText();
                                                                const placeholders = content.match(/\[([^\]]+)\]/g);
                                                                if (placeholders && placeholders.length > 0) {
                                                                    const uniquePlaceholders = [...new Set(placeholders)].map(p => p.replace(/\[|\]/g, ''));
                                                                    console.log('Found placeholders:', uniquePlaceholders);
                                                                    alert('Found placeholders: ' + uniquePlaceholders.join(', '));
                                                                } else {
                                                                    console.log('No [placeholders] found in standard format');
                                                                    alert('No [placeholders] found in standard format');
                                                                }
                                                            }
                                                        } catch (e: any) {
                                                            console.error('Error analyzing template:', e);
                                                            alert('Error analyzing template: ' + e.message);
                                                        }
                                                    })
                                                    .catch(error => {
                                                        console.error("Fetch error:", error);
                                                        alert(`Fetch error: ${error.message}`);
                                                    });
                                                    
                                                // Also test the Invoice template
                                                fetch('/IUC_Invoice VAT_UNIVERSITY_template.docx')
                                                    .then(response => {
                                                        if (!response.ok) {
                                                            throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
                                                        }
                                                        return response.arrayBuffer();
                                                    })
                                                    .then(data => {
                                                        console.log("Invoice template fetch successful:", data.byteLength, "bytes");
                                                        
                                                        // Analyze template content
                                                        try {
                                                            const zip = new PizZip(data);
                                                            const doc = zip.files['word/document.xml'];
                                                            if (doc) {
                                                                const content = doc.asText();
                                                                const placeholders = content.match(/\[([^\]]+)\]/g);
                                                                if (placeholders && placeholders.length > 0) {
                                                                    const uniquePlaceholders = [...new Set(placeholders)].map(p => p.replace(/\[|\]/g, ''));
                                                                    console.log('Invoice template placeholders:', uniquePlaceholders);
                                                                    alert('Invoice template placeholders: ' + uniquePlaceholders.join(', '));
                                                                } else {
                                                                    console.log('No [placeholders] found in Invoice template');
                                                                    alert('No [placeholders] found in Invoice template');
                                                                }
                                                            }
                                                        } catch (e: any) {
                                                            console.error('Error analyzing invoice template:', e);
                                                        }
                                                    })
                                                    .catch(error => {
                                                        console.error("Invoice fetch error:", error);
                                                    });
                                            } catch (error: any) {
                                                console.error("Debug test error:", error);
                                                alert(`Test error: ${error.message}`);
                                            }
                                        }}
                                    >
                                        Test Templates
                                    </button> */}
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
