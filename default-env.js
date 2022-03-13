import dotenv from 'dotenv'
dotenv.config()

const env_vars = {
  GITHUB_PROFILE: process.env.GITHUB_PROFILE || 'adamsuk',
}

export default env_vars
