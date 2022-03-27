import { FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';


export class TsUtils {
    public static atLeastOne =
        (validator: ValidatorFn) =>
            (group: FormGroup): ValidationErrors | null => {
                const hasAtLeastOne =
                    group && group.controls && Object.keys(group.controls).some((k) => !validator(group.controls[k]))

                return hasAtLeastOne ? null : { atLeastOne: true }
            }
}