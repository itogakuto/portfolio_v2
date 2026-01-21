
-- Nexus Portfolio Database Schema
-- Standard PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Topics (Projects/Works/Others)
CREATE TABLE IF NOT EXISTS topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category VARCHAR(20) NOT NULL CHECK (category IN ('Projects', 'Works', 'Others')),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    summary TEXT,
    body TEXT,
    tags TEXT[] DEFAULT '{}',
    role TEXT,
    links JSONB DEFAULT '[]',
    featured BOOLEAN DEFAULT false,
    "order" INTEGER DEFAULT 0,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(10) DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    media TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- News
CREATE TABLE IF NOT EXISTS news (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT,
    short_text TEXT,
    body TEXT,
    date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(10) DEFAULT 'published',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activities
CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    title TEXT NOT NULL,
    summary TEXT,
    body TEXT,
    featured BOOLEAN DEFAULT false,
    "order" INTEGER DEFAULT 0,
    status VARCHAR(10) DEFAULT 'published',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hero Settings (Single row or separate table)
CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL
);

-- Initial Seed for Hero Words
INSERT INTO site_settings (key, value) VALUES ('hero_words', '["Complex Systems into Elegant Motion.", "Human Intuition through Digital Rigor."]')
ON CONFLICT (key) DO NOTHING;
