export default function Rightbar() {
  return (
    <div style={{
      width: "300px",
      padding: "20px"
    }}>
      
      <div className="card">
        <h4>Who to follow</h4>
        <p>• Student A</p>
        <p>• Student B</p>
        <p>• Student C</p>
      </div>

      <div className="card">
        <h4>Trending Tags</h4>
        <p>#technology</p>
        <p>#studentlife</p>
        <p>#research</p>
      </div>

      <div className="card">
        <h4>Upcoming Events</h4>
        <p>Tech Conference</p>
        <p>AI Workshop</p>
      </div>

    </div>
  );
}
