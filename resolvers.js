const { AuthenticationError } = require("apollo-server");

const user = {
    _id: "1",
    name: "Adam",
    email: "dev@test.com",
    picture: "https://cloudinary.com/abcx"
};

const authenticated = next => (root, args, ctx, info) => {
    if (!ctx.currentUser) {
        throw new AuthenticationError('You must be logged in!')
    }
    return next(root, args, ctx, info)
}

module.exports = {
    Query: {
        me: authenticated((root, args, ctx) => ctx.currentUser)
    }
};
