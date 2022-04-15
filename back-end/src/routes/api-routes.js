const express = require('express');
const router = express();
const queryController = require('../controllers/query-controller');

router.post('/select_user_password', queryController.redirectSelectUserPassword, queryController.exportData);
router.post('/select_vacancies', queryController.redirectSelectVacancies, queryController.exportVacancies);
router.post('/insert_vacancy', queryController.redirectInsertVacancy, queryController.insertData);
router.delete('/delete_vacancy/:id', queryController.redirectDeleteVacancy, queryController.deleteData);
router.get('/select_vacancy/:id', queryController.redirectGetVacancy, queryController.exportVacancy);

module.exports = router;
