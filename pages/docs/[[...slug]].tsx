/** @jsx jsx */
import { anchorLinks } from "@hashicorp/remark-plugins";
import matter from "gray-matter";

import { GetStaticPaths, GetStaticProps } from "next";
import renderToString from "next-mdx-remote/render-to-string";

import DocsPage, { DocsPageProps } from "~/components/doc";
import components from "~/components/theme-ui";
import { fixImagePathsPlugin } from "~/helpers/image-paths";
import { provider } from "~/helpers/next-mdx-remote";
import {
  fetchFile,
  fetchLatestRelease,
  fetchTableOfContents,
  fetchTableOfContentsPaths,
  OWNER,
  REF,
  REPO,
} from "~/lib/api";

export const getStaticPaths: GetStaticPaths = async () => {
  const ref = (await fetchLatestRelease()) ?? REF;
  const paths = await fetchTableOfContentsPaths({ ref });

  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps<DocsPageProps> = async ({
  params,
}) => {
  const slugs: string[] =
    params != null && Array.isArray(params.slug) && params.slug.length > 0
      ? params.slug
      : ["index"];

  /**
   * Get table of contents navigation data.
   */
  const ref = (await fetchLatestRelease()) ?? REF;
  const owner = OWNER;
  const repo = REPO;

  const docsToc = await fetchTableOfContents({ prefix: "/docs/", ref });

  try {
    /**
     * Get doc content from markdown file.
     */
    const filename: string = slugs.join("/") + ".md";
    const text = await fetchFile({
      filename: `docs/${filename}`,
      owner,
      repo,
      ref,
    });

    const { data, content } = matter(text);
    const source = await renderToString(content, {
      components,
      scope: data,
      provider,
      mdxOptions: {
        remarkPlugins: [
          fixImagePathsPlugin({ path: filename, ref }),
          anchorLinks,
        ],
      },
    });

    const editPath = `https://github.com/${owner}/${repo}/edit/${REF}/docs/${filename}`;
    return {
      props: { source, data, editPath, docsToc, version: ref },
      revalidate: 30,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("getStaticProps:", error);
    return { notFound: true, revalidate: 30 };
  }
};

export default DocsPage;
