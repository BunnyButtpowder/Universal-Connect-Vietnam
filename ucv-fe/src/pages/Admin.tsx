import { AdminNavbar } from '@/components/admin/AdminNavbar';
import { Link } from 'react-router-dom';

export default function Admin() {
    const pages = [
        { name: 'Home', path: '/admin/home', description: 'Edit hero banner, about us section, statistics, and more' },
        { name: 'About Us', path: '/admin/about-us', description: 'Update company information, history, and team details' },
        { name: 'Our Tours', path: '/admin/our-tours', description: 'Manage tour listings, categories, and featured tours' },
        { name: 'Tour Details', path: '/admin/tour-details', description: 'Edit individual tour descriptions, itineraries, and pricing' },
        { name: 'Sign Up Form', path: '/admin/signup-form', description: 'Edit the sign up form content' },
        { name: 'Translations', path: '/admin/translations', description: 'Manage Vietnamese translations for all website content' },
    ];

    return (
        <div>
            <AdminNavbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">UCV Admin Panel</h1>
                    <p className="mt-2 text-gray-600">
                        Welcome to the content management system. Select a page to edit its content.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {pages.map((page) => (
                        <Link 
                            key={page.path}
                            to={page.path} 
                            className="block bg-white overflow-hidden rounded-lg shadow hover:shadow-md transition-shadow duration-300"
                        >
                            <div className="p-5">
                                <h3 className="text-lg font-medium text-blue-600">{page.name}</h3>
                                <p className="mt-2 text-sm text-gray-500">{page.description}</p>
                                <div className="mt-4 flex items-center">
                                    <span className="text-sm font-medium text-blue-600">
                                        Edit Content
                                    </span>
                                    <svg 
                                        className="ml-1 w-4 h-4 text-blue-600" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24" 
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
