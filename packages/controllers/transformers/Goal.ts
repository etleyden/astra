import { Goal as GoalEntity } from "@astra/db";
import { Goal as GoalShared } from "@astra/shared";
import { User as UserEntity } from "@astra/db";
import { User as UserShared } from "@astra/shared";
import { createTransformer } from "./createTransformer";
import { Transformers } from "./";

export const Goal = createTransformer<GoalEntity, GoalShared>({
    entityClass: GoalEntity,

    toEntityMap: (shared) => ({
        guid: shared.guid,
        user: Transformers.User(shared.user, true) as UserEntity,
        type: shared.type,
        amount: shared.amount,
        category: Transformers.Category(shared.category, true),
        start_date: shared.start_date,
        end_date: shared.end_date,
        date_created: shared.date_created,
        account: Transformers.Account(shared.account, true),
        is_recurring: shared.is_recurring,
        interval: shared.interval
    }),

    toSharedMap: (entity) => ({
        guid: entity.guid,
        user: Transformers.User(entity.user) as UserShared,
        type: entity.type,
        amount: entity.amount,
        category: Transformers.Category(entity.category),
        start_date: entity.start_date,
        end_date: entity.end_date,
        date_created: entity.date_created,
        account: Transformers.Account(entity.account),
        is_recurring: entity.is_recurring,
        interval: entity.interval
    })
})