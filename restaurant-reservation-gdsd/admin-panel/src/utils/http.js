import axios from 'axios'

/**
 * Http Utility.
 */
const http = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    ...(localStorage.getItem('token') && {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    }),
  },
})

export default http
