import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import Button from '../components/common/Button.jsx';
import Container from '../components/common/Container.jsx';
import Seo from '../components/common/Seo.jsx';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <>
      <Seo
        title="404 Page Not Found | Amorah by N-ZAN Designs"
        description="The requested Amorah page could not be found. Return home or shop premium women's clothing."
        path="/404"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: '404 Page Not Found', path: '/404' },
        ]}
      />

      <main id="main-content" tabIndex={-1} className="bg-amorah-ivory py-16 text-amorah-black sm:py-24">
        <Container size="md">
          <section className="border border-amorah-border bg-amorah-white px-6 py-14 text-center sm:px-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center bg-amorah-light text-2xl text-amorah-brown">
              <FiSearch aria-hidden="true" />
            </div>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-amorah-brown">404</p>
            <h1 className="mt-3 font-heading text-5xl font-semibold leading-tight sm:text-6xl">
              Page Not Found
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-amorah-brown">
              The page you are looking for may have moved, or the collection link may no longer be available.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button onClick={() => navigate('/')}>Return Home</Button>
              <Button variant="outline" onClick={() => navigate('/shop')}>
                Shop Products
              </Button>
            </div>
          </section>
        </Container>
      </main>
    </>
  );
}

export default NotFoundPage;
