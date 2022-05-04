// Requiring packages
const format = require('pg-format');

// Requiring scripts
const APIUtil = require('./API-util');

// Queries
const SELECT_VACANCIES = (params) => {

  let selectQuery = `SELECT v.*,va.area_name
  FROM vacancies v
  LEFT JOIN vacancy_areas va ON v.vacancy_id = va.vacancy_id
    `;

  return selectQuery;
};

const SELECT_AREAS = (params) => {

  let selectQuery = `SELECT *
  FROM areas 
    `;

  return selectQuery;
};

const UPSERT_VACANCY = (params) => {
  const vacancy_id = params.vacancy_id;
  const owner_registration_number = params.owner_registration_number;
  const name = params.name;
  const type = params.type;
  const description = params.description;
  const total_payment = params.total_payment || null;

  let insertQuery = vacancy_id ? `
  UPDATE vacancies SET 
  owner_registration_number = %L,
  name = %L,
  description = %L,
  type = %L,
  total_payment = %L
  WHERE vacancy_id = %L
  `: `
  INSERT INTO vacancies(owner_registration_number, name, description, type, total_payment)
  VALUES (%L, %L, %L, %L, %L)
  RETURNING vacancy_id
  `

  return vacancy_id ? format(insertQuery, owner_registration_number, name, description, type, total_payment, vacancy_id) : format(insertQuery, owner_registration_number, name, description, type, total_payment)
}

const SELECT_VACANCY_INTEREST = (params) => {

  let selectQuery = `
  SELECT * FROM user_vacancies_interests
  `

  return selectQuery
}

const INSERT_VACANCY_INTEREST = (params) => {
  const registration_number = params.registration_number;
  const vacancy_id = params.vacancy_id;

  let insertQuery = `
  INSERT INTO user_vacancies_interests(registration_number, vacancy_id)
  VALUES (%L, %L)
  `

  return format(insertQuery, registration_number, vacancy_id)
}

const INSERT_VACANCY_AREAS = (params) => {
  const vacancy_id = params.vacancy_id;
  const areas = params.areas;
  const rowsToInsert = areas.map((area) => {
    return [vacancy_id, area]
  })

  let insertQuery = `
  INSERT INTO vacancy_areas(vacancy_id, area_name)
  VALUES %L
  ON CONFLICT ON CONSTRAINT pk_vacancy_areas DO NOTHING
  `

  return format(insertQuery, rowsToInsert)
}

const UPDATE_USER = (params) => {
  const registration_number = params.registration_number;
  const name = params.name;
  const password = params.password;
  const email = params.email;
  const cv_link = params.cv_link;

  let updateQuery = `UPDATE users
  SET
    name = %L,
    password = %L,
    email = %L,
    cv_link = %L
  WHERE registration_number = %L
  `;

  return format(updateQuery, name, password, email, cv_link, registration_number)
};

const UPDATE_OCCUPANT = (params) => {
  const vacancy_id = params.vacancy_id;
  const occupant_registration_number = params.occupant_registration_number;

  let updateQuery = occupant_registration_number ? `UPDATE vacancies
  SET
    occupant_registration_number = %L
  WHERE vacancy_id = %L 
  ` : `UPDATE vacancies
  SET
    occupant_registration_number = null
  WHERE vacancy_id = %L 
  `;

  return occupant_registration_number ? format(updateQuery, occupant_registration_number, vacancy_id) : format(updateQuery, vacancy_id)
};

const INSERT_USER_INTERESTS = (params) => {
  const registration_number = params.registration_number;
  const areas = params.area_interests;
  const rowsToInsert = areas.map((area) => {
    return [registration_number, area]
  })

  let insertQuery = `INSERT INTO user_interests(registration_number, area_name)
  VALUES %L
  `;
  return format(insertQuery, rowsToInsert)
};

const DELETE_USER_INTERESTS = (params) => {
  const registration_number = params.registration_number;
  const areas = params.area_interests;

  let deleteQuery = `DELETE FROM user_interests WHERE registration_number = %L
   AND area_name in (%L)
  `;

  return format(deleteQuery, registration_number, areas)
};

const DELETE_VACANCY_AREAS = (params) => {
  const vacancy_id = params.vacancy_id;
  const areas = params.areas;

  let deleteQuery = `DELETE FROM vacancy_areas WHERE vacancy_id = %L
   AND area_name in (%L)
  `;

  return format(deleteQuery, vacancy_id, areas)
};

const DELETE_VACANCY = (params) => {
  const vacancy_id = params.vacancy_id;

  let deleteQuery = `DELETE FROM vacancies WHERE vacancy_id = %L
  `;

  return format(deleteQuery, vacancy_id)
};

const SELECT_USERS = (params) => {

  let selectQuery = `SELECT u.*,i.area_name FROM users u 
  LEFT JOIN user_interests i ON u.registration_number = i.registration_number
  `;

  return selectQuery
};

const SELECT_USER_PASSWORD = (params) => {
  const user_number = params.user_number;

  let selectQuery = `SELECT *
  FROM users u
    WHERE registration_number = %L
  `;

  return format(selectQuery, user_number);
};

module.exports = {
  SELECT_VACANCIES,
  SELECT_AREAS,
  SELECT_USERS,
  SELECT_USER_PASSWORD,
  SELECT_VACANCY_INTEREST,
  UPDATE_USER,
  UPDATE_OCCUPANT,
  UPSERT_VACANCY,
  INSERT_VACANCY_AREAS,
  INSERT_VACANCY_INTEREST,
  INSERT_USER_INTERESTS,
  DELETE_USER_INTERESTS,
  DELETE_VACANCY,
  DELETE_VACANCY_AREAS,
};
