import "../../styles/components/loadingSplash.css";

// Web version of the app's LoadingSplash: the logo breathes (1100 ms in,
// 1100 ms out, scale 1 to 1.035, opacity 0.94 to 1), three dots light up
// in turn, and "by EXILE" rises in after 180 ms. Same colours as the app.
export default function LoadingSplash() {
  return (
    <div className="splash-root" role="progressbar" aria-label="Loading UniLink">
      <img
        className="splash-logo"
        src={`${process.env.PUBLIC_URL}/splash-logo.png`}
        alt=""
      />

      <div className="splash-dots" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className="splash-brand">
        <span className="splash-by">by</span>
        <span className="splash-exile">EXILE</span>
      </div>
    </div>
  );
}
