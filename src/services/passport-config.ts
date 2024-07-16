const LocalStrategy = require("passport-local").Strategy;
import { User } from "../entity/User";
import bcrypt from "bcrypt";
import { AppDataSource } from "../migration/data-source";

export const localStrategy = new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    // passReqToCallback: true,
}, async (username: string, password : string, done : any) => {
    try{
        const user = await AppDataSource.manager.findOneBy(User, {email: username});

        if(!user) {
            return done(null, false, {message: "Incorrect email"});
        }

        if (!user.password){
            return done(null, false, {message: "Password not set"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return done(null, false, {message: "Incorrect password"});
        }

        return done(null, user);
    } catch (err: any) {
        console.error(`Error authenticating user: ${err}`);
        return done(null, false, {message: "Error authenticating user"});
    }

})