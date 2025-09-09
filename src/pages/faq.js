import { useState } from 'react';
import Head from 'next/head';
import MainLayout from '../layouts/MainLayout';

function FAQ() {
  const [openQuestion, setOpenQuestion] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "What is the MABA/NSC Level I Certification?",
      answer: "The MABA/NSC Level I Certification is the foundational basketball coaching certification program that covers essential coaching principles, basketball fundamentals, and safety protocols."
    },
    {
      id: 2,
      question: "How long does it take to complete the certification?",
      answer: "The certification program consists of 12 interactive modules that can be completed at your own pace. Most coaches complete the program within 2-4 weeks."
    },
    {
      id: 3,
      question: "What are the requirements to get certified?",
      answer: "You need to complete all 12 learning modules, pass the assessments with a minimum score of 70%, and complete the final certification quiz."
    },
    {
      id: 4,
      question: "Is there a cost for the certification?",
      answer: "Please contact our support team for current pricing information and available payment options."
    },
    {
      id: 5,
      question: "Can I access the materials offline?",
      answer: "The platform requires an internet connection for the interactive modules and assessments. However, some downloadable resources are available in the Resources section."
    },
    {
      id: 6,
      question: "What happens if I don't pass an assessment?",
      answer: "You can retake assessments multiple times. We recommend reviewing the module content and using the practice questions before retrying."
    },
    {
      id: 7,
      question: "How long is the certification valid?",
      answer: "The MABA/NSC Level I Certification is valid for 2 years. You'll need to complete a renewal course to maintain your certification status."
    },
    {
      id: 8,
      question: "Can I get a physical certificate?",
      answer: "Yes, upon successful completion, you'll receive a digital certificate immediately and can request a physical certificate to be mailed to you."
    }
  ];

  const toggleQuestion = (questionId) => {
    setOpenQuestion(openQuestion === questionId ? null : questionId);
  };

  return (
    <>
      <Head>
        <title>FAQ | alloui by CBL</title>
        <meta name="description" content="Frequently asked questions about the MABA/NSC Level I Basketball Coaching Certification program." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Icons & Manifest */}
        <link rel="icon" href="/icons/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="manifest" href="/icons/site.webmanifest" />
        <meta name="theme-color" content="#031a39" />
        
        {/* Social cards */}
        <meta property="og:title" content="FAQ | alloui by CBL" />
        <meta property="og:description" content="Frequently asked questions about the MABA/NSC Level I Basketball Coaching Certification program." />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="alloui by CBL" />
        <meta property="og:image" content="/icons/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="FAQ - alloui by CBL Basketball coaching certification" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FAQ | alloui by CBL" />
        <meta name="twitter:description" content="Frequently asked questions about the MABA/NSC Level I Basketball Coaching Certification program." />
        <meta name="twitter:image" content="/icons/twitter-card.png" />
        <meta name="twitter:creator" content="@CBLcoaching" />
        
        {/* SEO meta */}
        <meta name="keywords" content="FAQ, basketball coaching questions, MABA certification FAQ, NSC Level I questions, coaching certification help, Malaysia basketball, CBL FAQ" />
        <meta name="author" content="CBL" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="en-US" />
        <meta name="geo.region" content="MY" />
        <meta name="geo.country" content="Malaysia" />
      </Head>
      
      <div className="container mx-auto px-4 py-16 md:py-24 bg-white dark:bg-black text-gray-900 dark:text-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">
              07 / FREQUENTLY ASKED QUESTIONS
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Find answers to common questions about the MABA/NSC Level I Basketball Coaching Certification program.
            </p>
          </div>

          <div className="space-y-4 mb-12">
            {faqs.map((faq) => (
              <div key={faq.id} className="brand-card">
                <button
                  onClick={() => toggleQuestion(faq.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  aria-expanded={openQuestion === faq.id}
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {faq.question}
                  </h3>
                  <svg
                    className={`w-5 h-5 text-alloui-gold transition-transform ${
                      openQuestion === faq.id ? 'transform rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openQuestion === faq.id && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <section className="bg-alloui-primary text-white rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">
              Still have questions?
            </h2>
            <p className="text-blue-100 mb-6">
              Our support team is here to help you with any questions about the certification program.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/contact" className="btn-alloui bg-alloui-gold text-black px-6 py-3 rounded-lg inline-block">
                Contact Support
              </a>
              <a href="/modules" className="btn btn-outline border-white text-white hover:bg-white hover:text-alloui-primary px-6 py-3 rounded-lg inline-block">
                Start Learning
              </a>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

FAQ.getLayout = function getLayout(page) {
  return (
    <MainLayout>
      {page}
    </MainLayout>
  );
};

export default FAQ;