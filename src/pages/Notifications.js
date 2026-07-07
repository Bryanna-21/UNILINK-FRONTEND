export default function Notifications() {
  const notifications = [
    "New post in your community",
    "Someone liked your post",
    "New event added"
  ];

  return (
    <>
      <h2>Notifications</h2>

      {notifications.map((n, i) => (
        <div key={i} className="card">
          {n}
        </div>
      ))}
    </>
  );
}
