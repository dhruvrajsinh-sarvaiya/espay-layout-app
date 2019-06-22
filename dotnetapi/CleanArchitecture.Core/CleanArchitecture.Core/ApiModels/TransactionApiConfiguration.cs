using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.SharedKernel;
using MediatR;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace CleanArchitecture.Core.ApiModels
{ 
    public class TransactionApiConfigurationRequest
    {
        [Required]
        public string SMSCode { get; set; }
        public enWebAPIRouteType APIType { get; set; }
        public int trnType { get; set; } // ntrivedi  added 03-11-2018
        public decimal amount { get; set; }// ntrivedi  added 03-11-2018
        public int OrderType { get; set; } // Khushali  added 29-12-2018
        public long PairID { get; set; } // Khushali  added 29-12-2018
        public short LPType { get; set; } // Khushali  added 11-06-2018
    }

    public class ArbitrageTransactionApiConfigurationRequest
    {
        [Required]
        public string SMSCode { get; set; }
        public enWebAPIRouteType APIType { get; set; }
        public int trnType { get; set; }   
        public decimal amount { get; set; }
        public int OrderType { get; set; } 
        public long PairID { get; set; }   
    }

    public class TransactionProviderResponseForWithdraw
    {
        public long ServiceID { get; set; }
        public string ServiceName { get; set; }
        public long ServiceProID { get; set; }
        public long SerProDetailID { get; set; }
        //public string SerProName { get; set; } Rushabh 11-10-2018 Removed because there is no column in database
        public long RouteID { get; set; }
        public long ProductID { get; set; } // ntrivedi added 03-11-2018
        public string RouteName { get; set; }
        //public string SMSCode { get; set; }
        public int ServiceType { get; set; }
        public long ThirPartyAPIID { get; set; }
        public long AppTypeID { get; set; } //Rushabh Updated 11-10-2018 oldName=AppType
        public decimal MinimumAmountItem { get; set; } //Rushabh Updated 11-10-2018 old datatype=long
        public decimal MaximumAmountItem { get; set; } //Rushabh Updated 11-10-2018 old datatype=long
        //Rushabh Updated 15-10-2018 As query doesn't return these parameters anymore
        //public decimal MinimumAmountService { get; set; } //Rushabh Updated 11-10-2018 old datatype=long
        //public decimal MaximumAmountService { get; set; } //Rushabh Updated 11-10-2018 old datatype=long
        public string APIBalURL { get; set; } // Khushali  added 29-01-2018
        public string APISendURL { get; set; } // Khushali  added 29-01-2018
        public string APIValidateURL { get; set; } // Khushali  added 29-01-2018
        public string ContentType { get; set; } // Khushali  added 29-01-2018
        public string MethodType { get; set; } // Khushali  added 29-01-2018
        public string OpCode { get; set; } // Khushali  added 29-01-2018
        public int ParsingDataID { get; set; } // Khushali  added 29-01-2018
        public string ProviderWalletID { get; set; } // Khushali  added 29-01-2018
        public long ProTypeID { get; set; } // Khushali  added 29-01-2018        
        public string AccNoStartsWith { get; set; } // Rushabh 23-03-2019        
        public string AccNoValidationRegex { get; set; } // Rushabh 23-03-2019        
        public int AccountNoLen { get; set; } // Rushabh 23-03-2019
        public short IsAdminApprovalRequired { get; set; }
        public short IsOnlyIntAmountAllow { get; set; }
    }

    public class TransactionProviderResponse
    {
        public long ServiceID { get; set; }
        public string ServiceName { get; set; }
        public long ServiceProID { get; set; }
        public long SerProDetailID { get; set; }
        //public string SerProName { get; set; } Rushabh 11-10-2018 Removed because there is no column in database
        public long RouteID { get; set; }
        public long ProductID { get; set; } // ntrivedi added 03-11-2018
        public string RouteName { get; set; }
        //public string SMSCode { get; set; }
        public int ServiceType { get; set; }
        public long ThirPartyAPIID { get; set; }      
        public long AppTypeID { get; set; } //Rushabh Updated 11-10-2018 oldName=AppType
        public decimal MinimumAmountItem { get; set; } //Rushabh Updated 11-10-2018 old datatype=long
        public decimal MaximumAmountItem { get; set; } //Rushabh Updated 11-10-2018 old datatype=long
        //Rushabh Updated 15-10-2018 As query doesn't return these parameters anymore
        //public decimal MinimumAmountService { get; set; } //Rushabh Updated 11-10-2018 old datatype=long
        //public decimal MaximumAmountService { get; set; } //Rushabh Updated 11-10-2018 old datatype=long
        public string APIBalURL { get; set; } // Khushali  added 29-01-2018
        public string APISendURL { get; set; } // Khushali  added 29-01-2018
        public string APIValidateURL { get; set; } // Khushali  added 29-01-2018
        public string ContentType { get; set; } // Khushali  added 29-01-2018
        public string MethodType { get; set; } // Khushali  added 29-01-2018
        public string OpCode { get; set; } // Khushali  added 29-01-2018
        public int ParsingDataID { get; set; } // Khushali  added 29-01-2018
        public string ProviderWalletID { get; set; } // Khushali  added 29-01-2018
        public long ProTypeID { get; set; } // Khushali  added 29-01-2018
        [NotMapped]
        public string AccNoStartsWith { get; set; } // Rushabh 23-03-2019
        [NotMapped]
        public string AccNoValidationRegex { get; set; } // Rushabh 23-03-2019
        [NotMapped]
        public int AccountNoLen { get; set; } // Rushabh 23-03-2019
        public short IsAdminApprovalRequired { get; set; }
    }
    public class TransactionProviderArbitrageResponse
    {
        public short LPType { get; set; }
        public long RouteID { get; set; }
        //public long ordertype { get; set; }
        public long ProTypeID { get; set; }
        public string RouteName { get; set; }
        public long ProviderID { get; set; }
        public string ProviderName { get; set; }
        public long SerProDetailID { get; set; }
        public long TrnType { get; set; }
        [Range(0, 9999999999.999999999999999999), Column(TypeName = "decimal(28, 18)")]
        public decimal LTP { get; set; }
    }

    public class TransactionProviderResponse3
    {
        public long ServiceID { get; set; }
        public string ServiceName { get; set; }
        public long ServiceProID { get; set; }
        public long SerProDetailID { get; set; }
        //public string SerProName { get; set; } Rushabh 11-10-2018 Removed because there is no column in database
        public long RouteID { get; set; }
        public long ProductID { get; set; } // ntrivedi added 03-11-2018
        public string RouteName { get; set; }
        //public string SMSCode { get; set; }
        public int ServiceType { get; set; }
        public long ThirPartyAPIID { get; set; }
        public long AppTypeID { get; set; } //Rushabh Updated 11-10-2018 oldName=AppType
        public decimal MinimumAmountItem { get; set; } //Rushabh Updated 11-10-2018 old datatype=long
        public decimal MaximumAmountItem { get; set; } //Rushabh Updated 11-10-2018 old datatype=long
        //Rushabh Updated 15-10-2018 As query doesn't return these parameters anymore
        //public decimal MinimumAmountService { get; set; } //Rushabh Updated 11-10-2018 old datatype=long
        //public decimal MaximumAmountService { get; set; } //Rushabh Updated 11-10-2018 old datatype=long
        public string APIBalURL { get; set; } // Khushali  added 29-01-2018
        public string APISendURL { get; set; } // Khushali  added 29-01-2018
        public string APIValidateURL { get; set; } // Khushali  added 29-01-2018
        public string ContentType { get; set; } // Khushali  added 29-01-2018
        public string MethodType { get; set; } // Khushali  added 29-01-2018
        public string OpCode { get; set; } // Khushali  added 29-01-2018
        public int ParsingDataID { get; set; } // Khushali  added 29-01-2018
        public string ProviderWalletID { get; set; } // Khushali  added 29-01-2018
        public long ProTypeID { get; set; } // Khushali  added 29-01-2018
        [NotMapped]
        public string AccNoStartsWith { get; set; } // Rushabh 23-03-2019
        [NotMapped]
        public string AccNoValidationRegex { get; set; } // Rushabh 23-03-2019
        [NotMapped]
        public int AccountNoLen { get; set; } // Rushabh 23-03-2019
        public decimal ConvertAmount { get; set; }
    }

    public class TransactionProviderResponse2
    {
        public long ServiceID { get; set; }
        public string ServiceName { get; set; }
        public long ServiceProID { get; set; }
        public long SerProDetailID { get; set; }
        //public string SerProName { get; set; } Rushabh 11-10-2018 Removed because there is no column in database
        public long RouteID { get; set; }
        public long ProductID { get; set; } // ntrivedi added 03-11-2018
        public string RouteName { get; set; }
        //public string SMSCode { get; set; }
        public int ServiceType { get; set; }
        public long ThirPartyAPIID { get; set; }
        public long AppTypeID { get; set; } //Rushabh Updated 11-10-2018 oldName=AppType
        public decimal MinimumAmountItem { get; set; } //Rushabh Updated 11-10-2018 old datatype=long
        public decimal MaximumAmountItem { get; set; } //Rushabh Updated 11-10-2018 old datatype=long
        //Rushabh Updated 15-10-2018 As query doesn't return these parameters anymore
        //public decimal MinimumAmountService { get; set; } //Rushabh Updated 11-10-2018 old datatype=long
        //public decimal MaximumAmountService { get; set; } //Rushabh Updated 11-10-2018 old datatype=long
        public string APIBalURL { get; set; } // Khushali  added 29-01-2018
        public string APISendURL { get; set; } // Khushali  added 29-01-2018
        public string APIValidateURL { get; set; } // Khushali  added 29-01-2018
        public string ContentType { get; set; } // Khushali  added 29-01-2018
        public string MethodType { get; set; } // Khushali  added 29-01-2018
        public string OpCode { get; set; } // Khushali  added 29-01-2018
        public int ParsingDataID { get; set; } // Khushali  added 29-01-2018
        public string ProviderWalletID { get; set; } // Khushali  added 29-01-2018
        public long ProTypeID { get; set; } // Khushali  added 29-01-2018
        [NotMapped]
        public string AccNoStartsWith { get; set; } // Rushabh 23-03-2019
        [NotMapped]
        public string AccNoValidationRegex { get; set; } // Rushabh 23-03-2019
        [NotMapped]
        public int AccountNoLen { get; set; } // Rushabh 23-03-2019        
        public long AddressId { get; set; }        
        public string Address { get; set; }        
        public string RefKey { get; set; }
        public decimal ConvertAmount { get; set; }
    }


    public class WebApiConfigurationResponse
    { 
        public long ThirPartyAPIID { get; set; }
        public string APISendURL { get; set; }
        public string APIValidateURL { get; set; }
        public string APIBalURL { get; set; }
        public string APIStatusCheckURL { get; set; }
        public string APIRequestBody { get; set; }
        public string TransactionIdPrefix { get; set; }
        public string MerchantCode { get; set; }
        public string UserID { get; set; }
        public string Password { get; set; }
        public string AuthHeader { get; set; }
        public string ContentType { get; set; }
        public string MethodType { get; set; }
        public string HashCode { get; set; }
        public string HashCodeRecheck { get; set; }
        public short HashType { get; set; }
        public short AppType { get; set; }
    }

    //ntrivedi moved from webapiparseresponsecls.cs
    public class GetDataForParsingAPI
    {
        public string ResponseSuccess { get; set; } = "";
        public string ResponseFailure { get; set; } = "";
        public string ResponseHold { get; set; } = "";
        public string BalanceRegex { get; set; } = "";
        public string StatusRegex { get; set; } = "";
        public string StatusMsgRegex { get; set; } = "";
        public string ResponseCodeRegex { get; set; } = "";
        public string ErrorCodeRegex { get; set; } = "";
        public string TrnRefNoRegex { get; set; } = "";
        public string OprTrnRefNoRegex { get; set; } = "";
        public string Param1Regex { get; set; } = "";
        public string Param2Regex { get; set; } = "";
        public string Param3Regex { get; set; } = "";
    }
    public class TradeHistoryResponce
    {
        public long TrnNo { get; set; }
        public string Type { get; set; }
        public Decimal Price { get; set; }
        public Decimal Amount { get; set; }
        public DateTime DateTime { get; set; }
        public short Status { get; set; }
        public string StatusText { get; set; }
        public String PairName { get; set; }
        public Decimal? ChargeRs { get; set; }
        public short IsCancelled { get; set; }
        public short ordertype { get; set; }
        public long StatusCode { get; set; }
        public DateTime? SettledDate { get; set; }
        public Decimal SettledQty { get; set; }
        public string Chargecurrency { get; set; }
    }
    public class TradeHistoryResponceArbitrage
    {
        public long TrnNo { get; set; }
        public string Type { get; set; }
        public Decimal Price { get; set; }
        public Decimal Amount { get; set; }
        public DateTime DateTime { get; set; }
        public short Status { get; set; }
        public string StatusText { get; set; }
        public String PairName { get; set; }
        public Decimal? ChargeRs { get; set; }
        public short IsCancelled { get; set; }
        public short ordertype { get; set; }
        public long StatusCode { get; set; }
        public DateTime? SettledDate { get; set; }
        public Decimal SettledQty { get; set; }
        public string Chargecurrency { get; set; }
        public string ExchangeName { get; set; }//komal 08-06-2019 add exchange name
    }
    public class RecentOrderRespose 
    {
        public short ordertype { get; set; }
        public long TrnNo { get; set; }
        public string Type { get; set; }
        public Decimal Price { get; set; }
        public Decimal Qty { get; set; }
        public DateTime DateTime { get; set; }
        public string Status { get; set; }
        public string PairName { get; set; }
        public long PairId { get; set; }
        public short StatusCode { get; set; }
        public DateTime? SettledDate { get; set; }
        public Decimal SettledQty { get; set; }
        public short ISFollowersReq { get; set; }
       
    }
    public class RecentOrderResposeArbitrage
    {
        public short ordertype { get; set; }
        public long TrnNo { get; set; }
        public string Type { get; set; }
        public Decimal Price { get; set; }
        public Decimal Qty { get; set; }
        public DateTime DateTime { get; set; }
        public string Status { get; set; }
        public string PairName { get; set; }
        public long PairId { get; set; }
        public short StatusCode { get; set; }
        public DateTime? SettledDate { get; set; }
        public Decimal SettledQty { get; set; }
        public short ISFollowersReq { get; set; }
        public string ExchangeName { get; set; }//komal 08-06-2019 add exchange name
    }
    public class GetGraphResponse
    {
        public DateTime DataDate { get; set; }
        public decimal High { get; set; }
        public decimal Low { get; set; }
        public decimal OpenVal { get; set; }
        public decimal CloseVal { get; set; }
        public decimal Volume { get; set; }
    }
    public class GetTradingSummary
    {
        public long TrnNo { get; set; }
        public short ordertype { get; set; }
        public long MemberID { get; set; }
        public string Type { get; set; }
        public Decimal Price { get; set; }
        public Decimal Amount { get; set; }
        public DateTime DateTime { get; set; }
        public string StatusText { get; set; }
        public long PairID { get; set; }
        public String PairName { get; set; }
        public Decimal ChargeRs { get; set; }
        //public Decimal PreBal { get; set; }
        //public Decimal PostBal { get; set; }
        public short StatusCode { get; set; }
        public short IsCancelled { get; set; }
        public decimal SettleQty { get; set; }
    }

    public class GetTradingSummaryLP
    {
        public long TrnNo { get; set; }
        public short ordertype { get; set; }
        public long MemberID { get; set; }
        public string Type { get; set; }
        public Decimal Price { get; set; }
        public Decimal Amount { get; set; }
        public DateTime DateTime { get; set; }
        public string StatusText { get; set; }
        public long PairID { get; set; }
        public String PairName { get; set; }
        public Decimal ChargeRs { get; set; }
        //public Decimal PreBal { get; set; }
        //public Decimal PostBal { get; set; }
        public short StatusCode { get; set; }
        public short IsCancelled { get; set; }
        public decimal SettleQty { get; set; }
        public string ProviderName { get; set; }
    }

    public class GetTradingReconHistory
    {
        public long TrnNo { get; set; }
        public short ordertype { get; set; }
        public long MemberID { get; set; }
        public string Type { get; set; }
        public Decimal Price { get; set; }
        public Decimal Amount { get; set; }
        public DateTime DateTime { get; set; }
        public string StatusText { get; set; }
        public long PairID { get; set; }
        public String PairName { get; set; }
        public Decimal ChargeRs { get; set; }
        //public Decimal PreBal { get; set; }
        //public Decimal PostBal { get; set; }
        public short StatusCode { get; set; }
        public short IsCancelled { get; set; }
        public decimal SettleQty { get; set; }
        public string ProviderName { get; set; }
        public int IsProcessing { get; set; }
        public string ActionStage { get; set; }
        public short IsAPITrade { get; set; }
        public string UserName { get; set; }        
    }

    public class ServiceMasterResponse
    {
        public long ServiceId { get; set; }
        public string ServiceName { get; set; }
        public string SMSCode { get; set; }
        public short ServiceType { get; set; }
        public string ServiceDetailJson { get; set; }
        public long CirculatingSupply { get; set; }
        public DateTime IssueDate { get; set; }
        public decimal IssuePrice { get; set; }
        public short TransactionBit { get; set; }
        public short WithdrawBit { get; set; }
        public short DepositBit { get; set; }
        public short Status { get; set; }
        public long WalletTypeID { get; set; }
        public short IsOnlyIntAmountAllow { get; set; }
    }
    public class GetGraphResponsePairWise
    {
        public long DataDate { get; set; }
        public decimal High { get; set; }
        public decimal Low { get; set; }
        public decimal OpenVal { get; set; }
        public decimal CloseVal { get; set; }
        public decimal Volume { get; set; }
        public string PairName { get; set; }
    }

    public class LPStatusCheckCls : IRequest  /// khushali 23-01-2019  for LP status check
    {
        public Guid uuid { get; set; } = Guid.NewGuid();
    }

    public class LPStatusCheckClsArbitrage : IRequest  /// Rushabh 13-06-2019  for LP status check arbitrage
    {
        public Guid uuid { get; set; } = Guid.NewGuid();
    }


    public class LPStatusCheckData : IRequest
    {
        public long AppTypeID { get; set; }
        public long TrnNo { get; set; }
        public short Ordertype { get; set; }
        public short  TrnType { get; set; }
        public short  Status { get; set; }
        public decimal Price { get; set; }
        public decimal  Amount { get; set; }
        public DateTime  DateTime { get; set; }
        public string  TrnRefNo { get; set; }
        public string  Pair { get; set; }
        public long SerProDetailID { get; set; }
    }

    public class LPStatusCheckDataArbitrage : IRequest
    {
        public long AppTypeID { get; set; }
        public long TrnNo { get; set; }
        public short Ordertype { get; set; }
        public short TrnType { get; set; }
        public short Status { get; set; }
        public decimal Price { get; set; }
        public decimal Amount { get; set; }
        public DateTime DateTime { get; set; }
        public string TrnRefNo { get; set; }
        public string Pair { get; set; }
        public long SerProDetailID { get; set; }
    }


    public class ReleaseOrdercls : IRequest
    {
        public DateTime DateTime { get; set; }
    }

    public class StuckOrdercls : IRequest
    {
        public DateTime DateTime { get; set; }
    }

    public class MarginStuckOrdercls : IRequest
    {
        public DateTime DateTime { get; set; }
    }

    public class ReleaseAndStuckOrdercls
    {
        public long TrnNo { get; set; }
    }

    public class ArbitrageTransactionProviderResponse
    {
        public long ServiceID { get; set; }
        public string ServiceName { get; set; }
        public long ServiceProID { get; set; }
        public long SerProDetailID { get; set; }
        public long RouteID { get; set; }
        public long ProductID { get; set; } 
        public string RouteName { get; set; }
        public int ServiceType { get; set; }
        public long ThirPartyAPIID { get; set; }
        public long AppTypeID { get; set; } 
        public decimal MinimumAmountItem { get; set; }
        public decimal MaximumAmountItem { get; set; }
        public string APIBalURL { get; set; } 
        public string APISendURL { get; set; } 
        public string APIValidateURL { get; set; }
        public string ContentType { get; set; } 
        public string MethodType { get; set; } 
        public string OpCode { get; set; }
        public int ParsingDataID { get; set; } 
        public string ProviderWalletID { get; set; }
        public long ProTypeID { get; set; }  
        public string AccNoStartsWith { get; set; }       
        public string AccNoValidationRegex { get; set; }      
        public int AccountNoLen { get; set; } 
        public short IsAdminApprovalRequired { get; set; }
        //public short IsOnlyIntAmountAllow { get; set; }
    }
}
