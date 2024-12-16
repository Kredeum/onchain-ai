import { callOpenAI } from "./openai";

const simulateFunction = async (input: string): Promise<string> => {
  // const output = await callOpenAI(input);
  const output = eval(input);

  console.log("simulateFunction", input, "=>", output);
  return output;
};

export { simulateFunction };
