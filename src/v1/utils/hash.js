import argon2 from "argon2";

export async function hashPassword(password){
    const hashedPassword = await argon2.hash(password);
    return hashedPassword;
}

export async function verifyPassword(storedPassword, incomingPassword){
    try{
        const isValid = await argon2.verify(storedPassword, incomingPassword);
        return isValid;
    }
    catch(error){
        console.error("Error verifying password: ", error); 
        return false;
    }
}