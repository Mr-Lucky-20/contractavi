export function validatePhone(rawPhone) {
  if (!rawPhone || typeof rawPhone !== 'string') {
    return { isValid: false, error: 'Phone number is required.' };
  }

  const cleaned = rawPhone.replace(/[\s\-().]/g, '');

  let digits = cleaned;
  if (digits.startsWith('+91')) {
    digits = digits.slice(3);
  } else if (digits.startsWith('91') && digits.length === 12) {
    digits = digits.slice(2);
  } else if (digits.startsWith('0') && digits.length === 11) {
    digits = digits.slice(1);
  }

  if (!/^\d{10}$/.test(digits)) {
    return {
      isValid: false,
      error: 'Enter a valid 10-digit mobile number (e.g. 98261 12345).',
    };
  }

  if (!/^[6-9]/.test(digits)) {
    return {
      isValid: false,
      error: 'Indian mobile numbers must begin with 6, 7, 8, or 9.',
    };
  }

  if (/^(\d)\1{9}$/.test(digits)) {
    return {
      isValid: false,
      error: 'Please enter a genuine phone number, not repeated digits.',
    };
  }

  if (/(\d)\1{5,}/.test(digits)) {
    return {
      isValid: false,
      error: 'Number contains too many repetitive digits.',
    };
  }

  const badSequences = [
    '0123456789',
    '1234567890',
    '2345678901',
    '9876543210',
    '8765432109',
    '7654321098',
  ];
  if (badSequences.includes(digits)) {
    return {
      isValid: false,
      error: 'Sequential numbers are not allowed.',
    };
  }

  const formatted = `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  return { isValid: true, cleaned: digits, formatted };
}

export function validateEmail(rawEmail) {
  if (!rawEmail || typeof rawEmail !== 'string') {
    return { isValid: false, error: 'Email address is required.' };
  }

  const email = rawEmail.trim().toLowerCase();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: 'Enter a valid email address (e.g. name@company.com).',
    };
  }

  const [localPart, domainPart] = email.split('@');

  if (!localPart || localPart.length < 2) {
    return {
      isValid: false,
      error: 'Email prefix must be at least 2 characters.',
    };
  }

  if (/^(\w)\1{3,}$/.test(localPart)) {
    return {
      isValid: false,
      error: 'Please provide a legitimate business or personal email.',
    };
  }

  const blacklisted = [
    'test@test.com',
    'fake@fake.com',
    'admin@admin.com',
    'asdf@asdf.com',
    '123@123.com',
  ];
  if (blacklisted.includes(email)) {
    return {
      isValid: false,
      error: 'Please provide a valid, active email address.',
    };
  }

  return { isValid: true, email };
}
