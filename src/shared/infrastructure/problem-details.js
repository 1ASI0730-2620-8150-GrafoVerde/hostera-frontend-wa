/**
 * Shared infrastructure helpers for the problem details that the Hostera Platform returns when it rejects a request.
 * The platform names each business-rule violation in the `title` of the response, such as `DuplicateRoomNumber`.
 *
 * @module problemDetails
 */

/**
 * Returns the title of the problem details carried by a failed request.
 * @param {unknown} error - Error raised by the HTTP client.
 * @returns {string|null} Title of the problem, or null when the response carries none.
 */
export function problemTitleOf(error) {
  const title = error?.response?.data?.title;
  return typeof title === 'string' ? title : null;
}

/**
 * Translates a request that the Hostera Platform rejected into an error of a bounded context.
 * Errors without a response, and server failures, are returned unchanged so the views report a connection problem.
 * @template {Error} TError
 * @param {unknown} error - Error raised by the HTTP client.
 * @param {new (code: string) => TError} ContextError - Error class of the bounded context.
 * @param {Record<string, string>} codesByTitle - Error code of the context for each problem title.
 * @returns {TError|unknown} Error of the context, or the original error.
 */
export function toContextError(error, ContextError, codesByTitle) {
  const status = error?.response?.status;
  if (!status || status >= 500) return error;
  const title = problemTitleOf(error);
  if (title && Object.hasOwn(codesByTitle, title))
    return new ContextError(codesByTitle[title]);
  return new ContextError(status === 404 ? 'not-found' : 'request-rejected');
}
