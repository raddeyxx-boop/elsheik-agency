import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/agency-logo.png'

const META_DESCRIPTION = 'Privacy Policy for EL-Sheik Agency WhatsApp Booking Service.'

export default function PrivacyPolicy() {
  useEffect(() => {
    const previousTitle = document.title
    const existingDescription = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const previousDescription = existingDescription?.content
    const description = existingDescription ?? document.createElement('meta')

    document.title = 'Privacy Policy | EL-Sheik Agency'
    description.name = 'description'
    description.content = META_DESCRIPTION
    if (!existingDescription) document.head.appendChild(description)

    return () => {
      document.title = previousTitle
      if (existingDescription && previousDescription !== undefined) {
        existingDescription.content = previousDescription
      } else {
        description.remove()
      }
    }
  }, [])

  return (
    <div className="privacy-page force-ltr">
      <header className="privacy-header">
        <div className="container privacy-nav">
          <Link className="privacy-brand" to="/" aria-label="EL-Sheik Agency home">
            <img src={logo} alt="EL-Sheik Agency logo" />
            <span>EL-Sheik Agency<small>Appointment Booking Service</small></span>
          </Link>
          <Link className="privacy-home-link" to="/">Home</Link>
        </div>
      </header>

      <main className="privacy-main">
        <div className="container privacy-container">
          <div className="privacy-heading">
            <span>EL-Sheik Agency</span>
            <h1>Privacy Policy</h1>
            <p>Last updated: August 5, 2026</p>
          </div>

          <article className="privacy-card">
            <p>
              EL-Sheik Agency operates a WhatsApp-based appointment booking assistant. This
              Privacy Policy explains what information we collect, how we use it, and the choices
              available to customers who use our booking service.
            </p>

            <section>
              <h2>1. Information We Collect</h2>
              <p>When you communicate with our WhatsApp booking assistant, we may collect:</p>
              <ul>
                <li>Customer name</li>
                <li>WhatsApp phone number</li>
                <li>Messages sent through WhatsApp</li>
                <li>Requested massage service</li>
                <li>Appointment date</li>
                <li>Appointment time</li>
                <li>Preferred therapist, if selected</li>
                <li>Customer location, if shared</li>
                <li>Booking history</li>
              </ul>
            </section>

            <section>
              <h2>2. How We Use Information</h2>
              <p>We use customer information only to provide and support the booking service, including:</p>
              <ul>
                <li>Booking appointments</li>
                <li>Rescheduling appointments</li>
                <li>Cancelling appointments</li>
                <li>Providing customer support</li>
                <li>Confirming bookings</li>
                <li>Sending booking updates</li>
              </ul>
              <p>We do not sell customer personal information.</p>
            </section>

            <section>
              <h2>3. Third-Party Services</h2>
              <p>
                To operate the booking assistant, we may use the WhatsApp Business Platform,
                OpenAI, Google Calendar, Google Sheets, n8n, and Supabase. These services are used
                only as necessary to provide, automate, store, and support the booking service.
                Information shared with these providers is limited to what is reasonably required
                for those purposes and is handled under their applicable terms and privacy practices.
              </p>
            </section>

            <section>
              <h2>4. Data Security</h2>
              <p>
                We use reasonable technical and organizational measures designed to protect customer
                data against unauthorized access, loss, misuse, alteration, or disclosure. However,
                no method of electronic transmission or storage is completely secure.
              </p>
            </section>

            <section>
              <h2>5. Data Retention</h2>
              <p>
                Customer information is retained only for as long as necessary to provide booking
                services, maintain appropriate business records, resolve disputes, and comply with
                applicable legal obligations. Information is deleted or anonymized when it is no
                longer needed, unless a longer retention period is required by law.
              </p>
            </section>

            <section>
              <h2>6. Data Deletion</h2>
              <p>
                Customers may request deletion of their personal information by emailing{' '}
                <a href="mailto:raddeyxx@gmail.com">raddeyxx@gmail.com</a>. Please include enough
                information for us to identify the relevant booking records. We will process valid
                requests subject to any records we must retain for legal or legitimate business purposes.
              </p>
            </section>

            <section>
              <h2>7. Contact</h2>
              <p>
                For questions about this Privacy Policy or how customer information is handled, contact:
              </p>
              <p><strong>Email:</strong> <a href="mailto:raddeyxx@gmail.com">raddeyxx@gmail.com</a></p>
            </section>
          </article>
        </div>
      </main>
    </div>
  )
}
