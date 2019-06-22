using CleanArchitecture.Infrastructure.DTOClasses;
using System.Threading.Tasks;

namespace CleanArchitecture.Infrastructure.Interfaces
{
    public interface IResdisTradingManagment
    {
        Task TransactionOrderCacheEntry(BizResponse _Resp, long TrnNo, long PairID, string PairName, decimal Price, decimal Qty, decimal RemainQty, short OrderType, string OrderSide, short IsAPITrade = 0);
        Task<BizResponse> MakeNewTransactionEntry(BizResponse _Resp);
    }
}
