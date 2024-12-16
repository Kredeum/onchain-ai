import { Events, type EventsSortOrder } from "$lib/wagmi/classes";
import type { Nullable } from "$lib/wagmi/ts";
import type { Address } from "abitype";

class Interactions extends Events {
  sender = $state<Nullable<Address>>();

  #filterUniqueByRequestId = (events: any[]): any[] => {
    const eventMap = new Map<string, any>();
    for (const event of events) {
      if (this.sender && event.args.sender !== this.sender) continue;

      const { requestId, response } = event.args;
      const existingEvent = eventMap.get(requestId);

      if (!existingEvent || (existingEvent.args.response === "" && response !== "")) eventMap.set(requestId, event);
    }
    return Array.from(eventMap.values());
  };
  #listUnique = $derived.by(() => this.#filterUniqueByRequestId(this.listAll));

  list = $derived.by(() => {
    const uniqueList = this.#listUnique;
    const sortedList = this.sort === "DESC" ? uniqueList.toReversed() : uniqueList;
    const slicedList = sortedList.slice(0, this.limit);
    return this.raw ? slicedList : slicedList.map((event) => event.args);
  });
  get last() {
    return this.list[0];
  }
  get max() {
    return this.#listUnique.length;
  }

  constructor({
    limit,
    sort,
    watch,
    sender
  }: { limit?: number; sort?: EventsSortOrder; watch?: boolean; sender?: Address } = {}) {
    super("OnChainAIv1", { filter: { eventName: "InteractionLog" }, limit, sort, watch, raw: false });
    this.sender = sender;
  }
}
export { Interactions };
