﻿using CleanArchitecture.Core.Services;
using CleanArchitecture.Core.Services.Session;
using MediatR;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.SharedKernel
{
    public abstract class RedisSession
    {
        //private readonly IHttpContextAccessor _httpContextAccessor;
        //private ISession _session => _httpContextAccessor.HttpContext.Session;

      
        private List<INotification> _domainEvents;
        public List<INotification> DomainEvents => _domainEvents;
        public void AddRedisEvent( ISession _session, string key,object value,string EncyptedKey)
        {
            if (!string.IsNullOrEmpty(key) && value != null)
            {
                if (!_session.IsAvailable)
                    _session.LoadAsync();
                if (value != null)
                {
                    string Data = JsonConvert.SerializeObject(value);
                    if (!string.IsNullOrEmpty(EncyptedKey))
                        Data = SessionDataEncyptedDecrypted.Encrypt(Data, EncyptedKey);


                    _session.SetString(key, Data);
                    _session.CommitAsync();
                }
            }



            //_domainEvents = _domainEvents ?? new List<INotification>();
            //_domainEvents.Add(eventItem);
        }

        public void RemoveRedisEvent(INotification eventItem)
        {
            if (_domainEvents is null) return;
            _domainEvents.Remove(eventItem);
        }

        public T GetRedisEvent<T>(ISession _session, string key, string EncyptedKey)
        {
            try
            {
                string data = _session.GetString(key);

                if (data != null)
                {
                    if (!string.IsNullOrEmpty(EncyptedKey))
                        data = SessionDataEncyptedDecrypted.Decrypt(data, EncyptedKey);
                }

                return data == null ? default(T) : JsonConvert.DeserializeObject<T>(data);

            }
            catch (Exception ex)
            {

                throw;
            }

        }



    }
}

