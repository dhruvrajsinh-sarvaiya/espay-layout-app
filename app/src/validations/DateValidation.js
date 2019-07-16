import Moment from 'moment';
import R from '../native_theme/R';

//Common From Date and To Date Validation Method
//Check Validation of Date is Empty or Not,From Date cannot be greater than To Date and You can not view more than 10 days report
export function DateValidation(FDate, TDate, isRequired = false) {
    try {
        var toastMessage = null;

        // check for date is compulsary for input or not
        if (isRequired) {
            if (FDate.length > 0 && TDate.length > 0) {
                var fromDate = new Date(Moment(FDate, 'YYYY-MM-DD').format('LL'));
                var toDate = new Date(Moment(TDate, 'YYYY-MM-DD').format());

                if (toDate.getTime() < fromDate.getTime()) {
                    toastMessage = R.strings.dateGreterValidation;
                } else {
                    var fdate = fromDate.setDate(fromDate.getDate() + 10);

                    // convert as date format bcoz comparision is possible through date format
                    var newFromDate = new Date(fdate);
                    if (newFromDate.getTime() < toDate.getTime()) {
                        toastMessage = R.strings.dateDaysValidation;
                    }
                }
            }
        }
        else if (FDate.length == 0 && TDate.length == 0) {
            toastMessage = R.strings.date_selection;
        } else {
            var frmDate = new Date(Moment(FDate, 'YYYY-MM-DD').format('LL'));
            var tDate = new Date(Moment(TDate, 'YYYY-MM-DD').format());

            if (tDate.getTime() < frmDate.getTime()) {
                toastMessage = R.strings.dateGreterValidation;
            } else {
                var fdateNew = frmDate.setDate(frmDate.getDate() + 10);

                // convert as date format bcoz comparision is possible through date format
                var updatedFromDate = new Date(fdateNew);
                if (updatedFromDate.getTime() < tDate.getTime()) {
                    toastMessage = R.strings.dateDaysValidation;
                }
            }
        }
        return toastMessage;
    } catch (error) {
        //logger(error.message)
        return null;
    }
}