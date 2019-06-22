using CleanArchitecture.Core.ApiModels.Chat;
using CleanArchitecture.Core.Entities.User;
using CleanArchitecture.Core.Services.RadisDatabase;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Core.SignalR
{
    public class PresenceTracker
    {
        private static readonly Dictionary<string, int> onlineUsers = new Dictionary<string, int>();
        private RedisConnectionFactory _fact;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration Configuration;

        public PresenceTracker(RedisConnectionFactory Factory, UserManager<ApplicationUser> UserManager, IConfiguration configuration)
        {
            _fact = Factory;
            _userManager = UserManager;
            Configuration = configuration;
        }        

        public Task<ConnectionOpenedResult> ConnectionOpened(string Username,string ConnectionID)
        {
            var joined = false;
            var Blocked = false;
            var Redis = new RadisServices<USerDetail>(this._fact);
            ApplicationUser UserInfo = _userManager.FindByNameAsync(Username).GetAwaiter().GetResult();
            USerDetail User = new USerDetail()
            {
                UserName = Username,
                ConnectionID = ConnectionID
            };
            Redis.Db.SortedSetRemoveRangeByScoreAsync(Configuration.GetValue<string>("SignalRKey:RedisOnlineUserList"), UserInfo.Id, UserInfo.Id).Wait();
            Redis.SaveToSortedSetByID(Configuration.GetValue<string>("SignalRKey:RedisOnlineUserList"), User, UserInfo.Id);
            RedisValue[] byScore = Redis.GetSortedSetDataByScore(Configuration.GetValue<string>("SignalRKey:RedisBlockUserList"), UserInfo.Id, UserInfo.Id);
            if(byScore.Count() > 0)
            {
                Blocked = true;
            }
            //USerDetail user = byScore.CopyTo<USerDetail>();
            //lock (onlineUsers)
            //{
            //    if (onlineUsers.ContainsKey(userId))
            //    {
            //        onlineUsers[userId] += 1;
            //    }
            //    else
            //    {
            //        onlineUsers.Add(userId, 1);
            //        joined = true;
            //    }
            //}
            //byScore.

            return Task.FromResult(new ConnectionOpenedResult { UserJoined = joined , Blocked = Blocked });
        }

        public Task<ConnectionClosedResult> ConnectionClosed(string Username)
        {
            var left = false;
            //lock (onlineUsers)
            //{
            //    if (onlineUsers.ContainsKey(userId))
            //    {
            //        onlineUsers[userId] -= 1;
            //        if (onlineUsers[userId] <= 0)
            //        {
            //            onlineUsers.Remove(userId);
            //            left = true;
            //        }
            //    }
            //}
            var Redis = new RadisServices<USerDetail>(this._fact);
            USerDetail User = new USerDetail()
            {
                UserName = Username

            };
            Redis.RemoveSortedSetByID(Configuration.GetValue<string>("SignalRKey:RedisOnlineUserList"), User);            
            return Task.FromResult(new ConnectionClosedResult { UserLeft = left });
        }

        public Task<string[]> GetOnlineUsers()
        {
            lock (onlineUsers)
            {
                return Task.FromResult(onlineUsers.Keys.ToArray());
            }
        }
    }

    public class ConnectionOpenedResult
    {
        public bool UserJoined { get; set; }
        public bool Blocked { get; set; }
    }

    public class ConnectionClosedResult
    {
        public bool UserLeft { get; set; }
    }
}
