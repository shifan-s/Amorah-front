import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button.jsx';
import Container from '../components/common/Container.jsx';
import Seo from '../components/common/Seo.jsx';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const submit = (event) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address.');
      return;
    }
    setError('Password reset is not enabled yet. Please contact Amorah support for account help.');
  };

  return (
    <>
      <Seo
        title="Forgot Password | Amorah "
        description="Get account access help for an Amorah customer account."
        path="/forgot-password"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Forgot Password', path: '/forgot-password' },
        ]}
      />
      <main className="bg-amorah-ivory py-12">
        <Container size="sm">
          <section className="border border-amorah-border bg-amorah-white p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amorah-brown">Account help</p>
            <h1 className="mt-3 font-heading text-4xl font-semibold text-amorah-black">Forgot Password</h1>
            <p className="mt-4 text-sm leading-6 text-amorah-brown">Enter your email to check the account help option available now.</p>
            <form className="mt-8 space-y-5" onSubmit={submit}>
              <div>
                <label htmlFor="forgot-email">Email</label>
                <input id="forgot-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
                {error ? <p className="mt-2 text-sm text-amorah-error">{error}</p> : null}
              </div>
              <Button type="submit" className="w-full">Check Account Help</Button>
            </form>
            <Link className="amorah-focus mt-6 inline-flex text-sm font-semibold text-amorah-brown hover:text-amorah-black" to="/login">
              Back to login
            </Link>
          </section>
        </Container>
      </main>
    </>
  );
}

export default ForgotPasswordPage;
