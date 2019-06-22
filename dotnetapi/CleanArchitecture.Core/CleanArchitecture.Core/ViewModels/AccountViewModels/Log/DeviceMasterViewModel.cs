﻿using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.ViewModels.Configuration;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.AccountViewModels.Log
{
   public class DeviceMasterViewModel
    {
        public long Id { get; set; }
        [Required]
        public int UserId { get; set; }
        [Required]
        [StringLength(250)]
        public string Device { get; set; }

        [Required]
        [StringLength(250)]
        public string DeviceOS { get; set; }

        [Required]
        [StringLength(250)]
        public string DeviceId { get; set; }

        public bool IsEnable { get; set; }
        public bool IsDeleted { get; set; }
        [DataType(DataType.DateTime)]
        public DateTime CreatedDate { get; set; }

        public long CreatedBy { get; set; }

        public long? UpdatedBy { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime? UpdatedDate { get; set; }//rita 29-10-2018 change in bizbase so need to change here for converting error in : DeviceIdService

        public short Status { get; set; }
    }

    public class DeviceIdReqViewModel : TrackerViewModel
    {        
        [Required(ErrorMessage = "1,User selected deviceID not found,4055")]
        [StringLength(250, ErrorMessage = "1,User selected deviceID not valid,4056")]
        public string SelectedDeviceId { get; set; }
    }

    public class DeviceIdDetReqViewModel : TrackerViewModel
    {
        [Required(ErrorMessage = "1,User selected deviceID not found,4055")]
        //[StringLength(250, ErrorMessage = "1,User selected deviceID not valid,4056")]
        public long SelectedDeviceId { get; set; }
    }

    public class DeviceIdResponse : BizResponseClass
    {
        public int TotalCount { get; set; }
        public List<GetDeviceData> DeviceList { get; set; }

    }

    public class GetDeviceData
    {
        public long Id { get; set; }
        //[Required]
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string Device { get; set; }
        public string DeviceOS { get; set; }
        public string DeviceId { get; set; }
        public bool IsEnable { get; set; }
        public bool IsDeleted { get; set; }
        [DataType(DataType.DateTime)]
        public DateTime CreatedDate { get; set; }
        //public long CreatedBy { get; set; }
        //public long? UpdatedBy { get; set; }
        [DataType(DataType.DateTime)]
        public DateTime? UpdatedDate { get; set; }
        //public short Status { get; set; }
    }


    public class DeviceMasterViewModelV1
    {
        public long ID { get; set; }

        [Required]
        public int UserId { get; set; }
        [Required]
        [StringLength(250)]
        public string Device { get; set; }

        [Required]
        [StringLength(250)]
        public string DeviceOS { get; set; }

        [Required]
        [StringLength(250)]
        public string DeviceId { get; set; }

        public Guid AuthorizeToken { get; set; }
        public Guid Guid { get; set; }
        public string Location { get; set; }
        public string IPAddress { get; set; }
        public DateTime Expirytime { get; set; }
        public short Status { get; set; }
    }
}
