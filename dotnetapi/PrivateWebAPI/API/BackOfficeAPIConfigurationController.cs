using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Helpers;
using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Core.Interfaces.FeedConfiguration;
using CleanArchitecture.Core.ViewModels.APIConfiguration;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace CleanArchitecture.Web.API
{
    [Route("api/[controller]")]
    [ApiController]
    public class BackOfficeAPIConfigurationController : ControllerBase
    {
        private readonly ILogger<BackOfficeAPIConfigurationController> _logger;
        private readonly IBackOfficeAPIConfigService _BackOfficeAPIConfigService;
        private readonly IFrontTrnService _frontTrnService;

        public BackOfficeAPIConfigurationController(ILogger<BackOfficeAPIConfigurationController> logger, IBackOfficeAPIConfigService BackOfficeAPIConfigService,
            IFrontTrnService frontTrnService)
        {
            _logger = logger;
            _BackOfficeAPIConfigService = BackOfficeAPIConfigService;
            _frontTrnService = frontTrnService;
        }

        

        [HttpGet("ReloadSystemRestMethods")]
        public ActionResult ReloadSystemRestMethods()
        {
            try
            {
                _BackOfficeAPIConfigService.ReloadRestMethods();
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new BizResponseClass { ReturnCode = enResponseCode.InternalError, ReturnMsg = ex.ToString(), ErrorCode = enErrorCode.Status500InternalServerError });
            }
        }
        
    }
}