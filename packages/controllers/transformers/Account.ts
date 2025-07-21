import { Account as AccountEntity } from "@astra/db";
import { Account as AccountShared } from "@astra/shared";
import { User as UserEntity } from "@astra/db";
import { User as UserShared } from "@astra/shared";
import { createTransformer } from "./createTransformer";
import { Transformers } from "./";

export const Account = createTransformer<AccountEntity, AccountShared>({
    entityClass: AccountEntity,

    toEntityMap: (shared) => ({
        guid: shared.guid,
        name: shared.name,
        bank: Transformers.Vendor(shared.bank, true),
        user: Transformers.User(shared.user, true) as UserEntity,
        type: shared.accountType
    }),

    toSharedMap: (entity) => ({
        guid: entity.guid,
        name: entity.name,
        bank: Transformers.Vendor(entity.bank),
        user: Transformers.User(entity.user) as UserShared,
        accountType: entity.type
    })
})