import { SystemStateResolvers } from "./SystemState";

export const resolvers = {
  Query: {},
  Mutation: {},
};

function registerResolver({
  Query,
  Mutation,
  ...others
}: {
  Query?: Record<string, unknown>;
  Mutation?: Record<string, unknown>;
}) {
  resolvers.Query = {
    ...resolvers.Query,
    ...Query,
  };
  resolvers.Mutation = {
    ...resolvers.Mutation,
    ...Mutation,
  };
  Object.assign(resolvers, others);
}

registerResolver(SystemStateResolvers);
