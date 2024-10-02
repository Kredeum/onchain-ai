# scaffold-eth-alt

[scaffold-eth-alt](https://github.com/zapaz/scaffold-eth-alt) is an alternative tech stack to [scaffold-eth-2](https://github.com/scaffold-eth/scaffold-eth-2) while using  [@ByteAtATime](https://github.com/ByteAtATime) Svelte components from [scaffold-eth-svelte](https://github.com/ByteAtATime/scaffold-eth-svelte)

Demo site on Fleek.xyz here => https://scaffold-eth-alt.on-fleek.app/

Comparison of tech stacks:

| Feature/Tool           | scaffold-eth-2                          | scaffold-eth-svelte                          | scaffold-eth-alt                |
|------------------------|-------------------------------------------|-----------------------------------------|-----------------------------------------|
| Package Manager        | [yarn](https://yarnpkg.com/)            | [yarn](https://yarnpkg.com/)                 | [pnpm](https://pnpm.io/)                  |
| Task runner            | [yarn](https://yarnpkg.com/)            | [yarn](https://yarnpkg.com/)      | [turborepo](https://turborepo.org/)       |
| Smart Contract Tool    | [hardhat](https://hardhat.org/) (or [foundry](https://getfoundry.sh/)) | [hardhat](https://hardhat.org/)        | [foundry](https://getfoundry.sh/)         |
| Smartcontract Language | [solidity](https://soliditylang.org/)   | [solidity](https://soliditylang.org/)     | [solidity](https://soliditylang.org/)     |
| Frontend Language      | [typescript](https://www.typescriptlang.org/) | [typescript](https://www.typescriptlang.org/) | [typescript](https://www.typescriptlang.org/) |
| Frontend Framework     | [react](https://reactjs.org/)           | [svelte5](https://svelte.dev/)            | [svelte5](https://svelte.dev/)            |
| Fullstack Framework    | [nextjs](https://nextjs.org/)           | [sveltekit](https://kit.svelte.dev/)      | [sveltekit](https://kit.svelte.dev/)      |
| Build Tool             | [webpack](https://webpack.js.org/)      | [vite](https://vitejs.dev/)               | [vite](https://vitejs.dev/)               |
| CSS Framework          | [tailwindcss](https://tailwindcss.com/) | [tailwindcss](https://tailwindcss.com/)   | [tailwindcss](https://tailwindcss.com/)   |
| UI Library             | [daisyui](https://daisyui.com/)         | [daisyui](https://daisyui.com/)           | [daisyui](https://daisyui.com/)           |
| Blockchain Libraries   | [viem](https://viem.sh/), [wagmi](https://wagmi.sh/) | [viem](https://viem.sh/), [wagmi](https://wagmi.sh/) | [viem](https://viem.sh/), [wagmi](https://wagmi.sh/) |
| Deployment Tool        | [specific scripts](https://github.com/scaffold-eth/scaffold-eth-2/tree/main/packages/hardhat/deploy) | [specific scripts](https://github.com/scaffold-eth/scaffold-eth-2/tree/main/packages/hardhat/deploy) | [forge-deploy-lite](https://github.com/zapaz/forge-deploy-lite) |
| Hosting Platform    | [vercel](https://vercel.com/)           | [vercel](https://vercel.com/)              | [fleek](https://fleek.xyz/)               |