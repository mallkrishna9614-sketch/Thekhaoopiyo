import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { Resend } from 'resend';
import jwt from 'jsonwebtoken';

const router = Router();

// Resend Setup
const resend = new Resend(process.env.RESEND_API_KEY);

// In-memory OTP storage (Email -> { otp, expires })
const otpStore = new Map<string, { otp: string; expires: number }>();

// Provide strict Input Validation using Zod
const sendOtpSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const verifyOtpSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
});

const validate = (schema: z.ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    next(error);
  }
};

router.post('/send-otp', validate(sendOtpSchema), async (req, res, next) => {
  try {
    const { email } = req.body;
    
    // Generate a secure 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with 5-minute expiry
    otpStore.set(email, { otp, expires: Date.now() + 5 * 60 * 1000 });

    const { data, error } = await resend.emails.send({
      from: 'The Khao Piyo Cafe <onboarding@resend.dev>',
      to: email,
      subject: 'Your Login OTP - Khao Piyo Cafe 🍕',
      html: `
        <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; color: #1A0A00;">
          <h2 style="color: #C84B11;">Khao Piyo Cafe</h2>
          <p>Your verification code is:</p>
          <div style="background: #FFF8EE; padding: 20px; border-radius: 10px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1A0A00; border: 1px solid #E8A020;">
            ${otp}
          </div>
          <p style="font-size: 14px; color: #666; margin-top: 20px;">This code will expire in 5 minutes.</p>
        </div>
      `
    });

    if (error) {
      console.error('Resend Error:', error);
      throw new Error("Failed to send verification email");
    }

    res.status(200).json({ message: "Verification email sent! Please check your inbox 🍕" });
  } catch (error) {
    next(error);
  }
});

router.post('/verify-otp', validate(verifyOtpSchema), async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    
    const stored = otpStore.get(email);

    if (!stored) {
      res.status(400).json({ error: "No OTP requested for this email" });
      return;
    }

    if (Date.now() > stored.expires) {
      otpStore.delete(email);
      res.status(400).json({ error: "OTP has expired. Please request a new one." });
      return;
    }

    if (stored.otp !== otp) {
      res.status(401).json({ error: "Incorrect OTP code. Try again." });
      return;
    }

    // Success! Clear OTP and issue token
    otpStore.delete(email);
    
    const token = jwt.sign({ email }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });
    res.status(200).json({ token, message: "Welcome back to Khao Piyo!" });
  } catch (error) {
    next(error);
  }
});

router.post('/refresh', (req, res) => {
  res.status(200).json({ token: 'new-mock-jwt-token' });
});

router.delete('/logout', (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
});

export default router;
