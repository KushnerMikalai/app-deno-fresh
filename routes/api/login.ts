import { Handler } from "$fresh/server.ts";

type Providers = { [key: string]: string };

const providers: Providers = {
  "google": "https://accounts.google.com/o/oauth2/v2/auth",
  "github": "https://github.com/login/oauth/authorize",
};

export const handler: Handler = (req: Request): Response => {
  const provider = new URL(req.url).searchParams.get("provider") || "google";
  const url = new URL(providers[provider]);

  if (provider === "google") {
    url.searchParams.set("client_id", Deno.env.get("GOOGLE_CLIENT_ID") || "");
    url.searchParams.set(
      "redirect_uri",
      `${new URL(req.url).origin}?provider=${provider}`,
    );
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", "profile");
  }

  if (provider === "github") {
    url.searchParams.set("client_id", Deno.env.get("GITHUB_CLIENT_ID") || "");
    url.searchParams.set(
      "redirect_uri",
      `${new URL(req.url).origin}?provider=${provider}`,
    );
  }

  return Response.redirect(url, 302);
};
