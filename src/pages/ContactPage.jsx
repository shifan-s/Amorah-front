import { useState } from 'react';
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import {
  FiArrowUpRight,
  FiCheck,
  FiClock,
  FiMail,
  FiMapPin,
  FiMessageCircle,
  FiPhone,
  FiSend,
  FiShoppingBag,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import Container from '../components/common/Container.jsx';
import Seo from '../components/common/Seo.jsx';
import contactAmorahImage from '../assets/images/contactamo.jpeg';
import api from '../services/api.js';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
};

const contactSettings = {
  email: import.meta.env.VITE_AMORAH_SUPPORT_EMAIL || import.meta.env.VITE_SUPPORT_EMAIL || '',
  phone: import.meta.env.VITE_AMORAH_BUSINESS_PHONE || import.meta.env.VITE_BUSINESS_PHONE || '',
  businessHours: import.meta.env.VITE_AMORAH_BUSINESS_HOURS || import.meta.env.VITE_BUSINESS_HOURS || '',
  addressLine1: import.meta.env.VITE_AMORAH_ADDRESS_LINE_1 || import.meta.env.VITE_BUSINESS_ADDRESS_LINE_1 || '',
  addressLine2: import.meta.env.VITE_AMORAH_ADDRESS_LINE_2 || import.meta.env.VITE_BUSINESS_ADDRESS_LINE_2 || '',
  city: import.meta.env.VITE_AMORAH_CITY || import.meta.env.VITE_BUSINESS_CITY || '',
  state: import.meta.env.VITE_AMORAH_STATE || import.meta.env.VITE_BUSINESS_STATE || '',
  postalCode: import.meta.env.VITE_AMORAH_POSTAL_CODE || import.meta.env.VITE_BUSINESS_POSTAL_CODE || '',
  country: import.meta.env.VITE_AMORAH_COUNTRY || import.meta.env.VITE_BUSINESS_COUNTRY || '',
  mapUrl: import.meta.env.VITE_AMORAH_MAP_URL || import.meta.env.VITE_BUSINESS_MAP_URL || '',
  whatsappUrl: import.meta.env.VITE_AMORAH_WHATSAPP_URL || import.meta.env.VITE_WHATSAPP_URL || '',
  whatsappNumber: import.meta.env.VITE_AMORAH_WHATSAPP_NUMBER || import.meta.env.VITE_WHATSAPP_NUMBER || '',
  instagramUrl: import.meta.env.VITE_AMORAH_INSTAGRAM_URL || import.meta.env.VITE_INSTAGRAM_URL || '',
  facebookUrl: import.meta.env.VITE_AMORAH_FACEBOOK_URL || import.meta.env.VITE_FACEBOOK_URL || '',
};

const fieldBaseClasses =
  'mt-2 block w-full border bg-amorah-ivory/60 px-4 text-sm text-amorah-black outline-none transition duration-200 placeholder:text-amorah-muted hover:border-amorah-brown/40 focus:border-amorah-maroon focus:bg-amorah-white focus:ring-2 focus:ring-amorah-maroon/10';

function getInputClasses(hasError) {
  return `${fieldBaseClasses} h-11 sm:h-12 ${
    hasError ? 'border-amorah-error focus:border-amorah-error focus:ring-amorah-error/10' : 'border-amorah-border'
  }`;
}

function getTextareaClasses(hasError) {
  return `${fieldBaseClasses} min-h-28 resize-y py-3 sm:min-h-32 sm:py-4 ${
    hasError ? 'border-amorah-error focus:border-amorah-error focus:ring-amorah-error/10' : 'border-amorah-border'
  }`;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
  if (!phone.trim()) {
    return true;
  }

  const digits = phone.replace(/\D/g, '');
  return /^(?:91)?[6-9]\d{9}$/.test(digits);
}

function getAddress() {
  const cityLine = [contactSettings.city, contactSettings.state, contactSettings.postalCode]
    .filter(Boolean)
    .join(', ');

  return [contactSettings.addressLine1, contactSettings.addressLine2, cityLine, contactSettings.country]
    .filter(Boolean)
    .join(', ');
}

function getWhatsappHref() {
  if (contactSettings.whatsappUrl) {
    return contactSettings.whatsappUrl;
  }

  const digits = contactSettings.whatsappNumber.replace(/\D/g, '');
  return digits ? `https://wa.me/${digits}` : '';
}

function ContactDetail({ icon, label, value, fallback, href }) {
  const content = value || fallback;
  const isAvailable = Boolean(value);

  const contentElement = href && isAvailable ? (
    <a
      href={href}
      className="mt-1.5 inline-flex items-start gap-1.5 text-sm font-semibold leading-6 text-amorah-black transition hover:text-amorah-maroon"
    >
      <span>{content}</span>
      <FiArrowUpRight className="mt-1 shrink-0 text-sm" aria-hidden="true" />
    </a>
  ) : (
    <p className={`mt-1.5 text-sm font-semibold leading-6 ${isAvailable ? 'text-amorah-black' : 'text-amorah-muted'}`}>
      {content}
    </p>
  );

  return (
    <article className="group flex gap-3 border-b border-amorah-border/80 py-3.5 last:border-b-0 sm:gap-4 sm:py-4">
      <span className="grid h-9 w-9 shrink-0 place-items-center border border-amorah-border bg-amorah-ivory text-base text-amorah-maroon transition group-hover:border-amorah-maroon/40 group-hover:bg-amorah-light sm:h-10 sm:w-10 sm:text-lg">
        {icon}
      </span>

      <div className="min-w-0 pt-0.5">
        <h2 className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-amorah-brown">{label}</h2>
        {contentElement}
      </div>
    </article>
  );
}

function SocialLink({ href, label, icon }) {
  if (!href) {
    return (
      <span
        className="grid h-11 w-11 shrink-0 place-items-center border border-amorah-maroon/25 bg-amorah-ivory text-lg text-amorah-maroon"
        aria-label={`${label} link coming soon`}
        aria-disabled="true"
        title={`${label} link coming soon`}
      >
        {icon}
      </span>
    );
  }

  return (
    <a
      href={href}
      className="amorah-focus grid h-11 w-11 shrink-0 place-items-center border border-amorah-maroon/30 bg-amorah-white text-lg text-amorah-maroon transition duration-200 hover:border-amorah-maroon hover:bg-amorah-maroon hover:text-amorah-white"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
    >
      {icon}
    </a>
  );
}

function EnquiryType({ icon, title, description }) {
  return (
    <article className="flex min-h-full flex-col items-center border border-amorah-border bg-amorah-white p-3 text-center transition duration-200 hover:-translate-y-0.5 hover:border-amorah-maroon/30 hover:shadow-[0_18px_45px_rgba(75,34,34,0.07)] sm:p-4 lg:items-start lg:text-left">
      <span className="grid h-9 w-9 place-items-center bg-amorah-light text-base text-amorah-maroon sm:h-10 sm:w-10 sm:text-lg">{icon}</span>
      <h3 className="mt-2 font-heading text-sm font-semibold leading-tight text-amorah-maroon sm:text-base lg:mt-3 lg:text-lg">{title}</h3>
      <p className="mt-1 hidden text-xs leading-5 text-amorah-brown lg:block">{description}</p>
    </article>
  );
}

function FieldError({ id, message }) {
  if (!message) {
    return null;
  }

  return (
    <span id={id} className="mt-1.5 block text-xs font-medium text-amorah-error" role="alert">
      {message}
    </span>
  );
}

function ContactPage() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const address = getAddress();
  const whatsappHref = getWhatsappHref();

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));

    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: '' }));
    }
  }

  function validateForm() {
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = 'Please enter your name.';
    }

    if (!form.email.trim()) {
      nextErrors.email = 'Please enter your email address.';
    } else if (!validateEmail(form.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    if (!validatePhone(form.phone)) {
      nextErrors.phone = 'Please enter a valid Indian mobile number.';
    }

    if (!form.subject.trim()) {
      nextErrors.subject = 'Please select an enquiry subject.';
    }

    if (!form.message.trim()) {
      nextErrors.message = 'Please tell us how we can help.';
    } else if (form.message.trim().length < 10) {
      nextErrors.message = 'Please enter at least 10 characters.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting || !validateForm()) {
      if (!isSubmitting) {
        toast.error('Please complete the highlighted fields.');
      }
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post('/contact/enquiries', form);
      toast.success('Thank you. Your enquiry has been sent to Amorah.');
      setForm(initialForm);
      setErrors({});
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to send your enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Seo
        title="Contact | Amorah"
        description="Contact Amorah N-ZAN Designs for order support, sizing guidance, styling questions and collaborations."
        path="/contact"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
        ]}
      />

      <main className="bg-amorah-ivory text-amorah-black">
        <section className="border-b border-amorah-border bg-amorah-light/70 py-8 sm:py-10 lg:py-12">
          <Container size="lg">
            <div className="grid items-end gap-4 lg:grid-cols-[1fr_0.55fr] lg:gap-10">
              <div className="max-w-4xl">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amorah-terracotta">Contact Amorah</p>
                <h1 className="mt-3 max-w-3xl font-heading text-3xl font-semibold leading-[1.08] text-amorah-maroon sm:text-4xl lg:text-5xl">
                  Personal help, thoughtful answers and effortless support.
                </h1>
              </div>

              <p className="max-w-md text-sm leading-6 text-amorah-brown sm:text-base sm:leading-7">
                Whether you need sizing advice, order support or help choosing the right piece, our team is here to make
                your Amorah experience simple and personal.
              </p>
            </div>
          </Container>
        </section>

        <section className="py-6 sm:py-8 lg:py-12">
          <Container size="lg">
            <div className="grid items-start gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:gap-8 xl:gap-10">
              <aside className="lg:sticky lg:top-20">
                <div className="overflow-hidden border border-amorah-border bg-amorah-white">
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-amorah-light">
                    <img
                      src={contactAmorahImage}
                      alt="Amorah contact and customer support"
                      className="h-full w-full object-cover object-center transition duration-700 hover:scale-[1.01]"
                      loading="eager"
                      decoding="async"
                    />
                  </div>

                  <div className="p-4 sm:p-5">
                    <div className="border-y border-amorah-border">
                      <ContactDetail
                        icon={<FiMapPin aria-hidden="true" />}
                        label="Studio location"
                        value={address}
                        fallback="Studio details coming soon"
                      />
                      <ContactDetail
                        icon={<FiMail aria-hidden="true" />}
                        label="Email support"
                        value={contactSettings.email}
                        fallback="Support email coming soon"
                        href={contactSettings.email ? `mailto:${contactSettings.email}` : ''}
                      />
                      <ContactDetail
                        icon={<FiPhone aria-hidden="true" />}
                        label="Call us"
                        value={contactSettings.phone}
                        fallback="Phone support coming soon"
                        href={contactSettings.phone ? `tel:${contactSettings.phone.replace(/\s/g, '')}` : ''}
                      />
                      <ContactDetail
                        icon={<FiClock aria-hidden="true" />}
                        label="Business hours"
                        value={contactSettings.businessHours}
                        fallback="Business hours coming soon"
                      />
                    </div>

                    <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                      <div className="min-w-0">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-amorah-brown">
                          Follow and message
                        </p>
                        <p className="mt-1 text-sm text-amorah-muted">Connect with Amorah online.</p>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <SocialLink
                          href={whatsappHref}
                          label="Chat with Amorah on WhatsApp"
                          icon={<FaWhatsapp aria-hidden="true" />}
                        />
                        <SocialLink
                          href={contactSettings.instagramUrl}
                          label="Visit Amorah on Instagram"
                          icon={<FaInstagram aria-hidden="true" />}
                        />
                        <SocialLink
                          href={contactSettings.facebookUrl}
                          label="Visit Amorah on Facebook"
                          icon={<FaFacebookF aria-hidden="true" />}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </aside>

              <div>
                <form
                  className="border border-amorah-border bg-amorah-white p-4 shadow-[0_22px_70px_rgba(75,34,34,0.06)] sm:p-6 lg:p-7 xl:p-8"
                  onSubmit={handleSubmit}
                  noValidate
                >
                  <div className="flex flex-col gap-4 border-b border-amorah-border pb-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="max-w-2xl">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amorah-terracotta">
                        Send an enquiry
                      </p>
                      <h2 className="mt-2 font-heading text-2xl font-semibold leading-tight text-amorah-maroon sm:text-3xl lg:text-4xl">
                        How can we help?
                      </h2>
                      <p className="mt-2 max-w-xl text-sm leading-6 text-amorah-brown">
                        Share your details below. We will review your message and respond as soon as possible.
                      </p>
                    </div>

                    <span className="hidden h-12 w-12 shrink-0 place-items-center border border-amorah-border bg-amorah-ivory text-xl text-amorah-maroon sm:grid">
                      <FiMessageCircle aria-hidden="true" />
                    </span>
                  </div>

                  <div className="mt-5 grid gap-x-5 gap-y-4 sm:grid-cols-2">
                    <label className="block" htmlFor="contact-name">
                      <span className="text-sm font-semibold text-amorah-black">
                        Full name <span className="text-amorah-error">*</span>
                      </span>
                      <input
                        id="contact-name"
                        className={getInputClasses(Boolean(errors.name))}
                        type="text"
                        value={form.name}
                        onChange={(event) => updateField('name', event.target.value)}
                        placeholder="Enter your full name"
                        autoComplete="name"
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? 'contact-name-error' : undefined}
                      />
                      <FieldError id="contact-name-error" message={errors.name} />
                    </label>

                    <label className="block" htmlFor="contact-email">
                      <span className="text-sm font-semibold text-amorah-black">
                        Email address <span className="text-amorah-error">*</span>
                      </span>
                      <input
                        id="contact-email"
                        className={getInputClasses(Boolean(errors.email))}
                        type="email"
                        value={form.email}
                        onChange={(event) => updateField('email', event.target.value)}
                        placeholder="you@example.com"
                        autoComplete="email"
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? 'contact-email-error' : undefined}
                      />
                      <FieldError id="contact-email-error" message={errors.email} />
                    </label>

                    <label className="block" htmlFor="contact-phone">
                      <span className="text-sm font-semibold text-amorah-black">
                        Phone number <span className="font-normal text-amorah-muted">(optional)</span>
                      </span>
                      <input
                        id="contact-phone"
                        className={getInputClasses(Boolean(errors.phone))}
                        type="tel"
                        inputMode="tel"
                        value={form.phone}
                        onChange={(event) => updateField('phone', event.target.value)}
                        placeholder="+91 98765 43210"
                        autoComplete="tel"
                        aria-invalid={Boolean(errors.phone)}
                        aria-describedby={errors.phone ? 'contact-phone-error' : undefined}
                      />
                      <FieldError id="contact-phone-error" message={errors.phone} />
                    </label>

                    <label className="block" htmlFor="contact-subject">
                      <span className="text-sm font-semibold text-amorah-black">
                        Enquiry about <span className="text-amorah-error">*</span>
                      </span>
                      <select
                        id="contact-subject"
                        className={getInputClasses(Boolean(errors.subject))}
                        value={form.subject}
                        onChange={(event) => updateField('subject', event.target.value)}
                        aria-invalid={Boolean(errors.subject)}
                        aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
                      >
                        <option value="">Select a subject</option>
                        <option value="Order support">Order support</option>
                        <option value="Product availability">Product availability</option>
                        <option value="Sizing and styling">Sizing and styling</option>
                        <option value="Returns and exchanges">Returns and exchanges</option>
                        <option value="Collaboration">Collaboration</option>
                        <option value="Other enquiry">Other enquiry</option>
                      </select>
                      <FieldError id="contact-subject-error" message={errors.subject} />
                    </label>

                    <label className="block sm:col-span-2" htmlFor="contact-message">
                      <span className="flex items-center justify-between gap-4 text-sm font-semibold text-amorah-black">
                        <span>
                          Your message <span className="text-amorah-error">*</span>
                        </span>
                        <span className="text-xs font-normal text-amorah-muted">{form.message.length}/500</span>
                      </span>
                      <textarea
                        id="contact-message"
                        className={getTextareaClasses(Boolean(errors.message))}
                        value={form.message}
                        maxLength={500}
                        onChange={(event) => updateField('message', event.target.value)}
                        placeholder="Tell us how we can help you..."
                        aria-invalid={Boolean(errors.message)}
                        aria-describedby={errors.message ? 'contact-message-error' : undefined}
                      />
                      <FieldError id="contact-message-error" message={errors.message} />
                    </label>
                  </div>

                  <div className="mt-5 flex flex-col gap-4 border-t border-amorah-border pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="flex max-w-sm items-start gap-2 text-xs leading-5 text-amorah-muted">
                      <FiCheck className="mt-0.5 shrink-0 text-sm text-amorah-maroon" aria-hidden="true" />
                      Your details will only be used to respond to this enquiry.
                    </p>

                    <button
                      type="submit"
                      className="amorah-focus inline-flex min-h-[3.25rem] w-full items-center justify-center gap-2 border border-amorah-maroon bg-amorah-maroon px-7 text-xs font-semibold uppercase tracking-[0.14em] text-amorah-white transition duration-200 hover:border-amorah-black hover:bg-amorah-black disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                      disabled={isSubmitting}
                      aria-busy={isSubmitting || undefined}
                    >
                      <span>{isSubmitting ? 'Sending enquiry...' : 'Send enquiry'}</span>
                      <FiSend className="text-base" aria-hidden="true" />
                    </button>
                  </div>
                </form>

                <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
                  <EnquiryType
                    icon={<FiShoppingBag aria-hidden="true" />}
                    title="Order help"
                    description="Questions about an existing order, delivery or return."
                  />
                  <EnquiryType
                    icon={<FiMessageCircle aria-hidden="true" />}
                    title="Style advice"
                    description="Personal guidance for sizing, styling and availability."
                  />
                  <EnquiryType
                    icon={<FiMail aria-hidden="true" />}
                    title="Collaborations"
                    description="Partnership, media and creative collaboration enquiries."
                  />
                </div>
              </div>
            </div>
          </Container>
        </section>

        
      </main>
    </>
  );
}

export default ContactPage;
