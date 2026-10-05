import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Child Safety and CSAE Standards",
  description:
    "Hatkeshwar Jyotish standards prohibiting child sexual abuse and exploitation, with instructions for reporting concerns.",
  alternates: { canonical: "/csae-standards" },
};

export default function CsaeStandardsPage() {
  return (
    <main className="min-h-[70vh] bg-[#fffaf2] px-4 py-12 sm:px-6 sm:py-16">
      <article className="mx-auto max-w-3xl rounded-3xl border border-orange-200 bg-white p-6 shadow-sm sm:p-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-orange-700">
          Acharya Rishi Nagar · Hatkeshwar Jyotish
        </p>
        <h1 className="font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
          Child Safety and CSAE Standards
        </h1>
        <p className="mt-5 leading-7 text-slate-700">
          Hatkeshwar Jyotish is committed to the safety of children. Child
          sexual abuse and exploitation (CSAE), including child sexual abuse
          material (CSAM), is strictly prohibited in our app and services.
        </p>

        <h2 className="mt-8 font-serif text-xl font-bold text-slate-900">
          Prohibited content and conduct
        </h2>
        <p className="mt-3 leading-7 text-slate-700">
          Users must not create, upload, request, share, promote, or link to
          content that sexually exploits or endangers a child. Users must not
          use the app or its reviews, booking requests, or other features to
          groom, solicit, threaten, or otherwise harm a minor. We do not allow
          content that sexualizes minors or depicts child abuse.
        </p>

        <h2 className="mt-8 font-serif text-xl font-bold text-slate-900">
          Reporting and enforcement
        </h2>
        <p className="mt-3 leading-7 text-slate-700">
          If you encounter suspected CSAE or other child-safety concerns
          connected to Hatkeshwar Jyotish, report them to Acharya Rishi Nagar
          using the contact details below. Please include a description of the
          concern and any relevant public app content; do not forward or
          redistribute suspected illegal material. We review reports and may
          remove content, restrict or terminate accounts, and report suspected
          child sexual abuse to the appropriate authorities when required.
        </p>

        <h2 className="mt-8 font-serif text-xl font-bold text-slate-900">
          Contact
        </h2>
        <p className="mt-3 leading-7 text-slate-700">
          Contact Acharya Rishi Nagar, operator of Hatkeshwar Jyotish, by phone
          or WhatsApp at{" "}
          <a
            className="font-semibold text-orange-700 underline underline-offset-4"
            href="https://wa.me/919340553012"
          >
            +91 93405 53012
          </a>
          .
        </p>
      </article>
    </main>
  );
}
