const { User } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");
const { console } = require("console");

const resolvers = {
  // Query: {
  //   me: async (parent, args, context) => {
  //     if (context.user) {
  //       const userData = await User.findOne({ _id: context.user._id }).populate("books");

  //       return userData;
  //     }

  //     throw new AuthenticationError("Not logged in");
  //   },
  // },

  Query: {
    me: async (parent, { username }) => {
      return User.findOne({ username });
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);

      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw AuthenticationError;
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw AuthenticationError;
      }

      const token = signToken(user);

      return { token, user };
    },
    saveBook: async (parent, { _id, ...bookData }, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate({ _id: context.user._id }, { $addToSet: { savedBooks: { ...bookData } } }, { new: true });

        return updatedUser;
      }

      throw AuthenticationError;
    },
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate({ _id: context.user._id }, { $pull: { savedBooks: { bookId } } }, { new: true });

        return updatedUser;
      }

      throw AuthenticationError;
    },
  },
};

module.exports = resolvers;
