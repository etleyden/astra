import { Vendor as VendorEntity } from "@astra/db";
import { Vendor as VendorShared } from "@astra/shared";
import { createTransformer } from "./createTransformer";

export const Vendor = createTransformer<VendorEntity, VendorShared>({
    entityClass: VendorEntity,
    toEntityMap: (shared) => ({
        guid: shared.guid,
        name: shared.name,
        is_bank: shared.is_bank,
        icon_url: shared.icon_url,
        domain: shared.domain
    }),
    toSharedMap: (entity) => ({
        guid: entity.guid,
        name: entity.name,
        is_bank: entity.is_bank,
        icon_url: entity.icon_url,
        domain: entity.domain
    })
});
