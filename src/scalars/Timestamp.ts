import * as datefns from "date-fns";
import { GraphQLScalarType, Kind } from "graphql";

export const Timestamp = new GraphQLScalarType<Date, string>({
  name: "Timestamp",

  description: "A timestamp represented as a string",

  // Convert from server to client
  serialize(value: unknown): string {
    if (!(value instanceof Date)) {
      throw new Error(`Timestamp is not parsable: ${value}`);
    }
    return datefns.format(value, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
  },

  // Convert from client to server
  parseValue(value: unknown): Date {
    return new Date(value as any);
  },

  // Convert hard-coded value in the .graphql schema
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    throw new Error(`Timestamp is not parsable: ${ast}`);
  },
});
