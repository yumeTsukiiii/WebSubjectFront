import React, {useContext, useEffect, useState} from 'react';
import {useTheme} from "@material-ui/styles";
import {Typography} from "@material-ui/core";
import MedicineActionTile from "./component/MedicineActionTile";
import MedicineTable from "./component/MedicineTable";
import GlobalContext from "../../../../store/context";
import {DistributionRepository, PaymentRepository} from "../../../../net/repo/repository";
import DateFnsUtils from "@date-io/date-fns";
import {handleNetCodeMessage} from "../../../../net/handler/ResponseHandler";
import {showErrorMessage, showSuccessMessage} from "../../../../store/default";
import Fade from "@material-ui/core/Fade";

const MedicinePage = (props) => {

    const ctx = useContext(GlobalContext);

    const distributionRepository = DistributionRepository.of('remote');

    const paymentRepository = PaymentRepository.of('remote');

    const [fadeIn, setFadeIn] = useState(false);

    const theme = useTheme();

    const [medicalNumber, setMedicalNumber] = useState('');

    const [dateCondition, setDateCondition] = useState(new Date());

    const [medicineInfo, setMedicineInfo] = useState([
        {
            id: 1,
            name: '🐂🍺',
            price: 23,
            amount: 1,
            doctor: '傻逼医生',
            createTime: '2019-01-23',
        }
    ]);

    useEffect(() => {
        setFadeIn(true);
    }, []);

    const handleMedicalNumberChange = ({target}) => {
        setMedicalNumber(target.value);
    };

    const handleDateConditionChange = (date) => {
        setDateCondition(date);
    };

    const handleSearch = () => {
        distributionRepository.getWaitingDrugsByCodeAndTime({
            code: medicalNumber,
            time: new DateFnsUtils().format(dateCondition, 'yyyy-MM-dd')
        }).then(data => {
            setMedicineInfo(data.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                doctor: item.doctor,
                createTime: item.create_time,
                amount: item.amount
            })))
        }).catch(data => {
            handleNetCodeMessage(data, message => {
                showErrorMessage(ctx, message)
            })
        })
    };

    const handleMedicine = (rowData) => {
        distributionRepository.medicine({
            id: medicineInfo.map(item => item.id)
        }).then(data => {
            changeDrugStatus()
        }).catch(data => {
            handleNetCodeMessage(data, message => {
                showErrorMessage(ctx, message);
            })
        })
    };

    const changeDrugStatus = () => {
        paymentRepository.changeDrugStatus({
            info: medicineInfo.map(item => item.id)
        }).then(data => {
            showSuccessMessage(ctx, "发药成功")
        }).catch(data => {
            handleNetCodeMessage(data, message => {
                showErrorMessage(ctx, message)
            })
        })
    };


    return (
        <Fade in={fadeIn}>
            <div>
                <Typography variant={"subtitle1"}>
                    药房信息查询
                </Typography>

                <MedicineActionTile
                    dateCondition={dateCondition}
                    onDateConditionChange={handleDateConditionChange}
                    medicalNumber={medicalNumber}
                    onMedicalNumberChange={handleMedicalNumberChange}
                    onSearchAction={handleSearch}/>

                <div style={{marginTop: theme.spacing(2)}}/>

                <Typography variant={"subtitle1"}>
                    处方药品信息
                </Typography>

                <div style={{marginTop: theme.spacing(2)}}/>

                <MedicineTable medicineInfo={medicineInfo} onMedicine={handleMedicine}/>
            </div>
        </Fade>
    );
};

export default MedicinePage;