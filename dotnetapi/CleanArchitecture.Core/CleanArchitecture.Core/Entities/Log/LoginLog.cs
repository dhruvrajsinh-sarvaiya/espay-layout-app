﻿using CleanArchitecture.Core.Entities.Modes;
using CleanArchitecture.Core.Events.Log;
using CleanArchitecture.Core.SharedKernel;
using System;
using System.ComponentModel.DataAnnotations;

namespace CleanArchitecture.Core.Entities.Log
{
    public class LoginLog : BaseEntity
    {
        public int UserId { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime StartTime { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime EndTime { get; set; }

        [Required]
        [StringLength(15)]
        public string IPAddress { get; set; }

        [Required]
        [StringLength(20)]
        public string DeviceID { get; set; }

        public Mode Mode { get; set; }

        public int HostId { get; set; }


        public void EndTimeUpdated()
        {   
            Events.Add(new LogTimeUpdateEvent<LoginLog>(this));
        }

    }


}
