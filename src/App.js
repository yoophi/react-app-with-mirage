import React, { useState, useEffect } from "react";
import { createServer, Model } from "miragejs";

createServer({
  models: {
    movie: Model,
  },

  routes() {
    this.namespace = "api";

    this.get("/users", () => [
      { id: "1", name: "Luke" },
      { id: "2", name: "Leia" },
      { id: "3", name: "Anakin" },
    ]);
    this.get("/movies", () => {
      return {
        movies: [
          { id: 1, name: "Inception", year: 2010 },
          { id: 2, name: "Interstellar", year: 2014 },
          { id: 3, name: "Dunkirk", year: 2017 },
        ],
      };
    });
  },
});
export function App() {
  let [users, setUsers] = useState([]);
  let [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch("/api/users")
      .then((response) => response.json())
      .then((json) => setUsers(json));
    fetch("/api/movies")
      .then((response) => response.json())
      .then((json) => setMovies(json.movies));
  }, []);

  return (
    <>
      <h3>Users</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
      <h3>Movies</h3>
      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>{movie.name}</li>
        ))}
      </ul>
    </>
  );
}

export default App;
