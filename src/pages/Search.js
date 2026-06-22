import { useState } from "react";
import MainLayout from "../layout/MainLayout";

export default function Search() {
  const [query, setQuery] = useState("");

  const sampleResults = [
    "Computer Science Community",
    "Software Engineering Event",
    "John Doe"
  ];

  const filtered = sampleResults.filter(item =>
    item.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <MainLayout>
      <h2>Search</h2>

      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) =>
          setQuery(e.target.value)
        }
      />

      {filtered.map((item, index) => (
        <div className="card" key={index}>
          {item}
        </div>
      ))}
    </MainLayout>
  );
}
