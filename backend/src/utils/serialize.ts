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

  const raw =
    typeof data === "object" &&
    data !== null &&
    typeof (data as Record<string, unknown>).toJSON === "function"
      ? (data as { toJSON(): unknown }).toJSON()
      : data;

  if (Array.isArray(raw)) {
    return raw.map((item) => sanitizePayload(item, fieldsToStrip)) as T;
  }

  if (raw && typeof raw === "object") {
    const result: Record<string, SerializableValue> = {};

    for (const [key, value] of Object.entries(
      raw as Record<string, unknown>,
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

  return raw as T;
};

export const sanitizeTaskPayload = <T>(data: T): T =>
  sanitizePayload(data, ["createdAt", "updatedAt"]);
