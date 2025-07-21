
interface TransformerConfig<EntityType, SharedType> {
  entityClass: new () => EntityType;
  toEntityMap: (shared: SharedType) => Partial<EntityType>;
  toSharedMap: (entity: EntityType) => SharedType;
}

export function createTransformer<EntityType, SharedType>(
  config: TransformerConfig<EntityType, SharedType>
) {
  return function transform(
    value: EntityType | SharedType,
    convertToEntityType: boolean = false
  ): EntityType | SharedType {
    if (convertToEntityType) {
      const entity = new config.entityClass();
      Object.assign(entity, config.toEntityMap(value as SharedType));
      return entity;
    } else {
      return config.toSharedMap(value as EntityType);
    }
  };
}