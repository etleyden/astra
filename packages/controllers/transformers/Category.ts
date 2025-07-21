import { Category as CategoryEntity } from "@astra/db";
import { Category as CategoryShared } from "@astra/shared";
import { User as UserEntity } from "@astra/db";
import { User as UserShared } from "@astra/shared";
import { Transformers } from "./";
import { createTransformer } from "./createTransformer";

export const Category = createTransformer<CategoryEntity, CategoryShared>({
    entityClass: CategoryEntity,
    toEntityMap: (shared) => ({
        guid: shared.guid,
        name: shared.name,
        description: shared.description,
        user: Transformers.User(shared.user, true) as UserEntity,
        icon: shared.icon
    }),
    toSharedMap: (entity) => ({
        guid: entity.guid,
        name: entity.name,
        description: entity.description,
        user: Transformers.User(entity.user) as UserShared,
        icon: entity.icon
    }),
})