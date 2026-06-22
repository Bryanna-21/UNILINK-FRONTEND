import MainLayout from "../layout/MainLayout";

export default function Communities() {
  const communities = [
    {
      id: 1,
      name: "Computer Science"
    },
    {
      id: 2,
      name: "Engineering"
    },
    {
      id: 3,
      name: "Business Students"
    }
  ];

  return (
    <MainLayout>
      <h2>Communities</h2>

      {communities.map((community) => (
        <div className="card" key={community.id}>
          <h3>{community.name}</h3>

          <button>
            Join
          </button>
        </div>
      ))}
    </MainLayout>
  );
}
