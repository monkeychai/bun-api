PRAGMA foreign_keys=ON;

-- Sample Tables
--      Because you forget how basic SQL works

CREATE TABLE worlds (
    id           INTEGER         PRIMARY KEY AUTOINCREMENT,
    created_at   DATETIME        DEFAULT CURRENT_TIMESTAMP,
    name         VARCHAR(50)     NOT NULL,
    num_blobs    INTEGER CHECK ( num_blobs >= 2 AND num_blobs <= 6 ) NOT NULL,
    status       TEXT CHECK(status IN ('created', 'running', 'stopped')) NOT NULL DEFAULT 'created'
);

CREATE TABLE blobs (
    id          INTEGER         PRIMARY KEY AUTOINCREMENT,
    is_ready    INTEGER CHECK ( is_ready in (0, 1) ) DEFAULT 0 NOT NULL,

    world_id    INTEGER         REFERENCES worlds(id) ON DELETE CASCADE
    -- OR
    -- world_id    INTEGER     NOT NULL,
    -- FOREIGN KEY (world_id) REFERENCES worlds(id) ON DELETE CASCADE

);

ALTER TABLE worlds ADD COLUMN main_blob INTEGER NOT NULL REFERENCES blobs(id);