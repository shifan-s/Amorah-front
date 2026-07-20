import { Component } from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    if (import.meta.env.DEV) {
      console.error(error);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen bg-amorah-ivory px-6 py-16 text-amorah-black">
          <div className="mx-auto max-w-xl border border-amorah-border bg-amorah-white p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amorah-brown">Amorah</p>
            <h1 className="mt-3 font-heading text-3xl font-semibold">Something went wrong</h1>
            <p className="mt-4 text-sm leading-6 text-amorah-brown">
              Please refresh the page. If the issue continues, contact Amorah support.
            </p>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;

