import dotenv from 'dotenv';

dotenv.config();

const envVars = {
  NEXT_PUBLIC_GITHUB_PROFILE:
    process.env.NEXT_PUBLIC_GITHUB_PROFILE || 'adamsuk',
  NEXT_PUBLIC_CMS_URL:
    process.env.NEXT_PUBLIC_CMS_URL || 'https://blog.sradams.co.uk/api/pages',
};

export default envVars;
