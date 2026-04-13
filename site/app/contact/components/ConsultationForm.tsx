"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FormData {
  // Step 1 - Contact info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  // Step 2 - Project details
  projectType: string;
  budget: string;
  timeline: string;
  currentWebsite: string;
  challenges: string;
  // Step 3 - Additional notes + submit
  services: string[];
  communicationPreference: string;
  additionalInfo: string;
  termsAccepted: boolean;
  newsletterOptIn: boolean;
}

// ---------------------------------------------------------------------------
// Option data
// ---------------------------------------------------------------------------

const roleOptions = [
  { value: "founder", label: "Founder / CEO" },
  { value: "cmo", label: "CMO / Marketing Director" },
  { value: "cto", label: "CTO / Tech Lead" },
  { value: "designer", label: "Head of Design" },
  { value: "manager", label: "Project Manager" },
  { value: "other", label: "Other" },
];

const projectTypeOptions = [
  { value: "new-brand", label: "Complete Brand Creation" },
  { value: "rebrand", label: "Brand Refresh / Rebrand" },
  { value: "website", label: "Website Design & Development" },
  { value: "marketing", label: "Digital Marketing Campaign" },
  { value: "strategy", label: "Strategic Consulting" },
  { value: "other", label: "Something Else" },
];

const budgetOptions = [
  { value: "under-25k", label: "Under $25,000" },
  { value: "25k-50k", label: "$25,000 - $50,000" },
  { value: "50k-100k", label: "$50,000 - $100,000" },
  { value: "100k-250k", label: "$100,000 - $250,000" },
  { value: "over-250k", label: "Over $250,000" },
  { value: "not-sure", label: "Not Sure Yet" },
];

const timelineOptions = [
  { value: "asap", label: "ASAP (Within 2 weeks)" },
  { value: "1-month", label: "Within 1 month" },
  { value: "1-3-months", label: "1-3 months" },
  { value: "3-6-months", label: "3-6 months" },
  { value: "flexible", label: "Flexible timeline" },
];

const serviceOptions = [
  { value: "brand-strategy", label: "Brand Strategy" },
  { value: "visual-identity", label: "Visual Identity Design" },
  { value: "web-design", label: "Web Design" },
  { value: "web-development", label: "Web Development" },
  { value: "digital-marketing", label: "Digital Marketing" },
  { value: "content-creation", label: "Content Creation" },
  { value: "seo", label: "SEO Optimization" },
  { value: "consulting", label: "Strategic Consulting" },
];

const communicationOptions = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone Call" },
  { value: "video", label: "Video Call" },
  { value: "in-person", label: "In-Person Meeting" },
];

// ---------------------------------------------------------------------------
// Shared input styles (RULE27 pattern)
// ---------------------------------------------------------------------------

const inputBase: React.CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  fontFamily: "Helvetica Neue, sans-serif",
  fontSize: "15px",
  color: "#111111",
  background: "#FFFFFF",
  border: "1px solid rgba(0,0,0,0.1)",
  borderLeft: "2px solid transparent",
  borderRadius: "2px",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

const inputFocusHandler = (
  e: React.FocusEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >
) => {
  e.currentTarget.style.borderLeftColor = "#E53E3E";
  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(229,62,62,0.06)";
};

const inputBlurHandler = (
  e: React.FocusEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >
) => {
  e.currentTarget.style.borderLeftColor = "transparent";
  e.currentTarget.style.boxShadow = "none";
};

// ---------------------------------------------------------------------------
// Step labels for the progress indicator
// ---------------------------------------------------------------------------

const TOTAL_STEPS = 3;

const stepLabels = [
  { number: 1, title: "Contact Info" },
  { number: 2, title: "Project Details" },
  { number: 3, title: "Review & Submit" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ConsultationForm() {
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      role: "",
      projectType: "",
      budget: "",
      timeline: "",
      currentWebsite: "",
      challenges: "",
      services: [],
      communicationPreference: "",
      additionalInfo: "",
      termsAccepted: false,
      newsletterOptIn: false,
    },
  });

  const watchedServices = watch("services");

  // Validate current step fields before advancing
  const stepFields: Record<number, (keyof FormData)[]> = {
    1: ["firstName", "lastName", "email", "phone", "company"],
    2: ["projectType", "budget", "timeline", "challenges"],
    3: ["termsAccepted"],
  };

  const goNext = async () => {
    const valid = await trigger(stepFields[step]);
    if (valid && step < TOTAL_STEPS) setStep(step + 1);
  };

  const goPrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const onSubmit = async (data: FormData) => {
    setSubmitError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          phone: data.phone,
          company: data.company,
          service: data.projectType,
          budget: data.budget,
          timeline: data.timeline,
          message: [
            `Role: ${data.role}`,
            `Timeline: ${data.timeline}`,
            `Services: ${data.services.join(", ")}`,
            `Communication: ${data.communicationPreference}`,
            `Challenges: ${data.challenges}`,
            data.additionalInfo ? `Notes: ${data.additionalInfo}` : "",
          ]
            .filter(Boolean)
            .join("\n"),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(
          body.error || "Failed to submit form"
        );
      }

      setIsSuccess(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Failed to submit form. Please try again or contact us at hello@rule27design.com"
      );
    }
  };

  // -----------------------------------------------------------------------
  // Success state
  // -----------------------------------------------------------------------
  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          background: "#FFFFFF",
          border: "1px solid rgba(0,0,0,0.06)",
          borderRadius: "2px",
          padding: "3rem 2rem",
          textAlign: "center",
          boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
        }}
      >
        {/* Check icon */}
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            background: "rgba(16,185,129,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#10B981"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>

        <h2
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(1.5rem, 4vw, 2rem)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#111111",
            margin: "0 0 0.75rem",
            lineHeight: 1.1,
          }}
        >
          Submission Successful!
        </h2>

        <p
          style={{
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "15px",
            color: "rgba(0,0,0,0.5)",
            maxWidth: "440px",
            margin: "0 auto 2rem",
            lineHeight: 1.6,
          }}
        >
          Thank you for reaching out to Rule27 Design. We&apos;ve received your
          consultation request and will be in touch within 24 hours.
        </p>

        {/* Next steps */}
        <div
          style={{
            background: "rgba(229,62,62,0.03)",
            border: "1px solid rgba(229,62,62,0.1)",
            borderRadius: "2px",
            padding: "1.5rem",
            maxWidth: "440px",
            margin: "0 auto",
            textAlign: "left",
          }}
        >
          <h4
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "0.85rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#111111",
              margin: "0 0 1rem",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#E53E3E"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            What Happens Next?
          </h4>
          <ol
            style={{
              margin: 0,
              padding: "0 0 0 1.25rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            {[
              "We'll review your submission within 24 hours",
              "A strategy expert will reach out to schedule your consultation",
              "We'll prepare a custom proposal based on your needs",
              "Your transformation journey begins!",
            ].map((item, i) => (
              <li
                key={i}
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "13px",
                  color: "rgba(0,0,0,0.55)",
                  lineHeight: 1.6,
                }}
              >
                {item}
              </li>
            ))}
          </ol>
        </div>
      </motion.div>
    );
  }

  // -----------------------------------------------------------------------
  // Multi-step form
  // -----------------------------------------------------------------------
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        background: "#FFFFFF",
        border: "1px solid rgba(0,0,0,0.06)",
        borderRadius: "2px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
        overflow: "hidden",
      }}
    >
      {/* ================================================================ */}
      {/* PROGRESS INDICATOR                                               */}
      {/* ================================================================ */}
      <div
        style={{
          padding: "1.5rem 2rem",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          background: "#FAFAFA",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.25rem",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.125rem, 3vw, 1.5rem)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#111111",
              margin: 0,
            }}
          >
            Start Your Journey
          </h2>
          <span
            style={{
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: "13px",
              color: "rgba(0,0,0,0.4)",
            }}
          >
            Step {step} of {TOTAL_STEPS}
          </span>
        </div>

        {/* Step circles with connecting lines */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0,
          }}
        >
          {stepLabels.map((s, i) => {
            const isCompleted = s.number < step;
            const isActive = s.number === step;
            const isFuture = s.number > step;

            return (
              <div
                key={s.number}
                style={{
                  display: "flex",
                  alignItems: "center",
                  flex: i < stepLabels.length - 1 ? 1 : "none",
                }}
              >
                {/* Circle + label */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "6px",
                    minWidth: "60px",
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-heading)",
                      fontSize: "14px",
                      letterSpacing: "0.05em",
                      transition: "all 0.3s",
                      ...(isCompleted
                        ? {
                            background: "#10B981",
                            color: "#FFFFFF",
                          }
                        : isActive
                          ? {
                              background: "#E53E3E",
                              color: "#FFFFFF",
                            }
                          : {
                              background: "rgba(0,0,0,0.06)",
                              color: "rgba(0,0,0,0.3)",
                            }),
                    }}
                  >
                    {isCompleted ? (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      s.number
                    )}
                  </div>
                  <span
                    style={{
                      fontFamily: "Helvetica Neue, sans-serif",
                      fontSize: "10px",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: isActive
                        ? "#E53E3E"
                        : isCompleted
                          ? "#10B981"
                          : "rgba(0,0,0,0.3)",
                      whiteSpace: "nowrap",
                      transition: "color 0.3s",
                    }}
                  >
                    {s.title}
                  </span>
                </div>

                {/* Connecting line */}
                {i < stepLabels.length - 1 && (
                  <div
                    style={{
                      flex: 1,
                      height: "2px",
                      marginBottom: "22px",
                      marginLeft: "8px",
                      marginRight: "8px",
                      background: isCompleted
                        ? "#10B981"
                        : "rgba(0,0,0,0.08)",
                      transition: "background 0.3s",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ================================================================ */}
      {/* FORM BODY                                                        */}
      {/* ================================================================ */}
      <div style={{ padding: "2rem" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {step === 1 && (
              <StepContact register={register} errors={errors} />
            )}
            {step === 2 && (
              <StepProject register={register} errors={errors} />
            )}
            {step === 3 && (
              <StepNotes
                register={register}
                errors={errors}
                getValues={getValues}
                watchedServices={watchedServices}
                setValue={setValue}
                submitError={submitError}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* ============================================================ */}
        {/* NAVIGATION BUTTONS                                            */}
        {/* ============================================================ */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
            marginTop: "2rem",
          }}
        >
          <button
            type="button"
            onClick={goPrev}
            disabled={step === 1}
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "13px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "12px 28px",
              background: "transparent",
              color: step === 1 ? "rgba(0,0,0,0.2)" : "#E53E3E",
              border: `1px solid ${step === 1 ? "rgba(0,0,0,0.08)" : "#E53E3E"}`,
              cursor: step === 1 ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Previous
          </button>

          {step < TOTAL_STEPS ? (
            <button
              type="button"
              onClick={goNext}
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "13px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "12px 28px",
                background:
                  "linear-gradient(135deg, #E53E3E 0%, #C53030 100%)",
                color: "#FFFFFF",
                border: "1px solid #E53E3E",
                cursor: "pointer",
                transition: "opacity 0.2s",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              Next Step
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "13px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "12px 28px",
                background: isSubmitting
                  ? "rgba(229,62,62,0.6)"
                  : "linear-gradient(135deg, #E53E3E 0%, #C53030 100%)",
                color: "#FFFFFF",
                border: "1px solid #E53E3E",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                transition: "opacity 0.2s",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {isSubmitting ? (
                <>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{
                      animation: "spin 1s linear infinite",
                    }}
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  Submit Request
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Spinner keyframes */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </form>
  );
}

// ===========================================================================
// Step 1 -- Contact Info
// ===========================================================================

/* eslint-disable @typescript-eslint/no-explicit-any */
function StepContact({
  register,
  errors,
}: {
  register: any;
  errors: any;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div>
        <h3
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(1.25rem, 3vw, 1.5rem)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#111111",
            margin: "0 0 0.25rem",
          }}
        >
          Let&apos;s Get Acquainted
        </h3>
        <p
          style={{
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "14px",
            color: "rgba(0,0,0,0.45)",
            margin: 0,
          }}
        >
          Tell us who you are and how we can reach you.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
        }}
      >
        <FieldWrapper
          label="First Name"
          error={errors.firstName?.message}
          required
        >
          <input
            {...register("firstName", { required: "First name is required" })}
            placeholder="John"
            style={inputBase}
            onFocus={inputFocusHandler}
            onBlur={inputBlurHandler}
          />
        </FieldWrapper>
        <FieldWrapper
          label="Last Name"
          error={errors.lastName?.message}
          required
        >
          <input
            {...register("lastName", { required: "Last name is required" })}
            placeholder="Doe"
            style={inputBase}
            onFocus={inputFocusHandler}
            onBlur={inputBlurHandler}
          />
        </FieldWrapper>
      </div>

      <FieldWrapper
        label="Email Address"
        error={errors.email?.message}
        required
      >
        <input
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Invalid email format",
            },
          })}
          placeholder="john@company.com"
          style={inputBase}
          onFocus={inputFocusHandler}
          onBlur={inputBlurHandler}
        />
      </FieldWrapper>

      <FieldWrapper
        label="Phone Number"
        error={errors.phone?.message}
        required
      >
        <input
          type="tel"
          {...register("phone", { required: "Phone number is required" })}
          placeholder="+1 (555) 123-4567"
          style={inputBase}
          onFocus={inputFocusHandler}
          onBlur={inputBlurHandler}
        />
      </FieldWrapper>

      <FieldWrapper
        label="Company Name"
        error={errors.company?.message}
        required
      >
        <input
          {...register("company", { required: "Company name is required" })}
          placeholder="Awesome Company Inc."
          style={inputBase}
          onFocus={inputFocusHandler}
          onBlur={inputBlurHandler}
        />
      </FieldWrapper>

      <FieldWrapper label="Your Role">
        <select
          {...register("role")}
          style={{ ...inputBase, cursor: "pointer" }}
          onFocus={inputFocusHandler as any}
          onBlur={inputBlurHandler as any}
        >
          <option value="">Select your role</option>
          {roleOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </FieldWrapper>
    </div>
  );
}

// ===========================================================================
// Step 2 -- Project Details
// ===========================================================================

function StepProject({
  register,
  errors,
}: {
  register: any;
  errors: any;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div>
        <h3
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(1.25rem, 3vw, 1.5rem)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#111111",
            margin: "0 0 0.25rem",
          }}
        >
          Tell Us About Your Project
        </h3>
        <p
          style={{
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "14px",
            color: "rgba(0,0,0,0.45)",
            margin: 0,
          }}
        >
          Help us understand your vision and requirements.
        </p>
      </div>

      <FieldWrapper
        label="Service Interest"
        error={errors.projectType?.message}
        required
      >
        <select
          {...register("projectType", {
            required: "Please select a project type",
          })}
          style={{ ...inputBase, cursor: "pointer" }}
          onFocus={inputFocusHandler as any}
          onBlur={inputBlurHandler as any}
        >
          <option value="">What do you need help with?</option>
          {projectTypeOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </FieldWrapper>

      <FieldWrapper
        label="Budget Range"
        error={errors.budget?.message}
        required
      >
        <select
          {...register("budget", {
            required: "Please select a budget range",
          })}
          style={{ ...inputBase, cursor: "pointer" }}
          onFocus={inputFocusHandler as any}
          onBlur={inputBlurHandler as any}
        >
          <option value="">Select your budget range</option>
          {budgetOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </FieldWrapper>

      <FieldWrapper
        label="Timeline"
        error={errors.timeline?.message}
        required
      >
        <select
          {...register("timeline", {
            required: "Please select a timeline",
          })}
          style={{ ...inputBase, cursor: "pointer" }}
          onFocus={inputFocusHandler as any}
          onBlur={inputBlurHandler as any}
        >
          <option value="">When do you need this completed?</option>
          {timelineOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </FieldWrapper>

      <FieldWrapper label="Current Website (optional)">
        <input
          type="url"
          {...register("currentWebsite")}
          placeholder="https://yourwebsite.com"
          style={inputBase}
          onFocus={inputFocusHandler}
          onBlur={inputBlurHandler}
        />
      </FieldWrapper>

      <FieldWrapper
        label="Project Description"
        error={errors.challenges?.message}
        required
      >
        <textarea
          {...register("challenges", {
            required: "Please describe your project goals and challenges",
          })}
          rows={4}
          placeholder="Tell us about your current challenges and what you hope to achieve..."
          style={{
            ...inputBase,
            resize: "vertical" as const,
          }}
          onFocus={inputFocusHandler as any}
          onBlur={inputBlurHandler as any}
        />
      </FieldWrapper>
    </div>
  );
}

// ===========================================================================
// Step 3 -- Additional notes + Review + Submit
// ===========================================================================

function StepNotes({
  register,
  errors,
  getValues,
  watchedServices,
  setValue,
  submitError,
}: {
  register: any;
  errors: any;
  getValues: any;
  watchedServices: string[];
  setValue: any;
  submitError: string | null;
}) {
  const values = getValues();

  const toggleService = (serviceValue: string) => {
    const current: string[] = watchedServices || [];
    const updated = current.includes(serviceValue)
      ? current.filter((s: string) => s !== serviceValue)
      : [...current, serviceValue];
    setValue("services", updated);
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
    >
      <div>
        <h3
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(1.25rem, 3vw, 1.5rem)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#111111",
            margin: "0 0 0.25rem",
          }}
        >
          Almost There!
        </h3>
        <p
          style={{
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "14px",
            color: "rgba(0,0,0,0.45)",
            margin: 0,
          }}
        >
          Select services, add any notes, and review before submitting.
        </p>
      </div>

      {/* Submit error */}
      {submitError && (
        <div
          style={{
            background: "rgba(239,68,68,0.06)",
            border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: "2px",
            padding: "0.75rem 1rem",
          }}
        >
          <p
            style={{
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: "13px",
              color: "#DC2626",
              margin: 0,
            }}
          >
            {submitError}
          </p>
        </div>
      )}

      {/* Services checkboxes */}
      <div>
        <label
          style={{
            display: "block",
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#111111",
            marginBottom: "0.75rem",
          }}
        >
          Services Needed
        </label>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.5rem",
          }}
        >
          {serviceOptions.map((s) => (
            <label
              key={s.value}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "14px",
                color: "rgba(0,0,0,0.65)",
                cursor: "pointer",
                padding: "8px 10px",
                borderRadius: "2px",
                background: (watchedServices || []).includes(s.value)
                  ? "rgba(229,62,62,0.05)"
                  : "transparent",
                border: (watchedServices || []).includes(s.value)
                  ? "1px solid rgba(229,62,62,0.15)"
                  : "1px solid transparent",
                transition: "all 0.2s",
              }}
            >
              <input
                type="checkbox"
                checked={(watchedServices || []).includes(s.value)}
                onChange={() => toggleService(s.value)}
                style={{ accentColor: "#E53E3E" }}
              />
              {s.label}
            </label>
          ))}
        </div>
      </div>

      {/* Communication preference */}
      <FieldWrapper label="Preferred Communication">
        <select
          {...register("communicationPreference")}
          style={{ ...inputBase, cursor: "pointer" }}
          onFocus={inputFocusHandler as any}
          onBlur={inputBlurHandler as any}
        >
          <option value="">How should we contact you?</option>
          {communicationOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </FieldWrapper>

      {/* Additional info */}
      <FieldWrapper label="Additional Information">
        <textarea
          {...register("additionalInfo")}
          rows={3}
          placeholder="Anything else you'd like us to know?"
          style={{ ...inputBase, resize: "vertical" as const }}
          onFocus={inputFocusHandler as any}
          onBlur={inputBlurHandler as any}
        />
      </FieldWrapper>

      {/* Summary card */}
      <div
        style={{
          background: "#FAFAFA",
          border: "1px solid rgba(0,0,0,0.06)",
          borderRadius: "2px",
          padding: "1.25rem 1.5rem",
        }}
      >
        <h4
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "0.85rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#111111",
            margin: "0 0 0.75rem",
          }}
        >
          Summary
        </h4>
        <div
          style={{
            display: "grid",
            gap: "0.4rem",
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "14px",
          }}
        >
          {[
            ["Name", `${values.firstName} ${values.lastName}`],
            ["Company", values.company],
            [
              "Project",
              projectTypeOptions.find((o) => o.value === values.projectType)
                ?.label || "N/A",
            ],
            [
              "Budget",
              budgetOptions.find((o) => o.value === values.budget)?.label ||
                "N/A",
            ],
            [
              "Timeline",
              timelineOptions.find((o) => o.value === values.timeline)
                ?.label || "N/A",
            ],
          ].map(([label, val]) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span style={{ color: "rgba(0,0,0,0.4)" }}>{label}:</span>
              <span style={{ color: "#111111" }}>{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* What happens next */}
      <div
        style={{
          background: "rgba(229,62,62,0.03)",
          border: "1px solid rgba(229,62,62,0.1)",
          borderRadius: "2px",
          padding: "1.25rem 1.5rem",
        }}
      >
        <h4
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "0.85rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#111111",
            margin: "0 0 0.75rem",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#E53E3E"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          What Happens Next?
        </h4>
        <ol
          style={{
            margin: 0,
            padding: "0 0 0 1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.35rem",
          }}
        >
          {[
            "We'll review your submission within 24 hours",
            "A strategy expert will reach out to schedule your consultation",
            "We'll prepare a custom proposal based on your needs",
            "Your transformation journey begins!",
          ].map((item, i) => (
            <li
              key={i}
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "13px",
                color: "rgba(0,0,0,0.55)",
                lineHeight: 1.6,
              }}
            >
              {item}
            </li>
          ))}
        </ol>
      </div>

      {/* Terms */}
      <div
        style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
      >
        <label
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "14px",
            color: "rgba(0,0,0,0.65)",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            {...register("termsAccepted", {
              required: "You must accept the terms to proceed",
            })}
            style={{ accentColor: "#E53E3E", marginTop: "3px" }}
          />
          <span>
            I accept the terms of service and privacy policy{" "}
            <span style={{ color: "#E53E3E" }}>*</span>
          </span>
        </label>
        {errors.termsAccepted && (
          <p
            style={{
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: "12px",
              color: "#DC2626",
              margin: 0,
              paddingLeft: "28px",
            }}
          >
            {errors.termsAccepted.message as string}
          </p>
        )}

        <label
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "14px",
            color: "rgba(0,0,0,0.65)",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            {...register("newsletterOptIn")}
            style={{ accentColor: "#E53E3E", marginTop: "3px" }}
          />
          Send me occasional updates about Rule27 Design&apos;s innovations
        </label>
      </div>
    </div>
  );
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// ===========================================================================
// Shared field wrapper
// ===========================================================================

function FieldWrapper({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontFamily: "Helvetica Neue, sans-serif",
          fontSize: "11px",
          fontWeight: 600,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "#111111",
          marginBottom: "0.5rem",
        }}
      >
        {label}
        {required && (
          <span style={{ color: "#E53E3E", marginLeft: "4px" }}>*</span>
        )}
      </label>
      {children}
      {error && (
        <p
          style={{
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "12px",
            color: "#DC2626",
            margin: "0.25rem 0 0",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
