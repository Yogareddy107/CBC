import Link from 'next/link';
import { Compass } from 'lucide-react';

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-[#FFFDF6] text-[#1A1A1A]">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-[#1A1A1A]/5 h-16">
        <div className="max-w-[1200px] mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-[#1A1A1A] hover:opacity-80 transition-opacity">
            <Compass className="text-[#FF7D29] w-6 h-6" />
            <span className="hidden sm:inline">Check<span className="text-[#FF7D29]">Before</span>Commit</span>
            <span className="sm:hidden text-[#FF7D29]">CBC</span>
          </Link>
          <Link href="/" className="text-sm font-bold text-[#FF7D29] hover:text-[#FF7D29]/80 transition-colors">
            ← Back Home
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-[900px] mx-auto px-6 py-16">
        <div className="prose prose-invert max-w-none">
          <h1 className="text-4xl font-bold tracking-tight text-[#1A1A1A] mb-4">Cookie Policy</h1>
          <p className="text-[#1A1A1A]/60 text-lg mb-12">Last updated: March 1, 2026</p>

          <section className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">1. What Are Cookies?</h2>
              <p className="text-[#1A1A1A]/80 leading-relaxed">
                Cookies are small text files stored on your device when you visit a website. They help websites remember information about your visit and often contain a unique identifier. Cookies serve various purposes, including enhancing user experience, remembering preferences, and analyzing site usage.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">2. What Cookies Do We Use?</h2>
              <p className="text-[#1A1A1A]/80 leading-relaxed mb-4">CheckBeforeCommit uses the following types of cookies:</p>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-[#1A1A1A] mb-2">Essential Cookies</h3>
                  <p className="text-[#1A1A1A]/80">
                    These cookies are necessary for the website to function properly. They include:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-[#1A1A1A]/80 mt-2">
                    <li>Authentication cookies (appwrite-session)</li>
                    <li>Security cookies for CSRF protection</li>
                    <li>Load balancing cookies</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-[#1A1A1A] mb-2">Analytical Cookies</h3>
                  <p className="text-[#1A1A1A]/80">
                    These cookies help us understand how visitors interact with our website. They track:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-[#1A1A1A]/80 mt-2">
                    <li>Pages visited</li>
                    <li>Time spent on the site</li>
                    <li>User interactions</li>
                    <li>Bounce rates</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-[#1A1A1A] mb-2">Functional Cookies</h3>
                  <p className="text-[#1A1A1A]/80">
                    These cookies remember your preferences and personalization settings:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-[#1A1A1A]/80 mt-2">
                    <li>Language preferences</li>
                    <li>Theme settings</li>
                    <li>Authentication state</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">3. Third-Party Cookies</h2>
              <p className="text-[#1A1A1A]/80 leading-relaxed">
                We may allow third-party service providers (such as analytics platforms and payment processors) to place cookies on your device. These providers have their own cookie policies and are responsible for their use of cookies.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">4. How Long Do Cookies Last?</h2>
              <p className="text-[#1A1A1A]/80 leading-relaxed mb-4">
                Cookies can be classified by their duration:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[#1A1A1A]/80">
                <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
                <li><strong>Persistent Cookies:</strong> Remain on your device for a specified period or until you manually delete them</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">5. Managing Your Cookie Preferences</h2>
              <p className="text-[#1A1A1A]/80 leading-relaxed mb-4">
                You can control and manage cookies in different ways:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[#1A1A1A]/80">
                <li><strong>Browser Settings:</strong> Most browsers allow you to refuse cookies or alert you when cookies are being sent</li>
                <li><strong>Cookie Consent:</strong> You can accept or reject non-essential cookies through our cookie consent banner</li>
                <li><strong>Opt-Out:</strong> You can opt-out of analytics cookies while retaining essential functionality</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">6. Impact of Disabling Cookies</h2>
              <p className="text-[#1A1A1A]/80 leading-relaxed">
                If you disable essential cookies, some features of our website may not function properly. However, you can still use most of the site's functionality. Disabling analytical and functional cookies will not affect your ability to use the service.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">7. Data Security and Privacy</h2>
              <p className="text-[#1A1A1A]/80 leading-relaxed">
                Cookies do not typically contain personally identifiable information. However, personal information we store may be linked to the information stored in and obtained from cookies. Please refer to our Privacy Policy for more information about how we handle and protect your data.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">8. Updates to This Policy</h2>
              <p className="text-[#1A1A1A]/80 leading-relaxed">
                CheckBeforeCommit may update this Cookie Policy periodically to reflect changes in our cookie usage or for other operational, legal, or regulatory reasons. We recommend checking this page occasionally to ensure you are aware of any changes.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">9. Contact Us</h2>
              <p className="text-[#1A1A1A]/80 leading-relaxed">
                If you have questions about our Cookie Policy or how we use cookies, please contact us at:{' '}
                <a href="mailto:teamintrasphere@gmail.com" className="text-[#FF7D29] hover:underline">
                  teamintrasphere@gmail.com
                </a>
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8 px-6 mt-16">
        <div className="max-w-[900px] mx-auto text-center text-xs text-[#1A1A1A]/40">
          <p>&copy; 2026 Check<span className="text-[#FF7D29]">Before</span>Commit. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
