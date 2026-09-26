export const validateEmail = (email) => {
  if (!email || !email.trim()) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) return 'Please enter a valid email address';
  return null;
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  return null;
};

export const validateRegisterForm = ({ name, email, password, confirmPassword }) => {
  const errors = {};

  if (!name || !name.trim()) {
    errors.name = 'Full Name is required';
  }

  const emailErr = validateEmail(email);
  if (emailErr) errors.email = emailErr;

  const passErr = validatePassword(password);
  if (passErr) errors.password = passErr;

  if (!confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateLoginForm = ({ email, password }) => {
  const errors = {};

  const emailErr = validateEmail(email);
  if (emailErr) errors.email = emailErr;

  if (!password) {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
