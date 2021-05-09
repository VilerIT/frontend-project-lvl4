// @ts-check

const host = '';
const prefix = 'api/v1';

export default {
  login: () => [host, prefix, 'login'].join('/'),
  signup: () => [host, prefix, 'signup'].join('/'),
  data: () => [host, prefix, 'data'].join('/'),
};
