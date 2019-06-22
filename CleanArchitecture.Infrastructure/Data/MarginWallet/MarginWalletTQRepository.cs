using CleanArchitecture.Core.Entities.MarginEntitiesWallet;
using CleanArchitecture.Core.Helpers;
using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Core.Interfaces.MarginWallet;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Infrastructure
{
    public class MarginWalletTQRepository : IMarginWalletTQInsert
    {

        private readonly CleanArchitectureContext _dbContext;


        public MarginWalletTQRepository(CleanArchitectureContext dbContext)
        {
            _dbContext = dbContext;
        }

        public MarginWalletTransactionQueue AddIntoWalletTransactionQueue(MarginWalletTransactionQueue wtq, byte AddorUpdate)//1=add,2=update
        {
            try
            {
                //WalletTransactionQueue w = new WalletTransactionQueue();
                if (AddorUpdate == 1)
                {
                    _dbContext.MarginWalletTransactionQueue.Add(wtq);
                }
                else
                {
                    _dbContext.Entry(wtq).State = EntityState.Modified;
                }
                _dbContext.SaveChanges();
                return wtq;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }

        }
    }
}
