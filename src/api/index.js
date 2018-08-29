// Prevent webpack window problem
const isBrowser = () => typeof window !== 'undefined';

const getPath = () => (isBrowser() ? window.location.href : '');

export {
  isBrowser,
  getPath,
};
