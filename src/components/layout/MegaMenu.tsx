import { Link } from "react-router-dom";
import { ChevronDown, FileText, FileUser, Mail, Sparkles, Layout, CheckCircle, BookOpen, Clock, Grid3X3, Users, Briefcase, GraduationCap, Stethoscope, ShoppingCart, UserCircle, Newspaper, HelpCircle, DollarSign, MessageCircle, Star, Edit3, Zap, Target, TrendingUp, FileCheck, Layers, PenTool, File, Building, Heart, Code, Truck, Mic } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import menuResumeBuilder from "@/assets/menu-resume-builder.jpg";
import menuCvBuilder from "@/assets/menu-cv-builder.jpg";
import menuCoverLetter from "@/assets/menu-cover-letter.jpg";
import menuResources from "@/assets/menu-resources.jpg";

interface MenuItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description?: string;
}

const MenuItem = ({ href, icon, title, description }: MenuItemProps) => (
  <Link
    to={href}
    className="group flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted"
  >
    <div className="mt-0.5 text-secondary">{icon}</div>
    <div>
      <div className="text-sm font-medium text-foreground group-hover:text-secondary transition-colors">
        {title}
      </div>
      {description && (
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  </Link>
);

const SimpleLink = ({ href, title }: { href: string; title: string }) => (
  <Link
    to={href}
    className="block px-3 py-1.5 text-sm text-muted-foreground hover:text-secondary transition-colors"
  >
    {title}
  </Link>
);

const MegaMenu = () => {
  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList className="gap-1">
        {/* Builders */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent hover:bg-muted data-[state=open]:bg-muted">
            Builders
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[600px] grid-cols-2 gap-4 p-6">
              <div className="space-y-2">
                <MenuItem
                  href="/resume-builder"
                  icon={<FileText className="h-5 w-5" />}
                  title="Resume Builder"
                  description="Create a professional resume with our easy-to-use Resume Builder."
                />
                <MenuItem
                  href="/cv-builder"
                  icon={<FileUser className="h-5 w-5" />}
                  title="CV Builder"
                  description="Build an impressive CV effortlessly with our professional CV Maker."
                />
                <MenuItem
                  href="/cover-letter-builder"
                  icon={<Mail className="h-5 w-5" />}
                  title="Cover Letter Builder"
                  description="Craft a personalized cover letter with our powerful Cover Letter Generator."
                />
              </div>
              <div className="relative overflow-hidden rounded-xl">
                <img
                  src={menuResumeBuilder}
                  alt="Resume Builder Preview"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white text-sm font-medium mb-2">
                    Create your perfect resume in minutes
                  </p>
                  <Button variant="coral" size="sm" asChild>
                    <Link to="/resume-builder">Get Started</Link>
                  </Button>
                </div>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Resumes */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent hover:bg-muted data-[state=open]:bg-muted">
            Resumes
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[800px] p-6">
              <div className="grid grid-cols-3 gap-6">
                {/* Main Tools */}
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
                    Tools & Guides
                  </h4>
                  <MenuItem
                    href="/ai-resume-builder"
                    icon={<Sparkles className="h-5 w-5" />}
                    title="AI Resume Builder"
                    description="Create your resume with professional templates and content suggestions."
                  />
                  <MenuItem
                    href="/templates"
                    icon={<Layout className="h-5 w-5" />}
                    title="Resume Templates"
                    description="Access 100s of templates and 1200+ designs optimized to pass ATS."
                  />
                  <MenuItem
                    href="/ats-checker"
                    icon={<CheckCircle className="h-5 w-5" />}
                    title="ATS Resume Checker"
                    description="Scan your resume for on-the-spot suggestions to improve your score."
                  />
                  <MenuItem
                    href="/how-to-write"
                    icon={<BookOpen className="h-5 w-5" />}
                    title="How to Write a Resume"
                    description="Write a resume that impresses hiring managers and recruiters."
                  />
                </div>

                {/* Popular Templates */}
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
                    Popular Templates
                  </h4>
                  <div className="grid grid-cols-2 gap-x-2">
                    <SimpleLink href="/templates/chronological" title="Chronological" />
                    <SimpleLink href="/templates/combination" title="Combination" />
                    <SimpleLink href="/templates/creative" title="Creative" />
                    <SimpleLink href="/templates/functional" title="Functional" />
                    <SimpleLink href="/templates/google-docs" title="Google Docs" />
                    <SimpleLink href="/templates/modern" title="Modern" />
                    <SimpleLink href="/templates/plain-text" title="Plain Text" />
                    <SimpleLink href="/templates/simple" title="Simple" />
                  </div>
                  
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-4 mb-3 px-3">
                    Resume Examples
                  </h4>
                  <div className="grid grid-cols-2 gap-x-2">
                    <SimpleLink href="/examples/accountant" title="Accountant" />
                    <SimpleLink href="/examples/customer-service" title="Customer Service" />
                    <SimpleLink href="/examples/federal" title="Federal" />
                    <SimpleLink href="/examples/high-school" title="High School" />
                    <SimpleLink href="/examples/nurse" title="Registered Nurse" />
                    <SimpleLink href="/examples/sales" title="Sales" />
                    <SimpleLink href="/examples/student" title="Student" />
                    <SimpleLink href="/examples/teacher" title="Teacher" />
                  </div>
                </div>

                {/* CTA */}
                <div className="relative overflow-hidden rounded-xl">
                  <img
                    src={menuResumeBuilder}
                    alt="Resume Builder"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white text-sm font-medium mb-1">
                      See what our Resume Builder can do
                    </p>
                    <p className="text-white/80 text-xs mb-3">
                      Build your perfect resume with industry-specific suggestions.
                    </p>
                    <Button variant="coral" size="sm" asChild className="w-full">
                      <Link to="/resume-builder">Build my resume</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Cover Letters */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent hover:bg-muted data-[state=open]:bg-muted">
            Cover Letters
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[700px] p-6">
              <div className="grid grid-cols-3 gap-6">
                {/* Main Tools */}
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
                    Tools & Guides
                  </h4>
                  <MenuItem
                    href="/ai-cover-letter"
                    icon={<Sparkles className="h-5 w-5" />}
                    title="AI Cover Letter Generator"
                    description="Generate a cover letter with personalized content recommendations."
                  />
                  <MenuItem
                    href="/cover-letter-format"
                    icon={<Layout className="h-5 w-5" />}
                    title="Cover Letter Format"
                    description="Learn how to format a cover letter that stands out."
                  />
                  <MenuItem
                    href="/how-to-write-cover-letter"
                    icon={<PenTool className="h-5 w-5" />}
                    title="How to Write a Cover Letter"
                    description="Discover what you need to write an exceptional cover letter."
                  />
                  <MenuItem
                    href="/cover-letter-vs-resume"
                    icon={<Layers className="h-5 w-5" />}
                    title="Cover Letter vs Resume"
                    description="Explore differences to enhance your application."
                  />
                </div>

                {/* Templates & Examples */}
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
                    Cover Letter Templates
                  </h4>
                  <SimpleLink href="/cover-letter/google-docs" title="Google Docs" />
                  <SimpleLink href="/cover-letter/microsoft-word" title="Microsoft Word" />
                  <SimpleLink href="/cover-letter/simple" title="Simple" />
                  
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-4 mb-3 px-3">
                    Cover Letter Examples
                  </h4>
                  <SimpleLink href="/cover-letter/customer-service" title="Customer Service" />
                  <SimpleLink href="/cover-letter/internship" title="Internship" />
                  <SimpleLink href="/cover-letter/student" title="Student" />
                  <SimpleLink href="/cover-letter/teacher" title="Teacher" />
                </div>

                {/* CTA */}
                <div className="relative overflow-hidden rounded-xl">
                  <img
                    src={menuCoverLetter}
                    alt="Cover Letter Generator"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white text-sm font-medium mb-1">
                      See what our Cover Letter Generator can do
                    </p>
                    <p className="text-white/80 text-xs mb-3">
                      Create your cover letter with tailored content ideas.
                    </p>
                    <Button variant="coral" size="sm" asChild className="w-full">
                      <Link to="/cover-letter-builder">Build my cover letter</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* CVs */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent hover:bg-muted data-[state=open]:bg-muted">
            CVs
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[700px] p-6">
              <div className="grid grid-cols-3 gap-6">
                {/* Main Tools */}
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
                    Tools & Guides
                  </h4>
                  <MenuItem
                    href="/cv-maker"
                    icon={<FileUser className="h-5 w-5" />}
                    title="CV Maker"
                    description="Build a standout CV with polished templates and professional content."
                  />
                  <MenuItem
                    href="/cv-templates"
                    icon={<Layout className="h-5 w-5" />}
                    title="CV Templates"
                    description="Customize and download professionally designed CV templates."
                  />
                  <MenuItem
                    href="/cv-vs-resume"
                    icon={<Layers className="h-5 w-5" />}
                    title="CV vs. Resume"
                    description="Discover the key differences between CVs and resumes."
                  />
                  <MenuItem
                    href="/how-to-make-cv"
                    icon={<BookOpen className="h-5 w-5" />}
                    title="How to Make a CV"
                    description="Learn how to write a CV with our step-by-step guide."
                  />
                </div>

                {/* CV Examples */}
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
                    CV Examples
                  </h4>
                  <MenuItem
                    href="/cv-examples/car-driver"
                    icon={<Truck className="h-4 w-4" />}
                    title="Car Driver"
                  />
                  <MenuItem
                    href="/cv-examples/customer-service"
                    icon={<Users className="h-4 w-4" />}
                    title="Customer Service Officer"
                  />
                  <MenuItem
                    href="/cv-examples/medical-doctor"
                    icon={<Stethoscope className="h-4 w-4" />}
                    title="Medical Doctor"
                  />
                  <MenuItem
                    href="/cv-examples/systems-analyst"
                    icon={<Code className="h-4 w-4" />}
                    title="Systems Analyst"
                  />
                </div>

                {/* CTA */}
                <div className="relative overflow-hidden rounded-xl">
                  <img
                    src={menuCvBuilder}
                    alt="CV Maker"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white text-sm font-medium mb-1">
                      See what our CV Maker can do
                    </p>
                    <p className="text-white/80 text-xs mb-3">
                      Make an impressive CV that wins interviews.
                    </p>
                    <Button variant="coral" size="sm" asChild className="w-full">
                      <Link to="/cv-builder">Build my CV</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Resources */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent hover:bg-muted data-[state=open]:bg-muted">
            Resources
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[900px] p-6">
              <div className="grid grid-cols-4 gap-6">
                {/* AI Tools */}
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
                    AI Tools
                  </h4>
                  <MenuItem
                    href="/resume-summary-generator"
                    icon={<Edit3 className="h-5 w-5" />}
                    title="Resume Summary Generator"
                    description="Craft a powerful resume summary that stands out."
                  />
                  <MenuItem
                    href="/skills-generator"
                    icon={<Zap className="h-5 w-5" />}
                    title="AI Resume Skills Generator"
                    description="Generate skills based on your target job title."
                  />
                  <MenuItem
                    href="/interview-prep"
                    icon={<Mic className="h-5 w-5" />}
                    title="Interview Prep Tools"
                    description="Prepare with interactive tools and AI feedback."
                  />
                </div>

                {/* Support */}
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
                    Support
                  </h4>
                  <MenuItem
                    href="/about"
                    icon={<Building className="h-5 w-5" />}
                    title="About Us"
                  />
                  <MenuItem
                    href="/pricing"
                    icon={<DollarSign className="h-5 w-5" />}
                    title="Pricing"
                  />
                  <MenuItem
                    href="/contact"
                    icon={<MessageCircle className="h-5 w-5" />}
                    title="Contact"
                  />
                  <MenuItem
                    href="/reviews"
                    icon={<Star className="h-5 w-5" />}
                    title="Customer Reviews"
                  />
                  <MenuItem
                    href="/faq"
                    icon={<HelpCircle className="h-5 w-5" />}
                    title="FAQs"
                  />
                </div>

                {/* Featured Articles */}
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
                    Featured Articles
                  </h4>
                  <SimpleLink href="/articles/work-experience" title="Resume Work Experience Examples & Format" />
                  <SimpleLink href="/articles/objective" title="Resume Objective Statement Examples" />
                  <SimpleLink href="/articles/skills" title="Essential Resume Skills: Examples for Any Job" />
                  <SimpleLink href="/articles/summary" title="35+ Resume Summary Examples + Tips" />
                  
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-4 mb-3 px-3">
                    Career News
                  </h4>
                  <SimpleLink href="/news/career-gaps" title="Nearly Half of Workers Report Career Gaps" />
                  <SimpleLink href="/news/worker-concerns" title="Workers on Edge: 80% Fear Wage Loss" />
                </div>

                {/* CTA */}
                <div className="relative overflow-hidden rounded-xl">
                  <img
                    src={menuResources}
                    alt="Career Resources"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white text-sm font-medium mb-1">
                      Explore our Career Center
                    </p>
                    <p className="text-white/80 text-xs mb-3">
                      Get resume tips, stay up on trends, and improve your skills.
                    </p>
                    <Button variant="coral" size="sm" asChild className="w-full">
                      <Link to="/career-center">Visit Career Center</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Pricing - Simple link */}
        <NavigationMenuItem>
          <Link
            to="/pricing"
            className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground focus:bg-muted focus:text-accent-foreground focus:outline-none"
          >
            Pricing
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default MegaMenu;
