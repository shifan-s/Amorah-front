import { useState } from 'react';
import { IoChevronDown } from 'react-icons/io5';
import PropTypes from 'prop-types';

function Accordion({ items, defaultOpenIndex = 0, className = '' }) {
  const [openIndex, setOpenIndex] = useState(defaultOpenIndex);

  return (
    <div className={`divide-y divide-amorah-border border border-amorah-border bg-amorah-white ${className}`}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `accordion-panel-${index}`;
        const buttonId = `accordion-button-${index}`;

        return (
          <div key={item.title}>
            <h3 className="font-body">
              <button
                id={buttonId}
                type="button"
                className="amorah-focus flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-amorah-black"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
              >
                <span>{item.title}</span>
                <IoChevronDown
                  className={`shrink-0 transition motion-reduce:transition-none ${isOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="px-5 pb-5 text-sm leading-6 text-amorah-brown"
            >
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}

Accordion.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      content: PropTypes.node.isRequired,
    }),
  ).isRequired,
  defaultOpenIndex: PropTypes.number,
  className: PropTypes.string,
};

export default Accordion;
