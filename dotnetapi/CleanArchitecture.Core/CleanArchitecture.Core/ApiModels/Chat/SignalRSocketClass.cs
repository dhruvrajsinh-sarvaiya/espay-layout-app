using CleanArchitecture.Core.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace CleanArchitecture.Core.ApiModels.Chat
{
    public class ConnetedClientList
    {
        public string ConnectionId { get; set; }
    }

    public class ConnetedUserDetail
    {
        public string UserName { get; set; }
    }

    public class ConnetedClientToken
    {
        public string Token { get; set; }
    }

    public class BlockUserDetail
    {
        public bool IsBlock { get; set; } = false;
    }

    public class ChatHistory
    {
        public string Message { get; set; }
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Time { get; set; }
    }

    public class ActivityNotificationMessage
    {
        //public string Msg { get; set; }
        public int MsgCode { get; set; }
        public string Param1 { get; set; }
        public string Param2 { get; set; }
        public string Param3 { get; set; }
        public string Param4 { get; set; }
        public string Param5 { get; set; }
        public string Param6 { get; set; }
        public short Type
        {
            get;set;
        }
    }

    public class CommunicationParamater
    {
        public string Param1 { get; set; }
        public string Param2 { get; set; }
        public string Param3 { get; set; }
        public string Param4 { get; set; }
        public string Param5 { get; set; }
        public string Param6 { get; set; }
        public string Param7 { get; set; }
        public string Param8 { get; set; }
        public string Param9 { get; set; }
        public string Param10 { get; set; }
        public string Param11 { get; set; }
        public string Param12 { get; set; }
        public string Param13 { get; set; }
        public string Param14 { get; set; }
        public string Param15 { get; set; }
    }

    public class USerDetail
    {
        //public long UserID { get; set; }
        public string UserName { get; set; }
        public string Reason { get; set; }
        public string ConnectionID { get; set; }
    }

    public class OrderBookDetail
    {
        [Range(0, 9999999999.999999999999999999), Column(TypeName = "decimal(28, 18)")]
        public Decimal Amount { get; set; }
        [Range(0, 9999999999.999999999999999999), Column(TypeName = "decimal(28, 18)")]
        public Decimal Price { get; set; }
        public Guid OrderId { get; set; }
        public int RecordCount { get; set; }
        public short IsStopLimit { get; set; }
    }
}
