const passport = require('passport')
const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');

var User = mongoose.model('User')

passport.use(
    new localStrategy({ usernameField: 'email' },
        (login, password, done) => {
            User.findOne({ email: login },
                (err, user) => {
                    if(err)
                        return done(err)
                    // unknown user
                    else if (!user)
                        return done(null, false, { message: 'Email is not registered.' });
                    // wrong password
                    else if(!user.verifyPassword(password))
                        return done(null, false, { message: 'Wrong password.' });
                    // authentication succeded
                    else
                        return done(null, user)
                });
        })
);