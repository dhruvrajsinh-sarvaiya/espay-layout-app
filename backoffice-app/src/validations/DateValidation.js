import Moment from 'moment';
import R from '../native_theme/R';

//Common From Date and To Date Validation Method
//Check Validation of Date is Empty or Not,From Date cannot be greater than To Date and You can not view more than 10 days report
export function DateValidation(FDate, TDate, isNotRequired = false, Days = 10) {

    try {
        var ToastMessage = null;

        if (isNotRequired) {
            if (FDate.length > 0 && TDate.length > 0) {
                var fromDate = new Date(Moment(FDate, 'YYYY-MM-DD').format('LL'));
                var toDate = new Date(Moment(TDate, 'YYYY-MM-DD').format());

                if (toDate.getTime() < fromDate.getTime()) {
                    ToastMessage = R.strings.dateGreterValidation;
                } else {
                    var fromdate = new Date(Moment(FDate, 'YYYY-MM-DD').format('LL'));
                    var fdate = fromdate.setDate(fromdate.getDate() + Days);

                    // convert as date format bcoz comparision is possible through date format
                    var newFromDate = new Date(fdate);
                    if (newFromDate.getTime() < toDate.getTime()) {
                        ToastMessage = R.strings.formatString(R.strings.dateDaysValidation, { Days })
                    }
                }
            }
        }
        else if (FDate.length == 0 && TDate.length == 0) {
            ToastMessage = R.strings.date_selection;
        } else {
            var fromDateSecond = new Date(Moment(FDate, 'YYYY-MM-DD').format('LL'));
            var toDateSecond = new Date(Moment(TDate, 'YYYY-MM-DD').format());

            if (toDateSecond.getTime() < fromDateSecond.getTime()) {
                ToastMessage = R.strings.dateGreterValidation;
            } else {
                var fromdateSecond = new Date(Moment(FDate, 'YYYY-MM-DD').format('LL'));
                var fdateNew = fromdateSecond.setDate(fromdateSecond.getDate() + Days);

                // convert as date format bcoz comparision is possible through date format
                var newFrmDate = new Date(fdateNew);
                if (newFrmDate.getTime() < toDateSecond.getTime()) {
                    ToastMessage = R.strings.formatString(R.strings.dateDaysValidation, { Days })
                }
            }
        }
        return ToastMessage;
    } catch (error) {
        //logger(error.message)
        return null;
    }
}