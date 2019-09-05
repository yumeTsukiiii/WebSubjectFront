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

/**
 * Repository用于控制使用数据来源
 * 此处使用test和remote两个来源，便于调试
 * test返回固定数据，remote返回网络远程数据
 * */

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

    /**
     * 登录
     * */
    login({username, password}) {
        return this.source.login({username, password});
    }

    /**
     * 登出
     * */
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

    /**
     * 医生获取当天挂号信息
     * */
    getRegisteredItemsByNowaday() {
        return this.source.getRegisteredItemsByNowaday();
    }

    /**
     * 医生根据病历号获取病人信息
     * */
    getPatientInfoByMedicalNumber({medicalNumber}) {
        return this.source.getPatientInfoByMedicalNumber({medicalNumber});
    }

    /**
     * 医生搜索疾病
     * */
    getDiseaseByName({diseaseName}) {
        return this.source.getDiseaseByName({diseaseName});
    }

    /**
     * 医生获取病人最近一次的病历信息
     * */
    getRecentMedicalRecordByCode({medicalNumber}) {
        return this.source.getRecentMedicalRecordByCode({medicalNumber});
    }

    /**
     * 提交诊断
     * */
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

    /**
     * 搜索处方模版
     * @param diagnoseName 模版名称
     * */
    getPrescriptionTemplateByName({diagnoseName}) {
        return this.source.getPrescriptionTemplateByName({diagnoseName});
    }

    /**
     * 获取处方模版详情
     * @name 处方名称
     * */
    getPrescriptionDetailByName({name}) {
        return this.source.getPrescriptionTempDetailByName({name});
    }

    /**
     * 提交处方
     * @param id 挂号id
     * @param prescriptions 处方列表
     * */
    commitPrescription({id, prescriptions}) {
        return this.source.commitPrescription({id, prescriptions});
    }

    /**
     * 搜索药品
     * */
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

    /**
     * 根据时间和病历号获取已收费的药品（包括已收费和已取药）
     * */
    getWaitingDrugsByCodeAndTime({code, time}) {
        return this.source.getWaitingDrugsByCodeAndTime({code, time});
    }

    /**
     * 取药
     * */
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

    /**
     * 根据病历号获取收费项
     * */
    getChargeItemsByCode({medicalNumber}) {
        return this.source.getChargeItemsByCode({medicalNumber});
    }

    /**
     * 提交发票
     * */
    commitBill({paymentId, price}) {
        return this.source.commitBill({paymentId, price});
    }

    /**
     * 获取支付方式
     * */
    getPaymentMethods() {
        return this.source.getPaymentMethods();
    }

    /**
     * 将药品改为已收费
     * */
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

    /**
     * 获取科室
     * */
    getDepartments() {
        return this.source.getDepartments();
    }

    /**
     * 根据科室获取值班医生
     * */
    getDoctorsByDepartment({department}) {
        return this.source.getDoctorsByDepartment({department});
    }

    /**
     * 获取医生限号信息
     * */
    getLimitationByDoctor({doctor}) {
        return this.source.getLimitationByDoctor({doctor});
    }

    /**
     * 根据病历号获取病人信息
     * */
    getPatientInfoByMedicalNumber({code}) {
        return this.source.getPatientInfoByMedicalNumber({code});
    }

    /**
     * 挂号
     * */
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

    /**
     * 退号
     * */
    unregistered({medicalNumber}) {
        return this.source.unregistered({medicalNumber});
    }

    /**
     * 根据病历号获取挂号信息
     * */
    getRegisteredInfoByMedicalNumber({medicalNumber}) {
        return this.source.getRegisteredInfoByMedicalNumber({medicalNumber});
    }
}