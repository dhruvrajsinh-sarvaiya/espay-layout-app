using CachingFramework.Redis;
using CleanArchitecture.Core.ApiModels.Chat;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Helpers;
using CleanArchitecture.Core.Services.RadisDatabase;
using CleanArchitecture.Infrastructure.DTOClasses;
using CleanArchitecture.Infrastructure.Interfaces;
using Microsoft.Extensions.Configuration;
using StackExchange.Redis;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Threading.Tasks;

namespace CleanArchitecture.Infrastructure.Services.Transaction
{
    public class ResdisTradingManagmentService:IResdisTradingManagment
    {
        private readonly IConfiguration Configuration;
        protected readonly RedisConnectionFactory ConnectionFactory;
        string ControllerName = "ResdisTradingManagmentService";

        public ResdisTradingManagmentService(IConfiguration configuration, RedisConnectionFactory connectionFactory)
        {          
            Configuration = configuration;
            ConnectionFactory = connectionFactory;
        }
        public async Task TransactionOrderCacheEntry(BizResponse _Resp, long TrnNo, long PairID,string PairName,decimal Price, decimal Qty, decimal RemainQty,short OrderType,string OrderSide,short IsAPITrade=0)
        {
            try
            {
                var Redis = new RadisServices<CacheOrderData>(ConnectionFactory);
               
                CacheOrderData CacheOrder = new CacheOrderData()
                {
                    IsProcessing = 1,
                    PairID = PairID,
                    Price = Price,
                    Qty = Qty,
                    RemainQty = RemainQty,
                    TrnNo = TrnNo,
                    OrderType = OrderType,
                    IsAPITrade = IsAPITrade
                };
               

                string RedisPath = GetMainPathKey(PairName, OrderSide);

                Redis.SaveWithOrigionalKey(RedisPath + TrnNo, CacheOrder, "");//without tag , Int value save as #name

                Redis.SaveToSortedSetByPrice(RedisPath + Configuration.GetValue<string>("TradingKeys:SortedSetName"), TrnNo.ToString(), Helpers.TradingPriceToRedis(Price));//without tag , Int value save as #name
                                               

                _Resp.ReturnCode = enResponseCodeService.Success;
                _Resp.ErrorCode = enErrorCode.TransactionInsertSuccess;
                _Resp.ReturnMsg = "Success";

            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("TransactionOrderCacheEntry Internal Error ##TrnNo:" + TrnNo, ControllerName, ex);
            }          
        }

        public async Task<BizResponse> MakeNewTransactionEntry(BizResponse _Resp)
        {
            try
            {                
                var Redis = new RadisServices<CacheOrderData>(ConnectionFactory);
                CacheOrderData CacheOrder = new CacheOrderData(){ IsProcessing=1,PairID= 10031001 ,Price = 0.000004520000000000M,
                                                                  Qty= 7021.690265490000000000M,RemainQty= 7021.690265490000000000M,TrnNo= 6587};


                string RedisPath = GetMainPathKey("ATCC_BTC", "Buy");

                Redis.SaveWithOrigionalKey(RedisPath + 6587, CacheOrder,"");              

            }
            catch(Exception ex)
            {
                HelperForLog.WriteErrorLog("MakeNewTransactionEntry Internal Error:##TrnNo " + 0, ControllerName, ex);
            }
            return _Resp;
        }
        public string GetMainPathKey(string PairName , string OrderSide)
        {
            string MainPathKay="";
            try
            {
                //string Pair = "ATCC_BTC:Buy:1000";
                //ParoStagingTrading:ATCC_BTC:Buy:

                PairName += ":";
                OrderSide += ":";
                MainPathKay = Configuration.GetValue<string>("TradingKeys:RedisClientName") + PairName + OrderSide;

            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("GetMainPathKey Internal Error:##PairName " + PairName + " OrderSide:" + OrderSide, ControllerName, ex);
            }
            return MainPathKay;

        }

    }
    public class CacheOrderData
    {
        public long TrnNo { get; set; }

        public long PairID { get; set; }

        [Range(0, 9999999999.999999999999999999), DataType(DataType.Currency)]
        [Column(TypeName = "decimal(28, 18)")]
        public decimal Price { get; set; }

        [Range(0, 9999999999.999999999999999999), DataType(DataType.Currency)]
        [Column(TypeName = "decimal(28, 18)")]
        public decimal Qty { get; set; }      

        [Range(0, 9999999999.999999999999999999), DataType(DataType.Currency)]
        [Column(TypeName = "decimal(28, 18)")]
        public decimal RemainQty { get; set; }

        public short OrderType { get; set; }

        public short IsProcessing { get; set; }

        public short IsAPITrade { get; set; } = 0;//Rita 30-1-19 API trading bit set to 1, rest all 0
    }
}
