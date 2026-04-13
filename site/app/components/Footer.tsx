import Link from "next/link";
import { Logo } from "./Logo";

const footerLinks = {
  explore: [
    { name: "Capabilities", path: "/capabilities" },
    { name: "Case Studies", path: "/case-studies" },
    { name: "Articles", path: "/articles" },
    { name: "Innovation", path: "/innovation" },
    { name: "About", path: "/about" },
  ],
  connect: [
    { name: "Start Consultation", path: "/contact" },
    {
      name: "hello@rule27design.com",
      href: "mailto:hello@rule27design.com",
      external: true,
    },
    {
      name: "+1 (555) RULE-27",
      href: "tel:+15557853277",
      external: true,
    },
  ] as Array<{
    name: string;
    path?: string;
    href?: string;
    external?: boolean;
  }>,
  legal: [
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms of Service", path: "/terms" },
    { name: "Cookies", path: "/cookies" },
  ],
};

const socialLinks = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/rule27design",
    svg: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/Rule27Design/",
    svg: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/rule27design",
    svg: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    name: "GitHub",
    href: "https://github.com/rule27design",
    svg: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>
    ),
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "#0A0A0A",
        color: "#FFFFFF",
        borderTop: "2px solid #E53E3E",
        position: "relative",
      }}
    >
      {/* CSS-only hover styles for Server Component compatibility */}
      <style>{`
        .r27-footer-link {
          font-family: var(--font-body, 'Helvetica Neue'), Helvetica, Arial, sans-serif;
          font-size: 0.875rem;
          color: rgba(255,255,255,0.45);
          transition: color 0.2s ease;
          text-decoration: none;
        }
        .r27-footer-link:hover {
          color: #E53E3E;
        }
        .r27-social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: rgba(255,255,255,0.06);
          border-radius: 2px;
          color: rgba(255,255,255,0.5);
          transition: all 0.2s ease;
        }
        .r27-social-link:hover {
          background: rgba(229,62,62,0.15);
          color: #E53E3E;
        }
      `}</style>

      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "4rem 1.5rem 2rem",
        }}
      >
        {/* Main grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "3rem",
            marginBottom: "3rem",
          }}
        >
          {/* Brand section */}
          <div style={{ gridColumn: "span 1" }}>
            <div style={{ marginBottom: "1.5rem" }}>
              <Logo variant="white-red" height={36} linked={false} />
            </div>
            <p
              style={{
                fontFamily:
                  "var(--font-body, 'Helvetica Neue'), Helvetica, Arial, sans-serif",
                fontSize: "0.875rem",
                color: "rgba(255,255,255,0.5)",
                lineHeight: 1.7,
                maxWidth: "320px",
                margin: "0 0 1.5rem 0",
              }}
            >
              The creative partner that breaks conventional boundaries and makes
              other agencies look ordinary. Where creative audacity meets
              technical precision.
            </p>

            {/* Social links */}
            <div style={{ display: "flex", gap: "0.75rem" }}>
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit Rule27 Design on ${social.name}`}
                  className="r27-social-link"
                >
                  {social.svg}
                </a>
              ))}
            </div>
          </div>

          {/* Explore links */}
          <div>
            <h4
              style={{
                fontFamily:
                  "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                fontSize: "14px",
                fontWeight: 400,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.8)",
                marginBottom: "1rem",
                borderLeft: "2px solid #E53E3E",
                paddingLeft: "0.75rem",
              }}
            >
              Explore
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {footerLinks.explore.map((link) => (
                <li key={link.path} style={{ marginBottom: "0.5rem" }}>
                  <Link href={link.path} className="r27-footer-link">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect links */}
          <div>
            <h4
              style={{
                fontFamily:
                  "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                fontSize: "14px",
                fontWeight: 400,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.8)",
                marginBottom: "1rem",
                borderLeft: "2px solid #E53E3E",
                paddingLeft: "0.75rem",
              }}
            >
              Connect
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {footerLinks.connect.map((link) => (
                <li
                  key={link.path || link.href}
                  style={{ marginBottom: "0.5rem" }}
                >
                  {link.external ? (
                    <a href={link.href} className="r27-footer-link">
                      {link.name}
                    </a>
                  ) : (
                    <Link href={link.path!} className="r27-footer-link">
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h4
              style={{
                fontFamily:
                  "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                fontSize: "14px",
                fontWeight: 400,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.8)",
                marginBottom: "1rem",
                borderLeft: "2px solid #E53E3E",
                paddingLeft: "0.75rem",
              }}
            >
              Legal
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {footerLinks.legal.map((link) => (
                <li key={link.path} style={{ marginBottom: "0.5rem" }}>
                  <Link href={link.path} className="r27-footer-link">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            paddingTop: "1.5rem",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <p
            style={{
              fontFamily:
                "var(--font-body, 'Helvetica Neue'), Helvetica, Arial, sans-serif",
              fontSize: "0.75rem",
              color: "rgba(255,255,255,0.3)",
              margin: 0,
            }}
          >
            &copy; {currentYear} Rule27 Design - Digital Powerhouse. All rights
            reserved.
          </p>

          {/* Status indicator */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#10B981",
                boxShadow: "0 0 6px rgba(16,185,129,0.4)",
              }}
              aria-hidden="true"
            />
            <span
              style={{
                fontFamily:
                  "var(--font-body, 'Helvetica Neue'), Helvetica, Arial, sans-serif",
                fontSize: "0.7rem",
                color: "rgba(255,255,255,0.3)",
              }}
            >
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
