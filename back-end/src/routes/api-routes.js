const express = require('express');
const router = express();
const queryController = require('../controllers/query-controller');

router.post('/select_user_password', queryController.redirectSelectUserPassword, queryController.exportData);
router.post('/select_vacancies', queryController.redirectSelectVacancies, queryController.exportVacancies);
router.post('/select_vacancies_interests', queryController.redirectSelectVacancyInterest, queryController.exportVacanciesInterest);
router.post('/select_areas', queryController.redirectSelectAreas, queryController.exportData);
router.post('/select_users', queryController.redirectSelectUsers, queryController.exportsUsers);
router.post('/upsert_vacancy', queryController.redirectUpsertVacancy, queryController.insertData);
router.post('/insert_user_interests', queryController.redirectInsertUserInterest, queryController.insertData);
router.post('/insert_vacancy_interest', queryController.redirectInsertVacancyInterest, queryController.insertData);
router.post('/update_user', queryController.redirectUpdateUser, queryController.insertData);
router.post('/update_occupant', queryController.redirectUpdateOccupant, queryController.insertData);
router.post('/delete_user_interests', queryController.redirectDeleteInterests, queryController.deleteData);
router.post('/delete_vacancy', queryController.redirectDeleteVacancy, queryController.deleteData);
router.post('/delete_vacancy_areas', queryController.redirectDeleteVacancyAreas, queryController.deleteData);

module.exports = router;
