const express = require('express');
const router = express();
const queryController = require('../controllers/query-controller');

router.post('/select_user_password', queryController.redirectSelectUserPassword, queryController.exportData);
router.post('/select_vacancies', queryController.redirectSelectVacancies, queryController.exportVacancies);
router.post('/select_areas', queryController.redirectSelectAreas, queryController.exportData);
router.post('/insert_vacancy', queryController.redirectInsertVacancy, queryController.insertData);
router.post('/insert_vacancy_interest', queryController.redirectInsertVacancyInterest, queryController.insertData);

module.exports = router;
