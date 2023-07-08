import {
  GQLMutationStartWateringArgs,
  GQLResolvers,
  GQLSystemStateResolvers,
} from "@__generated__/resolvers-types";
import { ResolverContext } from "../ResolverContext";
import { SystemState } from "../system/watering";

export const SystemStateResolvers: GQLResolvers & {
  SystemState: GQLSystemStateResolvers;
} = {
  SystemState: {
    __resolveType: () => "SystemState",
    // watering: (parent: SystemState) => parent.watering,
  },
  Query: {
    async systemState(
      parent: {},
      args: {},
      { wateringSystem }: ResolverContext
    ): Promise<SystemState> {
      return wateringSystem.getState();
    },
  },
  Mutation: {
    async startWatering(
      parent: {},
      { minutes }: GQLMutationStartWateringArgs,
      { wateringSystem }: ResolverContext
    ) {
      await wateringSystem.startWatering({ minutes });
      return wateringSystem.getState();
    },

    async stopWatering(
      parent: {},
      args: {},
      { wateringSystem }: ResolverContext
    ) {
      await wateringSystem.stopWatering();
      return wateringSystem.getState();
    },
  },
};
