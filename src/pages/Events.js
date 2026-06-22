import MainLayout from "../layout/MainLayout";

export default function Events() {
  const events = [
    {
      id: 1,
      title: "Hackathon 2026",
      date: "July 10"
    },
    {
      id: 2,
      title: "Career Fair",
      date: "August 15"
    }
  ];

  return (
    <MainLayout>
      <h2>Upcoming Events</h2>

      {events.map((event) => (
        <div className="card" key={event.id}>
          <h3>{event.title}</h3>
          <p>{event.date}</p>
        </div>
      ))}
    </MainLayout>
  );
}
