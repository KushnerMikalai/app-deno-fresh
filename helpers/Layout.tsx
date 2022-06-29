/** @jsx h */
/** @jsxFrag Fragment */
import { ComponentChildren, Fragment, h } from "preact";
import { tw } from "@twind";
import { Footer } from "./Footer.tsx";
import Nav from "./Nav.tsx";

export default function Layout({ children }: { children: ComponentChildren }) {
  return (
    <div
      className={tw
        `mt-6 mx-auto rounded-2xl bg-[#F9F9F9] border-1 border-gray-300 p-4 max-w-screen-md`}
    >
      <Nav className={tw`mb-6`} />
      {children}
      <Footer />
    </div>
  );
}
