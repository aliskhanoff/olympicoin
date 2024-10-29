import {hashPassword} from './password-hasher'

describe('PasswordHasher', () => {
    
    test("should hash password with generated salt", () => {
         const password = "1234567";
         const generatedPassword = hashPassword(password, null);
         expect(generatedPassword).not.toBeNull()
         expect(generatedPassword.split(".").length).toBe(2)
    })

    test("should hash password with given salt", () => {
         const password = "1234567";
         const salt = "query"
         const generatedPassword = hashPassword(password, salt);
         expect(generatedPassword).not.toBeNull()
         expect(generatedPassword.split(".")[1]).toBe(salt)
    })

})