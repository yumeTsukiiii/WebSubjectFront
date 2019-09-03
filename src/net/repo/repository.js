import TestAuthService from './test_source/TestAuthService';
import AuthService from './remote_source/AuthService';
import TestDiagnoseService from './test_source/TestDiagnoseService';
import DiagnoseService from './remote_source/DiagnoseService';
import ReservationService from './remote_source/ReservationService';
import TestReservationService from './test_source/TestReservationService';
import PaymentService from './remote_source/PaymentService';
import TestPaymentService from './test_source/TestPaymentService'
import TestDistributionService from './test_source/TestDistributionService';
import DistributionService from './remote_source/DistributionService'

export class AuthRepository {

    constructor(sourceType) {
        if (sourceType === 'test') {
            this.source = TestAuthService;
        } else if (sourceType === 'remote') {
            this.source = AuthService;
        } else {
            this.source = TestAuthService;
        }
    }

    static of(sourceType = 'test') {
        return new AuthRepository(sourceType);
    }

    login({username, password}) {
        return this.source.login({username, password});
    }

    logout() {
        return this.source.logout();
    }
}

export class DiagnoseRepository {
    constructor(sourceType) {
        if (sourceType === 'test') {
            this.source = TestDiagnoseService;
        } else if (sourceType === 'remote') {
            this.source = DiagnoseService;
        } else {
            this.source = TestDiagnoseService;
        }
    }

    static of(sourceType = 'test') {
        return new DiagnoseRepository(sourceType);
    }

    getRegisteredItemsByNowaday() {
        return this.source.getRegisteredItemsByNowaday();
    }

    getPatientInfoByMedicalNumber({medicalNumber}) {
        return this.source.getPatientInfoByMedicalNumber({medicalNumber});
    }

    getDiseaseByName({diseaseName}) {
        return this.source.getDiseaseByName({diseaseName});
    }

    getRecentMedicalRecordByCode({medicalNumber}) {
        return this.source.getRecentMedicalRecordByCode({medicalNumber});
    }

    commitDiagnose({
        reservation_id, description, current_history,
        treatment_situation, pass_history, allergy_history, check,
        diagnosis
    }) {
        return this.source.commitDiagnose({
            reservation_id, description, current_history,
            treatment_situation, pass_history, allergy_history, check,
            diagnosis
        });
    }

    getPrescriptionTemplateByName({diagnoseName}) {
        return this.source.getPrescriptionTemplateByName({diagnoseName});
    }

    getPrescriptionDetailByName({name}) {
        return this.source.getPrescriptionTempDetailByName({name});
    }

    commitPrescription({id, prescriptions}) {
        return this.source.commitPrescription({id, prescriptions});
    }

    getDrugsByName({drugName}) {
        return this.source.getDrugsByName({drugName});
    }

}

export class DistributionRepository {
    constructor(sourceType) {
        if (sourceType === 'test') {
            this.source = TestDistributionService;
        } else if (sourceType === 'remote') {
            this.source = DistributionService;
        } else {
            this.source = DistributionService;
        }
    }

    static of(sourceType) {
        return new DistributionRepository(sourceType)
    }

    getWaitingDrugsByCodeAndTime({code, time}) {
        return this.source.getWaitingDrugsByCodeAndTime({code, time});
    }

    medicine({id}) {
        return this.source.medicine({id});
    }
}

export class PaymentRepository {
    constructor(sourceType) {
        if (sourceType === 'test') {
            this.source = TestPaymentService;
        } else if (sourceType === 'remote') {
            this.source = PaymentService;
        } else {
            this.source = PaymentService;
        }
    }

    static of(sourceType) {
        return new PaymentRepository(sourceType);
    }

    getChargeItemsByCode({medicalNumber}) {
        return this.source.getChargeItemsByCode({medicalNumber});
    }

    commitBill({paymentId, price}) {
        return this.source.commitBill({paymentId, price});
    }

    getPaymentMethods() {
        return this.source.getPaymentMethods();
    }

    changeDrugStatus({info}) {
        return this.source.changeDrugStatus({info});
    }
}

export class ReservationRepository {
    constructor(sourceType) {
        if (sourceType === 'test') {
            this.source = TestReservationService;
        } else if (sourceType === 'remote') {
            this.source = ReservationService;
        } else {
            this.source = TestReservationService;
        }
    }

    static of(sourceType = 'test') {
        return new ReservationRepository(sourceType);
    }

    /**
     * 获取病历号
     * */
    getRegisteredCode() {
        return this.source.getRegisteredCode();
    }

    /**
     * 获取号别
     * */
    getRegisteredTypes() {
        return this.source.getRegisteredTypes();
    }

    getDepartments() {
        return this.source.getDepartments();
    }

    getDoctorsByDepartment({department}) {
        return this.source.getDoctorsByDepartment({department});
    }

    getLimitationByDoctor({doctor}) {
        return this.source.getLimitationByDoctor({doctor});
    }

    getPatientInfoByMedicalNumber({code}) {
        return this.source.getPatientInfoByMedicalNumber({code});
    }

    registered(
        { code, name, sex, birthday,
            payment, date, isMorning,
            doctor, home, identity_number, record_book, invoice_code
        }) {
        return this.source.registered({ code, name, sex, birthday,
            payment, date, isMorning,
            doctor, home, identity_number, record_book, invoice_code
        });
    }

    unregistered({medicalNumber}) {
        return this.source.unregistered({medicalNumber});
    }

    getRegisteredInfoByMedicalNumber({medicalNumber}) {
        return this.source.getRegisteredInfoByMedicalNumber({medicalNumber});
    }
}