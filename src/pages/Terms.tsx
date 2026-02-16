import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Terms = () => {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: `By accessing and using CVBuilder ("the Service"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our Service.`
    },
    {
      title: "2. Description of Service",
      content: `CVBuilder provides online resume and CV building tools, templates, and related career services. We reserve the right to modify, suspend, or discontinue the Service at any time without notice.`
    },
    {
      title: "3. User Accounts",
      content: `To access certain features, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You must provide accurate and complete information and keep it updated.`
    },
    {
      title: "4. User Content",
      content: `You retain ownership of the content you create using our Service. By using our Service, you grant us a limited license to store and process your content to provide the Service. We will not share your personal resume content with third parties without your consent.`
    },
    {
      title: "5. Subscription and Payments",
      content: `Some features require a paid subscription. Subscriptions automatically renew unless cancelled before the renewal date. Refunds are available within 30 days of purchase if you're not satisfied with our Service.`
    },
    {
      title: "6. Prohibited Uses",
      content: `You may not use our Service to: (a) violate any laws; (b) infringe on intellectual property rights; (c) transmit harmful code or malware; (d) attempt to gain unauthorized access; (e) use automated systems to access the Service; (f) resell or redistribute our templates without permission.`
    },
    {
      title: "7. Intellectual Property",
      content: `All content, features, and functionality of the Service, including templates, designs, and AI-generated content, are owned by CVBuilder and protected by copyright, trademark, and other intellectual property laws.`
    },
    {
      title: "8. Disclaimer of Warranties",
      content: `The Service is provided "as is" without warranties of any kind. We do not guarantee that your resume will result in job interviews or employment. Career outcomes depend on many factors beyond our control.`
    },
    {
      title: "9. Limitation of Liability",
      content: `CVBuilder shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service. Our total liability shall not exceed the amount you paid for the Service in the past 12 months.`
    },
    {
      title: "10. Changes to Terms",
      content: `We may update these Terms from time to time. We will notify you of material changes via email or through the Service. Continued use after changes constitutes acceptance of the new Terms.`
    },
    {
      title: "11. Contact Information",
      content: `If you have questions about these Terms, please contact us at legal@cvbuilder.com or write to us at: CVBuilder Legal, 100 Market Street, Suite 500, San Francisco, CA 94105.`
    }
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
                Terms of Service
              </h1>
              <p className="text-white/80">
                Last updated: February 1, 2024
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 bg-background">
          <div className="container max-w-4xl">
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground mb-8">
                Please read these Terms of Service carefully before using CVBuilder. These terms govern your use of our website and services.
              </p>
              
              {sections.map((section, index) => (
                <div key={index} className="mb-8">
                  <h2 className="font-heading text-xl font-semibold text-primary mb-3">
                    {section.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
