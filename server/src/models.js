import { pool } from "./config.js";
export function throwSQLQueryError(err, sql, values) {
    throw {
        message: `${err.message}      ### Query given ###: ${values ? pool.format(sql, values) : sql}`,
    };
}
// #endregion
