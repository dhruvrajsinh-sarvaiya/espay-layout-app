﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Helpers;
using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Core.SharedKernel;
using CleanArchitecture.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CleanArchitecture.Infrastructure.Data
{
    public class EFCommonRepository<T> : ICommonRepository<T> where T : BizBase
    {
        private readonly CleanArchitectureContext _dbContext;

        readonly ILogger<EFCommonRepository<T>> _log;

        public EFCommonRepository(ILogger<EFCommonRepository<T>> log, CleanArchitectureContext dbContext)
        {
            _log = log;
            //vsolanki 8-10-2018 
            _dbContext = dbContext;
        }

        public T GetById(long id)
        {
            try
            {
                return _dbContext.Set<T>().SingleOrDefault(e => e.Id == id);
            }
            catch (Exception ex)
            {
                _log.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                throw ex;
            }
        }
        public async Task<T> GetByIdAsync(long id)
        {
            try
            {
                return await _dbContext.Set<T>().SingleOrDefaultAsync(e => e.Id == id);
            }
            catch (Exception ex)
            {
                _log.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                throw ex;
            }
        }
        public T GetActiveById(long id)
        {
            try
            {
                return _dbContext.Set<T>().SingleOrDefault(e => e.Id == id && e.Status == Convert.ToInt16(ServiceStatus.Active));
            }
            catch (Exception ex)
            {
                _log.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                throw ex;
            }
        }
        public List<T> List()
        {
            try
            {
                return _dbContext.Set<T>().Where(e => e.Status == Convert.ToInt16(ServiceStatus.Active) || e.Status == Convert.ToInt16(ServiceStatus.InActive)).ToList();
            }
            catch (Exception ex)
            {
                _log.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                throw ex;
            }
        }
        public List<T> GetAllList()
        {
            try
            {
                return _dbContext.Set<T>().ToList();
            }
            catch (Exception ex)
            {
                _log.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                throw ex;
            }
        }
        public T Add(T entity)
        {
            try
            {
                entity.CreatedDate = Helpers.UTC_To_IST();//Rita 3-11-2018 no need to set at all type
                _dbContext.Set<T>().Add(entity);
                _dbContext.SaveChanges();

                return entity;
            }
            catch (Exception ex)
            {
                _log.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                throw ex;
            }
        }
        public async Task<T> AddAsync(T entity)
        {
            try
            {
                entity.CreatedDate = Helpers.UTC_To_IST();// no need to set at all type
                await _dbContext.Set<T>().AddAsync(entity);
                await _dbContext.SaveChangesAsync();
               // await entity;
                return entity;
            }
            catch (Exception ex)
            {
                _log.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                throw ex;
            }
        }
        public void Delete(T entity)
        {
            try
            {
                _dbContext.Set<T>().Remove(entity);
                _dbContext.SaveChanges();
            }
            catch (Exception ex)
            {
                _log.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                throw ex;
            }
        }

        public void Update(T entity)
        {
            try
            {
                entity.UpdatedDate = Helpers.UTC_To_IST();//Rita 3-11-2018 no need to set at all type
                _dbContext.Entry(entity).State = EntityState.Modified;               
                _dbContext.SaveChanges();
            }
            catch (Exception ex)
            {
                _log.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                throw ex;
            }
        }
        public void UpdateWithAuditLog(T entity)
        {
            try
            {
                entity.UpdatedDate = Helpers.UTC_To_IST();//Rita 3-11-2018 no need to set at all type
                entity.UpdatedBy=(entity.UpdatedBy == null) ? 1 : entity.UpdatedBy;
                _dbContext.Entry(entity).State = EntityState.Modified;
                _dbContext.InsertAuditLog();//vsolanki 2018-11-29
                _dbContext.SaveChanges();
            }
            catch (Exception ex)
            {
                _log.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                throw ex;
            }
        }
        public async Task UpdateAsync(T entity)
        {
            try
            {
                entity.UpdatedDate = Helpers.UTC_To_IST();//Rita 3-11-2018 no need to set at all type
                _dbContext.Entry(entity).State = EntityState.Modified;
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _log.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                throw ex;
            }
        }
        public void UpdateField(T entity, params Expression<Func<T, object>>[] properties)//Rita 19-12-18 adde for some fields change only
        {
            entity.UpdatedDate = Helpers.UTC_To_IST();
            var entry = _dbContext.Entry(entity);
            _dbContext.Set<T>().Attach(entity);
            
            entry.Property(p => p.UpdatedDate).IsModified = true;//rita 10-1-19 for update date also
            foreach (var property in properties)
                entry.Property(property).IsModified = true;


            _dbContext.SaveChanges();
        }
        public async Task UpdateFieldAsync(T entity, params Expression<Func<T, object>>[] properties)// where T : class//Rita 19-12-18 adde for some fields change only
        {
           entity.UpdatedDate = Helpers.UTC_To_IST();
            var entry = _dbContext.Entry(entity);
            _dbContext.Set<T>().Attach(entity);

            entry.Property(p => p.UpdatedDate).IsModified = true;//rita 10-1-19 for update date also
            foreach (var property in properties)
                entry.Property(property).IsModified = true;

            await _dbContext.SaveChangesAsync();
        }

        public T AddProduct(T entity)
        {
            try
            {
                _dbContext.Set<T>().Add(entity);
                _dbContext.SaveChanges();

                return entity;
            }
            catch (Exception ex)
            {
                _log.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                throw ex;
            }
        }
        public virtual IEnumerable<T> GetAll()
        {
            return _dbContext.Set<T>().AsEnumerable();
        }

        public virtual async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _dbContext.Set<T>().ToListAsync();
        }
        public virtual IEnumerable<T> AllIncluding(params Expression<Func<T, object>>[] includeProperties)
        {
            IQueryable<T> query = _dbContext.Set<T>();
            foreach (var includeProperty in includeProperties)
            {
                query = query.Include(includeProperty);
            }
            return query.AsEnumerable();
        }

        public virtual async Task<IEnumerable<T>> AllIncludingAsync(params Expression<Func<T, object>>[] includeProperties)
        {
            IQueryable<T> query = _dbContext.Set<T>();
            foreach (var includeProperty in includeProperties)
            {
                query = query.Include(includeProperty);
            }
            return await query.ToListAsync();
        }
        public T GetSingle(int id)
        {
            return _dbContext.Set<T>().FirstOrDefault(x => x.Id == id);
        }

        public T GetSingle(Expression<Func<T, bool>> predicate)
        {
            return _dbContext.Set<T>().FirstOrDefault(predicate);
        }

        public T GetSingle(Expression<Func<T, bool>> predicate, params Expression<Func<T, object>>[] includeProperties)
        {
            IQueryable<T> query = _dbContext.Set<T>();
            foreach (var includeProperty in includeProperties)
            {
                query = query.Include(includeProperty);
            }

            return query.Where(predicate).FirstOrDefault();
        }

        public async Task<T> GetSingleAsync(Expression<Func<T, bool>> predicate, params Expression<Func<T, object>>[] includeProperties)
        {
            IQueryable<T> query = _dbContext.Set<T>();
            foreach (var includeProperty in includeProperties)
            {
                query = query.Include(includeProperty);
            }

            return await query.Where(predicate).FirstOrDefaultAsync();
        }

        //public async Task<T> GetSingleAsync(int id)
        //{
        //    return await _dbContext.Set<T>().FirstOrDefaultAsync(e => e.Id == id);
        //}
        public async Task<T> GetSingleAsync(Expression<Func<T, bool>> predicate)
        {
            return await _dbContext.Set<T>().FirstOrDefaultAsync(predicate);
        }
        public virtual IEnumerable<T> FindBy(Expression<Func<T, bool>> predicate)
        {
            return _dbContext.Set<T>().Where(predicate);
        }

        public virtual async Task<IEnumerable<T>> FindByAsync(Expression<Func<T, bool>> predicate)
        {
            return await _dbContext.Set<T>().Where(predicate).ToListAsync();
        }

        public decimal GetSum(Expression<Func<T, bool>> predicate, Expression<Func<T, decimal>> sumPredicate)
        {
            decimal sum = _dbContext.Set<T>().Where(predicate).Sum(sumPredicate);
            return sum;
        }
        public async Task<decimal> GetSumAsync(Expression<Func<T, bool>> predicate, Expression<Func<T, decimal>> sumPredicate)
        {
            decimal sum = await _dbContext.Set<T>().Where(predicate).SumAsync(sumPredicate);
            return sum;
        }
        public void ReloadEntity(T entity)
        {
            try
            {
                _dbContext.Entry(entity).Reload();
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
            }
        }
        public T GetForceSingle(Expression<Func<T, bool>> predicate)
        {
            return _dbContext.Set<T>().SingleOrDefault(predicate);
        }
        public async Task<T> GetForceSingleAsync(Expression<Func<T, bool>> predicate)
        {
            return await _dbContext.Set<T>().SingleOrDefaultAsync(predicate);
        }
    }
}
