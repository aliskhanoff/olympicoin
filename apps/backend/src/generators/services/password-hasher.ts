import { randomBytes, pbkdf2Sync }  from 'node:crypto'

const generateSalt = (saltLenght = 16) =>  randomBytes(saltLenght).toString('hex')

export const hash = (password, salt = null, hashAlgorithm = "sha256", keyLen = 16, saltLenght = 16, iterations = 100) => {
    const  _salt = salt || generateSalt(saltLenght)
    const _iterations = iterations || 100;
    const keylen = keyLen || 12;
    const digest = hashAlgorithm || 'sha256';
  
    const hash = pbkdf2Sync(password, _salt, _iterations, keylen, digest).toString('hex');
  
    return `${hash}.${_salt}`; // "passwordHash.salt"
  }

export const validate = (
              passwordFromDB: string,
              providedPassword: string, 
              hashAlgorithm = "sha256", 
              keyLen = 16,
              saltLenght = 16, 
              iterations = 100): boolean => {

                const [, salt] = passwordFromDB.split('.');
                const generatedPassword = hash(providedPassword, salt, hashAlgorithm, keyLen, saltLenght, iterations);
                return generatedPassword === passwordFromDB
}