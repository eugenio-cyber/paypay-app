CREATE DATABASE paypay;

DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users(
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  cpf INTEGER,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  phone INTEGER
);

DROP TABLE IF EXISTS clients;

CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
 	name TEXT NOT NULL,
  	email TEXT NOT NULL UNIQUE,
  	cpf INTEGER NOT NULL,
  	phone INTEGER NOT NULL ,
  	cep INTEGER,
  	street TEXT,
  	complement TEXT,
  	address TEXT,
  	city TEXT,
  	state TEXT,
	status BOOLEAN NOT NULL,
    user_id INTEGER REFERENCES users(id)
);

DROP TABLE IF EXISTS charges;

CREATE TABLE IF NOT EXISTS charges(
	id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES clients(id),
  	description TEXT NOT NULL,
  	value BIGINT NOT NULL,
    due DATE NOT NULL,
    status TEXT NOT NULL
);
