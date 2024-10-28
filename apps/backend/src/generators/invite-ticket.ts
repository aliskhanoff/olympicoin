import { randomBytes }  from 'node:crypto'

export const generateInviteTicket = (length = 6) => {

  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz0123456789';
  const charsLength = chars.length;

  const random_code = randomBytes(Number(length));
  let inviteCode = '';

  for (let i = 0; i < length; i++) inviteCode += chars[random_code[i] % charsLength]
  
  return inviteCode;
}

