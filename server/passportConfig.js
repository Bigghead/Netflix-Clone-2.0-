const Auth0Strategy = require('passport-auth0'),
      passport      = require('passport'),
      // authKeys      = require('./authKeys.js'),

      session             = require('express-session'),
      MongoStore = require('connect-mongo')(session),

      express = require('express'),
      app     = express(),
      router  = express.Router(),
      mongoose = require('mongoose'),

      User    = require('./models/User.js');

const strategy = new Auth0Strategy({
  domain:    process.env.domain || authKeys.domain,
  clientID:  process.env.clientID || authKeys.clientID, 
  clientSecret: process.env.clientSecret || authKeys.clientSecret,
  callbackURL:  process.env.callbackURL || authKeys.callbackURL
},
  function (accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    User.findOne({userName : profile.displayName})
        .then(user => {

          console.log(user);
          //no user in database
          if(user === null) {

            User.create({
              userName: profile.displayName
            }).then(madeUser => done(null, madeUser))
              .catch(err => console.log(err))

          //user in db
          } else {
            return done(null, user);
          }
        })
        .catch(err => done(err))
    }
);

router.use(session({
  secret: process.env.secret || authKeys.secret,
  resave: true,
  saveUninitialized: true, 
  store: new MongoStore( { mongooseConnection: mongoose.connection } )
}));

router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user)
});

passport.deserializeUser(function (user, done) { done(null, user) });

passport.use(strategy);


module.exports =  router;