import * as crypto from 'crypto';

export const generateOtp = (length = 6): string => {
  return crypto
    .randomInt(0, Math.pow(10, length))
    .toString()
    .padStart(length, '0');
};
