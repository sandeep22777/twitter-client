import { graphql } from "@/gql";

export const getAllTweets = graphql(`
#graphql

query GetAllTweets {
  getAllTweets  {
    id
    content
    imageURL
    author {
      firstName
      lastName
      profileImageUrl
    }
  }
}
`)