<script lang="ts">
  import { getAccount, http, createConfig, connect, watchAccount, type Config } from "@wagmi/core";
  import { injected } from "@wagmi/connectors";
  import { onMount } from "svelte";
  import { newWagmi, wagmiConfig } from "$lib/wagmi/classes";

  type AccountType = ReturnType<typeof getAccount>;

  class Account {
    account = $state<AccountType>(getAccount(wagmiConfig));

    address = $derived(this.account.address);
    chainId = $derived(this.account.chainId);

    watch = () =>
      watchAccount(wagmiConfig, {
        onChange: (newAccount: AccountType) => (this.account = newAccount)
      });

    connect = async () => {
      await connect(wagmiConfig, { connector: injected() });
      this.account = getAccount(wagmiConfig);
      this.watch();
    };

    constructor() {
      console.log("Account instantiated ");
      this.connect();
    }
  }

  let account: Account | undefined = $state();

  onMount(() => {
    newWagmi();
    account = new Account();
  });

  $inspect("account:", account);
</script>

<div class="p-4">
  address = {account?.address} / chainId = {account?.chainId}
</div>
