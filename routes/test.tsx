/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "preact";
import { tw } from "@twind";
import Countdown from "../islands/Countdown.tsx";
import Counter from "../islands/Counter.tsx";

export default function Test() {
  const date = new Date();
  date.setHours(date.getHours() + 1);

  return (
    <div
      className={tw
        `mt-6 mx-auto rounded-2xl bg-[#F9F9F9] border-1 border-gray-300 p-4 max-w-screen-md`}
    >
      <p className={tw`mb-6`}>
        The big event is happening <Countdown target={date.toISOString()} />.
      </p>
      <Counter start={3} />
    </div>
  );
}
