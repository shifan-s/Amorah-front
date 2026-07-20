import { Outlet } from 'react-router-dom';
import AccountSidebar from '../components/account/AccountSidebar.jsx';
import Container from '../components/common/Container.jsx';

function AccountLayout() {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-amorah-ivory py-8 text-amorah-black sm:py-12">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <AccountSidebar />
          <div className="border border-amorah-border bg-amorah-white p-5 sm:p-7">
            <Outlet />
          </div>
        </div>
      </Container>
    </main>
  );
}

export default AccountLayout;
