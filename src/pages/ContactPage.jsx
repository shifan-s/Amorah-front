import { useState } from 'react';
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { FiArrowUpRight, FiClock, FiMail, FiMapPin, FiPhone, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Container from '../components/common/Container.jsx';
import Seo from '../components/common/Seo.jsx';
import { imageAssets } from '../data/imageAssets.js';

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

const inputClasses =
  'mt-2 h-12 bg-amorah-ivory/70 px-4 text-sm text-amorah-black transition placeholder:text-amorah-muted focus-visible:border-amorah-maroon focus-visible:shadow-none';

const textareaClasses =
  'mt-2 min-h-40 resize-y bg-amorah-ivory/70 px-4 py-4 text-sm text-amorah-black transition placeholder:text-amorah-muted focus-visible:border-amorah-maroon focus-visible:shadow-none';

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
  return phone.trim() === '' || /^[6-9]\d{9}$/.test(phone.trim());
}

function getAddress() {
  const cityLine = [contactSettings.city, contactSettings.state, contactSettings.postalCode].filter(Boolean).join(', ');

  return [
    contactSettings.addressLine1,
    contactSettings.addressLine2,
    cityLine,
    contactSettings.country,
  ]
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
  const textClass = value ? 'text-amorah-black' : 'text-amorah-muted';

  return (
    <article className="flex gap-4 border-b border-amorah-border/80 py-5 last:border-b-0">
      <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-amorah-border text-amorah-maroon">
        {icon}
      </span>
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-amorah-brown">{label}</h2>
        {href && value ? (
          <a
            href={href}
            className={`mt-1 inline-flex items-center gap-1.5 text-sm font-semibold transition hover:text-amorah-maroon ${textClass}`}
          >
            {content}
            <FiArrowUpRight className="text-base" aria-hidden="true" />
          </a>
        ) : (
          <p className={`mt-1 text-sm font-semibold leading-6 ${textClass}`}>{content}</p>
        )}
      </div>
    </article>
  );
}

function SocialLink({ href, label, icon }) {
  const classes =
    'amorah-focus grid h-11 w-11 place-items-center rounded-full border border-amorah-border text-amorah-maroon transition hover:border-amorah-maroon hover:bg-amorah-maroon hover:text-amorah-white';

  if (!href) {
    return (
      <span
        className="grid h-11 w-11 place-items-center rounded-full border border-amorah-border text-amorah-muted opacity-60"
        aria-label={`${label} link coming soon`}
        title={`${label} link coming soon`}
      >
        {icon}
      </span>
    );
  }

  return (
    <a href={href} className={classes} target="_blank" rel="noopener noreferrer" aria-label={label}>
      {icon}
    </a>
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
  }

  function validateForm() {
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = 'Name is required.';
    }
    if (!validateEmail(form.email.trim())) {
      nextErrors.email = 'Enter a valid email address.';
    }
    if (!validatePhone(form.phone)) {
      nextErrors.phone = 'Enter a valid Indian mobile number.';
    }
    if (!form.subject.trim()) {
      nextErrors.subject = 'Subject is required.';
    }
    if (form.message.trim().length < 10) {
      nextErrors.message = 'Message must be at least 10 characters.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (!validateForm()) {
      toast.error('Please complete the highlighted fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      toast.success('Thanks for reaching out. This frontend form is ready for backend connection.');
      setForm(initialForm);
      setErrors({});
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Seo
        title="Contact | Amorah by N-ZAN Designs"
        description="Contact Amorah by N-ZAN Designs for order support, sizing guidance, styling questions and collaborations."
        path="/contact"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
        ]}
      />

      <main className="bg-amorah-ivory py-10 text-amorah-black sm:py-14 lg:py-16">
        <Container size="lg">
          <section className="grid items-start gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
            <div className="bg-amorah-light p-4 sm:p-5 lg:p-6">
              <div className="overflow-hidden rounded-sm border border-amorah-border bg-amorah-white">
                <img
                  src={imageAssets.pageHeaders.contact.src}
                  alt={imageAssets.pageHeaders.contact.alt}
                  className="aspect-[4/3] w-full object-cover object-center sm:aspect-[16/11] lg:aspect-[5/4]"
                  loading="lazy"
                />
              </div>

              <div className="pt-8 sm:pt-10">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amorah-terracotta">
                  Get in touch
                </p>
                <h1 className="mt-3 max-w-2xl font-heading text-4xl font-semibold leading-[1.08] text-amorah-maroon sm:text-5xl lg:text-[3.35rem]">
                  Let's find the right Amorah piece for you.
                </h1>
                <p className="mt-5 max-w-xl text-base leading-8 text-amorah-brown">
                  Need help with an order, sizing, styling, availability or collaboration? Send us a message and our
                  team will get back to you shortly.
                </p>

                <div className="mt-8 border-y border-amorah-border">
                  <ContactDetail
                    icon={<FiMapPin aria-hidden="true" />}
                    label="Location"
                    value={address}
                    fallback="Studio details coming soon"
                  />
                  <ContactDetail
                    icon={<FiMail aria-hidden="true" />}
                    label="Email"
                    value={contactSettings.email}
                    fallback="Support email coming soon"
                    href={contactSettings.email ? `mailto:${contactSettings.email}` : ''}
                  />
                  <ContactDetail
                    icon={<FiPhone aria-hidden="true" />}
                    label="Phone"
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

                <div className="mt-7 flex items-center justify-between gap-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amorah-brown">Social</p>
                  <div className="flex items-center gap-3">
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

            <form
              className="border border-amorah-border bg-amorah-white p-5 sm:p-7 lg:p-9"
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amorah-terracotta">Contact form</p>
                <h2 className="mt-3 font-heading text-4xl font-semibold leading-tight text-amorah-maroon sm:text-5xl">
                  Send a message
                </h2>
                <p className="mt-3 text-sm leading-6 text-amorah-brown">
                  Share a few details and we will help with your enquiry as thoughtfully as possible.
                </p>
              </div>

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <label className="block" htmlFor="contact-name">
                  <span className="text-sm font-semibold text-amorah-black">Name</span>
                  <input
                    id="contact-name"
                    className={inputClasses}
                    value={form.name}
                    onChange={(event) => updateField('name', event.target.value)}
                    autoComplete="name"
                    aria-invalid={errors.name ? 'true' : 'false'}
                    aria-describedby={errors.name ? 'contact-name-error' : undefined}
                  />
                  {errors.name ? (
                    <span id="contact-name-error" className="mt-1 block text-sm text-amorah-error">
                      {errors.name}
                    </span>
                  ) : null}
                </label>

                <label className="block" htmlFor="contact-email">
                  <span className="text-sm font-semibold text-amorah-black">Email</span>
                  <input
                    id="contact-email"
                    className={inputClasses}
                    type="email"
                    value={form.email}
                    onChange={(event) => updateField('email', event.target.value)}
                    autoComplete="email"
                    aria-invalid={errors.email ? 'true' : 'false'}
                    aria-describedby={errors.email ? 'contact-email-error' : undefined}
                  />
                  {errors.email ? (
                    <span id="contact-email-error" className="mt-1 block text-sm text-amorah-error">
                      {errors.email}
                    </span>
                  ) : null}
                </label>

                <label className="block" htmlFor="contact-phone">
                  <span className="text-sm font-semibold text-amorah-black">Phone</span>
                  <input
                    id="contact-phone"
                    className={inputClasses}
                    type="tel"
                    inputMode="numeric"
                    value={form.phone}
                    onChange={(event) => updateField('phone', event.target.value)}
                    autoComplete="tel"
                    aria-invalid={errors.phone ? 'true' : 'false'}
                    aria-describedby={errors.phone ? 'contact-phone-error' : undefined}
                  />
                  {errors.phone ? (
                    <span id="contact-phone-error" className="mt-1 block text-sm text-amorah-error">
                      {errors.phone}
                    </span>
                  ) : null}
                </label>

                <label className="block" htmlFor="contact-subject">
                  <span className="text-sm font-semibold text-amorah-black">Subject</span>
                  <input
                    id="contact-subject"
                    className={inputClasses}
                    value={form.subject}
                    onChange={(event) => updateField('subject', event.target.value)}
                    aria-invalid={errors.subject ? 'true' : 'false'}
                    aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
                  />
                  {errors.subject ? (
                    <span id="contact-subject-error" className="mt-1 block text-sm text-amorah-error">
                      {errors.subject}
                    </span>
                  ) : null}
                </label>

                <label className="block sm:col-span-2" htmlFor="contact-message">
                  <span className="text-sm font-semibold text-amorah-black">Message</span>
                  <textarea
                    id="contact-message"
                    className={textareaClasses}
                    value={form.message}
                    onChange={(event) => updateField('message', event.target.value)}
                    aria-invalid={errors.message ? 'true' : 'false'}
                    aria-describedby={errors.message ? 'contact-message-error' : undefined}
                  />
                  {errors.message ? (
                    <span id="contact-message-error" className="mt-1 block text-sm text-amorah-error">
                      {errors.message}
                    </span>
                  ) : null}
                </label>
              </div>

              <button
                type="submit"
                className="amorah-focus mt-7 inline-flex min-h-[3.25rem] w-full items-center justify-center gap-2 rounded-sm border border-amorah-maroon bg-amorah-maroon px-7 text-sm font-semibold uppercase tracking-[0.1em] text-amorah-white transition hover:border-amorah-black hover:bg-amorah-black disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                disabled={isSubmitting}
                aria-busy={isSubmitting || undefined}
              >
                <span>{isSubmitting ? 'Sending...' : 'Send Enquiry'}</span>
                <FiSend className="text-base" aria-hidden="true" />
              </button>
            </form>
          </section>

          <section className="mt-10 overflow-hidden border border-amorah-border bg-amorah-white sm:mt-12">
            {contactSettings.mapUrl && address ? (
              <iframe
                src={contactSettings.mapUrl}
                title="Amorah studio location map"
                className="h-80 w-full border-0 sm:h-96"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="px-5 py-12 text-center sm:px-8 sm:py-16">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-amorah-border text-amorah-maroon">
                  <FiMapPin className="text-2xl" aria-hidden="true" />
                </span>
                <h2 className="mt-5 font-heading text-3xl font-semibold text-amorah-maroon sm:text-4xl">
                  Visit Amorah
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-amorah-brown">
                  Our studio location and visiting details will be available soon.
                </p>
              </div>
            )}
          </section>
        </Container>
      </main>
    </>
  );
}

export default ContactPage;
