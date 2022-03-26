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

const INSERT_VACANCY = (params) => {
  const owner_registration_number = params.owner_registration_number;
  const name = params.name;
  const type = params.type;
  const description = params.description;

  let insertQuery = `
  INSERT INTO vacancies(owner_registration_number, name, description, type)
  VALUES (%L, %L, %L, %L)
  RETURNING vacancy_id
  `

  return format(insertQuery, owner_registration_number, name, description, type)
}

const INSERT_VACANCY_AREAS = (params) => {
  const vacancy_id = params.vacancy_id;
  const areas = params.areas;
  const rowsToInsert = areas.map((area) => {
    return [vacancy_id,area]
  })

  let insertQuery = `
  INSERT INTO vacancy_areas(vacancy_id, area_name)
  VALUES %L
  `

  return format(insertQuery,rowsToInsert)
}

const SELECT_USER_PASSWORD = (params) => {
  const user_number = params.user_number;

  let selectQuery = `SELECT u.password
  FROM users u
    WHERE registration_number = %L
  `;

  return format(selectQuery,user_number);
};

module.exports = {
  SELECT_VACANCIES,
  SELECT_USER_PASSWORD,
  INSERT_VACANCY,
  INSERT_VACANCY_AREAS,
};
