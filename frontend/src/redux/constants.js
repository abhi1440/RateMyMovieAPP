// src/redux/constants.js
// src/redux/constants.js

// You can set this dynamically based on environment variable
const BASE_API_URL = import.meta.env.VITE_API_URL || '';

export const BASE_URL = BASE_API_URL + '/api/v1/';
export const USERS_URL = BASE_API_URL + '/api/v1/users';
export const GENRE_URL = BASE_API_URL + "/api/v1/genre";
export const MOVIE_URL = BASE_API_URL + '/api/v1/movies';
export const UPLOAD_URL = BASE_API_URL + '/api/v1/upload';
