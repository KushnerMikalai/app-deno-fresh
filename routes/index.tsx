/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import Counter from "../islands/Counter.tsx";
import Layout from "../helpers/Layout.tsx";
import Countdown from "../islands/Countdown.tsx";
import { databaseLoader } from "../communication/database.ts";
import { HandlerContext } from "$fresh/server.ts";

export async function handler(
  req: Request,
  ctx: HandlerContext,
): Promise<Response> {
  const database = await databaseLoader.getInstance();

  const response = await ctx.render({
    rooms: await database.getRooms(),
  });

  return response;
}

export default function Home() {
  const date = new Date();
  date.setHours(date.getHours() + 1);

  return (
    <Layout>
      <div class={tw`p-4 mx-auto max-w-screen-md`}>
        <img
          src="/logo.svg"
          height="100px"
          alt="the fresh logo: a sliced lemon dripping with juice"
        />
        <p class={tw`my-6`}>
          Welcome to `fresh`. Try update this message in the ./routes/index.tsx
          file, and refresh.
        </p>
        The big event is happening <Countdown target={date.toISOString()} />.
        <Counter start={3} />
      </div>
    </Layout>
  );
}
