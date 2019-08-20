import React, { Component, lazy, Suspense } from "react"
import { css } from "@emotion/core"
import { Link, graphql } from "gatsby"

import { rhythm } from "../utils/typography";

const Layout = lazy(() => import('../components/layout'));

class Index extends Component {
  render() {
    const { data } = this.props;

    return (
      <Suspense fallback={<div>Loading...</div>}>
        <Layout fallback={<p>loading</p>} >
          <div>
            <h1
              css={css`
              display: inline-block;
              border-bottom: 1px solid;
            `}
            >
              Amazing Pandas Eating Things
            </h1>
            <h4>{data.allMarkdownRemark.totalCount} Posts</h4>
            {data.allMarkdownRemark.edges.map(({ node }) => (
              <div key={node.id}>
                <Link
                  to={node.fields.slug}
                  css={css`
                  text-decoration: none;
                  color: inherit;
                `}
                >
                  <h3
                    css={css`
                    margin-bottom: ${rhythm(1 / 4)};
                  `}
                  >
                    {node.fields.slug}
                    {node.frontmatter.title}{" "}
                    <span
                      css={css`
                      color: #bbb;
                    `}
                    >
                    — {node.frontmatter.date}
                  </span>
                  </h3>
                  <p>{node.excerpt}</p>
                </Link>
              </div>
            ))}
          </div>
        </Layout>
      </Suspense>
    )
  }
}

export default Index;


export const query = graphql`
  query {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "DD MMMM, YYYY")
          }
          fields {
            slug
          }
          excerpt
        }
      }
    }
  }
`
