import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: "https://graphql.prepr.io/ac_3131b66bfbf66b95e01a05e1e98ad31914ed15b9f8e8104cce82b0b001ed4a34",
  documents: ['!src/gql/**/*', 'src/queries/**/*.{ts,tsx}'],
  generates: {
    "src/gql/": {
      preset: 'client',
      plugins: [],
      presetConfig: {
        fragmentMasking: { unmaskFunctionName: 'getFragmentData' },
      },
      config: {
        reactApolloVersion: 3,
      },
    },
    "./graphql.schema.json": {
      plugins: ["introspection"]
    }
  }
};

export default config;