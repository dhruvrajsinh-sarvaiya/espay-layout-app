﻿using System;
using System.Collections.Generic;
using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Infrastructure.Data;
using CleanArchitecture.Web.Extensions;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Swashbuckle.AspNetCore.Swagger;
using StructureMap;
using CleanArchitecture.Core.SharedKernel;
using CleanArchitecture.Core.Interfaces.Repository;
using CleanArchitecture.Infrastructure.Services.Repository;
using CleanArchitecture.Infrastructure.Data.Transaction;
using CleanArchitecture.Infrastructure.Interfaces;
using CleanArchitecture.Infrastructure.Services;
using CleanArchitecture.Core.Interfaces.Configuration;
using CleanArchitecture.Infrastructure.Services.Configuration;
using CleanArchitecture.Infrastructure.Services.Transaction;
using CleanArchitecture.Core.Services.RadisDatabase;
using CleanArchitecture.Core.Services.Session;
using CleanArchitecture.Core.SignalR;
using Newtonsoft.Json.Serialization;
using CleanArchitecture.Infrastructure.DTOClasses;
using CleanArchitecture.Web.BackgroundTask;
using CleanArchitecture.Infrastructure.Data.Configuration;
using CleanArchitecture.Infrastructure.BGTask;
using CleanArchitecture.Core.ViewModels;
using CleanArchitecture.Infrastructure.Services.Wallet;
using CleanArchitecture.Infrastructure.Services.Organization;
using CleanArchitecture.Infrastructure;
using CleanArchitecture.Web.Filters;
using CleanArchitecture.Core.Interfaces.FeedConfiguration;
using CleanArchitecture.Core.Interfaces.Referral;
using CleanArchitecture.Infrastructure.Services.Referral;
using CleanArchitecture.Core.Interfaces.RoleManagement;
using CleanArchitecture.Infrastructure.Data.RoleManagement;
using CleanArchitecture.Infrastructure.Services.BackOffice;
using CleanArchitecture.Core.Interfaces.BackOffice;
using CleanArchitecture.Infrastructure.Services.BackOffice.RoleManagement;
using Microsoft.AspNetCore.Identity;
using CleanArchitecture.Core.Entities.User;
using CleanArchitecture.Infrastructure.Services.MarginWalletServices;
using CleanArchitecture.Core.Interfaces.MarginWallet;
using CleanArchitecture.Core.Entities.Backoffice.RoleManagement;
using CleanArchitecture.Core.Interfaces.Log;
using CleanArchitecture.Infrastructure.Services.Log;
using CleanArchitecture.Core.Entities.GroupModuleManagement;
using CleanArchitecture.Infrastructure.LiquidityProvider;
using CleanArchitecture.Core.Interfaces.LiquidityProvider;
using CleanArchitecture.Infrastructure.Data.LPWallet;
using System.Linq;

namespace CleanArchitecture.Web
{
    public class Startup
    {

        // Order or run
        //1) Constructor
        //2) Configure services
        //3) Configure
        private IHostingEnvironment HostingEnvironment { get; }
        public static IConfiguration Configuration { get; set; }

        public Startup(IConfiguration configuration, IHostingEnvironment env)
        {
            HostingEnvironment = env;
            Configuration = configuration;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public IServiceProvider ConfigureServices(IServiceCollection services)
        {
            // Commented for req-res time issue. -Nishit Jani on A 2019-01-10 5:19 PM
            //services.Configure<CookiePolicyOptions>(options =>
            //{
            //    // This lambda determines whether user consent for non-essential cookies is needed for a given request.
            //    options.CheckConsentNeeded = context => false;
            //    options.MinimumSameSitePolicy = SameSiteMode.None;
            //});

            //services.AddCors(o => o.AddPolicy("CorsPolicy", builder =>
            //{
            //    builder
            //        .AllowAnyMethod()
            //        .AllowAnyHeader()                    
            //        .WithOrigins("http://192.168.2.10:60029");
            //}));

            services.AddCors(o => o.AddPolicy("CorsPolicy", builder =>
            {
                builder.AllowAnyOrigin()
                     .AllowAnyHeader()
                     .WithMethods("GET", "POST", "DELETE", "PUT")
                     .AllowCredentials();
            }));

            // Removed as not working with postman. User restricted from site source but allowd from Postman. -Nishit Jani on A 2019/06/18 5:20 PM
            //// To restrict with source orgin of request. -Nishit Jani on A 2019/06/18 12:38 PM
            //services.AddCors(o => o.AddPolicy("MyCorsPolicy", builder =>
            //{
            //    builder.WithOrigins(Configuration.GetValue<string>("CorsOrigins")
            //    .Split(",", StringSplitOptions.RemoveEmptyEntries)
            //    .ToArray())
            //     .AllowAnyHeader()
            //     .WithMethods("GET", "POST", "DELETE", "PUT")
            //     .AllowCredentials();
            //}));

            //// Globally apply filter on every controller through  service. -Nishit Jani on A 2019/06/18 12:55 PM
            //services.AddCorsPolicyGlobal();

            //define Redis Configuration
            services.Configure<RedisConfiguration>(Configuration.GetSection("redis"));
            services.Configure<sqlConfiguration>(Configuration.GetSection("Data"));

            // Commented for req-res time issue. -Nishit Jani on A 2019-01-10 5:19 PM
            //UnCommented  -Nishit Jani on A 2019-01-11 11:10 AM
            //services.AddSession();
            services.AddDistributedRedisCache(options =>
            {
                options.Configuration = Configuration.GetValue<string>("redis:host");
                options.InstanceName = "master";
            });
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            services.AddSingleton<RedisSessionStorage>();
           
            ////debugging environment
            // Removed as not required. -Nishit Jani on A 2019-02-06 6:00 PM
            //services.AddPreRenderDebugging(HostingEnvironment);

            // Removed as not required. -Nishit Jani on A 2019-02-07 11:59 AM
            //services.AddOptions();

            //// Reponse compression
            // Removed as not required. -Nishit Jani on A 2019-02-06 6:00 PM
            services.AddResponseCompression();

            //// dtabase connection
            services.AddCustomDbContext();

            //// custom token
            services.AddCustomIdentity(Configuration);
            //// OpenIddict
            services.AddCustomOpenIddict(HostingEnvironment);

            // Store memory Cache
            // Commented for req-res time issue. -Nishit Jani on A 2019-01-10 5:19 PM
            //services.AddMemoryCache();

            //// Depedenecy injection
            services.RegisterCustomServices();

            // Localization Cluture wise lanaguage
            // Commented for req-res time issue. -Nishit Jani on A 2019-01-10 5:19 PM
            //services.AddCustomLocalization();

            // MVC Model filter validataion
            // Removed as not required. There is no view here. -Nishit Jani on A 2019-02-07 12:01 AM
            //services.AddCustomizedMvc();

            //SignalR
            //services.AddSignalR().AddMessagePackProtocol();

            //komal 7-May-2019  Make Dynamic SignalR Case 
            if (Configuration["AzureSignalR"] == "True")
            {
                services.AddSignalR().AddAzureSignalR();
            }
            else
            {
                services.AddSignalR(options =>
                {
                    // Faster pings for testing
                    options.KeepAliveInterval = TimeSpan.FromSeconds(5);
                });
            }
            // MVC Redis Cache Store Mamory
            services.RegisterRedisServer();

            //// Start Swagger           

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Info { Title = "Clean Architecture Api", Version = "v1" });
                //c.SwaggerDoc("v2", new Info { Title = "Clean Architecture Api", Version = "v2" });//rita-komal 31-12-18  for versioning saperation use

                // Swagger 2.+ support
                var security = new Dictionary<string, IEnumerable<string>>
                {
                    {"Bearer", new string[] { }},
                };

                c.AddSecurityDefinition("Bearer", new ApiKeyScheme
                {
                    Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
                    Name = "Authorization",
                    In = "header",
                    Type = "apiKey"
                });
                c.AddSecurityRequirement(security);

            });

            services.AddHostedService<TimedHostedPairStatisticsCalService>(); //Uday 24-12-2018 Calculate Pair Statistics In BackGround
            services.AddHostedService<TimedHostedService>();
            services.AddHostedService<TimedHostedLPStatusCheck>(); // khushali 28-01-2019 for LP status check cron
            services.AddHostedService<TimedHostedLPStatusCheckArbitrage>(); // Rushabh 13-06-2019 for LP status check arbitrage cron
            services.AddHostedService<TimedHostedReleaseAndStuckOrderService>(); // khushali 03-04-2019 for ReleaseAndStuckOrderService cron
            services.AddHostedService<TimeHostedCryptoWatcher>(); // khushali 24-05-2019 for crypto LTP watcher cron
            
            //services.AddHostedService<TimeHostedLiqidityProviderService>();//komal for LP SocketCall
            services.AddHostedService<MarketCapService>();
            services.AddSingleton(typeof(IPushNotificationsQueue<>), typeof(PushNotificationsQueue<>));
            services.AddSingleton<ISignalRQueue, BackgroundSignalRTaskQueue>();
            services.AddSingleton<IMarketCap, MarketCap>();
            services.AddSingleton<Microsoft.Extensions.Hosting.IHostedService, PushSMSDequeuer<SendSMSRequest>>();
            services.AddSingleton<Microsoft.Extensions.Hosting.IHostedService, PushEmailDequeuer<SendEmailRequest>>();
            services.AddSingleton<Microsoft.Extensions.Hosting.IHostedService, PushNotificationDequeuer<SendNotificationRequest>>();
            services.AddSingleton<Microsoft.Extensions.Hosting.IHostedService, SendToThirdPartyAPISignalREventHandler>();
            services.AddSingleton<ThirdPartyAPISignalRQueue, BackgroundThirdPartyAPISignalRTaskQueue>();
            services.AddAuthentication();

            services.AddSingleton(typeof(ILPStatusCheck<>), typeof(BGTaskLPStatusCheck<>)); // khushali 24-01-2019 for LP status check
            services.AddSingleton(typeof(ILPStatusCheckArbitrage<>), typeof(BGTaskLPStatusCheckArbitrage<>)); // khushali 17-06-2019 for LP status check

            services.AddSingleton<Microsoft.Extensions.Hosting.IHostedService, ProcessAllLPTransactionDequeuer>(); // khushali 24-01-2019 for LP status check
            services.AddSingleton<Microsoft.Extensions.Hosting.IHostedService, ProcessAllLPTransactionDequeuerArbitrage>(); // khushali 17-06-2019 for LP status check

            services.AddSingleton(typeof(ITransactionQueue<>), typeof(BGTaskTransactionQueue<>));
            services.AddSingleton<Microsoft.Extensions.Hosting.IHostedService, ProcessAllTransactionDequeuer>();
            services.AddSingleton<Microsoft.Extensions.Hosting.IHostedService, ProcessAllTransactionMarginDequeuer>();//Rita 15-2-19 Margin Trading
            services.AddSingleton<Microsoft.Extensions.Hosting.IHostedService, ProcessAllTransactionArbitrageDequeuer>();//Rita 04-06-19 Arbitrage Trading
            services.AddSingleton<Microsoft.Extensions.Hosting.IHostedService, ProcessAllWithdrawDequeuer>();//rita 27-11-18 for enqueue withdraw
            services.AddSingleton<Microsoft.Extensions.Hosting.IHostedService, ProcessAllCancelOrderDequeuer>();//uday 28-11-18 for enque cancel order
            services.AddSingleton<Microsoft.Extensions.Hosting.IHostedService, ProcessAllCancelOrderArbitrageDequeuer>();//komal 07-06-19 Cancel Arbitrage Trade
            services.AddSingleton(typeof(IGenerateAddressQueue<>), typeof(BGTaskWalletTaskQueue<>));
            services.AddSingleton<Microsoft.Extensions.Hosting.IHostedService, ProcessAllAddressDequeuer>();

            services.AddSingleton(typeof(ICreateWalletQueue<>), typeof(CreateWalletQueue<>));
            services.AddSingleton(typeof(ICreateMarginWalletQueue<>), typeof(CreateMarginWalletQueue<>));
            services.AddSingleton<Microsoft.Extensions.Hosting.IHostedService, ProcessCreateWalletDequeuer>();

            services.AddSingleton<Microsoft.Extensions.Hosting.IHostedService, SendToEventHandler>();
            services.AddSingleton<Microsoft.Extensions.Hosting.IHostedService, UpdateFeedLimitCounts>();
            services.AddSingleton<IFeedlimitcountQueue, FeedLimitCountsQueue>();
            services.AddSingleton<PresenceTracker>();
            services.AddSingleton<ChatHub>();

            //services.AddHostedService<Infrastructure.LiquidityProvider.BinanceConsumeScopedServiceHostedService>();
            //services.AddScoped<Infrastructure.LiquidityProvider.IBinanceScopedProcessingService, Infrastructure.LiquidityProvider.BinanceScopedProcessingService>();
            //services.AddHostedService<BitrexConsumeScopedServiceHostedService>();
            //services.AddScoped<IBitrexScopedProcessingService, BitrexScopedProcessingService>();
            //services.AddHostedService<CoinbaseConsumeScopedServiceHostedService>();
            //services.AddScoped<ICoinBaseLP, CoinBaseLP>();
            //services.AddHostedService<PoloniexConsumeScopedServiceHostedService>();
            //services.AddScoped<IPoloniexService, PoloniexService>();
            //services.AddHostedService<TradeSatoshiConsumeScopedServiceHostedService>();
            //services.AddScoped<ITradeSatoshiScopedProcessingService, TradeSatoshiScopedProcessingService>();
            services.AddScoped<IUpbitService, UpBitService>(); //Rushabh 05-06-2019 added service for Upbit API            
            //services.AddScoped<IUpbitService, UpBitService>(); //Rushabh 05-06-2019 added service for Upbit API
            services.AddScoped<IOKExLPService, OKExLPService>(); //Add by Pushpraj for OKEx Service by Pushpraj as on 12-06-2019

            ////End Swagger
            ////services.AddMvcCore();
            //services.AddDistributedMemoryCache();
            //services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);

            // services.AddMvc(c => c.Conventions.Add(new ApiExplorerGetsOnlyConvention(Configuration))) //komal 1-1-2018 for controller grouping, divide controller 
            //services.AddMvc()
            //    .SetCompatibilityVersion(CompatibilityVersion.Version_2_1) //ntrivedi 22-10-2018 for camel case response class earlier it was default use walletType eventhouth we have WalletType in our class 
            //    .AddJsonOptions(options => options.SerializerSettings.ContractResolver = new DefaultContractResolver());

            // Added to get Filtered error msg. -Nishit Jani on A 2019-02-07 6:40 PM
            services.AddMvc(options =>
            {
                options.Filters.Add(typeof(ModelValidationFilter));
                options.Filters.Add(typeof(ApiResultFilter));
            })
            .SetCompatibilityVersion(CompatibilityVersion.Version_2_1) //ntrivedi 22-10-2018 for camel case response class earlier it was default use walletType eventhouth we have WalletType in our class 
            .AddJsonOptions(options => options.SerializerSettings.ContractResolver = new DefaultContractResolver());

            //services.Configure<EmailSettings>(Configuration.GetSection("Email"));
            //services.Configure<SMSSetting>(Configuration.GetSection("SMS"));
            
            services.AddMediatR(typeof(Startup));

            //services.AddHangfire(config => config.UseSqlServerStorage(Configuration["Data:SqlServerConnectionString"]));

            services.AddAuthorizationPolicies();

            Container container = new Container();

            container.Configure(config =>
            {
                config.Scan(_ =>
                {
                    _.AssemblyContainingType(typeof(Startup)); // Web
                    _.AssemblyContainingType(typeof(BaseEntity)); // Core
                    _.Assembly("CleanArchitecture.Infrastructure"); // Infrastructure
                    _.WithDefaultConventions();
                    _.ConnectImplementationsToTypesClosing(typeof(IHandle<>));
                    _.ConnectImplementationsToTypesClosing(typeof(IRequestHandler<,>));
                    _.ConnectImplementationsToTypesClosing(typeof(IUserRoleStore<>));
                });

                // TODO: Add Registry Classes to eliminate reference to Infrastructure

                // TODO: Move to Infrastucture Registry
                config.For(typeof(IRepository<>)).Add(typeof(EfRepository<>));
                config.For(typeof(ICommonRepository<>)).Add(typeof(EFCommonRepository<>));
                config.For(typeof(IWalletRepository)).Add(typeof(WalletRepository));
                config.For(typeof(IArbitrageWalletService)).Add(typeof(ArbitrageWalletService));       //ntrivedi 06-06-2019   
                config.For(typeof(IArbitrageWalletServiceCharge)).Add(typeof(ArbitrageWalletServiceCharge)); //Chirag 12-06-2019
                config.For(typeof(IArbitrageWalletChargeRepository)).Add(typeof(ArbitrageWalletChargeRepository)); //Chirag 12-06-2019
                config.For(typeof(IArbitrageSPRepositories)).Add(typeof(ArbitrageSPRepository));   //ntrivedi 06-06-2019     

                config.For(typeof(IReferralCommonRepo)).Add(typeof(ReferralCommonRepository));

                //config.For(typeof(IReferralCommonRepo)).Add(typeof(ReferralCommonRepository));
                //config.For(typeof(IMarginWalletRepository)).Add(typeof(MarginWalletRepository));
                config.For(typeof(IMessageRepository<>)).Add(typeof(MessageRepository<>));
                config.For(typeof(IWebApiRepository)).Add(typeof(WebApiDataRepository));

                //vsolanki 8-10-2018 for wallet
                config.For(typeof(IBasePage)).Add(typeof(BasePage));
                config.For(typeof(IWalletService)).Add(typeof(WalletService));
                //config.For(typeof(IMarginWalletService)).Add(typeof(MarginWalletService));
                config.For(typeof(IWebApiSendRequest)).Add(typeof(WebAPISendRequest));
                config.For(typeof(IGetWebRequest)).Add(typeof(GetWebRequest));
                config.For(typeof(IWalletConfigurationService)).Add(typeof(WalletConfigurationService));
                config.For(typeof(IMessageConfiguration)).Add(typeof(MessageConfiguration));
                config.For<IMediator>().Use<Mediator>();
                //  config.For(typeof(ILogger));
                services.AddScoped(typeof(IAsyncRepository<>), typeof(EfRepository1<>));
                services.AddScoped(typeof(IAsyncRepositoryV1<UserAssignModule>), typeof(EfRepository3<UserAssignModule>));
                services.AddScoped(typeof(IAsyncRepositoryV2<UserAssignSubModule>), typeof(EfRepository4<UserAssignSubModule>));
                services.AddScoped(typeof(IAsyncRepositoryV3<UserAssignFieldRights>), typeof(EfRepository5<UserAssignFieldRights>));
                services.AddScoped(typeof(IAsyncRepositoryV4<UserAssignToolRights>), typeof(EfRepository6<UserAssignToolRights>));
                services.AddScoped<IRuleManageService, CacheRuleManageService>();
                services.AddScoped<RuleManageService>();
                //services.AddScoped(typeof(IUserRoleStore<>,UserRoleStore<>);
                //services.AddScoped(typeof(IUserRoleStore<Application>);
                //config.For(typeof(ISpecification<>)).Add(typeof(UserAccessRightsSpecification));
                //config.For(typeof(IRoleManageServide)).Add(typeof(RoleManageServide));

                // added by nirav savariya for common repository on 10-04-2018
                config.For(typeof(ICustomRepository<>)).Add(typeof(CustomRepository<>));
                // added by nirav savariya for common guid repository on 12-20-2018
                config.For(typeof(ICustomExtendedRepository<>)).Add(typeof(CustomExtendedRepository<>));
                // added by nirav savariya for mediator base call class on 12/28/2018
                config.For(typeof(IActivityLogProcess)).Add(typeof(ActivityRegisterService));
                config.For(typeof(IAPIStatistics)).Add(typeof(APIStatisticsService)); // khushali 15-03-2015 -- public and private API key user log

                //config.For(typeof(ITransactionProcess)).Add(typeof(NewTransaction));//Rita 9-2-19 not in used now
                config.For(typeof(ISiteTokenConversion)).Add(typeof(SiteTokenConversionService));//Rita 9-2-19 for Site Token Conversation
                config.For(typeof(ITransactionProcessV1)).Add(typeof(NewTransactionV1));
                config.For(typeof(ITransactionProcessMarginV1)).Add(typeof(NewTransactionMarginV1));//Rita 15-2-19 Margin Trading
                config.For(typeof(ITransactionProcessArbitrageV1)).Add(typeof(NewTransactionArbitrageV1));//rita 4-6-19 for Arbitrage trading
                //config.For(typeof(ISettlementRepository<BizResponse>)).Add(typeof(SettlementRepository));//Rita 2-11-2018 for settlement
                config.For(typeof(ISettlementRepositoryV1<BizResponse>)).Add(typeof(SettlementRepositoryV2));//Rita 28-1-19 change for LP Implementation and Neglet Decimal point Issue
                config.For(typeof(ISettlementRepositoryMarginV1<BizResponse>)).Add(typeof(SettlementRepositoryMarginV2));//Rita 15-2-19 Margin Trading
                config.For(typeof(ISettlementRepositoryArbitrageV1<BizResponse>)).Add(typeof(SettlementRepositoryArbitrageV2));//Rita 05-06-19 Arbitrage Trading
                config.For(typeof(IWebApiData)).Add(typeof(TransactionWebAPIConfiguration));
                config.For(typeof(IWithdrawRecon)).Add(typeof(WithdrawRecon));
                config.For(typeof(ISettlementRepositoryAPI<BizResponse>)).Add(typeof(SettlementRepositoryAPI));//Rita 29-1-19 added for API Related Data Update
                config.For(typeof(ISettlementRepositoryArbitrageAPI<BizResponse>)).Add(typeof(SettlementRepositoryArbitrageAPI));//Rita 05-06-19 added for API Related Data Update in Arbitrage
                config.For(typeof(IResdisTradingManagment)).Add(typeof(ResdisTradingManagmentService));//Rita 15-3-19 for Cache Implementation in Trading
                //Rita 10-4-19 for Margin trading order creation
                config.For(typeof(IMarginCreateOrderFromWallet)).Add(typeof(MarginCreateOrderFromWalletService));
                config.For(typeof(IMarginClosePosition)).Add(typeof(MarginClosePosition));
                config.For(typeof(ICancelOrderProcessMarginV1)).Add(typeof(CancelOrderProcessMarginV1));
                config.For(typeof(ICancelOrderRepositoryMargin)).Add(typeof(CancelOrderRepositoryMargin));

                config.For(typeof(ICommunicationService)).Add(typeof(CommunicationService));
                config.For(typeof(IMasterConfiguration)).Add(typeof(MasterConfigServices));
                config.For(typeof(IMasterConfigurationRepository)).Add(typeof(MasterConfigurationRepository));
                config.For(typeof(IWithdrawTransaction)).Add(typeof(WithdrawTransaction));
                config.For(typeof(IWalletSPRepositories)).Add(typeof(WalletSPRepository));//ntrivedi 03-12-2018 for New settlement
                config.For(typeof(IWalletTransaction)).Add(typeof(WalletTransactionService));//ntrivedi 18-12-2018 for New settlement
                config.For(typeof(ITransactionRepository<>)).Add(typeof(TransactionRepository<>));//Rita 27-12-18 for STOP&Limit order
                config.For(typeof(IFollowersTrading)).Add(typeof(FollowersTradingService));//Rita 17-1-19 added for followers trade
                config.For(typeof(IWalletTQInsert)).Add(typeof(WalletTQRepository));//ntrivedi 17-01-2018

                config.For(typeof(IReferralUser)).Add(typeof(ReferralUserServices)); // Pratik 11-2-2019
                config.For(typeof(IReferralPayType)).Add(typeof(ReferralPayTypeServices)); // Pratik 11-2-2019
                config.For(typeof(IReferralChannelType)).Add(typeof(ReferralChannelTypeServices)); // Pratik 12-2-2019
                config.For(typeof(IReferralServiceType)).Add(typeof(ReferralServiceTypeServices)); // Pratik 13-2-2019
                config.For(typeof(IReferralService)).Add(typeof(ReferralServices)); // Pratik 18-2-2019
                config.For(typeof(IReferralChannel)).Add(typeof(ReferralChannelServices)); // Pratik 20-2-2019
                config.For(typeof(IReferralUserClick)).Add(typeof(ReferralUserClickServices)); // Pratik 4-3-2019
                config.For(typeof(IReferralRewards)).Add(typeof(ReferralRewardsServices)); // Pratik 4-3-2019

                services.AddScoped(typeof(IAsyncRepositoryV5<ModuleGroupMaster>), typeof(EfRepository7<ModuleGroupMaster>));


                config.For(typeof(IRoleManagementServices)).Add(typeof(RoleManagementServices));
                //Populate the container using the service collection
                //ntrivedi 21-02-2019 margin repository and services 
                config.For(typeof(IMarginSPRepositories)).Add(typeof(MarginSPRepository));
                config.For(typeof(IMarginWalletTQInsert)).Add(typeof(MarginWalletTQRepository));
                config.For(typeof(IMarginTransactionWallet)).Add(typeof(MarginTransactionWalletService));
                config.Populate(services);
            });

            return container.GetInstance<IServiceProvider>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            //loggerFactory.AddFile(Configuration["LogPath"].ToString());//Take from Setting file

            if (env.IsDevelopment())
            {
                // app.UseDeveloperExceptionPage();
                app.AddDevMiddlewares();
            }
            else
            {
                app.UseHsts();
                //app.UseResponseCompression();
                app.AddDevMiddlewares();
            }

            // NOTE: For SPA swagger needs adding before MVC
            app.UseCustomSwaggerApi(Configuration);
            app.UseHttpsRedirection();
            
            // https://github.com/openiddict/openiddict-core/issues/518
            // And
            // https://github.com/aspnet/Docs/issues/2384#issuecomment-297980490
            var forwarOptions = new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
            };
            forwarOptions.KnownNetworks.Clear();
            forwarOptions.KnownProxies.Clear();

            app.UseForwardedHeaders(forwarOptions);

            app.UseAuthentication();

            // Commented for req-res time issue. -Nishit Jani on A 2019-01-10 5:19 PM
            //app.UseCookiePolicy();

            // Commented for req-res time issue. -Nishit Jani on A 2019-01-10 5:19 PM
            //app.Use(async (context, next) =>
            //{
            //    // Do work that doesn't write to the Response.
            //    await next.Invoke();
            //    // Do logging or other work that doesn't write to the Response.
            //});

            // Added to custom dev middleware as it needs be call 1st. -Nishit Jani on A 2019/06/18 5:13 PM
            //app.UseCors("MyCorsPolicy");

            //app.UseCors(builder =>
            //{
            //    builder.AllowAnyOrigin()
            //        .AllowAnyHeader()
            //        .WithMethods("GET", "POST", "DELETE", "PUT")
            //        .AllowCredentials();
            //});

            
                

            // Commented for req-res time issue. -Nishit Jani on A 2019-01-10 5:19 PM
            //UnCommented -Nishit Jani on A 2019-01-11 11:10 AM
            //app.UseSession();
            /*

            // Enable middleware to serve generated Swagger as a JSON endpoint.
            app.UseSwagger();

            // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.), specifying the Swagger JSON endpoint.
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Clean Architecture Api V1");
            });
         */

            //app.UseMiddleware<AdminSafeListMiddleware>(Configuration["AdminSafeList"]);

            app.UseMvc();

            //komal 7-May-2019  Make Dynamic SignalR Case
            if (Configuration["AzureSignalR"] == "True")
            {
                app.UseFileServer();
                app.UseAzureSignalR(routes =>
                {
                    routes.MapHub<ChatHub>("/chat");
                    routes.MapHub<SocketHub>("/Market");
                    routes.MapHub<ThirdPartySocketHub>("/ClientHub");
                });

            }
            else
            {
                app.UseSignalR(routes =>
                {
                    //routes.MapHub<SocketHub>("/chathub");
                    routes.MapHub<SocketHub>("/Market");
                    routes.MapHub<ChatHub>("/Chat");
                    routes.MapHub<ThirdPartySocketHub>("/ClientHub");
                });
            }
            
            //app.UseHangfireServer();
        }
    }
}