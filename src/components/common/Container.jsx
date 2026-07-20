import PropTypes from 'prop-types';

const sizes = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-[1440px]',
  xl: 'max-w-[1600px]',
  full: 'max-w-none',
};

function Container({ as: Component = 'div', size = 'xl', className = '', children }) {
  return (
    <Component className={`mx-auto w-full px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16 ${sizes[size]} ${className}`}>
      {children}
    </Component>
  );
}

Container.propTypes = {
  as: PropTypes.elementType,
  size: PropTypes.oneOf(Object.keys(sizes)),
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Container;
