export const ALLOWED_ADMIN_EMAILS = [
    'vineelavelpuri@gmail.com',
    'vineelavelpuri26@gmail.com',
    'teamintrasphere@gmail.com',
    'admin@example.com'
];

export function isAdminEmail(email?: string) {
    if (!email) return false;
    return ALLOWED_ADMIN_EMAILS.includes(email.toLowerCase());
}
