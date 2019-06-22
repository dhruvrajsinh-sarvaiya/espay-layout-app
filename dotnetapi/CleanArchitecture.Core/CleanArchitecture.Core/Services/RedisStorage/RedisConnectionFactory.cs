﻿using CleanArchitecture.Core.Helpers;
using Microsoft.Extensions.Options;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.Services.RadisDatabase
{
  //public  class RedisConnectionFactory  : IRedisConnectionFactory
  public  class RedisConnectionFactory
    {
        //private readonly IOptions<RedisConfiguration> redis;//komal 03 May 2019, Cleanup
        private readonly Lazy<ConnectionMultiplexer> _connection;


        public RedisConnectionFactory(IOptions<RedisConfiguration> redis)
        {
            try
            {
                if (redis != null && !string.IsNullOrEmpty(redis.Value.Host))
                {
                    ConfigurationOptions option = new ConfigurationOptions
                    {
                        AbortOnConnectFail = false,
                        EndPoints = { redis.Value.Host }
                    };
                    //this._connection = new Lazy<ConnectionMultiplexer>(() => ConnectionMultiplexer.Connect(redis.Value.Host));
                    this._connection = new Lazy<ConnectionMultiplexer>(() => ConnectionMultiplexer.Connect(option));
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
            }
        }

        public ConnectionMultiplexer Connection()
        {
            try
            {
                return this._connection.Value;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return null;
            }
        }
    }

    public class SqlConnectionFactory
    {
        //private readonly IOptions<sqlConfiguration> redis;//komal 03 May 2019, Cleanup
        private readonly string _connection;

        public SqlConnectionFactory(IOptions<sqlConfiguration> redis)
        {
            if (redis != null && !string.IsNullOrEmpty(redis.Value.SqlServerConnectionString))
            {
                this._connection = redis.Value.SqlServerConnectionString;
            }
        }

        public string Connection()
        {
            return this._connection;
        }
    }

    public class sqlConfiguration
    {
        public string SqlServerConnectionString { get; set; }
         
    }
}
