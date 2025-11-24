const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
          Privacy Policy
        </h1>
        
        <div className="space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Information We Collect</h2>
            <p>
              We collect information that you provide directly to us, including when you contact us through our website,
              request our services, or communicate with us. This may include your name, email address, phone number,
              company name, and any other information you choose to provide.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-inside mt-2 space-y-2 ml-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Respond to your inquiries and requests</li>
              <li>Send you technical notices and support messages</li>
              <li>Communicate with you about products, services, and events</li>
              <li>Monitor and analyze trends and usage</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Information Sharing</h2>
            <p>
              We do not share your personal information with third parties except as described in this policy.
              We may share information with service providers who perform services on our behalf, such as hosting
              and analytics providers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Data Security</h2>
            <p>
              We take reasonable measures to protect your information from unauthorized access, use, or disclosure.
              However, no internet or email transmission is ever fully secure or error-free.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Your Rights</h2>
            <p>
              You have the right to access, update, or delete your personal information. If you wish to exercise
              these rights, please contact us at info@sannex.ng.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any changes by posting
              the new policy on this page with an updated effective date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Contact Us</h2>
            <p>
              If you have any questions about this privacy policy, please contact us at:
            </p>
            <div className="mt-2">
              <p>Email: info@sannex.ng</p>
              <p>Phone: +2347048706198</p>
              <p>Location: Lagos, Nigeria</p>
            </div>
          </section>

          <p className="text-sm mt-8 pt-8 border-t border-border">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
