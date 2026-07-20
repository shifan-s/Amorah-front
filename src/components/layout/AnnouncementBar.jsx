import { Link } from 'react-router-dom';

const announcement = {
  enabled: false,
  text: '',
  href: '',
};

function AnnouncementBar() {
  if (!announcement.enabled || !announcement.text.trim()) {
    return null;
  }

  const content = (
    <p className="truncate text-center text-[11px] font-semibold uppercase tracking-[0.14em]">
      {announcement.text}
    </p>
  );

  return (
    <div className="bg-amorah-maroon text-amorah-white" aria-label="Store announcement">
      <div className="mx-auto max-w-[1500px] px-4 py-2 sm:px-6 lg:px-10 xl:px-14">
        {announcement.href ? (
          <Link to={announcement.href} className="amorah-focus block hover:text-amorah-beige">
            {content}
          </Link>
        ) : (
          content
        )}
      </div>
    </div>
  );
}

export default AnnouncementBar;
