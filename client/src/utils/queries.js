import { gql } from "@apollo/client";

// export const GET_ME = gql`
//   query me {
//     _id
//     username
//     email
//     password
//     savedBooks {
//       bookId
//       authors
//       description
//       title
//       image
//       link
//     }
//   }
// `;

export const GET_ME = gql`
  query Query($username: String!) {
    me(username: $username) {
      _id
      username
      email
      bookCount
      savedBooks {
        title
        bookId
      }
    }
  }
`;
