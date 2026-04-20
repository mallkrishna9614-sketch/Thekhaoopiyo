export async function sendOTP(phone: string, otp: string): Promise<boolean> {
  // TODO: Replace with official Twilio/MSG91 client
  console.log(`[SMS MOCK] Sending OTP ${otp} to phone ${phone}`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return true;
}
