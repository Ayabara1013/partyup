const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function validateEmail(email: string): boolean {
  return emailRegex.test(email.trim());
}