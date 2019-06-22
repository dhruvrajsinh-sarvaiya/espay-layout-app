using MediatR;

namespace CleanArchitecture.Core.ViewModels.APIConfiguration
{
    public class APIReqResStatisticsViewModel
    {
        //public string MethodName { get; set; }
        //public long IPId { get; set; }
        public long UserID { get; set; }
        //public long SuccessCount { get; set; }
        //public long FaliureCount { get; set; }
        //public DateTime CreatedDate { get; set; }
       // public long CreatedBy { get; set; }
        //public long? UpdatedBy { get; set; }
      //  public DateTime? UpdatedDate { get; set; }
        public short Status { get; set; }
    //}
    //public class PublicAPIReqResLogViewModel
    //{
        //public long MethodID { get; set; }
        public string Path { get; set; } 
        public string MethodType { get; set; }
        public long HTTPErrorCode { get; set; }
        public long HTTPStatusCode { get; set; }
        public string Mode { get; set; } // - web , app
        public string Device { get; set; } //  browser name . device name 
        public string Host { get; set; } //  full url
        public string IPAddress { get; set; } //  ip address  - null
        public short WhitelistIP { get; set; } //
//public DateTime CreatedDate { get; set; }
       // public long CreatedBy { get; set; } - userid
       // public long? UpdatedBy { get; set; } - userid
       // public DateTime? UpdatedDate { get; set; }
        //public short Status { get; set; }
    }

    public class APIStatistics : IRequest
    {
        public long UserID { get; set; }
        public short IsSuccessFaliure { get; set; }
        public string Path { get; set; }
        public string MethodType { get; set; }
        public long HTTPErrorCode { get; set; }
        public long HTTPStatusCode { get; set; }
        public string Mode { get; set; } // - web , app
        public string Device { get; set; } //  browser name . device name 
        public string Host { get; set; } //  full url
        public string IPAddress { get; set; } //  ip address  - null
        public short WhitelistIP { get; set; } 
    }
}
