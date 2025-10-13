import { modelAPI } from "@/apis/model-ev.api";
import { useEffect, useState } from "react";

export function useModelNames(modelIds: string[]) {
  const [names, setNames] = useState<Record<string, string>>({});

  useEffect(() => {
    const ids = Array.from(new Set(modelIds.filter(Boolean)));
    if (ids.length === 0) return;

    let cancelled = false;

    (async () => {
      try {
        const results = await Promise.all(
          ids.map(async (id) => {
            try {
              const model = await modelAPI.getById(id);
              const name = model?.modelName ?? "";
              return [id, name] as const;
            } catch {
              return [id, ""] as const;
            }
          })
        );

        if (!cancelled) {
          const map: Record<string, string> = {};
          for (const [id, name] of results) if (name) map[id] = name;
          setNames((prev) => ({ ...prev, ...map }));
        }
      } finally {
        // noop
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [modelIds]); // deps gọn, ổn định

  return { names };
}
