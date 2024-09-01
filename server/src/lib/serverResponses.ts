import { Response } from "express";
import { ServerResponseWithData, ServerResponseNoData } from "../models.js";

export function successWithData<JsonData>(res: Response, message: string, jsonData: JsonData): void {
  const responseJson: ServerResponseWithData<JsonData> = { message: message, content: jsonData };
  res.status(200).json(responseJson);
}

export function successNoData(res: Response, message: string): void {
  const responseJson: ServerResponseNoData = { message: message };
  res.status(200).json(responseJson);
}

export function fail(res: Response, err: any): void {
  console.error(err.message);
  res.status(500).json(err);
}
