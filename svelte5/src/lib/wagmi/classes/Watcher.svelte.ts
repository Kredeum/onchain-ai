import scaffoldConfig from "$lib/scaffold.config";

class Watcher {
  id = $state(0);

  start = () => {
    if (this.id) return;

    this.id = setInterval(this.fn, scaffoldConfig.pollingInterval) as unknown as number;
    console.info("WATCHER start", this.id);
    this.fn();
  };
  stop = () => {
    if (!this.id) return;

    clearInterval(this.id);
    console.info("WATCHER stop", this.id);
    this.id = 0;
  };

  constructor(public fn: () => unknown) {
    this.start();

    $inspect("WATCHER ", this.id);
  }
}

export { Watcher };
