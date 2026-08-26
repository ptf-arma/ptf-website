import { Fragment } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema, type Options as SanitizeSchema } from "rehype-sanitize";
import type { AarBodyFormat } from "@/lib/aars";

/**
 * AAR prose renderer.
 *
 * AARs come from Billet as freeform prose in one of three formats. Whatever
 * the format, the content crosses a trust boundary: the API contract
 * (docs/aar-api-contract.md) asks Billet to sanitise HTML server-side, but
 * that is Billet's editorial control, not ours — this component sanitises
 * again on render regardless, so a compromised or misconfigured upstream
 * can't inject a script into this site.
 */

const linkClassName =
  "text-ink underline decoration-edge-bright underline-offset-4 hover:decoration-ink";

// Shared element styling so markdown and sanitised-HTML bodies read
// identically. Every block element carries its own top margin plus
// `first:mt-0`, since react-markdown renders top-level nodes as direct
// children of whatever wraps <ReactMarkdown>, not inside an extra element.
const components: Components = {
  p: ({ children }) => (
    <p className="mt-4 first:mt-0 text-ink-muted leading-relaxed">{children}</p>
  ),
  h2: ({ children }) => (
    <h2 className="heading-display mt-10 first:mt-0 text-2xl text-ink sm:text-3xl">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="heading-display mt-8 first:mt-0 text-xl text-ink sm:text-2xl">
      {children}
    </h3>
  ),
  ul: ({ children }) => (
    <ul className="mt-4 first:mt-0 list-disc space-y-2 pl-6 text-ink-muted">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-4 first:mt-0 list-decimal space-y-2 pl-6 text-ink-muted">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="mt-4 first:mt-0 border-l-2 border-edge-bright pl-4 italic text-ink-muted">
      {children}
    </blockquote>
  ),
  a: ({ href, children }) => (
    // rel="ugc": this text comes from an AAR author, not the site itself —
    // tells search engines the link is user-generated, and noopener/
    // noreferrer is standard hygiene for any link we didn't write.
    <a href={href} rel="ugc noopener noreferrer" className={linkClassName}>
      {children}
    </a>
  ),
  strong: ({ children }) => <strong className="text-ink font-semibold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  code: ({ children }) => (
    <code className="rounded-sm bg-raised px-1.5 py-0.5 font-mono text-sm text-ink">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="mt-4 first:mt-0 overflow-x-auto rounded-sm border border-edge bg-raised p-4 font-mono text-sm text-ink-muted">
      {children}
    </pre>
  ),
  // Markdown can carry an image and there is no global img rule, so an
  // unconstrained one would break the column. Deliberately a plain <img>
  // rather than next/image: the URL is author-supplied, and next/image would
  // require allowlisting every host an AAR might ever reference.
  img: ({ src, alt }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={typeof src === "string" ? src : undefined}
      alt={alt ?? ""}
      loading="lazy"
      className="mt-4 first:mt-0 h-auto max-w-full rounded-sm border border-edge"
    />
  ),
};

// The API contract's HTML allowlist (docs/aar-api-contract.md, "Body
// format"): p, br, strong, em, ul, ol, li, blockquote, h2, h3, a, code, pre —
// with `a` restricted to http/https. Deliberately narrower than markdown's
// schema, since HTML is the contract's "unavoidable" fallback, not the
// preferred path.
const htmlSchema: SanitizeSchema = {
  tagNames: [
    "p",
    "br",
    "strong",
    "em",
    "ul",
    "ol",
    "li",
    "blockquote",
    "h2",
    "h3",
    "a",
    "code",
    "pre",
  ],
  attributes: { a: ["href"] },
  protocols: { href: ["http", "https"] },
  strip: ["script", "style"],
};

function TextBody({ body }: { body: string }) {
  const paragraphs = body
    .split(/\n{2,}/)
    .map((para) => para.trim())
    .filter(Boolean);

  return (
    <div className="mt-6">
      {paragraphs.map((para, i) => (
        <p key={i} className="mt-4 first:mt-0 text-ink-muted leading-relaxed">
          {para.split("\n").map((line, j, lines) => (
            <Fragment key={j}>
              {line}
              {j < lines.length - 1 ? <br /> : null}
            </Fragment>
          ))}
        </p>
      ))}
    </div>
  );
}

export function AarBody({
  format,
  body,
}: {
  format: AarBodyFormat;
  body: string;
}) {
  if (format === "text") {
    return <TextBody body={body} />;
  }

  if (format === "html") {
    // rehype-raw parses the raw HTML nodes remark hands it into real
    // elements; rehype-sanitize then strips anything outside htmlSchema.
    // Sanitising happens after parsing, not instead of it — an unsanitised
    // parse would still reach the renderer if this order were reversed.
    return (
      <div className="mt-6">
        <ReactMarkdown
          rehypePlugins={[rehypeRaw, [rehypeSanitize, htmlSchema]]}
          components={components}
        >
          {body}
        </ReactMarkdown>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <ReactMarkdown
        rehypePlugins={[[rehypeSanitize, defaultSchema]]}
        components={components}
      >
        {body}
      </ReactMarkdown>
    </div>
  );
}
