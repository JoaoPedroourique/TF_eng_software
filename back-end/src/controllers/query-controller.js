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
  SELECT_USER_PASSWORD: {
    selectQuery: dbQueries.SELECT_USER_PASSWORD,
    printString: 'Usuário logado',
  },
};

const INSERT_PARAMS = {
  INSERT_VACANCY: {
    insertQuery: dbQueries.INSERT_VACANCY,
    printString: 'Vaga Inserida com sucesso',
  },
  INSERT_VACANCY_AREAS: {
    insertQuery: dbQueries.INSERT_VACANCY_AREAS,
    printString: 'Vaga cadastrada na Área',
  },
};

// Functions redirecting to the exportData function by adding their respective dataTypes to body
function redirectSelectVacancies(req, res, next) {
  req.body.dataType = 'SELECT_VACANCIES';
  next();
}

function redirectSelectUserPassword(req, res, next) {
  req.body.dataType = 'SELECT_USER_PASSWORD';
  next();
}

function redirectInsertVacancy(req, res, next) {
  req.body.dataType = 'INSERT_VACANCY';
  next();
}



/**
 * The main data export function (evaluate if will still be needed)
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
    rows.forEach(row =>{
      if(vacanciesMap.has(row.vacancy_id)) {
        vacanciesMap.get(row.vacancy_id).areas.push(row.area_name)
      } else {
        vacanciesMap.set(row.vacancy_id, {
          "vacancy_id": row.vacancy_id,
            "owner_registration_number": row.owner_registration_number,
            "occupant_registration_number": row.occupant_registration_number,
            "name": row.name,
            "description": row.description,
            "type": row.type,
            "areas": [row.area_name]
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
 * The main data export function
 * @param {*} req
 * @param {*} res
 */
 async function insertData(req, res) {
  
  let insertParams = INSERT_PARAMS[req.body.dataType];

  try {
    let query = insertParams.insertQuery(req.body.parameters);

    let queryResult = await authPool.query(query);

    if(req.body.dataType === 'INSERT_VACANCY') {
      insertParams = INSERT_PARAMS['INSERT_VACANCY_AREAS']
      req.body.parameters.vacancy_id = queryResult.rows[0].vacancy_id
      query = insertParams.insertQuery(req.body.parameters)
      queryResult = await authPool.query(query);
    }

    res.status(201).json({ result: insertParams.printString });
  } catch (queryError) {
    console.log('Error while executing query in dataBase.');
    console.error(queryError);
    res.status(500).json(APIUtils.msgJson(500));
  }
 }

module.exports = {
  redirectSelectVacancies,
  redirectSelectUserPassword,
  redirectInsertVacancy,
  exportData,
  exportVacancies,
  insertData
};