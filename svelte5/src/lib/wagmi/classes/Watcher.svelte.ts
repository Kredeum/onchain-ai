import scaffoldConfig from "$lib/scaffold.config";

class Watcher {
  id = $state(0);

  start = (fn: () => unknown, onStart = false) => {
    if (this.id) return;

    if (onStart) fn();
    this.id = setInterval(fn, scaffoldConfig.pollingInterval) as unknown as number;
    console.info("WATCHER start", this.id);
    fn();
  };
  stop = () => {
    if (!this.id) return;

    clearInterval(this.id);
    console.info("WATCHER stop", this.id);
    this.id = 0;
  };
  restart = (fn: () => unknown, onStart = false) => {
    this.stop();
    this.start(fn, onStart);
  };

  constructor(fn?: () => unknown) {
    if (fn) this.start(fn);

    // $inspect("WATCHER ", this.id);
  }
}

export { Watcher };
