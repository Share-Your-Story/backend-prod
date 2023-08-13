const validChar: string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890_";

export default function (username: string): { valid: boolean; message?: string } {
  if (username.length < 4 || username.length > 16) return { valid: false, message: `A username length must be more than 4 character and less than 16 character.` };
  for (let i = 0; i < username.length; i++) {
    if (!validChar.includes(username[i])) return { valid: false, message: `A username must only contain characters A-Z a-z 0-9 _` };
  }
  return { valid: true };
}
