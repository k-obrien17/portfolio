export default function StructuredData() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Keith O'Brien",
    url: "https://keithobrien.com",
    jobTitle: "B2B Tech Ghostwriter",
    description:
      "B2B tech ghostwriter helping executives and companies create thought leadership content that builds authority and drives results.",
    sameAs: [
      "https://www.linkedin.com/in/keithobrien/",
      "https://github.com/k-obrien17",
    ],
    worksFor: {
      "@type": "Organization",
      name: "Total Emphasis",
      url: "https://totalemphasis.com",
    },
    knowsAbout: [
      "B2B Content Marketing",
      "Ghostwriting",
      "Thought Leadership",
      "Content Strategy",
      "Executive Communications",
      "LinkedIn Content",
      "Technology Marketing",
    ],
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Total Emphasis",
    url: "https://totalemphasis.com",
    founder: {
      "@type": "Person",
      name: "Keith O'Brien",
    },
    description:
      "Content consultancy specializing in B2B tech ghostwriting and thought leadership.",
    areaServed: "Worldwide",
    serviceType: [
      "Ghostwriting",
      "Content Strategy",
      "Thought Leadership",
      "Executive Communications",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Keith O'Brien - B2B Tech Ghostwriter",
    url: "https://keithobrien.com",
    description:
      "Portfolio of Keith O'Brien, B2B tech ghostwriter helping executives build authority through content.",
    author: {
      "@type": "Person",
      name: "Keith O'Brien",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
    </>
  );
}
