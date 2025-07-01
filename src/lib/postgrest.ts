import { POSTGREST_URL, POSTGREST_SCHEMA } from "./constant";
import { PostgrestClient } from "@supabase/postgrest-js";

export const postgrestClient = new PostgrestClient(POSTGREST_URL, {
  schema: POSTGREST_SCHEMA,
  fetch: (...args) => {
    let [url, options] = args;

    // 检查并修复 URL 中的 columns 参数
    if (url instanceof URL || typeof url === "string") {
      const urlObj = url instanceof URL ? url : new URL(url);
      const columns = urlObj.searchParams.get("columns");

      if (columns && columns.includes('"')) {
        // 移除所有双引号
        const fixedColumns = columns.replace(/"/g, "");
        urlObj.searchParams.set("columns", fixedColumns);
        url = urlObj.toString();
      }
    }

    return fetch(url, options);
  },
});
