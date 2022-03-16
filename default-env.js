import dotenv from 'dotenv'
dotenv.config()

const env_vars = {
  NEXT_PUBLIC_GITHUB_PROFILE: process.env.NEXT_PUBLIC_GITHUB_PROFILE || 'adamsuk',
  NEXT_PUBLIC_CMS_URL: process.env.NEXT_PUBLIC_CMS_URL || 'https://grav.sradams.co.uk',
}

export default env_vars
