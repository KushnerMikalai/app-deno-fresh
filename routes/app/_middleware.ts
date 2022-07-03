import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";

interface State {
  data: string;
}

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<State>,
) {
  const accessToken = getCookies(req.headers)["deploy_access_token"];

  if (accessToken) {
    return await ctx.next();
  } else {
    return Response.redirect(new URL(req.url).origin);
  }
}
