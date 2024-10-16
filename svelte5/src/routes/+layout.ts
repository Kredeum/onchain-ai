import { type Load } from "@sveltejs/kit";

const prerender = true;
const ssr = false;

const load: Load = async ({ url, route }) => {
  if (url.pathname === route.id) console.info("load route", route.id);
  else console.error("load no route", url.pathname, route.id);

  return {};
};

export { prerender, ssr, load };
