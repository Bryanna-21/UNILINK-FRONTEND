import { linkify } from "../utils/legalUi";

function Text({ value }) {
  return linkify(value).map((part, i) =>
    part.type === "link" ? (
      <a key={i} href={part.value} target="_blank" rel="noopener noreferrer">
        {part.value}
      </a>
    ) : (
      <span key={i}>{part.value}</span>
    )
  );
}

// Renders the notice object served by /api/legal/privacy.
export default function PrivacyNoticeBody({ notice }) {
  return (
    <>
      {notice.intro ? (
        <p>
          <Text value={notice.intro} />
        </p>
      ) : null}
      {notice.sections.map((section) => (
        <section key={section.id} id={section.id}>
          <h2>
            {section.number}. {section.title}
          </h2>
          {section.blocks.map((block, i) =>
            block.ul ? (
              <ul key={i}>
                {block.ul.map((item, j) => (
                  <li key={j}>
                    <Text value={item} />
                  </li>
                ))}
              </ul>
            ) : (
              <p key={i}>
                <Text value={block.p} />
              </p>
            )
          )}
        </section>
      ))}
    </>
  );
}
