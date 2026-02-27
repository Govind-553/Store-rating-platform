const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/-]).{8,16}$/;

const validateSignup = (name, email, password, address) => {
  const errors = [];
  if (!name || name.length < 20 || name.length > 60) {
    errors.push('Name must be between 20 and 60 characters.');
  }
  if (!email || !emailRegex.test(email)) {
    errors.push('Valid email is required.');
  }
  if (!password || !passwordRegex.test(password)) {
    errors.push('Password must be 8-16 characters long and include at least 1 uppercase letter and 1 special character.');
  }
  if (!address || address.length > 400) {
    errors.push('Address is required and must be max 400 characters.');
  }
  return errors;
};

const validatePassword = (password) => {
  if (!password || !passwordRegex.test(password)) {
    return 'Password must be 8-16 characters long and include at least 1 uppercase letter and 1 special character.';
  }
  return null;
};

module.exports = {
  validateSignup,
  validatePassword,
  emailRegex,
  passwordRegex
};
