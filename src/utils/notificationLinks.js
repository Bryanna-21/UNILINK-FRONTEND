// Where a notification takes you on the web. The server stores logical links:
//   /user/<id>   a person (new follower)         - the web app has no profile page for other people yet
//   /post/<id>   a post (like, comment, mention) - the web shows posts in the Campus feed
// Everything else (/messages/<id>, /exams/<id>, ...) is already a web route.
export function resolveWebLink(link) {
  if (!link || typeof link !== "string") return null;
  if (link.startsWith("/user/")) return null;
  if (link.startsWith("/post/")) return "/feed";
  return link;
}
