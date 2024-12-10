import { SvelteMap } from "svelte/reactivity";

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

class SmartContract {
  results: SvelteMap<string, number> = new SvelteMap();
  result = (name: string): number | undefined => this.results.get(name);

  isFetching: boolean = $state(false);

  callAsync = async (name: string): Promise<void> => {
    this.isFetching = true;
    const newData = Math.floor(Math.random() * 90 + 10);
    await sleep(1000);
    this.isFetching = false;

    this.results.set(name, newData);
    console.log("fetch", name, newData, this.results.get(name));
  };
  count = (name: string): number | undefined => {
    this.callAsync(name);
    return this.result(name);
  };
}

export { SmartContract };
