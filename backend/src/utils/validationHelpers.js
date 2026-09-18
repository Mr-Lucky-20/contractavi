// Validation utilities for contact numbers and email addresses

export function validatePhoneNumber(rawPhone) {
  if (!rawPhone || typeof rawPhone !== 'string') {
    return { isValid: false, error: 'Phone number is required.' };
  }

  // Remove spaces, dashes, parentheses, dots
  let cleaned = rawPhone.replace(/[\s\-().]/g, '');

  // Strip country code (+91 or 91 or leading 0)
  if (cleaned.startsWith('+91')) {
    cleaned = cleaned.slice(3);
  } else if (cleaned.startsWith('91') && cleaned.length === 12) {
    cleaned = cleaned.slice(2);
  } else if (cleaned.startsWith('0') && cleaned.length === 11) {
    cleaned = cleaned.slice(1);
  }

  // Must be strictly 10 numeric digits
  if (!/^\d{10}$/.test(cleaned)) {
    return {
      isValid: false,
      error: 'Please enter a valid 10-digit mobile number.',
    };
  }

  // Must start with 6, 7, 8, or 9 (Indian mobile allocation)
  if (!/^[6-9]/.test(cleaned)) {
    return {
      isValid: false,
      error: 'Mobile number must begin with 6, 7, 8, or 9.',
    };
  }

  // Reject all identical repeating digits (e.g., 0000000000, 9999999999)
  if (/^(\d)\1{9}$/.test(cleaned)) {
    return {
      isValid: false,
      error: 'Repetitive digit phone numbers are not allowed.',
    };
  }

  // Reject 6 or more consecutive identical digits (e.g. 55556526..., 9999991234)
  if (/(\d)\1{5,}/.test(cleaned)) {
    return {
      isValid: false,
      error: 'Invalid phone number pattern with excessive repeating digits.',
    };
  }

  // Reject standard ascending sequences
  const ascendingSequences = ['0123456789', '1234567890', '2345678901', '3456789012'];
  if (ascendingSequences.includes(cleaned)) {
    return {
      isValid: false,
      error: 'Sequential phone numbers are not allowed.',
    };
  }

  // Reject standard descending sequences
  const descendingSequences = ['9876543210', '8765432109', '7654321098'];
  if (descendingSequences.includes(cleaned)) {
    return {
      isValid: false,
      error: 'Sequential phone numbers are not allowed.',
    };
  }

  const formatted = `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  return { isValid: true, cleaned, formatted };
}

export function validateEmail(rawEmail) {
  if (!rawEmail || typeof rawEmail !== 'string') {
    return { isValid: false, error: 'Email address is required.' };
  }

  const email = rawEmail.trim().toLowerCase();

  // Basic RFC structure check
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: 'Please enter a valid email address (e.g. name@domain.com).',
    };
  }

  const [localPart, domainPart] = email.split('@');

  if (!localPart || localPart.length < 2) {
    return {
      isValid: false,
      error: 'Email username must be at least 2 characters.',
    };
  }

  // Reject repeating single character local parts (e.g., aaaa@... or 1111@...)
  if (/^(\w)\1{3,}$/.test(localPart)) {
    return {
      isValid: false,
      error: 'Please provide a legitimate email address.',
    };
  }

  // Disallow obvious dummy test domains or emails
  const blacklistedEmails = [
    'test@test.com',
    'test@gmail.com',
    'fake@fake.com',
    'admin@admin.com',
    'asdf@asdf.com',
    'abc@abc.com',
    'user@user.com',
    '123@123.com',
  ];

  if (blacklistedEmails.includes(email)) {
    return {
      isValid: false,
      error: 'Please provide a valid, active email address.',
    };
  }

  const blacklistedDomains = ['test.com', 'fake.com', 'tempmail.com', 'throwaway.com', 'asdf.com'];
  if (blacklistedDomains.includes(domainPart)) {
    return {
      isValid: false,
      error: 'Disposable or placeholder email domains are not allowed.',
    };
  }

  return { isValid: true, email };
}
