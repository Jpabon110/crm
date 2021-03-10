/* eslint-disable camelcase */
import superagent from 'superagent';

const API_ROOT = process.env.REACT_APP_API_ROOT;
const CLOUDINARY_UPLOAD_URL = process.env.REACT_APP_CLOUDINARY_UPLOAD_URL;

let token = window.localStorage.getItem('accessToken') || null;

const tokenPlugin = (req) => {
  if (token) {
    req.set('Authorization', `Bearer ${token}`);
  }
};

export const requests = {
  del: url => superagent.del(`${API_ROOT}${url}`).use(tokenPlugin),
  get: url => superagent.get(`${API_ROOT}${url}`).use(tokenPlugin),
  put: (url, body) => superagent.put(`${API_ROOT}${url}`, body).use(tokenPlugin),
  post: (url, body) => superagent.post(`${API_ROOT}${url}`, body).use(tokenPlugin),
  uploadToCloudinary: (fields) => {
    const {
      apiKey,
      file,
      folder,
      public_id,
      signature,
      timestamp,
    } = fields;

    return superagent
      .post(CLOUDINARY_UPLOAD_URL)
      .field('api_key', apiKey)
      .field('file', file)
      .field('folder', folder)
      .field('public_id', public_id)
      .field('signature', signature)
      .field('timestamp', timestamp);
  },
};

export const setToken = (_token) => {
  token = _token;
};
