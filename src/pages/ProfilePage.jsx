import { useSelector } from 'react-redux';
import ProfileForm from '../components/account/ProfileForm.jsx';
import Seo from '../components/common/Seo.jsx';
import { selectCurrentUser } from '../store/slices/authSlice.js';

function ProfilePage() {
  const user = useSelector(selectCurrentUser);

  return (
    <>
      <Seo
        title="Profile | Amorah by N-ZAN Designs"
        description="Manage Amorah profile details including name, email and mobile number."
        path="/account/profile"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Account', path: '/account' },
          { name: 'Profile', path: '/account/profile' },
        ]}
      />
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amorah-brown">Account details</p>
        <h1 className="mt-2 font-heading text-4xl font-semibold text-amorah-black">Profile</h1>
        <div className="mt-6">
          <ProfileForm user={user} />
        </div>
      </section>
    </>
  );
}

export default ProfilePage;
