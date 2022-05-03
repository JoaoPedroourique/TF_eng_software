// Requiring packages
const format = require('pg-format');

// Requiring scripts
const APIUtil = require('./API-util');

// Queries
const SELECT_VACANCIES = (params) => {
  const owner_registration_number = params.owner_registration_number;
  const occupant_registration_number = params.occupant_registration_number;
  const type = params.type;
  const areas = params.areas;

  let selectQuery = `SELECT *
  FROM vacancies v
  LEFT JOIN vacancy_areas va ON v.vacancy_id = va.vacancy_id WHERE 1=1
  ${owner_registration_number ? `AND v.owner_registration_number = (${format(`%L`, owner_registration_number)})` : ''}
  ${occupant_registration_number ? `AND v.occupant_registration_number = (${format(`%L`, occupant_registration_number)})` : ''}
  ${type ? `AND v.type = (${format(`%L`, type)})` : ''}
  ${areas ? `AND va.area_name IN (${format(`%L`, areas)})` : ''}
    `;

  return selectQuery;
};

const SELECT_AREAS = (params) => {

  let selectQuery = `SELECT *
  FROM areas 
    `;

  return selectQuery;
};

const INSERT_VACANCY = (params) => {
  const owner_registration_number = params.owner_registration_number;
  const name = params.name;
  const type = params.type;
  const description = params.description;
  const total_payment = params.total_payment || null;

  let insertQuery = `
  INSERT INTO vacancies(owner_registration_number, name, description, type, total_payment)
  VALUES (%L, %L, %L, %L, %L)
  RETURNING vacancy_id
  `

  return format(insertQuery, owner_registration_number, name, description, type, total_payment)
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
  INSERT_VACANCY,
  INSERT_VACANCY_AREAS,
  INSERT_VACANCY_INTEREST,
  INSERT_USER_INTERESTS,
  DELETE_USER_INTERESTS
};
