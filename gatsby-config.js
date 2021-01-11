module.exports = {
  siteMetadata: {
    title: `Valentin Mihov - DeFi Investing & Yield Farming`,
    name: `Valentin Mihov`,
    siteUrl: `https://valentinmihov.com`,
    description: `Valentin Mihov - software engineering and decentralized finance consulting. 15+ years of experience in algorithms and data structures. DeFi investor.`,
    hero: {
      heading: `20+ years computer science. <a href="https://en.wikipedia.org/wiki/Decentralized_finance" target="_blank">DeFi</a> investing & yield optimization.`,
      maxWidth: 652,
    },
    social: [
      {
        name: `twitter`,
        url: `https://twitter.com/valentinmihov`,
      },
      {
        name: `github`,
        url: `https://github.com/valo`,
      },
      {
        name: `linkedin`,
        url: `https://www.linkedin.com/in/valentinmihov/`,
      },
    ],
  },
  plugins: [
    {
      resolve: "@narative/gatsby-theme-novela",
      options: {
        contentPosts: "content/posts",
        contentAuthors: "content/authors",
        basePath: "/",
        authorsPage: true,
        sources: {
          local: true,
          // contentful: true,
        },
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Valentin Mihov - DeFi Investing & Yield Farming`,
        short_name: `Valentin Mihov`,
        start_url: `/`,
        background_color: `#fff`,
        theme_color: `#fff`,
        display: `standalone`,
        icon: `src/assets/favicon.png`,
        lang: `en`,
      },
    },
    {
      resolve: `gatsby-plugin-netlify-cms`,
      options: {
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-embedder`,
            options: {
              customTransformers: [
                // Your custom transformers
              ],
              services: {
                // The service-specific options by the name of the service
              },
            },
          },

          // Other plugins here...
        ],
      },
    },
    `gatsby-plugin-twitter`,
    `gatsby-plugin-catch-links`,
    `gatsby-plugin-offline`
  ],
};
