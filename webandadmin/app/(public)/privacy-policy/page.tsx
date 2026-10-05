import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy information for the Hatkeshwar Jyotish website and mobile app by Acharya Rishi Nagar.",
  alternates: { canonical: "/privacy-policy" },
};

const sections = [
  {
    title: "Information we collect",
    paragraphs: [
      "When you create an account, we may collect your name, phone number, email address, and password. Passwords are stored as bcrypt hashes rather than as plain text.",
      "When you request a puja booking, we collect the account name and contact details, the selected service, the service address, and the requested date. If you submit a review, we collect your name, phone number, optional city, rating, and comment. Approved reviews may be shown publicly with your name, city if provided, rating, and comment; phone numbers are not shown in public review listings.",
      "If you use an available contact form, the information you enter, such as your name, phone number, email address, and message, is used to respond to your inquiry.",
    ],
  },
  {
    title: "How we use information",
    paragraphs: [
      "We use information to create and authenticate accounts, respond to inquiries, arrange requested services, manage and moderate reviews, and operate and secure the website and app.",
    ],
  },
  {
    title: "Where information is processed",
    paragraphs: [
      "The Android app sends account, booking, and review requests to our service API, currently hosted at vedik-app.onrender.com. Information is stored in the service database. Hosting and database providers process information as needed to operate the service.",
      "The app can open WhatsApp, the phone dialer, email, or maps when you choose those options. Those services receive information according to your action and their own privacy policies.",
    ],
  },
  {
    title: "Retention and your choices",
    paragraphs: [
      "We keep account, booking, inquiry, and review information only for as long as it is needed to provide the service, manage records, meet legal obligations, and resolve disputes. Retention periods can vary by record type.",
      "You can request access, correction, or deletion of your account and associated personal data at any time. We aim to complete verified deletion requests within 30 days. See our account deletion page for the steps and the information that is removed. We may need to retain limited records where the law requires it or where they are needed to resolve an outstanding matter.",
    ],
  },
  {
    title: "Security",
    paragraphs: [
      "We use safeguards intended to protect information. Account passwords are hashed before storage, and the app communicates with its production API over HTTPS. No internet transmission or storage system can be guaranteed completely secure.",
    ],
  },
  {
    title: "Children’s privacy",
    paragraphs: [
      "Our services are intended for people aged 13 and older. We do not knowingly collect personal information from children under 13. If you believe a child under 13 has provided personal information, contact us so we can review and remove it.",
    ],
  },
  {
    title: "Changes and contact",
    paragraphs: [
      "We may update this policy when our services or information practices change. The latest version will be posted on this page with its updated date. The service is operated by Acharya Rishi Nagar under the Hatkeshwar Jyotish name.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <article className="min-h-[70vh] bg-[#fffaf2] px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <header className="mb-10 border-b border-orange-200 pb-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-orange-700">
            Acharya Rishi Nagar · Hatkeshwar Jyotish
          </p>
          <h1 className="font-serif text-4xl font-bold text-slate-900 sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm text-slate-600">
            Last updated: October 5, 2026
          </p>
          <p className="mt-5 max-w-3xl leading-7 text-slate-700">
            This policy explains how Acharya Rishi Nagar, operating Hatkeshwar
            Jyotish, handles information when you use our website and Android
            app. The app and services are intended for people aged 13 and older.
          </p>
          <p className="mt-4 leading-7 text-slate-700">
            Need your account and associated data removed? Visit our{" "}
            <Link className="font-semibold text-orange-700 underline underline-offset-4" href="/account-deletion">
              account deletion page
            </Link>
            .
          </p>
        </header>

        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="mb-3 font-serif text-2xl font-bold text-slate-900">
                {section.title}
              </h2>
              <div className="space-y-3 text-base leading-7 text-slate-700">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <aside className="mt-10 rounded-2xl border border-orange-200 bg-white p-6 shadow-sm">
          <h2 className="font-serif text-xl font-bold text-slate-900">
            Privacy requests
          </h2>
          <p className="mt-2 leading-7 text-slate-700">
            For privacy questions or requests, contact Acharya Rishi Nagar by phone or WhatsApp at{" "}
            <a
              className="font-semibold text-orange-700 underline underline-offset-4"
              href="https://wa.me/919340553012"
            >
              +91 93405 53012
            </a>
            . You can also visit our <Link className="font-semibold text-orange-700 underline underline-offset-4" href="/contact">Contact page</Link>.
          </p>
        </aside>
      </div>
    </article>
  );
}
