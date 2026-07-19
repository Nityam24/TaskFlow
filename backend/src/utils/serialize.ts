type SerializableValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | SerializableValue[]
  | { [key: string]: SerializableValue };

const DEFAULT_FIELDS_TO_STRIP = new Set([
  "__v",
  "password",
  "deletedAt",
  "completedAt",
  "isDeleted",
]);

export const sanitizePayload = <T>(
  data: T,
  fieldsToStrip: string[] = [],
): T => {
  const stripSet = new Set([...fieldsToStrip, ...DEFAULT_FIELDS_TO_STRIP]);

  if (Array.isArray(data)) {
    return data.map((item) => sanitizePayload(item, fieldsToStrip)) as T;
  }

  if (data && typeof data === "object") {
    const result: Record<string, SerializableValue> = {};

    for (const [key, value] of Object.entries(
      data as Record<string, unknown>,
    )) {
      if (stripSet.has(key)) {
        continue;
      }

      result[key] = sanitizePayload(
        value as SerializableValue,
        fieldsToStrip,
      ) as SerializableValue;
    }

    return result as T;
  }

  return data;
};

export const sanitizeTaskPayload = <T>(data: T): T =>
  sanitizePayload(data, ["createdAt", "updatedAt"]);
