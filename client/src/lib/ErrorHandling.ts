import { AxiosError } from "axios";
import { SQLQueryError } from "../models";

export function handleServerError(err: AxiosError): void {
  console.error(err.message);
}

export function throwErr(err: AxiosError): never {
  throw err;
}
