﻿using CleanArchitecture.Core.Entities.MarginEntitiesWallet;
using CleanArchitecture.Core.Entities.Wallet;
using CleanArchitecture.Core.Helpers;
using CleanArchitecture.Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Infrastructure
{
    public class WalletTQRepository : IWalletTQInsert
    {

        private readonly CleanArchitectureContext _dbContext;
               

        public WalletTQRepository(CleanArchitectureContext dbContext)
        {          
            _dbContext = dbContext;
        }

        public WalletTransactionQueue AddIntoWalletTransactionQueue(WalletTransactionQueue wtq, byte AddorUpdate)//1=add,2=update
        {
            try
            {
                //WalletTransactionQueue w = new WalletTransactionQueue();
                if (AddorUpdate == 1)
                {
                    _dbContext.WalletTransactionQueues.Add(wtq);
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
        public ArbitrageWalletTransactionQueue AddIntoArbitrageWalletTransactionQueue(ArbitrageWalletTransactionQueue wtq, byte AddorUpdate)//1=add,2=update
        {
            try
            {
                //WalletTransactionQueue w = new WalletTransactionQueue();
                if (AddorUpdate == 1)
                {
                    _dbContext.ArbitrageWalletTransactionQueue.Add(wtq);
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
