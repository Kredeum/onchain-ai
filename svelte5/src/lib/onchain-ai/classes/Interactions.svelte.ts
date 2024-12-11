import { Events, type EventsSortOrder } from "$lib/wagmi/classes";

class Interactions extends Events {
  constructor({ limit, sort, watch }: { limit?: number; sort?: EventsSortOrder; watch?: boolean } = {}) {
    super("OnChainAIv1", { filter: { eventName: "InteractionLog" }, limit, sort, watch, raw: false });
  }
}
export { Interactions };
