const  query = `
query($first: Int!, $after: String, $query: String!, $type: SearchType!)
{
  search(first: $first, after: $after, query: $query, type: $type) {
    edges {
      node {
        ... on Repository {
          name
          url
          homepageUrl
          resourcePath
          description
          stargazers {
            totalCount
          }
          forkCount
          updatedAt
        }
      }
    }
  }
}
`;

export default query;
