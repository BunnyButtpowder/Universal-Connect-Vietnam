import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Menu, X, Phone, Mail } from "lucide-react"
import { LanguageSelector } from "./LanguageSelector"
import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/LanguageContext"

export function Navbar() {
  // State to track active navigation item
  const [activeItem, setActiveItem] = useState<string>('')
  const { t } = useLanguage()

  // Check the current pathname on initial load and when it changes
  useEffect(() => {
    const pathname = window.location.pathname
    if (pathname === '/our-tours') {
      setActiveItem('our-tours')
    } else if (pathname === '/about-us') {
      setActiveItem('about-us')
    } else if (pathname === '/') {
      setActiveItem('home')
    }
  }, [])

  // Add scroll function
  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveItem('contact');
    const contactSection = document.getElementById('contact-section');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="w-full fixed top-0 z-50 bg-white/90 backdrop-blur-sm">
      <div className="px-4 sm:px-6 lg:px-20 flex items-center justify-between py-2">
        {/* Logo Section */}
        <div className="w-[200px]">
          <a 
            href="/" 
            className="flex items-center gap-2"
            onClick={() => setActiveItem('home')}
          >
            <img
              src="/ucv-logo.svg"
              alt="UCV Logo"
              width={40}
              height={40}
              className="h-14 w-auto"
            />
            <div className="flex flex-col ps-2">
              <span className="text-xs font-bold text-content">UNIVERSAL</span>
              <span className="text-xs font-bold text-content">CONNECT</span>
              <span className="text-xs font-bold text-content">VN</span>
            </div>
          </a>
        </div>

        {/* Desktop Navigation Links */}
        <NavigationMenu className="absolute left-1/2 transform -translate-x-1/2">
          <NavigationMenuList className="hidden lg:flex gap-4">
            <NavigationMenuItem>
              <a 
                href="/our-tours" 
                className={`text-base font-medium ${activeItem === 'our-tours' ? 'text-blue-500 bg-blue-500/10' : 'text-blue-950 hover:text-blue-500 hover:bg-blue-500/10'} transition-all duration-300 px-7 py-3 rounded-md cursor-pointer`}
                onClick={() => setActiveItem('our-tours')}
              >
                {t('nav.ourTours')}
              </a>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <a 
                href="/about-us" 
                className={`text-base font-medium ${activeItem === 'about-us' ? 'text-blue-500 bg-blue-500/10' : 'text-blue-950 hover:text-blue-500 hover:bg-blue-500/10'} transition-all duration-300 px-7 py-3 rounded-md cursor-pointer`}
                onClick={() => setActiveItem('about-us')}
              >
                {t('nav.aboutUs')}
              </a>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <a 
                href="#contact-section" 
                onClick={scrollToContact}
                className={`text-base font-medium ${activeItem === 'contact' ? 'text-blue-500 bg-blue-500/10' : 'text-blue-950 hover:text-blue-500 hover:bg-blue-500/10'} transition-all duration-300 px-7 py-3 rounded-md cursor-pointer`}
              >
                {t('nav.contact')}
              </a>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Mobile Menu and Language Selector */}
        <div className="flex justify-end items-center gap-4">
          <div className="hidden lg:block">
            <LanguageSelector />
          </div>
          <Sheet>
            <SheetTrigger className="lg:hidden">
              <Menu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side="right" className="w-full bg-[#002B5B] border-none p-0 [&>button]:hidden">
              <div className="flex flex-col h-full p-6">
                {/* Logo and Close Button */}
                <div className="mb-16 flex justify-between items-center">
                  <a 
                    href="/" 
                    className="flex items-center gap-2"
                    onClick={() => setActiveItem('home')}
                  >
                    <img
                      src="/ucv-logo-white.svg"
                      alt="UCV Logo"
                      width={40}
                      height={40}
                      className="h-14 w-auto"
                    />
                    <div className="flex flex-col ps-2">
                      <span className="text-xs font-bold text-white">UNIVERSAL</span>
                      <span className="text-xs font-bold text-white">CONNECT</span>
                      <span className="text-xs font-bold text-white">VN</span>
                    </div>
                  </a>
                  <SheetClose className="text-white hover:text-white/80 transition-colors">
                    <X className="h-5 w-5" />
                  </SheetClose>
                </div>

                {/* Navigation Links */}
                <div className="flex flex-col">
                  <a 
                    href="/our-tours" 
                    className={`text-3xl font-normal text-white hover:text-primary transition-colors py-4 ${activeItem === 'our-tours' ? 'text-primary' : ''}`}
                    onClick={() => setActiveItem('our-tours')}
                  >
                    {t('nav.ourTours')}
                  </a>
                  <div className="h-[1px] bg-white/20 my-3" />
                  <a 
                    href="/about-us" 
                    className={`text-3xl font-normal text-white hover:text-primary transition-colors py-4 ${activeItem === 'about-us' ? 'text-primary' : ''}`}
                    onClick={() => setActiveItem('about-us')}
                  >
                    {t('nav.aboutUs')}
                  </a>
                  <div className="h-[1px] bg-white/20 my-3" />
                  <a 
                    href="#contact-section" 
                    onClick={(e) => {
                      scrollToContact(e);
                      setActiveItem('contact');
                      const closeButton = document.querySelector('.close-sheet-button') as HTMLElement;
                      if (closeButton) closeButton.click();
                    }} 
                    className={`text-3xl font-normal text-white hover:text-primary transition-colors py-4 ${activeItem === 'contact' ? 'text-primary' : ''}`}
                  >
                    {t('nav.contact')}
                  </a>
                </div>

                {/* Language Selector for Mobile */}
                <div className="flex justify-center mt-8">
                  <LanguageSelector />
                </div>

                {/* Contact Information */}
                <div className="mt-auto">
                  <div className="flex flex-col">
                    <div className="ms-5 py-4 flex gap-6">
                      <div className="flex items-center mb-2">
                        <Phone className="h-7 w-7 fill-[#438EFF] text-content" />
                      </div>
                      <div className="flex flex-col">
                        <h3 className="text-white font-medium">HOTLINE</h3>
                        <a href="tel:+84034444868" className="text-white hover:text-white text-sm">
                          +84 (0)34444 8680
                        </a>
                      </div>
                    </div>
                    <div className="h-[1px] bg-white/20" />
                    <div className="ms-5 py-4 flex gap-6">
                      <div className="flex items-center mb-2">
                        <Mail className="h-7 w-7 fill-[#438EFF] text-content" />
                      </div>
                      <div className="flex flex-col">
                        <h3 className="text-white font-medium">EMAIL</h3>
                        <a href="mailto:bernd@iucconsulting.com" className="text-white hover:text-white text-sm">
                          bernd@iucconsulting.com
                        </a>
                        <a href="mailto:bfwidemann@gmail.com" className="text-white hover:text-white text-sm">
                          bfwidemann@gmail.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
