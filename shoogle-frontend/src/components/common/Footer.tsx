import { MessageCircle, Heart, Mail, MapPin, Phone, Github, Twitter, Linkedin, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const footerLinks = {
    Product: [
      { name: "How it Works", href: "#" },
      { name: "Features", href: "#" },
      { name: "Pricing", href: "#" },
      { name: "API", href: "#" },
    ],
    Company: [
      { name: "About Us", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Press", href: "#" },
      { name: "Blog", href: "#" },
    ],
    Support: [
      { name: "Help Center", href: "#" },
      { name: "Safety", href: "#" },
      { name: "Community", href: "#" },
      { name: "Contact", href: "#" },
    ],
    Legal: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Cookie Policy", href: "#" },
      { name: "Guidelines", href: "#" },
    ],
  };

  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-12">
        {/* Main Footer Content */}
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-6">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="mb-6 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <MessageCircle className="h-6 w-6" />
              </div>
              <span className="text-2xl font-bold tracking-tight">shoogle</span>
            </div>
            <p className="mb-8 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Your friendly AI marketplace where buying and selling happens through simple
              conversations. Discover anything, sell everything.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  <Mail className="h-4 w-4" />
                </div>
                <span>hello@shoogle.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  <Phone className="h-4 w-4" />
                </div>
                <span>+91 (800) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  <MapPin className="h-4 w-4" />
                </div>
                <span>Mumbai, India</span>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="mb-6 font-semibold tracking-tight">{category}</h3>
              <ul className="space-y-4">
                {links.map(link => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary hover:underline"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between gap-6 border-t border-border pt-8 sm:flex-row">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} shoogle. All rights reserved.
          </div>

          <div className="flex gap-4">
            {[Github, Twitter, Linkedin, Instagram].map((Icon, i) => (
              <Button key={i} variant="ghost" size="icon" className="h-9 w-9 opacity-70 hover:opacity-100">
                <Icon className="h-4 w-4" />
              </Button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
