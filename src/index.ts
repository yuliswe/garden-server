import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { readFileSync } from "fs";
import { IncomingMessage } from "http";
import { ResolverContext } from "./ResolverContext";
import { resolvers } from "./resolvers/registry";
import { Timestamp } from "./scalars/Timestamp";
import { WateringSystem } from "./system/watering";
const typeDefs = [readFileSync("./TypeDefs.graphql", { encoding: "utf-8" })];

// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers: { ...resolvers, Timestamp },
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
startStandaloneServer(server, {
  listen: { port: 4416, host: "0.0.0.0" },
  context: async ({
    req,
  }: {
    req: IncomingMessage;
  }): Promise<ResolverContext> => {
    return Promise.resolve({
      wateringSystem: WateringSystem.instance,
    });
  },
}).then(({ url }) => {
  console.log(`🚀  Server ready at: ${url}`);
});
