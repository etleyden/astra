import { User as UserEntity } from "@astra/db";
import { User as UserShared } from "@astra/shared";
import { Goal as GoalEntity } from "@astra/db";
import { Goal as GoalShared } from "@astra/shared";
import { Account as AccountEntity } from "@astra/db";
import { Account as AccountShared } from "@astra/shared";
import { createTransformer } from "./createTransformer";
import { Transformers } from "./";

export const User = createTransformer<UserEntity, UserShared>({
  entityClass: UserEntity,

  toEntityMap: (shared) => ({
    guid: shared.guid,
    email: shared.email,
    first_name: shared.first_name,
    last_name: shared.last_name,
    hashedPassword: "",
    goals: shared.goals?.map((goal) => Transformers.Goal(goal, "toEntity") as GoalEntity),
    accounts: shared.accounts?.map((account) =>
      Transformers.Account(account, "toEntity") as AccountEntity
    ),
  }),

  toSharedMap: (entity) => ({
    guid: entity.guid,
    email: entity.email,
    first_name: entity.first_name,
    last_name: entity.last_name,
    goals: entity.goals?.map((goal) => Transformers.Goal(goal) as GoalShared),
    accounts: entity.accounts?.map((account) => Transformers.Account(account) as AccountShared),
  }),
});
