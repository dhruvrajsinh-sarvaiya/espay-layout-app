using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Core.ViewModels.Wallet;
using CleanArchitecture.Infrastructure.DTOClasses;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Infrastructure.Data.Transaction
{
    public class WebApiDataRepository : IWebApiRepository
    {
        private readonly CleanArchitectureContext _dbContext;
        public readonly ILogger<WebApiDataRepository> _log;


        public WebApiDataRepository(CleanArchitectureContext dbContext, ILogger<WebApiDataRepository> log)
        {
            _dbContext = dbContext;
            _log = log;
        } 

        public WebApiConfigurationResponse GetThirdPartyAPIData(long ThirPartyAPIID)
        {
            var result = from TP in _dbContext.ThirdPartyAPIConfiguration
                         where TP.Id == ThirPartyAPIID && TP.Status == 1
                         select new WebApiConfigurationResponse
                         {
                             ThirPartyAPIID = TP.Id,
                             APISendURL = TP.APISendURL,
                             APIValidateURL = TP.APIValidateURL,
                             APIBalURL = TP.APIBalURL,
                             APIStatusCheckURL = TP.APIStatusCheckURL,
                             APIRequestBody = TP.APIRequestBody,
                             TransactionIdPrefix = TP.TransactionIdPrefix,
                             MerchantCode = TP.MerchantCode,
                             //UserID = TP.UserID,
                             //Password = TP.Password,
                             AuthHeader = TP.AuthHeader,
                             ContentType = TP.ContentType,
                             MethodType = TP.MethodType,
                             HashCode = TP.HashCode,
                             HashCodeRecheck = TP.HashCodeRecheck,
                             HashType = TP.HashType,
                             AppType = TP.AppType
                         };
            return result.FirstOrDefault();
        }
        public GetDataForParsingAPI GetDataForParsingAPI(long ThirPartyAPIID)
        {
            var result = from TP in _dbContext.ThirdPartyAPIConfiguration
                         join Regex in _dbContext.ThirdPartyAPIResponseConfiguration on TP.ParsingDataID equals Regex.Id
                         where TP.Id == ThirPartyAPIID && TP.Status == 1
                         select new GetDataForParsingAPI
                         {
                             ResponseSuccess = TP.ResponseSuccess,
                             ResponseFailure = TP.ResponseFailure,
                             ResponseHold = TP.ResponseHold,
                             BalanceRegex = Regex.BalanceRegex,
                             StatusRegex = Regex.StatusRegex,
                             StatusMsgRegex = Regex.StatusMsgRegex,
                             ResponseCodeRegex = Regex.ResponseCodeRegex,
                             ErrorCodeRegex = Regex.ErrorCodeRegex,
                             TrnRefNoRegex = Regex.TrnRefNoRegex,
                             OprTrnRefNoRegex = Regex.OprTrnRefNoRegex,
                             Param1Regex = Regex.Param1Regex,
                             Param2Regex = Regex.Param2Regex,
                             Param3Regex = Regex.Param3Regex
                         };
            return result.FirstOrDefault();
        }

        public GetDataForParsingAPI ArbitrageGetDataForParsingAPI(long ThirPartyAPIID)
        {
            var result = from TP in _dbContext.ArbitrageThirdPartyAPIConfiguration
                         join Regex in _dbContext.ArbitrageThirdPartyAPIResponseConfiguration on TP.ParsingDataID equals Regex.Id
                         where TP.Id == ThirPartyAPIID && TP.Status == 1
                         select new GetDataForParsingAPI
                         {
                             ResponseSuccess = TP.ResponseSuccess,
                             ResponseFailure = TP.ResponseFailure,
                             ResponseHold = TP.ResponseHold,
                             BalanceRegex = Regex.BalanceRegex,
                             StatusRegex = Regex.StatusRegex,
                             StatusMsgRegex = Regex.StatusMsgRegex,
                             ResponseCodeRegex = Regex.ResponseCodeRegex,
                             ErrorCodeRegex = Regex.ErrorCodeRegex,
                             TrnRefNoRegex = Regex.TrnRefNoRegex,
                             OprTrnRefNoRegex = Regex.OprTrnRefNoRegex,
                             Param1Regex = Regex.Param1Regex,
                             Param2Regex = Regex.Param2Regex,
                             Param3Regex = Regex.Param3Regex
                         };
            return result.FirstOrDefault();
        }
        //ntrivedi fetch route
        public List<TransactionProviderResponse> GetProviderDataList(TransactionApiConfigurationRequest Request)
        {
            try
            {
                #region old code
                //and {2} between RC.MinimumAmount and RC.MaximumAmount
                //and {2}  between SC.MinimumAmount and SC.MaximumAmount
                //IQueryable<TransactionProviderResponse> Result = _dbContext.TransactionProviderResponse.FromSql(
                //            @"select SC.ID as ServiceID,SC.ServiceName,Prc.ID as SerProDetailID,Prc.ServiceProID,RC.ID as RouteID,
                //            PC.ID as ProductID,RC.RouteName,SC.ServiceType,Prc.ThirPartyAPIID,Prc.AppTypeID,RC.MinimumAmount as MinimumAmountItem,
                //            RC.MaximumAmount as MaximumAmountItem,SC.MinimumAmount as MinimumAmountService,SC.MaximumAmount as MaximumAmountService
                //            from ServiceConfiguration SC inner join  ProductConfiguration PC on
                //   PC.ServiceID = SC.Id inner join RouteConfiguration RC on RC.ProductID = PC.Id  
                //   inner join ServiceProviderDetail PrC on Prc.ServiceProID = RC.SerProID AND Prc.TrnTypeID={1} 
                //   where SC.SMSCode = {0} and RC.TrnType={1} 
                //   and {2} between RC.MinimumAmount and RC.MaximumAmount
                //   and {3} between SC.MinimumAmount and SC.MaximumAmount
                //   and SC.Status = 1 and RC.Status = 1 and Prc.Status=1 
                //   order by RC.Priority", Request.SMSCode, Request.trnType, Request.amount,Request.amount);

                // ntrivedi limit changes done 12-10-2018
                //Rita 13-10-2018  remove as no present in New table Service master
                //,SC.MinimumAmount as MinimumAmountService,SC.MaximumAmount as MaximumAmountService
                //and {3} between SC.MinimumAmount and SC.MaximumAmount
                //Rita 17-10-18 further make inner joi in RoutMaster with SerProDetailID with providerdetail
                #endregion
                IQueryable<TransactionProviderResponse> Result = _dbContext.TransactionProviderResponse.FromSql(
                           @"select SC.ID as ServiceID,SC.Name as ServiceName,Prc.ID as SerProDetailID,Prc.ServiceProID,RC.ID as RouteID,
                            PC.ID as ProductID,RC.RouteName,SC.ServiceType,Prc.ThirPartyAPIID,Prc.AppTypeID,LC.MinAmt as MinimumAmountItem,
                            LC.MaxAmt as MaximumAmountItem
                            from ServiceMaster SC inner join  ProductConfiguration PC on
			                PC.ServiceID = SC.Id inner join RouteConfiguration RC on RC.ProductID = PC.Id  
			                inner join ServiceProviderDetail PrC on Prc.Id = RC.SerProDetailID AND Prc.TrnTypeID={1} 
							inner join Limits LC on LC.ID = RC.LimitID 
			                where SC.SMSCode = {0}  and RC.TrnType={1} 
			                and {2} between LC.MinAmt and LC.MaxAmt			                
			                and SC.Status = 1 and RC.Status = 1 and Prc.Status=1 
			                order by RC.Priority", Request.SMSCode, Request.trnType, Request.amount);

                #region old code

                //return Result.ToList();Prc.SerProName,


                //IQueryable<TransactionProviderResponse> Result = _dbContext.TransactionProviderResponse.FromSql(
                //        @"select SC.ID as ServiceID,SC.ServiceName,Prc.ID as SerProID,Prc.SerProName,RC.ID as RouteID,PC.ID as ProductID,RC.RouteName,SC.ServiceType,
                //        Prc.ThirPartyAPIID,Prc.AppType,RC.MinimumAmount as MinimumAmountItem,RC.MaximumAmount as MaximumAmountItem,SC.MinimumAmount as MinimumAmountService,SC.MaximumAmount as MaximumAmountService
                //        from ServiceConfiguration SC inner
                //        join ProductConfiguration PC on
                //        PC.ServiceID = SC.Id inner
                //        join RouteConfiguration RC on RC.ProductID = PC.Id  inner
                //        join ProviderConfiguration PrC on Prc.Id = RC.SerProID
                //        where SC.SMSCode = {0} and RC.TrnType ={1}   and {2}
                //        between RC.MinimumAmount and RC.MaximumAmount and {3}
                //        between SC.MinimumAmount and SC.MaximumAmount
                //        and SC.Status = 1 and RC.Status = 1 and Prc.Status = 1
                //        order by RC.Priority ", Request.SMSCode,Request.trnType, Request.amount,Request.amount);

                #endregion

                var list = new List<TransactionProviderResponse>(Result);
                return list;
                //return Result.ToList();
            }
            catch (Exception ex)
            {
                _log.LogError(ex, "MethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                throw ex;
            }
        }

        //khushali Fetch Liquidity Provider
        public async Task<List<TransactionProviderResponse>> GetProviderDataListV2Async(TransactionApiConfigurationRequest Request)
        {
            try
            {

                #region New Route configuratin by khushali
                IQueryable<TransactionProviderResponse> Result = _dbContext.TransactionProviderResponse.FromSql(
                            //@"select SM.ID as ServiceID,SM.ProviderName as ServiceName,SD.ID as SerProDetailID,SD.ServiceProID,RC.ID as RouteID,
                            // RC.RouteName,RC.OpCode,TP.APIBalURL,TP.APISendURL,TP.APIValidateURL,TP.ContentType,
                            // TP.MethodType,TP.ParsingDataID,SD.ThirPartyAPIID,SD.AppTypeID,LC.MinAmt as MinimumAmountItem,
                            // LC.MaxAmt as MaximumAmountItem,SD.ProTypeID ,RC.ProductID ,'' as ProviderWalletID ,0 as ServiceType FROM RouteConfiguration RC 
                            // INNER JOIN   ServiceProviderDetail SD ON  SD.Id = RC.SerProDetailID  
                            // INNER JOIN  ServiceProviderMaster SM ON SM.Id = SD.ServiceProID 
                            // INNER JOIN ThirdPartyAPIConfiguration TP ON TP.id = SD.ThirPartyAPIID
                            // INNER JOIN TradePairMaster TM ON TM.id = RC.PairId
                            // INNER JOIN Limits LC ON LC.ID = RC.LimitID 
                            // WHERE {2} between LC.MinAmt and LC.MaxAmt AND SD.TrnTypeID = {1} AND RC.TrnType = {1}  AND  RC.OrderType = {0}  AND 
                            // SD.Status = 1 AND RC.Status = 1 AND TM.Status=1", Request.OrderType, Request.trnType, Request.amount);
                            //Rita 4-4-18 added ,RC.AccNoStartsWith,RC.AccNoValidationRegex,RC.AccountNoLen as added in class by rushbh bhai
                            @"select RC.IsAdminApprovalRequired , SM.ID as ServiceID,SM.ProviderName as ServiceName,SD.ID as SerProDetailID,SD.ServiceProID,RC.ID as RouteID,
                            RC.RouteName,RC.OpCode,'' as APIBalURL,'' as  APISendURL,'' as APIValidateURL,'' as ContentType,
                            '' as MethodType,0 as ParsingDataID,SD.ThirPartyAPIID,SD.AppTypeID,ISNULL(LC.MinAmt,0) as MinimumAmountItem,
                            ISNULL(LC.MaxAmt,0) as MaximumAmountItem,SD.ProTypeID ,RC.ProductID ,'' as ProviderWalletID ,0 as ServiceType
                            FROM RouteConfiguration RC 
                            INNER JOIN  ServiceProviderDetail SD ON  SD.Id = RC.SerProDetailID  
                            INNER JOIN  ServiceProviderMaster SM ON SM.Id = SD.ServiceProID 
                            INNER JOIN TradePairMaster TM ON TM.id = RC.PairId
                            LEFT JOIN Limits LC ON LC.ID = RC.LimitID 
                            WHERE ({2} between LC.MinAmt and LC.MaxAmt OR RC.LimitID=0) AND SD.TrnTypeID = {1} AND RC.TrnType = {1}  AND  RC.OrderType = {0}  AND 
                            SD.Status = 1 AND RC.Status = 1 AND TM.Status=1 AND RC.PairId = {3} order by RC.priority", Request.OrderType, Request.trnType, Request.amount,Request.PairID);
                //var list = Result.Cast<TransactionProviderResponse>().ToList();
                var list = new List<TransactionProviderResponse>(Result);
                return list;
                #endregion
                //return Result.ToList();
            }
            catch (Exception ex)
            {
                _log.LogError(ex, "MethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                throw ex;
            }
        }

        public async Task<List<TransactionProviderResponse>> GetProviderDataListArbitrageV2Async(TransactionApiConfigurationRequest Request)
        {
            try
            {

                #region New Route configuratin by khushali
                IQueryable<TransactionProviderResponse> Result = _dbContext.TransactionProviderResponse.FromSql(
                            @"select RC.IsAdminApprovalRequired , SM.ID as ServiceID,SM.ProviderName as ServiceName,SD.ID as SerProDetailID,SD.ServiceProID,RC.ID as RouteID,
                            RC.RouteName,RC.OpCode,'' as APIBalURL,'' as  APISendURL,'' as APIValidateURL,'' as ContentType,
                            '' as MethodType,0 as ParsingDataID,SD.ThirPartyAPIID,SD.AppTypeID,ISNULL(LC.MinAmt,0) as MinimumAmountItem,
                            ISNULL(LC.MaxAmt,0) as MaximumAmountItem,SD.ProTypeID ,RC.ProductID ,'' as ProviderWalletID ,0 as ServiceType
                            FROM RouteConfiguration RC 
                            INNER JOIN  ServiceProviderDetail SD ON  SD.Id = RC.SerProDetailID  
                            INNER JOIN  ServiceProviderMaster SM ON SM.Id = SD.ServiceProID 
                            INNER JOIN TradePairMaster TM ON TM.id = RC.PairId
                            LEFT JOIN Limits LC ON LC.ID = RC.LimitID 
                            WHERE ({2} between LC.MinAmt and LC.MaxAmt OR RC.LimitID=0) AND SD.TrnTypeID = {1} AND RC.TrnType = {1}  AND  RC.OrderType = {0}  AND 
                            SD.Status = 1 AND RC.Status = 1 AND TM.Status=1 AND RC.PairId = {3} AND SD.AppTypeID = {4}  order by RC.priority", Request.OrderType, Request.trnType, Request.amount, Request.PairID,Request.LPType);
                //var list = Result.Cast<TransactionProviderResponse>().ToList();
                var list = new List<TransactionProviderResponse>(Result);
                return list;
                #endregion
                //return Result.ToList();
            }
            catch (Exception ex)
            {
                _log.LogError(ex, "MethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                throw ex;
            }
        }


        //Rita 5-6-19 for Arbitrage Fetch Liquidity Provider
        public async Task<List<TransactionProviderArbitrageResponse>> GetProviderDataListArbitrageAsync(TransactionApiConfigurationRequest Request)
        {
            try
            {               
                IQueryable<TransactionProviderArbitrageResponse> Result = _dbContext.TransactionProviderArbitrageResponse.FromSql(
                            @"select C.LPType,RC.ID as RouteID,rc.ordertype,RC.RouteName,SM.ID as ProviderID,SM.ProviderName,
                            SD.ID as SerProDetailID,SD.TrnTypeID as TrnType,C.LTP,SD.ProTypeID
                            FROM RouteConfigurationArbitrage RC 
                            INNER JOIN  ServiceProviderDetailArbitrage SD ON  SD.Id = RC.SerProDetailID  
                            INNER JOIN  ServiceProviderMasterArbitrage SM ON SM.Id = SD.ServiceProID 
                            INNER JOIN TradePairMasterArbitrage TM ON TM.id = RC.PairId
                            INNER JOIN cryptowatcherarbitrage C ON C.LPType = SD.AppTypeID and c.Pair=TM.PairName
                            WHERE SD.Status = 1 AND RC.Status = 1 AND TM.Status=1 AND RC.PairId = {0} 
							AND SD.TrnTypeID = {1} AND RC.TrnType = {1} AND C.LPType = {2}", Request.PairID, Request.trnType, Request.LPType);
                var list = new List<TransactionProviderArbitrageResponse>(Result);
                return list;
               
            }
            catch (Exception ex)
            {
                _log.LogError(ex, "MethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                throw ex;
            }
        }

        public async Task<List<TransactionProviderResponse>> GetProviderDataListAsync(TransactionApiConfigurationRequest Request)
        {
            try
            {
                #region old code
                //and {2} between RC.MinimumAmount and RC.MaximumAmount
                //and {2}  between SC.MinimumAmount and SC.MaximumAmount
                //IQueryable<TransactionProviderResponse> Result = _dbContext.TransactionProviderResponse.FromSql(
                //            @"select SC.ID as ServiceID,SC.ServiceName,Prc.ID as SerProDetailID,Prc.ServiceProID,RC.ID as RouteID,
                //            PC.ID as ProductID,RC.RouteName,SC.ServiceType,Prc.ThirPartyAPIID,Prc.AppTypeID,RC.MinimumAmount as MinimumAmountItem,
                //            RC.MaximumAmount as MaximumAmountItem,SC.MinimumAmount as MinimumAmountService,SC.MaximumAmount as MaximumAmountService
                //            from ServiceConfiguration SC inner join  ProductConfiguration PC on
                //   PC.ServiceID = SC.Id inner join RouteConfiguration RC on RC.ProductID = PC.Id  
                //   inner join ServiceProviderDetail PrC on Prc.ServiceProID = RC.SerProID AND Prc.TrnTypeID={1} 
                //   where SC.SMSCode = {0} and RC.TrnType={1} 
                //   and {2} between RC.MinimumAmount and RC.MaximumAmount
                //   and {3} between SC.MinimumAmount and SC.MaximumAmount
                //   and SC.Status = 1 and RC.Status = 1 and Prc.Status=1 
                //   order by RC.Priority", Request.SMSCode, Request.trnType, Request.amount,Request.amount);

                // ntrivedi limit changes done 12-10-2018
                //Rita 13-10-2018  remove as no present in New table Service master
                //,SC.MinimumAmount as MinimumAmountService,SC.MaximumAmount as MaximumAmountService
                //and {3} between SC.MinimumAmount and SC.MaximumAmount
                //Rita 17-10-18 further make inner joi in RoutMaster with SerProDetailID with providerdetail
                #endregion

                #region New Route configuration by khushali
                //var OrderType = 2;
                //IQueryable<TransactionProviderResponse> Result = _dbContext.TransactionProviderResponse.FromSql(
                //           @"select SM.ID as ServiceID,SM.ProviderName as ServiceName,SD.ID as SerProDetailID,SD.ServiceProID,RC.ID as RouteID,
                //            RC.RouteName,RC.OpCode,TP.APIBalURL,TP.APISendURL,TP.APIValidateURL,TP.ContentType,
                //            TP.MethodType,TP.ParsingDataID,SD.ThirPartyAPIID,SD.AppTypeID,LC.MinAmt as MinimumAmountItem,
                //            LC.MaxAmt as MaximumAmountItem,SD.ProTypeID FROM RouteConfiguration RC 
                //            INNER JOIN   ServiceProviderDetail SD ON  SD.Id = RC.SerProDetailID  
                //            INNER JOIN  ServiceProviderMaster SM ON SM.Id = SD.ServiceProID 
                //            INNER JOIN ThirdPartyAPIConfiguration TP ON TP.id = SD.ThirPartyAPIID
                //            INNER JOIN TradePairMaster TM ON TM.id = RC.PairId
                //            INNER JOIN Limits LC ON LC.ID = RC.LimitID 
                //            WHERE {2} between LC.MinAmt and LC.MaxAmt AND SD.TrnTypeID = {1} AND RC.TrnType = {1}  AND  RC.OrderType = {0}  AND 
                //            SD.Status = 1 AND RC.Status = 1 AND TM.Status=1  ORDER BY RC.Priority", OrderType, Request.trnType, Request.amount);

                //var list = new List<TransactionProviderResponse>(Result);
                //return list;
                #endregion

                IQueryable<TransactionProviderResponse> Result = _dbContext.TransactionProviderResponse.FromSql(
                           @"select SC.ID as ServiceID,SC.Name as ServiceName,Prc.ID as SerProDetailID,Prc.ServiceProID,RC.ID as RouteID,
                            PC.ID as ProductID,RC.RouteName,cast(SC.ServiceType as int) as ServiceType,Prc.ThirPartyAPIID,Prc.AppTypeID,LC.MinAmt as MinimumAmountItem,
                            LC.MaxAmt as MaximumAmountItem,RC.ProviderWalletID,RC.IsAdminApprovalRequired,RC.OpCode,cast(1  as bigint) as ProTypeID ,'' as APIBalURL,'' as APISendURL,'' as APIValidateURL,'' as ContentType,
                            '' as MethodType,0 as ParsingDataID,RC.AccNoStartsWith,RC.AccNoValidationRegex,RC.AccountNoLen
                            from ServiceMaster SC inner join  ProductConfiguration PC on
			                PC.ServiceID = SC.Id inner join RouteConfiguration RC on RC.ProductID = PC.Id  
			                inner join ServiceProviderDetail PrC on Prc.Id = RC.SerProDetailID AND Prc.TrnTypeID={1} 
							inner join Limits LC on LC.ID = RC.LimitID 
			                where SC.SMSCode = {0}  and RC.TrnType={1} 
			                and {2} between LC.MinAmt and LC.MaxAmt			                
			                and SC.Status = 1 and RC.Status = 1 and Prc.Status=1 
			                order by RC.Priority", Request.SMSCode, Request.trnType, Request.amount);
                //,RC.AccNoStartsWith,RC.AccNoValidationRegex,RC.AccountNoLen Added By Rushabh 23-03-2019 For Address Validation
                var list = new List<TransactionProviderResponse>(Result);
                return list;
                //return Result.ToList();
            }
            catch (Exception ex)
            {
                _log.LogError(ex, "MethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                throw ex;
            }
        }

        public async Task<List<TransactionProviderResponseForWithdraw>> GetProviderDataListAsyncForWithdraw(TransactionApiConfigurationRequest Request)
        {
            try
            {
                IQueryable<TransactionProviderResponseForWithdraw> Result = _dbContext.TransactionProviderResponseForWithdraw.FromSql(
                           @"select IsIntAmountAllow AS IsOnlyIntAmountAllow,SC.ID as ServiceID,SC.Name as ServiceName,Prc.ID as SerProDetailID,Prc.ServiceProID,RC.ID as RouteID,
                            PC.ID as ProductID,RC.RouteName,cast(SC.ServiceType as int) as ServiceType,Prc.ThirPartyAPIID,Prc.AppTypeID,LC.MinAmt as MinimumAmountItem,
                            LC.MaxAmt as MaximumAmountItem,RC.ProviderWalletID,RC.IsAdminApprovalRequired,RC.OpCode,cast(1  as bigint) as ProTypeID ,'' as APIBalURL,'' as APISendURL,'' as APIValidateURL,'' as ContentType,
                            '' as MethodType,0 as ParsingDataID,RC.AccNoStartsWith,RC.AccNoValidationRegex,RC.AccountNoLen
                            from ServiceMaster SC inner join  ProductConfiguration PC on
			                PC.ServiceID = SC.Id inner join RouteConfiguration RC on RC.ProductID = PC.Id  
			                inner join ServiceProviderDetail PrC on Prc.Id = RC.SerProDetailID AND Prc.TrnTypeID={1} 
							inner join Limits LC on LC.ID = RC.LimitID 
			                where SC.SMSCode = {0}  and RC.TrnType={1} 
			                and {2} between LC.MinAmt and LC.MaxAmt			                
			                and SC.Status = 1 and RC.Status = 1 and Prc.Status=1 
			                order by RC.Priority", Request.SMSCode, Request.trnType, Request.amount);
                var list = new List<TransactionProviderResponseForWithdraw>(Result);
                return list;
                //return Result.ToList();
            }
            catch (Exception ex)
            {
                _log.LogError(ex, "MethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                throw ex;
            }
        }

        public async Task<List<TransactionProviderResponse2>> GetProviderDataListForBalCheckAsyncV2(long SerProID,TransactionApiConfigurationRequest Request)
        {
            try
            {
                IQueryable<TransactionProviderResponse2> Result = _dbContext.TransactionProviderResponse2.FromSql(
                            @"select SC.ID as ServiceID,SC.Name as ServiceName,Prc.ID as SerProDetailID,Prc.ServiceProID,RC.ID as RouteID,RC.ConvertAmount,
                             PC.ID as ProductID,RC.RouteName,cast(SC.ServiceType as int) as ServiceType,Prc.ThirPartyAPIID,Prc.AppTypeID,LC.MinAmt as MinimumAmountItem,
                             LC.MaxAmt as MaximumAmountItem,RC.ProviderWalletID,RC.OpCode,cast(1  as bigint) as ProTypeID ,'' as APIBalURL,'' as APISendURL,'' as APIValidateURL,'' as ContentType,
                             '' as MethodType,0 as ParsingDataID,RC.AccNoStartsWith,RC.AccNoValidationRegex,RC.AccountNoLen,Am.Id as [AddressId],OriginalAddress as [Address],Am.GUID as RefKey 
                             from ServiceMaster SC inner join  ProductConfiguration PC on
			                 PC.ServiceID = SC.Id inner join RouteConfiguration RC on RC.ProductID = PC.Id  
			                 inner join ServiceProviderDetail PrC on Prc.Id = RC.SerProDetailID AND Prc.TrnTypeID IN (9,6)
							 inner join Limits LC on LC.ID = RC.LimitID 
                             left join AddressMasters AM on AM.SerProID = Prc.ServiceProID and AM.Status=1
                             left join WalletMasters wm on wm.id=am.WalletId  and wm.UserID = (select top 1 UserID from BizUserTypeMapping where UserType=0) and wm.isdefaultwallet=1 
                             left join WalletTypeMasters WTM on WTM.Id= wm.wallettypeid and SC.SMSCode=WTM.WalletTypeName 
			                 where Prc.ServiceProID = {0} AND (SC.SMSCode = {1} OR {1}='') and (RC.TrnType={2} OR {2}=0) 			                		                
			                 and SC.Status = 1 and RC.Status = 1 and Prc.Status=1 and (WTM.WalletTypeName={1} OR {1}='')                             
			                 order by RC.Priority", SerProID, Request.SMSCode, Request.trnType);                
                var list = new List<TransactionProviderResponse2>(Result);
                return list;
                //return Result.ToList();
            }
            catch (Exception ex)
            {
                _log.LogError(ex, "MethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                throw ex;
            }
        }

        public async Task<List<TransactionProviderResponse3>> GetProviderDataListForBalCheckAsync(long SerProID, TransactionApiConfigurationRequest Request)
        {
            try
            {
                IQueryable<TransactionProviderResponse3> Result = _dbContext.TransactionProviderResponse3.FromSql(
                            @"select SC.ID as ServiceID,SC.Name as ServiceName,Prc.ID as SerProDetailID,Prc.ServiceProID,RC.ID as RouteID,RC.ConvertAmount,
                             PC.ID as ProductID,RC.RouteName,cast(SC.ServiceType as int) as ServiceType,Prc.ThirPartyAPIID,Prc.AppTypeID,LC.MinAmt as MinimumAmountItem,
                             LC.MaxAmt as MaximumAmountItem,RC.ProviderWalletID,RC.OpCode,cast(1  as bigint) as ProTypeID ,'' as APIBalURL,'' as APISendURL,'' as APIValidateURL,'' as ContentType,
                             '' as MethodType,0 as ParsingDataID,RC.AccNoStartsWith,RC.AccNoValidationRegex,RC.AccountNoLen 
                             from ServiceMaster SC inner join  ProductConfiguration PC on
			                 PC.ServiceID = SC.Id inner join RouteConfiguration RC on RC.ProductID = PC.Id  
			                 inner join ServiceProviderDetail PrC on Prc.Id = RC.SerProDetailID AND Prc.TrnTypeID IN (9,6)
							 inner join Limits LC on LC.ID = RC.LimitID                              
			                 where Prc.ServiceProID = {0} AND (SC.SMSCode = {1} OR {1}='') and (RC.TrnType={2} OR {2}=0) 			                		                
			                 and SC.Status = 1 and RC.Status = 1 and Prc.Status=1                              
			                 order by RC.Priority", SerProID, Request.SMSCode, Request.trnType);
                var list = new List<TransactionProviderResponse3>(Result);
                return list;
                //return Result.ToList();
            }
            catch (Exception ex)
            {
                _log.LogError(ex, "MethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                throw ex;
            }
        }

        //public List<WalletServiceData> StatusCheck()
        //{
        //    try
        //    {               
        //        IQueryable<WalletServiceData> Result = _dbContext.WalletServiceData.FromSql(
        //                   @"SELECT SM.Id as ServiceID , SM.SMSCode,WM.Status AS WalletStatus , SM.Status AS ServiceStatus FROM WalletTypeMasters WM INNER JOIN ServiceMaster SM ON SM.WalletTypeID=WM.id WHERE WM.status = 1 and WM.IsDepositionAllow = 1");

        //        var list = new List<WalletServiceData>(Result);
        //        return list;                
        //    }
        //    catch (Exception ex)
        //    {
        //        _log.LogError(ex, "MethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
        //        throw ex;
        //    }
        //}

    }
}
