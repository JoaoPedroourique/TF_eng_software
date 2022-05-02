export interface Vacancy {
    vacancy_id: number,
    owner_registration_number: string
    occupant_registration_number: string,
    name: string,
    description: string,
    type: string,
    total_payment: number,
    areas: string[]
}