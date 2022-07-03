/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { Handler, HandlerContext, PageProps } from "$fresh/server.ts";
import Layout from "../../helpers/Layout.tsx";
import { getCookies } from "$std/http/cookie.ts";
import { databaseLoader } from "../../communication/database.ts";
import type { UserView } from "../../communication/types.ts";

interface Data {
  user: UserView;
}

export const handler: Handler<Data> = async (
  req: Request,
  ctx: HandlerContext<Data>,
): Promise<Response> => {
  const accessToken = getCookies(req.headers)["deploy_access_token"];
  const database = await databaseLoader.getInstance();
  const user = await database.getUserByAccessTokenOrThrow(accessToken);

  return ctx.render({
    user: {
      name: user.userName,
      avatarUrl: user.avatarUrl,
    },
  });
};

export default function Greet({ data, params }: PageProps<Data>) {
  return (
    <Layout>
      <div>
        {data.user.name}
        <img src={data.user.avatarUrl} alt="" />
      </div>
      <a
        href="/api/logout"
        class={tw
          `bg-gray-900 text-gray-100 hover:text-white shadow font-bold text-sm py-3 px-4 rounded flex justify-start items-center cursor-pointer mt-2`}
      >
        <span>Logout</span>
      </a>
    </Layout>
  );
}
