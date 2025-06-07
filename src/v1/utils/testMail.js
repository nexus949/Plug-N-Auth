//Email Validator

//Validates if Email by enforcing some rules through regex

const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function testMail(email){
    email = email.trim();
    return regex.test(email);
}