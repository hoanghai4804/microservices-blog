-- Create database if not exists
SELECT 'CREATE DATABASE blogdb'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'blogdb')\gexec

-- Connect to blogdb
\c blogdb

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create index on created_at
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);

-- Insert sample data
INSERT INTO posts (title, content, author) VALUES
    ('Welcome to Our Blog', 'This is the first post on our microservices blog platform!', 'Admin'),
    ('Docker Tutorial', 'Learn how to containerize applications with Docker.', 'Tech Team'),
    ('FastAPI Guide', 'Build fast and modern APIs with FastAPI framework.', 'Dev Team')
ON CONFLICT DO NOTHING;