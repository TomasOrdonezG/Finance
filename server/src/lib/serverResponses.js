export function successWithData(res, message, jsonData) {
    const responseJson = { message: message, content: jsonData };
    res.status(200).json(responseJson);
}
export function successNoData(res, message) {
    const responseJson = { message: message };
    res.status(200).json(responseJson);
}
export function fail(res, err) {
    console.error(err.message);
    res.status(500).json(err);
}
