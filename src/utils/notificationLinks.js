// Where a notification takes you on the web. The server stores logical links:
//   /user/<id>   a person (new follower)         - the web app has no profile page for other people yet
//   /post/<id>   a post (like, comment, mention) - the web shows posts in the Campus feed
//   /emergency/<id>  an emergency report - staff open the reports page; an emergency contact has
//                    no page for it on the web (the alert itself shows what is needed)
// Everything else (/messages/<id>, /exams/<id>, ...) is already a web route.
const STAFF = ["lecturer", "admin", "superadmin"];

export function resolveWebLink(link, role) {
  if (!link || typeof link !== "string") return null;
  if (link.startsWith("/user/")) return null;
  if (link.startsWith("/post/")) return "/feed";
  if (link.startsWith("/emergency/")) return STAFF.includes(role) ? "/lecturer/emergency-reports" : null;
  return link;
}
