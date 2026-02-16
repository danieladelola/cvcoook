import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Privacy = () => {
  const sections = [
    {
      title: "1. Information We Collect",
      content: `We collect information you provide directly: name, email, phone number, work history, education, and other resume content. We also collect usage data: IP address, browser type, pages visited, and interaction patterns to improve our Service.`
    },
    {
      title: "2. How We Use Your Information",
      content: `We use your information to: provide and maintain our Service; process your transactions; send you updates and marketing communications (with your consent); improve our products and user experience; comply with legal obligations; and protect against fraud and abuse.`
    },
    {
      title: "3. Information Sharing",
      content: `We do not sell your personal information. We may share data with: service providers who help us operate (hosting, payment processing); when required by law; to protect our rights and safety; with your consent. Your resume content is never shared without your explicit permission.`
    },
    {
      title: "4. Data Security",
      content: `We implement industry-standard security measures including encryption, secure data centers, regular security audits, and access controls. However, no method of transmission over the Internet is 100% secure.`
    },
    {
      title: "5. Your Rights",
      content: `You have the right to: access your personal data; correct inaccurate data; delete your data; export your data; opt-out of marketing communications; restrict processing in certain circumstances. Contact us to exercise these rights.`
    },
    {
      title: "6. Cookies and Tracking",
      content: `We use cookies and similar technologies to: keep you signed in; remember your preferences; understand how you use our Service; deliver relevant advertising. You can control cookies through your browser settings.`
    },
    {
      title: "7. Data Retention",
      content: `We retain your data as long as your account is active or as needed to provide services. You can request deletion at any time. Some data may be retained for legal compliance, dispute resolution, or legitimate business purposes.`
    },
    {
      title: "8. International Transfers",
      content: `Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in compliance with applicable laws.`
    },
    {
      title: "9. Children's Privacy",
      content: `Our Service is not intended for children under 16. We do not knowingly collect personal information from children. If we learn we have collected such information, we will delete it promptly.`
    },
    {
      title: "10. Changes to This Policy",
      content: `We may update this Privacy Policy from time to time. We will notify you of significant changes via email or through the Service. Your continued use after changes constitutes acceptance.`
    },
    {
      title: "11. Contact Us",
      content: `For questions about this Privacy Policy or our privacy practices, contact us at: privacy@cvbuilder.com or CVBuilder Privacy Team, 100 Market Street, Suite 500, San Francisco, CA 94105.`
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
                Privacy Policy
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
                At CVBuilder, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service.
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

export default Privacy;
