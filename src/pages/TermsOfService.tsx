const TermsOfService = () => {
  return (
    <div className="min-h-screen py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
          Terms of Service
        </h1>
        
        <div className="space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Sannex's services, you accept and agree to be bound by these Terms of Service.
              If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Services</h2>
            <p>
              Sannex provides AI automation, fullstack web development, API integrations, and technical
              consulting services. The specific scope, deliverables, and timelines for each project will be outlined
              in a separate agreement or statement of work.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Client Responsibilities</h2>
            <p>Clients agree to:</p>
            <ul className="list-disc list-inside mt-2 space-y-2 ml-4">
              <li>Provide accurate and complete information required for project completion</li>
              <li>Respond to queries and requests in a timely manner</li>
              <li>Review deliverables and provide feedback within agreed timeframes</li>
              <li>Make payments according to the agreed payment schedule</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Payment Terms</h2>
            <p>
              Payment terms will be specified in the project agreement. Generally, payment may be required in
              milestones or upon project completion. Late payments may be subject to additional fees.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Intellectual Property</h2>
            <p>
              Upon full payment, clients will own the deliverables created specifically for their project.
              Sannex retains ownership of pre-existing materials, frameworks, and general methodologies.
              We reserve the right to showcase completed projects in our portfolio unless otherwise agreed.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Confidentiality</h2>
            <p>
              We respect the confidentiality of client information and will not disclose sensitive information
              to third parties without permission, except as required by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Warranties and Disclaimers</h2>
            <p>
              We strive to deliver high-quality services but cannot guarantee specific results. Services are provided
              "as is" without warranties of any kind, either express or implied.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Limitation of Liability</h2>
            <p>
              Sannex's liability is limited to the amount paid for the specific service in question.
              We are not liable for indirect, incidental, or consequential damages.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Termination</h2>
            <p>
              Either party may terminate services with written notice. Upon termination, clients are responsible
              for payment of work completed up to the termination date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Continued use of our services after
              changes constitutes acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">11. Contact Information</h2>
            <p>
              For questions about these Terms of Service, please contact us at:
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

export default TermsOfService;
