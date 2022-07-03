/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "preact";
import { tw } from "@twind";
import { deleteCookie, getCookies, setCookie } from "$std/http/cookie.ts";
import { databaseLoader } from "../communication/database.ts";
import { HandlerContext, PageProps } from "$fresh/server.ts";
import { gitHubApi } from "../communication/github.ts";
import { googleApi } from "../communication/google.ts";

export async function handler(
  req: Request,
  ctx: HandlerContext,
): Promise<Response> {
  const maybeAccessToken = getCookies(req.headers)["deploy_access_token"];
  const database = await databaseLoader.getInstance();

  if (maybeAccessToken) {
    const user = await database.getUserByAccessToken(maybeAccessToken);
    if (user) {
      return ctx.render(user.userId);
    }
  }

  // This is an oauth callback request.
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  if (!code) {
    return ctx.render(false);
  }

  const provider = url.searchParams.get("provider");

  let accessToken = "";
  let userData = null;

  if (provider === "google") {
    accessToken = await googleApi.getAccessToken(
      code,
      `${new URL(req.url).origin}?provider=google`,
    );
    userData = await googleApi.getUserData(accessToken);
  } else {
    accessToken = await gitHubApi.getAccessToken(code);
    userData = await gitHubApi.getUserData(accessToken);
  }

  await database.insertUser({
    userId: userData.userId,
    userName: userData.userName,
    accessToken,
    avatarUrl: userData.avatarUrl,
  });

  const headers = new Headers({
    "location": `${new URL(req.url).origin}/app/dashboard`,
  });

  setCookie(headers, {
    name: "deploy_access_token",
    value: accessToken,
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
  });

  return new Response(null, {
    status: 302,
    headers,
  });
}

export default function Main({ data }: PageProps) {
  const btn = tw
    `bg-gray-900 text-gray-100 hover:text-white shadow font-bold text-sm py-3 px-4 rounded flex justify-start items-center cursor-pointer mt-2`;
  const date = new Date();
  date.setHours(date.getHours() + 1);

  return (
    <div>
      <div class={tw`p-4 mx-auto max-w-screen-md`}>
        <div className={tw`flex justify-center items-center flex-col`}>
          {data
            ? (
              <a
                href="/api/logout"
                class={btn}
              >
                <span>Logout</span>
              </a>
            )
            : (
              <>
                <a
                  href="/api/login?provider=google"
                  className={btn}
                >
                  <span>Sign up with Google</span>
                </a>
                <a
                  href="/api/login?provider=github"
                  class={btn}
                >
                  <svg
                    viewBox="0 0 24 24"
                    class={tw`fill-current mr-4 w-6 h-6`}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                  <span>Sign up with Github</span>
                </a>
              </>
            )}
        </div>
      </div>
    </div>
  );
}
