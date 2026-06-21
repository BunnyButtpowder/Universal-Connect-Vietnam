import { Navbar } from "@/components/Navbar";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { useContentStore } from "@/lib/contentStore";
import { toursApi, TourFull, contactApi } from "@/lib/api";
import { generateTourDetailsUrl, isTourPreRegister } from "@/lib/utils";
import { toast } from "sonner";

interface PreRegisterFormData {
    fullName: string;
    organization: string;
    phone: string;
    email: string;
    position: string;
    anyQuestions: string;
    wantCallback: boolean;
}

interface ValidationErrors {
    fullName?: string;
    organization?: string;
    phone?: string;
    email?: string;
    position?: string;
}

const emptyForm = (): PreRegisterFormData => ({
    fullName: "",
    organization: "",
    phone: "",
    email: "",
    position: "",
    anyQuestions: "",
    wantCallback: false
});

export default function PreRegisterForm() {
    const { slug } = useParams<{ slug: string }>();
    const getPageContent = useContentStore((state) => state.getPageContent);
    const [signUpFormContent] = useState(getPageContent("signup-form"));

    const [currentTour, setCurrentTour] = useState<TourFull | undefined>(undefined);
    const [isLoadingTour, setIsLoadingTour] = useState(true);
    const [tourError, setTourError] = useState<string | null>(null);
    const [formData, setFormData] = useState<PreRegisterFormData>(emptyForm);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const getContentById = (
        items: { id: string; content: string }[] | undefined,
        id: string
    ): string => items?.find((item) => item.id === id)?.content || "";

    useEffect(() => {
        const loadTour = async () => {
            if (!slug) {
                setTourError("No tour slug provided");
                setIsLoadingTour(false);
                return;
            }

            try {
                setIsLoadingTour(true);
                setTourError(null);
                const tourData = await toursApi.getBySlug(slug);
                if (!isTourPreRegister(tourData)) {
                    setTourError("This tour is not open for pre-registration");
                    return;
                }
                setCurrentTour(tourData);
            } catch {
                setTourError("Failed to load tour information");
            } finally {
                setIsLoadingTour(false);
            }
        };

        loadTour();
    }, [slug]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
        setTouched((prev) => ({ ...prev, [id]: true }));
    };

    const handleCheckboxChange = (checked: boolean | "indeterminate") => {
        setFormData((prev) => ({
            ...prev,
            wantCallback: checked === "indeterminate" ? false : !!checked
        }));
    };

    const validate = (): boolean => {
        const newErrors: ValidationErrors = {};
        let isValid = true;

        if (!formData.fullName.trim()) {
            newErrors.fullName = "Full name is required";
            isValid = false;
        }
        if (!formData.organization.trim()) {
            newErrors.organization = "University/Organization is required";
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
        if (!formData.position.trim()) {
            newErrors.position = "Position is required";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async () => {
        setTouched({
            fullName: true,
            organization: true,
            phone: true,
            email: true,
            position: true
        });

        if (!validate() || !currentTour) return;

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            await contactApi.submitPreRegistration(
                {
                    fullName: formData.fullName.trim(),
                    organization: formData.organization.trim(),
                    phone: formData.phone.trim(),
                    email: formData.email.trim(),
                    position: formData.position.trim(),
                    anyQuestions: formData.anyQuestions.trim(),
                    wantCallback: formData.wantCallback,
                    tourId: currentTour.id
                },
                currentTour.title
            );
            setIsSubmitted(true);
            toast.success("Pre-registration submitted successfully!");
        } catch (error: unknown) {
            const message =
                error instanceof Error ? error.message : "An unknown error occurred";
            setSubmitError(message);
            toast.error(`Pre-registration failed: ${message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoadingTour) {
        return (
            <div>
                <Navbar />
                <div className="flex items-center justify-center min-h-[60vh] mt-20">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    if (tourError || !currentTour) {
        return (
            <div>
                <Navbar />
                <div className="flex items-center justify-center min-h-[60vh] mt-20 px-4">
                    <p className="text-red-600">{tourError || "Tour not found"}</p>
                </div>
            </div>
        );
    }

    if (isSubmitted) {
        return (
            <div>
                <Navbar />
                <div className="mt-20 px-4 pb-20">
                    <div className="max-w-lg mx-auto text-center py-16">
                        <img
                            src="/party-popper.png"
                            alt="Success"
                            className="w-48 h-48 mx-auto mb-6"
                        />
                        <h1 className="text-3xl font-semibold text-content mb-4">
                            Thank you for your interest!
                        </h1>
                        <p className="text-content font-medium text-sm mb-8">
                            We&apos;ve received your pre-registration details for{" "}
                            <strong>{currentTour.title}</strong>. We&apos;ll notify you as soon
                            as registration opens.
                        </p>
                        <Link
                            to={generateTourDetailsUrl(currentTour.title)}
                            className="inline-flex bg-blue-500 hover:bg-blue-950 text-white px-8 py-3 rounded-full font-semibold"
                        >
                            Back to tour details
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const tourTitle = currentTour.title;

    return (
        <div>
            <Navbar />
            <div className="mt-20 px-4 lg:px-20 pb-20 overflow-hidden relative">
                <img
                    src="/vector.svg"
                    alt=""
                    className="absolute -top-3 lg:top-10 left-0 lg:-left-20 max-w-none w-[200%] lg:w-300 h-[180px] lg:h-70 pointer-events-none -z-1"
                />

                <div className="relative w-full h-auto mt-16 lg:mt-0 mb-10">
                    <div className="flex justify-center mb-4">
                        <Link
                            to={generateTourDetailsUrl(tourTitle)}
                            className="flex items-center text-blue-600 hover:text-blue-800 font-semibold text-sm"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            View Tour Information Again
                        </Link>
                    </div>

                    <h1 className="text-4xl font-semibold text-center text-content mb-4">
                        Pre-register For {tourTitle}
                    </h1>

                    <p className="text-center text-content font-medium text-sm mb-8 max-w-3xl mx-auto lg:px-4">
                        Submit your details here and we&apos;ll notify you as soon as
                        registration opens.
                    </p>

                    <div className="tour-info-card-bg rounded-3xl p-6 max-w-3xl mx-auto">
                        <h2 className="text-xl font-bold text-content mb-2">
                            {getContentById(
                                signUpFormContent?.sections.step1Section?.items,
                                "step1-heading"
                            )}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label htmlFor="fullName" className="block text-blue-600 mb-2">
                                    {getContentById(
                                        signUpFormContent?.sections.step1Section?.items,
                                        "step1-fullname-label"
                                    )}{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="fullName"
                                    placeholder="What's your name?"
                                    className={`text-xs w-full bg-transparent border-b ${errors.fullName && touched.fullName ? "border-red-500" : "border-black"} py-2 placeholder-gray-400 focus:outline-none focus:border-blue-400`}
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                />
                                {errors.fullName && touched.fullName && (
                                    <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="organization" className="block text-blue-600 mb-2">
                                    {getContentById(
                                        signUpFormContent?.sections.step1Section?.items,
                                        "step1-organization-label"
                                    )}{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="organization"
                                    placeholder="Your university or organization"
                                    className={`text-xs w-full bg-transparent border-b ${errors.organization && touched.organization ? "border-red-500" : "border-black"} py-2 placeholder-gray-400 focus:outline-none focus:border-blue-400`}
                                    value={formData.organization}
                                    onChange={handleInputChange}
                                />
                                {errors.organization && touched.organization && (
                                    <p className="text-red-500 text-xs mt-1">{errors.organization}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-blue-600 mb-2">
                                    {getContentById(
                                        signUpFormContent?.sections.step1Section?.items,
                                        "step1-phone-label"
                                    )}{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="phone"
                                    placeholder="Minimum 8 digits, maximum 15 digits"
                                    className={`text-xs w-full bg-transparent border-b ${errors.phone && touched.phone ? "border-red-500" : "border-black"} py-2 placeholder-gray-400 focus:outline-none focus:border-blue-400`}
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                />
                                {errors.phone && touched.phone && (
                                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-blue-600 mb-2">
                                    {getContentById(
                                        signUpFormContent?.sections.step1Section?.items,
                                        "step1-email-label"
                                    )}{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="example@gmail.com"
                                    className={`text-xs w-full bg-transparent border-b ${errors.email && touched.email ? "border-red-500" : "border-black"} py-2 placeholder-gray-400 focus:outline-none focus:border-blue-400`}
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                                {errors.email && touched.email && (
                                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="position" className="block text-blue-600 mb-2">
                                    {getContentById(
                                        signUpFormContent?.sections.step3Section?.items,
                                        "step3-position-label"
                                    )}{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="position"
                                    placeholder="Your role at the university"
                                    className={`text-xs w-full bg-transparent border-b ${errors.position && touched.position ? "border-red-500" : "border-black"} py-2 placeholder-gray-400 focus:outline-none focus:border-blue-400`}
                                    value={formData.position}
                                    onChange={handleInputChange}
                                />
                                {errors.position && touched.position && (
                                    <p className="text-red-500 text-xs mt-1">{errors.position}</p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="anyQuestions" className="block text-blue-600 mb-2">
                                    Any questions
                                </label>
                                <textarea
                                    id="anyQuestions"
                                    rows={4}
                                    placeholder="Let us know if you have any questions..."
                                    className="text-xs w-full bg-transparent border border-black/30 rounded-lg p-3 placeholder-gray-400 focus:outline-none focus:border-blue-400 resize-y min-h-[100px]"
                                    value={formData.anyQuestions}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="flex items-center mb-6">
                            <Checkbox
                                id="wantCallback"
                                className="mr-2 mt-1 cursor-pointer data-[state=checked]:bg-blue-500"
                                checked={formData.wantCallback}
                                onCheckedChange={handleCheckboxChange}
                            />
                            <label
                                htmlFor="wantCallback"
                                className="text-content font-medium text-xs pt-1 cursor-pointer"
                            >
                                {getContentById(
                                    signUpFormContent?.sections.step1Section?.items,
                                    "step1-callback-label"
                                )}
                            </label>
                        </div>

                        <div className="flex flex-col items-center">
                            {submitError && (
                                <p className="text-red-500 text-sm text-center mb-4">{submitError}</p>
                            )}
                            <button
                                type="button"
                                disabled={isSubmitting}
                                className="w-full md:w-auto bg-blue-500 hover:bg-blue-950 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold min-w-[130px] px-5 py-3 rounded-full group flex items-center justify-center transition-all duration-300 hover:translate-x-2 hover:min-w-[140px] cursor-pointer space-x-2"
                                onClick={handleSubmit}
                            >
                                {isSubmitting ? "Submitting..." : "Pre-register"}
                                {!isSubmitting && (
                                    <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform duration-300" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
