import { z } from 'zod';

export const mobileSchema = z.object({
  mobile: z.string().regex(/^\d{10}$/, 'Mobile number must be 10 digits'),
});

export const otpSchema = z.object({
  otp: z.string().regex(/^\d{4}$/, 'OTP must be 4 digits'),
});
