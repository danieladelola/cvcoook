import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MessageCircle, Mail, FileText } from "lucide-react";

const FAQ = () => {
  const faqCategories = [
    {
      title: "Getting Started",
      faqs: [
        {
          question: "How do I create my first CV?",
          answer: "Creating your first CV is simple! Click the 'Start Now' button, choose a template that suits your industry, fill in your details using our guided form, and download your professional CV in minutes. Our AI-powered suggestions will help you craft compelling content."
        },
        {
          question: "Is CVBuilder free to use?",
          answer: "Yes! We offer a free plan that includes access to basic templates and core features. For advanced features like AI content generation, premium templates, and unlimited downloads, check out our Pro and Business plans."
        },
        {
          question: "What file formats can I download my CV in?",
          answer: "You can download your CV in multiple formats including PDF, DOCX (Microsoft Word), and TXT. PDF is recommended for most job applications as it preserves your formatting perfectly across all devices."
        },
        {
          question: "Do I need to create an account?",
          answer: "You can explore templates without an account, but creating a free account allows you to save your CVs, access them from any device, and track your application progress. Registration takes less than a minute."
        },
      ]
    },
    {
      title: "Templates & Design",
      faqs: [
        {
          question: "How many templates are available?",
          answer: "We offer over 100 professionally designed templates across various categories including Modern, Creative, Professional, Simple, and Industry-specific designs. All templates are ATS-optimized to ensure your CV passes applicant tracking systems."
        },
        {
          question: "Can I customize the templates?",
          answer: "Absolutely! Every template is fully customizable. You can change colors, fonts, section order, and layout. Our editor makes it easy to personalize your CV while maintaining a professional appearance."
        },
        {
          question: "What is ATS and why does it matter?",
          answer: "ATS (Applicant Tracking System) is software used by employers to scan and filter resumes. Our templates are designed to be ATS-friendly, ensuring your CV is parsed correctly and reaches human recruiters. Our ATS Checker tool can scan your CV and provide optimization suggestions."
        },
        {
          question: "Can I use the same template for different jobs?",
          answer: "Yes! You can create multiple versions of your CV using the same or different templates. We recommend tailoring your CV for each job application to highlight relevant skills and experience."
        },
      ]
    },
    {
      title: "AI Features",
      faqs: [
        {
          question: "How does the AI Resume Builder work?",
          answer: "Our AI analyzes your input and job descriptions to generate tailored content suggestions for your CV. It helps write compelling summaries, bullet points, and skill descriptions that resonate with employers in your industry."
        },
        {
          question: "Is the AI-generated content unique?",
          answer: "Yes! Our AI creates original content based on your specific experience and target role. The suggestions are personalized and not copied from existing sources. You can always edit and refine the AI suggestions to match your voice."
        },
        {
          question: "Can AI help with my cover letter too?",
          answer: "Absolutely! Our AI Cover Letter Generator creates personalized cover letters based on your CV and the job description. It crafts compelling narratives that complement your CV and increase your chances of getting an interview."
        },
      ]
    },
    {
      title: "Pricing & Billing",
      faqs: [
        {
          question: "What's included in the free plan?",
          answer: "The free plan includes access to basic templates, unlimited CV edits, and PDF downloads with our branding. You can create and save one CV and access our basic formatting tools."
        },
        {
          question: "Can I cancel my subscription anytime?",
          answer: "Yes! You can cancel your subscription at any time from your account settings. You'll continue to have access to premium features until the end of your billing period. No questions asked, no hidden fees."
        },
        {
          question: "Do you offer refunds?",
          answer: "We offer a 14-day money-back guarantee on all paid plans. If you're not satisfied with our service, contact our support team within 14 days of purchase for a full refund."
        },
        {
          question: "Is there a discount for annual billing?",
          answer: "Yes! When you choose annual billing, you save up to 40% compared to monthly payments. This is our best value option for users who want long-term access to premium features."
        },
      ]
    },
    {
      title: "Account & Privacy",
      faqs: [
        {
          question: "How is my data protected?",
          answer: "We take data security seriously. All data is encrypted in transit and at rest using industry-standard encryption. We never share your personal information with third parties without your consent. Read our Privacy Policy for full details."
        },
        {
          question: "Can I delete my account and data?",
          answer: "Yes! You can delete your account at any time from your account settings. This will permanently remove all your CVs and personal data from our servers within 30 days, in compliance with GDPR."
        },
        {
          question: "Can I access my CV from multiple devices?",
          answer: "Yes! Your CVs are stored in the cloud and can be accessed from any device with an internet connection. Simply log in to your account to view, edit, or download your documents."
        },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="hero-gradient py-16 md:py-24">
        <div className="container text-center">
          <h1 className="font-heading text-3xl font-bold text-white md:text-5xl mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Find answers to common questions about our CV builder, templates, and services.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 md:py-24">
        <div className="container max-w-4xl">
          {faqCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-12">
              <h2 className="font-heading text-2xl font-bold text-primary mb-6">
                {category.title}
              </h2>
              <Accordion type="single" collapsible className="space-y-4">
                {category.faqs.map((faq, faqIndex) => (
                  <AccordionItem 
                    key={faqIndex} 
                    value={`${categoryIndex}-${faqIndex}`}
                    className="bg-card rounded-lg border border-border px-6"
                  >
                    <AccordionTrigger className="text-left font-medium text-foreground hover:text-secondary hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-heading text-2xl font-bold text-primary md:text-3xl mb-4">
              Still Have Questions?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
            <div className="bg-card rounded-xl p-6 text-center border border-border card-hover">
              <div className="feature-icon mx-auto mb-4">
                <MessageCircle className="h-7 w-7 text-secondary" />
              </div>
              <h3 className="font-heading font-semibold text-primary mb-2">Live Chat</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Chat with our support team in real-time
              </p>
              <Button variant="outline" size="sm">Start Chat</Button>
            </div>
            
            <div className="bg-card rounded-xl p-6 text-center border border-border card-hover">
              <div className="feature-icon mx-auto mb-4">
                <Mail className="h-7 w-7 text-secondary" />
              </div>
              <h3 className="font-heading font-semibold text-primary mb-2">Email Support</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get a response within 24 hours
              </p>
              <Link to="/contact">
                <Button variant="outline" size="sm">Contact Us</Button>
              </Link>
            </div>
            
            <div className="bg-card rounded-xl p-6 text-center border border-border card-hover">
              <div className="feature-icon mx-auto mb-4">
                <FileText className="h-7 w-7 text-secondary" />
              </div>
              <h3 className="font-heading font-semibold text-primary mb-2">Documentation</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Browse our detailed guides
              </p>
              <Link to="/resources">
                <Button variant="outline" size="sm">View Docs</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQ;
