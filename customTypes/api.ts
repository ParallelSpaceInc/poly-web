/**
 * Promise.allSettled return Promise<PromiseAllSettledResult[]> type.
 */
export type PromiseAllSettledResult<V = any, E = any> = {
  status: "fulfilled" | "rejected";
  /**
   * Return value from promise when it's fulfilled.
   */
  value?: V;
  /**
   * Returned message from promise when it's rejected.
   */
  reason?: E;
};
