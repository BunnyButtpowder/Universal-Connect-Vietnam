import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu"
import { LanguageSelector } from "./LanguageSelector"

export function Navbar() {
  return (
    <nav className="w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between py-2">
        {/* Logo Section */}
        <div className="w-[200px]">
          <a href="/" className="flex items-center gap-2">
            <img
              src="/ucv-logo.svg" 
              alt="UCV Logo" 
              width={40} 
              height={40}
              className="h-14 w-auto"
            />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-content">UNIVERSAL</span>
              <span className="text-xs text-content">CONNECT</span>
              <span className="text-xs text-content">VN</span>
            </div>
          </a>
        </div>

        {/* Navigation Links */}
        <NavigationMenu className="absolute left-1/2 transform -translate-x-1/2">
          <NavigationMenuList className="hidden md:flex gap-12">
            <NavigationMenuItem>
              <a href="/our-tours" className="text-md font-medium text-content hover:text-primary transition-colors">
                Our Tours
              </a>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <a href="/about-us" className="text-md font-medium text-content hover:text-primary transition-colors">
                About us
              </a>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <a href="/contact" className="text-md font-medium text-content hover:text-primary transition-colors">
                Contact
              </a>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Language Selector */}
        <div className="w-[200px] flex justify-end">
          <LanguageSelector />
        </div>
      </div>
    </nav>
  )
}
