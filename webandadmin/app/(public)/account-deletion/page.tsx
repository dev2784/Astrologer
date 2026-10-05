import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account and Data Deletion",
  description: "Request deletion of your Hatkeshwar Jyotish account and associated data.",
  alternates: { canonical: "/account-deletion" },
};

const deletionMessage = encodeURIComponent(
  "Hello Acharya Rishi Nagar, I request deletion of my Hatkeshwar Jyotish account and associated personal data. My registered phone number is: "
);

export default function AccountDeletionPage() {
  return (
    <main className="min-h-[70vh] bg-[#fffaf2] px-4 py-12 sm:px-6 sm:py-16">
      <article className="mx-auto max-w-3xl rounded-3xl border border-orange-200 bg-white p-6 shadow-sm sm:p-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-orange-700">
          Acharya Rishi Nagar · Hatkeshwar Jyotish
        </p>
        <h1 className="font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
          Request account and data deletion
        </h1>
        <p className="mt-5 leading-7 text-slate-700">
          You can request deletion of your Hatkeshwar Jyotish account and the
          personal data associated with it, including your profile and sign-in
          details, bookings, and reviews.
        </p>

        <h2 className="mt-8 font-serif text-xl font-bold text-slate-900">
          How to request deletion
        </h2>
        <ol className="mt-3 list-decimal space-y-2 pl-6 leading-7 text-slate-700">
          <li>Use the button below to message Acharya Rishi Nagar on WhatsApp.</li>
          <li>Send the message from the phone number registered to your account and include that number in the request.</li>
          <li>We may contact you at that number to verify the request before deleting the account.</li>
        </ol>

        <p className="mt-5 leading-7 text-slate-700">
          We aim to complete verified requests within 30 days. We will delete the
          account and associated personal data from active service records. We
          may retain limited information only when required by law or needed to
          resolve an outstanding dispute; if that applies, we will explain what
          is retained and why.
        </p>

        <a
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl bg-[#971f1f] px-6 py-3 font-bold text-white transition hover:bg-[#7f1d1d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#971f1f]"
          href={`https://wa.me/919340553012?text=${deletionMessage}`}
        >
          Request deletion on WhatsApp
        </a>

        <p className="mt-4 text-sm leading-6 text-slate-600">
          You can also call +91 93405 53012 if WhatsApp is unavailable. Do not
          send your password or one-time verification codes.
        </p>
      </article>
    </main>
  );
}
