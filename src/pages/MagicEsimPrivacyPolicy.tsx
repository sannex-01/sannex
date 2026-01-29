const MagicEsimPrivacyPolicy = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card shadow-lg rounded-lg p-8 md:p-12 border border-border">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Magic eSIM – Privacy Policy
            </h1>
          </div>

          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                This Privacy Policy describes how Magic eSIM ("we", "us", or "our") collects, uses, and protects your personal data when you use our mobile application and services. We are committed to protecting your privacy and ensuring the security of your information.
              </p>
            </section>

            {/* Information We Collect */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We collect the following types of information to provide and improve our services:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Email address</li>
                <li>Account information (username, password)</li>
                <li>Device information (basic device and operating system data)</li>
                <li>Usage data (when applicable, to improve our services)</li>
              </ul>
            </section>

            {/* How We Use Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. How We Use Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We use the information we collect for the following purposes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Account creation and management</li>
                <li>Providing eSIM services to you</li>
                <li>Customer support and responding to your inquiries</li>
                <li>Legal and compliance purposes</li>
              </ul>
            </section>

            {/* Data Sharing */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Data Sharing</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Your privacy is important to us. We want you to know:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>We do not sell your personal data to third parties</li>
                <li>Data may only be shared with service providers that are necessary to operate the service (e.g., cloud hosting, payment processors)</li>
                <li>We may share data when legally required to do so by law enforcement or regulatory authorities</li>
              </ul>
            </section>

            {/* Data Retention */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain your personal data while your account is active and for as long as necessary to provide you with our services. When you request deletion of your account, your account will be deactivated, and all associated personal data will be permanently deleted from our systems within <strong>30 days</strong> of receiving your request.
              </p>
            </section>

            {/* Account Deletion */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Account Deletion</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                You have the right to request deletion of your account and all associated data at any time. To request account deletion, please visit:
              </p>
              <p className="text-muted-foreground">
                <a 
                  href="https://sannex.ng/esimmagic/user/request_delete" 
                  className="text-primary hover:underline font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://sannex.ng/esimmagic/user/request_delete
                </a>
              </p>
            </section>

            {/* User Rights */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. User Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                As a user of Magic eSIM, you have the following rights regarding your personal data:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Request access to your data (to know what information we hold about you)</li>
                <li>Request deletion of your data (right to be forgotten)</li>
                <li>Withdraw consent where applicable (for data processing based on consent)</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                To exercise any of these rights, please contact us using the information provided below.
              </p>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact us at:
              </p>
              <p className="text-muted-foreground font-medium">
                Email:{" "}
                <a 
                  href="mailto:compliance@sannex.ng" 
                  className="text-primary hover:underline"
                >
                  compliance@sannex.ng
                </a>
              </p>
            </section>

            {/* Last Updated */}
            <section className="mt-12 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground italic">
                Last updated: {currentDate}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MagicEsimPrivacyPolicy;
