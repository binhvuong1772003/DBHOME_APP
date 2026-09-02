import { Fragment, type ReactNode } from "react";

interface TextBlock {
  type: "text";
  content: string;
}

interface CodeBlock {
  type: "code";
  content: string;
  language?: string;
}

type ContentBlock = TextBlock | CodeBlock;

const inlinePattern =
  /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\(https?:\/\/[^\s)]+\)|https?:\/\/[^\s]+)/g;

export function AiMessageContent({ content }: { content: string }) {
  const blocks = splitCodeBlocks(content);

  return (
    <div className="space-y-3 leading-6">
      {blocks.map((block, index) =>
        block.type === "code" ? (
          <div key={`code-${index}`} className="max-w-full overflow-hidden">
            {block.language ? (
              <p className="border-b bg-muted px-3 py-1 font-mono text-[11px] text-muted-foreground">
                {block.language}
              </p>
            ) : null}
            <pre className="max-w-full overflow-x-auto bg-muted/70 p-3 font-mono text-xs leading-5">
              <code>{block.content}</code>
            </pre>
          </div>
        ) : (
          <TextContent key={`text-${index}`} content={block.content} />
        ),
      )}
    </div>
  );
}

function TextContent({ content }: { content: string }) {
  const lines = content.split("\n");
  const nodes: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index]?.trim() ?? "";
    if (!line) {
      index += 1;
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^[-*]\s+/.test(lines[index]?.trim() ?? "")) {
        items.push((lines[index]?.trim() ?? "").replace(/^[-*]\s+/, ""));
        index += 1;
      }
      nodes.push(
        <ul key={`ul-${index}`} className="list-disc space-y-1 pl-5">
          {items.map((item, itemIndex) => (
            <li key={`${item}-${itemIndex}`}>{renderInline(item)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index]?.trim() ?? "")) {
        items.push((lines[index]?.trim() ?? "").replace(/^\d+\.\s+/, ""));
        index += 1;
      }
      nodes.push(
        <ol key={`ol-${index}`} className="list-decimal space-y-1 pl-5">
          {items.map((item, itemIndex) => (
            <li key={`${item}-${itemIndex}`}>{renderInline(item)}</li>
          ))}
        </ol>,
      );
      continue;
    }

    const paragraph: string[] = [];
    while (
      index < lines.length &&
      (lines[index]?.trim() ?? "") &&
      !/^[-*]\s+/.test(lines[index]?.trim() ?? "") &&
      !/^\d+\.\s+/.test(lines[index]?.trim() ?? "")
    ) {
      paragraph.push(lines[index]?.trim() ?? "");
      index += 1;
    }
    nodes.push(
      <p key={`paragraph-${index}`} className="whitespace-pre-wrap">
        {renderInline(paragraph.join("\n"))}
      </p>,
    );
  }

  return nodes;
}

function splitCodeBlocks(content: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  const pattern = /```([\w-]+)?\s*\n?([\s\S]*?)```/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(content)) !== null) {
    if (match.index > lastIndex) {
      blocks.push({ type: "text", content: content.slice(lastIndex, match.index) });
    }
    blocks.push({
      type: "code",
      language: match[1],
      content: (match[2] ?? "").trimEnd(),
    });
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < content.length) {
    blocks.push({ type: "text", content: content.slice(lastIndex) });
  }

  return blocks.length ? blocks : [{ type: "text", content }];
}

function renderInline(content: string) {
  return content.split(inlinePattern).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={index} className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
          {part.slice(1, -1)}
        </code>
      );
    }

    const markdownLink = part.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
    const href = markdownLink?.[2] ?? (part.startsWith("http") ? part : null);
    if (href) {
      return (
        <a
          key={index}
          href={href}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-primary underline underline-offset-2"
        >
          {markdownLink?.[1] ?? part}
        </a>
      );
    }

    return <Fragment key={index}>{part}</Fragment>;
  });
}
