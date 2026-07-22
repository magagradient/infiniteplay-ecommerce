export function isValidEmail(email) {
  if (!email) return false;
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email.trim());
}

export function isStrongPassword(password) {
  // Regla simple: mínimo 8 caracteres, al menos una letra y un número.
  if (!password || password.length < 8) return false;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return hasLetter && hasNumber;
}

export function passwordsMatch(password, confirmPassword) {
  return password === confirmPassword;
}

export function isRequired(value) {
  return value !== undefined && value !== null && value.toString().trim() !== "";
}

export function isPositiveNumber(value) {
  const num = parseFloat(value);
  return !isNaN(num) && num > 0;
}

/**
 * Devuelve un mensaje de error legible para la contraseña, o null si es válida.
 */
export function getPasswordError(password) {
  if (!password) return "La contraseña es obligatoria.";
  if (password.length < 8) return "La contraseña debe tener al menos 8 caracteres.";
  if (!/[a-zA-Z]/.test(password)) return "La contraseña debe incluir al menos una letra.";
  if (!/[0-9]/.test(password)) return "La contraseña debe incluir al menos un número.";
  return null;
}