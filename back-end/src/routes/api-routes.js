const express = require('express');
const router = express();
const queryController = require('../controllers/query-controller');

router.post('/select_user_password', queryController.redirectSelectUserPassword, queryController.exportData);
router.post('/select_vacancies', queryController.redirectSelectVacancies, queryController.exportVacancies);
router.post('/insert_vacancy', queryController.redirectInsertVacancy, queryController.insertData);

module.exports = router;
