using CleanArchitecture.Core.Entities.Log;
using CleanArchitecture.Core.Helpers;
using CleanArchitecture.Core.Interfaces.Log;
using CleanArchitecture.Core.Interfaces.Repository;
using CleanArchitecture.Core.ViewModels.AccountViewModels.Log;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Infrastructure.Services.Log
{
    public class IpHistoryService : IipHistory
    {
        private readonly ICustomRepository<IpHistory> _ipHistoryRepository;
        private readonly CleanArchitectureContext _dbContext;

        public IpHistoryService(ICustomRepository<IpHistory> ipHistoryRepository, CleanArchitectureContext dbContext)
        {
            _dbContext = dbContext;
            _ipHistoryRepository = ipHistoryRepository;
        }

        public long AddIpHistory(IpHistoryViewModel model)
        {
            try
            {
                var IpHistory = new IpHistory()
                {
                    UserId = model.UserId,
                    IpAddress = model.IpAddress,
                    CreatedDate = DateTime.UtcNow,
                    CreatedBy = model.UserId,
                    Status = 0,
                    Location = model.Location
                };
                _ipHistoryRepository.Insert(IpHistory);
                return IpHistory.Id;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return 0;
            }
        }

        // Changed by khushali 03-05-2019 for optimization and clean up
        public IpHistoryResponse GetIpHistoryListByUserId(long UserId, int pageIndex, int pageSize, string IPAddress = null, DateTime? FromDate = null, DateTime? ToDate = null)
        {
            try
            {
                var IpHistoryList = _ipHistoryRepository.Table.Where(i => i.UserId == UserId).OrderByDescending(i => i.CreatedDate).ToList();
                if (IpHistoryList == null)
                {
                    return null;
                }

                
                //return IpList;
                if (!string.IsNullOrEmpty(IPAddress))
                {
                    IpHistoryList = IpHistoryList.Where(x => x.IpAddress == IPAddress).ToList();
                }
                if (FromDate != null && ToDate != null)
                {
                    IpHistoryList = IpHistoryList.Where(x => x.CreatedDate.Date >= FromDate && x.CreatedDate.Date <= ToDate).ToList();
                }

                var total = IpHistoryList.Count();
                //var pageSize = 10; // set your page size, which is number of records per page

                //var page = 1; // set current page number, must be >= 1
                //if (pageIndex == 0)
                //{
                //    pageIndex = 1;
                //}

                if (pageSize == 0)
                {
                    pageSize = 10;
                }

                var skip = pageSize * (pageIndex);

                //var canPage = skip < total;

                //if (canPage) // do what you wish if you can page no further
                //    return null;
                IpHistoryList = IpHistoryList.Skip(skip).Take(pageSize).ToList();  // khuhsali 03-05-2019 optimization
                var IpList = new List<IpHistoryDataViewModel>();
                foreach (var item in IpHistoryList)
                {
                    IpHistoryDataViewModel model = new IpHistoryDataViewModel();
                    model.IpAddress = item.IpAddress;
                    model.Location = item.Location;
                    model.Date = item.CreatedDate;
                    IpList.Add(model);
                }

                IpHistoryResponse ipHistoryResponse = new IpHistoryResponse()
                {
                    IpHistoryList = IpList,
                    Totalcount= total
                };
                return ipHistoryResponse;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return null;
            }
        }

        public bool IsIpHistoryExist(int UserId,string IPAddress)
        {
            var responsedata = _dbContext.IpHistory.Any(x=>x.UserId== UserId && x.IpAddress== IPAddress);
            return responsedata;
        }

        public bool IsIpHistoryExistV1(int UserId, string IPAddress)
        {
            var responsedata = _dbContext.IpHistory.Any(x => x.UserId == UserId && x.IpAddress == IPAddress && x.Status==1);
            return responsedata;
        }

    }
}
