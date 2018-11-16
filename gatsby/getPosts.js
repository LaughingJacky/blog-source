const axios = require('axios')

require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
})

const getPosts = async (contentType) => {
  const POST_URL = `${API_BASE_URL}/spaces/${API_SPACE_ID}/entries`
}
