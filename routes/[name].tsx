/** @jsx h */
import { h } from "preact";
import { PageProps } from "$fresh/server.ts";
import Layout from "../helpers/Layout.tsx";

export default function Greet(props: PageProps) {
  return (
    <Layout>
      <div>Hello {props.params.name}, href - '{props.url.href}'</div>
    </Layout>
  );
}
