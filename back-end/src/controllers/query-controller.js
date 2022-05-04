const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const APIUtils = require('../util/API-util');
const dbQueries = require('../util/db-queries');
const authPool = require('../db/auth-db');

const SELECT_PARAMS = {
  SELECT_VACANCIES: {
    selectQuery: dbQueries.SELECT_VACANCIES,
    printString: 'Vagas Existentes',
  },
  SELECT_AREAS: {
    selectQuery: dbQueries.SELECT_AREAS,
    printString: 'Áreas Existentes',
  },
  SELECT_USER_PASSWORD: {
    selectQuery: dbQueries.SELECT_USER_PASSWORD,
    printString: 'Usuário logado',
  },
  SELECT_VACANCY_INTEREST: {
    selectQuery: dbQueries.SELECT_VACANCY_INTEREST,
    printString: 'Interesses por vaga',
  },
  SELECT_USERS: {
    selectQuery: dbQueries.SELECT_USERS,
    printString: 'Usuários',
  },
};

const INSERT_PARAMS = {
  UPSERT_VACANCY: {
    insertQuery: dbQueries.UPSERT_VACANCY,
    printString: 'Vaga Inserida com sucesso',
  },
  INSERT_VACANCY_AREAS: {
    insertQuery: dbQueries.INSERT_VACANCY_AREAS,
    printString: 'Vaga cadastrada na Área',
  },
  INSERT_VACANCY_INTEREST: {
    insertQuery: dbQueries.INSERT_VACANCY_INTEREST,
    printString: 'Cadastrar interesse de candidato em uma vaga',
  },
  INSERT_USER_INTERESTS: {
    insertQuery: dbQueries.INSERT_USER_INTERESTS,
    printString: 'Cadastrar interesse de candidato em uma área',
  },
  UPDATE_USER: {
    insertQuery: dbQueries.UPDATE_USER,
    printString: 'Atualiza dados de um usuário existente',
  },
  UPDATE_OCCUPANT: {
    insertQuery: dbQueries.UPDATE_OCCUPANT,
    printString: 'Atualiza aluno que ocupa uma vaga',
  },
};

const DELETE_PARAMS = {
  DELETE_VACANCY: {
    deleteQuery: dbQueries.DELETE_VACANCY,
    printString: {
      success: "Vaga removida com sucesso!",
      notFound: "Vaga não encontrada!"
    },
  },
  DELETE_USER_INTERESTS: {
    deleteQuery: dbQueries.DELETE_USER_INTERESTS,
    printString: {
      success: "Interesse removida com sucesso!",
      notFound: "Interesse não encontrada!"
    },
  },
  DELETE_VACANCY_AREAS: {
    deleteQuery: dbQueries.DELETE_VACANCY_AREAS,
    printString: {
      success: "Area removida com sucesso!",
      notFound: "Area não encontrada!"
    },
  }
};

// Functions redirecting to the exportData function by adding their respective dataTypes to body
function redirectSelectVacancies(req, res, next) {
  req.body.dataType = 'SELECT_VACANCIES';
  next();
}

function redirectSelectAreas(req, res, next) {
  req.body.dataType = 'SELECT_AREAS';
  next();
}

function redirectSelectUserPassword(req, res, next) {
  req.body.dataType = 'SELECT_USER_PASSWORD';
  next();
}

function redirectUpsertVacancy(req, res, next) {
  req.body.dataType = 'UPSERT_VACANCY';
  next();
}

function redirectInsertVacancyInterest(req, res, next) {
  req.body.dataType = 'INSERT_VACANCY_INTEREST';
  next();
}

function redirectInsertUserInterest(req, res, next) {
  req.body.dataType = 'INSERT_USER_INTERESTS';
  next();
}

function redirectUpdateUser(req, res, next) {
  req.body.dataType = 'UPDATE_USER';
  next();
}

function redirectUpdateOccupant(req, res, next) {
  req.body.dataType = 'UPDATE_OCCUPANT';
  next();
}

function redirectSelectVacancyInterest(req, res, next) {
  req.body.dataType = 'SELECT_VACANCY_INTEREST';
  next();
}

function redirectSelectUsers(req, res, next) {
  req.body.dataType = 'SELECT_USERS';
  next();
}

function redirectDeleteInterests(req, res, next) {
  req.body.dataType = 'DELETE_USER_INTERESTS';
  next();
}

function redirectDeleteVacancy(req, res, next) {
  req.body.dataType = 'DELETE_VACANCY';
  next();
}

function redirectDeleteVacancyAreas(req, res, next) {
  req.body.dataType = 'DELETE_VACANCY_AREAS';
  next();
}




/**
 * The main data export function
 * @param {*} req
 * @param {*} res
 */
async function exportData(req, res) {

  const exportParams = SELECT_PARAMS[req.body.dataType];

  try {
    let query = exportParams.selectQuery(req.body.parameters);

    let queryResult = await authPool.query(query);

    if (queryResult.rowCount == 0) {
      res.status(204).json(APIUtils.msgJson(204));
      return;
    }

    res.status(201).json({ result: queryResult.rows });
  } catch (queryError) {
    console.log('Error while executing query in dataBase.');
    console.error(queryError);
    res.status(500).json(APIUtils.msgJson(500));
  }
}

/**
 * The customized export vacancies function
 * @param {*} req
 * @param {*} res
 */
async function exportVacancies(req, res) {

  const exportParams = SELECT_PARAMS[req.body.dataType];

  try {
    let query = exportParams.selectQuery(req.body.parameters);

    let queryResult = await authPool.query(query);

    if (queryResult.rowCount == 0) {
      res.status(204).json(APIUtils.msgJson(204));
      return;
    }

    const rows = queryResult.rows
    const vacanciesMap = new Map()
    rows.forEach(row => {
      if (vacanciesMap.has(row.vacancy_id)) {
        if (row.area_name)
          vacanciesMap.get(row.vacancy_id).areas.push(row.area_name)
      } else {
        vacanciesMap.set(row.vacancy_id, {
          "vacancy_id": row.vacancy_id,
          "owner_registration_number": row.owner_registration_number,
          "occupant_registration_number": row.occupant_registration_number,
          "name": row.name,
          "description": row.description,
          "type": row.type,
          "areas": row.area_name ? [row.area_name] : [],
          "total_payment": row.total_payment
        })
      }
    })

    res.status(201).json({ result: Array.from(vacanciesMap.values()) });
  } catch (queryError) {
    console.log('Error while executing query in dataBase.');
    console.error(queryError);
    res.status(500).json(APIUtils.msgJson(500));
  }
}

/**
 * The customized export vacancies interests function
 * @param {*} req
 * @param {*} res
 */
async function exportVacanciesInterest(req, res) {

  const exportParams = SELECT_PARAMS[req.body.dataType];

  try {
    let query = exportParams.selectQuery(req.body.parameters);

    let queryResult = await authPool.query(query);

    if (queryResult.rowCount == 0) {
      res.status(204).json(APIUtils.msgJson(204));
      return;
    }

    const rows = queryResult.rows
    const interestsMap = new Map()
    rows.forEach(row => {
      if (interestsMap.has(row.vacancy_id)) {
        interestsMap.get(row.vacancy_id).registration_numbers.push(row.registration_number)
      } else {
        interestsMap.set(row.vacancy_id, {
          "vacancy_id": row.vacancy_id,
          "registration_numbers": [row.registration_number],
        })
      }
    })

    res.status(201).json({ result: Array.from(interestsMap.values()) });
  } catch (queryError) {
    console.log('Error while executing query in dataBase.');
    console.error(queryError);
    res.status(500).json(APIUtils.msgJson(500));
  }
}

/**
 * The customized export users function
 * @param {*} req
 * @param {*} res
 */
async function exportsUsers(req, res) {

  const exportParams = SELECT_PARAMS[req.body.dataType];

  try {
    let query = exportParams.selectQuery(req.body.parameters);

    let queryResult = await authPool.query(query);

    if (queryResult.rowCount == 0) {
      res.status(204).json(APIUtils.msgJson(204));
      return;
    }

    const rows = queryResult.rows
    const usersMap = new Map()
    rows.forEach(row => {
      if (usersMap.has(row.registration_number)) {
        usersMap.get(row.registration_number).area_interests.push(row.area_name)
      } else {
        usersMap.set(row.registration_number, {
          "registration_number": row.registration_number,
          "email": row.email,
          "password": row.password,
          "name": row.name,
          "cv_link": row.cv_link,
          "is_teacher": row.is_teacher,
          "area_interests": [row.area_name],
        })
      }
    })

    res.status(201).json({ result: Array.from(usersMap.values()) });
  } catch (queryError) {
    console.log('Error while executing query in dataBase.');
    console.error(queryError);
    res.status(500).json(APIUtils.msgJson(500));
  }
}

/**
 * The main data insert function
 * @param {*} req
 * @param {*} res
 */
async function insertData(req, res) {

  let insertParams = INSERT_PARAMS[req.body.dataType];

  try {
    let query = insertParams.insertQuery(req.body.parameters);

    let queryResult = await authPool.query(query);

    if (req.body.dataType === 'INSERT_VACANCY') {
      insertParams = INSERT_PARAMS['INSERT_VACANCY_AREAS']
      req.body.parameters.vacancy_id = queryResult.rows[0].vacancy_id
      query = insertParams.insertQuery(req.body.parameters)
      if (req.body.areas.length > 0) {
        queryResult = await authPool.query(query);
      }
    }

    res.status(201).json({ result: insertParams.printString });
  } catch (queryError) {
    console.log('Error while executing query in dataBase.');
    console.error(queryError);
    res.status(500).json(APIUtils.msgJson(500));
  }
}

/**
 * function to delete data in the database
 * @param {*} req
 * @param {*} res
 */
async function deleteData(req, res) {

  let deleteParams = DELETE_PARAMS[req.body.dataType];

  try {
    let query = deleteParams.deleteQuery(req.body.parameters);

    let queryResult = await authPool.query(query);

    let statusCode, message;
    if (queryResult.rowCount) {
      statusCode = 204
      message = deleteParams.printString.success
    } else {
      statusCode = 404
      message = deleteParams.printString.notFound
    }
    res.status(statusCode).json({ result: message });
  } catch (queryError) {
    console.log('Error while executing query in dataBase.');
    console.error(queryError);
    res.status(400).json(APIUtils.msgJson(400));
  }
}

module.exports = {
  redirectSelectVacancies,
  redirectSelectAreas,
  redirectSelectUserPassword,
  redirectUpsertVacancy,
  redirectInsertVacancyInterest,
  redirectInsertUserInterest,
  redirectUpdateUser,
  redirectUpdateOccupant,
  redirectSelectVacancyInterest,
  redirectSelectUsers,
  redirectDeleteInterests,
  redirectDeleteVacancy,
  redirectDeleteVacancyAreas,
  exportData,
  exportVacancies,
  exportVacanciesInterest,
  exportsUsers,
  insertData,
  deleteData
};
