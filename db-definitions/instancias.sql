DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS areas CASCADE;
DROP TABLE IF EXISTS vacancies CASCADE;
DROP TABLE IF EXISTS vacancy_areas CASCADE;
DROP TABLE IF EXISTS user_interests CASCADE;
DROP TABLE IF EXISTS user_vacancies_interests CASCADE;

CREATE TABLE users	 
( 
  registration_number VARCHAR(8) NOT NULL,
  email VARCHAR(30) NOT NULL,  
  password VARCHAR(24) NOT NULL,  
  name VARCHAR(50) NOT NULL,  
  cv_link TEXT,  
  is_teacher BOOLEAN NOT NULL,
  CONSTRAINT pk_users PRIMARY KEY (registration_number)
);

CREATE TABLE areas
( 
  area_name VARCHAR(50) NOT NULL,  
  CONSTRAINT pk_areas PRIMARY KEY (area_name)
);

CREATE TABLE vacancies
( 
  vacancy_id SERIAL PRIMARY KEY,
  owner_registration_number VARCHAR(8) NOT NULL,
  occupant_registration_number VARCHAR(8),
  name VARCHAR(50) NOT NULL,  
  description TEXT NOT NULL,
  type VARCHAR(30) NOT NULL, 
  total_payment NUMERIC, 
  FOREIGN KEY(owner_registration_number) REFERENCES users (registration_number) ON DELETE CASCADE,
  FOREIGN KEY(occupant_registration_number) REFERENCES users (registration_number) ON DELETE CASCADE
);

CREATE TABLE vacancy_areas
( 
  vacancy_id INTEGER NOT NULL,
  area_name VARCHAR(50) NOT NULL,  
  PRIMARY KEY (vacancy_id,area_name),
  FOREIGN KEY(vacancy_id) REFERENCES vacancies (vacancy_id) ON DELETE CASCADE,
  FOREIGN KEY(area_name) REFERENCES areas (area_name) ON DELETE CASCADE
);

CREATE TABLE user_interests
( 
  registration_number VARCHAR(8) NOT NULL,
  area_name VARCHAR(50) NOT NULL,  
  PRIMARY KEY (registration_number,area_name),
  FOREIGN KEY(registration_number) REFERENCES users (registration_number) ON DELETE CASCADE,
  FOREIGN KEY(area_name) REFERENCES areas (area_name) ON DELETE CASCADE
);

CREATE TABLE user_vacancies_interests
( 
  registration_number VARCHAR(8) NOT NULL,
  vacancy_id INTEGER NOT NULL,
  PRIMARY KEY (registration_number,vacancy_id),
  FOREIGN KEY(registration_number) REFERENCES users (registration_number) ON DELETE CASCADE,
  FOREIGN KEY(vacancy_id) REFERENCES vacancies (vacancy_id) ON DELETE CASCADE
);

-- Populando as tabelas

-- users
INSERT INTO users VALUES ('00123456', 'aluno@ufrgs.br','Teste123', 'João Rodrigues', null, false);
INSERT INTO users VALUES ('00112233', 'professor@ufrgs.br','Teste123', 'Maria Silva', null, true);

-- areas
INSERT INTO areas VALUES ('Engenharia de Software');
INSERT INTO areas VALUES ('Inteligência Artificial');

-- vacancies
INSERT INTO vacancies(owner_registration_number, occupant_registration_number, name, description, type)
 VALUES ('00112233','00123456', 'Bolsa de IC - Engenharia de Software', 'Estudar padrões de Arquitetura', 'Bolsa IC');

-- vacancy_areas
INSERT INTO vacancy_areas VALUES (1, 'Engenharia de Software');
INSERT INTO vacancy_areas VALUES (1, 'Inteligência Artificial');

-- user_interests
INSERT INTO user_interests VALUES ('00123456', 'Engenharia de Software');

