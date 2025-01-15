CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    refresh_token VARCHAR(255),
    token_version VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INT REFERENCES users(id)
);
CREATE TYPE role AS ENUM ('admin', 'member', 'viewer');
ALTER TABLE users ADD COLUMN rol role NOT NULL DEFAULT 'member';

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_token_version ON users(emtoken_versionail);



CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INT REFERENCES users(id)
);


CREATE TABLE team_members (
    id SERIAL PRIMARY KEY,
    team_id INT REFERENCES teams(id),
    user_id INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INT REFERENCES users(id)
);
CREATE TYPE role_type AS ENUM ('admin', 'member', 'viewer');
ALTER TABLE team_members ADD COLUMN role role_type NOT NULL DEFAULT 'member';


CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    deadline TIMESTAMP,
    assigned_to INT REFERENCES users(id),
    team_id INT REFERENCES teams(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INT REFERENCES users(id)
);

CREATE TYPE task_status AS ENUM ('to_do', 'doing', 'done');
ALTER TABLE tasks ADD COLUMN status task_status NOT NULL DEFAULT 'to_do';

CREATE UNIQUE INDEX idx_teams_name ON teams (name);
CREATE INDEX idx_teams_created_at ON teams (created_at);
CREATE INDEX idx_team_members_team_user ON team_members (team_id, user_id);
CREATE INDEX idx_team_members_role ON team_members (role);
CREATE INDEX idx_team_members_created_at ON team_members (created_at);
CREATE INDEX idx_tasks_team_status ON tasks (team_id, status);
CREATE INDEX idx_tasks_assigned_to ON tasks (assigned_to);
CREATE INDEX idx_tasks_deadline ON tasks (deadline);
CREATE INDEX idx_tasks_created_at ON tasks (created_at);
CREATE INDEX idx_tasks_title ON tasks (title);


CREATE TABLE token_versions (
    id SERIAL PRIMARY KEY,
    version VARCHAR(10) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT NOW(),
    created_by INT REFERENCES users(id),
);


CREATE INDEX idx_token_versions_version ON token_versions (version);