import { graphql } from "../../gql";

export const verifyUserGoogleTokenQuery = graphql(`
  #graphql

  query VerifyUserGoogleToken($token: String!) {
    verifyGoogleToken(token: $token)
  }
`);

export const getCurrentUserQuery = graphql(`
  query GetCurrentUser {
    getCurrentUser {
      id
      profileImageUrl
      email
      firstName
      lastName
      tweets {
        id
        content
        author {
          id
          firstName
          lastName
          profileImageUrl
        }
      }
    }
  }
`);

export const getUserById = graphql(`
  #graphql
  query GetUserById($id: ID!) {
    getUserById(id: $id) {
      id
      firstName
      lastName
      profileImageUrl
      tweets {
        content
        id
        author {
          id
          firstName
          lastName
          profileImageUrl
        }
      }
    }
  }
`);
