// Older OAuth redirect URL (Google used it). Same handling as /auth/oauth, so both providers behave alike
// and failures go to /auth/error instead of the missing /auth/auth-code-error page.
export { GET } from '../oauth/route'
