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
    this.get("/httpbin/:id", (schema, request) => {
      return {
        params: request.params.id,
        queryString: request.queryParams,
      };
    });
  },
});
export function App() {
  let [users, setUsers] = useState([]);
  let [movies, setMovies] = useState([]);
  let [httpData, setHttpData] = useState({});

  useEffect(() => {
    fetch("/api/users")
      .then((response) => response.json())
      .then((json) => setUsers(json));
    fetch("/api/movies")
      .then((response) => response.json())
      .then((json) => setMovies(json));
    fetch("/api/httpbin/42?foo=bar&hello=world")
      .then((response) => response.json())
      .then((json) => setHttpData(json));
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
      <pre>{JSON.stringify(movies, null, 2)}</pre>
      <h3>Http</h3>
      <pre>{JSON.stringify(httpData, null, 2)}</pre>
    </>
  );
}

export default App;
