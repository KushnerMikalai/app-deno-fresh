/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";

type Props = {
  className?: string;
};

export default function Nav({ className }: Props) {
  return (
    <nav className={`${className} ${tw`flex gap-2 w-full`}`}>
      <a
        className={tw`text(gray-600 uppercase hover:pink-800)`}
        href="/app/dashboard"
      >
        dashboard
      </a>
      <a className={tw`text(gray-600 uppercase hover:pink-800)`} href="/app/me">
        me
      </a>
    </nav>
  );
}
