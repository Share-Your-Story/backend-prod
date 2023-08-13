let invalidMessage: string = "A password length must be more than 8 character and less than 64 character.";

export default function (password: string): { valid: boolean; message?: string } {
  if (password.length < 8 || password.length > 64) return { valid: false, message: invalidMessage };
  return { valid: true };
}
