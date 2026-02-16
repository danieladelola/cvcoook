import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock, MessageSquare, HelpCircle, FileText, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours."
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const contactMethods = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Us",
      description: "Our friendly team is here to help.",
      contact: "support@cvbuilder.com"
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Call Us",
      description: "Mon-Fri from 8am to 5pm EST.",
      contact: "+1 (555) 123-4567"
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Visit Us",
      description: "Come say hello at our office.",
      contact: "100 Market St, San Francisco, CA"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Hours",
      description: "We're here when you need us.",
      contact: "24/7 Online Support"
    }
  ];

  const quickLinks = [
    { icon: <HelpCircle className="h-5 w-5" />, title: "Help Center", description: "Find answers to common questions", href: "/help" },
    { icon: <MessageSquare className="h-5 w-5" />, title: "Live Chat", description: "Chat with our support team", href: "#" },
    { icon: <FileText className="h-5 w-5" />, title: "FAQs", description: "Browse frequently asked questions", href: "/pricing" }
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary via-primary to-primary-dark py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
                Get in <span className="text-secondary">Touch</span>
              </h1>
              <p className="text-white/80 text-lg">
                Have a question or need help? We're here for you. Reach out and we'll respond within 24 hours.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-12 bg-card border-b border-border">
          <div className="container">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactMethods.map((method, index) => (
                <div key={index} className="p-6 rounded-xl border border-border bg-background hover:shadow-lg transition-shadow">
                  <div className="h-12 w-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-4">
                    {method.icon}
                  </div>
                  <h3 className="font-heading font-semibold text-primary">{method.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{method.description}</p>
                  <p className="text-sm font-medium text-primary">{method.contact}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & Quick Links */}
        <section className="py-16 bg-background">
          <div className="container">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <h2 className="font-heading text-2xl font-bold text-primary mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Your Name</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
                    <Input
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="How can we help?"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us more about your question or issue..."
                      rows={6}
                      required
                    />
                  </div>
                  <Button type="submit" variant="coral" size="lg">
                    Send Message <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </form>
              </div>

              {/* Quick Links */}
              <div>
                <h2 className="font-heading text-2xl font-bold text-primary mb-6">Quick Help</h2>
                <div className="space-y-4">
                  {quickLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card hover:shadow-lg hover:border-secondary/50 transition-all"
                    >
                      <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        {link.icon}
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold text-primary">{link.title}</h3>
                        <p className="text-sm text-muted-foreground">{link.description}</p>
                      </div>
                    </a>
                  ))}
                </div>

                {/* Office Info */}
                <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-primary to-primary-dark text-white">
                  <h3 className="font-heading font-semibold mb-4">Our Office</h3>
                  <div className="space-y-3 text-sm text-white/80">
                    <p>100 Market Street, Suite 500</p>
                    <p>San Francisco, CA 94105</p>
                    <p>United States</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
