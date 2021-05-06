import React, { useState, useEffect } from "react";
import { createServer, Model } from "miragejs";
import movies from "./fixtures/movies.json";

function paginate(array, pageNumber, pageSize) {
  return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
}
createServer({
  models: {
    movie: Model,
  },
  seeds(server) {
    server.db.loadData({
      movies: movies,
    });
  },
  routes() {
    this.namespace = "api";

    this.get("/users", () => [
      { id: "1", name: "Luke" },
      { id: "2", name: "Leia" },
      { id: "3", name: "Anakin" },
    ]);
    this.get("/movies", (schema, request) => {
      const {
        page: pageNumber = 1,
        per_page: pageSize = 10,
      } = request.queryParams;
      return {
        data: paginate(schema.db.movies, Number(pageNumber), Number(pageSize)),
        pagination: {
          page: Number(pageNumber),
          per_page: Number(pageSize),
          total: schema.db.movies.length,
          total_page: Math.ceil(schema.db.movies.length / Number(pageSize)),
        },
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
    fetch("/api/movies?per_page=25&page=2")
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
