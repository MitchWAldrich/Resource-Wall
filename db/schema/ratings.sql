DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS resources CASCADE;

CREATE TABLE ratings (
  id SERIAL PRIMARY KEY NOT NULL,
  rating SMALLINT NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  resource_id INTEGER REFERENCES resources(id) ON DELETE CASCADE
)