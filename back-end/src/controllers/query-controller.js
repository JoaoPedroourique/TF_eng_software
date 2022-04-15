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
  SELECT_VACANCY: {
    selectQuery: dbQueries.SELECT_VACANCY,
    printString: 'Descrição de uma vaga',
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

const DELETE_PARAMS = {
  DELETE_VACANCY: {
    deleteQuery: dbQueries.DELETE_VACANCY,
    printString: {
      success: "Vaga removida com muito sexo!",
      notFound: "Vaga não encontrada!"
    },
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

function redirectDeleteVacancy(req, res, next) {
  req.params.dataType = 'DELETE_VACANCY';
  next();
}

function redirectInsertVacancy(req, res, next) {
  req.body.dataType = 'INSERT_VACANCY';
  next();
}

function redirectGetVacancy(req, res, next) {
  req.params.dataType = 'SELECT_VACANCY';
  next();
}


/**
 * The main data export function (evaluate if it's gonna be needed in the future)
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
 * A function that returns the details of a vacancy (if its id exists in the database)
 * @param {*} req
 * @param {*} res
 */
 async function exportVacancy(req, res) {
  
  const exportParams = SELECT_PARAMS[req.params.dataType];

  try {
    let query = exportParams.selectQuery(req.params);

    let queryResult = await authPool.query(query);

    if (!queryResult.rowCount) {
      res.status(404).json(APIUtils.msgJson(404));
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

/**
 * function to delete data in the database
 * @param {*} req
 * @param {*} res
 */
 async function deleteData(req, res) {
  
  let deleteParams = DELETE_PARAMS[req.params.dataType];

  try {
    let query = deleteParams.deleteQuery(req.params);

    let queryResult = await authPool.query(query);
    
    let statusCode, message;
    if(queryResult.rowCount){
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
  redirectSelectUserPassword,
  redirectInsertVacancy,
  redirectGetVacancy,
  redirectDeleteVacancy,
  exportData,
  exportVacancies,
  exportVacancy,
  insertData,
  deleteData,
};
