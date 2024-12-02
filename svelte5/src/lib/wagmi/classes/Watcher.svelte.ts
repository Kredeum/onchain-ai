import scaffoldConfig from "$lib/scaffold.config";

class Watcher {
  id = $state(0);

  watch = () => {
    if (this.id) return;

    this.id = setInterval(this.fn, scaffoldConfig.pollingInterval) as unknown as number;
    console.log("WATCHER watch", this.id);
    this.fn();
  };
  unwatch = () => {
    if (!this.id) return;

    clearInterval(this.id);
    console.log("WATCHER unwatch", this.id);
    this.id = 0;
  };

  constructor(public fn: () => unknown) {
    $inspect("WATCHER ", this.id);
  }
}

export { Watcher };
