import { Link } from "react-router-dom";
import { FileText, Mail, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = {
    product: [
      { name: "Resume Templates", href: "/templates" },
      { name: "CV Examples", href: "/examples" },
      { name: "Pricing", href: "/pricing" },
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "Careers", href: "/careers" },
    ],
    legal: [
      { name: "Terms of Service", href: "/terms" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Cookie Policy", href: "/cookies" },
    ],
  };
  
  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                <FileText className="h-5 w-5 text-secondary-foreground" />
              </div>
              <span className="font-heading text-xl font-bold">
                CV<span className="text-secondary">COOK</span>
              </span>
            </Link>
            <p className="text-sm text-primary-foreground/70">
              Create professional resumes and CVs in minutes with our easy-to-use builder.
            </p>
            <div className="flex items-center gap-2 text-sm text-primary-foreground/70">
              <Mail className="h-4 w-4" />
              <span>support@cvcook.com</span>
            </div>
          </div>
          
          {/* Product Links */}
          <div>
            <h4 className="mb-4 font-heading font-semibold">Product</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-secondary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Company Links */}
          <div>
            <h4 className="mb-4 font-heading font-semibold">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-secondary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Legal Links */}
          <div>
            <h4 className="mb-4 font-heading font-semibold">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-secondary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="mt-12 border-t border-primary-foreground/10 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-primary-foreground/60">
              © {currentYear} CVCOOK. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/terms" className="text-sm text-primary-foreground/60 hover:text-secondary">
                Terms
              </Link>
              <Link to="/privacy" className="text-sm text-primary-foreground/60 hover:text-secondary">
                Privacy
              </Link>
              <Link to="/contact" className="text-sm text-primary-foreground/60 hover:text-secondary">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
