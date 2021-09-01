const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');
const { AuthenticationError } = require('apollo-server');
const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID);

const findOrCreateUser = async token => {
    if (!token) {
        throw new AuthenticationError("No Auth Token provided");
    }
    const googleUser = await verifyGoogleToken(token);
    const user = await checkIfUserExists(googleUser.email);
    return user ? user : saveUserr(googleUser);
};

const checkIfUserExists = async email => {
    const result = await User.findOne({ email }).exec();
    return result;
};

const saveUser = googleUser => {
    const { email, name, picture } = googleUser;
    const user = { email, name, picture };
    return new User(user).save();
};

const verifyGoogleToken = async token => {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.OAUTH_CLIENT_ID
        });
        return ticket.getPayload();
    } catch (err) {
        throw new Error("Errorr verifying Google Token", err);
    }
};

module.exports = { findOrCreateUser };
