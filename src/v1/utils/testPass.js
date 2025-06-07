//Password validator

//Validates if password is strong enough by enforcing some rules through regex

/**
 * Password must be 8 characters Long.
 * Password must contain atleast one letter.
 * Password must contain atleast one digit.
 * Password must contain atleast one symbol.
 */
const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/

export function testPass(password){
    return typeof password === "string" && regex.test(password);
}