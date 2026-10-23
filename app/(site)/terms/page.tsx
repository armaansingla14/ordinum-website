import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import Kicker from "@/components/ui/Kicker";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Ordinum Terms of Service.",
  alternates: { canonical: "/terms" },
  openGraph: {
    type: "website",
    url: "/terms",
    siteName: "Ordinum",
    title: "Terms of Service · Ordinum",
    description: "Ordinum Terms of Service.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service · Ordinum",
    description: "Ordinum Terms of Service.",
  },
};

type TermsSection = { number: string; title: string; paragraphs: string[] };

// Legal text ported verbatim from the previous site. Do not edit wording.
const INTRO = "Please read these terms carefully. By using Ordinum, you agree to the Terms of Service below.";

const SECTIONS: TermsSection[] = [
  {
    "number": "1",
    "title": "Service and Access",
    "paragraphs": [
      "Ordinum provides an AI governance, audit, and decision recording platform (the \"Service\"). Subject to these Terms, Ordinum grants you a non-exclusive, non-transferable, revocable right to access and use the Service during the term of your subscription.",
      "Ordinum reserves the right to modify, suspend, or discontinue the Service, or any part thereof, at any time with or without notice. Ordinum shall not be liable to you or any third party for any modification, suspension, or discontinuation of the Service."
    ]
  },
  {
    "number": "2",
    "title": "Support",
    "paragraphs": [
      "Ordinum provides technical support for the Service in accordance with your subscription plan. Support is provided via email at armaan@ordinum.org. Ordinum will use commercially reasonable efforts to respond to support requests in a timely manner, but does not guarantee specific response times unless otherwise specified in a separate service level agreement."
    ]
  },
  {
    "number": "3",
    "title": "User Accounts",
    "paragraphs": [
      "To access the Service, you must create an account and provide accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.",
      "You agree to notify Ordinum immediately of any unauthorized use of your account or any other breach of security. Ordinum will not be liable for any loss or damage arising from your failure to comply with this section."
    ]
  },
  {
    "number": "4",
    "title": "Feedback and Usage Data",
    "paragraphs": [
      "If you provide Ordinum with any feedback, suggestions, or ideas regarding the Service (\"Feedback\"), you grant Ordinum a perpetual, irrevocable, royalty-free license to use, modify, and incorporate such Feedback into the Service without any obligation to you.",
      "Ordinum may collect and use anonymized usage data to improve the Service, provided that such data does not identify you or your organization and does not include any Customer Content (as defined below)."
    ]
  },
  {
    "number": "5",
    "title": "Customer Content",
    "paragraphs": [
      "\"Customer Content\" means any data, prompts, outputs, audit logs, decision records, or other content that you submit to or generate through the Service. You retain all ownership rights in your Customer Content.",
      "You grant Ordinum a limited license to host, store, process, and display Customer Content solely as necessary to provide the Service to you. Ordinum will not access, use, or share Customer Content except as necessary to provide the Service, comply with applicable law, or as otherwise authorized by you."
    ]
  },
  {
    "number": "6",
    "title": "Machine Learning and AI Limitations",
    "paragraphs": [
      "Ordinum does not use Customer Content to train machine learning models or AI systems. The Service is designed to record, audit, and govern AI decisions made by your systems, not to make decisions on your behalf.",
      "You acknowledge that AI governance tools, including the Service, may not capture every aspect of AI system behavior and that Ordinum makes no guarantee of complete coverage or detection of all AI decisions or anomalies."
    ]
  },
  {
    "number": "7",
    "title": "Restrictions and Obligations",
    "paragraphs": [
      "You agree not to: (a) sublicense, sell, resell, transfer, or distribute the Service; (b) modify, copy, or create derivative works based on the Service; (c) reverse engineer or attempt to extract the source code of the Service; (d) use the Service to violate any applicable law or regulation; (e) use the Service to infringe upon the rights of any third party; (f) interfere with or disrupt the integrity or performance of the Service.",
      "You are solely responsible for ensuring that your use of the Service complies with all applicable laws, regulations, and industry standards, including but not limited to data protection and privacy laws."
    ]
  },
  {
    "number": "8",
    "title": "Suspension",
    "paragraphs": [
      "Ordinum may suspend your access to the Service immediately if: (a) you breach these Terms; (b) your use of the Service poses a security risk to Ordinum or any third party; (c) your use of the Service may subject Ordinum to liability; or (d) your account is overdue for payment. Ordinum will use reasonable efforts to provide notice before suspending access, except where immediate suspension is necessary to prevent harm."
    ]
  },
  {
    "number": "9",
    "title": "Privacy and Security",
    "paragraphs": [
      "Ordinum takes the security and privacy of Customer Content seriously. We implement industry-standard security measures to protect your data, including encryption in transit and at rest, access controls, and regular security assessments.",
      "Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference. By using the Service, you consent to the collection and use of your information as described in our Privacy Policy."
    ]
  },
  {
    "number": "10",
    "title": "Payments and Taxes",
    "paragraphs": [
      "If you subscribe to a paid plan, you agree to pay all fees specified in your subscription agreement. All fees are non-refundable unless otherwise specified. Ordinum may change its pricing at any time, but will provide at least 30 days' notice before applying new prices to your subscription.",
      "You are responsible for all applicable taxes, and Ordinum will charge tax where required by law. If you are exempt from tax, you must provide Ordinum with a valid exemption certificate."
    ]
  },
  {
    "number": "11",
    "title": "Term and Termination",
    "paragraphs": [
      "These Terms are effective until terminated. You may terminate your account at any time by contacting Ordinum at armaan@ordinum.org. Ordinum may terminate your account and access to the Service at any time for any reason, with or without cause.",
      "Upon termination, your right to use the Service will immediately cease. Ordinum will provide you with a reasonable opportunity to export your Customer Content prior to deletion, except in cases of termination for cause."
    ]
  },
  {
    "number": "12",
    "title": "Representations and Warranties",
    "paragraphs": [
      "You represent and warrant that: (a) you have the legal authority to enter into these Terms; (b) you will comply with all applicable laws in your use of the Service; (c) you have all necessary rights to submit Customer Content to the Service; and (d) your use of the Service will not violate any third-party rights or any applicable law."
    ]
  },
  {
    "number": "13",
    "title": "Disclaimers",
    "paragraphs": [
      "THE SERVICE IS PROVIDED \"AS IS\" AND \"AS AVAILABLE\" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. ORDINUM DOES NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR COMPLETELY SECURE. YOU USE THE SERVICE AT YOUR OWN RISK."
    ]
  },
  {
    "number": "14",
    "title": "Limitation of Liability",
    "paragraphs": [
      "TO THE MAXIMUM EXTENT PERMITTED BY LAW, ORDINUM SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, REVENUE, DATA, OR USE, ARISING OUT OF OR RELATED TO THESE TERMS OR THE SERVICE, REGARDLESS OF THE THEORY OF LIABILITY. ORDINUM'S TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNTS PAID BY YOU TO ORDINUM IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM."
    ]
  },
  {
    "number": "15",
    "title": "Indemnification",
    "paragraphs": [
      "You agree to indemnify, defend, and hold harmless Ordinum and its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses, including reasonable attorneys' fees, arising out of or in any way connected with: (a) your use of the Service; (b) your violation of these Terms; (c) your violation of any third-party right; or (d) your Customer Content."
    ]
  },
  {
    "number": "16",
    "title": "Confidentiality",
    "paragraphs": [
      "Each party agrees to keep confidential any non-public information disclosed by the other party that is designated as confidential or that reasonably should be understood to be confidential. This obligation does not apply to information that: (a) becomes publicly available through no fault of the receiving party; (b) was known to the receiving party prior to disclosure; (c) is independently developed by the receiving party; or (d) is disclosed pursuant to a legal requirement."
    ]
  },
  {
    "number": "17",
    "title": "General Legal Terms",
    "paragraphs": [
      "These Terms constitute the entire agreement between you and Ordinum regarding the Service and supersede all prior agreements and understandings. If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full force and effect.",
      "Ordinum's failure to enforce any right or provision of these Terms will not be considered a waiver of such right or provision. Ordinum may assign these Terms without restriction; you may not assign these Terms without Ordinum's prior written consent.",
      "These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of law provisions. Any disputes arising from these Terms shall be resolved exclusively in the state or federal courts located in Delaware."
    ]
  }
];

const LAST_UPDATED = "Last updated: December 2025";
const CONTACT_LEAD = "If you have any questions about these Terms, please contact us at";

export default function TermsPage() {
  return (
    <div className="relative">
        <Container className="py-[79px] md:py-[125px]">
          <div className="mx-auto max-w-[72ch]">
            <Kicker>Legal / Terms</Kicker>
            <h1 className="mt-6 text-[clamp(39px,5vw,64px)] font-semibold leading-[1.05] tracking-[-0.06em] text-text">
              Terms of Service
            </h1>
            <p className="mt-6 text-[17px] leading-[1.75] tracking-[-0.01em] text-muted">{INTRO}</p>

            <div className="mt-16 border-t border-line">
              {SECTIONS.map((section) => (
                <section
                  key={section.number}
                  aria-labelledby={`terms-${section.number}-n terms-${section.number}`}
                  className="grid gap-4 border-b border-line py-10 md:grid-cols-[64px_1fr] md:gap-6"
                >
                  <span id={`terms-${section.number}-n`} className="pt-1 font-mono text-[11px] tracking-[0.14em] text-lime">
                    {section.number}.
                  </span>
                  <div>
                    <h2
                      id={`terms-${section.number}`}
                      className="text-[21px] font-semibold leading-[1.3] tracking-[-0.03em] text-text"
                    >
                      {section.title}
                    </h2>
                    <div className="mt-4 space-y-4">
                      {section.paragraphs.map((paragraph, i) => (
                        <p key={i} className="text-[15.5px] leading-[1.8] text-muted">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </section>
              ))}
            </div>

            <footer className="mt-10 font-mono text-[12px] leading-[1.8] text-subtle">
              <p>{LAST_UPDATED}</p>
              <p className="mt-2">
                {CONTACT_LEAD}{" "}
                <a
                  href="mailto:armaan@ordinum.org"
                  className="text-text underline decoration-line-2 underline-offset-4 transition-colors hover:text-lime hover:decoration-lime"
                >
                  armaan@ordinum.org
                </a>
              </p>
            </footer>
          </div>
        </Container>
    </div>
  );
}
