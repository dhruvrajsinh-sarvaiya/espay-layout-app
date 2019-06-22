﻿using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.Enums
{
    public class EnResponseMessage
    {
        // ================================ Communnication ========================= //

        public static string SMSSuccessMessage = "The message has been sent successfully.";
        public static string EMailSuccessMessage = "The Email has been sent successfully.";
        public static string NotificationSuccessMessage = "The Notification has been sent successfully.";
        public static string AfIdRequired = "Please Enter Required Parameter Affiliate Scheme ID.";
        public static string AfTypeIdRequired = "Please Enter Required Parameter Affiliate Scheme Type ID.";
        public static string AfTypeMappingIdRequired = "Please Enter Required Parameter Affiliate Scheme Type Mapping ID.";
        public static string AfProIdRequired = "Please Enter Required Parameter Affiliate Pramotion ID.";
        public static string AfdetailIdRequired = "Please Enter Required Parameter Affiliate detail ID.";
        
        public static string SMSFailMessage = "The message has been Failed.";
        public static string EmailFailMessage = "The Email has been Failed.";
        public static string NotificationFailMessage = "The Notification has been Failed.";

        public static string SMSExceptionMessage = "Sorry! A technical error occurred while processing your request.";
        public static string EmailExceptionMessage = "Sorry! A technical error occurred while processing your request.";
        public static string NotificationExceptionMessage = "Sorry! A technical error occurred while processing your request.";

        public static string TempalteAlreadyMapwithCategory = "This template already mapped with template category. You can't disable template.";
        //=====================Common for all internal use only
        public static string CommSuccessMsgInternal = "Success";
        public static string CommFailMsgInternal = "Fail";
        //=========================Transactional Msg
        //public static string CreateTrnSuccessMsg = "Success";
        //public static string CreateTrnFailMsg = "Fail";
        public static string WithdrawNotAllowdBeforehrForgotPswd = "Withdraw Not Allowed before #Hour# hour of Forgot Password!";
        public static string WithdrawNotAllowdBeforehrResetPswd = "Withdraw Not Allowed before #Hour# hour of Reset Password!";
        public static string WithdrawNotAllowdBeforehrChangeDevice = "Withdraw Not Allowed before #Hour# hour of Change Device!";
        public static string WithdrawNotAllowdBeforeBene = "Withdraw Not Allowed before #Hour# hour of Adding Beneficary!";
        public static string CreateTrnNoPairSelectedMsg = "Invalid Pair Selected";
        public static string CreateTrnInvalidQtyPriceMsg = "Invalid Qty or Price";
        public static string CreateTrnInvalidQtyNAmountMsg = "Invalid Order Qty and Amount";
        public static string CreateTrn_NoCreditAccountFoundMsg = "No Credit Account Found";
        public static string CreateTrn_NoDebitAccountFoundMsg = "No Debit Account Found";
        public static string CreateTrnInvalidAmountMsg = "Invalid Amount";
        public static string CreateTrnInvalidAddressMsg = "Invalid Address.";
        public static string CreateTrnInvalidIntAmountMsg = "Fractional Amount is not allowed.";
        public static string CreateTrnDuplicateTrnMsg = "Duplicate Transaction for Same Address, Please Try After 10 Minutes";
        public static string CreateTrn_NoSelfAddressWithdrawAllowMsg = "You cannot withdraw to own address";//rita 8-1-19 change proper msg
        public static string ProcessTrn_InsufficientBalanceMsg = "Insufficient Wallet Balance";
        public static string ProcessTrn_AmountBetweenMinMaxMsg = "Amount Must be Between: @MIN AND @MAX";
        public static string ProcessTrn_PriceBetweenMinMaxMsg = "Price Must be Between: @MIN AND @MAX";
        public static string ProcessTrn_InvalidBidPriceValueMsg = "Invalid BidPrice Value";
        public static string ProcessTrn_PoolOrderCreateFailMsg = "Order Creation Fail";
        public static string ProcessTrn_InitializeMsg = "Initialize";
        public static string ProcessTrn_ServiceProductNotAvailableMsg = "Provider Not Available";
        public static string ProcessTrn_WalletDebitFailMsg = "Wallet Debit Fail";
        public static string ExportWalletSuccess = "ExportWallet File Created.";
        public static string ExportWalletFail = "ExportWallet File Failed.";

        public static string ProcessTrn_HoldMsg = "Hold";
        public static string ProcessTrn_ThirdPartyDataNotFoundMsg = "Third Party Data Not Found";
        public static string ProcessTrn_ProviderDataNotFoundMsg = "Provider Data Not Found";
        public static string ProcessTrn_OprFailMsg = "Operator Fail";
        public static string TradeRecon_InvalidTransactionNo = "Invalid Transaction No";
        public static string TradeRecon_After7DaysTranDontTakeAction = "After 7 days of transaction you can not take action, Please contact admin";
        public static string TradeRecon_After5MinTranDontTakeAction = "After 5 min of transaction you can not take action of Force Cancellation , Please contact admin";
        public static string TradeRecon_InvalidTransactionStatus = "Invalid Transaction Status";
        public static string TransactionNotInIsProcessing = "Transaction not in Process, Please try After Sometime.";
        public static string TradeRecon_CancelRequestAlreayInProcess = "Transaction Cancellation request is already in processing.";
        public static string TradeRecon_TransactionAlreadyInProcess = "Transaction Already in Process, Please try After Sometime";
        public static string TradeRecon_OrderIsFullyExecuted = "Can not initiate Cancellation Request.Your order is fully executed";
        public static string TradeRecon_InvalidDeliveryAmount = "Invalid Delivery Amount";
        public static string TradeRecon_RequestCancel = "Order request for Cancellation done successfully.";
        public static string TradeRecon_RequestFail = "Order request for Fail mark done successfully.";
        public static string TradeRecon_RequestActive = "Order request for Active mark done successfully.";
        public static string TradeRecon_RequestInActive = "Order request for InActive mark done successfully.";
        public static string TradeRecon_RequestSuccess = "Order request for Success mark done successfully.";
        public static string TradeRecon_RequestReInit = "Order request for Re-Init mark done successfully.";
        public static string TradeRecon_RequestSuccessAndDebit = "Order request for Success and Debit done successfully.";
        public static string TradeRecon_RequestInProcess = "Order request for InProcess mark done successfully.";
        public static string TradeRecon_RequestReleaseStuckOrder = "Order request for Release stuck Order done successfully.";        
        public static string TradeRecon_InvalidActionType = "Invalid ActionType Value";
        public static string TradeRecon_ActionFailed = "Trade Recon Process Failed";        
        public static string TradeRecon_ActionFailedForLocalTrade = "Order request for Re-Init mark order Failed.";
        public static string FavPair_InvalidPairId = "Invalid PairId";
        public static string FavPair_AlreadyAdded = "Pair Already added as favourite";
        public static string FavPair_AddedSuccess = "Pair Added as favourite pair";
        public static string FavPair_RemoveSuccess = "Pair Remove from favourite pair";
        public static string FavPair_NoPairFound = "No Favourites pair found";
        public static string InValidDebitAccountIDMsg = "Invalid Debit Account ID";
        public static string InValidCreditAccountIDMsg = "Invalid Credit Account ID";
        public static string CreateTrn_WithdrawAmountBetweenMinAndMax = "Amount Must be Between: @MIN AND @MAX";
        public static string WithdrawalRecon_NoRecordFound = "No Record Found";
        public static string WithdrawalRecon_InvalidActionType = "Invalid ActionType";
        public static string WithdrawalRecon_ProcessFail = "WithdrawalRecon Process Fail";
        public static string WithdrawalRecon_Success = "WithdrawalRecon Process Success";
        public static string WithdrawalRecon_InvalidTrnType = "Invalid Transaction Type";
        public static string CommRecordInsertSuccess = "Successfully Inserted";
        public static string CommRecordUpdateSuccess = "Successfully Updated";
        public static string TradeRouteAlreadyAvailable = "TradeRoute Already Available";
        public static string AddPairConfiguration_PairAlreadyAvailable = "Pair Already Availabe";
        public static string InValidOrderTypeMsg = "Invalid Order Type";
        //============================
        public static string MasterTransactionLimitValidationFail = "Master Transaction Limit Validation Fail TrnNo:#TrnNo#";//4301
        public static string MasterHourlyLimitValidationFail = "Master Hourly Limit Validation Fail TrnNo:#TrnNo#";//4300
        public static string MasterDailyLimitValidationFail = "Master Daily Limit Validation Fail TrnNo:#TrnNo#";//4299
        public static string MasterLifetimeLimitValidationFail = "Master Lifetime Limit Validation Fail TrnNo:#TrnNo#";//4304
        public static string MasterLimitValidationFail = "Master Limit Validation Fail TrnNo:#TrnNo#";//4302
        public static string MasterTimeValidationFail = "Master Time Validation Fail TrnNo:#TrnNo#";//4303
        public static string TransactionLimitValidationFail = "Transaction Limit Validation Fail TrnNo:#TrnNo#";// 4279
        public static string HourlyLimitValidationFail = "Hourly Limit Validation Fail TrnNo:#TrnNo#";// 4278
        public static string DailyLimitValidationFail = "Daily Limit Validation Fail TrnNo:#TrnNo#";// 4277
        public static string LifetimeLimitValidationFail = "Lifetime Limit Validation Fail TrnNo:#TrnNo#";// 4282
        public static string LimitValidationFail = "Limit Validation Fail TrnNo:#TrnNo#";// 4280
        public static string TimeValidationFail = "Time Validation Fail TrnNo:#TrnNo#";// 4281
        //============================walelt=================================//       

        public static string CreateWalletSuccessMsg = "Wallet is Successfully Created.";
        public static string SetWalletLimitCreateMsg = "Limit Created Successfully";
        public static string SetUserPrefSuccessMsg = "User Preference is Successfully Created.";
        public static string SetWalletLimitUpdateMsg = "Limit Updated Successfully";
        public static string SetUserPrefUpdateMsg = "User Preference Is Updated Successfully";
        public static string CreateWalletFailMsg = "Fail";
        public static string CreateAddressSuccessMsg = "Address is Successfully Created.";
        public static string CreateAddressFailMsg = "Failed to generate Address.";
        public static string InvalidWallet = "Invalid Wallet or wallet is disabled.";
        public static string AddressExist = "Only one address generation allowed per wallet.!!";
        public static string InvalidWalletType = "Invalid WalletType.";
        public static string ItemOrThirdprtyNotFound = "Unable to Process your request please contact admin.";
        public static string FindRecored = "Record Found Successfully!";
        public static string FindFileFromEmail = "Download File from Email!";
        public static string InValidPage = "Invalid Page Or PageSize!";
        public static string NotMatchCoin = "Not Match Coin!";
        public static string InvalidSlabSelectionForUnstak = "Invalid Slab Selection, You Can Only Degrade Your Slab.";
        public static string NotFound = "Record Not Found";
        public static string InvalidStatus = "Invalid Status.";
        public static string InvalidRole = "Invalid Role.";
        public static string NotAddUser = "Can not Add/Remove user";
        public static string NotRequestApproved = "Can not accept/reject request.";
        public static string CntUpdateWalletNTrnType = "Can not update Wallet and TrnType";
        public static string OnlyFullUnstakeAvailable = "Partial Unsatking Is Not Available For Fixed Deposit.";
        public static string UnstakingNotAvailable = "Policy Does Not Allow Full Unstaking Before Maturity.";
        public static string BlackFundAlreadyDestroyed = "Black Fund Already Destroyed For This Address.";
        public static string BlackFundDestroyedSuccess = "Black Fund Destroyed Successfully.";
        public static string TransferTokenSuccess = "Token Transfer Successfully.";
        public static string BlockUserAddressSuccess = "Address Blocked Successfully.";
        public static string UnBlockUserAddressSuccess = "Address Unblocked Successfully.";
        public static string AlreadyBlockedUserAddress = "Address Is Already Blocked.";
        public static string AlreadyUnBlockedUserAddress = "Address Is Already Unblocked.";
        public static string OperationFail = "Fail!";
        public static string TokenSupplyIncreaseSuccess = "Token Supply Increased Successfully.";
        public static string TokenSupplyDecreaseSuccess = "Token Supply Decreased Successfully.";
        public static string SetTransferFeeSuccess = "Transfer Fee Changed Successfully.";
        public static string RecordAdded = "Record Added Successfully!";
        public static string RecordCreated = "Record Created Successfully.";
        public static string RequestAdded = "Your request has been submitted successfully!";
        public static string RecordUpdated = "Record Updated Successfully!";
        public static string RecordDeleted = "Record Deleted Successfully!";
        public static string RecordInactivated = "Record Inactivated Successfully !";
        public static string RecordActivated = "Record Activated Successfully !";
        public static string RecordDisable = "Record Disable Successfully!";
        public static string InvalidLimit = "Invalid Limit.";
        public static string PositiValue = "Must be greater or equal to zero..";
        public static string LessLimit = "Limt must be less than Maxlimit.";
        public static string NotFoundLimit = "Not Found Limit.";
        public static string ApprovedByOwner = "Request must approved by WalletOwner.";
        public static string AlredyApproved = "Request already Approved.";
        public static string InvalidSlabSelection = "You Can Not Degrade The Policy.";
        public static string InvalidSlabType = "Charge Type Can Not Be Configured With Range";
        public static string InvalidAmt = "Invalid Amount.";
        public static string InsufficientBal = "Insufficient Balance.";
        public static string BatchNoFailed = "Batch No Generation Failed.";
        public static string DefaultWallet404 = "Default Wallet Not Found.";
        public static string InvalidReq = "Invalid Request Detail.";
        public static string InvalidTrnType = "Invalid TrnType.";
        public static string NotAllowedTrnType = "TrnType Not Allowed to wallet.";
        public static string InvalidCoin = "Invalid CoinName.";
        public static string InvalidTradeRefNo = "Invalid Trade RefNo.";
        public static string InvalidTradeRefNoCr = "Invalid Trade RefNo for credit.";
        public static string InvalidTradeRefNoDr = "Invalid Trade RefNo for Debit.";
        public static string AlredyExist = "Duplicate Request for same Ref No.";
        public static string InsufficantBal = "Insufficeint Balance";
        public static string SuccessDebit = "Balance Debited Successfully";
        public static string SuccessCredit = "Balance Credited Successfully";
        public static string DuplicateRecord = "Duplicate Record";
        public static string InvalidAddress = "Invalid Addess";
        public static string OrgIDNotFound = "Org record not found";
        public static string InternalError = "Internal Error";
        public static string BalMismatch = "Settled Balance Mismatch";
        public static string ShadowLimitExceed = "Exceed Shadow Limit";
        public static string WalletLimitExceed = "Wallet Limit Validation Fail";
        public static string MasterConfig = "Invalid Parameter";
        public static string TradeLedgerRemarks_Credit = "Credit for TrnNo: @TrnNo";
        public static string TradeLedgerRemarks_Debit = "Debit for TrnNo: @TrnNo";
        public static string Alredy_Exist = "Data Already Exist !!";
        public static string RequestPending = "Request alredy Send..Approval Pending!!";
        public static string AlredyExistWithRole = "Wallet Already with this Role ";
        public static string CommPolicyMsg = "Wallet Transaction Type OR Wallet Type Is Not Matched !!";
        public static string RemainingRecordNotUpdated = "Error In Updation For Remaining Record";
        public static string SP_sp_CrDrWallet_ReturnFail = "sp failed to execute";
        public static string WalletNotMatch = "Wallet Not Match";
        public static string WalletNotFound = "Wallet Not Found";
        public static string MaxIdNotFound = "Max Id Generation Fail";
        public static string InvalidChannel = "Invalid Channel";
        public static string InvalidWalletTransaction = "Invalid Wallet Transaction";
        public static string EmailNotExist = "Email doesn't Exist in System";
        public static string InvalidDuration = "Invalid Time Duration";
        public static string InvalidValue = "Invalid Value";
        public static string RequiredParameterMissing = "Please Enter Required Parameter";
        public static string NotRemoveUser = "Not Remove User!";
        public static string NotShareWallet = "You can't share your wallet with yourself!";
        //public static string UnstakingNotAllowed = "Unstaking Is Not Allowed Before Maturity";
        public static string UnstakingNotAllowed = "Unstaking Is Not Allowed Before Maturity, The Request Will Be Sent To Admin";
        public static string InvalidStakingPolicyDetailID = "Invalid Staking Policy Detail Id";
        public static string UnstakingSuccessfully = "Unstaking Request Has Been Sent To Admin";
        public static string FileNotFound = "Please Upload The File !!";
        public static string InvalidFileDetail = "File Contains Invalid Data !!";
        public static string WalletLimitValidationSuccess = "Wallet Limit Validation Passed Successfully.";
        public static string WalletMasterLimitValidationFail = "Master Limit Per Transaction/Hour/Day Exceeds.";
        public static string AmountLimitValidationFail = "Amount Is Greater Than Per #Limit# Limit Of #tbl# ";
        public static string MaxNoOfRecordLimitExceed = "You can't add more than #Limit# records in a file.";
        public static string InvalidMinValue = "Minimum Value Should Not Greater Than Maximum Value";
        public static string MasterDataNotFound = "Master Data Not Found";
        public static string InvalidTimeDuration = "Month & Week Both Can Not Be Zero.";
        public static string StakingBeforeMaturityRequired = "Enable Staking Before Maturity Required";
        public static string StakingBeforeMaturityChargeRequired = "Enable Staking Before Maturity Charge Required";
        public static string InvalidMinAndMaxValue = "Minimum And Maximum Both Value Can Not Be Same.";
        public static string MarginWalletCanNotBeUsedForThis = "You can not use Margin Wallet for this transaction."; //ntrivedi 15-02-2019
        public static string RuleDataUpdationFail = "Rule Data Updation Fail";
        public static string DataAlreadyExist = "Data Already Exist !";
        public static string TrnAccNoRequired = "Address Should Not Be Null Or Empty.";
        public static string InvalidTrnAccNo = "Invalid Address.";
        public static string ValidTrnAccNo = "Address Validation Pass Successfully.";
        public static string LevrageValueExceeded = "Leverage Value Can Not Exceed to ##Lev##X.";
        public static string OpenPositionNotFound = "Open Position Not Found.";
        public static string InvalidBaseCurrency = "Invalid Base Currency.";
        public static string SafetyWalletNotFound = "Safety Wallet Not Found.";
        public static string PriceCalculationisSuccess = "Price Calculation is Success.";
        public static string MarginCurrencyNull = "Please select Currency.";
        public static string LoanIDNull = "Please select Loan.";
        public static string LoanNotFound = "Loan Not Found.";
        public static string InvalidCoinName = "Invalid Currency";

        //ntrivedi 07-06-2019
        public static string ProviderDataFetchSuccess = "Provider Data Fetch Success.";
        public static string ProviderDataFetchFail = "No Record found.";


        //========================My Account===============================//
        public static string SendMailSubject = "Registration confirmation email";
        public static string ReSendMailSubject = "Registration confirmation resend email";
        public static string ForgotPasswordMail = "Forgot password email";
        public static string ResetPasswordMail = "Reset password conformation email";
        public static string SendMailBody = "Do not Share this code with anyone for security reasons. Your unique verfication code is ";
        public static string SendSMSSubject = "Do not Share this code with anyone for security reasons. Your unique verfication code is ";
        public static string LoginEmailSubject = "Login With Email Otp ";
        public static string StandardSignUpPhonevalid = "Please Enter Valid Mobile Number";
        public static string InvalidLang = "Invalid Language.";
        
        public static string StandardSignUp = "Your account has been created, please verify it by clicking the activation link that has been send to your email.";
        public static string SignUpValidation = "This username or email is already registered.";
        public static string SignUpUser = "This user data not available.";
        public static string SignWithEmail = "The OTP sent Successfully on your email address for registration.";
        public static string SignUpEmailValidation = "This email id already exist input other emai id.";
        public static string SignUPAlreadyConfirm = "This email id already confirm, you can now login.";
        public static string SignUpUserNotRegister = "User not register and verify.";
        public static string SignUpEmailConfirm = "Your account has been activated, you can now login.";
        public static string SignUpEmailExpired = "Reset links immediately not valid or expired.";
        public static string SignEmailLink = "This email code can't be balck.";
        public static string SignEmailUser = "This email link using user not valid.";
        public static string StandardResendSignUp = "Your account has been created, please verify it by clicking the activation link that has been send to your email.";
        public static string StandardLoginSuccess = "User Login Successfull.";
        public static string StandardLoginLockOut = "User account locked out for six hours.";
        public static string StandardLoginfailed = "Login failed : Invalid username or password.";
        public static string UserNotActive = "This user not active.";
        public static string UserNotExist = "This user not exist.";
        public static string LoginWithOtpSuccessSend = "OTP sent successfully on your Email ID.";
        // public static string LoginWithEmailSuccessSend = " User Login with Email Send Success.";
        // public static string LoginWithOtpLoginFailed = "Login failed: Invalid email.";
        public static string LoginWithOtpInvalidAttempt = "Invalid login attempt.";
        public static string LoginWithOtpDatanotSend = "User Otp Data Not Send.";
        public static string SignUPMobileValidation = "An account already exists with that mobile number.try signing in.";
        public static string SignUpWithMobile = "The OTP sent successfully on your mobile number for registration.";
        public static string SignUpWithMobileValid = "This mobile number is not valid.";
        public static string SignUPVerification = "You have successfully verified.";
        public static string SignUpOTP = "Invalid OTP ,resend OTP immediately.";
        public static string SignUpResendOTP = "OTP expired, Please resend OTP immediately";
        public static string SignUpRole = "This User roles not available.";
        public static string SignUpWithResendEmail = "You have successfully resend Otp in email.";
        public static string SignUpWithResendMobile = "You have successfully resend Otp in mobile.";
        public static string OTPSendOnMobile = "OTP sent successfully on your registered mobile number.";
        public static string OTPNotSendOnMobile = "Not send OTP on mobile.";
        public static string LoginUserEmailOTP = "Otp sent successfully to your email Id.";
        public static string LoginEmailOTPNotsend = "User Login with Email OTP not Send Successfully.";
        public static string EmailFail = "Email Address Invalid";
        public static string ResetConfirmed = "Reset confirmed";
        public static string LoginMobileNumberInvalid = "Invalid mobileno.";
        public static string IpAddressInvalid = "Invalid IPAddress.";
        public static string SuccessfullGetUserData = "Successfully get user data.";
        public static string SuccessfullUpdateUserData = "Your profile updated successfully.";
        public static string Unableupdateuserinfo = "Unable to update user info";
        

        public static string SuccessAddIpData = "Successfully add Ip Address.";
        public static string SuccessupdateIpData = "Successfully Update Ip Address data.";
        public static string IpAddressInsertError = "Ip address not inserted.";
        public static string Verificationpending = "User register verification pending.";


        public static string ResetConfirmedLink = "Reset password link send on your email, please click that link and confirmed.";
        public static string ResetResendEmail = "You have successfully resend New password in email.";
        public static string EmialSuccessfullyVerify = "You email  successfully verify.";
        public static string ChangePassword = "Your password has been change successfully.";
        public static string UnableChangePassword = "Unable to change password";
        public static string EmailNewPassword = "Use this New Password to Login. Your New Password is";
        public static string ForgotPassLink = "Please verify it by clicking for regenerated password .";
        public static string ResetUserNotAvailable = "Don't reveal that the user does not exist or is not confirmed.";
        public static string ResetEmailMessage = "Please reset your password by clicking here.";
        public static string ResetPasswordUseNotexist = "Don't reveal that the user does not exist.";
        public static string ResetPasswordEmailExpire = "This email link was expired.";
        public static string ResetPasswordEmailLinkBlank = "Reset password email link should not be empty.";
        public static string ResetConfirm = "You have already confirm reset password link, please check in your mail if was not received mail then perform to forgot opration.";
        public static string ResetConfirmPassMatch = "New password and confirmation password do not match.";
        public static string ResetConfirmOldNotMatch = "Old password does not match";
        public static string InvalidUserSelectedIp = "Invalid User Selected IPAddress";
        public static string IpAddressUpdateError = "Ip address status not update.";
        public static string SuccessDesableIpStatus = "IP address disable Successfully.";
        public static string SuccessDeleteIpAddress = "IP address removed Successfully.";
        public static string IpAddressdeleteError = "Ip address not remove.";
        public static string SuccessGetIpData = "Successfully Get Ip Address.";
        public static string InvalidAppkey = "Invalid appkey or password.";
        public static string Appkey = "This appkey data not available.";
        public static string InvalidUser = "The username/password couple is invalid.";
        public static string RefreshToken = "The refresh token is no longer valid.";
        public static string UserToken = "The user is no longer allowed to sign in.";
        public static string Granttype = "The specified grant type is not supported.";
        public static string EnableTwoFactor = "User two factor authentication successfully activates";
        public static string DisableTroFactor = "User two factor authentication successfully disable";
        public static string DisableTroFactorError = "Unexpected error occured disabling 2FA for user with ID";
        public static string FactorFail = "Invalid authenticator code ";
        public static string FactorRequired = "Two factor authentication is activated please verify your code";
        public static string TwoFactorVerification = "Two factor authentication Verification code is invalid.";
        public static string SuccessAddDeviceData = "Successfully add device id.";
        public static string DeviceidInsertError = "Device id not added.";
        public static string DeviceAddressUpdateError = "Device address status not update.";
        public static string SuccessDeleteDevice = "Successfully remove device address.";
        public static string DeviceAddressdeleteError = "Device address not remove.";
        public static string SuccessGetDeviceData = "Successfully Get Device Address.";
        public static string TwoFaVerification = "TwoFA Acviate Redirect Verify method";
        public static string Userpasswordnotupdated = "User password not updated!";
        public static string TwoFactorVerificationDisable = "That verification code was invalid.Please try again.";
        public static string InvalidGoogleToken = "Invalid Google access token.";
        public static string InvalidGoogleProviderKey = "Invalid Google provider key.";
        public static string SocialUserInsertError = "Social register not inserted.";
        public static string UnLockUser = "Successfull unlock user.";
        public static string UnLockUserError = "User not unlock.";

        public static string IpAlreadyExist = "Ip Address already exist.";
        public static string DeviceIdAlreadyExist = "DeviceId already exist.";

        public static string SuccessEnableIpStatus = "IP Address enabled successfully.";
        public static string SuccessEnableDeviceId = "Your requested whitelisted device enabled successfully.";
        public static string SuccessDisableDeviceId = "Your requested whitelisted device disabled successfully.";

        public static string InvalidFaceBookToken = "Invalid FaceBook access token.";
        public static string InvalidFaceBookProviderKey = "Invalid FaceBook provider key.";

        public static string SignUpBizUserEmailExist = "An account already exists with that email address.Try signing in.";
        public static string SignUpBizUserNameExist = "This User name already registered.";

        public static string SignUpTempUserEmailExist = "This email id already exist input other emai id.";
        public static string SignUpTempUserNameExist = "This User name already exist input other user name.";

        public static string SignUpTempUserEmailVerifyPending = "This email id already exist and  verify pending.";
        public static string SignUpTempUserNameVerifyPending = "This User name already exist and verify pending.";
        public static string SignUpUserRegisterError = "User not register.";

        public static string SocialLoginKey = "Successfully get social provider detail";

        public static string provideDetailNotAvailable = "Provider detail not available.";

        public static string InputProvider = "Please input provider name.";


        public static string SignUpTempUserMobileExist = "An account already exists with that mobile number.try signing in.";
        public static string SignUpTempUserMobileExistAndVerificationPending = "This mobile number already exist and verify pending.";

        public static string TokenCreationUserDataNotAvailable = "User data not avaialable.";
        public static string LoginWithEmailSuccessSend = "Otp Sent successfully to your registered Email ID.";

        public static string LoginFailEmailNotAvailable = "User does not exists with this email address.!";
        public static string LoginWithMobileOtpLoginFailed = "User does not exists with this mobile number.!";

        public static string TwoFactorActiveRequest = "User two factor authentication reguest successfully send.";
        public static string TwoFAalreadyDisable = "Two factor authentication already disable.";
        public static string FactorKeyFail = "Invalid two factor key.";
        public static string SuccessGetIpHistory = "Successfully Get Ip History.";
        public static string SuccessGetLoginHistory = "Successfully Get Login History.";
        public static string SuccessGetsignUpLogHistory = "Successfully Get Signup History.";

        public static string ProfilePlan = "Profile plan not available.";
        public static string SuccessGetProfilePlan = "Successfully get raise profile plan.";
        public static string SuccessAddProfile = "Successfully add profile plan.";
        public static string SuccessUpdateProfile = "Successfully updated profile plan.";
        public static string NotAddedProfile = "This profile plan already exists or selected plan not allow lower level.";
        public static string InvalidProfileId = "Invalid profileId.";
        public static string UserWiseGetProfile = "Successfully get user wise active profile plan.";
        public static string UserWiseGetProfileNotavailable = "User wise profile plan not available.";
        public static string GetUserWiseProfileData = "Successfully get user wise disabled current and down-level profile plan.";
        public static string GetUserWiseProfileHistory = "Successfully get user wise profile history.";
        public static string UserWiseProfileHistoryNotavailable = "User wise profile history not available.";
        public static string Typemasterrequired = "Please Enter complaint type";
        public static string TypemasterInsertError = "raise complaint not added.";
        public static string complaintTypeNotavailable = "Complaint type not available";
        public static string SuccessAddComplain = "Successfully add raise complaint.";
        public static string AddCompainrequired = "Please provice compaint raise detail.";
        public static string AddCompainTrail = "Please provice complain trail detail.";
        public static string CompainTrailInsertError = "Complain reply not added.";
        public static string SuccessCompainTrail = "Successfully add complain reply.";
        public static string SuccessGetCompainDetail = "Successfully get complain data.";

        public static string Complaintdatanotavailable = "Complain not available.";

        public static string ImageNotAvailable = "Image not available.";//spelling mistake ntrivedi 20-05-2019
        public static string FrontImageSizeLarger = "Front image size larger.";//spelling mistake ntrivedi 20-05-2019
        public static string BackImageSizeLarger = "Back image size larger.";//spelling mistake ntrivedi 20-05-2019
        public static string SelfieImageSizeLarger = "Selfie image size larger.";//spelling mistake ntrivedi 20-05-2019
        public static string Surname = "Please enter surname.";
        public static string GivenName = "Please enter given name.";
        public static string ValidIdentityCard = "Please enter valid identity card.";
        public static string PersonalIdentityInsertSuccessfull = "Personal details for KYC verification submitted successfully.";
        public static string PersonalIdentityNotInserted = "Personal identity KYC request successfully not inserted.";
        public static string GetPersonalIdentity = "Successfully get user personal identity data.";
        public static string PersonalIdentityNotavailable = "Personal identity not available.";
        public static string GetUserKYCStatus = "Successfully get user KYC status.";

        public static string DeviceIdNotFound = "DeviceID Not Found.";
        public static string ModeNotFound = "Mode Not Found.";
        public static string HostNameNotFound = "HostName Not Found.";
        public static string RequiredCountryCode = "Please Provide country code";

        public static string SuccessGetComplainStatus = "Successfully get complain status list.";
        public static string SuccessAuthorizedNew = "New device is authorized successfully";
        public static string AuthorizedNewExpired = "Invalid authorization link, please login again and authorize new device by mail.";
        public static string AuthorizedLinkBlanck = "This authorized code can't be balck.";
        public static string AuthorizedUser = "This authorized link using user not valid.";
        public static string InvalidIPNDevice = "Invalid ipaddress or DeviceId.";
        public static string AuthorizedAddSuccessfully = "New device is authorized successfully.";
        public static string UnAuthorizedDevice = "It appears that you may be signing into ###SiteName### from a device we are unfamiliar with or one that you have not used for a long period of time. For your security, a confirmation email has been sent to your email address.";
        public static string TwoFAVerify = "Twofa code verify successfully.";
        public static string TwoFactorRequired = "Please Two factor authentication is activate after this verify your code.";
        public static string AllreadyLinkVerify = "Your email link already verified ";
        public static string DeviceIdNotDisableByAdmin = "Device is not disable by admin.";
        public static string DeviceIdNotEnableByAdmin = "Device is not enable by admin.";
        public static string DeviceIdNotDeleteByAdmin = "Device is not delete by admin.";

        // ================================ SignalR ========================= //

        //for Wallet

        public static string CreditWalletMsgNotification = "Your #Coin# wallet is Credited for #TrnType# Transaction TrnNo:#TrnNo#"; //signalr,6000
        public static string DebitWalletMsgNotification = "Your #Coin# wallet is Debited for #TrnType# Transaction TrnNo:#TrnNo#"; //signalr,6001
        public static string GenerateAddressNotification = "New Address Created Successfully For Wallet:#WalletName#"; //signalr,6002
        public static string CWalletLimitNotification = "New Limit Created Successfully For Wallet:#WalletName#"; //signalr,6003
        public static string UWalletLimitNotification = "New Limit Updated Successfully For Wallet:#WalletName#"; //signalr,6004
        public static string AddBeneNotification = "New Beneficiary Added Successfully For Wallet Type:#WalletName#"; //signalr,6005
        public static string UpBeneNotification = "Beneficiary Details Updated Successfully For Wallet Type:#WalletName#"; //signalr,6006
        public static string UserPreferencesNotification = "Your Whitelisting Is Switched #ONOFF# Successfully"; //signalr,6007
        public static string DefaultCreateWalletSuccessMsg = "Default Wallets are Successfully Created.";//signalr,6008
        public static string NewCreateWalletSuccessMsg = "Wallet: #WalletName# Successfully Created.";//signalR,6009
        public static string ConvertFund = "Convert #SourcePrice# to #DestinationPrice# Submit Successfully!!";//signalr,6013
        public static string HoldBalanceNotification = "Your #Coin# wallet balance Amount : #Amount# goes hold for TrnNo : #TrnNo#";//6035
        public static string HoldBalanceReleaseNotification = "Your #Param1# wallet balance Amount : #Param2# release for TrnNo : #Param3#";//6042
        public static string UpdateBeneNotification = "Withdrawal Addresses #Param1# Successfully"; //signalr,6043

        public static string LimitPerDayMinExceed = "Limit Per Day Can not Less than @Limit";
        public static string LimitPerDayMaxExceed = "Limit Per Day Can not More than @Limit";
        public static string LimitPerHourMinExceed = "Limit Per Hour Can not Less than @Limit";
        public static string LimitPerHourMaxExceed = "Limit Per Hour Can not More than @Limit";
        public static string LimitPerTransactionMinExceed = "Limit Per Transaction Can not Less than @Limit";
        public static string LimitPerTransactionMaxExceed = "Limit Per Transaction Can not More than @Limit";

        //Transcation

        public static string SignalRTrnSuccessfullyCreated = "Your Transacton Successfully created Price=#Price# ,Qty=#Qty#.";//6010
        public static string SignalRTrnSuccessfullySettled = "Your Transacton settled. Price=#Price# ,Qty=#Qty# ,Total=#Total#";//6011
        public static string SignalRTrnSuccessPartialSettled = "Your Transacton Partially settled. Price=#Price# ,Qty=#Qty# ,Total=#Total#";//6012
        public static string SignalRCancelOredr = "Your Order TrnNo.#TrnNo# Cancelled Successfully.";//6014
        public static string TransactionValidationFail = "Transaction Validation Fail TrnNo:#TrnNo#";//6015
        public static string TransactionFailed = "Transaction Failed TrnNo:#TrnNo#";//6016
        public static string TransactionSuccess = "Transaction Success TrnNo:#TrnNo#";//6017
        public static string SignalRWithdrawTrnSuccessfullyCreated = "Your withdraw Transaction:#Trnno# amount : #Quatity#  #Coin# from wallet : #WalletID#  is created";//6018



        public static string PushNotificationSubscriptionSuccess = "Notification Subscribed Successfully.";
        public static string PushNotificationunsubscriptionSuccess = "Notification Unsubscribed Successfully.";
        public static string PushNotificationSubscriptionFail = "Notification Subscription Failed.";
        public static string PushNotificationUnsubscriptionFail = "Notification Unsubscription Failed.";

        public static string InvalidInput = "Invalid input";
        public static string MoreDays = "You can not view more than #X# days report";
        public static string InvalidDays = "No. Of Days Should Be Greater Than Zero";
        public static string InValidTopLossGainerFilterType = "InValid Top Loss/Gainer Filter Type";


        // My Account
        public static string UpDateUserProfileSuccess = "Successfully update user profile.";//6036
        public static string UserLoginNotification = "#User# successfull login.";//6037
        public static string ResendOTPNotification = "#UserName# on resend OTP successfully.";//6038
        public static string SendOTPNotification = "#UserName# on send OTP successfully.";//6039 
        public static string TwoFAActiveNotification = "#UserName# two factor authentication active.";//6040 
        public static string TwoFADeactiveNotification = "#UserName# two factor authentication deactive.";//6041 

        // Chat service///


        public static string BlockUserSuccess = "User Blocked Successfully.";//5007
        public static string UnblockUserSuccess = "User Unblocked Successfully.";//5008
        public static string BlockUserFail = "User Blocked Failed.";//5009
        public static string UnblockUserFail = "User Unblocked Failed.";//5010

        // Back Office Organization Admin Panel
        public static string DomainAlreadyExist = "This Domain already exist.";
        public static string SuccessAddDomainData = "Successfully add Domain.";
        public static string DomainInsertError = "Domain not inserted.";
        public static string DomainNotAvailable = "Domain detail not available.";
        public static string SuccessGetDomainData = "Successfully Get Domain data.";
        public static string SuccessGetActiveDomainData = "Successfully get active domain data.";
        public static string ActiveDomainNotAvailable = "Active domain detail not available.";
        public static string SuccessGetDisActiveDomainData = "Successfully Get Disactive Domain data.";
        public static string DisActiveDomainNotAvailable = "DisActive Domain detail not available.";
        public static string SuccessEnableDomain = "Successfully active Domain.";
        public static string SuccessDisableDomain = "Successfully inactive Domain.";
        public static string DomainUpdateError = "Domain data status not update.";
        public static string SuccessGetAllCount = "Successfully Get All Domain Count.";
        public static string DomainCountNotAvailable = "Total Domain count not available.";
        public static string OrganizationUpdateError = "Organization data not update.";
        public static string OrganizationUserData = "Successfully update organization data.";
        public static string SuccessGetBackOffComData = "Successfully Get Back Office Complain data.";
        public static string BackOffComDataNotAvailable = "Back Office Complain data not available.";
        public static string SuccessGetBackoffCom = "Successfully get Back Office complaint data.";
        public static string BackOffComIdDataNotAvailable = "Back Office Complain wise data not available.";
        public static string SuccessBackOffComTrail = "Successfully added ComplainTrail data.";
        public static string SuccessBackOffComTrailError = "Complain Trail  data not added.";
        public static string SuccessGetAllComCount = "Successfully get all  Complain count.";
        public static string ComplainCountNotAvailable = "Total complain count not available.";
        public static string BackOffComIdNotAvailable = "Back Office Complain id not available.";
        public static string BackOffGetAllUserData = "Successfully get all user data.";
        public static string SuccessGetBackOffActivityData = "Successfully Get Activity log data.";
        public static string ActivityDataNotAvailable = "Activity log data not available.";
        public static string GetLoginStepProcess = "Successfully get user wise login step process.";
        public static string AlreadyEmailVef = "Already Email Verified.";
        public static string SendEmailVerfication = "Please verify it by clicking the activation link that has been send to your email.";
        public static string SuccessEmailConfirm = "Successfully verified your email id.";
        public static string AlreadyMobileVef = "Already Mobile Verified.";
        public static string SuccessMobileConfirm = "Successfully verified your mobile no.";
        public static string BackofficeEmailoPhone = "Please enter email id either or phone number.";
        public static string BackOfficeInvalidEmail = "Please enter a valid Email Address.";
        public static string BackOffGetAllModuleData = "Successfully get all module data.";
        public static string ApplicationAlreadyExist = "This Application already exist.";
        public static string SuccessAddApplicationData = "Successfully add Application.";
        public static string ApplicationInsertError = "Application not inserted.";
        public static string ApplicationUpdateError = "Application data status not update.";
        public static string SuccessEnableApplication = "Successfully active Application.";
        public static string SuccessDisableApplication = "Successfully inactive Application.";
        public static string SuccessGetAllCountApp = "Successfully Get All Application Count.";
        public static string AppCountNotAvailable = "Total Application count not available.";
        public static string SuccessGetAppData = "Successfully get application data.";
        public static string AppNotAvailable = "Application detail not available.";
        public static string SuccessGetActiveAppData = "Successfully get active application data.";
        public static string ActiveAppNotAvailable = "Active Application detail not available.";
        public static string SuccessGetDisActiveAppData = "Successfully get disactive application data.";
        public static string DisActiveAppNotAvailable = "DisActive Application detail not available.";
        public static string BackOffGetAllApplicationData = "Successfully get all application data.";
        public static string BackOffGetUserWiseDomainData = "Successfully get user wise domain data.";
        public static string BackOffInvalidDomainorApp = "Invalid domain or Invalid application.";
        public static string SuccessAddUserApplicationData = "Successfully create user wise add application.";
        public static string UserWiseApplicationInsertError = "User wise application not inserted.";
        public static string BackOffReqDomainId = "Please Enter DomainId.";
        public static string BackOffReqAppId = "Please Enter Master ApplicationId.";
        public static string BackOffReqValidDomainId = "Please enter valid DomainId.";
        public static string BackOffReqValidAppId = "Please enter valid Master ApplicationId.";
        public static string BackOffAppIdNotAvailable = "Back Office user application id not available.";
        public static string BackOffAppIdDataNotAvailable = "Back Office Application wise data not available.";
        public static string BackOffAppUpdateError = "Back Office application data not update.";
        public static string SuccessUpdateUserApplicationData = "Successfully updated user wise application.";
        public static string UserWiseAppNotAvailable = "User wise application detail not available.";
        public static string UserWiseApplicationAlreadyExist = "This user wise application already exist.";
        public static string UserWiseSuccessGetAppData = "Successfully get user wise application data.";
        public static string GetUserWiseApplicationData = "Successfully get user wise application data.";
        public static string DayModeAlreadyActivated = "You have already day mode activated.";
        public static string NightModeAlreadyActivated = "You have already night mode activated.";
        public static string SuccessfullUpdateUserTheme = "Your user theme mode updated successfully.";
        public static string SuccessfullUpdateUserLang = "Your prefered language updated successfully.";
        ///User Backoffice
        public static string SuccessAddEmail = "Successfully add email address.";
        public static string AddEmailFail = "Emial address not inserted successfully.";
        public static string EmailAllreadyExist = "Emial address already exist.";
        public static string SuccessupdateEmail = "Successfully updated email address.";
        public static string updateEmailFail = "Email address not updated successfully.";
        public static string PhoneAllreadyExist = "Phone number already exist .";
        public static string SuccessAddmobile = "Successfully add mobile Number.";
        public static string AddMobileNumberFail = "Mobile Number not inserted successfully.";
        public static string SuccessupdatePhoneNumber = "Successfully updated phone number.";
        public static string updatePhonenumberFail = "Phone number not updated successfully.";
        public static string SuccessDeleteEmail = "Successfully delete email address.";
        public static string DeleteEmailFail = "Emial address not deleted successfully.";
        public static string SecurityQuestion = "Successfully add SecurityQuestion.";
        public static string AddSecurityQuestionFail = "SecurityQuestion not inserted successfully.";
        public static string Getemailaddresslist = "Successfully Get EmailAddress.";
        public static string GetMobileNumberlist = "Successfully Get MobileNumber .";
        public static string SuccessAddKYCConfiguration = "Successfully add KYC Configuration address.";
        public static string KYCConfigurationExist = "This KYC Configuration already registered.";
        public static string SuccessUpdateKYCConfiguration = "Successfully Update KYC Configuration .";
        public static string SuccessAddUserConfigurationMapping = "Successfully add User KYCConfiguration mapping .";
        public static string updateKYCConfigurationFail = "KYC configuration not updated successfully.";
        public static string ADDKYCConfigurationMappingFail = "User KYC configuration not adddated successfully.";
        public static string ADDKYCConfigurationUserMappingExist = "User KYC mapping allready exist.";
        public static string SuccessUpdateKYCConfigurationmapping = "Successfully Update KYC Configurationmapping .";
        public static string UpdateUserKYCConfigurationMappingFail = "User mapping KYC configuration not update successfully.";
        public static string GetSuccessFullyKYCConfigurationlist = "Successfully Get KYCConfiguration list.";
        public static string SuccessAddKYCLevel = "Successfully add KYC level.";
        public static string SuccessUpdateKYCLevel = "Successfully update KYC level.";
        public static string AddKYCLevelNotAdded = "This document level not inserted.";
        public static string IsKYCNameExist = "This document level allready Exist.";
        public static string KYCLevelNotUpdated = "This document level not updated.";
        public static string DocumentMasterExist = "This document master already registered.";
        public static string DocumentAddSuccessfully = "Successfully add User Document .";
        public static string DocumentMasterNotAdded = "This document not registered.";
        public static string DocumentupdateSuccessfully = "Successfully update User Document .";
        public static string DocumentListSuccessfullyGet = "Success Get  Document List .";
        public static string GetSuccessFullyIdentitylist = "Successfully Get KYCIdentity list.";
        public static string KYCRemark = "Please provide  remark.";
        public static string KYCRecordNotFound = "KYC record not found.";
        public static string GetSuccessFullySignupList = "Successfully Get Signup user list.";
        public static string GetSuccessFullyCustomerReport = "Successfully Get Customer signup list.";

        public static string DocumentMasterNotupdate = "This document not updated.";
        public static string GetSuccessfullykycLevel = "Successfully get KYC level.";
        public static string GetSuccessFullyKYCConfigurationUserwiselist = "Successfully get KYC use wise configuration list.";
        public static string SuccessFullyGetKYCFilterationList = "Successfully get KYC filter data.";
        public static string SuccessFullyGetKYCLevelList = "Successfully get KYC level.";
        public static string AllreadyKYCApproval = "Already KYC Approve";
        public static string AllreadyKYCSubmited = "Already KYC Submited";
        public static string SuccessFullyupdateKYC = "Successfully update KYC detail.";
        public static string FrontImageformatNotvalid = "Front image format not valid";
        public static string BackImageformatNotvalid = "Back image format not valid";
        public static string SelfieImageformatNotvalid = "Selfie image format not valid";
        public static string FileFormatNotDound = "File format not found";
        public static string IdentiryNotDound = "KYC identity not found";

        public static string StartIP = "Invalid Start IPAddress.";
        public static string EndIP = "Invalid End IPAddress.";
        public static string InValidIPrange = "Invalid IPAddress range.";
        public static string IPRangeNotInsert = "IPRange not inserted successfully.";
        public static string AddIPrange = "Successfully add IPRange.";
        public static string AlreadyIprangeExist = "Already IP range exist.";
        public static string IPRangeDelete = "Successfully Deleted IPRange.";
        public static string IPRangeNotDelete = "IPRange not deleted successfully.";
        public static string IPNotValid = "Access denied from this IP address ";
        public static string IPRangeGet  = "Successfully get IPRange.";


        public static string ComplaintPriorityExist = "Already complaint priority configuration exist.";
        public static string ComplaintpriorityNotInsert = "Complaint priority configuration not inserted successfully.";
        public static string AddComplaintpriority = "Priority added successfully.";
        public static string SuccessupdateComplaintPriority = "Priority has been updated successfully.";
        public static string updateComplaintPriority = "Complaint priority configuration not updated successfully.";
        public static string SuccesseDeleteComplaintPriority = "Priority has been deleted successfully.";
        public static string DeleteComplaintPriority = "Complaint priority configuration not deleted successfully.";
        public static string ComplaintPriorityGet = "Successfully get complaint priority configuration.";
        public static string PasswordExpiration = "Your Password Has Expired and Must Be Changed";
        public static string PasswordforgotInday  = "You have already maximum try to perform forgot password process please try to next day";
        public static string PasswordforgotInMonth = "You have already maximum try to perform forgot password process please try to next month";

        /// Added by pankaj for passwordpolicy message
        public static string PasswordPolicyExist = "Already password policy configuration exist.";
        public static string PasswordPolicyNotInsert = "Password policy configuration not inserted successfully.";
        public static string AddPasswordPolicy = "Successfully add password policy configuration.";
        public static string SuccessupdatePasswordPolicy = "Successfully updated password policy configuration.";
        public static string updatePasswordPolicy = "Password policy configuration not updated successfully.";
        public static string SuccesseDeletePasswordPolicy = "Successfully delete password policy configuration.";
        public static string DeletePasswordPolicy = "Password policy configuration not deleted successfully.";
        public static string PasswordPolicyGet = "Successfully get password policy configuration.";

        #region Referral Message
        public static string SuccessfullReferralPayType = "successfully create referral pay type.";
        public static string InvalidReferralPayType = "Invalid referral pay type.";

        public static string GetReferralPayType = "Get successfully referral pay type.";
        public static string GetFailReferralPayType = "Fail to get referral pay type.";

        public static string ReferralPayTypeList = "Get successfully list of referral pay type.";
        public static string FailReferralPayTypeList = "Fail to get list of referral pay type.";

        public static string ReferralPayTypeDropDown = "Get successfully drop down of referral pay type.";
        public static string FailReferralPayTypeDropDown = "Fail to get drop down of referral pay type.";

        public static string SuccessfullUpdateReferralPayType = "successfully update referral pay type.";

        public static string InvalidUpdateReferralPayType = "Invalid referral pay type.";
        public static string ExistReferralPayType = "There is already exist referral pay type name.";

        public static string NotExistReferralPayType = "There is not exist referral pay type name.";
        public static string EnableReferralPayTypeStatus = "Successfully enable pay type status.";

        public static string DisableReferralPayTypeStatus = "Successfully disable pay type status.";
        public static string FailReferralPayTypeStatus = "Fail to update referral pay type status.";

        public static string SuccessfullReferralChannelType = "successfully create referral channel type.";
        public static string InvalidReferralChannelType = "Invalid referral channel type.";

        public static string GetReferralChannelType = "Get successfully referral channel type.";
        public static string GetFailReferralChannelType = "Fail to get referral channel type.";

        public static string ReferralChannelTypeList = "Get successfully list of referral channel type.";
        public static string FailReferralChannelTypeList = "Fail to get list of referral channel type.";

        public static string ReferralChannelTypeDropDown = "Get successfully drop down of referral channel type.";
        public static string FailReferralChannelTypeDropDown = "Fail to get drop down of referral channel type.";

        public static string SuccessfullUpdateReferralChannelType = "successfully update referral channel type.";

        public static string InvalidUpdateReferralChannelType = "Invalid referral channel type.";
        public static string ExistReferralChannelType = "There is already exist referral channel type name.";

        public static string NotExistReferralChannelType = "There is not exist referral channel type name.";
        public static string EnableReferralChannelTypeStatus = "Successfully enable channel type status.";

        public static string DisableReferralChannelTypeStatus = "Successfully disable channel type status.";
        public static string FailReferralChannelTypeStatus = "Fail to update referral channel type status.";

        public static string SuccessfullReferralServiceType = "Successfully create referral service type.";
        public static string InvalidReferralServiceType = "Invalid referral service type.";

        public static string GetReferralServiceType = "Get successfully referral service type.";
        public static string GetFailReferralServiceType = "Fail to get referral service type.";

        public static string ReferralSeriesTypeList = "Get successfully list of referral service type.";
        public static string FailReferralSeriesTypeList = "Fail to get list of referral service type.";

        public static string ReferralSeriesTypeDropDown = "Get successfully drop down of referral services type.";
        public static string FailReferralSeriesTypeDropDown = "Fail to get drop down of referral services type.";

        public static string SuccessfullUpdateReferralServiceType = "successfully update referral service type.";

        public static string InvalidUpdateReferralServiceType = "Invalid referral service type.";
        public static string ExistReferralServiceType = "There is already exist referral service type name.";

        public static string NotExistReferralServiceType = "There is not exist referral service type name.";
        public static string EnableReferralServiceTypeStatus = "Successfully enable service type status.";

        public static string DisableReferralServiceTypeStatus = "Successfully disable service type status.";
        public static string FailReferralServiceTypeStatus = "Fail to update referral service type status.";

        public static string ReferralUserCountStatus = "Get successfully referral user count.";
        public static string ReferralAdminCountStatus = "Get successfully referral admin count.";

        public static string ReferralCodeStatus = "Get successfully referral code.";
        public static string FailReferralCodeStatus = "There is not available referral code.";

        public static string SuccessfullAddReferralService = "Successfully create referral service.";
        public static string InvalidReferralService = "Invalid referral service.";

        public static string SuccessfullUpdateReferralService = "Successfully update referral service.";
        public static string InvalidUpdateReferralService = "Invalid referral service update data.";

        public static string EnableReferralService = "Enable referral service.";
        public static string DisableReferralService = "Disable referral service.";

        public static string FailEnableReferralServiceStatus = "Fail to enable referral service status.";
        public static string FailDisableReferralServiceStatus = "Fail to disable referral service status.";

        public static string GetReferralServiceById = "Get successfully referral service by Id.";
        public static string GetFailReferralServiceById = "Fail to get referral service by Id.";

        public static string ReferralServiceList = "Get successfully list of referral service.";
        public static string FailReferralServiceList = "Fail to get list of referral service.";

        public static string SuccessfullAddReferralChannel = "Successfully create referral channel.";
        public static string InvalidReferralChannel = "Invalid referral channel data.";

        public static string ReferralChannelList = "Get successfully list of referral channel.";
        public static string FailReferralChannelList = "Fail to get list of referral channel.";

        public static string GetReferralChannelCountForAdmin = "Get successfully referral count.";
        public static string FailReferralChannelCountForAdmin = "Fail to get referral count.";


        public static string ReferralChannelListByChannelTypeId = "Get successfully list of referral channel by channel type.";
        public static string FailReferralChannelListByChannelTypeId = "Fail to get list of referral channel by channel type.";

        public static string GetReferralChannelCountForUserInvite = "Get successfully referral count for user invite.";
        public static string FailReferralChannelCountForUserInvite = "Fail to get referral count for user invite.";


        public static string ReferralChannelListByUserChannelTypeId = "Get successfully list of referral channel by user channel type.";
        public static string FailReferralChannelListByUserChannelTypeId = "Fail to get list of referral channel by user channel type.";

        public static string GetReferralChannelCountForUser = "Get successfully referral count for user.";
        public static string FailReferralChannelCountForUser = "Fail to get referral count for user.";

        public static string ExpireDateMustBeGraterThanActiveDate = "Expire date must be grater than active date.";

        public static string ReferralUserListForAdmin = "Get successfully list of referral user for admin.";
        public static string FailReferralUserListForAdmin = "Fail to get list of referral user for admin.";

        public static string ReferralUserListForUser = "Get successfully list of referral user for user.";
        public static string FailReferralUserListForUser = "Fail to get list of referral user for front.";

        public static string ReferralServicesDropDown = "Get successfully dropdown of referral service.";
        public static string FailReferralServiecsDropDown = "Fail to get dropdown of referral service.";

        public static string ReferralServiceNotExist = "There is not available referral service.";

        public static string ReferralChannelTypeNotExist = "There is not available referral channel type.";
        public static string ReferralSendEmailBlankRequest = "Email Request Can't be blank.";
        public static string ReferralSendSMSBlankRequest = "SMS Request Can't be blank.";
        public static string ReferralEmailSendSuccess = "Email Send Successfully.";
        public static string ReferralEmailHourlyLimitExceed = "Your houly email sending limit exceed.";
        public static string ReferralEmailDailyLimitExceed = "Your daily email sending limit exceed.";
        public static string ReferralEmailWeeklyLimitExceed = "Your weekly email sending limit exceed.";
        public static string ReferralEmailMonthlyLimitExceed = "Your monthly email sending limit exceed.";
        public static string ReferralSMSSendSuccess = "SMS Send Successfully.";
        public static string ReferralSMSHourlyLimitExceed = "Your houly SMS sending limit exceed.";
        public static string ReferralSMSDailyLimitExceed = "Your daily SMS sending limit exceed.";
        public static string ReferralSMSWeeklyLimitExceed = "Your weekly sms sending limit exceed.";
        public static string ReferralSMSMonthlyLimitExceed = "Your monthly sms sending limit exceed.";

        public static string ReferralHourlyLimitRequired = "Fill the hourly limit in the channel type.";
        public static string ReferralDailyLimitRequired = "Fill the daily limit in the channel type.";
        public static string ReferralWeeklyLimitRequired = "Fill the weekly limit in the channel type.";
        public static string ReferralMonthlyLimitRequired = "Fill the monthly limit in the channel type.";
        public static string ReferralURL = "Successfully get referral url.";
        public static string FailReferralURL = "Fail to get referral url.";

        public static string ReferralUserClickListForAdmin = "Get successfully list of referral user click for admin.";
        public static string FailReferralUserClickListForAdmin = "Fail to get list of referral user click for admin.";

        public static string ReferralUserClickListForUser = "Get successfully list of referral user click.";
        public static string FailReferralUserClickListForUser = "Fail to get list of referral user click.";

        public static string GetReferralService = "Get successfully referral service.";
        public static string GetFailReferralService = "Fail to get referral service.";

        public static string ReferralRewardsListForAdmin = "Get successfully list of referral user rewards admin.";
        public static string FailReferralRewardsListForAdmin = "Fail to get list of referral user rewards admin.";

        public static string ReferralRewardsListForUser = "Get successfully list of referral rewards.";
        public static string FailReferralRewardsListForUser = "Fail to get list of referral rewards.";
        public static string SuccessfullAddReferralRewards = "Successfully create referral rewards.";
        public static string InvalidReferralRewards = "Invalid referral rewards data.";
        public static string InvalidReferralUserClickData = "There is not insert data on click.";

        public static string ReferralFromDateGreterThanToday = "From date should not be grater than today date.";
        public static string ReferralToDateGreterThanToday = "To date should not be grater than today date.";
        public static string ReferralCompareFromDateTodate = "From date should be less than To date.";
        public static string ReferralBothDateFromDateTodateRequired = "Please fill  both date from date and to date.";
        public static string ReferralNoDataFound = "Record Not Found !";
       
        
        #endregion

        // khushali 14-02-2019 Role Management Error Message 

        public static string RuleManagementNoDataFound = "No Record Found";
        public static string PermissionGroupNotActive = "The Permission Group is not Active.";
        public static string NoPermissionGroupByLinkedRole = "Please link role to permission group.";
        public static string UserRoleNoDataFound = "Please assign role to user.";
        public static string RuleManagementDataFound = "Record Found Successfully!";
        public static string BackofficeModuleDataInternalError = "Internal Error!";
        public static string BackofficeSubModuleDataInternalError = "Internal Error!";
        public static string BackofficeFieldDataInternalError = "Internal Error!";
        public static string BackofficeToolDataInternalError = "Internal Error!";
        public static string RuleManagementRecordAlredyExist = "Record Already Exist!";
        public static string DuplicateGroupRole = "This Role Is Already Exist With Another Group";
        public static string ModuleNameAlreadyExist = "Module Name already exist";
        public static string SubModuleNameAlreadyExist = "SubModule Name already exist";
        public static string FieldNameAlreadyExist = "Field Name already exist";
        public static string ToolNameAlreadyExist = "Tool Name already exist";
        public static string InvalidAccessRightOrRoleID = "Invalid Role Id";
        public static string PermissionGroupIsDisable = "The Permission Group Is Not Active You Can Not Update This";
        public static string PermissionGroupIsAssignToGroup = "Permission Group Is Assigned To Role You Can Not Delete It";
        public static string RoleIdRequired = "Please Enter Required Parameter";
        public static string InvalidUserId = "User Id Can Not Be Zero";
        public static string PermissionGrpIdRequired = "Please Enter Required Parameter";
        public static string RoleIsDisabled = "You Can Not Update Disabled Records!";
        public static string InvalidRoleId = "Invalid Role Id";
        public static string UserOrRoleNotFound = "User/Role Not Found !";
        public static string RoleIsDisable = "The Role Is Not Active You Can Not Assign This Role To Any User!";
        public static string UserIsDisable = "The User Is Not Active You Can Not Assign Any Role To This User!";
        public static string CanNotUpdateDisableUser = "User Is Not Active You Can Not Update Its Detail";
        public static string UserWithRoleAlreadyExist = "This User Data Is Already Exist With This Role";
        public static string RoleNameAlreadyExist = "Role Name Already Exist Please Try With Unique One";
        public static string MultipleRoleNotAllow = "You Can Not Assign Multiple Role To Any User";
        public static string SuccessReInviteUser = "Successfully resend Invite link in your email.";
        public static string SuccessInviteUser = "Your account has been activated, Successfully send reset password link in your mail.";

        #region "Social Profile message"

        public static string Default_Visibility_of_Profile = "Please select valid visible profile type."; // 7007;

        public static string Min_Trade_Volume_Requir_in_Time = "Please select valid min trade volume time."; // 7008
        public static string Subscription_Charge_Frequency = "Please select valid subscription charge frequency type."; // 7009
        public static string Can_Add_Pair_to_Watchlist = "Please select valid leader watchlist."; // 7010
        public static string SuccessFullUpDateLeaderAdminProfile = "Successfully update leader profile setting.";
        public static string Max_Number_Followers_can_Follow = "Please enter max Number follower can follow."; //12002
        public static string Min_Balance_Require_in_Follower_Account_to_Follow = "Please enter min Balance follower account to follow."; //12003
        public static string SuccessFullUpGetLeaderAdminProfile = "Successfully get leader profile setting.";




        public static string Can_Copy_Trade = "Please select valid copy trade option."; // 7007;
        public static string Can_Mirror_Trade = "Please Select valid mirror trade option."; // 7008
        public static string Enable_Auto_Copy_Trade_Functionality = "Please select valid auto copy trade option."; // 7009      
        public static string SuccessFullUpDateFollowerAdminProfile = "Successfully update follower profile setting.";
        public static string Minimum_Copy_Trade_Percentage = "Please enter minimum copy trade percentage."; // 12014  
        public static string Default_Copy_Trade_Percentage = "Please enter default copy trade percentage."; // 12015  
        public static string Maximum_Copy_Trade_Percentage = "Please enter default copy trade percentage."; // 12016  
        public static string SuccessFullGetFollowerAdminProfile = "Successfully get follower profile setting.";

        public static string SuccessFullUpGetProfileList = "Successfully get profile.";
        public static string UnsubscribOtherSubscription = "please first unsubscrib other subscription.";
        public static string InvalidSocialProfile = "Invalid social profile.";
        public static string SuccessUnSubscribeProfile = "Successfully unsubscribe profile plan.";
        public static string SubscribeplanNotAvailable = "This Subscribe profile plan not avalible in you account.";

        public static string Set_only_max_number_of_follower = "Set follower number between {0} to {1} of define by admin."; //12023
        public static string Minimum_Balance_required_Leader = "Minimum Balance required"; //12024
        public static string Default_Copy_Trade_Percentageforfront = "Set Default copy trade as per admin policy";//12025
        public static string Maximum_Copy_Trade_PercentageforFront = "Set Maximum copy trade as per admin policy."; // 12026
        public static string Maximum_Number_of_Transactions_Limit = "Please enter maximum transection number limit(par day)"; // 12028
        public static string Maximum_Transaction_Amount_Limit = "Please enter maximum transection amount limit(par day)."; //12027

        public static string Min_Number_of_Followers_can_Follow = "Please enter min Number follower can follow.";//12028
        public static string Maximum_Number_of_Leaders_to_Allow_Follow = "Please enter max number of leader to allow follower."; // 12030 
        public static string Min_Number_of_Followers_can_Follow_front = "Set follower number between minimum to maximum of define by admin."; //12031
        public static string Get_LeaderList_Front = "Successfully get leader list.";        
        public static string Get_LeaderwisefollowerList = "Successfully get leader wise folower list.";
        public static string Can_Copy_Trade_Percentage = "Please input copy trade percentage between 1 to 99."; // 12033;
        public static string Can_Mirror_Trade_Percentage = "Please input mirror trade 100 percentage."; // 12034;
        public static string Copy_Mirror_Or_Trade_Any_One = "Please select any one trade type copy or Mirror."; // 12035;
        public static string AddUserProfileConfiguration = "Successfully add userprofile  configuration.";
        public static string UserProfileConfigurationNotInsert = "User profile configuration not inserted successfully.";
        public static string updateUserProfileConfiguration = "Successfully update userprofile  configuration.";
        public static string UserProfileConfigurationNotupdate = "User profile configuration not updated successfully.";
        public static string DeleteUserProfileConfiguration = "Successfully Delete userprofile  configuration.";
        public static string UserProfileConfigurationNotDelete = "User profile configuration not deleted successfully.";
        public static string GetUserProfileConfiguration = "Successfully get userprofile  configuration.";
        public static string UserProfileLevelExist = "User profile configuration level already exist.";
        public static string LinkExpiryTime = "Please enter the valid link expiry time.";
        public static string MaxfppwdDay = "Please enter the valid forgot password in day.";
        public static string MaxfppwdMonth = "Please enter the valid forgot password in month.";
        public static string OTPExpiryTime = "Please enter the valid OTP expiry time.";
        public static string PwdExpiretime = "Please enter the valid password expiry time.";
        public static string GetCustomerProfileConfiguration = "Successfully get Profile Customer Count.";
        public static string Profilewiseuserlist  = "Successfully get Profile wise user list .";
        public static string SuccessUnFollowLeader = "Successfully unfollow leader.";
        public static string FollowerNotAvailable = "Follower not follow this leader."; //12036
        public static string LeaderId_NotNull = "Please input leader id."; //12037
        public static string SuccessGetLeaderConfig = "Successfully get leader congiuration.";
        public static string UserNotSubscibeSocialProfile = "User not subscribe leader profile.";
        public static string UserNotSubscribAnyProfile = "User not subscribe any social profile.";
        public static string Gettypemaster = "Successfully Get Type master";
        public static string Profilelevelmaster = "Successfully get profile level master.";
        public static string Successfully_Add_Group = "Successfully new create group.";
        public static string Already_Exsits_Group = "Already exsits group name."; // 12041
        public static string Successfully_Get_Group_List = "Successfully get group list.";
        public static string Successfully_Add_Watch = "Successfully added watch master.";
        public static string Already_Exsits_Watch = "Already available in watch master.";
        public static string Successfully_Get_Watch_List = "Successfully get watch list.";
        public static string SuccessUnFollowWatch = "Successfully unfollow watch list.";
        public static string UnFollowWatchNotAvailable = "UnFollow watch data not available.";
        public static string Get_WatchList_Front = "Successfully get watch list.";
        public static string LederlimitExide = "Cannot follow the leader because leader follows limit exide.";//12046
        
         
        #endregion

        //Affiliate System Error Message
        public static string PromotionInsertFail = "Promotion add fail.";
        public static string UserIsNotAsffiliateUser = "User is not affiliate user.";
        public static string InvalidAffliateSchemeType = "Invalid affiliate scheme.";
        public static string InvalidAffliateReferCode = "Invalid affiliate referal code.";
        public static string InvalidAffiliatePromotionType = "Invalid affiliate promotion type.";
        public static string AffiliateSendEmailBlankRequest = "Email Request Can't be blank.";
        public static string AffiliateSendSMSBlankRequest = "SMS Request Can't be blank.";
        public static string AffiliateEmailSendSuccess = "Email Send Successfully.";
        public static string UserIsNotSelectEmailPromotion = "User Not Select Email Promotion Type.";
        public static string AffiliateEmailHourlyLimitExceed = "Your Houly Email Sending Limit Exceed.";
        public static string AffiliateEmailDailyLimitExceed = "Your Daily Email Sending Limit Exceed.";
        public static string AffiliateSMSSendSuccess = "SMS Send Successfully.";
        public static string UserIsNotSelectSMSPromotion = "User Not Select SMS Promotion Type.";
        public static string AffiliateSMSHourlyLimitExceed = "Your Houly SMS Sending Limit Exceed.";
        public static string AffiliateSMSDailyLimitExceed = "Your Daily SMS Sending Limit Exceed.";
        public static string SuccessfullyAddAffiliateSchemeTypeMapping = "Successfully add affiliate scheme type mapping.";
        public static string FailToAddAffiliateSchemeTypeMapping = "Fail to add affiliate scheme type mapping.";
        public static string AffiliateSchemeTypeMappingList = "Get successfully list of affiliate scheme type mapping.";
        public static string FailAffiliateSchemeTypeMappingList = "Fail to get list of affiliate scheme type mapping.";
        public static string GetAffiliateSchemeTypeMapping = "Get successfully affiliate scheme type mapping.";
        public static string GetFailAffiliateSchemeTypeMapping = "Fail to get affiliate scheme type mapping.";
        public static string SuccessfullyUpdateAffiliateSchemeTypeMapping = "Successfully update affiliate scheme type mapping.";
        public static string FailToUpdateAffiliateSchemeTypeMapping = "Fail to update affiliate scheme type mapping.";
        public static string AfMappingIdRequired = "Scheme Mapping ID Should Greater Than Zero";
        public static string AfMappingDataNotFound = "Scheme Mapping Data Not Found";
        public static string AfInvalidLevel = "Invalid Level,This Level Is Only Available For MLM";
        public static string AfInvalidLevelForMLM = "Invalid Level For MLM";


        //ntrivedi 05-03-2019 added for leveragedetail method  
        public static string MarginFirstCurrencyNotFound = "Invalid First Currency";
        public static string MarginSecondCurrencyNotFound = "Invalid Second Currency";
        public static string MarginFirstCurrecyUserWalletNotFound = "Margin FirstCurrecy UserWallet NotFound";
        public static string MarginSecondCurrecyUserWalletNotFound = "Margin SecondCurrecy User Wallet NotFound";
        public static string MarginFirstCurrecyLeverageDetailNotFound = "Margin FirstCurrecy Leverage Detail NotFound";
        public static string MarginSecondCurrecyLeverageDetailNotFound = "Margin SecondCurrecy Leverage Detail NotFound";
        public static string MarginLeverageDetailFoundSuccess = "Margin Leverage Detail Found";

        // Deposition Interval  by Pratik 
        public static string SuccessfullAddOrUpdateDepositionInterval = "Deposition Interval set Successfully.";//Successfully create or update deposition interval ntrivedi 25-03-2018 msg updated
        public static string FailAddOrUpdateDepositionInterval = "Fail to create or update deposition interval.";

        public static string DepositionIntervalList = "Get successfully list of deposition interval.";
        public static string FailDepositionIntervalList = "Fail to get list of deposition interval.";

        public static string DisableDepositionIntervalStatus = "Successfully disable deposition interval status.";
        public static string FailDisableDepositionIntervalStatus = "Fail to disable  deposition interval status.";
        
        public static string EnableDepositionIntervalStatus = "Successfully enable deposition interval status.";
        public static string FailEnableDepositionIntervalStatus = "Fail to enable deposition interval status.";


        // Trade Recon added by khushali 20-03-2019 

        public static string TransactionStatusNotHold = "";
        public static string TransactionStatusNotSuccess = "";
        public static string TransactionStatusNotFail = "";
        public static string TransactionStatusNotActive = "";
        public static string TransactionStatusNotInActive = "";


        public static string GetMultichainAddressList = "Get successfully list of multichain address.";
        public static string FailMultichainAddressList = "Fail to get list of multichain address.";
        public static string FailMultichainConnection = "Fail to connect multichain.";
        public static string FailMultichainConnectionNode = "Fail to connect multichain server node.";

        //Arbitrage 14-06-2019
        
        public static string ArbitrageLPWalletBalanceMismatch = "Balance Matching Faiure.Please contact admin.";

        public static string SpecialChargeConfigurationNotFound = "Special Charge Configuration Not Found";
        public static string RecordAlreadyExists = "Record Already Exists";
    }


}
