import fs from "fs";
import path from "path";

const readJSON = async (filePath: string) => {
  const data = await fs.promises.readFile(filePath, "utf-8");
  return JSON.parse(data);
};

const writeJSON = async (
  filePath: string,
  data: unknown,
  options: { spaces: number },
) => {
  const json = JSON.stringify(data, null, options.spaces);
  await fs.promises.writeFile(filePath, json, "utf-8");
};

const mergeAbis = async () => {
  const addresses = await readJSON("../foundry/addresses.json");
  const deployments: any = {};

  for (const [chainId, contracts] of Object.entries(addresses)) {
    deployments[chainId] ||= {};

    for (const [contractName, address] of Object.entries(contracts as any)) {
      const jsonPath = path.join(
        "../foundry/out",
        `${contractName}.sol`,
        `${contractName}.json`,
      );
      if (!fs.existsSync(jsonPath)) continue;

      const abi = (await readJSON(jsonPath)).abi;
      deployments[chainId][contractName] = { address, abi };
    }
  }
  console.log("deployments", deployments);
  await writeJSON("../foundry/deployments.json", deployments, { spaces: 2 });
};

mergeAbis().catch(console.error);
