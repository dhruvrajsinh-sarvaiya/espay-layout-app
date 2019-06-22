IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181015070812_newmigration15oct2018')
BEGIN
    CREATE TABLE [IpMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NOT NULL,
        [Status] smallint NOT NULL,
        [UserId] int NOT NULL,
        [IpAddress] nvarchar(15) NOT NULL,
        [IsEnable] bit NOT NULL,
        [IsDeleted] bit NOT NULL,
        CONSTRAINT [PK_IpMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181015070812_newmigration15oct2018')
BEGIN
    CREATE TABLE [TradePoolMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NOT NULL,
        [Status] smallint NOT NULL,
        [PairName] nvarchar(50) NOT NULL,
        [ProductID] bigint NOT NULL,
        [SellServiceID] bigint NOT NULL,
        [BuyServiceID] bigint NOT NULL,
        [BidPrice] bigint NOT NULL,
        [TotalQty] decimal(18, 8) NOT NULL,
        [Landing] decimal(37, 16) NOT NULL,
        [OnProcessing] smallint NOT NULL,
        [TPSPickupStatus] smallint NOT NULL,
        [IsSleepMode] smallint NOT NULL,
        CONSTRAINT [PK_TradePoolMaster] PRIMARY KEY ([Id], [SellServiceID], [BuyServiceID], [BidPrice]),
        CONSTRAINT [AK_TradePoolMaster_BidPrice_BuyServiceID_Id_SellServiceID] UNIQUE ([BidPrice], [BuyServiceID], [Id], [SellServiceID])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181015070812_newmigration15oct2018')
BEGIN
    CREATE TABLE [TradeStopLoss] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NOT NULL,
        [Status] smallint NOT NULL,
        [TrnNo] bigint NOT NULL,
        [ordertype] smallint NOT NULL,
        CONSTRAINT [PK_TradeStopLoss] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181015070812_newmigration15oct2018')
BEGIN
    CREATE TABLE [WalletTransactionOrders] (
        [OrderID] bigint NOT NULL IDENTITY,
        [UpdatedDate] datetime2 NOT NULL,
        [TrnDate] datetime2 NOT NULL,
        [OWalletID] bigint NOT NULL,
        [DWalletID] bigint NOT NULL,
        [Amount] decimal(18, 2) NOT NULL,
        [WalletType] nvarchar(5) NOT NULL,
        [OTrnNo] bigint NOT NULL,
        [DTrnNo] bigint NOT NULL,
        [Status] tinyint NOT NULL,
        [StatusMsg] nvarchar(max) NOT NULL,
        CONSTRAINT [PK_WalletTransactionOrders] PRIMARY KEY ([OrderID])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181015070812_newmigration15oct2018')
BEGIN
    CREATE TABLE [WalletTransactionQueues] (
        [TrnNo] bigint NOT NULL IDENTITY,
        [Guid] nvarchar(50) NOT NULL,
        [TrnType] tinyint NOT NULL,
        [Amount] decimal(18, 2) NOT NULL,
        [TrnRefNo] bigint NOT NULL,
        [TrnDate] datetime2 NOT NULL,
        [UpdatedDate] datetime2 NULL,
        [WalletID] bigint NOT NULL,
        [WalletType] nvarchar(5) NOT NULL,
        [MemberID] bigint NOT NULL,
        [TimeStamp] nvarchar(5) NOT NULL,
        [Status] tinyint NOT NULL,
        [StatusMsg] nvarchar(5) NOT NULL,
        CONSTRAINT [PK_WalletTransactionQueues] PRIMARY KEY ([TrnNo])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181015070812_newmigration15oct2018')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181015070812_newmigration15oct2018', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181015074021_UpdateWalletService1510')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181015074021_UpdateWalletService1510', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181015110015_UpdateWalletServiceV11510')
BEGIN
    DROP TABLE [TransactionQueue];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181015110015_UpdateWalletServiceV11510')
BEGIN
    DECLARE @var0 sysname;
    SELECT @var0 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletTransactionQueues]') AND [c].[name] = N'Guid');
    IF @var0 IS NOT NULL EXEC(N'ALTER TABLE [WalletTransactionQueues] DROP CONSTRAINT [' + @var0 + '];');
    ALTER TABLE [WalletTransactionQueues] ALTER COLUMN [Guid] uniqueidentifier NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181015110015_UpdateWalletServiceV11510')
BEGIN
    CREATE TABLE [TrnAcBatch] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NOT NULL,
        [Status] smallint NOT NULL,
        CONSTRAINT [PK_TrnAcBatch] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181015110015_UpdateWalletServiceV11510')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181015110015_UpdateWalletServiceV11510', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181015110102_UpdateTransactionalService1510')
BEGIN
    CREATE TABLE [TransactionQueue] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NOT NULL,
        [Status] smallint NOT NULL,
        [GUID] uniqueidentifier NOT NULL,
        [TrnDate] datetime2 NOT NULL,
        [TrnMode] smallint NOT NULL,
        [TrnType] smallint NOT NULL,
        [MemberID] bigint NOT NULL,
        [MemberMobile] nvarchar(max) NOT NULL,
        [SMSCode] nvarchar(10) NOT NULL,
        [TransactionAccount] nvarchar(200) NOT NULL,
        [Amount] decimal(18, 8) NOT NULL,
        [ServiceID] bigint NOT NULL,
        [SerProID] bigint NOT NULL,
        [ProductID] int NOT NULL,
        [RoutID] int NOT NULL,
        [StatusCode] smallint NOT NULL,
        [StatusMsg] nvarchar(max) NULL,
        [VerifyDone] smallint NOT NULL,
        [TrnRefNo] nvarchar(max) NULL,
        [AdditionalInfo] nvarchar(max) NULL,
        [ChargePer] decimal(18, 8) NULL,
        [ChargeRs] decimal(18, 8) NULL,
        [ChargeType] smallint NULL,
        CONSTRAINT [PK_TransactionQueue] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181015110102_UpdateTransactionalService1510')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181015110102_UpdateTransactionalService1510', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181015114137_UpdateWalletServiceV21510')
BEGIN
    DECLARE @var1 sysname;
    SELECT @var1 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletTransactionQueues]') AND [c].[name] = N'StatusMsg');
    IF @var1 IS NOT NULL EXEC(N'ALTER TABLE [WalletTransactionQueues] DROP CONSTRAINT [' + @var1 + '];');
    ALTER TABLE [WalletTransactionQueues] ALTER COLUMN [StatusMsg] nvarchar(50) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181015114137_UpdateWalletServiceV21510')
BEGIN
    DECLARE @var2 sysname;
    SELECT @var2 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletTransactionQueues]') AND [c].[name] = N'Amount');
    IF @var2 IS NOT NULL EXEC(N'ALTER TABLE [WalletTransactionQueues] DROP CONSTRAINT [' + @var2 + '];');
    ALTER TABLE [WalletTransactionQueues] ALTER COLUMN [Amount] decimal(18, 8) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181015114137_UpdateWalletServiceV21510')
BEGIN
    DECLARE @var3 sysname;
    SELECT @var3 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletTransactionOrders]') AND [c].[name] = N'StatusMsg');
    IF @var3 IS NOT NULL EXEC(N'ALTER TABLE [WalletTransactionOrders] DROP CONSTRAINT [' + @var3 + '];');
    ALTER TABLE [WalletTransactionOrders] ALTER COLUMN [StatusMsg] nvarchar(50) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181015114137_UpdateWalletServiceV21510')
BEGIN
    DECLARE @var4 sysname;
    SELECT @var4 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletTransactionOrders]') AND [c].[name] = N'Amount');
    IF @var4 IS NOT NULL EXEC(N'ALTER TABLE [WalletTransactionOrders] DROP CONSTRAINT [' + @var4 + '];');
    ALTER TABLE [WalletTransactionOrders] ALTER COLUMN [Amount] decimal(18, 8) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181015114137_UpdateWalletServiceV21510')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181015114137_UpdateWalletServiceV21510', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181016074732_depositehistoryAPI')
BEGIN
    DECLARE @var5 sysname;
    SELECT @var5 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletTransactionQueues]') AND [c].[name] = N'TimeStamp');
    IF @var5 IS NOT NULL EXEC(N'ALTER TABLE [WalletTransactionQueues] DROP CONSTRAINT [' + @var5 + '];');
    ALTER TABLE [WalletTransactionQueues] ALTER COLUMN [TimeStamp] nvarchar(50) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181016074732_depositehistoryAPI')
BEGIN
    DECLARE @var6 sysname;
    SELECT @var6 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletTransactionOrders]') AND [c].[name] = N'UpdatedDate');
    IF @var6 IS NOT NULL EXEC(N'ALTER TABLE [WalletTransactionOrders] DROP CONSTRAINT [' + @var6 + '];');
    ALTER TABLE [WalletTransactionOrders] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181016074732_depositehistoryAPI')
BEGIN
    ALTER TABLE [DepositHistorys] ADD [userId] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181016074732_depositehistoryAPI')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181016074732_depositehistoryAPI', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181017042246_WalletTransactionV1')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181017042246_WalletTransactionV1', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181017043603_WalletTransactionV2')
BEGIN
    DECLARE @var7 sysname;
    SELECT @var7 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletTransactionQueues]') AND [c].[name] = N'TrnType');
    IF @var7 IS NOT NULL EXEC(N'ALTER TABLE [WalletTransactionQueues] DROP CONSTRAINT [' + @var7 + '];');
    ALTER TABLE [WalletTransactionQueues] ALTER COLUMN [TrnType] int NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181017043603_WalletTransactionV2')
BEGIN
    DECLARE @var8 sysname;
    SELECT @var8 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletTransactionQueues]') AND [c].[name] = N'Status');
    IF @var8 IS NOT NULL EXEC(N'ALTER TABLE [WalletTransactionQueues] DROP CONSTRAINT [' + @var8 + '];');
    ALTER TABLE [WalletTransactionQueues] ALTER COLUMN [Status] int NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181017043603_WalletTransactionV2')
BEGIN
    ALTER TABLE [WalletTransactionQueues] ADD [SettedAmt] decimal(18, 8) NOT NULL DEFAULT 0.0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181017043603_WalletTransactionV2')
BEGIN
    DECLARE @var9 sysname;
    SELECT @var9 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletTransactionOrders]') AND [c].[name] = N'Status');
    IF @var9 IS NOT NULL EXEC(N'ALTER TABLE [WalletTransactionOrders] DROP CONSTRAINT [' + @var9 + '];');
    ALTER TABLE [WalletTransactionOrders] ALTER COLUMN [Status] int NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181017043603_WalletTransactionV2')
BEGIN
    ALTER TABLE [TrnAcBatch] ADD [Id] bigint NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181017043603_WalletTransactionV2')
BEGIN
    DECLARE @var10 sysname;
    SELECT @var10 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TransactionQueue]') AND [c].[name] = N'StatusCode');
    IF @var10 IS NOT NULL EXEC(N'ALTER TABLE [TransactionQueue] DROP CONSTRAINT [' + @var10 + '];');
    ALTER TABLE [TransactionQueue] ALTER COLUMN [StatusCode] bigint NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181017043603_WalletTransactionV2')
BEGIN
    ALTER TABLE [TradePairMaster] ADD [Id] bigint NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181017043603_WalletTransactionV2')
BEGIN
    DBCC CHECKIDENT ('ServiceMaster', RESEED, 1000);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181017043603_WalletTransactionV2')
BEGIN
    DBCC CHECKIDENT ('ServiceProviderDetail', RESEED, 3000);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181017043603_WalletTransactionV2')
BEGIN
    DBCC CHECKIDENT ('ServiceProviderMaster', RESEED, 2000);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181017043603_WalletTransactionV2')
BEGIN
    CREATE TABLE [TradeBuyRequest] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NOT NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL,
        [TrnDate] datetime2 NOT NULL,
        [PickupDate] datetime2 NOT NULL,
        [MemberID] bigint NOT NULL,
        [TrnNo] bigint NOT NULL IDENTITY,
        [PairID] bigint NOT NULL,
        [ServiceID] bigint NOT NULL,
        [Qty] decimal(18, 8) NOT NULL,
        [BidPrice] decimal(18, 8) NOT NULL,
        [PaidQty] decimal(18, 8) NOT NULL,
        [PaidServiceID] bigint NOT NULL,
        [DeliveredQty] decimal(18, 8) NOT NULL,
        [PendingQty] decimal(18, 8) NOT NULL,
        [IsCancel] smallint NOT NULL,
        [IsPartialProceed] smallint NOT NULL,
        [IsProcessing] smallint NOT NULL,
        [SellStockID] bigint NOT NULL,
        [BuyStockID] bigint NOT NULL,
        CONSTRAINT [PK_TradeBuyRequest] PRIMARY KEY ([TrnNo])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181017043603_WalletTransactionV2')
BEGIN
    CREATE TABLE [WalletLimitConfiguration] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NOT NULL,
        [Status] smallint NOT NULL,
        [WalletId] bigint NOT NULL,
        [TrnType] int NOT NULL,
        [LimitPerHour] decimal(18, 2) NOT NULL,
        [LimitPerDay] decimal(18, 2) NOT NULL,
        [LimitPerTransaction] decimal(18, 2) NOT NULL,
        CONSTRAINT [PK_WalletLimitConfiguration] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181017043603_WalletTransactionV2')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181017043603_WalletTransactionV2', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181017045501_AddedPrimaryKey')
BEGIN
    ALTER TABLE [TradePairMaster] ADD CONSTRAINT [PK_TradePairMaster] PRIMARY KEY ([Id]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181017045501_AddedPrimaryKey')
BEGIN
    ALTER TABLE [TrnAcBatch] ADD CONSTRAINT [PK_TrnAcBatch] PRIMARY KEY ([Id]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181017045501_AddedPrimaryKey')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181017045501_AddedPrimaryKey', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181018125116_myaccountserviceForBirjubhai')
BEGIN
    DECLARE @var11 sysname;
    SELECT @var11 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradePairDetail]') AND [c].[name] = N'LastTrnNo');
    IF @var11 IS NOT NULL EXEC(N'ALTER TABLE [TradePairDetail] DROP CONSTRAINT [' + @var11 + '];');
    ALTER TABLE [TradePairDetail] DROP COLUMN [LastTrnNo];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181018125116_myaccountserviceForBirjubhai')
BEGIN
    EXEC sp_rename N'[ProductConfiguration].[StateID]', N'CountryID', N'COLUMN';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181018125116_myaccountserviceForBirjubhai')
BEGIN
    DECLARE @var12 sysname;
    SELECT @var12 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeTransactionQueue]') AND [c].[name] = N'StatusCode');
    IF @var12 IS NOT NULL EXEC(N'ALTER TABLE [TradeTransactionQueue] DROP CONSTRAINT [' + @var12 + '];');
    ALTER TABLE [TradeTransactionQueue] ALTER COLUMN [StatusCode] bigint NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181018125116_myaccountserviceForBirjubhai')
BEGIN
    CREATE TABLE [CountryMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NOT NULL,
        [Status] smallint NOT NULL,
        [CountryName] nvarchar(30) NOT NULL,
        [CountryCode] nvarchar(2) NOT NULL,
        CONSTRAINT [PK_CountryMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181018125116_myaccountserviceForBirjubhai')
BEGIN
    CREATE TABLE [CustomPassword] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NOT NULL,
        [Status] smallint NOT NULL,
        [UserId] bigint NOT NULL,
        [Password] nvarchar(max) NOT NULL,
        [EnableStatus] bit NOT NULL,
        CONSTRAINT [PK_CustomPassword] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181018125116_myaccountserviceForBirjubhai')
BEGIN
    CREATE TABLE [DeviceMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NOT NULL,
        [Status] smallint NOT NULL,
        [UserId] int NOT NULL,
        [DeviceId] nvarchar(250) NOT NULL,
        [IsEnable] bit NOT NULL,
        [IsDeleted] bit NOT NULL,
        CONSTRAINT [PK_DeviceMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181018125116_myaccountserviceForBirjubhai')
BEGIN
    CREATE TABLE [PoolOrder] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NOT NULL,
        [Status] smallint NOT NULL,
        [OrderDate] datetime2 NOT NULL,
        [TrnMode] tinyint NOT NULL,
        [OMemberID] bigint NOT NULL,
        [PayMode] tinyint NOT NULL,
        [OrderAmt] decimal(18, 8) NOT NULL,
        [DiscPer] decimal(18, 8) NOT NULL,
        [DiscRs] decimal(18, 8) NOT NULL,
        [OBankID] smallint NOT NULL,
        [OBranchName] nvarchar(max) NULL,
        [OAccountNo] nvarchar(max) NULL,
        [OChequeNo] nvarchar(max) NULL,
        [OChequeDate] datetime2 NOT NULL,
        [DMemberID] bigint NOT NULL,
        [DBankID] smallint NOT NULL,
        [DAccountNo] nvarchar(max) NOT NULL,
        [ORemarks] nvarchar(max) NULL,
        [DeliveryAmt] decimal(18, 8) NOT NULL,
        [DRemarks] nvarchar(max) NULL,
        [DeliveryGivenBy] bigint NOT NULL,
        [DeliveryGivenDate] datetime2 NOT NULL,
        [AlertRec] tinyint NOT NULL,
        [CashChargePer] float NOT NULL,
        [CashChargeRs] decimal(18, 8) NOT NULL,
        [WalletAmt] decimal(18, 8) NOT NULL,
        [PGId] int NOT NULL,
        [CouponNo] bigint NOT NULL,
        [IsChargeAccepted] bit NOT NULL,
        [IsDebited] bit NOT NULL,
        [WalletID] bigint NOT NULL,
        [TrnNo] bigint NOT NULL,
        [CancelID] bigint NOT NULL,
        CONSTRAINT [PK_PoolOrder] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181018125116_myaccountserviceForBirjubhai')
BEGIN
    CREATE TABLE [StateMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NOT NULL,
        [Status] smallint NOT NULL,
        [StateName] nvarchar(30) NOT NULL,
        [StateCode] nvarchar(2) NOT NULL,
        [CountryID] nvarchar(max) NOT NULL,
        CONSTRAINT [PK_StateMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181018125116_myaccountserviceForBirjubhai')
BEGIN
    CREATE TABLE [TradeTransactionStatus] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NOT NULL,
        [Status] smallint NOT NULL,
        [TrnNo] bigint NOT NULL,
        [SettledQty] decimal(18, 2) NOT NULL,
        [TotalQty] decimal(18, 2) NOT NULL,
        [DeliveredQty] decimal(18, 2) NOT NULL,
        [PendingQty] decimal(18, 2) NOT NULL,
        [SoldPrice] decimal(18, 2) NOT NULL,
        [BidPrice] decimal(18, 2) NOT NULL,
        [OrderID] bigint NOT NULL,
        [StockID] bigint NOT NULL,
        [SellStockID] bigint NULL,
        CONSTRAINT [PK_TradeTransactionStatus] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181018125116_myaccountserviceForBirjubhai')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181018125116_myaccountserviceForBirjubhai', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181022073034_MergeTxnWalletAccount')
BEGIN
    ALTER TABLE [TradePoolMaster] DROP CONSTRAINT [AK_TradePoolMaster_BidPrice_BuyServiceID_Id_SellServiceID];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181022073034_MergeTxnWalletAccount')
BEGIN
    DECLARE @var13 sysname;
    SELECT @var13 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TransactionQueue]') AND [c].[name] = N'RoutID');
    IF @var13 IS NOT NULL EXEC(N'ALTER TABLE [TransactionQueue] DROP CONSTRAINT [' + @var13 + '];');
    ALTER TABLE [TransactionQueue] DROP COLUMN [RoutID];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181022073034_MergeTxnWalletAccount')
BEGIN
    DECLARE @var14 sysname;
    SELECT @var14 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TransactionQueue]') AND [c].[name] = N'ProductID');
    IF @var14 IS NOT NULL EXEC(N'ALTER TABLE [TransactionQueue] DROP CONSTRAINT [' + @var14 + '];');
    ALTER TABLE [TransactionQueue] ALTER COLUMN [ProductID] bigint NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181022073034_MergeTxnWalletAccount')
BEGIN
    ALTER TABLE [TransactionQueue] ADD [RouteID] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181022073034_MergeTxnWalletAccount')
BEGIN
    ALTER TABLE [TradePoolMaster] ADD [CountPerPrice] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181022073034_MergeTxnWalletAccount')
BEGIN
    DECLARE @var15 sysname;
    SELECT @var15 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StateMaster]') AND [c].[name] = N'CountryID');
    IF @var15 IS NOT NULL EXEC(N'ALTER TABLE [StateMaster] DROP CONSTRAINT [' + @var15 + '];');
    ALTER TABLE [StateMaster] ALTER COLUMN [CountryID] bigint NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181022073034_MergeTxnWalletAccount')
BEGIN
    ALTER TABLE [TradePoolMaster] ADD CONSTRAINT [AK_TradePoolMaster_BidPrice_BuyServiceID_CountPerPrice_Id_SellServiceID] UNIQUE ([BidPrice], [BuyServiceID], [CountPerPrice], [Id], [SellServiceID]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181022073034_MergeTxnWalletAccount')
BEGIN
    CREATE TABLE [CityMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NOT NULL,
        [Status] smallint NOT NULL,
        [CityName] nvarchar(30) NOT NULL,
        [StateID] bigint NOT NULL,
        CONSTRAINT [PK_CityMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181022073034_MergeTxnWalletAccount')
BEGIN
    CREATE TABLE [DepositCounterLog] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NOT NULL,
        [Status] smallint NOT NULL,
        [NewTxnID] nvarchar(max) NULL,
        [PreviousTrnID] nvarchar(max) NULL,
        [LastTrnID] nvarchar(max) NULL,
        [LastLimit] bigint NOT NULL,
        [NextBatchPrvID] nvarchar(max) NULL,
        [DepositCounterMasterId] bigint NOT NULL,
        CONSTRAINT [PK_DepositCounterLog] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181022073034_MergeTxnWalletAccount')
BEGIN
    CREATE TABLE [DepositCounterMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NOT NULL,
        [Status] smallint NOT NULL,
        [RecordCount] int NOT NULL,
        [Limit] bigint NOT NULL,
        [LastTrnID] nvarchar(max) NULL,
        [MaxLimit] bigint NOT NULL,
        [WalletTypeID] bigint NOT NULL,
        [SerProId] bigint NOT NULL,
        [PreviousTrnID] nvarchar(max) NULL,
        [TPSPickupStatus] bigint NOT NULL,
        CONSTRAINT [PK_DepositCounterMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181022073034_MergeTxnWalletAccount')
BEGIN
    CREATE TABLE [ZipCodeMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NOT NULL,
        [Status] smallint NOT NULL,
        [ZipCode] bigint NOT NULL,
        [ZipAreaName] nvarchar(30) NOT NULL,
        [CityID] bigint NOT NULL,
        CONSTRAINT [PK_ZipCodeMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181022073034_MergeTxnWalletAccount')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181022073034_MergeTxnWalletAccount', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181022105854_CompositePrimaryKeyIssueSolve')
BEGIN
    ALTER TABLE [DepositCounterMaster] DROP CONSTRAINT [PK_DepositCounterMaster];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181022105854_CompositePrimaryKeyIssueSolve')
BEGIN
    ALTER TABLE [DepositCounterMaster] ADD CONSTRAINT [AK_DepositCounterMaster_SerProId_WalletTypeID] UNIQUE ([SerProId], [WalletTypeID]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181022105854_CompositePrimaryKeyIssueSolve')
BEGIN
    ALTER TABLE [DepositCounterMaster] ADD CONSTRAINT [PK_DepositCounterMaster] PRIMARY KEY ([WalletTypeID], [SerProId]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181022105854_CompositePrimaryKeyIssueSolve')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181022105854_CompositePrimaryKeyIssueSolve', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181023074147_DepositCounterMaster')
BEGIN
    ALTER TABLE [DepositHistorys] DROP CONSTRAINT [PK_DepositHistorys];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181023074147_DepositCounterMaster')
BEGIN
    EXEC sp_rename N'[DepositHistorys]', N'DepositHistory';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181023074147_DepositCounterMaster')
BEGIN
    ALTER TABLE [DepositCounterMaster] ADD [prevIterationID] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181023074147_DepositCounterMaster')
BEGIN
    ALTER TABLE [DepositHistory] ADD CONSTRAINT [AK_DepositHistory_Address_TrnID] UNIQUE ([Address], [TrnID]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181023074147_DepositCounterMaster')
BEGIN
    ALTER TABLE [DepositHistory] ADD CONSTRAINT [PK_DepositHistory] PRIMARY KEY ([TrnID], [Address]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181023074147_DepositCounterMaster')
BEGIN
    CREATE TABLE [TradeGraphDetail] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NOT NULL,
        [Status] smallint NOT NULL,
        [PairId] bigint NOT NULL,
        [DataDate] datetime2 NOT NULL,
        [Volume] decimal(18, 8) NOT NULL,
        [High] decimal(18, 8) NOT NULL,
        [Low] decimal(18, 8) NOT NULL,
        [TodayClose] decimal(18, 8) NOT NULL,
        [TodayOpen] decimal(18, 8) NOT NULL,
        CONSTRAINT [PK_TradeGraphDetail] PRIMARY KEY ([Id], [PairId], [DataDate]),
        CONSTRAINT [AK_TradeGraphDetail_DataDate_Id_PairId] UNIQUE ([DataDate], [Id], [PairId])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181023074147_DepositCounterMaster')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181023074147_DepositCounterMaster', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181023122116_CHECKIDENT')
BEGIN
    DBCC CHECKIDENT ('ServiceMaster', RESEED, 1000000);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181023122116_CHECKIDENT')
BEGIN
    DBCC CHECKIDENT ('ServiceProviderDetail', RESEED, 3000000);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181023122116_CHECKIDENT')
BEGIN
    DBCC CHECKIDENT ('ServiceProviderMaster', RESEED, 2000000);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181023122116_CHECKIDENT')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181023122116_CHECKIDENT', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181024053304_WalletEntity')
BEGIN
    EXEC sp_rename N'[DepositHistory].[userId]', N'UserId', N'COLUMN';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181024053304_WalletEntity')
BEGIN
    ALTER TABLE [WalletLimitConfiguration] ADD [LifeTime] decimal(18, 2) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181024053304_WalletEntity')
BEGIN
    DECLARE @var16 sysname;
    SELECT @var16 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[DepositHistory]') AND [c].[name] = N'EpochTimePure');
    IF @var16 IS NOT NULL EXEC(N'ALTER TABLE [DepositHistory] DROP CONSTRAINT [' + @var16 + '];');
    ALTER TABLE [DepositHistory] ALTER COLUMN [EpochTimePure] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181024053304_WalletEntity')
BEGIN
    CREATE TABLE [BizUserTypeMapping] (
        [Id] bigint NOT NULL IDENTITY,
        [UserID] bigint NOT NULL,
        [UserType] smallint NOT NULL,
        CONSTRAINT [PK_BizUserTypeMapping] PRIMARY KEY ([UserID])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181024053304_WalletEntity')
BEGIN
    CREATE TABLE [MemberShadowBalance] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NOT NULL,
        [Status] smallint NOT NULL,
        [WalletID] bigint NOT NULL,
        [ShadowAmount] decimal(18, 8) NOT NULL,
        [Remarks] nvarchar(max) NULL,
        CONSTRAINT [PK_MemberShadowBalance] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181024053304_WalletEntity')
BEGIN
    CREATE TABLE [MemberShadowLimit] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NOT NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [MemberTypeId] bigint NOT NULL,
        [ShadowLimitAmount] decimal(18, 8) NOT NULL,
        [Type] bigint NOT NULL,
        CONSTRAINT [PK_MemberShadowLimit] PRIMARY KEY ([MemberTypeId])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181024053304_WalletEntity')
BEGIN
    CREATE TABLE [StckingScheme] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NOT NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [MemberTypeId] bigint NOT NULL,
        [LimitAmount] decimal(18, 8) NOT NULL,
        [Type] bigint NOT NULL,
        CONSTRAINT [PK_StckingScheme] PRIMARY KEY ([MemberTypeId])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181024053304_WalletEntity')
BEGIN
    CREATE TABLE [UserStacking] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NOT NULL,
        [Status] smallint NOT NULL,
        [UserId] bigint NOT NULL,
        [StackingAmount] decimal(18, 8) NOT NULL,
        [Type] nvarchar(50) NOT NULL,
        [Remarks] nvarchar(max) NULL,
        CONSTRAINT [PK_UserStacking] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181024053304_WalletEntity')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181024053304_WalletEntity', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181024102314_ServiceWAllet24102018')
BEGIN
    ALTER TABLE [StckingScheme] DROP CONSTRAINT [PK_StckingScheme];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181024102314_ServiceWAllet24102018')
BEGIN
    ALTER TABLE [MemberShadowLimit] DROP CONSTRAINT [PK_MemberShadowLimit];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181024102314_ServiceWAllet24102018')
BEGIN
    EXEC sp_rename N'[UserStacking].[UserId]', N'SchemeId', N'COLUMN';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181024102314_ServiceWAllet24102018')
BEGIN
    EXEC sp_rename N'[UserStacking].[Type]', N'WalletType', N'COLUMN';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181024102314_ServiceWAllet24102018')
BEGIN
    EXEC sp_rename N'[StckingScheme].[Type]', N'WalletType', N'COLUMN';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181024102314_ServiceWAllet24102018')
BEGIN
    EXEC sp_rename N'[StckingScheme].[LimitAmount]', N'MinLimitAmount', N'COLUMN';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181024102314_ServiceWAllet24102018')
BEGIN
    EXEC sp_rename N'[StckingScheme].[MemberTypeId]', N'Percent', N'COLUMN';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181024102314_ServiceWAllet24102018')
BEGIN
    EXEC sp_rename N'[MemberShadowLimit].[Type]', N'WalletType', N'COLUMN';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181024102314_ServiceWAllet24102018')
BEGIN
    ALTER TABLE [StckingScheme] ADD [MaxLimitAmount] decimal(18, 8) NOT NULL DEFAULT 0.0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181024102314_ServiceWAllet24102018')
BEGIN
    ALTER TABLE [StckingScheme] ADD [TimePeriod] nvarchar(max) NOT NULL DEFAULT N'';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181024102314_ServiceWAllet24102018')
BEGIN
    ALTER TABLE [MemberShadowBalance] ADD [MemberShadowLimitId] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181024102314_ServiceWAllet24102018')
BEGIN
    ALTER TABLE [MemberShadowBalance] ADD [WalletTypeId] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181024102314_ServiceWAllet24102018')
BEGIN
    DECLARE @var17 sysname;
    SELECT @var17 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[DeviceMaster]') AND [c].[name] = N'DeviceId');
    IF @var17 IS NOT NULL EXEC(N'ALTER TABLE [DeviceMaster] DROP CONSTRAINT [' + @var17 + '];');
    ALTER TABLE [DeviceMaster] ALTER COLUMN [DeviceId] nvarchar(2000) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181024102314_ServiceWAllet24102018')
BEGIN
    ALTER TABLE [StckingScheme] ADD CONSTRAINT [PK_StckingScheme] PRIMARY KEY ([Id]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181024102314_ServiceWAllet24102018')
BEGIN
    ALTER TABLE [MemberShadowLimit] ADD CONSTRAINT [PK_MemberShadowLimit] PRIMARY KEY ([Id]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181024102314_ServiceWAllet24102018')
BEGIN
    CREATE TABLE [ServiceTypeMapping] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NOT NULL,
        [Status] smallint NOT NULL,
        [ServiceId] bigint NOT NULL,
        [TrnType] bigint NOT NULL,
        CONSTRAINT [PK_ServiceTypeMapping] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181024102314_ServiceWAllet24102018')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181024102314_ServiceWAllet24102018', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181024142147_WalletMigration24102018_2')
BEGIN
    ALTER TABLE [StckingScheme] DROP CONSTRAINT [PK_StckingScheme];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181024142147_WalletMigration24102018_2')
BEGIN
    ALTER TABLE [MemberShadowLimit] DROP CONSTRAINT [PK_MemberShadowLimit];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181024142147_WalletMigration24102018_2')
BEGIN
    ALTER TABLE [UserStacking] ADD [WalletId] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181024142147_WalletMigration24102018_2')
BEGIN
    ALTER TABLE [StckingScheme] ADD CONSTRAINT [PK_StckingScheme] PRIMARY KEY ([WalletType]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181024142147_WalletMigration24102018_2')
BEGIN
    ALTER TABLE [MemberShadowLimit] ADD CONSTRAINT [PK_MemberShadowLimit] PRIMARY KEY ([MemberTypeId]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181024142147_WalletMigration24102018_2')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181024142147_WalletMigration24102018_2', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181025070950_BeneTables25102018')
BEGIN
    DECLARE @var18 sysname;
    SELECT @var18 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradePairDetail]') AND [c].[name] = N'CurrencyPrice');
    IF @var18 IS NOT NULL EXEC(N'ALTER TABLE [TradePairDetail] DROP CONSTRAINT [' + @var18 + '];');
    ALTER TABLE [TradePairDetail] DROP COLUMN [CurrencyPrice];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181025070950_BeneTables25102018')
BEGIN
    DECLARE @var19 sysname;
    SELECT @var19 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradePairDetail]') AND [c].[name] = N'Currentrate');
    IF @var19 IS NOT NULL EXEC(N'ALTER TABLE [TradePairDetail] DROP CONSTRAINT [' + @var19 + '];');
    ALTER TABLE [TradePairDetail] DROP COLUMN [Currentrate];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181025070950_BeneTables25102018')
BEGIN
    DECLARE @var20 sysname;
    SELECT @var20 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradePairDetail]') AND [c].[name] = N'DailyHigh');
    IF @var20 IS NOT NULL EXEC(N'ALTER TABLE [TradePairDetail] DROP CONSTRAINT [' + @var20 + '];');
    ALTER TABLE [TradePairDetail] DROP COLUMN [DailyHigh];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181025070950_BeneTables25102018')
BEGIN
    DECLARE @var21 sysname;
    SELECT @var21 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradePairDetail]') AND [c].[name] = N'DailyLow');
    IF @var21 IS NOT NULL EXEC(N'ALTER TABLE [TradePairDetail] DROP CONSTRAINT [' + @var21 + '];');
    ALTER TABLE [TradePairDetail] DROP COLUMN [DailyLow];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181025070950_BeneTables25102018')
BEGIN
    DECLARE @var22 sysname;
    SELECT @var22 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradePairDetail]') AND [c].[name] = N'FeeType');
    IF @var22 IS NOT NULL EXEC(N'ALTER TABLE [TradePairDetail] DROP CONSTRAINT [' + @var22 + '];');
    ALTER TABLE [TradePairDetail] DROP COLUMN [FeeType];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181025070950_BeneTables25102018')
BEGIN
    EXEC sp_rename N'[TradePairDetail].[Volume]', N'SellFees', N'COLUMN';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181025070950_BeneTables25102018')
BEGIN
    EXEC sp_rename N'[TradePairDetail].[Fee]', N'BuyFees', N'COLUMN';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181025070950_BeneTables25102018')
BEGIN
    EXEC sp_rename N'[TradeGraphDetail].[Low]', N'LowWeek', N'COLUMN';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181025070950_BeneTables25102018')
BEGIN
    EXEC sp_rename N'[TradeGraphDetail].[High]', N'Low52Week', N'COLUMN';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181025070950_BeneTables25102018')
BEGIN
    ALTER TABLE [TradePairDetail] ADD [FeesCurrency] nvarchar(max) NOT NULL DEFAULT N'';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181025070950_BeneTables25102018')
BEGIN
    ALTER TABLE [TradeGraphDetail] ADD [High24Hr] decimal(18, 8) NOT NULL DEFAULT 0.0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181025070950_BeneTables25102018')
BEGIN
    ALTER TABLE [TradeGraphDetail] ADD [High52Week] decimal(18, 8) NOT NULL DEFAULT 0.0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181025070950_BeneTables25102018')
BEGIN
    ALTER TABLE [TradeGraphDetail] ADD [HighWeek] decimal(18, 8) NOT NULL DEFAULT 0.0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181025070950_BeneTables25102018')
BEGIN
    ALTER TABLE [TradeGraphDetail] ADD [LTP] decimal(18, 8) NOT NULL DEFAULT 0.0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181025070950_BeneTables25102018')
BEGIN
    ALTER TABLE [TradeGraphDetail] ADD [Low24Hr] decimal(18, 8) NOT NULL DEFAULT 0.0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181025070950_BeneTables25102018')
BEGIN
    CREATE TABLE [BeneficiaryMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NOT NULL,
        [Status] smallint NOT NULL,
        [UserID] bigint NOT NULL,
        [Address] nvarchar(max) NOT NULL,
        [Name] nvarchar(max) NULL,
        [WalletTypeID] bigint NOT NULL,
        [IsWhiteListed] smallint NOT NULL,
        CONSTRAINT [PK_BeneficiaryMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181025070950_BeneTables25102018')
BEGIN
    CREATE TABLE [Market] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NOT NULL,
        [Status] smallint NOT NULL,
        [CurrencyName] nvarchar(max) NOT NULL,
        [isBaseCurrency] smallint NOT NULL,
        [ServiceID] bigint NOT NULL,
        CONSTRAINT [PK_Market] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181025070950_BeneTables25102018')
BEGIN
    CREATE TABLE [TradePairStastics] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NOT NULL,
        [Status] smallint NOT NULL,
        [PairId] bigint NOT NULL,
        [CurrentRate] decimal(18, 8) NOT NULL,
        [LTP] decimal(18, 8) NOT NULL,
        [ChangePer24] decimal(18, 8) NOT NULL,
        [ChangeVol24] decimal(18, 8) NOT NULL,
        [High24Hr] decimal(18, 8) NOT NULL,
        [Low24Hr] decimal(18, 8) NOT NULL,
        [HighWeek] decimal(18, 8) NOT NULL,
        [LowWeek] decimal(18, 8) NOT NULL,
        [High52Week] decimal(18, 8) NOT NULL,
        [Low52Week] decimal(18, 8) NOT NULL,
        [CurrencyPrice] decimal(18, 8) NOT NULL,
        [UpDownBit] smallint NOT NULL,
        CONSTRAINT [PK_TradePairStastics] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181025070950_BeneTables25102018')
BEGIN
    CREATE TABLE [UserPreferencesMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NOT NULL,
        [Status] smallint NOT NULL,
        [UserID] bigint NOT NULL,
        [IsWhitelisting] smallint NOT NULL,
        CONSTRAINT [PK_UserPreferencesMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181025070950_BeneTables25102018')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181025070950_BeneTables25102018', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181026043917_WalletShadowBal')
BEGIN
    DECLARE @var23 sysname;
    SELECT @var23 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ThirdPartyAPIConfiguration]') AND [c].[name] = N'SerProConfigurationID');
    IF @var23 IS NOT NULL EXEC(N'ALTER TABLE [ThirdPartyAPIConfiguration] DROP CONSTRAINT [' + @var23 + '];');
    ALTER TABLE [ThirdPartyAPIConfiguration] DROP COLUMN [SerProConfigurationID];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181026043917_WalletShadowBal')
BEGIN
    ALTER TABLE [WalletTransactionQueues] ADD [WalletTrnType] int NOT NULL DEFAULT 0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181026043917_WalletShadowBal')
BEGIN
    ALTER TABLE [WalletLimitConfiguration] ADD [EndTime] time NOT NULL DEFAULT '00:00:00';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181026043917_WalletShadowBal')
BEGIN
    ALTER TABLE [WalletLimitConfiguration] ADD [StartTime] time NOT NULL DEFAULT '00:00:00';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181026043917_WalletShadowBal')
BEGIN
    ALTER TABLE [ThirdPartyAPIConfiguration] ADD [TimeStamp] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181026043917_WalletShadowBal')
BEGIN
    ALTER TABLE [RouteConfiguration] ADD [ConvertAmount] decimal(18, 8) NOT NULL DEFAULT 0.0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181026043917_WalletShadowBal')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181026043917_WalletShadowBal', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181026104105_GraphData')
BEGIN
    ALTER TABLE [TradeGraphDetail] DROP CONSTRAINT [AK_TradeGraphDetail_DataDate_Id_PairId];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181026104105_GraphData')
BEGIN
    ALTER TABLE [TradeGraphDetail] DROP CONSTRAINT [PK_TradeGraphDetail];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181026104105_GraphData')
BEGIN
    ALTER TABLE [WalletTypeMasters] ADD [IsDefaultWallet] smallint NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181026104105_GraphData')
BEGIN
    ALTER TABLE [TradeGraphDetail] ADD [TranNo] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181026104105_GraphData')
BEGIN
    ALTER TABLE [TradeGraphDetail] ADD [ChangePer] decimal(18, 8) NOT NULL DEFAULT 0.0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181026104105_GraphData')
BEGIN
    ALTER TABLE [TradeGraphDetail] ADD CONSTRAINT [AK_TradeGraphDetail_TranNo] UNIQUE ([TranNo]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181026104105_GraphData')
BEGIN
    ALTER TABLE [TradeGraphDetail] ADD CONSTRAINT [PK_TradeGraphDetail] PRIMARY KEY ([Id], [TranNo]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181026104105_GraphData')
BEGIN
    CREATE TABLE [WalletLimitConfigurationMaster] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NOT NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [TrnType] int NOT NULL,
        [LimitPerHour] decimal(18, 2) NOT NULL,
        [LimitPerDay] decimal(18, 2) NOT NULL,
        [LimitPerTransaction] decimal(18, 2) NOT NULL,
        [LifeTime] decimal(18, 2) NULL,
        [StartTime] time NOT NULL,
        [EndTime] time NOT NULL,
        CONSTRAINT [PK_WalletLimitConfigurationMaster] PRIMARY KEY ([TrnType])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181026104105_GraphData')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181026104105_GraphData', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181026135538_PoolGUID')
BEGIN
    DECLARE @var24 sysname;
    SELECT @var24 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletLimitConfiguration]') AND [c].[name] = N'StartTime');
    IF @var24 IS NOT NULL EXEC(N'ALTER TABLE [WalletLimitConfiguration] DROP CONSTRAINT [' + @var24 + '];');
    ALTER TABLE [WalletLimitConfiguration] ALTER COLUMN [StartTime] time NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181026135538_PoolGUID')
BEGIN
    DECLARE @var25 sysname;
    SELECT @var25 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletLimitConfiguration]') AND [c].[name] = N'EndTime');
    IF @var25 IS NOT NULL EXEC(N'ALTER TABLE [WalletLimitConfiguration] DROP CONSTRAINT [' + @var25 + '];');
    ALTER TABLE [WalletLimitConfiguration] ALTER COLUMN [EndTime] time NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181026135538_PoolGUID')
BEGIN
    ALTER TABLE [TradePoolMaster] ADD [GUID] uniqueidentifier NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181026135538_PoolGUID')
BEGIN
    ALTER TABLE [TradePoolMaster] ADD [PairId] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181026135538_PoolGUID')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181026135538_PoolGUID', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181027111132_TransactionRequest')
BEGIN
    DECLARE @var26 sysname;
    SELECT @var26 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradePoolMaster]') AND [c].[name] = N'BidPrice');
    IF @var26 IS NOT NULL EXEC(N'ALTER TABLE [TradePoolMaster] DROP CONSTRAINT [' + @var26 + '];');
    ALTER TABLE [TradePoolMaster] ALTER COLUMN [BidPrice] decimal(18, 8) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181027111132_TransactionRequest')
BEGIN
    CREATE TABLE [TransactionRequest] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NOT NULL,
        [Status] smallint NOT NULL,
        [TrnNo] bigint NOT NULL,
        [ServiceID] bigint NOT NULL,
        [SerProID] bigint NOT NULL,
        [SerProDetailID] bigint NOT NULL,
        [RequestData] nvarchar(max) NOT NULL,
        [ResponseTime] datetime2 NOT NULL,
        [ResponseData] nvarchar(max) NULL,
        [TrnID] nvarchar(max) NULL,
        [OprTrnID] nvarchar(max) NULL,
        CONSTRAINT [PK_TransactionRequest] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181027111132_TransactionRequest')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181027111132_TransactionRequest', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029063335_userloggerdatad29102018')
BEGIN
    CREATE TABLE [UserLogChange] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NOT NULL,
        [Status] smallint NOT NULL,
        [UserId] bigint NOT NULL,
        [Oldvalue] nvarchar(max) NULL,
        [Newvalue] nvarchar(max) NULL,
        CONSTRAINT [PK_UserLogChange] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029063335_userloggerdatad29102018')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181029063335_userloggerdatad29102018', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var27 sysname;
    SELECT @var27 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ZipCodeMaster]') AND [c].[name] = N'UpdatedDate');
    IF @var27 IS NOT NULL EXEC(N'ALTER TABLE [ZipCodeMaster] DROP CONSTRAINT [' + @var27 + '];');
    ALTER TABLE [ZipCodeMaster] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var28 sysname;
    SELECT @var28 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletTypeMasters]') AND [c].[name] = N'UpdatedDate');
    IF @var28 IS NOT NULL EXEC(N'ALTER TABLE [WalletTypeMasters] DROP CONSTRAINT [' + @var28 + '];');
    ALTER TABLE [WalletTypeMasters] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var29 sysname;
    SELECT @var29 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletOrders]') AND [c].[name] = N'UpdatedDate');
    IF @var29 IS NOT NULL EXEC(N'ALTER TABLE [WalletOrders] DROP CONSTRAINT [' + @var29 + '];');
    ALTER TABLE [WalletOrders] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var30 sysname;
    SELECT @var30 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletMasters]') AND [c].[name] = N'UpdatedDate');
    IF @var30 IS NOT NULL EXEC(N'ALTER TABLE [WalletMasters] DROP CONSTRAINT [' + @var30 + '];');
    ALTER TABLE [WalletMasters] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var31 sysname;
    SELECT @var31 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletLimitConfigurationMaster]') AND [c].[name] = N'UpdatedDate');
    IF @var31 IS NOT NULL EXEC(N'ALTER TABLE [WalletLimitConfigurationMaster] DROP CONSTRAINT [' + @var31 + '];');
    ALTER TABLE [WalletLimitConfigurationMaster] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var32 sysname;
    SELECT @var32 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletLimitConfiguration]') AND [c].[name] = N'UpdatedDate');
    IF @var32 IS NOT NULL EXEC(N'ALTER TABLE [WalletLimitConfiguration] DROP CONSTRAINT [' + @var32 + '];');
    ALTER TABLE [WalletLimitConfiguration] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var33 sysname;
    SELECT @var33 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletLedgers]') AND [c].[name] = N'UpdatedDate');
    IF @var33 IS NOT NULL EXEC(N'ALTER TABLE [WalletLedgers] DROP CONSTRAINT [' + @var33 + '];');
    ALTER TABLE [WalletLedgers] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var34 sysname;
    SELECT @var34 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletAllowTrns]') AND [c].[name] = N'UpdatedDate');
    IF @var34 IS NOT NULL EXEC(N'ALTER TABLE [WalletAllowTrns] DROP CONSTRAINT [' + @var34 + '];');
    ALTER TABLE [WalletAllowTrns] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var35 sysname;
    SELECT @var35 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[UserStacking]') AND [c].[name] = N'UpdatedDate');
    IF @var35 IS NOT NULL EXEC(N'ALTER TABLE [UserStacking] DROP CONSTRAINT [' + @var35 + '];');
    ALTER TABLE [UserStacking] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var36 sysname;
    SELECT @var36 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[UserPreferencesMaster]') AND [c].[name] = N'UpdatedDate');
    IF @var36 IS NOT NULL EXEC(N'ALTER TABLE [UserPreferencesMaster] DROP CONSTRAINT [' + @var36 + '];');
    ALTER TABLE [UserPreferencesMaster] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var37 sysname;
    SELECT @var37 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[UserLogChange]') AND [c].[name] = N'UpdatedDate');
    IF @var37 IS NOT NULL EXEC(N'ALTER TABLE [UserLogChange] DROP CONSTRAINT [' + @var37 + '];');
    ALTER TABLE [UserLogChange] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var38 sysname;
    SELECT @var38 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TrnAcBatch]') AND [c].[name] = N'UpdatedDate');
    IF @var38 IS NOT NULL EXEC(N'ALTER TABLE [TrnAcBatch] DROP CONSTRAINT [' + @var38 + '];');
    ALTER TABLE [TrnAcBatch] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var39 sysname;
    SELECT @var39 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TransactionRequest]') AND [c].[name] = N'UpdatedDate');
    IF @var39 IS NOT NULL EXEC(N'ALTER TABLE [TransactionRequest] DROP CONSTRAINT [' + @var39 + '];');
    ALTER TABLE [TransactionRequest] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var40 sysname;
    SELECT @var40 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TransactionQueue]') AND [c].[name] = N'UpdatedDate');
    IF @var40 IS NOT NULL EXEC(N'ALTER TABLE [TransactionQueue] DROP CONSTRAINT [' + @var40 + '];');
    ALTER TABLE [TransactionQueue] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var41 sysname;
    SELECT @var41 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TransactionAccounts]') AND [c].[name] = N'UpdatedDate');
    IF @var41 IS NOT NULL EXEC(N'ALTER TABLE [TransactionAccounts] DROP CONSTRAINT [' + @var41 + '];');
    ALTER TABLE [TransactionAccounts] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var42 sysname;
    SELECT @var42 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeTransactionStatus]') AND [c].[name] = N'UpdatedDate');
    IF @var42 IS NOT NULL EXEC(N'ALTER TABLE [TradeTransactionStatus] DROP CONSTRAINT [' + @var42 + '];');
    ALTER TABLE [TradeTransactionStatus] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var43 sysname;
    SELECT @var43 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeTransactionQueue]') AND [c].[name] = N'UpdatedDate');
    IF @var43 IS NOT NULL EXEC(N'ALTER TABLE [TradeTransactionQueue] DROP CONSTRAINT [' + @var43 + '];');
    ALTER TABLE [TradeTransactionQueue] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var44 sysname;
    SELECT @var44 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeStopLoss]') AND [c].[name] = N'UpdatedDate');
    IF @var44 IS NOT NULL EXEC(N'ALTER TABLE [TradeStopLoss] DROP CONSTRAINT [' + @var44 + '];');
    ALTER TABLE [TradeStopLoss] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var45 sysname;
    SELECT @var45 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradePoolMaster]') AND [c].[name] = N'UpdatedDate');
    IF @var45 IS NOT NULL EXEC(N'ALTER TABLE [TradePoolMaster] DROP CONSTRAINT [' + @var45 + '];');
    ALTER TABLE [TradePoolMaster] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var46 sysname;
    SELECT @var46 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradePairStastics]') AND [c].[name] = N'UpdatedDate');
    IF @var46 IS NOT NULL EXEC(N'ALTER TABLE [TradePairStastics] DROP CONSTRAINT [' + @var46 + '];');
    ALTER TABLE [TradePairStastics] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var47 sysname;
    SELECT @var47 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradePairMaster]') AND [c].[name] = N'UpdatedDate');
    IF @var47 IS NOT NULL EXEC(N'ALTER TABLE [TradePairMaster] DROP CONSTRAINT [' + @var47 + '];');
    ALTER TABLE [TradePairMaster] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var48 sysname;
    SELECT @var48 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradePairDetail]') AND [c].[name] = N'UpdatedDate');
    IF @var48 IS NOT NULL EXEC(N'ALTER TABLE [TradePairDetail] DROP CONSTRAINT [' + @var48 + '];');
    ALTER TABLE [TradePairDetail] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var49 sysname;
    SELECT @var49 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeGraphDetail]') AND [c].[name] = N'UpdatedDate');
    IF @var49 IS NOT NULL EXEC(N'ALTER TABLE [TradeGraphDetail] DROP CONSTRAINT [' + @var49 + '];');
    ALTER TABLE [TradeGraphDetail] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var50 sysname;
    SELECT @var50 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeCancelQueue]') AND [c].[name] = N'UpdatedDate');
    IF @var50 IS NOT NULL EXEC(N'ALTER TABLE [TradeCancelQueue] DROP CONSTRAINT [' + @var50 + '];');
    ALTER TABLE [TradeCancelQueue] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var51 sysname;
    SELECT @var51 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeBuyRequest]') AND [c].[name] = N'UpdatedDate');
    IF @var51 IS NOT NULL EXEC(N'ALTER TABLE [TradeBuyRequest] DROP CONSTRAINT [' + @var51 + '];');
    ALTER TABLE [TradeBuyRequest] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var52 sysname;
    SELECT @var52 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeBitGoDelayAddressess]') AND [c].[name] = N'UpdatedDate');
    IF @var52 IS NOT NULL EXEC(N'ALTER TABLE [TradeBitGoDelayAddressess] DROP CONSTRAINT [' + @var52 + '];');
    ALTER TABLE [TradeBitGoDelayAddressess] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var53 sysname;
    SELECT @var53 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ThirdPartyAPIResponseConfiguration]') AND [c].[name] = N'UpdatedDate');
    IF @var53 IS NOT NULL EXEC(N'ALTER TABLE [ThirdPartyAPIResponseConfiguration] DROP CONSTRAINT [' + @var53 + '];');
    ALTER TABLE [ThirdPartyAPIResponseConfiguration] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var54 sysname;
    SELECT @var54 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ThirdPartyAPIConfiguration]') AND [c].[name] = N'UpdatedDate');
    IF @var54 IS NOT NULL EXEC(N'ALTER TABLE [ThirdPartyAPIConfiguration] DROP CONSTRAINT [' + @var54 + '];');
    ALTER TABLE [ThirdPartyAPIConfiguration] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var55 sysname;
    SELECT @var55 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TempUserRegister]') AND [c].[name] = N'UpdatedDate');
    IF @var55 IS NOT NULL EXEC(N'ALTER TABLE [TempUserRegister] DROP CONSTRAINT [' + @var55 + '];');
    ALTER TABLE [TempUserRegister] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var56 sysname;
    SELECT @var56 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TempOtpMaster]') AND [c].[name] = N'UpdatedDate');
    IF @var56 IS NOT NULL EXEC(N'ALTER TABLE [TempOtpMaster] DROP CONSTRAINT [' + @var56 + '];');
    ALTER TABLE [TempOtpMaster] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var57 sysname;
    SELECT @var57 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TemplateMaster]') AND [c].[name] = N'UpdatedDate');
    IF @var57 IS NOT NULL EXEC(N'ALTER TABLE [TemplateMaster] DROP CONSTRAINT [' + @var57 + '];');
    ALTER TABLE [TemplateMaster] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var58 sysname;
    SELECT @var58 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StckingScheme]') AND [c].[name] = N'UpdatedDate');
    IF @var58 IS NOT NULL EXEC(N'ALTER TABLE [StckingScheme] DROP CONSTRAINT [' + @var58 + '];');
    ALTER TABLE [StckingScheme] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var59 sysname;
    SELECT @var59 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StateMaster]') AND [c].[name] = N'UpdatedDate');
    IF @var59 IS NOT NULL EXEC(N'ALTER TABLE [StateMaster] DROP CONSTRAINT [' + @var59 + '];');
    ALTER TABLE [StateMaster] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var60 sysname;
    SELECT @var60 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ServiceTypeMaster]') AND [c].[name] = N'UpdatedDate');
    IF @var60 IS NOT NULL EXEC(N'ALTER TABLE [ServiceTypeMaster] DROP CONSTRAINT [' + @var60 + '];');
    ALTER TABLE [ServiceTypeMaster] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var61 sysname;
    SELECT @var61 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ServiceTypeMapping]') AND [c].[name] = N'UpdatedDate');
    IF @var61 IS NOT NULL EXEC(N'ALTER TABLE [ServiceTypeMapping] DROP CONSTRAINT [' + @var61 + '];');
    ALTER TABLE [ServiceTypeMapping] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var62 sysname;
    SELECT @var62 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ServiceStastics]') AND [c].[name] = N'UpdatedDate');
    IF @var62 IS NOT NULL EXEC(N'ALTER TABLE [ServiceStastics] DROP CONSTRAINT [' + @var62 + '];');
    ALTER TABLE [ServiceStastics] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var63 sysname;
    SELECT @var63 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ServiceProviderType]') AND [c].[name] = N'UpdatedDate');
    IF @var63 IS NOT NULL EXEC(N'ALTER TABLE [ServiceProviderType] DROP CONSTRAINT [' + @var63 + '];');
    ALTER TABLE [ServiceProviderType] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var64 sysname;
    SELECT @var64 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ServiceProviderMaster]') AND [c].[name] = N'UpdatedDate');
    IF @var64 IS NOT NULL EXEC(N'ALTER TABLE [ServiceProviderMaster] DROP CONSTRAINT [' + @var64 + '];');
    ALTER TABLE [ServiceProviderMaster] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var65 sysname;
    SELECT @var65 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ServiceProviderDetail]') AND [c].[name] = N'UpdatedDate');
    IF @var65 IS NOT NULL EXEC(N'ALTER TABLE [ServiceProviderDetail] DROP CONSTRAINT [' + @var65 + '];');
    ALTER TABLE [ServiceProviderDetail] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var66 sysname;
    SELECT @var66 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ServiceProConfiguration]') AND [c].[name] = N'UpdatedDate');
    IF @var66 IS NOT NULL EXEC(N'ALTER TABLE [ServiceProConfiguration] DROP CONSTRAINT [' + @var66 + '];');
    ALTER TABLE [ServiceProConfiguration] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var67 sysname;
    SELECT @var67 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ServiceMaster]') AND [c].[name] = N'UpdatedDate');
    IF @var67 IS NOT NULL EXEC(N'ALTER TABLE [ServiceMaster] DROP CONSTRAINT [' + @var67 + '];');
    ALTER TABLE [ServiceMaster] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var68 sysname;
    SELECT @var68 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ServiceDetail]') AND [c].[name] = N'UpdatedDate');
    IF @var68 IS NOT NULL EXEC(N'ALTER TABLE [ServiceDetail] DROP CONSTRAINT [' + @var68 + '];');
    ALTER TABLE [ServiceDetail] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var69 sysname;
    SELECT @var69 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RouteConfiguration]') AND [c].[name] = N'UpdatedDate');
    IF @var69 IS NOT NULL EXEC(N'ALTER TABLE [RouteConfiguration] DROP CONSTRAINT [' + @var69 + '];');
    ALTER TABLE [RouteConfiguration] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var70 sysname;
    SELECT @var70 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RequestFormatMaster]') AND [c].[name] = N'UpdatedDate');
    IF @var70 IS NOT NULL EXEC(N'ALTER TABLE [RequestFormatMaster] DROP CONSTRAINT [' + @var70 + '];');
    ALTER TABLE [RequestFormatMaster] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var71 sysname;
    SELECT @var71 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RegisterType]') AND [c].[name] = N'UpdatedDate');
    IF @var71 IS NOT NULL EXEC(N'ALTER TABLE [RegisterType] DROP CONSTRAINT [' + @var71 + '];');
    ALTER TABLE [RegisterType] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var72 sysname;
    SELECT @var72 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ProductConfiguration]') AND [c].[name] = N'UpdatedDate');
    IF @var72 IS NOT NULL EXEC(N'ALTER TABLE [ProductConfiguration] DROP CONSTRAINT [' + @var72 + '];');
    ALTER TABLE [ProductConfiguration] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var73 sysname;
    SELECT @var73 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PoolOrder]') AND [c].[name] = N'UpdatedDate');
    IF @var73 IS NOT NULL EXEC(N'ALTER TABLE [PoolOrder] DROP CONSTRAINT [' + @var73 + '];');
    ALTER TABLE [PoolOrder] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var74 sysname;
    SELECT @var74 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[OtpMaster]') AND [c].[name] = N'UpdatedDate');
    IF @var74 IS NOT NULL EXEC(N'ALTER TABLE [OtpMaster] DROP CONSTRAINT [' + @var74 + '];');
    ALTER TABLE [OtpMaster] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var75 sysname;
    SELECT @var75 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[NotificationQueue]') AND [c].[name] = N'UpdatedDate');
    IF @var75 IS NOT NULL EXEC(N'ALTER TABLE [NotificationQueue] DROP CONSTRAINT [' + @var75 + '];');
    ALTER TABLE [NotificationQueue] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var76 sysname;
    SELECT @var76 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[MessagingQueue]') AND [c].[name] = N'UpdatedDate');
    IF @var76 IS NOT NULL EXEC(N'ALTER TABLE [MessagingQueue] DROP CONSTRAINT [' + @var76 + '];');
    ALTER TABLE [MessagingQueue] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var77 sysname;
    SELECT @var77 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[MemberShadowLimit]') AND [c].[name] = N'UpdatedDate');
    IF @var77 IS NOT NULL EXEC(N'ALTER TABLE [MemberShadowLimit] DROP CONSTRAINT [' + @var77 + '];');
    ALTER TABLE [MemberShadowLimit] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var78 sysname;
    SELECT @var78 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[MemberShadowBalance]') AND [c].[name] = N'UpdatedDate');
    IF @var78 IS NOT NULL EXEC(N'ALTER TABLE [MemberShadowBalance] DROP CONSTRAINT [' + @var78 + '];');
    ALTER TABLE [MemberShadowBalance] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var79 sysname;
    SELECT @var79 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Market]') AND [c].[name] = N'UpdatedDate');
    IF @var79 IS NOT NULL EXEC(N'ALTER TABLE [Market] DROP CONSTRAINT [' + @var79 + '];');
    ALTER TABLE [Market] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var80 sysname;
    SELECT @var80 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Limits]') AND [c].[name] = N'UpdatedDate');
    IF @var80 IS NOT NULL EXEC(N'ALTER TABLE [Limits] DROP CONSTRAINT [' + @var80 + '];');
    ALTER TABLE [Limits] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var81 sysname;
    SELECT @var81 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[IpMaster]') AND [c].[name] = N'UpdatedDate');
    IF @var81 IS NOT NULL EXEC(N'ALTER TABLE [IpMaster] DROP CONSTRAINT [' + @var81 + '];');
    ALTER TABLE [IpMaster] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var82 sysname;
    SELECT @var82 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[EmailQueue]') AND [c].[name] = N'UpdatedDate');
    IF @var82 IS NOT NULL EXEC(N'ALTER TABLE [EmailQueue] DROP CONSTRAINT [' + @var82 + '];');
    ALTER TABLE [EmailQueue] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var83 sysname;
    SELECT @var83 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[DeviceMaster]') AND [c].[name] = N'UpdatedDate');
    IF @var83 IS NOT NULL EXEC(N'ALTER TABLE [DeviceMaster] DROP CONSTRAINT [' + @var83 + '];');
    ALTER TABLE [DeviceMaster] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var84 sysname;
    SELECT @var84 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[DepositHistory]') AND [c].[name] = N'UpdatedDate');
    IF @var84 IS NOT NULL EXEC(N'ALTER TABLE [DepositHistory] DROP CONSTRAINT [' + @var84 + '];');
    ALTER TABLE [DepositHistory] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var85 sysname;
    SELECT @var85 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[DepositCounterMaster]') AND [c].[name] = N'UpdatedDate');
    IF @var85 IS NOT NULL EXEC(N'ALTER TABLE [DepositCounterMaster] DROP CONSTRAINT [' + @var85 + '];');
    ALTER TABLE [DepositCounterMaster] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var86 sysname;
    SELECT @var86 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[DepositCounterLog]') AND [c].[name] = N'UpdatedDate');
    IF @var86 IS NOT NULL EXEC(N'ALTER TABLE [DepositCounterLog] DROP CONSTRAINT [' + @var86 + '];');
    ALTER TABLE [DepositCounterLog] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var87 sysname;
    SELECT @var87 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[DemonConfiguration]') AND [c].[name] = N'UpdatedDate');
    IF @var87 IS NOT NULL EXEC(N'ALTER TABLE [DemonConfiguration] DROP CONSTRAINT [' + @var87 + '];');
    ALTER TABLE [DemonConfiguration] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var88 sysname;
    SELECT @var88 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CustomPassword]') AND [c].[name] = N'UpdatedDate');
    IF @var88 IS NOT NULL EXEC(N'ALTER TABLE [CustomPassword] DROP CONSTRAINT [' + @var88 + '];');
    ALTER TABLE [CustomPassword] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var89 sysname;
    SELECT @var89 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CountryMaster]') AND [c].[name] = N'UpdatedDate');
    IF @var89 IS NOT NULL EXEC(N'ALTER TABLE [CountryMaster] DROP CONSTRAINT [' + @var89 + '];');
    ALTER TABLE [CountryMaster] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var90 sysname;
    SELECT @var90 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CommServiceTypeMaster]') AND [c].[name] = N'UpdatedDate');
    IF @var90 IS NOT NULL EXEC(N'ALTER TABLE [CommServiceTypeMaster] DROP CONSTRAINT [' + @var90 + '];');
    ALTER TABLE [CommServiceTypeMaster] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var91 sysname;
    SELECT @var91 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CommServiceproviderMaster]') AND [c].[name] = N'UpdatedDate');
    IF @var91 IS NOT NULL EXEC(N'ALTER TABLE [CommServiceproviderMaster] DROP CONSTRAINT [' + @var91 + '];');
    ALTER TABLE [CommServiceproviderMaster] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var92 sysname;
    SELECT @var92 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CommServiceMaster]') AND [c].[name] = N'UpdatedDate');
    IF @var92 IS NOT NULL EXEC(N'ALTER TABLE [CommServiceMaster] DROP CONSTRAINT [' + @var92 + '];');
    ALTER TABLE [CommServiceMaster] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var93 sysname;
    SELECT @var93 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CommAPIServiceMaster]') AND [c].[name] = N'UpdatedDate');
    IF @var93 IS NOT NULL EXEC(N'ALTER TABLE [CommAPIServiceMaster] DROP CONSTRAINT [' + @var93 + '];');
    ALTER TABLE [CommAPIServiceMaster] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var94 sysname;
    SELECT @var94 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CityMaster]') AND [c].[name] = N'UpdatedDate');
    IF @var94 IS NOT NULL EXEC(N'ALTER TABLE [CityMaster] DROP CONSTRAINT [' + @var94 + '];');
    ALTER TABLE [CityMaster] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var95 sysname;
    SELECT @var95 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[BeneficiaryMaster]') AND [c].[name] = N'UpdatedDate');
    IF @var95 IS NOT NULL EXEC(N'ALTER TABLE [BeneficiaryMaster] DROP CONSTRAINT [' + @var95 + '];');
    ALTER TABLE [BeneficiaryMaster] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var96 sysname;
    SELECT @var96 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[AppType]') AND [c].[name] = N'UpdatedDate');
    IF @var96 IS NOT NULL EXEC(N'ALTER TABLE [AppType] DROP CONSTRAINT [' + @var96 + '];');
    ALTER TABLE [AppType] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    DECLARE @var97 sysname;
    SELECT @var97 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[AddressMasters]') AND [c].[name] = N'UpdatedDate');
    IF @var97 IS NOT NULL EXEC(N'ALTER TABLE [AddressMasters] DROP CONSTRAINT [' + @var97 + '];');
    ALTER TABLE [AddressMasters] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029074312_UpdateDateAllowNull')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181029074312_UpdateDateAllowNull', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029075516_userloggerdatadforaddtype29102018')
BEGIN
    ALTER TABLE [UserLogChange] ADD [Type] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029075516_userloggerdatadforaddtype29102018')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181029075516_userloggerdatadforaddtype29102018', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    ALTER TABLE [TradeBuyRequest] DROP CONSTRAINT [PK_TradeBuyRequest];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var98 sysname;
    SELECT @var98 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ZipCodeMaster]') AND [c].[name] = N'UpdatedDate');
    IF @var98 IS NOT NULL EXEC(N'ALTER TABLE [ZipCodeMaster] DROP CONSTRAINT [' + @var98 + '];');
    ALTER TABLE [ZipCodeMaster] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var99 sysname;
    SELECT @var99 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletTypeMasters]') AND [c].[name] = N'UpdatedDate');
    IF @var99 IS NOT NULL EXEC(N'ALTER TABLE [WalletTypeMasters] DROP CONSTRAINT [' + @var99 + '];');
    ALTER TABLE [WalletTypeMasters] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var100 sysname;
    SELECT @var100 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletOrders]') AND [c].[name] = N'UpdatedDate');
    IF @var100 IS NOT NULL EXEC(N'ALTER TABLE [WalletOrders] DROP CONSTRAINT [' + @var100 + '];');
    ALTER TABLE [WalletOrders] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var101 sysname;
    SELECT @var101 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletMasters]') AND [c].[name] = N'UpdatedDate');
    IF @var101 IS NOT NULL EXEC(N'ALTER TABLE [WalletMasters] DROP CONSTRAINT [' + @var101 + '];');
    ALTER TABLE [WalletMasters] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var102 sysname;
    SELECT @var102 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletLimitConfigurationMaster]') AND [c].[name] = N'UpdatedDate');
    IF @var102 IS NOT NULL EXEC(N'ALTER TABLE [WalletLimitConfigurationMaster] DROP CONSTRAINT [' + @var102 + '];');
    ALTER TABLE [WalletLimitConfigurationMaster] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var103 sysname;
    SELECT @var103 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletLimitConfiguration]') AND [c].[name] = N'UpdatedDate');
    IF @var103 IS NOT NULL EXEC(N'ALTER TABLE [WalletLimitConfiguration] DROP CONSTRAINT [' + @var103 + '];');
    ALTER TABLE [WalletLimitConfiguration] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var104 sysname;
    SELECT @var104 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletLedgers]') AND [c].[name] = N'UpdatedDate');
    IF @var104 IS NOT NULL EXEC(N'ALTER TABLE [WalletLedgers] DROP CONSTRAINT [' + @var104 + '];');
    ALTER TABLE [WalletLedgers] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var105 sysname;
    SELECT @var105 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletAllowTrns]') AND [c].[name] = N'UpdatedDate');
    IF @var105 IS NOT NULL EXEC(N'ALTER TABLE [WalletAllowTrns] DROP CONSTRAINT [' + @var105 + '];');
    ALTER TABLE [WalletAllowTrns] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var106 sysname;
    SELECT @var106 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[UserStacking]') AND [c].[name] = N'UpdatedDate');
    IF @var106 IS NOT NULL EXEC(N'ALTER TABLE [UserStacking] DROP CONSTRAINT [' + @var106 + '];');
    ALTER TABLE [UserStacking] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var107 sysname;
    SELECT @var107 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[UserPreferencesMaster]') AND [c].[name] = N'UpdatedDate');
    IF @var107 IS NOT NULL EXEC(N'ALTER TABLE [UserPreferencesMaster] DROP CONSTRAINT [' + @var107 + '];');
    ALTER TABLE [UserPreferencesMaster] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var108 sysname;
    SELECT @var108 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[UserLogChange]') AND [c].[name] = N'UpdatedDate');
    IF @var108 IS NOT NULL EXEC(N'ALTER TABLE [UserLogChange] DROP CONSTRAINT [' + @var108 + '];');
    ALTER TABLE [UserLogChange] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var109 sysname;
    SELECT @var109 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TrnAcBatch]') AND [c].[name] = N'UpdatedDate');
    IF @var109 IS NOT NULL EXEC(N'ALTER TABLE [TrnAcBatch] DROP CONSTRAINT [' + @var109 + '];');
    ALTER TABLE [TrnAcBatch] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var110 sysname;
    SELECT @var110 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TransactionRequest]') AND [c].[name] = N'UpdatedDate');
    IF @var110 IS NOT NULL EXEC(N'ALTER TABLE [TransactionRequest] DROP CONSTRAINT [' + @var110 + '];');
    ALTER TABLE [TransactionRequest] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var111 sysname;
    SELECT @var111 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TransactionQueue]') AND [c].[name] = N'UpdatedDate');
    IF @var111 IS NOT NULL EXEC(N'ALTER TABLE [TransactionQueue] DROP CONSTRAINT [' + @var111 + '];');
    ALTER TABLE [TransactionQueue] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var112 sysname;
    SELECT @var112 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TransactionAccounts]') AND [c].[name] = N'UpdatedDate');
    IF @var112 IS NOT NULL EXEC(N'ALTER TABLE [TransactionAccounts] DROP CONSTRAINT [' + @var112 + '];');
    ALTER TABLE [TransactionAccounts] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var113 sysname;
    SELECT @var113 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeTransactionStatus]') AND [c].[name] = N'UpdatedDate');
    IF @var113 IS NOT NULL EXEC(N'ALTER TABLE [TradeTransactionStatus] DROP CONSTRAINT [' + @var113 + '];');
    ALTER TABLE [TradeTransactionStatus] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var114 sysname;
    SELECT @var114 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeTransactionQueue]') AND [c].[name] = N'UpdatedDate');
    IF @var114 IS NOT NULL EXEC(N'ALTER TABLE [TradeTransactionQueue] DROP CONSTRAINT [' + @var114 + '];');
    ALTER TABLE [TradeTransactionQueue] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var115 sysname;
    SELECT @var115 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeStopLoss]') AND [c].[name] = N'UpdatedDate');
    IF @var115 IS NOT NULL EXEC(N'ALTER TABLE [TradeStopLoss] DROP CONSTRAINT [' + @var115 + '];');
    ALTER TABLE [TradeStopLoss] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var116 sysname;
    SELECT @var116 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradePoolMaster]') AND [c].[name] = N'UpdatedDate');
    IF @var116 IS NOT NULL EXEC(N'ALTER TABLE [TradePoolMaster] DROP CONSTRAINT [' + @var116 + '];');
    ALTER TABLE [TradePoolMaster] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var117 sysname;
    SELECT @var117 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradePairStastics]') AND [c].[name] = N'UpdatedDate');
    IF @var117 IS NOT NULL EXEC(N'ALTER TABLE [TradePairStastics] DROP CONSTRAINT [' + @var117 + '];');
    ALTER TABLE [TradePairStastics] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var118 sysname;
    SELECT @var118 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradePairMaster]') AND [c].[name] = N'UpdatedDate');
    IF @var118 IS NOT NULL EXEC(N'ALTER TABLE [TradePairMaster] DROP CONSTRAINT [' + @var118 + '];');
    ALTER TABLE [TradePairMaster] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var119 sysname;
    SELECT @var119 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradePairDetail]') AND [c].[name] = N'UpdatedDate');
    IF @var119 IS NOT NULL EXEC(N'ALTER TABLE [TradePairDetail] DROP CONSTRAINT [' + @var119 + '];');
    ALTER TABLE [TradePairDetail] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var120 sysname;
    SELECT @var120 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeGraphDetail]') AND [c].[name] = N'UpdatedDate');
    IF @var120 IS NOT NULL EXEC(N'ALTER TABLE [TradeGraphDetail] DROP CONSTRAINT [' + @var120 + '];');
    ALTER TABLE [TradeGraphDetail] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var121 sysname;
    SELECT @var121 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeCancelQueue]') AND [c].[name] = N'UpdatedDate');
    IF @var121 IS NOT NULL EXEC(N'ALTER TABLE [TradeCancelQueue] DROP CONSTRAINT [' + @var121 + '];');
    ALTER TABLE [TradeCancelQueue] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var122 sysname;
    SELECT @var122 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeBuyRequest]') AND [c].[name] = N'UpdatedDate');
    IF @var122 IS NOT NULL EXEC(N'ALTER TABLE [TradeBuyRequest] DROP CONSTRAINT [' + @var122 + '];');
    ALTER TABLE [TradeBuyRequest] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var123 sysname;
    SELECT @var123 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeBitGoDelayAddressess]') AND [c].[name] = N'UpdatedDate');
    IF @var123 IS NOT NULL EXEC(N'ALTER TABLE [TradeBitGoDelayAddressess] DROP CONSTRAINT [' + @var123 + '];');
    ALTER TABLE [TradeBitGoDelayAddressess] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var124 sysname;
    SELECT @var124 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ThirdPartyAPIResponseConfiguration]') AND [c].[name] = N'UpdatedDate');
    IF @var124 IS NOT NULL EXEC(N'ALTER TABLE [ThirdPartyAPIResponseConfiguration] DROP CONSTRAINT [' + @var124 + '];');
    ALTER TABLE [ThirdPartyAPIResponseConfiguration] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var125 sysname;
    SELECT @var125 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ThirdPartyAPIConfiguration]') AND [c].[name] = N'UpdatedDate');
    IF @var125 IS NOT NULL EXEC(N'ALTER TABLE [ThirdPartyAPIConfiguration] DROP CONSTRAINT [' + @var125 + '];');
    ALTER TABLE [ThirdPartyAPIConfiguration] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var126 sysname;
    SELECT @var126 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TempUserRegister]') AND [c].[name] = N'UpdatedDate');
    IF @var126 IS NOT NULL EXEC(N'ALTER TABLE [TempUserRegister] DROP CONSTRAINT [' + @var126 + '];');
    ALTER TABLE [TempUserRegister] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var127 sysname;
    SELECT @var127 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TempOtpMaster]') AND [c].[name] = N'UpdatedDate');
    IF @var127 IS NOT NULL EXEC(N'ALTER TABLE [TempOtpMaster] DROP CONSTRAINT [' + @var127 + '];');
    ALTER TABLE [TempOtpMaster] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var128 sysname;
    SELECT @var128 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TemplateMaster]') AND [c].[name] = N'UpdatedDate');
    IF @var128 IS NOT NULL EXEC(N'ALTER TABLE [TemplateMaster] DROP CONSTRAINT [' + @var128 + '];');
    ALTER TABLE [TemplateMaster] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var129 sysname;
    SELECT @var129 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StckingScheme]') AND [c].[name] = N'UpdatedDate');
    IF @var129 IS NOT NULL EXEC(N'ALTER TABLE [StckingScheme] DROP CONSTRAINT [' + @var129 + '];');
    ALTER TABLE [StckingScheme] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var130 sysname;
    SELECT @var130 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StateMaster]') AND [c].[name] = N'UpdatedDate');
    IF @var130 IS NOT NULL EXEC(N'ALTER TABLE [StateMaster] DROP CONSTRAINT [' + @var130 + '];');
    ALTER TABLE [StateMaster] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var131 sysname;
    SELECT @var131 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ServiceTypeMaster]') AND [c].[name] = N'UpdatedDate');
    IF @var131 IS NOT NULL EXEC(N'ALTER TABLE [ServiceTypeMaster] DROP CONSTRAINT [' + @var131 + '];');
    ALTER TABLE [ServiceTypeMaster] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var132 sysname;
    SELECT @var132 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ServiceTypeMapping]') AND [c].[name] = N'UpdatedDate');
    IF @var132 IS NOT NULL EXEC(N'ALTER TABLE [ServiceTypeMapping] DROP CONSTRAINT [' + @var132 + '];');
    ALTER TABLE [ServiceTypeMapping] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var133 sysname;
    SELECT @var133 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ServiceStastics]') AND [c].[name] = N'UpdatedDate');
    IF @var133 IS NOT NULL EXEC(N'ALTER TABLE [ServiceStastics] DROP CONSTRAINT [' + @var133 + '];');
    ALTER TABLE [ServiceStastics] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var134 sysname;
    SELECT @var134 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ServiceProviderType]') AND [c].[name] = N'UpdatedDate');
    IF @var134 IS NOT NULL EXEC(N'ALTER TABLE [ServiceProviderType] DROP CONSTRAINT [' + @var134 + '];');
    ALTER TABLE [ServiceProviderType] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var135 sysname;
    SELECT @var135 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ServiceProviderMaster]') AND [c].[name] = N'UpdatedDate');
    IF @var135 IS NOT NULL EXEC(N'ALTER TABLE [ServiceProviderMaster] DROP CONSTRAINT [' + @var135 + '];');
    ALTER TABLE [ServiceProviderMaster] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var136 sysname;
    SELECT @var136 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ServiceProviderDetail]') AND [c].[name] = N'UpdatedDate');
    IF @var136 IS NOT NULL EXEC(N'ALTER TABLE [ServiceProviderDetail] DROP CONSTRAINT [' + @var136 + '];');
    ALTER TABLE [ServiceProviderDetail] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var137 sysname;
    SELECT @var137 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ServiceProConfiguration]') AND [c].[name] = N'UpdatedDate');
    IF @var137 IS NOT NULL EXEC(N'ALTER TABLE [ServiceProConfiguration] DROP CONSTRAINT [' + @var137 + '];');
    ALTER TABLE [ServiceProConfiguration] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var138 sysname;
    SELECT @var138 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ServiceMaster]') AND [c].[name] = N'UpdatedDate');
    IF @var138 IS NOT NULL EXEC(N'ALTER TABLE [ServiceMaster] DROP CONSTRAINT [' + @var138 + '];');
    ALTER TABLE [ServiceMaster] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var139 sysname;
    SELECT @var139 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ServiceDetail]') AND [c].[name] = N'UpdatedDate');
    IF @var139 IS NOT NULL EXEC(N'ALTER TABLE [ServiceDetail] DROP CONSTRAINT [' + @var139 + '];');
    ALTER TABLE [ServiceDetail] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var140 sysname;
    SELECT @var140 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RouteConfiguration]') AND [c].[name] = N'UpdatedDate');
    IF @var140 IS NOT NULL EXEC(N'ALTER TABLE [RouteConfiguration] DROP CONSTRAINT [' + @var140 + '];');
    ALTER TABLE [RouteConfiguration] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var141 sysname;
    SELECT @var141 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RequestFormatMaster]') AND [c].[name] = N'UpdatedDate');
    IF @var141 IS NOT NULL EXEC(N'ALTER TABLE [RequestFormatMaster] DROP CONSTRAINT [' + @var141 + '];');
    ALTER TABLE [RequestFormatMaster] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var142 sysname;
    SELECT @var142 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RegisterType]') AND [c].[name] = N'UpdatedDate');
    IF @var142 IS NOT NULL EXEC(N'ALTER TABLE [RegisterType] DROP CONSTRAINT [' + @var142 + '];');
    ALTER TABLE [RegisterType] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var143 sysname;
    SELECT @var143 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ProductConfiguration]') AND [c].[name] = N'UpdatedDate');
    IF @var143 IS NOT NULL EXEC(N'ALTER TABLE [ProductConfiguration] DROP CONSTRAINT [' + @var143 + '];');
    ALTER TABLE [ProductConfiguration] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var144 sysname;
    SELECT @var144 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PoolOrder]') AND [c].[name] = N'UpdatedDate');
    IF @var144 IS NOT NULL EXEC(N'ALTER TABLE [PoolOrder] DROP CONSTRAINT [' + @var144 + '];');
    ALTER TABLE [PoolOrder] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var145 sysname;
    SELECT @var145 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[OtpMaster]') AND [c].[name] = N'UpdatedDate');
    IF @var145 IS NOT NULL EXEC(N'ALTER TABLE [OtpMaster] DROP CONSTRAINT [' + @var145 + '];');
    ALTER TABLE [OtpMaster] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var146 sysname;
    SELECT @var146 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[NotificationQueue]') AND [c].[name] = N'UpdatedDate');
    IF @var146 IS NOT NULL EXEC(N'ALTER TABLE [NotificationQueue] DROP CONSTRAINT [' + @var146 + '];');
    ALTER TABLE [NotificationQueue] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var147 sysname;
    SELECT @var147 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[MessagingQueue]') AND [c].[name] = N'UpdatedDate');
    IF @var147 IS NOT NULL EXEC(N'ALTER TABLE [MessagingQueue] DROP CONSTRAINT [' + @var147 + '];');
    ALTER TABLE [MessagingQueue] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var148 sysname;
    SELECT @var148 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[MemberShadowLimit]') AND [c].[name] = N'UpdatedDate');
    IF @var148 IS NOT NULL EXEC(N'ALTER TABLE [MemberShadowLimit] DROP CONSTRAINT [' + @var148 + '];');
    ALTER TABLE [MemberShadowLimit] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var149 sysname;
    SELECT @var149 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[MemberShadowBalance]') AND [c].[name] = N'UpdatedDate');
    IF @var149 IS NOT NULL EXEC(N'ALTER TABLE [MemberShadowBalance] DROP CONSTRAINT [' + @var149 + '];');
    ALTER TABLE [MemberShadowBalance] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var150 sysname;
    SELECT @var150 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Market]') AND [c].[name] = N'UpdatedDate');
    IF @var150 IS NOT NULL EXEC(N'ALTER TABLE [Market] DROP CONSTRAINT [' + @var150 + '];');
    ALTER TABLE [Market] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var151 sysname;
    SELECT @var151 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Limits]') AND [c].[name] = N'UpdatedDate');
    IF @var151 IS NOT NULL EXEC(N'ALTER TABLE [Limits] DROP CONSTRAINT [' + @var151 + '];');
    ALTER TABLE [Limits] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var152 sysname;
    SELECT @var152 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[EmailQueue]') AND [c].[name] = N'UpdatedDate');
    IF @var152 IS NOT NULL EXEC(N'ALTER TABLE [EmailQueue] DROP CONSTRAINT [' + @var152 + '];');
    ALTER TABLE [EmailQueue] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var153 sysname;
    SELECT @var153 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[DeviceMaster]') AND [c].[name] = N'UpdatedDate');
    IF @var153 IS NOT NULL EXEC(N'ALTER TABLE [DeviceMaster] DROP CONSTRAINT [' + @var153 + '];');
    ALTER TABLE [DeviceMaster] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var154 sysname;
    SELECT @var154 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[DepositHistory]') AND [c].[name] = N'UpdatedDate');
    IF @var154 IS NOT NULL EXEC(N'ALTER TABLE [DepositHistory] DROP CONSTRAINT [' + @var154 + '];');
    ALTER TABLE [DepositHistory] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var155 sysname;
    SELECT @var155 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[DepositCounterMaster]') AND [c].[name] = N'UpdatedDate');
    IF @var155 IS NOT NULL EXEC(N'ALTER TABLE [DepositCounterMaster] DROP CONSTRAINT [' + @var155 + '];');
    ALTER TABLE [DepositCounterMaster] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var156 sysname;
    SELECT @var156 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[DepositCounterLog]') AND [c].[name] = N'UpdatedDate');
    IF @var156 IS NOT NULL EXEC(N'ALTER TABLE [DepositCounterLog] DROP CONSTRAINT [' + @var156 + '];');
    ALTER TABLE [DepositCounterLog] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var157 sysname;
    SELECT @var157 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[DemonConfiguration]') AND [c].[name] = N'UpdatedDate');
    IF @var157 IS NOT NULL EXEC(N'ALTER TABLE [DemonConfiguration] DROP CONSTRAINT [' + @var157 + '];');
    ALTER TABLE [DemonConfiguration] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var158 sysname;
    SELECT @var158 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CustomPassword]') AND [c].[name] = N'UpdatedDate');
    IF @var158 IS NOT NULL EXEC(N'ALTER TABLE [CustomPassword] DROP CONSTRAINT [' + @var158 + '];');
    ALTER TABLE [CustomPassword] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var159 sysname;
    SELECT @var159 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CountryMaster]') AND [c].[name] = N'UpdatedDate');
    IF @var159 IS NOT NULL EXEC(N'ALTER TABLE [CountryMaster] DROP CONSTRAINT [' + @var159 + '];');
    ALTER TABLE [CountryMaster] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var160 sysname;
    SELECT @var160 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CommServiceTypeMaster]') AND [c].[name] = N'UpdatedDate');
    IF @var160 IS NOT NULL EXEC(N'ALTER TABLE [CommServiceTypeMaster] DROP CONSTRAINT [' + @var160 + '];');
    ALTER TABLE [CommServiceTypeMaster] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var161 sysname;
    SELECT @var161 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CommServiceproviderMaster]') AND [c].[name] = N'UpdatedDate');
    IF @var161 IS NOT NULL EXEC(N'ALTER TABLE [CommServiceproviderMaster] DROP CONSTRAINT [' + @var161 + '];');
    ALTER TABLE [CommServiceproviderMaster] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var162 sysname;
    SELECT @var162 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CommServiceMaster]') AND [c].[name] = N'UpdatedDate');
    IF @var162 IS NOT NULL EXEC(N'ALTER TABLE [CommServiceMaster] DROP CONSTRAINT [' + @var162 + '];');
    ALTER TABLE [CommServiceMaster] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var163 sysname;
    SELECT @var163 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CommAPIServiceMaster]') AND [c].[name] = N'UpdatedDate');
    IF @var163 IS NOT NULL EXEC(N'ALTER TABLE [CommAPIServiceMaster] DROP CONSTRAINT [' + @var163 + '];');
    ALTER TABLE [CommAPIServiceMaster] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var164 sysname;
    SELECT @var164 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CityMaster]') AND [c].[name] = N'UpdatedDate');
    IF @var164 IS NOT NULL EXEC(N'ALTER TABLE [CityMaster] DROP CONSTRAINT [' + @var164 + '];');
    ALTER TABLE [CityMaster] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var165 sysname;
    SELECT @var165 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[BeneficiaryMaster]') AND [c].[name] = N'UpdatedDate');
    IF @var165 IS NOT NULL EXEC(N'ALTER TABLE [BeneficiaryMaster] DROP CONSTRAINT [' + @var165 + '];');
    ALTER TABLE [BeneficiaryMaster] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var166 sysname;
    SELECT @var166 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[AppType]') AND [c].[name] = N'UpdatedDate');
    IF @var166 IS NOT NULL EXEC(N'ALTER TABLE [AppType] DROP CONSTRAINT [' + @var166 + '];');
    ALTER TABLE [AppType] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    DECLARE @var167 sysname;
    SELECT @var167 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[AddressMasters]') AND [c].[name] = N'UpdatedDate');
    IF @var167 IS NOT NULL EXEC(N'ALTER TABLE [AddressMasters] DROP CONSTRAINT [' + @var167 + '];');
    ALTER TABLE [AddressMasters] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    ALTER TABLE [TradeBuyRequest] ADD CONSTRAINT [AK_TradeBuyRequest_TrnNo] UNIQUE ([TrnNo]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    ALTER TABLE [TradeBuyRequest] ADD CONSTRAINT [PK_TradeBuyRequest] PRIMARY KEY ([Id], [TrnNo]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    CREATE TABLE [FavouritePair] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [UserId] bigint NOT NULL,
        [PairId] bigint NOT NULL,
        CONSTRAINT [PK_FavouritePair] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    CREATE TABLE [WithdrawHistory] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [TrnID] nvarchar(450) NOT NULL,
        [SMSCode] nvarchar(50) NOT NULL,
        [Wallet] nvarchar(50) NOT NULL,
        [Address] nvarchar(100) NOT NULL,
        [Confirmations] bigint NOT NULL,
        [Value] decimal(18, 2) NOT NULL,
        [Amount] decimal(18, 8) NOT NULL,
        [Charge] decimal(18, 2) NOT NULL,
        [State] smallint NOT NULL,
        [confirmedTime] nvarchar(50) NOT NULL,
        [unconfirmedTime] nvarchar(50) NOT NULL,
        [createdTime] nvarchar(50) NOT NULL,
        [IsProcessing] smallint NOT NULL,
        [ToAddress] nvarchar(50) NOT NULL,
        [APITopUpRefNo] nvarchar(50) NOT NULL,
        [SystemRemarks] nvarchar(100) NOT NULL,
        [TrnNo] bigint NOT NULL,
        [RouteTag] nvarchar(max) NOT NULL,
        [SerProID] bigint NOT NULL,
        [UserId] bigint NOT NULL,
        [TrnDate] datetime2 NOT NULL,
        CONSTRAINT [PK_WithdrawHistory] PRIMARY KEY ([TrnID], [Address]),
        CONSTRAINT [AK_WithdrawHistory_Address_TrnID] UNIQUE ([Address], [TrnID])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029123847_IpMasterAddAliasInt29102018')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181029123847_IpMasterAddAliasInt29102018', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029133355_IpMasterAddAliasIntV229102018')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181029133355_IpMasterAddAliasIntV229102018', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029133619_IpMasterAddAliasIntV329102018')
BEGIN
    CREATE TABLE [IpMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [UserId] int NOT NULL,
        [IpAddress] nvarchar(15) NOT NULL,
        [IpAliasName] nvarchar(150) NULL,
        [IsEnable] bit NOT NULL,
        [IsDeleted] bit NOT NULL,
        CONSTRAINT [PK_IpMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181029133619_IpMasterAddAliasIntV329102018')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181029133619_IpMasterAddAliasIntV329102018', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181030071306_TradeDepositCompletedTrnl30102018')
BEGIN
    DECLARE @var168 sysname;
    SELECT @var168 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeTransactionQueue]') AND [c].[name] = N'ProductID');
    IF @var168 IS NOT NULL EXEC(N'ALTER TABLE [TradeTransactionQueue] DROP CONSTRAINT [' + @var168 + '];');
    ALTER TABLE [TradeTransactionQueue] DROP COLUMN [ProductID];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181030071306_TradeDepositCompletedTrnl30102018')
BEGIN
    DECLARE @var169 sysname;
    SELECT @var169 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeTransactionQueue]') AND [c].[name] = N'RoutID');
    IF @var169 IS NOT NULL EXEC(N'ALTER TABLE [TradeTransactionQueue] DROP CONSTRAINT [' + @var169 + '];');
    ALTER TABLE [TradeTransactionQueue] DROP COLUMN [RoutID];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181030071306_TradeDepositCompletedTrnl30102018')
BEGIN
    DECLARE @var170 sysname;
    SELECT @var170 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeTransactionQueue]') AND [c].[name] = N'SerProID');
    IF @var170 IS NOT NULL EXEC(N'ALTER TABLE [TradeTransactionQueue] DROP CONSTRAINT [' + @var170 + '];');
    ALTER TABLE [TradeTransactionQueue] DROP COLUMN [SerProID];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181030071306_TradeDepositCompletedTrnl30102018')
BEGIN
    DECLARE @var171 sysname;
    SELECT @var171 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeTransactionQueue]') AND [c].[name] = N'ServiceID');
    IF @var171 IS NOT NULL EXEC(N'ALTER TABLE [TradeTransactionQueue] DROP CONSTRAINT [' + @var171 + '];');
    ALTER TABLE [TradeTransactionQueue] DROP COLUMN [ServiceID];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181030071306_TradeDepositCompletedTrnl30102018')
BEGIN
    DECLARE @var172 sysname;
    SELECT @var172 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeBuyRequest]') AND [c].[name] = N'MemberID');
    IF @var172 IS NOT NULL EXEC(N'ALTER TABLE [TradeBuyRequest] DROP CONSTRAINT [' + @var172 + '];');
    ALTER TABLE [TradeBuyRequest] DROP COLUMN [MemberID];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181030071306_TradeDepositCompletedTrnl30102018')
BEGIN
    DECLARE @var173 sysname;
    SELECT @var173 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeBuyRequest]') AND [c].[name] = N'TrnDate');
    IF @var173 IS NOT NULL EXEC(N'ALTER TABLE [TradeBuyRequest] DROP CONSTRAINT [' + @var173 + '];');
    ALTER TABLE [TradeBuyRequest] DROP COLUMN [TrnDate];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181030071306_TradeDepositCompletedTrnl30102018')
BEGIN
    DECLARE @var174 sysname;
    SELECT @var174 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PoolOrder]') AND [c].[name] = N'AlertRec');
    IF @var174 IS NOT NULL EXEC(N'ALTER TABLE [PoolOrder] DROP CONSTRAINT [' + @var174 + '];');
    ALTER TABLE [PoolOrder] DROP COLUMN [AlertRec];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181030071306_TradeDepositCompletedTrnl30102018')
BEGIN
    DECLARE @var175 sysname;
    SELECT @var175 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PoolOrder]') AND [c].[name] = N'CashChargePer');
    IF @var175 IS NOT NULL EXEC(N'ALTER TABLE [PoolOrder] DROP CONSTRAINT [' + @var175 + '];');
    ALTER TABLE [PoolOrder] DROP COLUMN [CashChargePer];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181030071306_TradeDepositCompletedTrnl30102018')
BEGIN
    DECLARE @var176 sysname;
    SELECT @var176 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PoolOrder]') AND [c].[name] = N'CashChargeRs');
    IF @var176 IS NOT NULL EXEC(N'ALTER TABLE [PoolOrder] DROP CONSTRAINT [' + @var176 + '];');
    ALTER TABLE [PoolOrder] DROP COLUMN [CashChargeRs];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181030071306_TradeDepositCompletedTrnl30102018')
BEGIN
    DECLARE @var177 sysname;
    SELECT @var177 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PoolOrder]') AND [c].[name] = N'CouponNo');
    IF @var177 IS NOT NULL EXEC(N'ALTER TABLE [PoolOrder] DROP CONSTRAINT [' + @var177 + '];');
    ALTER TABLE [PoolOrder] DROP COLUMN [CouponNo];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181030071306_TradeDepositCompletedTrnl30102018')
BEGIN
    DECLARE @var178 sysname;
    SELECT @var178 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PoolOrder]') AND [c].[name] = N'DAccountNo');
    IF @var178 IS NOT NULL EXEC(N'ALTER TABLE [PoolOrder] DROP CONSTRAINT [' + @var178 + '];');
    ALTER TABLE [PoolOrder] DROP COLUMN [DAccountNo];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181030071306_TradeDepositCompletedTrnl30102018')
BEGIN
    DECLARE @var179 sysname;
    SELECT @var179 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PoolOrder]') AND [c].[name] = N'DBankID');
    IF @var179 IS NOT NULL EXEC(N'ALTER TABLE [PoolOrder] DROP CONSTRAINT [' + @var179 + '];');
    ALTER TABLE [PoolOrder] DROP COLUMN [DBankID];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181030071306_TradeDepositCompletedTrnl30102018')
BEGIN
    DECLARE @var180 sysname;
    SELECT @var180 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PoolOrder]') AND [c].[name] = N'DMemberID');
    IF @var180 IS NOT NULL EXEC(N'ALTER TABLE [PoolOrder] DROP CONSTRAINT [' + @var180 + '];');
    ALTER TABLE [PoolOrder] DROP COLUMN [DMemberID];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181030071306_TradeDepositCompletedTrnl30102018')
BEGIN
    DECLARE @var181 sysname;
    SELECT @var181 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PoolOrder]') AND [c].[name] = N'DeliveryGivenDate');
    IF @var181 IS NOT NULL EXEC(N'ALTER TABLE [PoolOrder] DROP CONSTRAINT [' + @var181 + '];');
    ALTER TABLE [PoolOrder] DROP COLUMN [DeliveryGivenDate];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181030071306_TradeDepositCompletedTrnl30102018')
BEGIN
    DECLARE @var182 sysname;
    SELECT @var182 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PoolOrder]') AND [c].[name] = N'IsChargeAccepted');
    IF @var182 IS NOT NULL EXEC(N'ALTER TABLE [PoolOrder] DROP CONSTRAINT [' + @var182 + '];');
    ALTER TABLE [PoolOrder] DROP COLUMN [IsChargeAccepted];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181030071306_TradeDepositCompletedTrnl30102018')
BEGIN
    DECLARE @var183 sysname;
    SELECT @var183 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PoolOrder]') AND [c].[name] = N'IsDebited');
    IF @var183 IS NOT NULL EXEC(N'ALTER TABLE [PoolOrder] DROP CONSTRAINT [' + @var183 + '];');
    ALTER TABLE [PoolOrder] DROP COLUMN [IsDebited];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181030071306_TradeDepositCompletedTrnl30102018')
BEGIN
    DECLARE @var184 sysname;
    SELECT @var184 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PoolOrder]') AND [c].[name] = N'OAccountNo');
    IF @var184 IS NOT NULL EXEC(N'ALTER TABLE [PoolOrder] DROP CONSTRAINT [' + @var184 + '];');
    ALTER TABLE [PoolOrder] DROP COLUMN [OAccountNo];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181030071306_TradeDepositCompletedTrnl30102018')
BEGIN
    DECLARE @var185 sysname;
    SELECT @var185 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PoolOrder]') AND [c].[name] = N'OBankID');
    IF @var185 IS NOT NULL EXEC(N'ALTER TABLE [PoolOrder] DROP CONSTRAINT [' + @var185 + '];');
    ALTER TABLE [PoolOrder] DROP COLUMN [OBankID];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181030071306_TradeDepositCompletedTrnl30102018')
BEGIN
    DECLARE @var186 sysname;
    SELECT @var186 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PoolOrder]') AND [c].[name] = N'OBranchName');
    IF @var186 IS NOT NULL EXEC(N'ALTER TABLE [PoolOrder] DROP CONSTRAINT [' + @var186 + '];');
    ALTER TABLE [PoolOrder] DROP COLUMN [OBranchName];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181030071306_TradeDepositCompletedTrnl30102018')
BEGIN
    DECLARE @var187 sysname;
    SELECT @var187 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PoolOrder]') AND [c].[name] = N'OChequeDate');
    IF @var187 IS NOT NULL EXEC(N'ALTER TABLE [PoolOrder] DROP CONSTRAINT [' + @var187 + '];');
    ALTER TABLE [PoolOrder] DROP COLUMN [OChequeDate];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181030071306_TradeDepositCompletedTrnl30102018')
BEGIN
    DECLARE @var188 sysname;
    SELECT @var188 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PoolOrder]') AND [c].[name] = N'OrderDate');
    IF @var188 IS NOT NULL EXEC(N'ALTER TABLE [PoolOrder] DROP CONSTRAINT [' + @var188 + '];');
    ALTER TABLE [PoolOrder] DROP COLUMN [OrderDate];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181030071306_TradeDepositCompletedTrnl30102018')
BEGIN
    DECLARE @var189 sysname;
    SELECT @var189 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PoolOrder]') AND [c].[name] = N'PGId');
    IF @var189 IS NOT NULL EXEC(N'ALTER TABLE [PoolOrder] DROP CONSTRAINT [' + @var189 + '];');
    ALTER TABLE [PoolOrder] DROP COLUMN [PGId];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181030071306_TradeDepositCompletedTrnl30102018')
BEGIN
    DECLARE @var190 sysname;
    SELECT @var190 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PoolOrder]') AND [c].[name] = N'WalletAmt');
    IF @var190 IS NOT NULL EXEC(N'ALTER TABLE [PoolOrder] DROP CONSTRAINT [' + @var190 + '];');
    ALTER TABLE [PoolOrder] DROP COLUMN [WalletAmt];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181030071306_TradeDepositCompletedTrnl30102018')
BEGIN
    EXEC sp_rename N'[PoolOrder].[WalletID]', N'UserWalletID', N'COLUMN';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181030071306_TradeDepositCompletedTrnl30102018')
BEGIN
    EXEC sp_rename N'[PoolOrder].[OMemberID]', N'UserID', N'COLUMN';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181030071306_TradeDepositCompletedTrnl30102018')
BEGIN
    EXEC sp_rename N'[PoolOrder].[OChequeNo]', N'UserWalletAccID', N'COLUMN';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181030071306_TradeDepositCompletedTrnl30102018')
BEGIN
    EXEC sp_rename N'[PoolOrder].[DeliveryGivenBy]', N'PoolID', N'COLUMN';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181030071306_TradeDepositCompletedTrnl30102018')
BEGIN
    DECLARE @var191 sysname;
    SELECT @var191 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PoolOrder]') AND [c].[name] = N'TrnMode');
    IF @var191 IS NOT NULL EXEC(N'ALTER TABLE [PoolOrder] DROP CONSTRAINT [' + @var191 + '];');
    ALTER TABLE [PoolOrder] ALTER COLUMN [TrnMode] smallint NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181030071306_TradeDepositCompletedTrnl30102018')
BEGIN
    DECLARE @var192 sysname;
    SELECT @var192 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PoolOrder]') AND [c].[name] = N'PayMode');
    IF @var192 IS NOT NULL EXEC(N'ALTER TABLE [PoolOrder] DROP CONSTRAINT [' + @var192 + '];');
    ALTER TABLE [PoolOrder] ALTER COLUMN [PayMode] smallint NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181030071306_TradeDepositCompletedTrnl30102018')
BEGIN
    CREATE TABLE [TradeDepositCompletedTrn] (
        [Id] bigint NOT NULL IDENTITY,
        [TrnID] nvarchar(450) NOT NULL,
        [Address] nvarchar(450) NOT NULL,
        [Status] int NOT NULL,
        [CreatedTime] datetime2 NOT NULL,
        CONSTRAINT [PK_TradeDepositCompletedTrn] PRIMARY KEY ([Address], [TrnID])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181030071306_TradeDepositCompletedTrnl30102018')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181030071306_TradeDepositCompletedTrnl30102018', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181030104031_LimitchargeTable')
BEGIN
    DROP TABLE [TradeDepositCompletedTrn];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181030104031_LimitchargeTable')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181030104031_LimitchargeTable', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181030104451_LimitchargeTableV1')
BEGIN
    CREATE TABLE [ChargeRuleMaster] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [Name] nvarchar(max) NULL,
        [TrnType] int NOT NULL,
        [MinAmount] decimal(18, 8) NOT NULL,
        [MaxAmount] decimal(18, 8) NOT NULL,
        [WalletType] bigint NOT NULL,
        [ChargeType] int NOT NULL,
        [ChargeValue] decimal(18, 8) NOT NULL,
        CONSTRAINT [PK_ChargeRuleMaster] PRIMARY KEY ([TrnType], [WalletType])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181030104451_LimitchargeTableV1')
BEGIN
    CREATE TABLE [LimitRuleMaster] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [Name] nvarchar(max) NULL,
        [TrnType] int NOT NULL,
        [MinAmount] decimal(18, 8) NOT NULL,
        [MaxAmount] decimal(18, 8) NOT NULL,
        [WalletType] bigint NOT NULL,
        CONSTRAINT [PK_LimitRuleMaster] PRIMARY KEY ([TrnType], [WalletType])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181030104451_LimitchargeTableV1')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181030104451_LimitchargeTableV1', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181031053719_completedTrnTbl-31102018')
BEGIN
    ALTER TABLE [PoolOrder] ADD [DMemberID] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181031053719_completedTrnTbl-31102018')
BEGIN
    ALTER TABLE [PoolOrder] ADD [OMemberID] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181031053719_completedTrnTbl-31102018')
BEGIN
    CREATE TABLE [TradeBuyerList] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [PoolID] bigint NOT NULL,
        [TrnNo] bigint NOT NULL,
        [Price] decimal(18, 8) NOT NULL,
        [Qty] decimal(18, 8) NOT NULL,
        CONSTRAINT [PK_TradeBuyerList] PRIMARY KEY ([TrnNo], [PoolID]),
        CONSTRAINT [AK_TradeBuyerList_PoolID_TrnNo] UNIQUE ([PoolID], [TrnNo])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181031053719_completedTrnTbl-31102018')
BEGIN
    CREATE TABLE [TradeDepositCompletedTrn] (
        [Id] bigint NOT NULL IDENTITY,
        [TrnID] nvarchar(450) NOT NULL,
        [Address] nvarchar(450) NOT NULL,
        [Status] int NOT NULL,
        [CreatedTime] datetime2 NOT NULL,
        CONSTRAINT [PK_TradeDepositCompletedTrn] PRIMARY KEY ([Address], [TrnID])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181031053719_completedTrnTbl-31102018')
BEGIN
    CREATE TABLE [TradeSellerList] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [TrnNo] bigint NOT NULL,
        [BuyReqID] bigint NOT NULL,
        [Price] decimal(18, 8) NOT NULL,
        [Qty] decimal(18, 8) NOT NULL,
        CONSTRAINT [PK_TradeSellerList] PRIMARY KEY ([Id], [TrnNo]),
        CONSTRAINT [AK_TradeSellerList_TrnNo] UNIQUE ([TrnNo])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181031053719_completedTrnTbl-31102018')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181031053719_completedTrnTbl-31102018', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181031082347_Limit31102018')
BEGIN
    ALTER TABLE [TradeSellerList] DROP CONSTRAINT [AK_TradeSellerList_TrnNo];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181031082347_Limit31102018')
BEGIN
    ALTER TABLE [TradeSellerList] DROP CONSTRAINT [PK_TradeSellerList];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181031082347_Limit31102018')
BEGIN
    ALTER TABLE [TradeBuyerList] DROP CONSTRAINT [AK_TradeBuyerList_PoolID_TrnNo];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181031082347_Limit31102018')
BEGIN
    ALTER TABLE [TradeBuyerList] DROP CONSTRAINT [PK_TradeBuyerList];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181031082347_Limit31102018')
BEGIN
    EXEC sp_rename N'[TradeSellerList].[BuyReqID]', N'SellServiceID', N'COLUMN';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181031082347_Limit31102018')
BEGIN
    EXEC sp_rename N'[TradeBuyerList].[PoolID]', N'ServiceID', N'COLUMN';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181031082347_Limit31102018')
BEGIN
    ALTER TABLE [WalletLimitConfiguration] ADD [EndTimeUnix] float NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181031082347_Limit31102018')
BEGIN
    ALTER TABLE [WalletLimitConfiguration] ADD [StartTimeUnix] float NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181031082347_Limit31102018')
BEGIN
    ALTER TABLE [TradeSellerList] ADD [PoolID] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181031082347_Limit31102018')
BEGIN
    ALTER TABLE [TradeSellerList] ADD [BuyServiceID] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181031082347_Limit31102018')
BEGIN
    ALTER TABLE [TradeBuyerList] ADD [BuyReqID] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181031082347_Limit31102018')
BEGIN
    ALTER TABLE [TradeBuyerList] ADD [PaidServiceID] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181031082347_Limit31102018')
BEGIN
    ALTER TABLE [TradeSellerList] ADD CONSTRAINT [AK_TradeSellerList_PoolID_TrnNo] UNIQUE ([PoolID], [TrnNo]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181031082347_Limit31102018')
BEGIN
    ALTER TABLE [TradeSellerList] ADD CONSTRAINT [PK_TradeSellerList] PRIMARY KEY ([TrnNo], [PoolID]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181031082347_Limit31102018')
BEGIN
    ALTER TABLE [TradeBuyerList] ADD CONSTRAINT [AK_TradeBuyerList_TrnNo] UNIQUE ([TrnNo]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181031082347_Limit31102018')
BEGIN
    ALTER TABLE [TradeBuyerList] ADD CONSTRAINT [PK_TradeBuyerList] PRIMARY KEY ([Id], [TrnNo]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181031082347_Limit31102018')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181031082347_Limit31102018', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181031140735_BuyerSellerList')
BEGIN
    ALTER TABLE [WalletLimitConfiguration] DROP CONSTRAINT [PK_WalletLimitConfiguration];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181031140735_BuyerSellerList')
BEGIN
    ALTER TABLE [TradeSellerList] ADD [IsProcessing] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181031140735_BuyerSellerList')
BEGIN
    ALTER TABLE [TradeSellerList] ADD [RemainQty] decimal(18, 8) NOT NULL DEFAULT 0.0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181031140735_BuyerSellerList')
BEGIN
    ALTER TABLE [TradeGraphDetail] ADD [BidPrice] decimal(18, 8) NOT NULL DEFAULT 0.0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181031140735_BuyerSellerList')
BEGIN
    ALTER TABLE [TradeGraphDetail] ADD [Quantity] decimal(18, 8) NOT NULL DEFAULT 0.0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181031140735_BuyerSellerList')
BEGIN
    ALTER TABLE [TradeBuyerList] ADD [IsProcessing] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181031140735_BuyerSellerList')
BEGIN
    ALTER TABLE [WalletLimitConfiguration] ADD CONSTRAINT [PK_WalletLimitConfiguration] PRIMARY KEY ([TrnType], [WalletId]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181031140735_BuyerSellerList')
BEGIN
    CREATE TABLE [TradePoolConfiguration] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [CountPerPrice] bigint NOT NULL,
        CONSTRAINT [PK_TradePoolConfiguration] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181031140735_BuyerSellerList')
BEGIN
    CREATE TABLE [TradePoolQueue] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [PoolID] bigint NOT NULL,
        [SellerListID] bigint NOT NULL,
        [MakerTrnNo] bigint NOT NULL,
        [MakerQty] decimal(18, 8) NOT NULL,
        [TakerTrnNo] bigint NOT NULL,
        [TakerQty] decimal(18, 8) NOT NULL,
        CONSTRAINT [PK_TradePoolQueue] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181031140735_BuyerSellerList')
BEGIN
    CREATE TABLE [TransactionStatus] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [TrnNo] bigint NOT NULL,
        [ServiceID] bigint NOT NULL,
        [SerProID] bigint NOT NULL,
        [StatusMsg] nvarchar(max) NULL,
        CONSTRAINT [PK_TransactionStatus] PRIMARY KEY ([TrnNo], [ServiceID], [SerProID]),
        CONSTRAINT [AK_TransactionStatus_SerProID_ServiceID_TrnNo] UNIQUE ([SerProID], [ServiceID], [TrnNo])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181031140735_BuyerSellerList')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181031140735_BuyerSellerList', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181101065802_bitgodelay01112018')
BEGIN
    ALTER TABLE [UserPreferencesMaster] DROP CONSTRAINT [PK_UserPreferencesMaster];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181101065802_bitgodelay01112018')
BEGIN
    ALTER TABLE [TradeBitGoDelayAddressess] DROP CONSTRAINT [PK_TradeBitGoDelayAddressess];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181101065802_bitgodelay01112018')
BEGIN
    ALTER TABLE [UserPreferencesMaster] ADD CONSTRAINT [PK_UserPreferencesMaster] PRIMARY KEY ([UserID]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181101065802_bitgodelay01112018')
BEGIN
    ALTER TABLE [TradeBitGoDelayAddressess] ADD CONSTRAINT [PK_TradeBitGoDelayAddressess] PRIMARY KEY ([TrnID]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181101065802_bitgodelay01112018')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181101065802_bitgodelay01112018', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181101134235_SettlementBuyreq')
BEGIN
    ALTER TABLE [TradePoolQueue] ADD [MakerPrice] decimal(18, 8) NOT NULL DEFAULT 0.0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181101134235_SettlementBuyreq')
BEGIN
    ALTER TABLE [TradePoolQueue] ADD [TakerDisc] decimal(18, 8) NOT NULL DEFAULT 0.0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181101134235_SettlementBuyreq')
BEGIN
    ALTER TABLE [TradePoolQueue] ADD [TakerLoss] decimal(18, 8) NOT NULL DEFAULT 0.0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181101134235_SettlementBuyreq')
BEGIN
    ALTER TABLE [TradePoolQueue] ADD [TakerPrice] decimal(18, 8) NOT NULL DEFAULT 0.0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181101134235_SettlementBuyreq')
BEGIN
    ALTER TABLE [TradeBuyRequest] ADD [UserID] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181101134235_SettlementBuyreq')
BEGIN
    ALTER TABLE [TradeBuyerList] ADD [DeliveredQty] decimal(18, 8) NOT NULL DEFAULT 0.0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181101134235_SettlementBuyreq')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181101134235_SettlementBuyreq', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181102044306_ConfirmationCnt02112018')
BEGIN
    ALTER TABLE [WalletTypeMasters] ADD [ConfirmationCount] smallint NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181102044306_ConfirmationCnt02112018')
BEGIN
    ALTER TABLE [RouteConfiguration] ADD [ConfirmationCount] int NOT NULL DEFAULT 0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181102044306_ConfirmationCnt02112018')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181102044306_ConfirmationCnt02112018', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181102050238_addtableuserkeymaster11022018')
BEGIN
    DECLARE @var193 sysname;
    SELECT @var193 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RouteConfiguration]') AND [c].[name] = N'ConfirmationCount');
    IF @var193 IS NOT NULL EXEC(N'ALTER TABLE [RouteConfiguration] DROP CONSTRAINT [' + @var193 + '];');
    ALTER TABLE [RouteConfiguration] DROP COLUMN [ConfirmationCount];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181102050238_addtableuserkeymaster11022018')
BEGIN
    CREATE TABLE [UserKeyMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [UserId] bigint NOT NULL,
        [uniqueKey] nvarchar(max) NOT NULL,
        [EnableStatus] bit NOT NULL,
        CONSTRAINT [PK_UserKeyMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181102050238_addtableuserkeymaster11022018')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181102050238_addtableuserkeymaster11022018', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181102131424_account02112018_2')
BEGIN
    ALTER TABLE [RouteConfiguration] ADD [ConfirmationCount] int NOT NULL DEFAULT 0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181102131424_account02112018_2')
BEGIN
    CREATE TABLE [IpHistory] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [UserId] int NOT NULL,
        [IpAddress] nvarchar(15) NOT NULL,
        [Location] nvarchar(250) NOT NULL,
        CONSTRAINT [PK_IpHistory] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181102131424_account02112018_2')
BEGIN
    CREATE TABLE [LoginHistory] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [UserId] int NOT NULL,
        [IpAddress] nvarchar(15) NOT NULL,
        [Device] nvarchar(2000) NOT NULL,
        [Location] nvarchar(2000) NOT NULL,
        CONSTRAINT [PK_LoginHistory] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181102131424_account02112018_2')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181102131424_account02112018_2', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181103053115_forAliaskey')
BEGIN
    ALTER TABLE [TradeBuyerList] DROP CONSTRAINT [AK_TradeBuyerList_TrnNo];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181103053115_forAliaskey')
BEGIN
    ALTER TABLE [TradeBuyerList] DROP CONSTRAINT [PK_TradeBuyerList];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181103053115_forAliaskey')
BEGIN
    ALTER TABLE [BizUser] ADD [AliasKey] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181103053115_forAliaskey')
BEGIN
    ALTER TABLE [TradeBuyerList] ADD CONSTRAINT [PK_TradeBuyerList] PRIMARY KEY ([TrnNo]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181103053115_forAliaskey')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181103053115_forAliaskey', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181103054922_removeAliaskey')
BEGIN
    DECLARE @var194 sysname;
    SELECT @var194 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[BizUser]') AND [c].[name] = N'AliasKey');
    IF @var194 IS NOT NULL EXEC(N'ALTER TABLE [BizUser] DROP CONSTRAINT [' + @var194 + '];');
    ALTER TABLE [BizUser] DROP COLUMN [AliasKey];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181103054922_removeAliaskey')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181103054922_removeAliaskey', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181103063842_ConvertFund03112018')
BEGIN
    DECLARE @var195 sysname;
    SELECT @var195 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TransactionQueue]') AND [c].[name] = N'MemberMobile');
    IF @var195 IS NOT NULL EXEC(N'ALTER TABLE [TransactionQueue] DROP CONSTRAINT [' + @var195 + '];');
    ALTER TABLE [TransactionQueue] ALTER COLUMN [MemberMobile] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181103063842_ConvertFund03112018')
BEGIN
    CREATE TABLE [ConvertFundHistory] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [FromWalletId] bigint NOT NULL,
        [ToWalletId] bigint NOT NULL,
        [DestinationPrice] decimal(18, 8) NOT NULL,
        [SourcePrice] decimal(18, 8) NOT NULL,
        [Price] decimal(18, 8) NOT NULL,
        [TrnDate] datetime2 NOT NULL,
        CONSTRAINT [PK_ConvertFundHistory] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181103063842_ConvertFund03112018')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181103063842_ConvertFund03112018', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181103092327_DevicestoreTableForDeviceRegistartion')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181103092327_DevicestoreTableForDeviceRegistartion', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181103093325_DevicestoreTableForDeviceRegistartionv1')
BEGIN
    CREATE TABLE [DeviceStore] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [UserID] bigint NOT NULL,
        [DeviceID] nvarchar(500) NOT NULL,
        CONSTRAINT [PK_DeviceStore] PRIMARY KEY ([Id], [UserID]),
        CONSTRAINT [AK_DeviceStore_UserID] UNIQUE ([UserID])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181103093325_DevicestoreTableForDeviceRegistartionv1')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181103093325_DevicestoreTableForDeviceRegistartionv1', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181103093912_ForTransactionalWalletService')
BEGIN
    DECLARE @var196 sysname;
    SELECT @var196 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletTypeMasters]') AND [c].[name] = N'WalletTypeName');
    IF @var196 IS NOT NULL EXEC(N'ALTER TABLE [WalletTypeMasters] DROP CONSTRAINT [' + @var196 + '];');
    ALTER TABLE [WalletTypeMasters] ALTER COLUMN [WalletTypeName] nvarchar(7) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181103093912_ForTransactionalWalletService')
BEGIN
    DECLARE @var197 sysname;
    SELECT @var197 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ServiceMaster]') AND [c].[name] = N'SMSCode');
    IF @var197 IS NOT NULL EXEC(N'ALTER TABLE [ServiceMaster] DROP CONSTRAINT [' + @var197 + '];');
    ALTER TABLE [ServiceMaster] ALTER COLUMN [SMSCode] nvarchar(6) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181103093912_ForTransactionalWalletService')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181103093912_ForTransactionalWalletService', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181103113202_ProfileMaster')
BEGIN
    CREATE TABLE [CompainTrail] (
        [Id] bigint NOT NULL IDENTITY,
        [ComplainId] bigint NOT NULL,
        [Description] nvarchar(4000) NOT NULL,
        [Remark] nvarchar(2000) NOT NULL,
        [Complainstatus] nvarchar(100) NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        CONSTRAINT [PK_CompainTrail] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181103113202_ProfileMaster')
BEGIN
    CREATE TABLE [Complainmaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [UserID] int NOT NULL,
        [TypeId] bigint NOT NULL,
        [Subject] nvarchar(500) NOT NULL,
        [Description] nvarchar(4000) NOT NULL,
        CONSTRAINT [PK_Complainmaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181103113202_ProfileMaster')
BEGIN
    CREATE TABLE [ProfileMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [TypeId] bigint NOT NULL,
        [Price] decimal(18, 8) NOT NULL,
        [Description] nvarchar(2000) NOT NULL,
        [Level] int NOT NULL,
        [LevelName] nvarchar(150) NOT NULL,
        [DepositFee] decimal(18, 8) NOT NULL,
        [Withdrawalfee] decimal(18, 8) NOT NULL,
        [Tradingfee] decimal(18, 8) NOT NULL,
        [WithdrawalLimit] decimal(18, 8) NOT NULL,
        [EnableStatus] bit NOT NULL,
        CONSTRAINT [PK_ProfileMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181103113202_ProfileMaster')
BEGIN
    CREATE TABLE [Typemaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Type] nvarchar(100) NOT NULL,
        [SubType] nvarchar(150) NOT NULL,
        [EnableStatus] bit NOT NULL,
        CONSTRAINT [PK_Typemaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181103113202_ProfileMaster')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181103113202_ProfileMaster', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181104061021_decimalpaceIssueinTxn')
BEGIN
    DECLARE @var198 sysname;
    SELECT @var198 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeTransactionStatus]') AND [c].[name] = N'TotalQty');
    IF @var198 IS NOT NULL EXEC(N'ALTER TABLE [TradeTransactionStatus] DROP CONSTRAINT [' + @var198 + '];');
    ALTER TABLE [TradeTransactionStatus] ALTER COLUMN [TotalQty] decimal(18, 8) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181104061021_decimalpaceIssueinTxn')
BEGIN
    DECLARE @var199 sysname;
    SELECT @var199 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeTransactionStatus]') AND [c].[name] = N'SoldPrice');
    IF @var199 IS NOT NULL EXEC(N'ALTER TABLE [TradeTransactionStatus] DROP CONSTRAINT [' + @var199 + '];');
    ALTER TABLE [TradeTransactionStatus] ALTER COLUMN [SoldPrice] decimal(18, 8) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181104061021_decimalpaceIssueinTxn')
BEGIN
    DECLARE @var200 sysname;
    SELECT @var200 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeTransactionStatus]') AND [c].[name] = N'SettledQty');
    IF @var200 IS NOT NULL EXEC(N'ALTER TABLE [TradeTransactionStatus] DROP CONSTRAINT [' + @var200 + '];');
    ALTER TABLE [TradeTransactionStatus] ALTER COLUMN [SettledQty] decimal(18, 8) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181104061021_decimalpaceIssueinTxn')
BEGIN
    DECLARE @var201 sysname;
    SELECT @var201 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeTransactionStatus]') AND [c].[name] = N'PendingQty');
    IF @var201 IS NOT NULL EXEC(N'ALTER TABLE [TradeTransactionStatus] DROP CONSTRAINT [' + @var201 + '];');
    ALTER TABLE [TradeTransactionStatus] ALTER COLUMN [PendingQty] decimal(18, 8) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181104061021_decimalpaceIssueinTxn')
BEGIN
    DECLARE @var202 sysname;
    SELECT @var202 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeTransactionStatus]') AND [c].[name] = N'DeliveredQty');
    IF @var202 IS NOT NULL EXEC(N'ALTER TABLE [TradeTransactionStatus] DROP CONSTRAINT [' + @var202 + '];');
    ALTER TABLE [TradeTransactionStatus] ALTER COLUMN [DeliveredQty] decimal(18, 8) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181104061021_decimalpaceIssueinTxn')
BEGIN
    DECLARE @var203 sysname;
    SELECT @var203 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeTransactionStatus]') AND [c].[name] = N'BidPrice');
    IF @var203 IS NOT NULL EXEC(N'ALTER TABLE [TradeTransactionStatus] DROP CONSTRAINT [' + @var203 + '];');
    ALTER TABLE [TradeTransactionStatus] ALTER COLUMN [BidPrice] decimal(18, 8) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181104061021_decimalpaceIssueinTxn')
BEGIN
    DECLARE @var204 sysname;
    SELECT @var204 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeTransactionQueue]') AND [c].[name] = N'TakerPer');
    IF @var204 IS NOT NULL EXEC(N'ALTER TABLE [TradeTransactionQueue] DROP CONSTRAINT [' + @var204 + '];');
    ALTER TABLE [TradeTransactionQueue] ALTER COLUMN [TakerPer] decimal(18, 8) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181104061021_decimalpaceIssueinTxn')
BEGIN
    DECLARE @var205 sysname;
    SELECT @var205 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeTransactionQueue]') AND [c].[name] = N'SettledSellQty');
    IF @var205 IS NOT NULL EXEC(N'ALTER TABLE [TradeTransactionQueue] DROP CONSTRAINT [' + @var205 + '];');
    ALTER TABLE [TradeTransactionQueue] ALTER COLUMN [SettledSellQty] decimal(18, 8) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181104061021_decimalpaceIssueinTxn')
BEGIN
    DECLARE @var206 sysname;
    SELECT @var206 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeTransactionQueue]') AND [c].[name] = N'SettledBuyQty');
    IF @var206 IS NOT NULL EXEC(N'ALTER TABLE [TradeTransactionQueue] DROP CONSTRAINT [' + @var206 + '];');
    ALTER TABLE [TradeTransactionQueue] ALTER COLUMN [SettledBuyQty] decimal(18, 8) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181104061021_decimalpaceIssueinTxn')
BEGIN
    DECLARE @var207 sysname;
    SELECT @var207 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeTransactionQueue]') AND [c].[name] = N'SellQty');
    IF @var207 IS NOT NULL EXEC(N'ALTER TABLE [TradeTransactionQueue] DROP CONSTRAINT [' + @var207 + '];');
    ALTER TABLE [TradeTransactionQueue] ALTER COLUMN [SellQty] decimal(18, 8) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181104061021_decimalpaceIssueinTxn')
BEGIN
    DECLARE @var208 sysname;
    SELECT @var208 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeTransactionQueue]') AND [c].[name] = N'OrderTotalQty');
    IF @var208 IS NOT NULL EXEC(N'ALTER TABLE [TradeTransactionQueue] DROP CONSTRAINT [' + @var208 + '];');
    ALTER TABLE [TradeTransactionQueue] ALTER COLUMN [OrderTotalQty] decimal(18, 8) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181104061021_decimalpaceIssueinTxn')
BEGIN
    DECLARE @var209 sysname;
    SELECT @var209 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeTransactionQueue]') AND [c].[name] = N'DeliveryTotalQty');
    IF @var209 IS NOT NULL EXEC(N'ALTER TABLE [TradeTransactionQueue] DROP CONSTRAINT [' + @var209 + '];');
    ALTER TABLE [TradeTransactionQueue] ALTER COLUMN [DeliveryTotalQty] decimal(18, 8) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181104061021_decimalpaceIssueinTxn')
BEGIN
    DECLARE @var210 sysname;
    SELECT @var210 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeTransactionQueue]') AND [c].[name] = N'BuyQty');
    IF @var210 IS NOT NULL EXEC(N'ALTER TABLE [TradeTransactionQueue] DROP CONSTRAINT [' + @var210 + '];');
    ALTER TABLE [TradeTransactionQueue] ALTER COLUMN [BuyQty] decimal(18, 8) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181104061021_decimalpaceIssueinTxn')
BEGIN
    DECLARE @var211 sysname;
    SELECT @var211 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeTransactionQueue]') AND [c].[name] = N'BidPrice');
    IF @var211 IS NOT NULL EXEC(N'ALTER TABLE [TradeTransactionQueue] DROP CONSTRAINT [' + @var211 + '];');
    ALTER TABLE [TradeTransactionQueue] ALTER COLUMN [BidPrice] decimal(18, 8) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181104061021_decimalpaceIssueinTxn')
BEGIN
    DECLARE @var212 sysname;
    SELECT @var212 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeTransactionQueue]') AND [c].[name] = N'AskPrice');
    IF @var212 IS NOT NULL EXEC(N'ALTER TABLE [TradeTransactionQueue] DROP CONSTRAINT [' + @var212 + '];');
    ALTER TABLE [TradeTransactionQueue] ALTER COLUMN [AskPrice] decimal(18, 8) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181104061021_decimalpaceIssueinTxn')
BEGIN
    ALTER TABLE [TradeStopLoss] ADD [StopPrice] decimal(18, 8) NOT NULL DEFAULT 0.0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181104061021_decimalpaceIssueinTxn')
BEGIN
    DECLARE @var213 sysname;
    SELECT @var213 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeCancelQueue]') AND [c].[name] = N'PendingBuyQty');
    IF @var213 IS NOT NULL EXEC(N'ALTER TABLE [TradeCancelQueue] DROP CONSTRAINT [' + @var213 + '];');
    ALTER TABLE [TradeCancelQueue] ALTER COLUMN [PendingBuyQty] decimal(18, 8) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181104061021_decimalpaceIssueinTxn')
BEGIN
    DECLARE @var214 sysname;
    SELECT @var214 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeCancelQueue]') AND [c].[name] = N'DeliverQty');
    IF @var214 IS NOT NULL EXEC(N'ALTER TABLE [TradeCancelQueue] DROP CONSTRAINT [' + @var214 + '];');
    ALTER TABLE [TradeCancelQueue] ALTER COLUMN [DeliverQty] decimal(18, 8) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181104061021_decimalpaceIssueinTxn')
BEGIN
    DECLARE @var215 sysname;
    SELECT @var215 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeCancelQueue]') AND [c].[name] = N'DeliverBidPrice');
    IF @var215 IS NOT NULL EXEC(N'ALTER TABLE [TradeCancelQueue] DROP CONSTRAINT [' + @var215 + '];');
    ALTER TABLE [TradeCancelQueue] ALTER COLUMN [DeliverBidPrice] decimal(18, 8) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181104061021_decimalpaceIssueinTxn')
BEGIN
    DECLARE @var216 sysname;
    SELECT @var216 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SettledTradeTransactionQueue]') AND [c].[name] = N'SettledSellQty');
    IF @var216 IS NOT NULL EXEC(N'ALTER TABLE [SettledTradeTransactionQueue] DROP CONSTRAINT [' + @var216 + '];');
    ALTER TABLE [SettledTradeTransactionQueue] ALTER COLUMN [SettledSellQty] decimal(18, 8) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181104061021_decimalpaceIssueinTxn')
BEGIN
    DECLARE @var217 sysname;
    SELECT @var217 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SettledTradeTransactionQueue]') AND [c].[name] = N'SettledBuyQty');
    IF @var217 IS NOT NULL EXEC(N'ALTER TABLE [SettledTradeTransactionQueue] DROP CONSTRAINT [' + @var217 + '];');
    ALTER TABLE [SettledTradeTransactionQueue] ALTER COLUMN [SettledBuyQty] decimal(18, 8) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181104061021_decimalpaceIssueinTxn')
BEGIN
    DECLARE @var218 sysname;
    SELECT @var218 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SettledTradeTransactionQueue]') AND [c].[name] = N'SellQty');
    IF @var218 IS NOT NULL EXEC(N'ALTER TABLE [SettledTradeTransactionQueue] DROP CONSTRAINT [' + @var218 + '];');
    ALTER TABLE [SettledTradeTransactionQueue] ALTER COLUMN [SellQty] decimal(18, 8) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181104061021_decimalpaceIssueinTxn')
BEGIN
    DECLARE @var219 sysname;
    SELECT @var219 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SettledTradeTransactionQueue]') AND [c].[name] = N'OrderTotalQty');
    IF @var219 IS NOT NULL EXEC(N'ALTER TABLE [SettledTradeTransactionQueue] DROP CONSTRAINT [' + @var219 + '];');
    ALTER TABLE [SettledTradeTransactionQueue] ALTER COLUMN [OrderTotalQty] decimal(18, 8) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181104061021_decimalpaceIssueinTxn')
BEGIN
    DECLARE @var220 sysname;
    SELECT @var220 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SettledTradeTransactionQueue]') AND [c].[name] = N'DeliveryTotalQty');
    IF @var220 IS NOT NULL EXEC(N'ALTER TABLE [SettledTradeTransactionQueue] DROP CONSTRAINT [' + @var220 + '];');
    ALTER TABLE [SettledTradeTransactionQueue] ALTER COLUMN [DeliveryTotalQty] decimal(18, 8) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181104061021_decimalpaceIssueinTxn')
BEGIN
    DECLARE @var221 sysname;
    SELECT @var221 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SettledTradeTransactionQueue]') AND [c].[name] = N'BuyQty');
    IF @var221 IS NOT NULL EXEC(N'ALTER TABLE [SettledTradeTransactionQueue] DROP CONSTRAINT [' + @var221 + '];');
    ALTER TABLE [SettledTradeTransactionQueue] ALTER COLUMN [BuyQty] decimal(18, 8) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181104061021_decimalpaceIssueinTxn')
BEGIN
    DECLARE @var222 sysname;
    SELECT @var222 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SettledTradeTransactionQueue]') AND [c].[name] = N'BidPrice');
    IF @var222 IS NOT NULL EXEC(N'ALTER TABLE [SettledTradeTransactionQueue] DROP CONSTRAINT [' + @var222 + '];');
    ALTER TABLE [SettledTradeTransactionQueue] ALTER COLUMN [BidPrice] decimal(18, 8) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181104061021_decimalpaceIssueinTxn')
BEGIN
    DECLARE @var223 sysname;
    SELECT @var223 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SettledTradeTransactionQueue]') AND [c].[name] = N'AskPrice');
    IF @var223 IS NOT NULL EXEC(N'ALTER TABLE [SettledTradeTransactionQueue] DROP CONSTRAINT [' + @var223 + '];');
    ALTER TABLE [SettledTradeTransactionQueue] ALTER COLUMN [AskPrice] decimal(18, 8) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181104061021_decimalpaceIssueinTxn')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181104061021_decimalpaceIssueinTxn', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181104063350_SubscriptionDset')
BEGIN
    DECLARE @var224 sysname;
    SELECT @var224 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletLimitConfigurationMaster]') AND [c].[name] = N'LimitPerTransaction');
    IF @var224 IS NOT NULL EXEC(N'ALTER TABLE [WalletLimitConfigurationMaster] DROP CONSTRAINT [' + @var224 + '];');
    ALTER TABLE [WalletLimitConfigurationMaster] ALTER COLUMN [LimitPerTransaction] decimal(18, 8) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181104063350_SubscriptionDset')
BEGIN
    DECLARE @var225 sysname;
    SELECT @var225 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletLimitConfigurationMaster]') AND [c].[name] = N'LimitPerHour');
    IF @var225 IS NOT NULL EXEC(N'ALTER TABLE [WalletLimitConfigurationMaster] DROP CONSTRAINT [' + @var225 + '];');
    ALTER TABLE [WalletLimitConfigurationMaster] ALTER COLUMN [LimitPerHour] decimal(18, 8) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181104063350_SubscriptionDset')
BEGIN
    DECLARE @var226 sysname;
    SELECT @var226 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletLimitConfigurationMaster]') AND [c].[name] = N'LimitPerDay');
    IF @var226 IS NOT NULL EXEC(N'ALTER TABLE [WalletLimitConfigurationMaster] DROP CONSTRAINT [' + @var226 + '];');
    ALTER TABLE [WalletLimitConfigurationMaster] ALTER COLUMN [LimitPerDay] decimal(18, 8) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181104063350_SubscriptionDset')
BEGIN
    DECLARE @var227 sysname;
    SELECT @var227 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletLimitConfiguration]') AND [c].[name] = N'LimitPerTransaction');
    IF @var227 IS NOT NULL EXEC(N'ALTER TABLE [WalletLimitConfiguration] DROP CONSTRAINT [' + @var227 + '];');
    ALTER TABLE [WalletLimitConfiguration] ALTER COLUMN [LimitPerTransaction] decimal(18, 8) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181104063350_SubscriptionDset')
BEGIN
    DECLARE @var228 sysname;
    SELECT @var228 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletLimitConfiguration]') AND [c].[name] = N'LimitPerHour');
    IF @var228 IS NOT NULL EXEC(N'ALTER TABLE [WalletLimitConfiguration] DROP CONSTRAINT [' + @var228 + '];');
    ALTER TABLE [WalletLimitConfiguration] ALTER COLUMN [LimitPerHour] decimal(18, 8) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181104063350_SubscriptionDset')
BEGIN
    DECLARE @var229 sysname;
    SELECT @var229 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletLimitConfiguration]') AND [c].[name] = N'LimitPerDay');
    IF @var229 IS NOT NULL EXEC(N'ALTER TABLE [WalletLimitConfiguration] DROP CONSTRAINT [' + @var229 + '];');
    ALTER TABLE [WalletLimitConfiguration] ALTER COLUMN [LimitPerDay] decimal(18, 8) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181104063350_SubscriptionDset')
BEGIN
    CREATE TABLE [PersonalVerification] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [UserID] int NOT NULL,
        [Surname] nvarchar(150) NOT NULL,
        [GivenName] nvarchar(150) NOT NULL,
        [ValidIdentityCard] nvarchar(150) NOT NULL,
        [FrontImage] nvarchar(500) NOT NULL,
        [BackImage] nvarchar(500) NOT NULL,
        [SelfieImage] nvarchar(500) NOT NULL,
        [EnableStatus] bit NOT NULL,
        [VerifyStatus] bit NOT NULL,
        CONSTRAINT [PK_PersonalVerification] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181104063350_SubscriptionDset')
BEGIN
    CREATE TABLE [SubscriptionMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [UserId] int NOT NULL,
        [ProfileId] bigint NOT NULL,
        [StartDate] datetime2 NOT NULL,
        [EndDate] datetime2 NOT NULL,
        [ActiveStatus] bit NOT NULL,
        CONSTRAINT [PK_SubscriptionMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181104063350_SubscriptionDset')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181104063350_SubscriptionDset', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181104065458_forTeplateMaster')
BEGIN
    DECLARE @var230 sysname;
    SELECT @var230 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TemplateMaster]') AND [c].[name] = N'Content');
    IF @var230 IS NOT NULL EXEC(N'ALTER TABLE [TemplateMaster] DROP CONSTRAINT [' + @var230 + '];');
    ALTER TABLE [TemplateMaster] ALTER COLUMN [Content] nvarchar(max) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181104065458_forTeplateMaster')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181104065458_forTeplateMaster', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181104070154_forCompainTrailRemoveTable')
BEGIN
    DROP TABLE [CompainTrail];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181104070154_forCompainTrailRemoveTable')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181104070154_forCompainTrailRemoveTable', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181104070246_forCompainTrailAddTable')
BEGIN
    CREATE TABLE [CompainTrail] (
        [Id] bigint NOT NULL IDENTITY,
        [ComplainId] bigint NOT NULL,
        [Description] nvarchar(4000) NOT NULL,
        [Remark] nvarchar(2000) NOT NULL,
        [Complainstatus] nvarchar(100) NOT NULL,
        [CreatedBy] bigint NULL,
        [CreatedDate] datetime2 NULL,
        CONSTRAINT [PK_CompainTrail] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181104070246_forCompainTrailAddTable')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181104070246_forCompainTrailAddTable', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181105123237_KYCTable11052018')
BEGIN
    ALTER TABLE [PersonalVerification] ADD [KYCLevelId] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181105123237_KYCTable11052018')
BEGIN
    DECLARE @var231 sysname;
    SELECT @var231 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CompainTrail]') AND [c].[name] = N'Remark');
    IF @var231 IS NOT NULL EXEC(N'ALTER TABLE [CompainTrail] DROP CONSTRAINT [' + @var231 + '];');
    ALTER TABLE [CompainTrail] ALTER COLUMN [Remark] nvarchar(2000) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181105123237_KYCTable11052018')
BEGIN
    CREATE TABLE [kYCLevelMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [KYCName] nvarchar(150) NOT NULL,
        [Level] int NOT NULL,
        [EnableStatus] bit NOT NULL,
        [IsDelete] bit NOT NULL,
        CONSTRAINT [PK_kYCLevelMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181105123237_KYCTable11052018')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181105123237_KYCTable11052018', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181106063713_xyzfortesting')
BEGIN
    DECLARE @var232 sysname;
    SELECT @var232 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WithdrawHistory]') AND [c].[name] = N'Wallet');
    IF @var232 IS NOT NULL EXEC(N'ALTER TABLE [WithdrawHistory] DROP CONSTRAINT [' + @var232 + '];');
    ALTER TABLE [WithdrawHistory] ALTER COLUMN [Wallet] bigint NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181106063713_xyzfortesting')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181106063713_xyzfortesting', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181106064000_changeonWithdrawHistory')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181106064000_changeonWithdrawHistory', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181106064132_changeonWithdrawHistoryv1')
BEGIN
    DECLARE @var233 sysname;
    SELECT @var233 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WithdrawHistory]') AND [c].[name] = N'Wallet');
    IF @var233 IS NOT NULL EXEC(N'ALTER TABLE [WithdrawHistory] DROP CONSTRAINT [' + @var233 + '];');
    ALTER TABLE [WithdrawHistory] ALTER COLUMN [Wallet] bigint NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181106064132_changeonWithdrawHistoryv1')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181106064132_changeonWithdrawHistoryv1', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181106110454_changeonWithdrawHistoryv2')
BEGIN
    DECLARE @var234 sysname;
    SELECT @var234 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WithdrawHistory]') AND [c].[name] = N'Address');
    IF @var234 IS NOT NULL EXEC(N'ALTER TABLE [WithdrawHistory] DROP CONSTRAINT [' + @var234 + '];');
    ALTER TABLE [WithdrawHistory] ALTER COLUMN [Address] nvarchar(100) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181106110454_changeonWithdrawHistoryv2')
BEGIN
    DECLARE @var235 sysname;
    SELECT @var235 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WithdrawHistory]') AND [c].[name] = N'TrnID');
    IF @var235 IS NOT NULL EXEC(N'ALTER TABLE [WithdrawHistory] DROP CONSTRAINT [' + @var235 + '];');
    ALTER TABLE [WithdrawHistory] ALTER COLUMN [TrnID] nvarchar(1000) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181106110454_changeonWithdrawHistoryv2')
BEGIN
    ALTER TABLE [WithdrawHistory] ADD CONSTRAINT [PK_WithdrawHistory] PRIMARY KEY ([Id]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181106110454_changeonWithdrawHistoryv2')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181106110454_changeonWithdrawHistoryv2', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181114115626_TrnDateInGraphData')
BEGIN
    ALTER TABLE [TradePairStastics] ADD [TranDate] datetime2 NOT NULL DEFAULT '0001-01-01T00:00:00.0000000';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181114115626_TrnDateInGraphData')
BEGIN
    CREATE TABLE [TrnTypeMaster] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [TrnTypeId] int NOT NULL,
        [TrnTypeName] nvarchar(20) NOT NULL,
        CONSTRAINT [PK_TrnTypeMaster] PRIMARY KEY ([TrnTypeId])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181114115626_TrnDateInGraphData')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181114115626_TrnDateInGraphData', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181116063319_settledQueueChange')
BEGIN
    ALTER TABLE [SettledTradeTransactionQueue] DROP CONSTRAINT [PK_SettledTradeTransactionQueue];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181116063319_settledQueueChange')
BEGIN
    DECLARE @var236 sysname;
    SELECT @var236 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SettledTradeTransactionQueue]') AND [c].[name] = N'ProductID');
    IF @var236 IS NOT NULL EXEC(N'ALTER TABLE [SettledTradeTransactionQueue] DROP CONSTRAINT [' + @var236 + '];');
    ALTER TABLE [SettledTradeTransactionQueue] DROP COLUMN [ProductID];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181116063319_settledQueueChange')
BEGIN
    DECLARE @var237 sysname;
    SELECT @var237 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SettledTradeTransactionQueue]') AND [c].[name] = N'RoutID');
    IF @var237 IS NOT NULL EXEC(N'ALTER TABLE [SettledTradeTransactionQueue] DROP CONSTRAINT [' + @var237 + '];');
    ALTER TABLE [SettledTradeTransactionQueue] DROP COLUMN [RoutID];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181116063319_settledQueueChange')
BEGIN
    DECLARE @var238 sysname;
    SELECT @var238 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SettledTradeTransactionQueue]') AND [c].[name] = N'SerProID');
    IF @var238 IS NOT NULL EXEC(N'ALTER TABLE [SettledTradeTransactionQueue] DROP CONSTRAINT [' + @var238 + '];');
    ALTER TABLE [SettledTradeTransactionQueue] DROP COLUMN [SerProID];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181116063319_settledQueueChange')
BEGIN
    DECLARE @var239 sysname;
    SELECT @var239 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SettledTradeTransactionQueue]') AND [c].[name] = N'ServiceID');
    IF @var239 IS NOT NULL EXEC(N'ALTER TABLE [SettledTradeTransactionQueue] DROP CONSTRAINT [' + @var239 + '];');
    ALTER TABLE [SettledTradeTransactionQueue] DROP COLUMN [ServiceID];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181116063319_settledQueueChange')
BEGIN
    DECLARE @var240 sysname;
    SELECT @var240 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SettledTradeTransactionQueue]') AND [c].[name] = N'TakerPer');
    IF @var240 IS NOT NULL EXEC(N'ALTER TABLE [SettledTradeTransactionQueue] DROP CONSTRAINT [' + @var240 + '];');
    ALTER TABLE [SettledTradeTransactionQueue] ALTER COLUMN [TakerPer] decimal(18, 8) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181116063319_settledQueueChange')
BEGIN
    ALTER TABLE [SettledTradeTransactionQueue] ADD CONSTRAINT [PK_SettledTradeTransactionQueue] PRIMARY KEY ([TrnNo]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181116063319_settledQueueChange')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181116063319_settledQueueChange', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181119074641_TradeTQAccountIDAdded')
BEGIN
    ALTER TABLE [TradeTransactionQueue] ADD [DeliveryAccountID] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181119074641_TradeTQAccountIDAdded')
BEGIN
    ALTER TABLE [TradeTransactionQueue] ADD [OrderAccountID] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181119074641_TradeTQAccountIDAdded')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181119074641_TradeTQAccountIDAdded', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181120065437_coinnamelength20112018')
BEGIN
    DECLARE @var241 sysname;
    SELECT @var241 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletTransactionQueues]') AND [c].[name] = N'WalletType');
    IF @var241 IS NOT NULL EXEC(N'ALTER TABLE [WalletTransactionQueues] DROP CONSTRAINT [' + @var241 + '];');
    ALTER TABLE [WalletTransactionQueues] ALTER COLUMN [WalletType] nvarchar(10) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181120065437_coinnamelength20112018')
BEGIN
    DECLARE @var242 sysname;
    SELECT @var242 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletTransactionOrders]') AND [c].[name] = N'WalletType');
    IF @var242 IS NOT NULL EXEC(N'ALTER TABLE [WalletTransactionOrders] DROP CONSTRAINT [' + @var242 + '];');
    ALTER TABLE [WalletTransactionOrders] ALTER COLUMN [WalletType] nvarchar(10) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181120065437_coinnamelength20112018')
BEGIN
    CREATE TABLE [BlockWalletTrnTypeMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [WalletTypeID] bigint NOT NULL,
        [TrnTypeID] bigint NOT NULL,
        CONSTRAINT [PK_BlockWalletTrnTypeMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181120065437_coinnamelength20112018')
BEGIN
    CREATE TABLE [ChargePolicy] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [PolicyName] nvarchar(50) NOT NULL,
        [WalletTrnType] bigint NOT NULL,
        [MinAmount] decimal(18, 8) NOT NULL,
        [MaxAmount] decimal(18, 8) NOT NULL,
        [WalletType] bigint NOT NULL,
        [Type] bigint NOT NULL,
        [ChargeType] bigint NOT NULL,
        [ChargeValue] decimal(18, 2) NOT NULL,
        CONSTRAINT [PK_ChargePolicy] PRIMARY KEY ([WalletTrnType], [WalletType])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181120065437_coinnamelength20112018')
BEGIN
    CREATE TABLE [CommissionPolicy] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [PolicyName] nvarchar(50) NOT NULL,
        [WalletTrnType] bigint NOT NULL,
        [MinAmount] decimal(18, 8) NOT NULL,
        [MaxAmount] decimal(18, 8) NOT NULL,
        [WalletType] bigint NOT NULL,
        [Type] bigint NOT NULL,
        [CommissionType] bigint NOT NULL,
        [CommissionValue] decimal(18, 2) NOT NULL,
        CONSTRAINT [PK_CommissionPolicy] PRIMARY KEY ([WalletTrnType], [WalletType])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181120065437_coinnamelength20112018')
BEGIN
    CREATE TABLE [CurrencyTypeMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [CurrencyTypeName] nvarchar(7) NOT NULL,
        CONSTRAINT [PK_CurrencyTypeMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181120065437_coinnamelength20112018')
BEGIN
    CREATE TABLE [OrganizationMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [OrganizationName] nvarchar(50) NOT NULL,
        CONSTRAINT [PK_OrganizationMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181120065437_coinnamelength20112018')
BEGIN
    CREATE TABLE [OrganizationUserMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [OrganizationID] bigint NOT NULL,
        [UserID] bigint NOT NULL,
        CONSTRAINT [PK_OrganizationUserMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181120065437_coinnamelength20112018')
BEGIN
    CREATE TABLE [UserMaster] (
        [Id] int NOT NULL IDENTITY,
        [UserName] nvarchar(max) NULL,
        [NormalizedUserName] nvarchar(max) NULL,
        [Email] nvarchar(max) NULL,
        [NormalizedEmail] nvarchar(max) NULL,
        [EmailConfirmed] bit NOT NULL,
        [PasswordHash] nvarchar(max) NULL,
        [SecurityStamp] nvarchar(max) NULL,
        [ConcurrencyStamp] nvarchar(max) NULL,
        [PhoneNumber] nvarchar(max) NULL,
        [PhoneNumberConfirmed] bit NOT NULL,
        [TwoFactorEnabled] bit NOT NULL,
        [LockoutEnd] datetimeoffset NULL,
        [LockoutEnabled] bit NOT NULL,
        [AccessFailedCount] int NOT NULL,
        [IsEnabled] bit NOT NULL,
        [CreatedDate] datetime2 NOT NULL,
        [FirstName] nvarchar(250) NULL,
        [LastName] nvarchar(250) NULL,
        [Mobile] nvarchar(max) NULL,
        [ProfilePhotoId] int NULL,
        CONSTRAINT [PK_UserMaster] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_UserMaster_BizUserPhotos_ProfilePhotoId] FOREIGN KEY ([ProfilePhotoId]) REFERENCES [BizUserPhotos] ([Id]) ON DELETE NO ACTION
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181120065437_coinnamelength20112018')
BEGIN
    CREATE TABLE [UserRoleMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [RoleName] nvarchar(20) NOT NULL,
        [RoleType] nvarchar(20) NOT NULL,
        CONSTRAINT [PK_UserRoleMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181120065437_coinnamelength20112018')
BEGIN
    CREATE TABLE [UserTypeMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [UserType] nvarchar(20) NOT NULL,
        CONSTRAINT [PK_UserTypeMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181120065437_coinnamelength20112018')
BEGIN
    CREATE TABLE [UserWalletBlockTrnTypeMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [WalletID] bigint NOT NULL,
        [WTrnTypeMasterID] bigint NOT NULL,
        CONSTRAINT [PK_UserWalletBlockTrnTypeMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181120065437_coinnamelength20112018')
BEGIN
    CREATE TABLE [UserWalletMaster] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [WalletName] nvarchar(50) NOT NULL,
        [Balance] decimal(18, 8) NOT NULL,
        [WalletTypeID] bigint NOT NULL,
        [IsValid] bit NOT NULL,
        [AccWalletID] nvarchar(16) NOT NULL,
        [UserID] bigint NOT NULL,
        [PublicAddress] nvarchar(50) NOT NULL,
        [IsDefaultWallet] tinyint NOT NULL,
        [OrganizationID] bigint NOT NULL,
        [ExpiryDate] datetime2 NOT NULL,
        CONSTRAINT [PK_UserWalletMaster] PRIMARY KEY ([AccWalletID])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181120065437_coinnamelength20112018')
BEGIN
    CREATE TABLE [Wallet_TypeMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [WalletTypeName] nvarchar(7) NOT NULL,
        [Discription] nvarchar(100) NOT NULL,
        [CurrencyTypeID] bigint NOT NULL,
        CONSTRAINT [PK_Wallet_TypeMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181120065437_coinnamelength20112018')
BEGIN
    CREATE TABLE [WalletAuthorizeUserMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [WalletID] bigint NOT NULL,
        [UserID] bigint NOT NULL,
        [OrgID] bigint NOT NULL,
        CONSTRAINT [PK_WalletAuthorizeUserMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181120065437_coinnamelength20112018')
BEGIN
    CREATE TABLE [WTrnTypeMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [TrnTypeName] nvarchar(7) NOT NULL,
        [Discription] nvarchar(50) NOT NULL,
        CONSTRAINT [PK_WTrnTypeMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181120065437_coinnamelength20112018')
BEGIN
    CREATE INDEX [IX_UserMaster_ProfilePhotoId] ON [UserMaster] ([ProfilePhotoId]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181120065437_coinnamelength20112018')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181120065437_coinnamelength20112018', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181120091336_walletnewchanges20112018')
BEGIN
    ALTER TABLE [WTrnTypeMaster] DROP CONSTRAINT [PK_WTrnTypeMaster];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181120091336_walletnewchanges20112018')
BEGIN
    ALTER TABLE [UserTypeMaster] DROP CONSTRAINT [PK_UserTypeMaster];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181120091336_walletnewchanges20112018')
BEGIN
    ALTER TABLE [CurrencyTypeMaster] DROP CONSTRAINT [PK_CurrencyTypeMaster];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181120091336_walletnewchanges20112018')
BEGIN
    ALTER TABLE [WTrnTypeMaster] ADD [TrnTypeId] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181120091336_walletnewchanges20112018')
BEGIN
    ALTER TABLE [UserTypeMaster] ADD [UserTypeId] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181120091336_walletnewchanges20112018')
BEGIN
    ALTER TABLE [CurrencyTypeMaster] ADD [CurrencyTypeId] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181120091336_walletnewchanges20112018')
BEGIN
    ALTER TABLE [WTrnTypeMaster] ADD CONSTRAINT [PK_WTrnTypeMaster] PRIMARY KEY ([TrnTypeId]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181120091336_walletnewchanges20112018')
BEGIN
    ALTER TABLE [UserTypeMaster] ADD CONSTRAINT [PK_UserTypeMaster] PRIMARY KEY ([UserTypeId]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181120091336_walletnewchanges20112018')
BEGIN
    ALTER TABLE [CurrencyTypeMaster] ADD CONSTRAINT [PK_CurrencyTypeMaster] PRIMARY KEY ([CurrencyTypeId]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181120091336_walletnewchanges20112018')
BEGIN
    CREATE TABLE [ActivityTypeMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [TypeName] nvarchar(max) NOT NULL,
        CONSTRAINT [PK_ActivityTypeMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181120091336_walletnewchanges20112018')
BEGIN
    CREATE TABLE [AllowedChannels] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [ChannelID] bigint NOT NULL,
        [ChannelName] nvarchar(max) NOT NULL,
        CONSTRAINT [PK_AllowedChannels] PRIMARY KEY ([ChannelID])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181120091336_walletnewchanges20112018')
BEGIN
    CREATE TABLE [AuditActivityLog] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [EntityType] nvarchar(max) NOT NULL,
        [ColumnName] nvarchar(max) NOT NULL,
        [OldValue] nvarchar(max) NOT NULL,
        [NewValue] nvarchar(max) NOT NULL,
        [Remarks] nvarchar(max) NULL,
        CONSTRAINT [PK_AuditActivityLog] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181120091336_walletnewchanges20112018')
BEGIN
    CREATE TABLE [AutorizedApps] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [AppName] nvarchar(max) NOT NULL,
        [SecretKey] nvarchar(max) NOT NULL,
        CONSTRAINT [PK_AutorizedApps] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181120091336_walletnewchanges20112018')
BEGIN
    CREATE TABLE [ChargeTypeMaster] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [ChargeTypeId] bigint NOT NULL,
        [ChargeName] nvarchar(max) NOT NULL,
        CONSTRAINT [PK_ChargeTypeMaster] PRIMARY KEY ([ChargeTypeId])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181120091336_walletnewchanges20112018')
BEGIN
    CREATE TABLE [CommissionTypeMaster] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [CommissionTypeId] bigint NOT NULL,
        [TypeName] nvarchar(max) NOT NULL,
        CONSTRAINT [PK_CommissionTypeMaster] PRIMARY KEY ([CommissionTypeId])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181120091336_walletnewchanges20112018')
BEGIN
    CREATE TABLE [ServiceProvider] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [ServiceProviderName] nvarchar(max) NOT NULL,
        CONSTRAINT [PK_ServiceProvider] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181120091336_walletnewchanges20112018')
BEGIN
    CREATE TABLE [TransactionBlockedChannel] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [ChannelID] bigint NOT NULL,
        [ChannelName] nvarchar(max) NOT NULL,
        [TrnType] bigint NOT NULL,
        CONSTRAINT [PK_TransactionBlockedChannel] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181120091336_walletnewchanges20112018')
BEGIN
    CREATE TABLE [TransactionPolicy] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [TrnType] bigint NOT NULL,
        [AllowedIP] nvarchar(max) NOT NULL,
        [AllowedLocation] nvarchar(max) NOT NULL,
        [AuthenticationType] int NOT NULL,
        [StartTime] float NULL,
        [EndTime] float NULL,
        [DailyTrnCount] bigint NOT NULL,
        [DailyTrnAmount] decimal(18, 8) NOT NULL,
        [MonthlyTrnCount] bigint NOT NULL,
        [MonthlyTrnAmount] decimal(18, 8) NOT NULL,
        [WeeklyTrnCount] bigint NOT NULL,
        [WeeklyTrnAmount] decimal(18, 8) NOT NULL,
        [YearlyTrnCount] bigint NOT NULL,
        [YearlyTrnAmount] decimal(18, 8) NOT NULL,
        [MinAmount] decimal(18, 8) NOT NULL,
        [MaxAmount] decimal(18, 8) NOT NULL,
        [AuthorityType] smallint NOT NULL,
        [AllowedUserType] smallint NOT NULL,
        CONSTRAINT [PK_TransactionPolicy] PRIMARY KEY ([TrnType])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181120091336_walletnewchanges20112018')
BEGIN
    CREATE TABLE [TransactionPolicyAllowedRole] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [TrnPolicyID] bigint NOT NULL,
        [RoleID] bigint NOT NULL,
        CONSTRAINT [PK_TransactionPolicyAllowedRole] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181120091336_walletnewchanges20112018')
BEGIN
    CREATE TABLE [UserActivityLog] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [ActivityType] smallint NOT NULL,
        [UserID] bigint NOT NULL,
        [WalletID] bigint NOT NULL,
        [TrnDate] datetime2 NOT NULL,
        [TrnNo] bigint NOT NULL,
        [Remarks] nvarchar(max) NULL,
        [WalletTrnType] smallint NOT NULL,
        CONSTRAINT [PK_UserActivityLog] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181120091336_walletnewchanges20112018')
BEGIN
    CREATE TABLE [WalletPolicyAllowedDay] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [WalletPolicyID] bigint NOT NULL,
        [DayNo] smallint NOT NULL,
        CONSTRAINT [PK_WalletPolicyAllowedDay] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181120091336_walletnewchanges20112018')
BEGIN
    CREATE TABLE [WalletUsagePolicy] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [WalletType] bigint NOT NULL,
        [AllowedIP] nvarchar(max) NOT NULL,
        [AllowedLocation] nvarchar(max) NOT NULL,
        [AuthenticationType] int NOT NULL,
        [StartTime] float NULL,
        [EndTime] float NULL,
        [HourlyTrnCount] bigint NOT NULL,
        [HourlyTrnAmount] decimal(18, 8) NOT NULL,
        [DailyTrnCount] bigint NOT NULL,
        [DailyTrnAmount] decimal(18, 8) NOT NULL,
        [MonthlyTrnCount] bigint NOT NULL,
        [MonthlyTrnAmount] decimal(18, 8) NOT NULL,
        [WeeklyTrnCount] bigint NOT NULL,
        [WeeklyTrnAmount] decimal(18, 8) NOT NULL,
        [YearlyTrnCount] bigint NOT NULL,
        [YearlyTrnAmount] decimal(18, 8) NOT NULL,
        [LifeTimeTrnCount] bigint NOT NULL,
        [LifeTimeTrnAmount] decimal(18, 8) NOT NULL,
        [MinAmount] decimal(18, 8) NOT NULL,
        [MaxAmount] decimal(18, 8) NOT NULL,
        CONSTRAINT [PK_WalletUsagePolicy] PRIMARY KEY ([WalletType])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181120091336_walletnewchanges20112018')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181120091336_walletnewchanges20112018', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181120134609_WalletTrnTypemasterStringLength')
BEGIN
    DECLARE @var243 sysname;
    SELECT @var243 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WTrnTypeMaster]') AND [c].[name] = N'TrnTypeName');
    IF @var243 IS NOT NULL EXEC(N'ALTER TABLE [WTrnTypeMaster] DROP CONSTRAINT [' + @var243 + '];');
    ALTER TABLE [WTrnTypeMaster] ALTER COLUMN [TrnTypeName] nvarchar(50) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181120134609_WalletTrnTypemasterStringLength')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181120134609_WalletTrnTypemasterStringLength', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181121123615_walletEntities21112018')
BEGIN
    ALTER TABLE [UserMaster] DROP CONSTRAINT [FK_UserMaster_BizUserPhotos_ProfilePhotoId];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181121123615_walletEntities21112018')
BEGIN
    ALTER TABLE [UserMaster] DROP CONSTRAINT [PK_UserMaster];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181121123615_walletEntities21112018')
BEGIN
    DROP INDEX [IX_UserMaster_ProfilePhotoId] ON [UserMaster];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181121123615_walletEntities21112018')
BEGIN
    DECLARE @var244 sysname;
    SELECT @var244 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[UserMaster]') AND [c].[name] = N'AccessFailedCount');
    IF @var244 IS NOT NULL EXEC(N'ALTER TABLE [UserMaster] DROP CONSTRAINT [' + @var244 + '];');
    ALTER TABLE [UserMaster] DROP COLUMN [AccessFailedCount];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181121123615_walletEntities21112018')
BEGIN
    DECLARE @var245 sysname;
    SELECT @var245 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[UserMaster]') AND [c].[name] = N'ConcurrencyStamp');
    IF @var245 IS NOT NULL EXEC(N'ALTER TABLE [UserMaster] DROP CONSTRAINT [' + @var245 + '];');
    ALTER TABLE [UserMaster] DROP COLUMN [ConcurrencyStamp];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181121123615_walletEntities21112018')
BEGIN
    DECLARE @var246 sysname;
    SELECT @var246 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[UserMaster]') AND [c].[name] = N'Email');
    IF @var246 IS NOT NULL EXEC(N'ALTER TABLE [UserMaster] DROP CONSTRAINT [' + @var246 + '];');
    ALTER TABLE [UserMaster] DROP COLUMN [Email];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181121123615_walletEntities21112018')
BEGIN
    DECLARE @var247 sysname;
    SELECT @var247 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[UserMaster]') AND [c].[name] = N'EmailConfirmed');
    IF @var247 IS NOT NULL EXEC(N'ALTER TABLE [UserMaster] DROP CONSTRAINT [' + @var247 + '];');
    ALTER TABLE [UserMaster] DROP COLUMN [EmailConfirmed];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181121123615_walletEntities21112018')
BEGIN
    DECLARE @var248 sysname;
    SELECT @var248 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[UserMaster]') AND [c].[name] = N'FirstName');
    IF @var248 IS NOT NULL EXEC(N'ALTER TABLE [UserMaster] DROP CONSTRAINT [' + @var248 + '];');
    ALTER TABLE [UserMaster] DROP COLUMN [FirstName];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181121123615_walletEntities21112018')
BEGIN
    DECLARE @var249 sysname;
    SELECT @var249 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[UserMaster]') AND [c].[name] = N'IsEnabled');
    IF @var249 IS NOT NULL EXEC(N'ALTER TABLE [UserMaster] DROP CONSTRAINT [' + @var249 + '];');
    ALTER TABLE [UserMaster] DROP COLUMN [IsEnabled];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181121123615_walletEntities21112018')
BEGIN
    DECLARE @var250 sysname;
    SELECT @var250 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[UserMaster]') AND [c].[name] = N'LastName');
    IF @var250 IS NOT NULL EXEC(N'ALTER TABLE [UserMaster] DROP CONSTRAINT [' + @var250 + '];');
    ALTER TABLE [UserMaster] DROP COLUMN [LastName];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181121123615_walletEntities21112018')
BEGIN
    DECLARE @var251 sysname;
    SELECT @var251 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[UserMaster]') AND [c].[name] = N'LockoutEnabled');
    IF @var251 IS NOT NULL EXEC(N'ALTER TABLE [UserMaster] DROP CONSTRAINT [' + @var251 + '];');
    ALTER TABLE [UserMaster] DROP COLUMN [LockoutEnabled];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181121123615_walletEntities21112018')
BEGIN
    DECLARE @var252 sysname;
    SELECT @var252 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[UserMaster]') AND [c].[name] = N'LockoutEnd');
    IF @var252 IS NOT NULL EXEC(N'ALTER TABLE [UserMaster] DROP CONSTRAINT [' + @var252 + '];');
    ALTER TABLE [UserMaster] DROP COLUMN [LockoutEnd];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181121123615_walletEntities21112018')
BEGIN
    DECLARE @var253 sysname;
    SELECT @var253 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[UserMaster]') AND [c].[name] = N'Mobile');
    IF @var253 IS NOT NULL EXEC(N'ALTER TABLE [UserMaster] DROP CONSTRAINT [' + @var253 + '];');
    ALTER TABLE [UserMaster] DROP COLUMN [Mobile];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181121123615_walletEntities21112018')
BEGIN
    DECLARE @var254 sysname;
    SELECT @var254 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[UserMaster]') AND [c].[name] = N'NormalizedEmail');
    IF @var254 IS NOT NULL EXEC(N'ALTER TABLE [UserMaster] DROP CONSTRAINT [' + @var254 + '];');
    ALTER TABLE [UserMaster] DROP COLUMN [NormalizedEmail];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181121123615_walletEntities21112018')
BEGIN
    DECLARE @var255 sysname;
    SELECT @var255 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[UserMaster]') AND [c].[name] = N'NormalizedUserName');
    IF @var255 IS NOT NULL EXEC(N'ALTER TABLE [UserMaster] DROP CONSTRAINT [' + @var255 + '];');
    ALTER TABLE [UserMaster] DROP COLUMN [NormalizedUserName];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181121123615_walletEntities21112018')
BEGIN
    DECLARE @var256 sysname;
    SELECT @var256 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[UserMaster]') AND [c].[name] = N'PasswordHash');
    IF @var256 IS NOT NULL EXEC(N'ALTER TABLE [UserMaster] DROP CONSTRAINT [' + @var256 + '];');
    ALTER TABLE [UserMaster] DROP COLUMN [PasswordHash];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181121123615_walletEntities21112018')
BEGIN
    DECLARE @var257 sysname;
    SELECT @var257 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[UserMaster]') AND [c].[name] = N'PhoneNumber');
    IF @var257 IS NOT NULL EXEC(N'ALTER TABLE [UserMaster] DROP CONSTRAINT [' + @var257 + '];');
    ALTER TABLE [UserMaster] DROP COLUMN [PhoneNumber];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181121123615_walletEntities21112018')
BEGIN
    DECLARE @var258 sysname;
    SELECT @var258 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[UserMaster]') AND [c].[name] = N'PhoneNumberConfirmed');
    IF @var258 IS NOT NULL EXEC(N'ALTER TABLE [UserMaster] DROP CONSTRAINT [' + @var258 + '];');
    ALTER TABLE [UserMaster] DROP COLUMN [PhoneNumberConfirmed];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181121123615_walletEntities21112018')
BEGIN
    DECLARE @var259 sysname;
    SELECT @var259 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[UserMaster]') AND [c].[name] = N'ProfilePhotoId');
    IF @var259 IS NOT NULL EXEC(N'ALTER TABLE [UserMaster] DROP CONSTRAINT [' + @var259 + '];');
    ALTER TABLE [UserMaster] DROP COLUMN [ProfilePhotoId];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181121123615_walletEntities21112018')
BEGIN
    DECLARE @var260 sysname;
    SELECT @var260 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[UserMaster]') AND [c].[name] = N'SecurityStamp');
    IF @var260 IS NOT NULL EXEC(N'ALTER TABLE [UserMaster] DROP CONSTRAINT [' + @var260 + '];');
    ALTER TABLE [UserMaster] DROP COLUMN [SecurityStamp];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181121123615_walletEntities21112018')
BEGIN
    DECLARE @var261 sysname;
    SELECT @var261 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[UserMaster]') AND [c].[name] = N'TwoFactorEnabled');
    IF @var261 IS NOT NULL EXEC(N'ALTER TABLE [UserMaster] DROP CONSTRAINT [' + @var261 + '];');
    ALTER TABLE [UserMaster] DROP COLUMN [TwoFactorEnabled];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181121123615_walletEntities21112018')
BEGIN
    DECLARE @var262 sysname;
    SELECT @var262 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[UserMaster]') AND [c].[name] = N'UserName');
    IF @var262 IS NOT NULL EXEC(N'ALTER TABLE [UserMaster] DROP CONSTRAINT [' + @var262 + '];');
    ALTER TABLE [UserMaster] DROP COLUMN [UserName];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181121123615_walletEntities21112018')
BEGIN
    DECLARE @var263 sysname;
    SELECT @var263 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[UserMaster]') AND [c].[name] = N'Id');
    IF @var263 IS NOT NULL EXEC(N'ALTER TABLE [UserMaster] DROP CONSTRAINT [' + @var263 + '];');
    ALTER TABLE [UserMaster] ALTER COLUMN [Id] bigint NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181121123615_walletEntities21112018')
BEGIN
    ALTER TABLE [UserMaster] ADD [BizUserID] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181121123615_walletEntities21112018')
BEGIN
    ALTER TABLE [UserMaster] ADD [CreatedBy] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181121123615_walletEntities21112018')
BEGIN
    ALTER TABLE [UserMaster] ADD [Status] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181121123615_walletEntities21112018')
BEGIN
    ALTER TABLE [UserMaster] ADD [UpdatedBy] bigint NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181121123615_walletEntities21112018')
BEGIN
    ALTER TABLE [UserMaster] ADD [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181121123615_walletEntities21112018')
BEGIN
    ALTER TABLE [UserMaster] ADD CONSTRAINT [PK_UserMaster] PRIMARY KEY ([BizUserID]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181121123615_walletEntities21112018')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181121123615_walletEntities21112018', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181122130446_V1Version')
BEGIN
    CREATE TABLE [TradeBuyerListV1] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [TrnNo] bigint NOT NULL,
        [PairID] bigint NOT NULL,
        [PairName] nvarchar(max) NULL,
        [Price] decimal(18, 8) NOT NULL,
        [Qty] decimal(18, 8) NOT NULL,
        [DeliveredQty] decimal(18, 8) NOT NULL,
        [RemainQty] decimal(18, 8) NOT NULL,
        [OrderType] smallint NOT NULL,
        [IsProcessing] smallint NOT NULL,
        CONSTRAINT [PK_TradeBuyerListV1] PRIMARY KEY ([TrnNo])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181122130446_V1Version')
BEGIN
    CREATE TABLE [TradePoolQueueV1] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [PairID] bigint NOT NULL,
        [MakerTrnNo] bigint NOT NULL,
        [MakerType] nvarchar(max) NULL,
        [MakerPrice] decimal(18, 8) NOT NULL,
        [MakerQty] decimal(18, 8) NOT NULL,
        [TakerTrnNo] bigint NOT NULL,
        [TakerType] nvarchar(max) NULL,
        [TakerPrice] decimal(18, 8) NOT NULL,
        [TakerQty] decimal(18, 8) NOT NULL,
        [TakerDisc] decimal(18, 8) NOT NULL,
        [TakerLoss] decimal(18, 8) NOT NULL,
        CONSTRAINT [PK_TradePoolQueueV1] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181122130446_V1Version')
BEGIN
    CREATE TABLE [TradeSellerListV1] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [TrnNo] bigint NOT NULL,
        [PairID] bigint NOT NULL,
        [PairName] nvarchar(max) NULL,
        [Price] decimal(18, 8) NOT NULL,
        [Qty] decimal(18, 8) NOT NULL,
        [ReleasedQty] decimal(18, 8) NOT NULL,
        [SelledQty] decimal(18, 8) NOT NULL,
        [RemainQty] decimal(18, 8) NOT NULL,
        [OrderType] smallint NOT NULL,
        [IsProcessing] smallint NOT NULL,
        CONSTRAINT [PK_TradeSellerListV1] PRIMARY KEY ([TrnNo])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181122130446_V1Version')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181122130446_V1Version', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181124122258_NotificationQSenderIDL')
BEGIN
    DECLARE @var264 sysname;
    SELECT @var264 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CommAPIServiceMaster]') AND [c].[name] = N'SenderID');
    IF @var264 IS NOT NULL EXEC(N'ALTER TABLE [CommAPIServiceMaster] DROP CONSTRAINT [' + @var264 + '];');
    ALTER TABLE [CommAPIServiceMaster] ALTER COLUMN [SenderID] nvarchar(200) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181124122258_NotificationQSenderIDL')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181124122258_NotificationQSenderIDL', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181126052412_WalletEntityChanges26112018')
BEGIN
    ALTER TABLE [WalletAuthorizeUserMaster] ADD [RoleID] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181126052412_WalletEntityChanges26112018')
BEGIN
    ALTER TABLE [OrganizationUserMaster] ADD [RoleID] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181126052412_WalletEntityChanges26112018')
BEGIN
    ALTER TABLE [OrganizationMaster] ADD [Address] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181126052412_WalletEntityChanges26112018')
BEGIN
    ALTER TABLE [OrganizationMaster] ADD [AuthenticationType] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181126052412_WalletEntityChanges26112018')
BEGIN
    ALTER TABLE [OrganizationMaster] ADD [CityID] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181126052412_WalletEntityChanges26112018')
BEGIN
    ALTER TABLE [OrganizationMaster] ADD [ContactNo] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181126052412_WalletEntityChanges26112018')
BEGIN
    ALTER TABLE [OrganizationMaster] ADD [Email] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181126052412_WalletEntityChanges26112018')
BEGIN
    ALTER TABLE [OrganizationMaster] ADD [TnCAccepted] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181126052412_WalletEntityChanges26112018')
BEGIN
    ALTER TABLE [OrganizationMaster] ADD [Website] nvarchar(50) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181126052412_WalletEntityChanges26112018')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181126052412_WalletEntityChanges26112018', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181126055226_SettledTQNewColumn')
BEGIN
    ALTER TABLE [SettledTradeTransactionQueue] ADD [DeliveryAccountID] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181126055226_SettledTQNewColumn')
BEGIN
    ALTER TABLE [SettledTradeTransactionQueue] ADD [OrderAccountID] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181126055226_SettledTQNewColumn')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181126055226_SettledTQNewColumn', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181126063839_UpdatedDateInSettledTQ')
BEGIN
    DECLARE @var265 sysname;
    SELECT @var265 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SettledTradeTransactionQueue]') AND [c].[name] = N'UpdatedDate');
    IF @var265 IS NOT NULL EXEC(N'ALTER TABLE [SettledTradeTransactionQueue] DROP CONSTRAINT [' + @var265 + '];');
    ALTER TABLE [SettledTradeTransactionQueue] ALTER COLUMN [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181126063839_UpdatedDateInSettledTQ')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181126063839_UpdatedDateInSettledTQ', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181128092115_policynameadd-28112018')
BEGIN
    ALTER TABLE [BlockWalletTrnTypeMaster] DROP CONSTRAINT [PK_BlockWalletTrnTypeMaster];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181128092115_policynameadd-28112018')
BEGIN
    ALTER TABLE [WalletUsagePolicy] ADD [PolicyName] nvarchar(50) NOT NULL DEFAULT N'';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181128092115_policynameadd-28112018')
BEGIN
    ALTER TABLE [AutorizedApps] ADD [SiteURL] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181128092115_policynameadd-28112018')
BEGIN
    ALTER TABLE [BlockWalletTrnTypeMaster] ADD CONSTRAINT [AK_BlockWalletTrnTypeMaster_TrnTypeID_WalletTypeID] UNIQUE ([TrnTypeID], [WalletTypeID]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181128092115_policynameadd-28112018')
BEGIN
    ALTER TABLE [BlockWalletTrnTypeMaster] ADD CONSTRAINT [PK_BlockWalletTrnTypeMaster] PRIMARY KEY ([WalletTypeID], [TrnTypeID]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181128092115_policynameadd-28112018')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181128092115_policynameadd-28112018', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181129071121_29112018')
BEGIN
    ALTER TABLE [OrganizationMaster] ADD [IsDefault] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181129071121_29112018')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181129071121_29112018', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181130043840_channeladdedtowallettq30112018')
BEGIN
    ALTER TABLE [WalletTransactionQueues] ADD [AllowedChannelID] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181130043840_channeladdedtowallettq30112018')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181130043840_channeladdedtowallettq30112018', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181130070913_errorlogforsp30112018')
BEGIN
    ALTER TABLE [WalletMasters] ADD [InBoundBalance] decimal(18, 8) NOT NULL DEFAULT 0.0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181130070913_errorlogforsp30112018')
BEGIN
    ALTER TABLE [WalletMasters] ADD [OutBoundBalance] decimal(18, 8) NOT NULL DEFAULT 0.0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181130070913_errorlogforsp30112018')
BEGIN
    ALTER TABLE [WalletLedgers] ADD [Type] int NOT NULL DEFAULT 0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181130070913_errorlogforsp30112018')
BEGIN
    ALTER TABLE [TransactionAccounts] ADD [Type] int NOT NULL DEFAULT 0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181130070913_errorlogforsp30112018')
BEGIN
    CREATE TABLE [ErrorInfo] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [FunctionName] nvarchar(50) NOT NULL,
        [RefNo] bigint NOT NULL,
        [ErrorMsg] nvarchar(500) NOT NULL,
        CONSTRAINT [PK_ErrorInfo] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181130070913_errorlogforsp30112018')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181130070913_errorlogforsp30112018', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181203060411_TradeRecon')
BEGIN
    ALTER TABLE [TransactionQueue] ADD [DebitAccountID] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181203060411_TradeRecon')
BEGIN
    CREATE TABLE [TransactionRecon] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [TrnNo] bigint NOT NULL,
        [ServiceID] bigint NOT NULL,
        [SerProID] bigint NOT NULL,
        [OldStatus] smallint NOT NULL,
        [NewStatus] smallint NOT NULL,
        [Remarks] nvarchar(max) NOT NULL,
        CONSTRAINT [PK_TransactionRecon] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181203060411_TradeRecon')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181203060411_TradeRecon', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181203075020_CountryCode')
BEGIN
    ALTER TABLE [TempUserRegister] ADD [CountryCode] nvarchar(5) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181203075020_CountryCode')
BEGIN
    ALTER TABLE [BizUser] ADD [CountryCode] nvarchar(5) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181203075020_CountryCode')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181203075020_CountryCode', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181205073909_SignUpLogTable')
BEGIN
    CREATE TABLE [SignUpLog] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [TempUserId] int NOT NULL,
        [UserId] int NOT NULL,
        [RegisterType] int NOT NULL,
        [DeviceID] nvarchar(2000) NULL,
        [Mode] nvarchar(10) NULL,
        [IPAddress] nvarchar(15) NULL,
        [Location] nvarchar(2000) NULL,
        [HostName] nvarchar(250) NULL,
        [RegisterStatus] bit NOT NULL,
        CONSTRAINT [PK_SignUpLog] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181205073909_SignUpLogTable')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181205073909_SignUpLogTable', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181205120747_ActivityLog')
BEGIN
    CREATE TABLE [ActivityLog] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [UserId] int NOT NULL,
        [Action] nvarchar(250) NULL,
        [DeviceID] nvarchar(2000) NULL,
        [Mode] nvarchar(10) NULL,
        [IPAddress] nvarchar(15) NULL,
        [Location] nvarchar(2000) NULL,
        [HostName] nvarchar(250) NULL,
        CONSTRAINT [PK_ActivityLog] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181205120747_ActivityLog')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181205120747_ActivityLog', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181206050109_SMSONOFFbitForTemplateMaster')
BEGIN
    ALTER TABLE [TemplateMaster] ADD [IsOnOff] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181206050109_SMSONOFFbitForTemplateMaster')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181206050109_SMSONOFFbitForTemplateMaster', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181206061444_TradeTQColumnAddedOrderType')
BEGIN
    DECLARE @var266 sysname;
    SELECT @var266 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeTransactionQueue]') AND [c].[name] = N'TakerPer');
    IF @var266 IS NOT NULL EXEC(N'ALTER TABLE [TradeTransactionQueue] DROP CONSTRAINT [' + @var266 + '];');
    ALTER TABLE [TradeTransactionQueue] DROP COLUMN [TakerPer];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181206061444_TradeTQColumnAddedOrderType')
BEGIN
    DECLARE @var267 sysname;
    SELECT @var267 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeTransactionQueue]') AND [c].[name] = N'TrnRefNo');
    IF @var267 IS NOT NULL EXEC(N'ALTER TABLE [TradeTransactionQueue] DROP CONSTRAINT [' + @var267 + '];');
    ALTER TABLE [TradeTransactionQueue] DROP COLUMN [TrnRefNo];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181206061444_TradeTQColumnAddedOrderType')
BEGIN
    ALTER TABLE [WalletTransactionQueues] ADD [WalletDeductionType] int NOT NULL DEFAULT 0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181206061444_TradeTQColumnAddedOrderType')
BEGIN
    ALTER TABLE [TradeTransactionQueue] ADD [ordertype] decimal(18, 8) NOT NULL DEFAULT 0.0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181206061444_TradeTQColumnAddedOrderType')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181206061444_TradeTQColumnAddedOrderType', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181206070652_TradeTQColumnTypeChange')
BEGIN
    DECLARE @var268 sysname;
    SELECT @var268 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeTransactionQueue]') AND [c].[name] = N'ordertype');
    IF @var268 IS NOT NULL EXEC(N'ALTER TABLE [TradeTransactionQueue] DROP CONSTRAINT [' + @var268 + '];');
    ALTER TABLE [TradeTransactionQueue] ALTER COLUMN [ordertype] smallint NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181206070652_TradeTQColumnTypeChange')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181206070652_TradeTQColumnTypeChange', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181206113046_UpdateDeviceMaster')
BEGIN
    DECLARE @var269 sysname;
    SELECT @var269 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[DeviceMaster]') AND [c].[name] = N'DeviceId');
    IF @var269 IS NOT NULL EXEC(N'ALTER TABLE [DeviceMaster] DROP CONSTRAINT [' + @var269 + '];');
    ALTER TABLE [DeviceMaster] ALTER COLUMN [DeviceId] nvarchar(250) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181206113046_UpdateDeviceMaster')
BEGIN
    ALTER TABLE [DeviceMaster] ADD [Device] nvarchar(250) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181206113046_UpdateDeviceMaster')
BEGIN
    ALTER TABLE [DeviceMaster] ADD [DeviceOS] nvarchar(250) NOT NULL DEFAULT N'';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181206113046_UpdateDeviceMaster')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181206113046_UpdateDeviceMaster', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181210134530_ExpiredDateTradePairDetail')
BEGIN
    ALTER TABLE [TradePairDetail] ADD [ChargeType] smallint NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181210134530_ExpiredDateTradePairDetail')
BEGIN
    ALTER TABLE [TradePairDetail] ADD [OpenOrderExpiration] bigint NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181210134530_ExpiredDateTradePairDetail')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181210134530_ExpiredDateTradePairDetail', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181212060123_WithdrawProID')
BEGIN
    EXEC sp_rename N'[WithdrawHistory].[Wallet]', N'WalletId', N'COLUMN';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181212060123_WithdrawProID')
BEGIN
    ALTER TABLE [WithdrawHistory] ADD [ProviderWalletID] nvarchar(50) NOT NULL DEFAULT N'';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181212060123_WithdrawProID')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181212060123_WithdrawProID', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181214052720_chargetypepk14122018_5')
BEGIN
    DECLARE @var270 sysname;
    SELECT @var270 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ChargeTypeMaster]') AND [c].[name] = N'Id');
    IF @var270 IS NOT NULL EXEC(N'ALTER TABLE [ChargeTypeMaster] DROP CONSTRAINT [' + @var270 + '];');
    ALTER TABLE [ChargeTypeMaster] DROP COLUMN [Id];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181214052720_chargetypepk14122018_5')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181214052720_chargetypepk14122018_5', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181214112027_rolechangespk14122018_5')
BEGIN
    ALTER TABLE [WalletAuthorizeUserMaster] DROP CONSTRAINT [PK_WalletAuthorizeUserMaster];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181214112027_rolechangespk14122018_5')
BEGIN
    ALTER TABLE [TransactionPolicy] DROP CONSTRAINT [PK_TransactionPolicy];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181214112027_rolechangespk14122018_5')
BEGIN
    ALTER TABLE [OrganizationUserMaster] DROP CONSTRAINT [PK_OrganizationUserMaster];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181214112027_rolechangespk14122018_5')
BEGIN
    ALTER TABLE [WalletMasters] ADD [ExpiryDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181214112027_rolechangespk14122018_5')
BEGIN
    ALTER TABLE [WalletMasters] ADD [OrgID] bigint NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181214112027_rolechangespk14122018_5')
BEGIN
    ALTER TABLE [TransactionPolicy] ADD [RoleId] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181214112027_rolechangespk14122018_5')
BEGIN
    ALTER TABLE [WalletAuthorizeUserMaster] ADD CONSTRAINT [PK_WalletAuthorizeUserMaster] PRIMARY KEY ([UserID], [WalletID], [RoleID]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181214112027_rolechangespk14122018_5')
BEGIN
    ALTER TABLE [WalletAuthorizeUserMaster] ADD CONSTRAINT [AK_WalletAuthorizeUserMaster_Id_RoleID_UserID_WalletID] UNIQUE ([Id], [RoleID], [UserID], [WalletID]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181214112027_rolechangespk14122018_5')
BEGIN
    ALTER TABLE [TransactionPolicy] ADD CONSTRAINT [AK_TransactionPolicy_RoleId_TrnType] UNIQUE ([RoleId], [TrnType]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181214112027_rolechangespk14122018_5')
BEGIN
    ALTER TABLE [TransactionPolicy] ADD CONSTRAINT [PK_TransactionPolicy] PRIMARY KEY ([TrnType], [RoleId]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181214112027_rolechangespk14122018_5')
BEGIN
    ALTER TABLE [OrganizationUserMaster] ADD CONSTRAINT [PK_OrganizationUserMaster] PRIMARY KEY ([RoleID], [UserID]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181214112027_rolechangespk14122018_5')
BEGIN
    ALTER TABLE [OrganizationUserMaster] ADD CONSTRAINT [AK_OrganizationUserMaster_Id_RoleID_UserID] UNIQUE ([Id], [RoleID], [UserID]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181214112027_rolechangespk14122018_5')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181214112027_rolechangespk14122018_5', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181217101637_walletvarcharsize17122018')
BEGIN
    ALTER TABLE [UserWalletBlockTrnTypeMaster] DROP CONSTRAINT [PK_UserWalletBlockTrnTypeMaster];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181217101637_walletvarcharsize17122018')
BEGIN
    DECLARE @var271 sysname;
    SELECT @var271 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[AutorizedApps]') AND [c].[name] = N'SiteURL');
    IF @var271 IS NOT NULL EXEC(N'ALTER TABLE [AutorizedApps] DROP CONSTRAINT [' + @var271 + '];');
    ALTER TABLE [AutorizedApps] ALTER COLUMN [SiteURL] nvarchar(100) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181217101637_walletvarcharsize17122018')
BEGIN
    DECLARE @var272 sysname;
    SELECT @var272 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[AutorizedApps]') AND [c].[name] = N'SecretKey');
    IF @var272 IS NOT NULL EXEC(N'ALTER TABLE [AutorizedApps] DROP CONSTRAINT [' + @var272 + '];');
    ALTER TABLE [AutorizedApps] ALTER COLUMN [SecretKey] nvarchar(100) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181217101637_walletvarcharsize17122018')
BEGIN
    DECLARE @var273 sysname;
    SELECT @var273 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[AutorizedApps]') AND [c].[name] = N'AppName');
    IF @var273 IS NOT NULL EXEC(N'ALTER TABLE [AutorizedApps] DROP CONSTRAINT [' + @var273 + '];');
    ALTER TABLE [AutorizedApps] ALTER COLUMN [AppName] nvarchar(100) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181217101637_walletvarcharsize17122018')
BEGIN
    ALTER TABLE [UserWalletBlockTrnTypeMaster] ADD CONSTRAINT [PK_UserWalletBlockTrnTypeMaster] PRIMARY KEY ([WalletID], [WTrnTypeMasterID]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181217101637_walletvarcharsize17122018')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181217101637_walletvarcharsize17122018', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181217111707_RoutePairIDAdded')
BEGIN
    ALTER TABLE [ServiceProviderDetail] ADD [SerProDetailName] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181217111707_RoutePairIDAdded')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181217111707_RoutePairIDAdded', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181217123424_bizbaseaddChargeTypeMaster')
BEGIN
    EXEC sp_rename N'[ChargeTypeMaster].[ChargeTypeId]', N'Id', N'COLUMN';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181217123424_bizbaseaddChargeTypeMaster')
BEGIN
    ALTER TABLE [UserWalletBlockTrnTypeMaster] ADD [Remarks] nvarchar(150) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181217123424_bizbaseaddChargeTypeMaster')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181217123424_bizbaseaddChargeTypeMaster', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181218121219_pairidinrouteconfig')
BEGIN
    ALTER TABLE [RouteConfiguration] ADD [OrderType] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181218121219_pairidinrouteconfig')
BEGIN
    ALTER TABLE [RouteConfiguration] ADD [PairId] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181218121219_pairidinrouteconfig')
BEGIN
    DECLARE @var274 sysname;
    SELECT @var274 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CurrencyTypeMaster]') AND [c].[name] = N'CurrencyTypeName');
    IF @var274 IS NOT NULL EXEC(N'ALTER TABLE [CurrencyTypeMaster] DROP CONSTRAINT [' + @var274 + '];');
    ALTER TABLE [CurrencyTypeMaster] ALTER COLUMN [CurrencyTypeName] nvarchar(50) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181218121219_pairidinrouteconfig')
BEGIN
    CREATE TABLE [Statastics] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL,
        [TrnType] bigint NOT NULL,
        [WalletType] bigint NOT NULL,
        [WalletId] bigint NOT NULL,
        [UserId] bigint NOT NULL,
        [Hour] bigint NOT NULL,
        [Day] bigint NOT NULL,
        [Week] bigint NOT NULL,
        [Month] bigint NOT NULL,
        [Year] bigint NOT NULL,
        [Count] bigint NOT NULL,
        [Amount] decimal(18, 2) NOT NULL,
        CONSTRAINT [PK_Statastics] PRIMARY KEY ([WalletId], [WalletType], [TrnType], [Hour], [Day], [Week], [Month], [Year], [UserId]),
        CONSTRAINT [AK_Statastics_Day_Hour_Month_TrnType_UserId_WalletId_WalletType_Week_Year] UNIQUE ([Day], [Hour], [Month], [TrnType], [UserId], [WalletId], [WalletType], [Week], [Year])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181218121219_pairidinrouteconfig')
BEGIN
    CREATE TABLE [StatasticsDetail] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL,
        [StatasticsId] bigint NOT NULL IDENTITY,
        [EntityName] nvarchar(50) NOT NULL,
        [TrnNo] nvarchar(max) NOT NULL,
        [CurrentTime] nvarchar(max) NOT NULL,
        [Amount] decimal(18, 2) NOT NULL,
        CONSTRAINT [PK_StatasticsDetail] PRIMARY KEY ([StatasticsId])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181218121219_pairidinrouteconfig')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181218121219_pairidinrouteconfig', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181219062517_socialprofiletable')
BEGIN
    CREATE TABLE [FollowerMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [LeaderId] bigint NOT NULL,
        [FolowerId] bigint NOT NULL,
        [FllowerStatus] bit NOT NULL,
        [IsEnable] bit NOT NULL,
        [IsDeleted] bit NOT NULL,
        CONSTRAINT [PK_FollowerMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181219062517_socialprofiletable')
BEGIN
    CREATE TABLE [ProfileConfiguration] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [ConfigType] nvarchar(200) NOT NULL,
        [ConfigKey] nvarchar(250) NOT NULL,
        [ConfigValue] nvarchar(250) NOT NULL,
        [IsEnable] bit NOT NULL,
        [IsDeleted] bit NOT NULL,
        CONSTRAINT [PK_ProfileConfiguration] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181219062517_socialprofiletable')
BEGIN
    CREATE TABLE [UserProfileConfig] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [UserId] int NOT NULL,
        [ProfileConfigId] bigint NOT NULL,
        [ConfigValue] nvarchar(250) NOT NULL,
        [IsEnable] bit NOT NULL,
        [IsDeleted] bit NOT NULL,
        CONSTRAINT [PK_UserProfileConfig] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181219062517_socialprofiletable')
BEGIN
    CREATE TABLE [UserSocialProfile] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [UserId] int NOT NULL,
        [ProfileRole] nvarchar(10) NOT NULL,
        [IsEnable] bit NOT NULL,
        [IsDeleted] bit NOT NULL,
        CONSTRAINT [PK_UserSocialProfile] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181219062517_socialprofiletable')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181219062517_socialprofiletable', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181219075926_organizationbackofficetable')
BEGIN
    CREATE TABLE [ActivityRegister] (
        [Id] uniqueidentifier NOT NULL,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] bit NOT NULL,
        [EventId] bigint NOT NULL,
        [Description] nvarchar(500) NOT NULL,
        [Connection] nvarchar(500) NULL,
        [Application] nvarchar(500) NULL,
        [EndPoint] nvarchar(500) NULL,
        [StatusCode] bigint NOT NULL,
        [Channel] nvarchar(500) NULL,
        [Request] nvarchar(4000) NULL,
        [Response] nvarchar(4000) NULL,
        CONSTRAINT [PK_ActivityRegister] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181219075926_organizationbackofficetable')
BEGIN
    CREATE TABLE [ApplicationMaster] (
        [Id] uniqueidentifier NOT NULL,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] bit NOT NULL,
        [ApplicationName] nvarchar(250) NOT NULL,
        [Description] nvarchar(250) NULL,
        CONSTRAINT [PK_ApplicationMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181219075926_organizationbackofficetable')
BEGIN
    CREATE TABLE [Org_App_Mapping] (
        [Id] uniqueidentifier NOT NULL,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] bit NOT NULL,
        [OrgId] uniqueidentifier NOT NULL,
        [AppId] uniqueidentifier NOT NULL,
        [AppName] nvarchar(250) NOT NULL,
        [ClientSecret] uniqueidentifier NOT NULL,
        [Description] nvarchar(1000) NULL,
        [ApplicationLogo] nvarchar(250) NULL,
        [AllowedCallBackURLS] nvarchar(500) NULL,
        [AllowedWebOrigins] nvarchar(500) NULL,
        [AllowedLogoutURLS] nvarchar(500) NULL,
        [AllowedOriginsCORS] nvarchar(500) NULL,
        [JWTExpiration] bigint NOT NULL,
        CONSTRAINT [PK_Org_App_Mapping] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181219075926_organizationbackofficetable')
BEGIN
    CREATE TABLE [Organization_Master] (
        [Id] uniqueidentifier NOT NULL,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] bit NOT NULL,
        [UserId] int NOT NULL,
        [DomainName] nvarchar(250) NOT NULL,
        CONSTRAINT [PK_Organization_Master] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181219075926_organizationbackofficetable')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181219075926_organizationbackofficetable', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181219094123_statisticschanges')
BEGIN
    EXEC sp_rename N'[StatasticsDetail].[CurrentTime]', N'Type', N'COLUMN';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181219094123_statisticschanges')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181219094123_statisticschanges', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181219095137_statistics_2')
BEGIN
    ALTER TABLE [StatasticsDetail] DROP CONSTRAINT [PK_StatasticsDetail];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181219095137_statistics_2')
BEGIN
    ALTER TABLE [StatasticsDetail] ADD CONSTRAINT [PK_StatasticsDetail] PRIMARY KEY ([Id]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181219095137_statistics_2')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181219095137_statistics_2', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181219120525_usermanagementtable')
BEGIN
    CREATE TABLE [AllowedIPAddress] (
        [Id] uniqueidentifier NOT NULL,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] bit NOT NULL,
        [UserId] int NOT NULL,
        [FromIPAddress] nvarchar(30) NOT NULL,
        [ToIPAddress] nvarchar(30) NOT NULL,
        CONSTRAINT [PK_AllowedIPAddress] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181219120525_usermanagementtable')
BEGIN
    CREATE TABLE [ConfigurationMaster] (
        [Id] uniqueidentifier NOT NULL,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] bit NOT NULL,
        [Name] nvarchar(100) NOT NULL,
        CONSTRAINT [PK_ConfigurationMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181219120525_usermanagementtable')
BEGIN
    CREATE TABLE [EmailMaster] (
        [Id] uniqueidentifier NOT NULL,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] bit NOT NULL,
        [Email] nvarchar(50) NOT NULL,
        [UserId] int NOT NULL,
        [IsPrimary] bit NOT NULL,
        CONSTRAINT [PK_EmailMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181219120525_usermanagementtable')
BEGIN
    CREATE TABLE [LanguageMaster] (
        [Id] uniqueidentifier NOT NULL,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] bit NOT NULL,
        [Languagename] nvarchar(100) NOT NULL,
        CONSTRAINT [PK_LanguageMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181219120525_usermanagementtable')
BEGIN
    CREATE TABLE [PhoneMaster] (
        [Id] uniqueidentifier NOT NULL,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] bit NOT NULL,
        [Mobilenumber] nvarchar(15) NOT NULL,
        [UserId] int NOT NULL,
        [IsPrimary] bit NOT NULL,
        CONSTRAINT [PK_PhoneMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181219120525_usermanagementtable')
BEGIN
    CREATE TABLE [SecurityQuestionMaster] (
        [Id] uniqueidentifier NOT NULL,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] bit NOT NULL,
        [UserId] int NOT NULL,
        [SecurityQuestion] nvarchar(200) NOT NULL,
        [Answer] nvarchar(200) NOT NULL,
        CONSTRAINT [PK_SecurityQuestionMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181219120525_usermanagementtable')
BEGIN
    CREATE TABLE [UserConfigurationMapping] (
        [Id] uniqueidentifier NOT NULL,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] bit NOT NULL,
        [UserId] int NOT NULL,
        [ConfigurationMasterId] uniqueidentifier NOT NULL,
        [IsconfigurationEnable] bit NOT NULL,
        CONSTRAINT [PK_UserConfigurationMapping] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181219120525_usermanagementtable')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181219120525_usermanagementtable', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181219133848_commmaster19122018_2')
BEGIN
    ALTER TABLE [CommissionTypeMaster] DROP CONSTRAINT [PK_CommissionTypeMaster];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181219133848_commmaster19122018_2')
BEGIN
    DECLARE @var275 sysname;
    SELECT @var275 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CommissionTypeMaster]') AND [c].[name] = N'CommissionTypeId');
    IF @var275 IS NOT NULL EXEC(N'ALTER TABLE [CommissionTypeMaster] DROP CONSTRAINT [' + @var275 + '];');
    ALTER TABLE [CommissionTypeMaster] DROP COLUMN [CommissionTypeId];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181219133848_commmaster19122018_2')
BEGIN
    DECLARE @var276 sysname;
    SELECT @var276 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StatasticsDetail]') AND [c].[name] = N'Type');
    IF @var276 IS NOT NULL EXEC(N'ALTER TABLE [StatasticsDetail] DROP CONSTRAINT [' + @var276 + '];');
    ALTER TABLE [StatasticsDetail] ALTER COLUMN [Type] bigint NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181219133848_commmaster19122018_2')
BEGIN
    ALTER TABLE [CommissionTypeMaster] ADD CONSTRAINT [PK_CommissionTypeMaster] PRIMARY KEY ([Id]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181219133848_commmaster19122018_2')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181219133848_commmaster19122018_2', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181220060649_modifyorganizationtable')
BEGIN
    ALTER TABLE [Organization_Master] ADD [AliasName] nvarchar(250) NULL DEFAULT N'';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181220060649_modifyorganizationtable')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181220060649_modifyorganizationtable', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181220094442_AddUserWalletRequest')
BEGIN
    DECLARE @var277 sysname;
    SELECT @var277 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Organization_Master]') AND [c].[name] = N'AliasName');
    IF @var277 IS NOT NULL EXEC(N'ALTER TABLE [Organization_Master] DROP CONSTRAINT [' + @var277 + '];');
    ALTER TABLE [Organization_Master] ALTER COLUMN [AliasName] nvarchar(250) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181220094442_AddUserWalletRequest')
BEGIN
    CREATE TABLE [AddUserWalletRequest] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [ToUserId] bigint NOT NULL,
        [WalletOwnerUserID] bigint NOT NULL,
        [WalletID] bigint NOT NULL,
        [RoleId] bigint NOT NULL,
        [Message] nvarchar(1000) NOT NULL,
        [Email] nvarchar(100) NOT NULL,
        [ApproveDate] datetime2 NOT NULL,
        [ApproveBy] bigint NOT NULL,
        CONSTRAINT [PK_AddUserWalletRequest] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181220094442_AddUserWalletRequest')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181220094442_AddUserWalletRequest', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181220101326_modifyemailtable')
BEGIN
    DECLARE @var278 sysname;
    SELECT @var278 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[AddUserWalletRequest]') AND [c].[name] = N'ApproveBy');
    IF @var278 IS NOT NULL EXEC(N'ALTER TABLE [AddUserWalletRequest] DROP CONSTRAINT [' + @var278 + '];');
    ALTER TABLE [AddUserWalletRequest] DROP COLUMN [ApproveBy];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181220101326_modifyemailtable')
BEGIN
    DECLARE @var279 sysname;
    SELECT @var279 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[AddUserWalletRequest]') AND [c].[name] = N'ApproveDate');
    IF @var279 IS NOT NULL EXEC(N'ALTER TABLE [AddUserWalletRequest] DROP CONSTRAINT [' + @var279 + '];');
    ALTER TABLE [AddUserWalletRequest] DROP COLUMN [ApproveDate];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181220101326_modifyemailtable')
BEGIN
    EXEC sp_rename N'[AddUserWalletRequest].[WalletOwnerUserID]', N'FromUserId', N'COLUMN';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181220101326_modifyemailtable')
BEGIN
    ALTER TABLE [PhoneMaster] ADD [IsDeleted] bit NOT NULL DEFAULT 0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181220101326_modifyemailtable')
BEGIN
    ALTER TABLE [EmailMaster] ADD [IsDeleted] bit NOT NULL DEFAULT 0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181220101326_modifyemailtable')
BEGIN
    DECLARE @var280 sysname;
    SELECT @var280 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[AddUserWalletRequest]') AND [c].[name] = N'Email');
    IF @var280 IS NOT NULL EXEC(N'ALTER TABLE [AddUserWalletRequest] DROP CONSTRAINT [' + @var280 + '];');
    ALTER TABLE [AddUserWalletRequest] ALTER COLUMN [Email] nvarchar(50) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181220101326_modifyemailtable')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181220101326_modifyemailtable', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181220125644_userwallet')
BEGIN
    ALTER TABLE [WalletAuthorizeUserMaster] DROP CONSTRAINT [AK_WalletAuthorizeUserMaster_Id_RoleID_UserID_WalletID];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181220125644_userwallet')
BEGIN
    EXEC sp_rename N'[AddUserWalletRequest].[FromUserId]', N'WalletOwnerUserID', N'COLUMN';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181220125644_userwallet')
BEGIN
    DECLARE @var281 sysname;
    SELECT @var281 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[AddUserWalletRequest]') AND [c].[name] = N'Email');
    IF @var281 IS NOT NULL EXEC(N'ALTER TABLE [AddUserWalletRequest] DROP CONSTRAINT [' + @var281 + '];');
    ALTER TABLE [AddUserWalletRequest] ALTER COLUMN [Email] nvarchar(100) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181220125644_userwallet')
BEGIN
    ALTER TABLE [AddUserWalletRequest] ADD [ApproveBy] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181220125644_userwallet')
BEGIN
    ALTER TABLE [AddUserWalletRequest] ADD [ApproveDate] datetime2 NOT NULL DEFAULT '0001-01-01T00:00:00.0000000';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181220125644_userwallet')
BEGIN
    ALTER TABLE [WalletAuthorizeUserMaster] ADD CONSTRAINT [AK_WalletAuthorizeUserMaster_Id_UserID_WalletID] UNIQUE ([Id], [UserID], [WalletID]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181220125644_userwallet')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181220125644_userwallet', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181221062134_ipaddress')
BEGIN
    ALTER TABLE [WalletAuthorizeUserMaster] DROP CONSTRAINT [PK_WalletAuthorizeUserMaster];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181221062134_ipaddress')
BEGIN
    ALTER TABLE [WalletAuthorizeUserMaster] ADD CONSTRAINT [PK_WalletAuthorizeUserMaster] PRIMARY KEY ([UserID], [WalletID]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181221062134_ipaddress')
BEGIN
    CREATE TABLE [IPAddressMaster] (
        [AutoNo] bigint NOT NULL IDENTITY,
        [FromIP] varbinary(max) NOT NULL,
        [ToIP] varbinary(max) NOT NULL,
        [Status] int NOT NULL,
        [Longitude] real NOT NULL,
        [Lattitude] real NOT NULL,
        [CountryCode] nvarchar(5) NOT NULL,
        [CountryName] nvarchar(150) NOT NULL,
        CONSTRAINT [PK_IPAddressMaster] PRIMARY KEY ([AutoNo])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181221062134_ipaddress')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181221062134_ipaddress', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181222051728_roletrntypeallow')
BEGIN
    CREATE TABLE [AllowTrnTypeRoleWise] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [RoleId] bigint NOT NULL,
        [TrnTypeId] bigint NOT NULL,
        CONSTRAINT [PK_AllowTrnTypeRoleWise] PRIMARY KEY ([TrnTypeId], [RoleId]),
        CONSTRAINT [AK_AllowTrnTypeRoleWise_RoleId_TrnTypeId] UNIQUE ([RoleId], [TrnTypeId])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181222051728_roletrntypeallow')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181222051728_roletrntypeallow', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181222110438_addComplainStatusTypeMaster')
BEGIN
    DECLARE @var282 sysname;
    SELECT @var282 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CompainTrail]') AND [c].[name] = N'Complainstatus');
    IF @var282 IS NOT NULL EXEC(N'ALTER TABLE [CompainTrail] DROP CONSTRAINT [' + @var282 + '];');
    ALTER TABLE [CompainTrail] ALTER COLUMN [Complainstatus] bigint NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181222110438_addComplainStatusTypeMaster')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181222110438_addComplainStatusTypeMaster', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181222110758_addComplainStatusTypeMastertable')
BEGIN
    CREATE TABLE [ComplainStatusTypeMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [CompainStatusType] nvarchar(100) NOT NULL,
        [IsEnable] bit NOT NULL,
        [IsDeleted] bit NOT NULL,
        CONSTRAINT [PK_ComplainStatusTypeMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181222110758_addComplainStatusTypeMastertable')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181222110758_addComplainStatusTypeMastertable', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181222114317_addBackofficeKYCVerfiy')
BEGIN
    DECLARE @var283 sysname;
    SELECT @var283 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PersonalVerification]') AND [c].[name] = N'VerifyStatus');
    IF @var283 IS NOT NULL EXEC(N'ALTER TABLE [PersonalVerification] DROP CONSTRAINT [' + @var283 + '];');
    ALTER TABLE [PersonalVerification] ALTER COLUMN [VerifyStatus] int NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181222114317_addBackofficeKYCVerfiy')
BEGIN
    ALTER TABLE [PersonalVerification] ADD [Remark] nvarchar(2000) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181222114317_addBackofficeKYCVerfiy')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181222114317_addBackofficeKYCVerfiy', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181222115529_addBackofficeKYC')
BEGIN
    CREATE TABLE [kYCIdentityConfigurationMapping] (
        [Id] uniqueidentifier NOT NULL,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] bit NOT NULL,
        [Userid] int NOT NULL,
        [KYCConfigurationMasterId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_kYCIdentityConfigurationMapping] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181222115529_addBackofficeKYC')
BEGIN
    CREATE TABLE [kYCIdentityMaster] (
        [Id] uniqueidentifier NOT NULL,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] bit NOT NULL,
        [Name] nvarchar(100) NOT NULL,
        CONSTRAINT [PK_kYCIdentityMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181222115529_addBackofficeKYC')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181222115529_addBackofficeKYC', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181224095013_rolewallet')
BEGIN
    DROP TABLE [AddUserWalletRequest];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181224095013_rolewallet')
BEGIN
    DECLARE @var284 sysname;
    SELECT @var284 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PersonalVerification]') AND [c].[name] = N'Remark');
    IF @var284 IS NOT NULL EXEC(N'ALTER TABLE [PersonalVerification] DROP CONSTRAINT [' + @var284 + '];');
    ALTER TABLE [PersonalVerification] DROP COLUMN [Remark];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181224095013_rolewallet')
BEGIN
    DECLARE @var285 sysname;
    SELECT @var285 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PersonalVerification]') AND [c].[name] = N'VerifyStatus');
    IF @var285 IS NOT NULL EXEC(N'ALTER TABLE [PersonalVerification] DROP CONSTRAINT [' + @var285 + '];');
    ALTER TABLE [PersonalVerification] ALTER COLUMN [VerifyStatus] bit NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181224095013_rolewallet')
BEGIN
    CREATE TABLE [AddRemoveUserWalletRequest] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [ToUserId] bigint NOT NULL,
        [WalletOwnerUserID] bigint NOT NULL,
        [WalletID] bigint NOT NULL,
        [RoleId] bigint NOT NULL,
        [Message] nvarchar(max) NULL,
        [Email] nvarchar(100) NOT NULL,
        [RecieverApproveDate] datetime2 NULL,
        [RecieverApproveBy] bigint NOT NULL,
        [FromUserId] bigint NOT NULL,
        [OwnerApprovalStatus] smallint NOT NULL,
        [OwnerApprovalDate] datetime2 NULL,
        [OwnerApprovalBy] bigint NULL,
        [Type] smallint NOT NULL,
        CONSTRAINT [PK_AddRemoveUserWalletRequest] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181224095013_rolewallet')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181224095013_rolewallet', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181224120009_MarketTicker')
BEGIN
    ALTER TABLE [TradePairDetail] ADD [IsMarketTicker] int NOT NULL DEFAULT 0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181224120009_MarketTicker')
BEGIN
    CREATE TABLE [StakingChargeMaster] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [WalletTypeID] bigint NOT NULL,
        [UserID] bigint NOT NULL,
        [StakingPolicyID] bigint NOT NULL,
        [MakerCharge] decimal(18, 8) NOT NULL,
        [TakerCharge] decimal(18, 8) NOT NULL,
        [StakingHistoryID] bigint NOT NULL,
        CONSTRAINT [PK_StakingChargeMaster] PRIMARY KEY ([WalletTypeID], [UserID]),
        CONSTRAINT [AK_StakingChargeMaster_UserID_WalletTypeID] UNIQUE ([UserID], [WalletTypeID])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181224120009_MarketTicker')
BEGIN
    CREATE TABLE [StakingPolicyMaster] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [WalletTypeID] bigint NOT NULL,
        [MinAmount] decimal(18, 8) NOT NULL,
        [MaxAmount] decimal(18, 8) NOT NULL,
        [DiscType] smallint NOT NULL,
        [StakingType] smallint NOT NULL,
        [StakingDurationWeek] smallint NOT NULL,
        [StakingDurationMonth] smallint NOT NULL,
        [InterestType] smallint NOT NULL,
        [InterestValue] decimal(18, 8) NOT NULL,
        [InterestWalletTypeID] bigint NOT NULL,
        [MakerCharges] decimal(18, 2) NOT NULL,
        [TakerCharges] decimal(18, 2) NOT NULL,
        [EnableAutoUnstaking] smallint NOT NULL,
        [EnableStakingBeforeMaturity] smallint NOT NULL,
        [EnableStakingBeforeMaturityCharge] smallint NOT NULL,
        CONSTRAINT [PK_StakingPolicyMaster] PRIMARY KEY ([WalletTypeID])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181224120009_MarketTicker')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181224120009_MarketTicker', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181224125626_stakingentity')
BEGIN
    ALTER TABLE [TransactionBlockedChannel] DROP CONSTRAINT [PK_TransactionBlockedChannel];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181224125626_stakingentity')
BEGIN
    DECLARE @var286 sysname;
    SELECT @var286 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TransactionBlockedChannel]') AND [c].[name] = N'ChannelName');
    IF @var286 IS NOT NULL EXEC(N'ALTER TABLE [TransactionBlockedChannel] DROP CONSTRAINT [' + @var286 + '];');
    ALTER TABLE [TransactionBlockedChannel] DROP COLUMN [ChannelName];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181224125626_stakingentity')
BEGIN
    DECLARE @var287 sysname;
    SELECT @var287 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StakingPolicyMaster]') AND [c].[name] = N'EnableAutoUnstaking');
    IF @var287 IS NOT NULL EXEC(N'ALTER TABLE [StakingPolicyMaster] DROP CONSTRAINT [' + @var287 + '];');
    ALTER TABLE [StakingPolicyMaster] DROP COLUMN [EnableAutoUnstaking];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181224125626_stakingentity')
BEGIN
    DECLARE @var288 sysname;
    SELECT @var288 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StakingPolicyMaster]') AND [c].[name] = N'EnableStakingBeforeMaturity');
    IF @var288 IS NOT NULL EXEC(N'ALTER TABLE [StakingPolicyMaster] DROP CONSTRAINT [' + @var288 + '];');
    ALTER TABLE [StakingPolicyMaster] DROP COLUMN [EnableStakingBeforeMaturity];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181224125626_stakingentity')
BEGIN
    DECLARE @var289 sysname;
    SELECT @var289 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StakingPolicyMaster]') AND [c].[name] = N'EnableStakingBeforeMaturityCharge');
    IF @var289 IS NOT NULL EXEC(N'ALTER TABLE [StakingPolicyMaster] DROP CONSTRAINT [' + @var289 + '];');
    ALTER TABLE [StakingPolicyMaster] DROP COLUMN [EnableStakingBeforeMaturityCharge];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181224125626_stakingentity')
BEGIN
    DECLARE @var290 sysname;
    SELECT @var290 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StakingPolicyMaster]') AND [c].[name] = N'InterestType');
    IF @var290 IS NOT NULL EXEC(N'ALTER TABLE [StakingPolicyMaster] DROP CONSTRAINT [' + @var290 + '];');
    ALTER TABLE [StakingPolicyMaster] DROP COLUMN [InterestType];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181224125626_stakingentity')
BEGIN
    DECLARE @var291 sysname;
    SELECT @var291 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StakingPolicyMaster]') AND [c].[name] = N'InterestValue');
    IF @var291 IS NOT NULL EXEC(N'ALTER TABLE [StakingPolicyMaster] DROP CONSTRAINT [' + @var291 + '];');
    ALTER TABLE [StakingPolicyMaster] DROP COLUMN [InterestValue];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181224125626_stakingentity')
BEGIN
    DECLARE @var292 sysname;
    SELECT @var292 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StakingPolicyMaster]') AND [c].[name] = N'InterestWalletTypeID');
    IF @var292 IS NOT NULL EXEC(N'ALTER TABLE [StakingPolicyMaster] DROP CONSTRAINT [' + @var292 + '];');
    ALTER TABLE [StakingPolicyMaster] DROP COLUMN [InterestWalletTypeID];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181224125626_stakingentity')
BEGIN
    DECLARE @var293 sysname;
    SELECT @var293 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StakingPolicyMaster]') AND [c].[name] = N'MakerCharges');
    IF @var293 IS NOT NULL EXEC(N'ALTER TABLE [StakingPolicyMaster] DROP CONSTRAINT [' + @var293 + '];');
    ALTER TABLE [StakingPolicyMaster] DROP COLUMN [MakerCharges];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181224125626_stakingentity')
BEGIN
    DECLARE @var294 sysname;
    SELECT @var294 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StakingPolicyMaster]') AND [c].[name] = N'MaxAmount');
    IF @var294 IS NOT NULL EXEC(N'ALTER TABLE [StakingPolicyMaster] DROP CONSTRAINT [' + @var294 + '];');
    ALTER TABLE [StakingPolicyMaster] DROP COLUMN [MaxAmount];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181224125626_stakingentity')
BEGIN
    DECLARE @var295 sysname;
    SELECT @var295 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StakingPolicyMaster]') AND [c].[name] = N'MinAmount');
    IF @var295 IS NOT NULL EXEC(N'ALTER TABLE [StakingPolicyMaster] DROP CONSTRAINT [' + @var295 + '];');
    ALTER TABLE [StakingPolicyMaster] DROP COLUMN [MinAmount];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181224125626_stakingentity')
BEGIN
    DECLARE @var296 sysname;
    SELECT @var296 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StakingPolicyMaster]') AND [c].[name] = N'StakingDurationMonth');
    IF @var296 IS NOT NULL EXEC(N'ALTER TABLE [StakingPolicyMaster] DROP CONSTRAINT [' + @var296 + '];');
    ALTER TABLE [StakingPolicyMaster] DROP COLUMN [StakingDurationMonth];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181224125626_stakingentity')
BEGIN
    DECLARE @var297 sysname;
    SELECT @var297 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StakingPolicyMaster]') AND [c].[name] = N'StakingDurationWeek');
    IF @var297 IS NOT NULL EXEC(N'ALTER TABLE [StakingPolicyMaster] DROP CONSTRAINT [' + @var297 + '];');
    ALTER TABLE [StakingPolicyMaster] DROP COLUMN [StakingDurationWeek];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181224125626_stakingentity')
BEGIN
    DECLARE @var298 sysname;
    SELECT @var298 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StakingPolicyMaster]') AND [c].[name] = N'TakerCharges');
    IF @var298 IS NOT NULL EXEC(N'ALTER TABLE [StakingPolicyMaster] DROP CONSTRAINT [' + @var298 + '];');
    ALTER TABLE [StakingPolicyMaster] DROP COLUMN [TakerCharges];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181224125626_stakingentity')
BEGIN
    EXEC sp_rename N'[StakingChargeMaster].[StakingPolicyID]', N'StakingPolicyDetailID', N'COLUMN';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181224125626_stakingentity')
BEGIN
    DECLARE @var299 sysname;
    SELECT @var299 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[AllowedChannels]') AND [c].[name] = N'ChannelName');
    IF @var299 IS NOT NULL EXEC(N'ALTER TABLE [AllowedChannels] DROP CONSTRAINT [' + @var299 + '];');
    ALTER TABLE [AllowedChannels] ALTER COLUMN [ChannelName] nvarchar(50) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181224125626_stakingentity')
BEGIN
    ALTER TABLE [TransactionBlockedChannel] ADD CONSTRAINT [PK_TransactionBlockedChannel] PRIMARY KEY ([ChannelID], [TrnType]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181224125626_stakingentity')
BEGIN
    ALTER TABLE [StakingPolicyMaster] ADD CONSTRAINT [AK_StakingPolicyMaster_StakingType_WalletTypeID] UNIQUE ([StakingType], [WalletTypeID]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181224125626_stakingentity')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181224125626_stakingentity', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181225044711_stackingtbl')
BEGIN
    CREATE TABLE [StakingPolicyDetail] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [StakingPolicyID] bigint NOT NULL,
        [MinAmount] decimal(18, 8) NOT NULL,
        [MaxAmount] decimal(18, 8) NOT NULL,
        [StakingDurationWeek] smallint NOT NULL,
        [StakingDurationMonth] smallint NOT NULL,
        [InterestType] smallint NOT NULL,
        [InterestValue] decimal(18, 8) NOT NULL,
        [InterestWalletTypeID] bigint NOT NULL,
        [MakerCharges] decimal(18, 8) NOT NULL,
        [TakerCharges] decimal(18, 8) NOT NULL,
        [EnableAutoUnstaking] smallint NOT NULL,
        [EnableStakingBeforeMaturity] smallint NOT NULL,
        [EnableStakingBeforeMaturityCharge] smallint NOT NULL,
        CONSTRAINT [PK_StakingPolicyDetail] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181225044711_stackingtbl')
BEGIN
    CREATE TABLE [TokenStakingHistory] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [StakingAmount] decimal(18, 8) NOT NULL,
        [StakingPolicyDetailID] bigint NOT NULL,
        [Charge] decimal(18, 8) NOT NULL,
        [MaturityDate] datetime2 NOT NULL,
        [MaturityAmount] decimal(18, 2) NOT NULL,
        [MinAmount] decimal(18, 8) NOT NULL,
        [MaxAmount] decimal(18, 8) NOT NULL,
        [MakerCharges] decimal(18, 8) NOT NULL,
        [TakerCharges] decimal(18, 8) NOT NULL,
        [EnableAutoUnstaking] smallint NOT NULL,
        [EnableStakingBeforeMaturity] smallint NOT NULL,
        [EnableStakingBeforeMaturityCharge] smallint NOT NULL,
        CONSTRAINT [PK_TokenStakingHistory] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181225044711_stackingtbl')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181225044711_stackingtbl', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181225092142_stackingchanges1')
BEGIN
    ALTER TABLE [TokenStakingHistory] ADD [ChannelID] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181225092142_stackingchanges1')
BEGIN
    ALTER TABLE [TokenStakingHistory] ADD [UserID] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181225092142_stackingchanges1')
BEGIN
    ALTER TABLE [TokenStakingHistory] ADD [WalletID] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181225092142_stackingchanges1')
BEGIN
    ALTER TABLE [TokenStakingHistory] ADD [WalletOwnerID] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181225092142_stackingchanges1')
BEGIN
    ALTER TABLE [TokenStakingHistory] ADD [WalletTypeID] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181225092142_stackingchanges1')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181225092142_stackingchanges1', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181226054600_Adddocumentmasterentity')
BEGIN
    ALTER TABLE [TradeStopLoss] ADD [LTP] decimal(18, 8) NOT NULL DEFAULT 0.0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181226054600_Adddocumentmasterentity')
BEGIN
    ALTER TABLE [TradeStopLoss] ADD [MarketIndicator] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181226054600_Adddocumentmasterentity')
BEGIN
    ALTER TABLE [TradeStopLoss] ADD [RangeMax] decimal(18, 8) NOT NULL DEFAULT 0.0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181226054600_Adddocumentmasterentity')
BEGIN
    ALTER TABLE [TradeStopLoss] ADD [RangeMin] decimal(18, 8) NOT NULL DEFAULT 0.0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181226054600_Adddocumentmasterentity')
BEGIN
    DECLARE @var300 sysname;
    SELECT @var300 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PersonalVerification]') AND [c].[name] = N'VerifyStatus');
    IF @var300 IS NOT NULL EXEC(N'ALTER TABLE [PersonalVerification] DROP CONSTRAINT [' + @var300 + '];');
    ALTER TABLE [PersonalVerification] ALTER COLUMN [VerifyStatus] int NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181226054600_Adddocumentmasterentity')
BEGIN
    ALTER TABLE [PersonalVerification] ADD [Remark] nvarchar(2000) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181226054600_Adddocumentmasterentity')
BEGIN
    CREATE TABLE [DocumentMaster] (
        [Id] uniqueidentifier NOT NULL,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] bit NOT NULL,
        [Name] nvarchar(50) NOT NULL,
        CONSTRAINT [PK_DocumentMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181226054600_Adddocumentmasterentity')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181226054600_Adddocumentmasterentity', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181226063358_historyextrafileds')
BEGIN
    EXEC sp_rename N'[StakingPolicyMaster].[DiscType]', N'SlabType', N'COLUMN';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181226063358_historyextrafileds')
BEGIN
    ALTER TABLE [TokenStakingHistory] ADD [InterestType] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181226063358_historyextrafileds')
BEGIN
    ALTER TABLE [TokenStakingHistory] ADD [InterestValue] decimal(18, 8) NOT NULL DEFAULT 0.0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181226063358_historyextrafileds')
BEGIN
    ALTER TABLE [TokenStakingHistory] ADD [InterestWalletTypeID] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181226063358_historyextrafileds')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181226063358_historyextrafileds', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181226071253_ChangeKycmasterAndKYCUserMapping')
BEGIN
    ALTER TABLE [kYCIdentityMaster] ADD [DocumentMasterId] nvarchar(50) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181226071253_ChangeKycmasterAndKYCUserMapping')
BEGIN
    ALTER TABLE [kYCIdentityConfigurationMapping] ADD [LevelId] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181226071253_ChangeKycmasterAndKYCUserMapping')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181226071253_ChangeKycmasterAndKYCUserMapping', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181226084048_ChangeKycmasterAndKYCUserMappingChange')
BEGIN
    ALTER TABLE [TokenStakingHistory] ADD [RenewUnstakingEnable] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181226084048_ChangeKycmasterAndKYCUserMappingChange')
BEGIN
    ALTER TABLE [TokenStakingHistory] ADD [RenewUnstakingPeriod] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181226084048_ChangeKycmasterAndKYCUserMappingChange')
BEGIN
    DECLARE @var301 sysname;
    SELECT @var301 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StakingPolicyDetail]') AND [c].[name] = N'EnableStakingBeforeMaturityCharge');
    IF @var301 IS NOT NULL EXEC(N'ALTER TABLE [StakingPolicyDetail] DROP CONSTRAINT [' + @var301 + '];');
    ALTER TABLE [StakingPolicyDetail] ALTER COLUMN [EnableStakingBeforeMaturityCharge] decimal(18, 8) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181226084048_ChangeKycmasterAndKYCUserMappingChange')
BEGIN
    ALTER TABLE [StakingPolicyDetail] ADD [RenewUnstakingEnable] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181226084048_ChangeKycmasterAndKYCUserMappingChange')
BEGIN
    ALTER TABLE [StakingPolicyDetail] ADD [RenewUnstakingPeriod] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181226084048_ChangeKycmasterAndKYCUserMappingChange')
BEGIN
    DECLARE @var302 sysname;
    SELECT @var302 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[kYCIdentityMaster]') AND [c].[name] = N'DocumentMasterId');
    IF @var302 IS NOT NULL EXEC(N'ALTER TABLE [kYCIdentityMaster] DROP CONSTRAINT [' + @var302 + '];');
    ALTER TABLE [kYCIdentityMaster] ALTER COLUMN [DocumentMasterId] nvarchar(500) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181226084048_ChangeKycmasterAndKYCUserMappingChange')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181226084048_ChangeKycmasterAndKYCUserMappingChange', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181226094212_historyextrafileds2')
BEGIN
    ALTER TABLE [TokenStakingHistory] ADD [InterestValueMst] decimal(18, 8) NOT NULL DEFAULT 0.0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181226094212_historyextrafileds2')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181226094212_historyextrafileds2', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181226131442_modifyActivitytable')
BEGIN
    DECLARE @var303 sysname;
    SELECT @var303 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ActivityRegister]') AND [c].[name] = N'Application');
    IF @var303 IS NOT NULL EXEC(N'ALTER TABLE [ActivityRegister] DROP CONSTRAINT [' + @var303 + '];');
    ALTER TABLE [ActivityRegister] DROP COLUMN [Application];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181226131442_modifyActivitytable')
BEGIN
    DECLARE @var304 sysname;
    SELECT @var304 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ActivityRegister]') AND [c].[name] = N'EndPoint');
    IF @var304 IS NOT NULL EXEC(N'ALTER TABLE [ActivityRegister] DROP CONSTRAINT [' + @var304 + '];');
    ALTER TABLE [ActivityRegister] DROP COLUMN [EndPoint];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181226131442_modifyActivitytable')
BEGIN
    EXEC sp_rename N'[ActivityRegister].[Response]', N'Session', N'COLUMN';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181226131442_modifyActivitytable')
BEGIN
    EXEC sp_rename N'[ActivityRegister].[Request]', N'AccessToken', N'COLUMN';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181226131442_modifyActivitytable')
BEGIN
    EXEC sp_rename N'[ActivityRegister].[EventId]', N'ReturnCode', N'COLUMN';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181226131442_modifyActivitytable')
BEGIN
    EXEC sp_rename N'[ActivityRegister].[Description]', N'Remark', N'COLUMN';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181226131442_modifyActivitytable')
BEGIN
    ALTER TABLE [ActivityRegister] ADD [ActivityTypeId] uniqueidentifier NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181226131442_modifyActivitytable')
BEGIN
    ALTER TABLE [ActivityRegister] ADD [AliasName] nvarchar(1000) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181226131442_modifyActivitytable')
BEGIN
    ALTER TABLE [ActivityRegister] ADD [ApplicationId] uniqueidentifier NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181226131442_modifyActivitytable')
BEGIN
    ALTER TABLE [ActivityRegister] ADD [DeviceId] nvarchar(2000) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181226131442_modifyActivitytable')
BEGIN
    ALTER TABLE [ActivityRegister] ADD [ErrorCode] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181226131442_modifyActivitytable')
BEGIN
    ALTER TABLE [ActivityRegister] ADD [HostURLId] uniqueidentifier NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181226131442_modifyActivitytable')
BEGIN
    ALTER TABLE [ActivityRegister] ADD [IPAddress] nvarchar(30) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181226131442_modifyActivitytable')
BEGIN
    ALTER TABLE [ActivityRegister] ADD [ModuleTypeId] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181226131442_modifyActivitytable')
BEGIN
    ALTER TABLE [ActivityRegister] ADD [ReturnMsg] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181226131442_modifyActivitytable')
BEGIN
    CREATE TABLE [ActivityRegisterDetail] (
        [Id] uniqueidentifier NOT NULL,
        [ActivityId] uniqueidentifier NOT NULL,
        [Request] nvarchar(max) NULL,
        [Response] nvarchar(max) NULL,
        CONSTRAINT [PK_ActivityRegisterDetail] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181226131442_modifyActivitytable')
BEGIN
    CREATE TABLE [ActivityType_Master] (
        [Id] uniqueidentifier NOT NULL,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] bit NOT NULL,
        [TypeMaster] nvarchar(4000) NULL,
        [AliasName] nvarchar(1000) NULL,
        [IsDelete] bit NOT NULL,
        CONSTRAINT [PK_ActivityType_Master] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181226131442_modifyActivitytable')
BEGIN
    CREATE TABLE [HostURLMaster] (
        [Id] uniqueidentifier NOT NULL,
        [HostURL] nvarchar(500) NULL,
        [AliasName] nvarchar(500) NULL,
        CONSTRAINT [PK_HostURLMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181226131442_modifyActivitytable')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181226131442_modifyActivitytable', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181227051205_ForUserBlockStatus')
BEGIN
    EXEC sp_rename N'[WalletTypeMasters].[Discription]', N'Description', N'COLUMN';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181227051205_ForUserBlockStatus')
BEGIN
    ALTER TABLE [TradeStopLoss] ADD [PairID] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181227051205_ForUserBlockStatus')
BEGIN
    ALTER TABLE [BizUser] ADD [IsBlocked] bit NOT NULL DEFAULT 0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181227051205_ForUserBlockStatus')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181227051205_ForUserBlockStatus', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181227071235_ForStakingPolicyDetail')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181227071235_ForStakingPolicyDetail', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181228060601_ForVishveta')
BEGIN
    CREATE TABLE [LeverageMaster] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [WalletTypeID] bigint NOT NULL,
        [LeveragePer] decimal(18, 8) NOT NULL,
        CONSTRAINT [PK_LeverageMaster] PRIMARY KEY ([WalletTypeID])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181228060601_ForVishveta')
BEGIN
    CREATE TABLE [StopLossMaster] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [WalletTypeID] bigint NOT NULL,
        [StopLossPer] decimal(18, 8) NOT NULL,
        CONSTRAINT [PK_StopLossMaster] PRIMARY KEY ([WalletTypeID])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181228060601_ForVishveta')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181228060601_ForVishveta', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181228064346_ForUday')
BEGIN
    ALTER TABLE [TradePairStastics] ADD [ChangeValue] decimal(18, 8) NOT NULL DEFAULT 0.0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181228064346_ForUday')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181228064346_ForUday', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181228131515_StatasticsChanges')
BEGIN
    EXEC sp_rename N'[AddRemoveUserWalletRequest].[Email]', N'ReceiverEmail', N'COLUMN';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181228131515_StatasticsChanges')
BEGIN
    ALTER TABLE [TradePairStastics] ADD [CronDate] datetime2 NOT NULL DEFAULT '0001-01-01T00:00:00.0000000';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181228131515_StatasticsChanges')
BEGIN
    ALTER TABLE [TokenStakingHistory] ADD [SlabType] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181228131515_StatasticsChanges')
BEGIN
    ALTER TABLE [TokenStakingHistory] ADD [StakingType] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181228131515_StatasticsChanges')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181228131515_StatasticsChanges', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181229112246_addcolumninUserConfiguration')
BEGIN
    ALTER TABLE [UserProfileConfig] ADD [LeaderId] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181229112246_addcolumninUserConfiguration')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181229112246_addcolumninUserConfiguration', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181229113704_unstakinghistory1')
BEGIN
    DECLARE @var305 sysname;
    SELECT @var305 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[UserProfileConfig]') AND [c].[name] = N'LeaderId');
    IF @var305 IS NOT NULL EXEC(N'ALTER TABLE [UserProfileConfig] DROP CONSTRAINT [' + @var305 + '];');
    ALTER TABLE [UserProfileConfig] DROP COLUMN [LeaderId];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181229113704_unstakinghistory1')
BEGIN
    DECLARE @var306 sysname;
    SELECT @var306 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TokenStakingHistory]') AND [c].[name] = N'Charge');
    IF @var306 IS NOT NULL EXEC(N'ALTER TABLE [TokenStakingHistory] DROP CONSTRAINT [' + @var306 + '];');
    ALTER TABLE [TokenStakingHistory] DROP COLUMN [Charge];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181229113704_unstakinghistory1')
BEGIN
    ALTER TABLE [TokenStakingHistory] ADD [StakingRequestID] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181229113704_unstakinghistory1')
BEGIN
    CREATE TABLE [TokenUnStakingHistory] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [TokenStakingHistoryID] bigint NOT NULL,
        [AmountCredited] decimal(18, 8) NOT NULL,
        [UnstakeType] smallint NOT NULL,
        [InterestCreditedValue] decimal(18, 8) NOT NULL,
        [ChargeBeforeMaturity] decimal(18, 8) NOT NULL,
        [DegradeStakingHistoryRequestID] bigint NOT NULL,
        CONSTRAINT [PK_TokenUnStakingHistory] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181229113704_unstakinghistory1')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181229113704_unstakinghistory1', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181229121308_addcolumninUserConfigurationLeaderId')
BEGIN
    ALTER TABLE [UserProfileConfig] ADD [LeaderId] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181229121308_addcolumninUserConfigurationLeaderId')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181229121308_addcolumninUserConfigurationLeaderId', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181229125958_unstakinghistory12')
BEGIN
    DECLARE @var307 sysname;
    SELECT @var307 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TokenStakingHistory]') AND [c].[name] = N'EnableStakingBeforeMaturityCharge');
    IF @var307 IS NOT NULL EXEC(N'ALTER TABLE [TokenStakingHistory] DROP CONSTRAINT [' + @var307 + '];');
    ALTER TABLE [TokenStakingHistory] ALTER COLUMN [EnableStakingBeforeMaturityCharge] decimal(18, 8) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181229125958_unstakinghistory12')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181229125958_unstakinghistory12', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181231140544_lengthincreaseCommServiceproviderMaster')
BEGIN
    DECLARE @var308 sysname;
    SELECT @var308 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CommServiceproviderMaster]') AND [c].[name] = N'Password');
    IF @var308 IS NOT NULL EXEC(N'ALTER TABLE [CommServiceproviderMaster] DROP CONSTRAINT [' + @var308 + '];');
    ALTER TABLE [CommServiceproviderMaster] ALTER COLUMN [Password] nvarchar(200) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20181231140544_lengthincreaseCommServiceproviderMaster')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20181231140544_lengthincreaseCommServiceproviderMaster', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190103114648_addIPRangeTable')
BEGIN
    CREATE TABLE [IPRange] (
        [Id] uniqueidentifier NOT NULL,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] bit NOT NULL,
        [UserId] int NOT NULL,
        [StartIp] nvarchar(20) NOT NULL,
        [EndIp] nvarchar(20) NOT NULL,
        CONSTRAINT [PK_IPRange] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190103114648_addIPRangeTable')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190103114648_addIPRangeTable', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190104101400_convertrange')
BEGIN
    DECLARE @var309 sysname;
    SELECT @var309 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RouteConfiguration]') AND [c].[name] = N'ConvertAmount');
    IF @var309 IS NOT NULL EXEC(N'ALTER TABLE [RouteConfiguration] DROP CONSTRAINT [' + @var309 + '];');
    ALTER TABLE [RouteConfiguration] ALTER COLUMN [ConvertAmount] decimal(22, 2) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190104101400_convertrange')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190104101400_convertrange', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190104104910_CoinRequest')
BEGIN
    DECLARE @var310 sysname;
    SELECT @var310 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RouteConfiguration]') AND [c].[name] = N'ConvertAmount');
    IF @var310 IS NOT NULL EXEC(N'ALTER TABLE [RouteConfiguration] DROP CONSTRAINT [' + @var310 + '];');
    ALTER TABLE [RouteConfiguration] ALTER COLUMN [ConvertAmount] decimal(18, 8) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190104104910_CoinRequest')
BEGIN
    CREATE TABLE [coinListRequests] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [CoinName] nvarchar(30) NOT NULL,
        [CoinAbbreviationCode] nvarchar(6) NOT NULL,
        [IconUrl] nvarchar(max) NULL,
        [TotalSupply] bigint NOT NULL,
        [MaxSupply] bigint NOT NULL,
        [IssueDate] datetime2 NOT NULL,
        [IssuePrice] decimal(18, 8) NOT NULL,
        [CirculatingSupply] bigint NOT NULL,
        [WebsiteUrl] nvarchar(max) NOT NULL,
        [Explorer] text NULL,
        [Community] text NULL,
        [Introduction] nvarchar(max) NOT NULL,
        CONSTRAINT [PK_coinListRequests] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190104104910_CoinRequest')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190104104910_CoinRequest', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190104111711_ComplainmasterPriorityandmodifycomplaintmaster')
BEGIN
    ALTER TABLE [coinListRequests] DROP CONSTRAINT [PK_coinListRequests];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190104111711_ComplainmasterPriorityandmodifycomplaintmaster')
BEGIN
    EXEC sp_rename N'[coinListRequests]', N'CoinListRequest';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190104111711_ComplainmasterPriorityandmodifycomplaintmaster')
BEGIN
    DECLARE @var311 sysname;
    SELECT @var311 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RouteConfiguration]') AND [c].[name] = N'ConvertAmount');
    IF @var311 IS NOT NULL EXEC(N'ALTER TABLE [RouteConfiguration] DROP CONSTRAINT [' + @var311 + '];');
    ALTER TABLE [RouteConfiguration] ALTER COLUMN [ConvertAmount] decimal(22, 2) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190104111711_ComplainmasterPriorityandmodifycomplaintmaster')
BEGIN
    ALTER TABLE [Complainmaster] ADD [ComplaintPriorityId] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190104111711_ComplainmasterPriorityandmodifycomplaintmaster')
BEGIN
    ALTER TABLE [CoinListRequest] ADD CONSTRAINT [PK_CoinListRequest] PRIMARY KEY ([Id]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190104111711_ComplainmasterPriorityandmodifycomplaintmaster')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190104111711_ComplainmasterPriorityandmodifycomplaintmaster', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190104112343_ComplainmasterPriorityandmodify')
BEGIN
    CREATE TABLE [ComplaintPriorityMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Priority] nvarchar(50) NOT NULL,
        [PriorityTime] nvarchar(50) NOT NULL,
        CONSTRAINT [PK_ComplaintPriorityMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190104112343_ComplainmasterPriorityandmodify')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190104112343_ComplainmasterPriorityandmodify', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190107121721_CoinRequestListing')
BEGIN
    DECLARE @var312 sysname;
    SELECT @var312 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CoinListRequest]') AND [c].[name] = N'TotalSupply');
    IF @var312 IS NOT NULL EXEC(N'ALTER TABLE [CoinListRequest] DROP CONSTRAINT [' + @var312 + '];');
    ALTER TABLE [CoinListRequest] ALTER COLUMN [TotalSupply] decimal(18, 8) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190107121721_CoinRequestListing')
BEGIN
    DECLARE @var313 sysname;
    SELECT @var313 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CoinListRequest]') AND [c].[name] = N'MaxSupply');
    IF @var313 IS NOT NULL EXEC(N'ALTER TABLE [CoinListRequest] DROP CONSTRAINT [' + @var313 + '];');
    ALTER TABLE [CoinListRequest] ALTER COLUMN [MaxSupply] decimal(18, 8) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190107121721_CoinRequestListing')
BEGIN
    DECLARE @var314 sysname;
    SELECT @var314 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CoinListRequest]') AND [c].[name] = N'Explorer');
    IF @var314 IS NOT NULL EXEC(N'ALTER TABLE [CoinListRequest] DROP CONSTRAINT [' + @var314 + '];');
    ALTER TABLE [CoinListRequest] ALTER COLUMN [Explorer] text NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190107121721_CoinRequestListing')
BEGIN
    DECLARE @var315 sysname;
    SELECT @var315 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CoinListRequest]') AND [c].[name] = N'CirculatingSupply');
    IF @var315 IS NOT NULL EXEC(N'ALTER TABLE [CoinListRequest] DROP CONSTRAINT [' + @var315 + '];');
    ALTER TABLE [CoinListRequest] ALTER COLUMN [CirculatingSupply] decimal(18, 8) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190107121721_CoinRequestListing')
BEGIN
    ALTER TABLE [CoinListRequest] ADD [APIDocumentPath] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190107121721_CoinRequestListing')
BEGIN
    ALTER TABLE [CoinListRequest] ADD [Address] nvarchar(max) NOT NULL DEFAULT N'';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190107121721_CoinRequestListing')
BEGIN
    ALTER TABLE [CoinListRequest] ADD [AddressLine2] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190107121721_CoinRequestListing')
BEGIN
    ALTER TABLE [CoinListRequest] ADD [City] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190107121721_CoinRequestListing')
BEGIN
    ALTER TABLE [CoinListRequest] ADD [CoinTokenAddress] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190107121721_CoinRequestListing')
BEGIN
    ALTER TABLE [CoinListRequest] ADD [CoinType] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190107121721_CoinRequestListing')
BEGIN
    ALTER TABLE [CoinListRequest] ADD [CurListOnOtherExng] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190107121721_CoinRequestListing')
BEGIN
    ALTER TABLE [CoinListRequest] ADD [DecimalPlace] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190107121721_CoinRequestListing')
BEGIN
    ALTER TABLE [CoinListRequest] ADD [Email] nvarchar(max) NOT NULL DEFAULT N'';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190107121721_CoinRequestListing')
BEGIN
    ALTER TABLE [CoinListRequest] ADD [FirstName] nvarchar(250) NOT NULL DEFAULT N'';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190107121721_CoinRequestListing')
BEGIN
    ALTER TABLE [CoinListRequest] ADD [GithubLink] nvarchar(max) NOT NULL DEFAULT N'';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190107121721_CoinRequestListing')
BEGIN
    ALTER TABLE [CoinListRequest] ADD [HowFundsWereRaised] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190107121721_CoinRequestListing')
BEGIN
    ALTER TABLE [CoinListRequest] ADD [LastName] nvarchar(250) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190107121721_CoinRequestListing')
BEGIN
    ALTER TABLE [CoinListRequest] ADD [Phone] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190107121721_CoinRequestListing')
BEGIN
    ALTER TABLE [CoinListRequest] ADD [Premine] nvarchar(max) NOT NULL DEFAULT N'';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190107121721_CoinRequestListing')
BEGIN
    ALTER TABLE [CoinListRequest] ADD [ProjectName] nvarchar(max) NOT NULL DEFAULT N'';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190107121721_CoinRequestListing')
BEGIN
    ALTER TABLE [CoinListRequest] ADD [ProjectWebsiteLink] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190107121721_CoinRequestListing')
BEGIN
    ALTER TABLE [CoinListRequest] ADD [State] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190107121721_CoinRequestListing')
BEGIN
    ALTER TABLE [CoinListRequest] ADD [StreetAddress] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190107121721_CoinRequestListing')
BEGIN
    ALTER TABLE [CoinListRequest] ADD [TrnFee] decimal(18, 8) NOT NULL DEFAULT 0.0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190107121721_CoinRequestListing')
BEGIN
    ALTER TABLE [CoinListRequest] ADD [WebsiteFAQ] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190107121721_CoinRequestListing')
BEGIN
    ALTER TABLE [CoinListRequest] ADD [WhitePaper] nvarchar(max) NOT NULL DEFAULT N'';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190107121721_CoinRequestListing')
BEGIN
    ALTER TABLE [CoinListRequest] ADD [ZipCode] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190107121721_CoinRequestListing')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190107121721_CoinRequestListing', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190109045728_AddPasswordpolicymaster')
BEGIN
    CREATE TABLE [UserPasswordPolicyMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [UserId] int NOT NULL,
        [PwdExpiretime] int NOT NULL,
        [MaxfppwdDay] int NOT NULL,
        [MaxfppwdMonth] int NOT NULL,
        [LinkExpiryTime] int NOT NULL,
        [OTPExpiryTime] int NOT NULL,
        [Password] nvarchar(max) NULL,
        CONSTRAINT [PK_UserPasswordPolicyMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190109045728_AddPasswordpolicymaster')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190109045728_AddPasswordpolicymaster', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190109050340_AddPasswordpolicymasterModify')
BEGIN
    DECLARE @var316 sysname;
    SELECT @var316 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[UserPasswordPolicyMaster]') AND [c].[name] = N'Password');
    IF @var316 IS NOT NULL EXEC(N'ALTER TABLE [UserPasswordPolicyMaster] DROP CONSTRAINT [' + @var316 + '];');
    ALTER TABLE [UserPasswordPolicyMaster] DROP COLUMN [Password];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190109050340_AddPasswordpolicymasterModify')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190109050340_AddPasswordpolicymasterModify', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190110093619_addThememodeusertable')
BEGIN
    ALTER TABLE [BizUser] ADD [Thememode] bit NOT NULL DEFAULT 0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190110093619_addThememodeusertable')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190110093619_addThememodeusertable', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190110100446_templatecategorymaster')
BEGIN
    DECLARE @var317 sysname;
    SELECT @var317 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TemplateMaster]') AND [c].[name] = N'IsOnOff');
    IF @var317 IS NOT NULL EXEC(N'ALTER TABLE [TemplateMaster] DROP CONSTRAINT [' + @var317 + '];');
    ALTER TABLE [TemplateMaster] DROP COLUMN [IsOnOff];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190110100446_templatecategorymaster')
BEGIN
    DECLARE @var318 sysname;
    SELECT @var318 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TemplateMaster]') AND [c].[name] = N'ParameterInfo');
    IF @var318 IS NOT NULL EXEC(N'ALTER TABLE [TemplateMaster] DROP CONSTRAINT [' + @var318 + '];');
    ALTER TABLE [TemplateMaster] DROP COLUMN [ParameterInfo];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190110100446_templatecategorymaster')
BEGIN
    CREATE TABLE [TemplateCategoryMaster] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [IsOnOff] smallint NOT NULL,
        [ParameterInfo] nvarchar(500) NULL,
        CONSTRAINT [PK_TemplateCategoryMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190110100446_templatecategorymaster')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190110100446_templatecategorymaster', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190110123220_withdrawverifybit')
BEGIN
    ALTER TABLE [TransactionQueue] ADD [IsVerified] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190110123220_withdrawverifybit')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190110123220_withdrawverifybit', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190111052919_addmasterlinktableforforgotpassword')
BEGIN
    CREATE TABLE [UserLinkMaster] (
        [Id] uniqueidentifier NOT NULL,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] bit NOT NULL,
        [UserLinkData] nvarchar(max) NULL,
        [UserId] int NOT NULL,
        [LinkvalidTime] int NOT NULL,
        CONSTRAINT [PK_UserLinkMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190111052919_addmasterlinktableforforgotpassword')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190111052919_addmasterlinktableforforgotpassword', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190111070352_isinternalbitwithdraw')
BEGIN
    ALTER TABLE [TransactionQueue] ADD [IsInternalTrn] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190111070352_isinternalbitwithdraw')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190111070352_isinternalbitwithdraw', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190112074957_templatecategorymasteMappingcolumn')
BEGIN
    ALTER TABLE [TemplateCategoryMaster] ADD [TemplateId] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190112074957_templatecategorymasteMappingcolumn')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190112074957_templatecategorymasteMappingcolumn', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190112081705_AddcolumnConvertedAdsressToaddressmaster')
BEGIN
    ALTER TABLE [AddressMasters] ADD [ConvertedAddress] nvarchar(50) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190112081705_AddcolumnConvertedAdsressToaddressmaster')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190112081705_AddcolumnConvertedAdsressToaddressmaster', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190112134056_templatecategoryTemplateName')
BEGIN
    ALTER TABLE [TemplateCategoryMaster] ADD [TemplateName] nvarchar(500) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190112134056_templatecategoryTemplateName')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190112134056_templatecategoryTemplateName', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190115064945_resendwithdrawmail')
BEGIN
    DECLARE @var319 sysname;
    SELECT @var319 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[AddressMasters]') AND [c].[name] = N'ConvertedAddress');
    IF @var319 IS NOT NULL EXEC(N'ALTER TABLE [AddressMasters] DROP CONSTRAINT [' + @var319 + '];');
    ALTER TABLE [AddressMasters] DROP COLUMN [ConvertedAddress];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190115064945_resendwithdrawmail')
BEGIN
    ALTER TABLE [WalletMasters] ADD [WalletUsageType] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190115064945_resendwithdrawmail')
BEGIN
    ALTER TABLE [TransactionQueue] ADD [EmailSendDate] datetime2 NOT NULL DEFAULT '0001-01-01T00:00:00.0000000';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190115064945_resendwithdrawmail')
BEGIN
    DECLARE @var320 sysname;
    SELECT @var320 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[AddressMasters]') AND [c].[name] = N'Address');
    IF @var320 IS NOT NULL EXEC(N'ALTER TABLE [AddressMasters] DROP CONSTRAINT [' + @var320 + '];');
    ALTER TABLE [AddressMasters] ALTER COLUMN [Address] nvarchar(50) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190115064945_resendwithdrawmail')
BEGIN
    ALTER TABLE [AddressMasters] ADD [OriginalAddress] nvarchar(50) NOT NULL DEFAULT N'';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190115064945_resendwithdrawmail')
BEGIN
    CREATE TABLE [ColdWalletMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [KeyId1] nvarchar(max) NOT NULL,
        [KeyId2] nvarchar(max) NOT NULL,
        [KeyId3] nvarchar(max) NOT NULL,
        [BackUpKey] nvarchar(max) NOT NULL,
        [PublicKey] nvarchar(max) NOT NULL,
        [UserKey] nvarchar(max) NULL,
        [Recoverable] smallint NOT NULL,
        [WalletId] bigint NOT NULL,
        CONSTRAINT [PK_ColdWalletMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190115064945_resendwithdrawmail')
BEGIN
    CREATE TABLE [TransactionMarketType] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [MarketName] nvarchar(max) NULL,
        [AllowForFollowers] bit NOT NULL,
        CONSTRAINT [PK_TransactionMarketType] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190115064945_resendwithdrawmail')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190115064945_resendwithdrawmail', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190115124123_walletusagetype')
BEGIN
    CREATE TABLE [WalletUsageType] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL,
        [WalletUsageTypeName] nvarchar(max) NOT NULL,
        CONSTRAINT [PK_WalletUsageType] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190115124123_walletusagetype')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190115124123_walletusagetype', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190116044901_ledgerstatistics')
BEGIN
    ALTER TABLE [StakingPolicyMaster] DROP CONSTRAINT [PK_StakingPolicyMaster];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190116044901_ledgerstatistics')
BEGIN
    ALTER TABLE [StakingPolicyMaster] ADD CONSTRAINT [PK_StakingPolicyMaster] PRIMARY KEY ([WalletTypeID], [StakingType]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190116044901_ledgerstatistics')
BEGIN
    CREATE TABLE [BalanceStatistics] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [UserID] bigint NOT NULL,
        [WalletID] bigint NOT NULL,
        [WalletTypeID] bigint NOT NULL,
        [Year] smallint NOT NULL,
        [Month] smallint NOT NULL,
        [StartingBalance] decimal(18, 8) NOT NULL,
        [EndingBalance] decimal(18, 8) NOT NULL,
        CONSTRAINT [PK_BalanceStatistics] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190116044901_ledgerstatistics')
BEGIN
    CREATE TABLE [CurrencyRateMaster] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [WalletTypeId] bigint NOT NULL,
        [CurrentRate] decimal(18, 8) NOT NULL,
        CONSTRAINT [PK_CurrencyRateMaster] PRIMARY KEY ([WalletTypeId])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190116044901_ledgerstatistics')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190116044901_ledgerstatistics', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190116095342_addprofileManagement')
BEGIN
    DECLARE @var321 sysname;
    SELECT @var321 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Typemaster]') AND [c].[name] = N'EnableStatus');
    IF @var321 IS NOT NULL EXEC(N'ALTER TABLE [Typemaster] DROP CONSTRAINT [' + @var321 + '];');
    ALTER TABLE [Typemaster] DROP COLUMN [EnableStatus];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190116095342_addprofileManagement')
BEGIN
    DECLARE @var322 sysname;
    SELECT @var322 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SubscriptionMaster]') AND [c].[name] = N'ActiveStatus');
    IF @var322 IS NOT NULL EXEC(N'ALTER TABLE [SubscriptionMaster] DROP CONSTRAINT [' + @var322 + '];');
    ALTER TABLE [SubscriptionMaster] DROP COLUMN [ActiveStatus];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190116095342_addprofileManagement')
BEGIN
    DECLARE @var323 sysname;
    SELECT @var323 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SubscriptionMaster]') AND [c].[name] = N'EndDate');
    IF @var323 IS NOT NULL EXEC(N'ALTER TABLE [SubscriptionMaster] DROP CONSTRAINT [' + @var323 + '];');
    ALTER TABLE [SubscriptionMaster] DROP COLUMN [EndDate];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190116095342_addprofileManagement')
BEGIN
    DECLARE @var324 sysname;
    SELECT @var324 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SubscriptionMaster]') AND [c].[name] = N'StartDate');
    IF @var324 IS NOT NULL EXEC(N'ALTER TABLE [SubscriptionMaster] DROP CONSTRAINT [' + @var324 + '];');
    ALTER TABLE [SubscriptionMaster] DROP COLUMN [StartDate];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190116095342_addprofileManagement')
BEGIN
    EXEC sp_rename N'[ProfileMaster].[Price]', N'SubscriptionAmount', N'COLUMN';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190116095342_addprofileManagement')
BEGIN
    EXEC sp_rename N'[ProfileMaster].[Level]', N'KYCLevel', N'COLUMN';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190116095342_addprofileManagement')
BEGIN
    EXEC sp_rename N'[ProfileMaster].[EnableStatus]', N'IsRecursive', N'COLUMN';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190116095342_addprofileManagement')
BEGIN
    ALTER TABLE [SubscriptionMaster] ADD [AccessibleFeatures] nvarchar(2000) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190116095342_addprofileManagement')
BEGIN
    DECLARE @var325 sysname;
    SELECT @var325 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ProfileMaster]') AND [c].[name] = N'WithdrawalLimit');
    IF @var325 IS NOT NULL EXEC(N'ALTER TABLE [ProfileMaster] DROP CONSTRAINT [' + @var325 + '];');
    ALTER TABLE [ProfileMaster] ALTER COLUMN [WithdrawalLimit] nvarchar(2000) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190116095342_addprofileManagement')
BEGIN
    ALTER TABLE [ProfileMaster] ADD [DepositLimit] nvarchar(2000) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190116095342_addprofileManagement')
BEGIN
    ALTER TABLE [ProfileMaster] ADD [IsProfileExpiry] bit NOT NULL DEFAULT 0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190116095342_addprofileManagement')
BEGIN
    ALTER TABLE [ProfileMaster] ADD [ProfileFree] decimal(18, 8) NOT NULL DEFAULT 0.0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190116095342_addprofileManagement')
BEGIN
    ALTER TABLE [ProfileMaster] ADD [Profilelevel] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190116095342_addprofileManagement')
BEGIN
    ALTER TABLE [ProfileMaster] ADD [TradeLimit] nvarchar(2000) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190116095342_addprofileManagement')
BEGIN
    ALTER TABLE [ProfileMaster] ADD [TransactionLimit] nvarchar(2000) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190116095342_addprofileManagement')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190116095342_addprofileManagement', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190116095755_addProfileLevelMaster')
BEGIN
    CREATE TABLE [ProfileLevelMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [ProfileName] nvarchar(250) NOT NULL,
        CONSTRAINT [PK_ProfileLevelMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190116095755_addProfileLevelMaster')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190116095755_addProfileLevelMaster', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190117111812_chargeentity')
BEGIN
    CREATE TABLE [ChargeConfigurationDetail] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [ChargeConfigurationMasterID] bigint NOT NULL,
        [ChargeDistributionBasedOn] smallint NOT NULL,
        [ChargeType] bigint NOT NULL,
        [DeductionWalletTypeId] bigint NOT NULL,
        [ChargeValue] decimal(18, 8) NOT NULL,
        [ChargeValueType] smallint NOT NULL,
        [MakerCharge] decimal(18, 8) NOT NULL,
        [TakerCharge] decimal(18, 8) NOT NULL,
        [MinAmount] decimal(18, 8) NOT NULL,
        [MaxAmount] decimal(18, 8) NOT NULL,
        [Remarks] nvarchar(max) NULL,
        CONSTRAINT [PK_ChargeConfigurationDetail] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190117111812_chargeentity')
BEGIN
    CREATE TABLE [ChargeConfigurationMaster] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [WalletTypeID] bigint NOT NULL,
        [TrnType] bigint NOT NULL,
        [KYCComplaint] smallint NOT NULL,
        [SlabType] smallint NOT NULL,
        [SpecialChargeConfigurationID] bigint NOT NULL,
        [Remarks] nvarchar(max) NULL,
        CONSTRAINT [PK_ChargeConfigurationMaster] PRIMARY KEY ([WalletTypeID], [TrnType], [KYCComplaint], [SpecialChargeConfigurationID]),
        CONSTRAINT [AK_ChargeConfigurationMaster_KYCComplaint_SpecialChargeConfigurationID_TrnType_WalletTypeID] UNIQUE ([KYCComplaint], [SpecialChargeConfigurationID], [TrnType], [WalletTypeID])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190117111812_chargeentity')
BEGIN
    CREATE TABLE [SpecialChargeConfiguration] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [TrnDate] datetime2 NOT NULL,
        [Remarks] nvarchar(max) NULL,
        CONSTRAINT [PK_SpecialChargeConfiguration] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190117111812_chargeentity')
BEGIN
    CREATE TABLE [TrnChargeLog] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [BatchNo] nvarchar(max) NULL,
        [TrnNo] bigint NOT NULL,
        [TrnType] bigint NOT NULL,
        [Amount] decimal(18, 8) NOT NULL,
        [MakerCharge] decimal(18, 8) NULL,
        [TakerCharge] decimal(18, 8) NULL,
        [Charge] decimal(18, 8) NULL,
        [StakingChargeMasterID] bigint NULL,
        [ChargeConfigurationDetailID] bigint NULL,
        [TimeStamp] nvarchar(max) NULL,
        [DWalletID] bigint NOT NULL,
        [OWalletID] bigint NOT NULL,
        [DUserID] bigint NOT NULL,
        [OuserID] bigint NOT NULL,
        [WalletTypeID] bigint NOT NULL,
        [SlabType] smallint NOT NULL,
        [Remarks] nvarchar(max) NULL,
        [ChargeConfigurationMasterID] bigint NULL,
        CONSTRAINT [PK_TrnChargeLog] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190117111812_chargeentity')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190117111812_chargeentity', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190121051948_ChargecolumnAddAndEmailAPImanager')
BEGIN
    DECLARE @var326 sysname;
    SELECT @var326 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RequestFormatMaster]') AND [c].[name] = N'RequestID');
    IF @var326 IS NOT NULL EXEC(N'ALTER TABLE [RequestFormatMaster] DROP CONSTRAINT [' + @var326 + '];');
    ALTER TABLE [RequestFormatMaster] DROP COLUMN [RequestID];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190121051948_ChargecolumnAddAndEmailAPImanager')
BEGIN
    DECLARE @var327 sysname;
    SELECT @var327 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CommServiceproviderMaster]') AND [c].[name] = N'CommSerproID');
    IF @var327 IS NOT NULL EXEC(N'ALTER TABLE [CommServiceproviderMaster] DROP CONSTRAINT [' + @var327 + '];');
    ALTER TABLE [CommServiceproviderMaster] DROP COLUMN [CommSerproID];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190121051948_ChargecolumnAddAndEmailAPImanager')
BEGIN
    DECLARE @var328 sysname;
    SELECT @var328 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CommServiceMaster]') AND [c].[name] = N'CommServiceID');
    IF @var328 IS NOT NULL EXEC(N'ALTER TABLE [CommServiceMaster] DROP CONSTRAINT [' + @var328 + '];');
    ALTER TABLE [CommServiceMaster] DROP COLUMN [CommServiceID];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190121051948_ChargecolumnAddAndEmailAPImanager')
BEGIN
    DECLARE @var329 sysname;
    SELECT @var329 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CommAPIServiceMaster]') AND [c].[name] = N'APID');
    IF @var329 IS NOT NULL EXEC(N'ALTER TABLE [CommAPIServiceMaster] DROP CONSTRAINT [' + @var329 + '];');
    ALTER TABLE [CommAPIServiceMaster] DROP COLUMN [APID];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190121051948_ChargecolumnAddAndEmailAPImanager')
BEGIN
    EXEC sp_rename N'[RequestFormatMaster].[contentType]', N'ContentType', N'COLUMN';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190121051948_ChargecolumnAddAndEmailAPImanager')
BEGIN
    ALTER TABLE [WalletTransactionQueues] ADD [DeductedChargeAmount] decimal(18, 8) NOT NULL DEFAULT 0.0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190121051948_ChargecolumnAddAndEmailAPImanager')
BEGIN
    ALTER TABLE [WalletTransactionQueues] ADD [ErrorCode] bigint NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190121051948_ChargecolumnAddAndEmailAPImanager')
BEGIN
    ALTER TABLE [WalletTransactionQueues] ADD [HoldChargeAmount] decimal(18, 8) NOT NULL DEFAULT 0.0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190121051948_ChargecolumnAddAndEmailAPImanager')
BEGIN
    ALTER TABLE [WalletTransactionOrders] ADD [ChargeAmount] decimal(18, 8) NOT NULL DEFAULT 0.0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190121051948_ChargecolumnAddAndEmailAPImanager')
BEGIN
    ALTER TABLE [RequestFormatMaster] ADD [RequestName] nvarchar(60) NOT NULL DEFAULT N'';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190121051948_ChargecolumnAddAndEmailAPImanager')
BEGIN
    DECLARE @var330 sysname;
    SELECT @var330 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CommAPIServiceMaster]') AND [c].[name] = N'SMSBalURL');
    IF @var330 IS NOT NULL EXEC(N'ALTER TABLE [CommAPIServiceMaster] DROP CONSTRAINT [' + @var330 + '];');
    ALTER TABLE [CommAPIServiceMaster] ALTER COLUMN [SMSBalURL] nvarchar(200) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190121051948_ChargecolumnAddAndEmailAPImanager')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190121051948_ChargecolumnAddAndEmailAPImanager', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190121123946_STOPLOSSFollowers')
BEGIN
    ALTER TABLE [TradeStopLoss] ADD [FollowingTo] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190121123946_STOPLOSSFollowers')
BEGIN
    ALTER TABLE [TradeStopLoss] ADD [ISFollowersReq] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190121123946_STOPLOSSFollowers')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190121123946_STOPLOSSFollowers', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190121131019_STOPLOSSFollowers1')
BEGIN
    ALTER TABLE [TradeStopLoss] ADD [LeaderTrnNo] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190121131019_STOPLOSSFollowers1')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190121131019_STOPLOSSFollowers1', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190122135417_depositinternalbit')
BEGIN
    ALTER TABLE [DepositHistory] ADD [IsInternalTrn] smallint NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190122135417_depositinternalbit')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190122135417_depositinternalbit', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190123071605_AddGroupMaster_WatchMaster')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190123071605_AddGroupMaster_WatchMaster', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190123072129_Add_GroupMastertbl_WatchMastertbl')
BEGIN
    CREATE TABLE [GroupMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [UserId] int NOT NULL,
        [GroupName] nvarchar(200) NULL,
        CONSTRAINT [PK_GroupMaster] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_GroupMaster_BizUser_UserId] FOREIGN KEY ([UserId]) REFERENCES [BizUser] ([Id]) ON DELETE CASCADE
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190123072129_Add_GroupMastertbl_WatchMastertbl')
BEGIN
    CREATE TABLE [WatchMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [GroupId] bigint NOT NULL,
        [LeaderId] bigint NOT NULL,
        [WatcherId] bigint NOT NULL,
        [WatcherStatus] bit NOT NULL,
        CONSTRAINT [PK_WatchMaster] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_WatchMaster_GroupMaster_GroupId] FOREIGN KEY ([GroupId]) REFERENCES [GroupMaster] ([Id]) ON DELETE CASCADE
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190123072129_Add_GroupMastertbl_WatchMastertbl')
BEGIN
    CREATE INDEX [IX_GroupMaster_UserId] ON [GroupMaster] ([UserId]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190123072129_Add_GroupMastertbl_WatchMastertbl')
BEGIN
    CREATE INDEX [IX_WatchMaster_GroupId] ON [WatchMaster] ([GroupId]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190123072129_Add_GroupMastertbl_WatchMastertbl')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190123072129_Add_GroupMastertbl_WatchMastertbl', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190123075505_STOPLOSSFollowTradeType')
BEGIN
    ALTER TABLE [TradeStopLoss] ADD [FollowTradeType] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190123075505_STOPLOSSFollowTradeType')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190123075505_STOPLOSSFollowTradeType', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190123094808_marketcapentity')
BEGIN
    CREATE TABLE [CurrencyRateDetail] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [CurrencyRateMasterId] bigint NOT NULL,
        [Price] decimal(18, 8) NOT NULL,
        [Volume_24h] decimal(18, 8) NOT NULL,
        [Market_cap] decimal(18, 8) NOT NULL,
        [Percent_change_1h] decimal(18, 8) NOT NULL,
        [Percent_change_24h] decimal(18, 8) NOT NULL,
        [Percent_change_7d] decimal(18, 8) NOT NULL,
        [Last_updated] nvarchar(max) NOT NULL,
        [CoinName] nvarchar(max) NOT NULL,
        [Symbol] nvarchar(max) NOT NULL,
        [Last_updatedDateTime] datetime2 NULL,
        CONSTRAINT [PK_CurrencyRateDetail] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190123094808_marketcapentity')
BEGIN
    CREATE TABLE [MarketCapCounterMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [RecordCountLimit] bigint NOT NULL,
        [MaxLimit] bigint NOT NULL,
        [WalletTypeID] bigint NOT NULL,
        [CurrencyName] nvarchar(max) NULL,
        [TPSPickupStatus] bigint NOT NULL,
        [StartLimit] bigint NOT NULL,
        [Url] nvarchar(max) NOT NULL,
        CONSTRAINT [PK_MarketCapCounterMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190123094808_marketcapentity')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190123094808_marketcapentity', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190123105219_makertakerbit')
BEGIN
    ALTER TABLE [TrnChargeLog] ADD [IsMaker] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190123105219_makertakerbit')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190123105219_makertakerbit', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190124102311_MarketCapWalletStatasticColumn')
BEGIN
    DECLARE @var331 sysname;
    SELECT @var331 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TrnChargeLog]') AND [c].[name] = N'IsMaker');
    IF @var331 IS NOT NULL EXEC(N'ALTER TABLE [TrnChargeLog] DROP CONSTRAINT [' + @var331 + '];');
    ALTER TABLE [TrnChargeLog] DROP COLUMN [IsMaker];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190124102311_MarketCapWalletStatasticColumn')
BEGIN
    ALTER TABLE [StatasticsDetail] ADD [USDLastUpdateDateTime] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190124102311_MarketCapWalletStatasticColumn')
BEGIN
    ALTER TABLE [Statastics] ADD [USDAmount] decimal(18, 2) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190124102311_MarketCapWalletStatasticColumn')
BEGIN
    DECLARE @var332 sysname;
    SELECT @var332 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CurrencyRateDetail]') AND [c].[name] = N'Volume_24h');
    IF @var332 IS NOT NULL EXEC(N'ALTER TABLE [CurrencyRateDetail] DROP CONSTRAINT [' + @var332 + '];');
    ALTER TABLE [CurrencyRateDetail] ALTER COLUMN [Volume_24h] decimal(18, 2) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190124102311_MarketCapWalletStatasticColumn')
BEGIN
    DECLARE @var333 sysname;
    SELECT @var333 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CurrencyRateDetail]') AND [c].[name] = N'Price');
    IF @var333 IS NOT NULL EXEC(N'ALTER TABLE [CurrencyRateDetail] DROP CONSTRAINT [' + @var333 + '];');
    ALTER TABLE [CurrencyRateDetail] ALTER COLUMN [Price] decimal(18, 2) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190124102311_MarketCapWalletStatasticColumn')
BEGIN
    DECLARE @var334 sysname;
    SELECT @var334 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CurrencyRateDetail]') AND [c].[name] = N'Percent_change_7d');
    IF @var334 IS NOT NULL EXEC(N'ALTER TABLE [CurrencyRateDetail] DROP CONSTRAINT [' + @var334 + '];');
    ALTER TABLE [CurrencyRateDetail] ALTER COLUMN [Percent_change_7d] decimal(18, 2) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190124102311_MarketCapWalletStatasticColumn')
BEGIN
    DECLARE @var335 sysname;
    SELECT @var335 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CurrencyRateDetail]') AND [c].[name] = N'Percent_change_24h');
    IF @var335 IS NOT NULL EXEC(N'ALTER TABLE [CurrencyRateDetail] DROP CONSTRAINT [' + @var335 + '];');
    ALTER TABLE [CurrencyRateDetail] ALTER COLUMN [Percent_change_24h] decimal(18, 2) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190124102311_MarketCapWalletStatasticColumn')
BEGIN
    DECLARE @var336 sysname;
    SELECT @var336 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CurrencyRateDetail]') AND [c].[name] = N'Percent_change_1h');
    IF @var336 IS NOT NULL EXEC(N'ALTER TABLE [CurrencyRateDetail] DROP CONSTRAINT [' + @var336 + '];');
    ALTER TABLE [CurrencyRateDetail] ALTER COLUMN [Percent_change_1h] decimal(18, 2) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190124102311_MarketCapWalletStatasticColumn')
BEGIN
    DECLARE @var337 sysname;
    SELECT @var337 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CurrencyRateDetail]') AND [c].[name] = N'Market_cap');
    IF @var337 IS NOT NULL EXEC(N'ALTER TABLE [CurrencyRateDetail] DROP CONSTRAINT [' + @var337 + '];');
    ALTER TABLE [CurrencyRateDetail] ALTER COLUMN [Market_cap] decimal(18, 2) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190124102311_MarketCapWalletStatasticColumn')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190124102311_MarketCapWalletStatasticColumn', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190124142544_TransactionStatusCheckRequest')
BEGIN
    ALTER TABLE [TransactionQueue] ADD [CallStatus] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190124142544_TransactionStatusCheckRequest')
BEGIN
    DECLARE @var338 sysname;
    SELECT @var338 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CurrencyRateDetail]') AND [c].[name] = N'Volume_24h');
    IF @var338 IS NOT NULL EXEC(N'ALTER TABLE [CurrencyRateDetail] DROP CONSTRAINT [' + @var338 + '];');
    ALTER TABLE [CurrencyRateDetail] ALTER COLUMN [Volume_24h] decimal(25, 10) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190124142544_TransactionStatusCheckRequest')
BEGIN
    DECLARE @var339 sysname;
    SELECT @var339 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CurrencyRateDetail]') AND [c].[name] = N'Price');
    IF @var339 IS NOT NULL EXEC(N'ALTER TABLE [CurrencyRateDetail] DROP CONSTRAINT [' + @var339 + '];');
    ALTER TABLE [CurrencyRateDetail] ALTER COLUMN [Price] decimal(18, 8) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190124142544_TransactionStatusCheckRequest')
BEGIN
    DECLARE @var340 sysname;
    SELECT @var340 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CurrencyRateDetail]') AND [c].[name] = N'Percent_change_7d');
    IF @var340 IS NOT NULL EXEC(N'ALTER TABLE [CurrencyRateDetail] DROP CONSTRAINT [' + @var340 + '];');
    ALTER TABLE [CurrencyRateDetail] ALTER COLUMN [Percent_change_7d] decimal(25, 10) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190124142544_TransactionStatusCheckRequest')
BEGIN
    DECLARE @var341 sysname;
    SELECT @var341 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CurrencyRateDetail]') AND [c].[name] = N'Percent_change_24h');
    IF @var341 IS NOT NULL EXEC(N'ALTER TABLE [CurrencyRateDetail] DROP CONSTRAINT [' + @var341 + '];');
    ALTER TABLE [CurrencyRateDetail] ALTER COLUMN [Percent_change_24h] decimal(25, 10) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190124142544_TransactionStatusCheckRequest')
BEGIN
    DECLARE @var342 sysname;
    SELECT @var342 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CurrencyRateDetail]') AND [c].[name] = N'Percent_change_1h');
    IF @var342 IS NOT NULL EXEC(N'ALTER TABLE [CurrencyRateDetail] DROP CONSTRAINT [' + @var342 + '];');
    ALTER TABLE [CurrencyRateDetail] ALTER COLUMN [Percent_change_1h] decimal(25, 10) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190124142544_TransactionStatusCheckRequest')
BEGIN
    DECLARE @var343 sysname;
    SELECT @var343 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CurrencyRateDetail]') AND [c].[name] = N'Market_cap');
    IF @var343 IS NOT NULL EXEC(N'ALTER TABLE [CurrencyRateDetail] DROP CONSTRAINT [' + @var343 + '];');
    ALTER TABLE [CurrencyRateDetail] ALTER COLUMN [Market_cap] decimal(25, 10) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190124142544_TransactionStatusCheckRequest')
BEGIN
    CREATE TABLE [TransactionStatusCheckRequest] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL,
        [SerProDetailID] bigint NOT NULL,
        [RequestData] nvarchar(max) NULL,
        [ResponseTime] datetime2 NOT NULL,
        [ResponseData] nvarchar(max) NULL,
        [TrnID] nvarchar(max) NULL,
        [OprTrnID] nvarchar(max) NULL,
        CONSTRAINT [PK_TransactionStatusCheckRequest] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190124142544_TransactionStatusCheckRequest')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190124142544_TransactionStatusCheckRequest', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190125052725_ismakertrncharge')
BEGIN
    ALTER TABLE [TrnChargeLog] ADD [IsMaker] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190125052725_ismakertrncharge')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190125052725_ismakertrncharge', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190128073947_AddRegTypeIdinbizuser')
BEGIN
    DECLARE @var344 sysname;
    SELECT @var344 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TrnChargeLog]') AND [c].[name] = N'IsMaker');
    IF @var344 IS NOT NULL EXEC(N'ALTER TABLE [TrnChargeLog] DROP CONSTRAINT [' + @var344 + '];');
    ALTER TABLE [TrnChargeLog] ALTER COLUMN [IsMaker] smallint NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190128073947_AddRegTypeIdinbizuser')
BEGIN
    ALTER TABLE [BizUser] ADD [RegTypeId] int NOT NULL DEFAULT 0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190128073947_AddRegTypeIdinbizuser')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190128073947_AddRegTypeIdinbizuser', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190128103817_removetypeinbizuser')
BEGIN
    DECLARE @var345 sysname;
    SELECT @var345 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[BizUser]') AND [c].[name] = N'RegTypeId');
    IF @var345 IS NOT NULL EXEC(N'ALTER TABLE [BizUser] DROP CONSTRAINT [' + @var345 + '];');
    ALTER TABLE [BizUser] DROP COLUMN [RegTypeId];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190128103817_removetypeinbizuser')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190128103817_removetypeinbizuser', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190128131031_removeColumnITrnnoforStatusCheck')
BEGIN
    ALTER TABLE [WalletAuthorizeUserMaster] DROP CONSTRAINT [AK_WalletAuthorizeUserMaster_Id_UserID_WalletID];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190128131031_removeColumnITrnnoforStatusCheck')
BEGIN
    ALTER TABLE [TransactionStatusCheckRequest] ADD [TrnNo] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190128131031_removeColumnITrnnoforStatusCheck')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190128131031_removeColumnITrnnoforStatusCheck', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190128141008_removetableTransactionStatusCheckRequest')
BEGIN
    DROP TABLE [TransactionStatusCheckRequest];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190128141008_removetableTransactionStatusCheckRequest')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190128141008_removetableTransactionStatusCheckRequest', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190128141228_AddtableTransactionStatusCheckRequest')
BEGIN
    CREATE TABLE [TransactionStatusCheckRequest] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [TrnNo] bigint NOT NULL,
        [SerProDetailID] bigint NOT NULL,
        [RequestData] nvarchar(max) NULL,
        [ResponseTime] datetime2 NOT NULL,
        [ResponseData] nvarchar(max) NULL,
        [TrnID] nvarchar(max) NULL,
        [OprTrnID] nvarchar(max) NULL,
        CONSTRAINT [PK_TransactionStatusCheckRequest] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190128141228_AddtableTransactionStatusCheckRequest')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190128141228_AddtableTransactionStatusCheckRequest', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190129054748_AddresMastersAddcolumnGuid')
BEGIN
    ALTER TABLE [AddressMasters] ADD [GUID] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190129054748_AddresMastersAddcolumnGuid')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190129054748_AddresMastersAddcolumnGuid', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190129112513_WalletMastersAddColumnIsLocal')
BEGIN
    ALTER TABLE [WalletTypeMasters] ADD [IsLocal] smallint NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190129112513_WalletMastersAddColumnIsLocal')
BEGIN
    ALTER TABLE [TokenStakingHistory] ADD [DeductionAmount] decimal(18, 8) NOT NULL DEFAULT 0.0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190129112513_WalletMastersAddColumnIsLocal')
BEGIN
    ALTER TABLE [RouteConfiguration] ADD [GasLimit] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190129112513_WalletMastersAddColumnIsLocal')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190129112513_WalletMastersAddColumnIsLocal', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190130072605_AddColumnRequestTypeTableRequestFormatmaster')
BEGIN
    ALTER TABLE [RequestFormatMaster] ADD [RequestType] nvarchar(500) NOT NULL DEFAULT N'';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190130072605_AddColumnRequestTypeTableRequestFormatmaster')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190130072605_AddColumnRequestTypeTableRequestFormatmaster', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190130121355_APINewColumnsInTQ')
BEGIN
    ALTER TABLE [TradeTransactionQueue] ADD [APIStatus] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190130121355_APINewColumnsInTQ')
BEGIN
    ALTER TABLE [TradeTransactionQueue] ADD [IsAPICancelled] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190130121355_APINewColumnsInTQ')
BEGIN
    ALTER TABLE [TradeTransactionQueue] ADD [IsAPITrade] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190130121355_APINewColumnsInTQ')
BEGIN
    ALTER TABLE [TradeTransactionQueue] ADD [IsExpired] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190130121355_APINewColumnsInTQ')
BEGIN
    ALTER TABLE [TradeSellerListV1] ADD [IsAPITrade] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190130121355_APINewColumnsInTQ')
BEGIN
    ALTER TABLE [TradeBuyerListV1] ADD [IsAPITrade] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190130121355_APINewColumnsInTQ')
BEGIN
    CREATE TABLE [WalletTrnLimitConfiguration] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [TrnType] bigint NOT NULL,
        [WalletType] bigint NOT NULL,
        [StartTime] float NOT NULL,
        [EndTime] float NOT NULL,
        [DailyTrnCount] bigint NOT NULL,
        [DailyTrnAmount] decimal(28, 18) NOT NULL,
        [MonthlyTrnCount] bigint NOT NULL,
        [MonthlyTrnAmount] decimal(28, 18) NOT NULL,
        [WeeklyTrnCount] bigint NOT NULL,
        [WeeklyTrnAmount] decimal(28, 18) NOT NULL,
        [YearlyTrnCount] bigint NOT NULL,
        [YearlyTrnAmount] decimal(28, 18) NOT NULL,
        [MinAmount] decimal(28, 18) NOT NULL,
        [MaxAmount] decimal(28, 18) NOT NULL,
        CONSTRAINT [PK_WalletTrnLimitConfiguration] PRIMARY KEY ([TrnType], [WalletType])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190130121355_APINewColumnsInTQ')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190130121355_APINewColumnsInTQ', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190130130831_WithdrawERCTokenQueue')
BEGIN
    CREATE TABLE [WithdrawERCTokenQueue] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [TrnNo] bigint NOT NULL,
        [TrnRefNo] nvarchar(max) NULL,
        [AdminAddress] nvarchar(max) NULL,
        [AddressId] bigint NOT NULL,
        CONSTRAINT [PK_WithdrawERCTokenQueue] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190130130831_WithdrawERCTokenQueue')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190130130831_WithdrawERCTokenQueue', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var346 sysname;
    SELECT @var346 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WithdrawHistory]') AND [c].[name] = N'Amount');
    IF @var346 IS NOT NULL EXEC(N'ALTER TABLE [WithdrawHistory] DROP CONSTRAINT [' + @var346 + '];');
    ALTER TABLE [WithdrawHistory] ALTER COLUMN [Amount] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var347 sysname;
    SELECT @var347 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletUsagePolicy]') AND [c].[name] = N'YearlyTrnAmount');
    IF @var347 IS NOT NULL EXEC(N'ALTER TABLE [WalletUsagePolicy] DROP CONSTRAINT [' + @var347 + '];');
    ALTER TABLE [WalletUsagePolicy] ALTER COLUMN [YearlyTrnAmount] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var348 sysname;
    SELECT @var348 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletUsagePolicy]') AND [c].[name] = N'WeeklyTrnAmount');
    IF @var348 IS NOT NULL EXEC(N'ALTER TABLE [WalletUsagePolicy] DROP CONSTRAINT [' + @var348 + '];');
    ALTER TABLE [WalletUsagePolicy] ALTER COLUMN [WeeklyTrnAmount] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var349 sysname;
    SELECT @var349 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletUsagePolicy]') AND [c].[name] = N'MonthlyTrnAmount');
    IF @var349 IS NOT NULL EXEC(N'ALTER TABLE [WalletUsagePolicy] DROP CONSTRAINT [' + @var349 + '];');
    ALTER TABLE [WalletUsagePolicy] ALTER COLUMN [MonthlyTrnAmount] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var350 sysname;
    SELECT @var350 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletUsagePolicy]') AND [c].[name] = N'MinAmount');
    IF @var350 IS NOT NULL EXEC(N'ALTER TABLE [WalletUsagePolicy] DROP CONSTRAINT [' + @var350 + '];');
    ALTER TABLE [WalletUsagePolicy] ALTER COLUMN [MinAmount] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var351 sysname;
    SELECT @var351 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletUsagePolicy]') AND [c].[name] = N'MaxAmount');
    IF @var351 IS NOT NULL EXEC(N'ALTER TABLE [WalletUsagePolicy] DROP CONSTRAINT [' + @var351 + '];');
    ALTER TABLE [WalletUsagePolicy] ALTER COLUMN [MaxAmount] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var352 sysname;
    SELECT @var352 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletUsagePolicy]') AND [c].[name] = N'LifeTimeTrnAmount');
    IF @var352 IS NOT NULL EXEC(N'ALTER TABLE [WalletUsagePolicy] DROP CONSTRAINT [' + @var352 + '];');
    ALTER TABLE [WalletUsagePolicy] ALTER COLUMN [LifeTimeTrnAmount] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var353 sysname;
    SELECT @var353 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletUsagePolicy]') AND [c].[name] = N'HourlyTrnAmount');
    IF @var353 IS NOT NULL EXEC(N'ALTER TABLE [WalletUsagePolicy] DROP CONSTRAINT [' + @var353 + '];');
    ALTER TABLE [WalletUsagePolicy] ALTER COLUMN [HourlyTrnAmount] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var354 sysname;
    SELECT @var354 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletUsagePolicy]') AND [c].[name] = N'DailyTrnAmount');
    IF @var354 IS NOT NULL EXEC(N'ALTER TABLE [WalletUsagePolicy] DROP CONSTRAINT [' + @var354 + '];');
    ALTER TABLE [WalletUsagePolicy] ALTER COLUMN [DailyTrnAmount] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var355 sysname;
    SELECT @var355 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletTransactionQueues]') AND [c].[name] = N'SettedAmt');
    IF @var355 IS NOT NULL EXEC(N'ALTER TABLE [WalletTransactionQueues] DROP CONSTRAINT [' + @var355 + '];');
    ALTER TABLE [WalletTransactionQueues] ALTER COLUMN [SettedAmt] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var356 sysname;
    SELECT @var356 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletTransactionQueues]') AND [c].[name] = N'HoldChargeAmount');
    IF @var356 IS NOT NULL EXEC(N'ALTER TABLE [WalletTransactionQueues] DROP CONSTRAINT [' + @var356 + '];');
    ALTER TABLE [WalletTransactionQueues] ALTER COLUMN [HoldChargeAmount] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var357 sysname;
    SELECT @var357 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletTransactionQueues]') AND [c].[name] = N'DeductedChargeAmount');
    IF @var357 IS NOT NULL EXEC(N'ALTER TABLE [WalletTransactionQueues] DROP CONSTRAINT [' + @var357 + '];');
    ALTER TABLE [WalletTransactionQueues] ALTER COLUMN [DeductedChargeAmount] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var358 sysname;
    SELECT @var358 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletTransactionQueues]') AND [c].[name] = N'Amount');
    IF @var358 IS NOT NULL EXEC(N'ALTER TABLE [WalletTransactionQueues] DROP CONSTRAINT [' + @var358 + '];');
    ALTER TABLE [WalletTransactionQueues] ALTER COLUMN [Amount] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var359 sysname;
    SELECT @var359 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletTransactionOrders]') AND [c].[name] = N'ChargeAmount');
    IF @var359 IS NOT NULL EXEC(N'ALTER TABLE [WalletTransactionOrders] DROP CONSTRAINT [' + @var359 + '];');
    ALTER TABLE [WalletTransactionOrders] ALTER COLUMN [ChargeAmount] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var360 sysname;
    SELECT @var360 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletTransactionOrders]') AND [c].[name] = N'Amount');
    IF @var360 IS NOT NULL EXEC(N'ALTER TABLE [WalletTransactionOrders] DROP CONSTRAINT [' + @var360 + '];');
    ALTER TABLE [WalletTransactionOrders] ALTER COLUMN [Amount] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var361 sysname;
    SELECT @var361 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletOrders]') AND [c].[name] = N'OrderAmt');
    IF @var361 IS NOT NULL EXEC(N'ALTER TABLE [WalletOrders] DROP CONSTRAINT [' + @var361 + '];');
    ALTER TABLE [WalletOrders] ALTER COLUMN [OrderAmt] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var362 sysname;
    SELECT @var362 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletOrders]') AND [c].[name] = N'DeliveryAmt');
    IF @var362 IS NOT NULL EXEC(N'ALTER TABLE [WalletOrders] DROP CONSTRAINT [' + @var362 + '];');
    ALTER TABLE [WalletOrders] ALTER COLUMN [DeliveryAmt] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var363 sysname;
    SELECT @var363 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletMasters]') AND [c].[name] = N'OutBoundBalance');
    IF @var363 IS NOT NULL EXEC(N'ALTER TABLE [WalletMasters] DROP CONSTRAINT [' + @var363 + '];');
    ALTER TABLE [WalletMasters] ALTER COLUMN [OutBoundBalance] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var364 sysname;
    SELECT @var364 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletMasters]') AND [c].[name] = N'InBoundBalance');
    IF @var364 IS NOT NULL EXEC(N'ALTER TABLE [WalletMasters] DROP CONSTRAINT [' + @var364 + '];');
    ALTER TABLE [WalletMasters] ALTER COLUMN [InBoundBalance] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var365 sysname;
    SELECT @var365 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletMasters]') AND [c].[name] = N'Balance');
    IF @var365 IS NOT NULL EXEC(N'ALTER TABLE [WalletMasters] DROP CONSTRAINT [' + @var365 + '];');
    ALTER TABLE [WalletMasters] ALTER COLUMN [Balance] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var366 sysname;
    SELECT @var366 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletLimitConfigurationMaster]') AND [c].[name] = N'LimitPerTransaction');
    IF @var366 IS NOT NULL EXEC(N'ALTER TABLE [WalletLimitConfigurationMaster] DROP CONSTRAINT [' + @var366 + '];');
    ALTER TABLE [WalletLimitConfigurationMaster] ALTER COLUMN [LimitPerTransaction] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var367 sysname;
    SELECT @var367 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletLimitConfigurationMaster]') AND [c].[name] = N'LimitPerHour');
    IF @var367 IS NOT NULL EXEC(N'ALTER TABLE [WalletLimitConfigurationMaster] DROP CONSTRAINT [' + @var367 + '];');
    ALTER TABLE [WalletLimitConfigurationMaster] ALTER COLUMN [LimitPerHour] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var368 sysname;
    SELECT @var368 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletLimitConfigurationMaster]') AND [c].[name] = N'LimitPerDay');
    IF @var368 IS NOT NULL EXEC(N'ALTER TABLE [WalletLimitConfigurationMaster] DROP CONSTRAINT [' + @var368 + '];');
    ALTER TABLE [WalletLimitConfigurationMaster] ALTER COLUMN [LimitPerDay] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var369 sysname;
    SELECT @var369 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletLimitConfiguration]') AND [c].[name] = N'LimitPerTransaction');
    IF @var369 IS NOT NULL EXEC(N'ALTER TABLE [WalletLimitConfiguration] DROP CONSTRAINT [' + @var369 + '];');
    ALTER TABLE [WalletLimitConfiguration] ALTER COLUMN [LimitPerTransaction] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var370 sysname;
    SELECT @var370 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletLimitConfiguration]') AND [c].[name] = N'LimitPerHour');
    IF @var370 IS NOT NULL EXEC(N'ALTER TABLE [WalletLimitConfiguration] DROP CONSTRAINT [' + @var370 + '];');
    ALTER TABLE [WalletLimitConfiguration] ALTER COLUMN [LimitPerHour] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var371 sysname;
    SELECT @var371 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletLimitConfiguration]') AND [c].[name] = N'LimitPerDay');
    IF @var371 IS NOT NULL EXEC(N'ALTER TABLE [WalletLimitConfiguration] DROP CONSTRAINT [' + @var371 + '];');
    ALTER TABLE [WalletLimitConfiguration] ALTER COLUMN [LimitPerDay] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var372 sysname;
    SELECT @var372 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletLedgers]') AND [c].[name] = N'PreBal');
    IF @var372 IS NOT NULL EXEC(N'ALTER TABLE [WalletLedgers] DROP CONSTRAINT [' + @var372 + '];');
    ALTER TABLE [WalletLedgers] ALTER COLUMN [PreBal] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var373 sysname;
    SELECT @var373 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletLedgers]') AND [c].[name] = N'PostBal');
    IF @var373 IS NOT NULL EXEC(N'ALTER TABLE [WalletLedgers] DROP CONSTRAINT [' + @var373 + '];');
    ALTER TABLE [WalletLedgers] ALTER COLUMN [PostBal] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var374 sysname;
    SELECT @var374 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletLedgers]') AND [c].[name] = N'DrAmt');
    IF @var374 IS NOT NULL EXEC(N'ALTER TABLE [WalletLedgers] DROP CONSTRAINT [' + @var374 + '];');
    ALTER TABLE [WalletLedgers] ALTER COLUMN [DrAmt] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var375 sysname;
    SELECT @var375 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletLedgers]') AND [c].[name] = N'CrAmt');
    IF @var375 IS NOT NULL EXEC(N'ALTER TABLE [WalletLedgers] DROP CONSTRAINT [' + @var375 + '];');
    ALTER TABLE [WalletLedgers] ALTER COLUMN [CrAmt] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var376 sysname;
    SELECT @var376 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[UserWalletMaster]') AND [c].[name] = N'Balance');
    IF @var376 IS NOT NULL EXEC(N'ALTER TABLE [UserWalletMaster] DROP CONSTRAINT [' + @var376 + '];');
    ALTER TABLE [UserWalletMaster] ALTER COLUMN [Balance] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var377 sysname;
    SELECT @var377 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[UserStacking]') AND [c].[name] = N'StackingAmount');
    IF @var377 IS NOT NULL EXEC(N'ALTER TABLE [UserStacking] DROP CONSTRAINT [' + @var377 + '];');
    ALTER TABLE [UserStacking] ALTER COLUMN [StackingAmount] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var378 sysname;
    SELECT @var378 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TrnChargeLog]') AND [c].[name] = N'TakerCharge');
    IF @var378 IS NOT NULL EXEC(N'ALTER TABLE [TrnChargeLog] DROP CONSTRAINT [' + @var378 + '];');
    ALTER TABLE [TrnChargeLog] ALTER COLUMN [TakerCharge] decimal(28, 18) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var379 sysname;
    SELECT @var379 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TrnChargeLog]') AND [c].[name] = N'MakerCharge');
    IF @var379 IS NOT NULL EXEC(N'ALTER TABLE [TrnChargeLog] DROP CONSTRAINT [' + @var379 + '];');
    ALTER TABLE [TrnChargeLog] ALTER COLUMN [MakerCharge] decimal(28, 18) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var380 sysname;
    SELECT @var380 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TrnChargeLog]') AND [c].[name] = N'Charge');
    IF @var380 IS NOT NULL EXEC(N'ALTER TABLE [TrnChargeLog] DROP CONSTRAINT [' + @var380 + '];');
    ALTER TABLE [TrnChargeLog] ALTER COLUMN [Charge] decimal(28, 18) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var381 sysname;
    SELECT @var381 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TrnChargeLog]') AND [c].[name] = N'Amount');
    IF @var381 IS NOT NULL EXEC(N'ALTER TABLE [TrnChargeLog] DROP CONSTRAINT [' + @var381 + '];');
    ALTER TABLE [TrnChargeLog] ALTER COLUMN [Amount] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var382 sysname;
    SELECT @var382 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TransactionQueue]') AND [c].[name] = N'ChargeRs');
    IF @var382 IS NOT NULL EXEC(N'ALTER TABLE [TransactionQueue] DROP CONSTRAINT [' + @var382 + '];');
    ALTER TABLE [TransactionQueue] ALTER COLUMN [ChargeRs] decimal(28, 18) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var383 sysname;
    SELECT @var383 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TransactionQueue]') AND [c].[name] = N'ChargePer');
    IF @var383 IS NOT NULL EXEC(N'ALTER TABLE [TransactionQueue] DROP CONSTRAINT [' + @var383 + '];');
    ALTER TABLE [TransactionQueue] ALTER COLUMN [ChargePer] decimal(28, 18) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var384 sysname;
    SELECT @var384 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TransactionQueue]') AND [c].[name] = N'Amount');
    IF @var384 IS NOT NULL EXEC(N'ALTER TABLE [TransactionQueue] DROP CONSTRAINT [' + @var384 + '];');
    ALTER TABLE [TransactionQueue] ALTER COLUMN [Amount] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var385 sysname;
    SELECT @var385 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TransactionPolicy]') AND [c].[name] = N'YearlyTrnAmount');
    IF @var385 IS NOT NULL EXEC(N'ALTER TABLE [TransactionPolicy] DROP CONSTRAINT [' + @var385 + '];');
    ALTER TABLE [TransactionPolicy] ALTER COLUMN [YearlyTrnAmount] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var386 sysname;
    SELECT @var386 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TransactionPolicy]') AND [c].[name] = N'WeeklyTrnAmount');
    IF @var386 IS NOT NULL EXEC(N'ALTER TABLE [TransactionPolicy] DROP CONSTRAINT [' + @var386 + '];');
    ALTER TABLE [TransactionPolicy] ALTER COLUMN [WeeklyTrnAmount] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var387 sysname;
    SELECT @var387 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TransactionPolicy]') AND [c].[name] = N'MonthlyTrnAmount');
    IF @var387 IS NOT NULL EXEC(N'ALTER TABLE [TransactionPolicy] DROP CONSTRAINT [' + @var387 + '];');
    ALTER TABLE [TransactionPolicy] ALTER COLUMN [MonthlyTrnAmount] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var388 sysname;
    SELECT @var388 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TransactionPolicy]') AND [c].[name] = N'MinAmount');
    IF @var388 IS NOT NULL EXEC(N'ALTER TABLE [TransactionPolicy] DROP CONSTRAINT [' + @var388 + '];');
    ALTER TABLE [TransactionPolicy] ALTER COLUMN [MinAmount] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var389 sysname;
    SELECT @var389 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TransactionPolicy]') AND [c].[name] = N'MaxAmount');
    IF @var389 IS NOT NULL EXEC(N'ALTER TABLE [TransactionPolicy] DROP CONSTRAINT [' + @var389 + '];');
    ALTER TABLE [TransactionPolicy] ALTER COLUMN [MaxAmount] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var390 sysname;
    SELECT @var390 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TransactionPolicy]') AND [c].[name] = N'DailyTrnAmount');
    IF @var390 IS NOT NULL EXEC(N'ALTER TABLE [TransactionPolicy] DROP CONSTRAINT [' + @var390 + '];');
    ALTER TABLE [TransactionPolicy] ALTER COLUMN [DailyTrnAmount] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var391 sysname;
    SELECT @var391 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TransactionAccounts]') AND [c].[name] = N'DrAmt');
    IF @var391 IS NOT NULL EXEC(N'ALTER TABLE [TransactionAccounts] DROP CONSTRAINT [' + @var391 + '];');
    ALTER TABLE [TransactionAccounts] ALTER COLUMN [DrAmt] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var392 sysname;
    SELECT @var392 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TransactionAccounts]') AND [c].[name] = N'CrAmt');
    IF @var392 IS NOT NULL EXEC(N'ALTER TABLE [TransactionAccounts] DROP CONSTRAINT [' + @var392 + '];');
    ALTER TABLE [TransactionAccounts] ALTER COLUMN [CrAmt] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var393 sysname;
    SELECT @var393 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeTransactionStatus]') AND [c].[name] = N'TotalQty');
    IF @var393 IS NOT NULL EXEC(N'ALTER TABLE [TradeTransactionStatus] DROP CONSTRAINT [' + @var393 + '];');
    ALTER TABLE [TradeTransactionStatus] ALTER COLUMN [TotalQty] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var394 sysname;
    SELECT @var394 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeTransactionStatus]') AND [c].[name] = N'SoldPrice');
    IF @var394 IS NOT NULL EXEC(N'ALTER TABLE [TradeTransactionStatus] DROP CONSTRAINT [' + @var394 + '];');
    ALTER TABLE [TradeTransactionStatus] ALTER COLUMN [SoldPrice] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var395 sysname;
    SELECT @var395 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeTransactionStatus]') AND [c].[name] = N'SettledQty');
    IF @var395 IS NOT NULL EXEC(N'ALTER TABLE [TradeTransactionStatus] DROP CONSTRAINT [' + @var395 + '];');
    ALTER TABLE [TradeTransactionStatus] ALTER COLUMN [SettledQty] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var396 sysname;
    SELECT @var396 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeTransactionStatus]') AND [c].[name] = N'PendingQty');
    IF @var396 IS NOT NULL EXEC(N'ALTER TABLE [TradeTransactionStatus] DROP CONSTRAINT [' + @var396 + '];');
    ALTER TABLE [TradeTransactionStatus] ALTER COLUMN [PendingQty] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var397 sysname;
    SELECT @var397 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeTransactionStatus]') AND [c].[name] = N'DeliveredQty');
    IF @var397 IS NOT NULL EXEC(N'ALTER TABLE [TradeTransactionStatus] DROP CONSTRAINT [' + @var397 + '];');
    ALTER TABLE [TradeTransactionStatus] ALTER COLUMN [DeliveredQty] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var398 sysname;
    SELECT @var398 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeTransactionStatus]') AND [c].[name] = N'BidPrice');
    IF @var398 IS NOT NULL EXEC(N'ALTER TABLE [TradeTransactionStatus] DROP CONSTRAINT [' + @var398 + '];');
    ALTER TABLE [TradeTransactionStatus] ALTER COLUMN [BidPrice] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var399 sysname;
    SELECT @var399 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeTransactionQueue]') AND [c].[name] = N'SettledSellQty');
    IF @var399 IS NOT NULL EXEC(N'ALTER TABLE [TradeTransactionQueue] DROP CONSTRAINT [' + @var399 + '];');
    ALTER TABLE [TradeTransactionQueue] ALTER COLUMN [SettledSellQty] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var400 sysname;
    SELECT @var400 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeTransactionQueue]') AND [c].[name] = N'SettledBuyQty');
    IF @var400 IS NOT NULL EXEC(N'ALTER TABLE [TradeTransactionQueue] DROP CONSTRAINT [' + @var400 + '];');
    ALTER TABLE [TradeTransactionQueue] ALTER COLUMN [SettledBuyQty] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var401 sysname;
    SELECT @var401 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeTransactionQueue]') AND [c].[name] = N'SellQty');
    IF @var401 IS NOT NULL EXEC(N'ALTER TABLE [TradeTransactionQueue] DROP CONSTRAINT [' + @var401 + '];');
    ALTER TABLE [TradeTransactionQueue] ALTER COLUMN [SellQty] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var402 sysname;
    SELECT @var402 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeTransactionQueue]') AND [c].[name] = N'OrderTotalQty');
    IF @var402 IS NOT NULL EXEC(N'ALTER TABLE [TradeTransactionQueue] DROP CONSTRAINT [' + @var402 + '];');
    ALTER TABLE [TradeTransactionQueue] ALTER COLUMN [OrderTotalQty] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var403 sysname;
    SELECT @var403 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeTransactionQueue]') AND [c].[name] = N'DeliveryTotalQty');
    IF @var403 IS NOT NULL EXEC(N'ALTER TABLE [TradeTransactionQueue] DROP CONSTRAINT [' + @var403 + '];');
    ALTER TABLE [TradeTransactionQueue] ALTER COLUMN [DeliveryTotalQty] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var404 sysname;
    SELECT @var404 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeTransactionQueue]') AND [c].[name] = N'BuyQty');
    IF @var404 IS NOT NULL EXEC(N'ALTER TABLE [TradeTransactionQueue] DROP CONSTRAINT [' + @var404 + '];');
    ALTER TABLE [TradeTransactionQueue] ALTER COLUMN [BuyQty] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var405 sysname;
    SELECT @var405 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeTransactionQueue]') AND [c].[name] = N'BidPrice');
    IF @var405 IS NOT NULL EXEC(N'ALTER TABLE [TradeTransactionQueue] DROP CONSTRAINT [' + @var405 + '];');
    ALTER TABLE [TradeTransactionQueue] ALTER COLUMN [BidPrice] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var406 sysname;
    SELECT @var406 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeTransactionQueue]') AND [c].[name] = N'AskPrice');
    IF @var406 IS NOT NULL EXEC(N'ALTER TABLE [TradeTransactionQueue] DROP CONSTRAINT [' + @var406 + '];');
    ALTER TABLE [TradeTransactionQueue] ALTER COLUMN [AskPrice] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var407 sysname;
    SELECT @var407 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeStopLoss]') AND [c].[name] = N'StopPrice');
    IF @var407 IS NOT NULL EXEC(N'ALTER TABLE [TradeStopLoss] DROP CONSTRAINT [' + @var407 + '];');
    ALTER TABLE [TradeStopLoss] ALTER COLUMN [StopPrice] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var408 sysname;
    SELECT @var408 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeStopLoss]') AND [c].[name] = N'RangeMin');
    IF @var408 IS NOT NULL EXEC(N'ALTER TABLE [TradeStopLoss] DROP CONSTRAINT [' + @var408 + '];');
    ALTER TABLE [TradeStopLoss] ALTER COLUMN [RangeMin] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var409 sysname;
    SELECT @var409 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeStopLoss]') AND [c].[name] = N'RangeMax');
    IF @var409 IS NOT NULL EXEC(N'ALTER TABLE [TradeStopLoss] DROP CONSTRAINT [' + @var409 + '];');
    ALTER TABLE [TradeStopLoss] ALTER COLUMN [RangeMax] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var410 sysname;
    SELECT @var410 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeStopLoss]') AND [c].[name] = N'LTP');
    IF @var410 IS NOT NULL EXEC(N'ALTER TABLE [TradeStopLoss] DROP CONSTRAINT [' + @var410 + '];');
    ALTER TABLE [TradeStopLoss] ALTER COLUMN [LTP] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var411 sysname;
    SELECT @var411 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeSellerListV1]') AND [c].[name] = N'SelledQty');
    IF @var411 IS NOT NULL EXEC(N'ALTER TABLE [TradeSellerListV1] DROP CONSTRAINT [' + @var411 + '];');
    ALTER TABLE [TradeSellerListV1] ALTER COLUMN [SelledQty] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var412 sysname;
    SELECT @var412 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeSellerListV1]') AND [c].[name] = N'RemainQty');
    IF @var412 IS NOT NULL EXEC(N'ALTER TABLE [TradeSellerListV1] DROP CONSTRAINT [' + @var412 + '];');
    ALTER TABLE [TradeSellerListV1] ALTER COLUMN [RemainQty] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var413 sysname;
    SELECT @var413 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeSellerListV1]') AND [c].[name] = N'ReleasedQty');
    IF @var413 IS NOT NULL EXEC(N'ALTER TABLE [TradeSellerListV1] DROP CONSTRAINT [' + @var413 + '];');
    ALTER TABLE [TradeSellerListV1] ALTER COLUMN [ReleasedQty] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var414 sysname;
    SELECT @var414 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeSellerListV1]') AND [c].[name] = N'Qty');
    IF @var414 IS NOT NULL EXEC(N'ALTER TABLE [TradeSellerListV1] DROP CONSTRAINT [' + @var414 + '];');
    ALTER TABLE [TradeSellerListV1] ALTER COLUMN [Qty] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var415 sysname;
    SELECT @var415 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeSellerListV1]') AND [c].[name] = N'Price');
    IF @var415 IS NOT NULL EXEC(N'ALTER TABLE [TradeSellerListV1] DROP CONSTRAINT [' + @var415 + '];');
    ALTER TABLE [TradeSellerListV1] ALTER COLUMN [Price] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var416 sysname;
    SELECT @var416 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeSellerList]') AND [c].[name] = N'RemainQty');
    IF @var416 IS NOT NULL EXEC(N'ALTER TABLE [TradeSellerList] DROP CONSTRAINT [' + @var416 + '];');
    ALTER TABLE [TradeSellerList] ALTER COLUMN [RemainQty] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var417 sysname;
    SELECT @var417 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeSellerList]') AND [c].[name] = N'Qty');
    IF @var417 IS NOT NULL EXEC(N'ALTER TABLE [TradeSellerList] DROP CONSTRAINT [' + @var417 + '];');
    ALTER TABLE [TradeSellerList] ALTER COLUMN [Qty] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    DECLARE @var418 sysname;
    SELECT @var418 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeSellerList]') AND [c].[name] = N'Price');
    IF @var418 IS NOT NULL EXEC(N'ALTER TABLE [TradeSellerList] DROP CONSTRAINT [' + @var418 + '];');
    ALTER TABLE [TradeSellerList] ALTER COLUMN [Price] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131105448_DecimalPointChange')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190131105448_DecimalPointChange', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131110732_DecimalPointChangeV2')
BEGIN
    DECLARE @var419 sysname;
    SELECT @var419 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradePoolQueueV1]') AND [c].[name] = N'TakerQty');
    IF @var419 IS NOT NULL EXEC(N'ALTER TABLE [TradePoolQueueV1] DROP CONSTRAINT [' + @var419 + '];');
    ALTER TABLE [TradePoolQueueV1] ALTER COLUMN [TakerQty] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131110732_DecimalPointChangeV2')
BEGIN
    DECLARE @var420 sysname;
    SELECT @var420 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradePoolQueueV1]') AND [c].[name] = N'TakerPrice');
    IF @var420 IS NOT NULL EXEC(N'ALTER TABLE [TradePoolQueueV1] DROP CONSTRAINT [' + @var420 + '];');
    ALTER TABLE [TradePoolQueueV1] ALTER COLUMN [TakerPrice] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131110732_DecimalPointChangeV2')
BEGIN
    DECLARE @var421 sysname;
    SELECT @var421 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradePoolQueueV1]') AND [c].[name] = N'TakerLoss');
    IF @var421 IS NOT NULL EXEC(N'ALTER TABLE [TradePoolQueueV1] DROP CONSTRAINT [' + @var421 + '];');
    ALTER TABLE [TradePoolQueueV1] ALTER COLUMN [TakerLoss] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131110732_DecimalPointChangeV2')
BEGIN
    DECLARE @var422 sysname;
    SELECT @var422 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradePoolQueueV1]') AND [c].[name] = N'TakerDisc');
    IF @var422 IS NOT NULL EXEC(N'ALTER TABLE [TradePoolQueueV1] DROP CONSTRAINT [' + @var422 + '];');
    ALTER TABLE [TradePoolQueueV1] ALTER COLUMN [TakerDisc] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131110732_DecimalPointChangeV2')
BEGIN
    DECLARE @var423 sysname;
    SELECT @var423 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradePoolQueueV1]') AND [c].[name] = N'MakerQty');
    IF @var423 IS NOT NULL EXEC(N'ALTER TABLE [TradePoolQueueV1] DROP CONSTRAINT [' + @var423 + '];');
    ALTER TABLE [TradePoolQueueV1] ALTER COLUMN [MakerQty] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131110732_DecimalPointChangeV2')
BEGIN
    DECLARE @var424 sysname;
    SELECT @var424 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradePoolQueueV1]') AND [c].[name] = N'MakerPrice');
    IF @var424 IS NOT NULL EXEC(N'ALTER TABLE [TradePoolQueueV1] DROP CONSTRAINT [' + @var424 + '];');
    ALTER TABLE [TradePoolQueueV1] ALTER COLUMN [MakerPrice] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131110732_DecimalPointChangeV2')
BEGIN
    DECLARE @var425 sysname;
    SELECT @var425 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradePoolQueue]') AND [c].[name] = N'TakerQty');
    IF @var425 IS NOT NULL EXEC(N'ALTER TABLE [TradePoolQueue] DROP CONSTRAINT [' + @var425 + '];');
    ALTER TABLE [TradePoolQueue] ALTER COLUMN [TakerQty] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131110732_DecimalPointChangeV2')
BEGIN
    DECLARE @var426 sysname;
    SELECT @var426 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradePoolQueue]') AND [c].[name] = N'TakerPrice');
    IF @var426 IS NOT NULL EXEC(N'ALTER TABLE [TradePoolQueue] DROP CONSTRAINT [' + @var426 + '];');
    ALTER TABLE [TradePoolQueue] ALTER COLUMN [TakerPrice] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131110732_DecimalPointChangeV2')
BEGIN
    DECLARE @var427 sysname;
    SELECT @var427 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradePoolQueue]') AND [c].[name] = N'TakerLoss');
    IF @var427 IS NOT NULL EXEC(N'ALTER TABLE [TradePoolQueue] DROP CONSTRAINT [' + @var427 + '];');
    ALTER TABLE [TradePoolQueue] ALTER COLUMN [TakerLoss] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131110732_DecimalPointChangeV2')
BEGIN
    DECLARE @var428 sysname;
    SELECT @var428 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradePoolQueue]') AND [c].[name] = N'TakerDisc');
    IF @var428 IS NOT NULL EXEC(N'ALTER TABLE [TradePoolQueue] DROP CONSTRAINT [' + @var428 + '];');
    ALTER TABLE [TradePoolQueue] ALTER COLUMN [TakerDisc] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131110732_DecimalPointChangeV2')
BEGIN
    DECLARE @var429 sysname;
    SELECT @var429 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradePoolQueue]') AND [c].[name] = N'MakerQty');
    IF @var429 IS NOT NULL EXEC(N'ALTER TABLE [TradePoolQueue] DROP CONSTRAINT [' + @var429 + '];');
    ALTER TABLE [TradePoolQueue] ALTER COLUMN [MakerQty] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131110732_DecimalPointChangeV2')
BEGIN
    DECLARE @var430 sysname;
    SELECT @var430 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradePoolQueue]') AND [c].[name] = N'MakerPrice');
    IF @var430 IS NOT NULL EXEC(N'ALTER TABLE [TradePoolQueue] DROP CONSTRAINT [' + @var430 + '];');
    ALTER TABLE [TradePoolQueue] ALTER COLUMN [MakerPrice] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131110732_DecimalPointChangeV2')
BEGIN
    DECLARE @var431 sysname;
    SELECT @var431 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradePairStastics]') AND [c].[name] = N'LowWeek');
    IF @var431 IS NOT NULL EXEC(N'ALTER TABLE [TradePairStastics] DROP CONSTRAINT [' + @var431 + '];');
    ALTER TABLE [TradePairStastics] ALTER COLUMN [LowWeek] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131110732_DecimalPointChangeV2')
BEGIN
    DECLARE @var432 sysname;
    SELECT @var432 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradePairStastics]') AND [c].[name] = N'Low52Week');
    IF @var432 IS NOT NULL EXEC(N'ALTER TABLE [TradePairStastics] DROP CONSTRAINT [' + @var432 + '];');
    ALTER TABLE [TradePairStastics] ALTER COLUMN [Low52Week] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131110732_DecimalPointChangeV2')
BEGIN
    DECLARE @var433 sysname;
    SELECT @var433 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradePairStastics]') AND [c].[name] = N'Low24Hr');
    IF @var433 IS NOT NULL EXEC(N'ALTER TABLE [TradePairStastics] DROP CONSTRAINT [' + @var433 + '];');
    ALTER TABLE [TradePairStastics] ALTER COLUMN [Low24Hr] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131110732_DecimalPointChangeV2')
BEGIN
    DECLARE @var434 sysname;
    SELECT @var434 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradePairStastics]') AND [c].[name] = N'LTP');
    IF @var434 IS NOT NULL EXEC(N'ALTER TABLE [TradePairStastics] DROP CONSTRAINT [' + @var434 + '];');
    ALTER TABLE [TradePairStastics] ALTER COLUMN [LTP] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131110732_DecimalPointChangeV2')
BEGIN
    DECLARE @var435 sysname;
    SELECT @var435 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradePairStastics]') AND [c].[name] = N'HighWeek');
    IF @var435 IS NOT NULL EXEC(N'ALTER TABLE [TradePairStastics] DROP CONSTRAINT [' + @var435 + '];');
    ALTER TABLE [TradePairStastics] ALTER COLUMN [HighWeek] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131110732_DecimalPointChangeV2')
BEGIN
    DECLARE @var436 sysname;
    SELECT @var436 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradePairStastics]') AND [c].[name] = N'High52Week');
    IF @var436 IS NOT NULL EXEC(N'ALTER TABLE [TradePairStastics] DROP CONSTRAINT [' + @var436 + '];');
    ALTER TABLE [TradePairStastics] ALTER COLUMN [High52Week] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131110732_DecimalPointChangeV2')
BEGIN
    DECLARE @var437 sysname;
    SELECT @var437 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradePairStastics]') AND [c].[name] = N'High24Hr');
    IF @var437 IS NOT NULL EXEC(N'ALTER TABLE [TradePairStastics] DROP CONSTRAINT [' + @var437 + '];');
    ALTER TABLE [TradePairStastics] ALTER COLUMN [High24Hr] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131110732_DecimalPointChangeV2')
BEGIN
    DECLARE @var438 sysname;
    SELECT @var438 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradePairStastics]') AND [c].[name] = N'CurrentRate');
    IF @var438 IS NOT NULL EXEC(N'ALTER TABLE [TradePairStastics] DROP CONSTRAINT [' + @var438 + '];');
    ALTER TABLE [TradePairStastics] ALTER COLUMN [CurrentRate] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131110732_DecimalPointChangeV2')
BEGIN
    DECLARE @var439 sysname;
    SELECT @var439 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradePairStastics]') AND [c].[name] = N'CurrencyPrice');
    IF @var439 IS NOT NULL EXEC(N'ALTER TABLE [TradePairStastics] DROP CONSTRAINT [' + @var439 + '];');
    ALTER TABLE [TradePairStastics] ALTER COLUMN [CurrencyPrice] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131110732_DecimalPointChangeV2')
BEGIN
    DECLARE @var440 sysname;
    SELECT @var440 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradePairStastics]') AND [c].[name] = N'ChangeVol24');
    IF @var440 IS NOT NULL EXEC(N'ALTER TABLE [TradePairStastics] DROP CONSTRAINT [' + @var440 + '];');
    ALTER TABLE [TradePairStastics] ALTER COLUMN [ChangeVol24] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131110732_DecimalPointChangeV2')
BEGIN
    DECLARE @var441 sysname;
    SELECT @var441 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradePairStastics]') AND [c].[name] = N'ChangeValue');
    IF @var441 IS NOT NULL EXEC(N'ALTER TABLE [TradePairStastics] DROP CONSTRAINT [' + @var441 + '];');
    ALTER TABLE [TradePairStastics] ALTER COLUMN [ChangeValue] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131110732_DecimalPointChangeV2')
BEGIN
    DECLARE @var442 sysname;
    SELECT @var442 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradePairStastics]') AND [c].[name] = N'ChangePer24');
    IF @var442 IS NOT NULL EXEC(N'ALTER TABLE [TradePairStastics] DROP CONSTRAINT [' + @var442 + '];');
    ALTER TABLE [TradePairStastics] ALTER COLUMN [ChangePer24] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131110732_DecimalPointChangeV2')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190131110732_DecimalPointChangeV2', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131111924_DecimalPointChangeV3')
BEGIN
    DECLARE @var443 sysname;
    SELECT @var443 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradePairDetail]') AND [c].[name] = N'SellPrice');
    IF @var443 IS NOT NULL EXEC(N'ALTER TABLE [TradePairDetail] DROP CONSTRAINT [' + @var443 + '];');
    ALTER TABLE [TradePairDetail] ALTER COLUMN [SellPrice] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131111924_DecimalPointChangeV3')
BEGIN
    DECLARE @var444 sysname;
    SELECT @var444 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradePairDetail]') AND [c].[name] = N'SellMinQty');
    IF @var444 IS NOT NULL EXEC(N'ALTER TABLE [TradePairDetail] DROP CONSTRAINT [' + @var444 + '];');
    ALTER TABLE [TradePairDetail] ALTER COLUMN [SellMinQty] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131111924_DecimalPointChangeV3')
BEGIN
    DECLARE @var445 sysname;
    SELECT @var445 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradePairDetail]') AND [c].[name] = N'SellMinPrice');
    IF @var445 IS NOT NULL EXEC(N'ALTER TABLE [TradePairDetail] DROP CONSTRAINT [' + @var445 + '];');
    ALTER TABLE [TradePairDetail] ALTER COLUMN [SellMinPrice] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131111924_DecimalPointChangeV3')
BEGIN
    DECLARE @var446 sysname;
    SELECT @var446 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradePairDetail]') AND [c].[name] = N'SellMaxQty');
    IF @var446 IS NOT NULL EXEC(N'ALTER TABLE [TradePairDetail] DROP CONSTRAINT [' + @var446 + '];');
    ALTER TABLE [TradePairDetail] ALTER COLUMN [SellMaxQty] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131111924_DecimalPointChangeV3')
BEGIN
    DECLARE @var447 sysname;
    SELECT @var447 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradePairDetail]') AND [c].[name] = N'SellMaxPrice');
    IF @var447 IS NOT NULL EXEC(N'ALTER TABLE [TradePairDetail] DROP CONSTRAINT [' + @var447 + '];');
    ALTER TABLE [TradePairDetail] ALTER COLUMN [SellMaxPrice] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131111924_DecimalPointChangeV3')
BEGIN
    DECLARE @var448 sysname;
    SELECT @var448 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradePairDetail]') AND [c].[name] = N'SellFees');
    IF @var448 IS NOT NULL EXEC(N'ALTER TABLE [TradePairDetail] DROP CONSTRAINT [' + @var448 + '];');
    ALTER TABLE [TradePairDetail] ALTER COLUMN [SellFees] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131111924_DecimalPointChangeV3')
BEGIN
    DECLARE @var449 sysname;
    SELECT @var449 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradePairDetail]') AND [c].[name] = N'BuyPrice');
    IF @var449 IS NOT NULL EXEC(N'ALTER TABLE [TradePairDetail] DROP CONSTRAINT [' + @var449 + '];');
    ALTER TABLE [TradePairDetail] ALTER COLUMN [BuyPrice] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131111924_DecimalPointChangeV3')
BEGIN
    DECLARE @var450 sysname;
    SELECT @var450 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradePairDetail]') AND [c].[name] = N'BuyMinQty');
    IF @var450 IS NOT NULL EXEC(N'ALTER TABLE [TradePairDetail] DROP CONSTRAINT [' + @var450 + '];');
    ALTER TABLE [TradePairDetail] ALTER COLUMN [BuyMinQty] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131111924_DecimalPointChangeV3')
BEGIN
    DECLARE @var451 sysname;
    SELECT @var451 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradePairDetail]') AND [c].[name] = N'BuyMinPrice');
    IF @var451 IS NOT NULL EXEC(N'ALTER TABLE [TradePairDetail] DROP CONSTRAINT [' + @var451 + '];');
    ALTER TABLE [TradePairDetail] ALTER COLUMN [BuyMinPrice] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131111924_DecimalPointChangeV3')
BEGIN
    DECLARE @var452 sysname;
    SELECT @var452 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradePairDetail]') AND [c].[name] = N'BuyMaxQty');
    IF @var452 IS NOT NULL EXEC(N'ALTER TABLE [TradePairDetail] DROP CONSTRAINT [' + @var452 + '];');
    ALTER TABLE [TradePairDetail] ALTER COLUMN [BuyMaxQty] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131111924_DecimalPointChangeV3')
BEGIN
    DECLARE @var453 sysname;
    SELECT @var453 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradePairDetail]') AND [c].[name] = N'BuyMaxPrice');
    IF @var453 IS NOT NULL EXEC(N'ALTER TABLE [TradePairDetail] DROP CONSTRAINT [' + @var453 + '];');
    ALTER TABLE [TradePairDetail] ALTER COLUMN [BuyMaxPrice] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131111924_DecimalPointChangeV3')
BEGIN
    DECLARE @var454 sysname;
    SELECT @var454 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradePairDetail]') AND [c].[name] = N'BuyFees');
    IF @var454 IS NOT NULL EXEC(N'ALTER TABLE [TradePairDetail] DROP CONSTRAINT [' + @var454 + '];');
    ALTER TABLE [TradePairDetail] ALTER COLUMN [BuyFees] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131111924_DecimalPointChangeV3')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190131111924_DecimalPointChangeV3', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var455 sysname;
    SELECT @var455 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeCancelQueue]') AND [c].[name] = N'PendingBuyQty');
    IF @var455 IS NOT NULL EXEC(N'ALTER TABLE [TradeCancelQueue] DROP CONSTRAINT [' + @var455 + '];');
    ALTER TABLE [TradeCancelQueue] ALTER COLUMN [PendingBuyQty] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var456 sysname;
    SELECT @var456 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeCancelQueue]') AND [c].[name] = N'DeliverQty');
    IF @var456 IS NOT NULL EXEC(N'ALTER TABLE [TradeCancelQueue] DROP CONSTRAINT [' + @var456 + '];');
    ALTER TABLE [TradeCancelQueue] ALTER COLUMN [DeliverQty] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var457 sysname;
    SELECT @var457 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeCancelQueue]') AND [c].[name] = N'DeliverBidPrice');
    IF @var457 IS NOT NULL EXEC(N'ALTER TABLE [TradeCancelQueue] DROP CONSTRAINT [' + @var457 + '];');
    ALTER TABLE [TradeCancelQueue] ALTER COLUMN [DeliverBidPrice] decimal(28, 18) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var458 sysname;
    SELECT @var458 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeBuyRequest]') AND [c].[name] = N'Qty');
    IF @var458 IS NOT NULL EXEC(N'ALTER TABLE [TradeBuyRequest] DROP CONSTRAINT [' + @var458 + '];');
    ALTER TABLE [TradeBuyRequest] ALTER COLUMN [Qty] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var459 sysname;
    SELECT @var459 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeBuyRequest]') AND [c].[name] = N'PendingQty');
    IF @var459 IS NOT NULL EXEC(N'ALTER TABLE [TradeBuyRequest] DROP CONSTRAINT [' + @var459 + '];');
    ALTER TABLE [TradeBuyRequest] ALTER COLUMN [PendingQty] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var460 sysname;
    SELECT @var460 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeBuyRequest]') AND [c].[name] = N'PaidQty');
    IF @var460 IS NOT NULL EXEC(N'ALTER TABLE [TradeBuyRequest] DROP CONSTRAINT [' + @var460 + '];');
    ALTER TABLE [TradeBuyRequest] ALTER COLUMN [PaidQty] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var461 sysname;
    SELECT @var461 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeBuyRequest]') AND [c].[name] = N'DeliveredQty');
    IF @var461 IS NOT NULL EXEC(N'ALTER TABLE [TradeBuyRequest] DROP CONSTRAINT [' + @var461 + '];');
    ALTER TABLE [TradeBuyRequest] ALTER COLUMN [DeliveredQty] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var462 sysname;
    SELECT @var462 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeBuyRequest]') AND [c].[name] = N'BidPrice');
    IF @var462 IS NOT NULL EXEC(N'ALTER TABLE [TradeBuyRequest] DROP CONSTRAINT [' + @var462 + '];');
    ALTER TABLE [TradeBuyRequest] ALTER COLUMN [BidPrice] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var463 sysname;
    SELECT @var463 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeBuyerListV1]') AND [c].[name] = N'RemainQty');
    IF @var463 IS NOT NULL EXEC(N'ALTER TABLE [TradeBuyerListV1] DROP CONSTRAINT [' + @var463 + '];');
    ALTER TABLE [TradeBuyerListV1] ALTER COLUMN [RemainQty] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var464 sysname;
    SELECT @var464 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeBuyerListV1]') AND [c].[name] = N'Qty');
    IF @var464 IS NOT NULL EXEC(N'ALTER TABLE [TradeBuyerListV1] DROP CONSTRAINT [' + @var464 + '];');
    ALTER TABLE [TradeBuyerListV1] ALTER COLUMN [Qty] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var465 sysname;
    SELECT @var465 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeBuyerListV1]') AND [c].[name] = N'Price');
    IF @var465 IS NOT NULL EXEC(N'ALTER TABLE [TradeBuyerListV1] DROP CONSTRAINT [' + @var465 + '];');
    ALTER TABLE [TradeBuyerListV1] ALTER COLUMN [Price] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var466 sysname;
    SELECT @var466 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeBuyerListV1]') AND [c].[name] = N'DeliveredQty');
    IF @var466 IS NOT NULL EXEC(N'ALTER TABLE [TradeBuyerListV1] DROP CONSTRAINT [' + @var466 + '];');
    ALTER TABLE [TradeBuyerListV1] ALTER COLUMN [DeliveredQty] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var467 sysname;
    SELECT @var467 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeBuyerList]') AND [c].[name] = N'Qty');
    IF @var467 IS NOT NULL EXEC(N'ALTER TABLE [TradeBuyerList] DROP CONSTRAINT [' + @var467 + '];');
    ALTER TABLE [TradeBuyerList] ALTER COLUMN [Qty] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var468 sysname;
    SELECT @var468 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeBuyerList]') AND [c].[name] = N'Price');
    IF @var468 IS NOT NULL EXEC(N'ALTER TABLE [TradeBuyerList] DROP CONSTRAINT [' + @var468 + '];');
    ALTER TABLE [TradeBuyerList] ALTER COLUMN [Price] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var469 sysname;
    SELECT @var469 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TradeBuyerList]') AND [c].[name] = N'DeliveredQty');
    IF @var469 IS NOT NULL EXEC(N'ALTER TABLE [TradeBuyerList] DROP CONSTRAINT [' + @var469 + '];');
    ALTER TABLE [TradeBuyerList] ALTER COLUMN [DeliveredQty] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var470 sysname;
    SELECT @var470 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TokenUnStakingHistory]') AND [c].[name] = N'InterestCreditedValue');
    IF @var470 IS NOT NULL EXEC(N'ALTER TABLE [TokenUnStakingHistory] DROP CONSTRAINT [' + @var470 + '];');
    ALTER TABLE [TokenUnStakingHistory] ALTER COLUMN [InterestCreditedValue] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var471 sysname;
    SELECT @var471 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TokenUnStakingHistory]') AND [c].[name] = N'ChargeBeforeMaturity');
    IF @var471 IS NOT NULL EXEC(N'ALTER TABLE [TokenUnStakingHistory] DROP CONSTRAINT [' + @var471 + '];');
    ALTER TABLE [TokenUnStakingHistory] ALTER COLUMN [ChargeBeforeMaturity] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var472 sysname;
    SELECT @var472 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TokenUnStakingHistory]') AND [c].[name] = N'AmountCredited');
    IF @var472 IS NOT NULL EXEC(N'ALTER TABLE [TokenUnStakingHistory] DROP CONSTRAINT [' + @var472 + '];');
    ALTER TABLE [TokenUnStakingHistory] ALTER COLUMN [AmountCredited] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var473 sysname;
    SELECT @var473 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TokenStakingHistory]') AND [c].[name] = N'TakerCharges');
    IF @var473 IS NOT NULL EXEC(N'ALTER TABLE [TokenStakingHistory] DROP CONSTRAINT [' + @var473 + '];');
    ALTER TABLE [TokenStakingHistory] ALTER COLUMN [TakerCharges] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var474 sysname;
    SELECT @var474 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TokenStakingHistory]') AND [c].[name] = N'StakingAmount');
    IF @var474 IS NOT NULL EXEC(N'ALTER TABLE [TokenStakingHistory] DROP CONSTRAINT [' + @var474 + '];');
    ALTER TABLE [TokenStakingHistory] ALTER COLUMN [StakingAmount] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var475 sysname;
    SELECT @var475 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TokenStakingHistory]') AND [c].[name] = N'MinAmount');
    IF @var475 IS NOT NULL EXEC(N'ALTER TABLE [TokenStakingHistory] DROP CONSTRAINT [' + @var475 + '];');
    ALTER TABLE [TokenStakingHistory] ALTER COLUMN [MinAmount] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var476 sysname;
    SELECT @var476 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TokenStakingHistory]') AND [c].[name] = N'MaxAmount');
    IF @var476 IS NOT NULL EXEC(N'ALTER TABLE [TokenStakingHistory] DROP CONSTRAINT [' + @var476 + '];');
    ALTER TABLE [TokenStakingHistory] ALTER COLUMN [MaxAmount] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var477 sysname;
    SELECT @var477 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TokenStakingHistory]') AND [c].[name] = N'MakerCharges');
    IF @var477 IS NOT NULL EXEC(N'ALTER TABLE [TokenStakingHistory] DROP CONSTRAINT [' + @var477 + '];');
    ALTER TABLE [TokenStakingHistory] ALTER COLUMN [MakerCharges] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var478 sysname;
    SELECT @var478 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TokenStakingHistory]') AND [c].[name] = N'InterestValueMst');
    IF @var478 IS NOT NULL EXEC(N'ALTER TABLE [TokenStakingHistory] DROP CONSTRAINT [' + @var478 + '];');
    ALTER TABLE [TokenStakingHistory] ALTER COLUMN [InterestValueMst] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var479 sysname;
    SELECT @var479 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TokenStakingHistory]') AND [c].[name] = N'InterestValue');
    IF @var479 IS NOT NULL EXEC(N'ALTER TABLE [TokenStakingHistory] DROP CONSTRAINT [' + @var479 + '];');
    ALTER TABLE [TokenStakingHistory] ALTER COLUMN [InterestValue] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var480 sysname;
    SELECT @var480 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TokenStakingHistory]') AND [c].[name] = N'EnableStakingBeforeMaturityCharge');
    IF @var480 IS NOT NULL EXEC(N'ALTER TABLE [TokenStakingHistory] DROP CONSTRAINT [' + @var480 + '];');
    ALTER TABLE [TokenStakingHistory] ALTER COLUMN [EnableStakingBeforeMaturityCharge] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var481 sysname;
    SELECT @var481 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TokenStakingHistory]') AND [c].[name] = N'DeductionAmount');
    IF @var481 IS NOT NULL EXEC(N'ALTER TABLE [TokenStakingHistory] DROP CONSTRAINT [' + @var481 + '];');
    ALTER TABLE [TokenStakingHistory] ALTER COLUMN [DeductionAmount] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var482 sysname;
    SELECT @var482 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StopLossMaster]') AND [c].[name] = N'StopLossPer');
    IF @var482 IS NOT NULL EXEC(N'ALTER TABLE [StopLossMaster] DROP CONSTRAINT [' + @var482 + '];');
    ALTER TABLE [StopLossMaster] ALTER COLUMN [StopLossPer] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var483 sysname;
    SELECT @var483 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StckingScheme]') AND [c].[name] = N'MinLimitAmount');
    IF @var483 IS NOT NULL EXEC(N'ALTER TABLE [StckingScheme] DROP CONSTRAINT [' + @var483 + '];');
    ALTER TABLE [StckingScheme] ALTER COLUMN [MinLimitAmount] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var484 sysname;
    SELECT @var484 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StckingScheme]') AND [c].[name] = N'MaxLimitAmount');
    IF @var484 IS NOT NULL EXEC(N'ALTER TABLE [StckingScheme] DROP CONSTRAINT [' + @var484 + '];');
    ALTER TABLE [StckingScheme] ALTER COLUMN [MaxLimitAmount] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var485 sysname;
    SELECT @var485 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StakingPolicyDetail]') AND [c].[name] = N'TakerCharges');
    IF @var485 IS NOT NULL EXEC(N'ALTER TABLE [StakingPolicyDetail] DROP CONSTRAINT [' + @var485 + '];');
    ALTER TABLE [StakingPolicyDetail] ALTER COLUMN [TakerCharges] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var486 sysname;
    SELECT @var486 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StakingPolicyDetail]') AND [c].[name] = N'MinAmount');
    IF @var486 IS NOT NULL EXEC(N'ALTER TABLE [StakingPolicyDetail] DROP CONSTRAINT [' + @var486 + '];');
    ALTER TABLE [StakingPolicyDetail] ALTER COLUMN [MinAmount] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var487 sysname;
    SELECT @var487 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StakingPolicyDetail]') AND [c].[name] = N'MaxAmount');
    IF @var487 IS NOT NULL EXEC(N'ALTER TABLE [StakingPolicyDetail] DROP CONSTRAINT [' + @var487 + '];');
    ALTER TABLE [StakingPolicyDetail] ALTER COLUMN [MaxAmount] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var488 sysname;
    SELECT @var488 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StakingPolicyDetail]') AND [c].[name] = N'MakerCharges');
    IF @var488 IS NOT NULL EXEC(N'ALTER TABLE [StakingPolicyDetail] DROP CONSTRAINT [' + @var488 + '];');
    ALTER TABLE [StakingPolicyDetail] ALTER COLUMN [MakerCharges] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var489 sysname;
    SELECT @var489 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StakingPolicyDetail]') AND [c].[name] = N'InterestValue');
    IF @var489 IS NOT NULL EXEC(N'ALTER TABLE [StakingPolicyDetail] DROP CONSTRAINT [' + @var489 + '];');
    ALTER TABLE [StakingPolicyDetail] ALTER COLUMN [InterestValue] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var490 sysname;
    SELECT @var490 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StakingPolicyDetail]') AND [c].[name] = N'EnableStakingBeforeMaturityCharge');
    IF @var490 IS NOT NULL EXEC(N'ALTER TABLE [StakingPolicyDetail] DROP CONSTRAINT [' + @var490 + '];');
    ALTER TABLE [StakingPolicyDetail] ALTER COLUMN [EnableStakingBeforeMaturityCharge] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var491 sysname;
    SELECT @var491 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StakingChargeMaster]') AND [c].[name] = N'TakerCharge');
    IF @var491 IS NOT NULL EXEC(N'ALTER TABLE [StakingChargeMaster] DROP CONSTRAINT [' + @var491 + '];');
    ALTER TABLE [StakingChargeMaster] ALTER COLUMN [TakerCharge] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var492 sysname;
    SELECT @var492 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StakingChargeMaster]') AND [c].[name] = N'MakerCharge');
    IF @var492 IS NOT NULL EXEC(N'ALTER TABLE [StakingChargeMaster] DROP CONSTRAINT [' + @var492 + '];');
    ALTER TABLE [StakingChargeMaster] ALTER COLUMN [MakerCharge] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var493 sysname;
    SELECT @var493 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SettledTradeTransactionQueue]') AND [c].[name] = N'TakerPer');
    IF @var493 IS NOT NULL EXEC(N'ALTER TABLE [SettledTradeTransactionQueue] DROP CONSTRAINT [' + @var493 + '];');
    ALTER TABLE [SettledTradeTransactionQueue] ALTER COLUMN [TakerPer] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var494 sysname;
    SELECT @var494 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SettledTradeTransactionQueue]') AND [c].[name] = N'SettledSellQty');
    IF @var494 IS NOT NULL EXEC(N'ALTER TABLE [SettledTradeTransactionQueue] DROP CONSTRAINT [' + @var494 + '];');
    ALTER TABLE [SettledTradeTransactionQueue] ALTER COLUMN [SettledSellQty] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var495 sysname;
    SELECT @var495 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SettledTradeTransactionQueue]') AND [c].[name] = N'SettledBuyQty');
    IF @var495 IS NOT NULL EXEC(N'ALTER TABLE [SettledTradeTransactionQueue] DROP CONSTRAINT [' + @var495 + '];');
    ALTER TABLE [SettledTradeTransactionQueue] ALTER COLUMN [SettledBuyQty] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var496 sysname;
    SELECT @var496 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SettledTradeTransactionQueue]') AND [c].[name] = N'SellQty');
    IF @var496 IS NOT NULL EXEC(N'ALTER TABLE [SettledTradeTransactionQueue] DROP CONSTRAINT [' + @var496 + '];');
    ALTER TABLE [SettledTradeTransactionQueue] ALTER COLUMN [SellQty] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var497 sysname;
    SELECT @var497 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SettledTradeTransactionQueue]') AND [c].[name] = N'OrderTotalQty');
    IF @var497 IS NOT NULL EXEC(N'ALTER TABLE [SettledTradeTransactionQueue] DROP CONSTRAINT [' + @var497 + '];');
    ALTER TABLE [SettledTradeTransactionQueue] ALTER COLUMN [OrderTotalQty] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var498 sysname;
    SELECT @var498 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SettledTradeTransactionQueue]') AND [c].[name] = N'DeliveryTotalQty');
    IF @var498 IS NOT NULL EXEC(N'ALTER TABLE [SettledTradeTransactionQueue] DROP CONSTRAINT [' + @var498 + '];');
    ALTER TABLE [SettledTradeTransactionQueue] ALTER COLUMN [DeliveryTotalQty] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var499 sysname;
    SELECT @var499 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SettledTradeTransactionQueue]') AND [c].[name] = N'BuyQty');
    IF @var499 IS NOT NULL EXEC(N'ALTER TABLE [SettledTradeTransactionQueue] DROP CONSTRAINT [' + @var499 + '];');
    ALTER TABLE [SettledTradeTransactionQueue] ALTER COLUMN [BuyQty] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var500 sysname;
    SELECT @var500 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SettledTradeTransactionQueue]') AND [c].[name] = N'BidPrice');
    IF @var500 IS NOT NULL EXEC(N'ALTER TABLE [SettledTradeTransactionQueue] DROP CONSTRAINT [' + @var500 + '];');
    ALTER TABLE [SettledTradeTransactionQueue] ALTER COLUMN [BidPrice] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var501 sysname;
    SELECT @var501 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SettledTradeTransactionQueue]') AND [c].[name] = N'AskPrice');
    IF @var501 IS NOT NULL EXEC(N'ALTER TABLE [SettledTradeTransactionQueue] DROP CONSTRAINT [' + @var501 + '];');
    ALTER TABLE [SettledTradeTransactionQueue] ALTER COLUMN [AskPrice] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var502 sysname;
    SELECT @var502 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ServiceStastics]') AND [c].[name] = N'VolGlobal');
    IF @var502 IS NOT NULL EXEC(N'ALTER TABLE [ServiceStastics] DROP CONSTRAINT [' + @var502 + '];');
    ALTER TABLE [ServiceStastics] ALTER COLUMN [VolGlobal] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var503 sysname;
    SELECT @var503 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ServiceStastics]') AND [c].[name] = N'MarketCap');
    IF @var503 IS NOT NULL EXEC(N'ALTER TABLE [ServiceStastics] DROP CONSTRAINT [' + @var503 + '];');
    ALTER TABLE [ServiceStastics] ALTER COLUMN [MarketCap] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var504 sysname;
    SELECT @var504 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ProfileMaster]') AND [c].[name] = N'Withdrawalfee');
    IF @var504 IS NOT NULL EXEC(N'ALTER TABLE [ProfileMaster] DROP CONSTRAINT [' + @var504 + '];');
    ALTER TABLE [ProfileMaster] ALTER COLUMN [Withdrawalfee] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var505 sysname;
    SELECT @var505 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ProfileMaster]') AND [c].[name] = N'Tradingfee');
    IF @var505 IS NOT NULL EXEC(N'ALTER TABLE [ProfileMaster] DROP CONSTRAINT [' + @var505 + '];');
    ALTER TABLE [ProfileMaster] ALTER COLUMN [Tradingfee] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var506 sysname;
    SELECT @var506 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ProfileMaster]') AND [c].[name] = N'SubscriptionAmount');
    IF @var506 IS NOT NULL EXEC(N'ALTER TABLE [ProfileMaster] DROP CONSTRAINT [' + @var506 + '];');
    ALTER TABLE [ProfileMaster] ALTER COLUMN [SubscriptionAmount] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var507 sysname;
    SELECT @var507 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ProfileMaster]') AND [c].[name] = N'ProfileFree');
    IF @var507 IS NOT NULL EXEC(N'ALTER TABLE [ProfileMaster] DROP CONSTRAINT [' + @var507 + '];');
    ALTER TABLE [ProfileMaster] ALTER COLUMN [ProfileFree] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var508 sysname;
    SELECT @var508 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ProfileMaster]') AND [c].[name] = N'DepositFee');
    IF @var508 IS NOT NULL EXEC(N'ALTER TABLE [ProfileMaster] DROP CONSTRAINT [' + @var508 + '];');
    ALTER TABLE [ProfileMaster] ALTER COLUMN [DepositFee] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var509 sysname;
    SELECT @var509 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PoolOrder]') AND [c].[name] = N'OrderAmt');
    IF @var509 IS NOT NULL EXEC(N'ALTER TABLE [PoolOrder] DROP CONSTRAINT [' + @var509 + '];');
    ALTER TABLE [PoolOrder] ALTER COLUMN [OrderAmt] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var510 sysname;
    SELECT @var510 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PoolOrder]') AND [c].[name] = N'DiscRs');
    IF @var510 IS NOT NULL EXEC(N'ALTER TABLE [PoolOrder] DROP CONSTRAINT [' + @var510 + '];');
    ALTER TABLE [PoolOrder] ALTER COLUMN [DiscRs] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var511 sysname;
    SELECT @var511 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PoolOrder]') AND [c].[name] = N'DiscPer');
    IF @var511 IS NOT NULL EXEC(N'ALTER TABLE [PoolOrder] DROP CONSTRAINT [' + @var511 + '];');
    ALTER TABLE [PoolOrder] ALTER COLUMN [DiscPer] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var512 sysname;
    SELECT @var512 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PoolOrder]') AND [c].[name] = N'DeliveryAmt');
    IF @var512 IS NOT NULL EXEC(N'ALTER TABLE [PoolOrder] DROP CONSTRAINT [' + @var512 + '];');
    ALTER TABLE [PoolOrder] ALTER COLUMN [DeliveryAmt] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var513 sysname;
    SELECT @var513 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[MemberShadowLimit]') AND [c].[name] = N'ShadowLimitAmount');
    IF @var513 IS NOT NULL EXEC(N'ALTER TABLE [MemberShadowLimit] DROP CONSTRAINT [' + @var513 + '];');
    ALTER TABLE [MemberShadowLimit] ALTER COLUMN [ShadowLimitAmount] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var514 sysname;
    SELECT @var514 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[MemberShadowBalance]') AND [c].[name] = N'ShadowAmount');
    IF @var514 IS NOT NULL EXEC(N'ALTER TABLE [MemberShadowBalance] DROP CONSTRAINT [' + @var514 + '];');
    ALTER TABLE [MemberShadowBalance] ALTER COLUMN [ShadowAmount] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var515 sysname;
    SELECT @var515 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Limits]') AND [c].[name] = N'MinAmtWeekly');
    IF @var515 IS NOT NULL EXEC(N'ALTER TABLE [Limits] DROP CONSTRAINT [' + @var515 + '];');
    ALTER TABLE [Limits] ALTER COLUMN [MinAmtWeekly] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var516 sysname;
    SELECT @var516 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Limits]') AND [c].[name] = N'MinAmtMonthly');
    IF @var516 IS NOT NULL EXEC(N'ALTER TABLE [Limits] DROP CONSTRAINT [' + @var516 + '];');
    ALTER TABLE [Limits] ALTER COLUMN [MinAmtMonthly] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var517 sysname;
    SELECT @var517 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Limits]') AND [c].[name] = N'MinAmtDaily');
    IF @var517 IS NOT NULL EXEC(N'ALTER TABLE [Limits] DROP CONSTRAINT [' + @var517 + '];');
    ALTER TABLE [Limits] ALTER COLUMN [MinAmtDaily] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var518 sysname;
    SELECT @var518 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Limits]') AND [c].[name] = N'MinAmt');
    IF @var518 IS NOT NULL EXEC(N'ALTER TABLE [Limits] DROP CONSTRAINT [' + @var518 + '];');
    ALTER TABLE [Limits] ALTER COLUMN [MinAmt] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var519 sysname;
    SELECT @var519 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Limits]') AND [c].[name] = N'MaxAmtWeekly');
    IF @var519 IS NOT NULL EXEC(N'ALTER TABLE [Limits] DROP CONSTRAINT [' + @var519 + '];');
    ALTER TABLE [Limits] ALTER COLUMN [MaxAmtWeekly] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var520 sysname;
    SELECT @var520 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Limits]') AND [c].[name] = N'MaxAmtMonthly');
    IF @var520 IS NOT NULL EXEC(N'ALTER TABLE [Limits] DROP CONSTRAINT [' + @var520 + '];');
    ALTER TABLE [Limits] ALTER COLUMN [MaxAmtMonthly] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var521 sysname;
    SELECT @var521 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Limits]') AND [c].[name] = N'MaxAmtDaily');
    IF @var521 IS NOT NULL EXEC(N'ALTER TABLE [Limits] DROP CONSTRAINT [' + @var521 + '];');
    ALTER TABLE [Limits] ALTER COLUMN [MaxAmtDaily] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var522 sysname;
    SELECT @var522 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Limits]') AND [c].[name] = N'MaxAmt');
    IF @var522 IS NOT NULL EXEC(N'ALTER TABLE [Limits] DROP CONSTRAINT [' + @var522 + '];');
    ALTER TABLE [Limits] ALTER COLUMN [MaxAmt] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var523 sysname;
    SELECT @var523 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[LimitRuleMaster]') AND [c].[name] = N'MinAmount');
    IF @var523 IS NOT NULL EXEC(N'ALTER TABLE [LimitRuleMaster] DROP CONSTRAINT [' + @var523 + '];');
    ALTER TABLE [LimitRuleMaster] ALTER COLUMN [MinAmount] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var524 sysname;
    SELECT @var524 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[LimitRuleMaster]') AND [c].[name] = N'MaxAmount');
    IF @var524 IS NOT NULL EXEC(N'ALTER TABLE [LimitRuleMaster] DROP CONSTRAINT [' + @var524 + '];');
    ALTER TABLE [LimitRuleMaster] ALTER COLUMN [MaxAmount] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var525 sysname;
    SELECT @var525 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[LeverageMaster]') AND [c].[name] = N'LeveragePer');
    IF @var525 IS NOT NULL EXEC(N'ALTER TABLE [LeverageMaster] DROP CONSTRAINT [' + @var525 + '];');
    ALTER TABLE [LeverageMaster] ALTER COLUMN [LeveragePer] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var526 sysname;
    SELECT @var526 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[DepositHistory]') AND [c].[name] = N'Amount');
    IF @var526 IS NOT NULL EXEC(N'ALTER TABLE [DepositHistory] DROP CONSTRAINT [' + @var526 + '];');
    ALTER TABLE [DepositHistory] ALTER COLUMN [Amount] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var527 sysname;
    SELECT @var527 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CurrencyRateMaster]') AND [c].[name] = N'CurrentRate');
    IF @var527 IS NOT NULL EXEC(N'ALTER TABLE [CurrencyRateMaster] DROP CONSTRAINT [' + @var527 + '];');
    ALTER TABLE [CurrencyRateMaster] ALTER COLUMN [CurrentRate] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var528 sysname;
    SELECT @var528 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CurrencyRateDetail]') AND [c].[name] = N'Volume_24h');
    IF @var528 IS NOT NULL EXEC(N'ALTER TABLE [CurrencyRateDetail] DROP CONSTRAINT [' + @var528 + '];');
    ALTER TABLE [CurrencyRateDetail] ALTER COLUMN [Volume_24h] decimal(33, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var529 sysname;
    SELECT @var529 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CurrencyRateDetail]') AND [c].[name] = N'Price');
    IF @var529 IS NOT NULL EXEC(N'ALTER TABLE [CurrencyRateDetail] DROP CONSTRAINT [' + @var529 + '];');
    ALTER TABLE [CurrencyRateDetail] ALTER COLUMN [Price] decimal(33, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var530 sysname;
    SELECT @var530 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CurrencyRateDetail]') AND [c].[name] = N'Percent_change_7d');
    IF @var530 IS NOT NULL EXEC(N'ALTER TABLE [CurrencyRateDetail] DROP CONSTRAINT [' + @var530 + '];');
    ALTER TABLE [CurrencyRateDetail] ALTER COLUMN [Percent_change_7d] decimal(33, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var531 sysname;
    SELECT @var531 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CurrencyRateDetail]') AND [c].[name] = N'Percent_change_24h');
    IF @var531 IS NOT NULL EXEC(N'ALTER TABLE [CurrencyRateDetail] DROP CONSTRAINT [' + @var531 + '];');
    ALTER TABLE [CurrencyRateDetail] ALTER COLUMN [Percent_change_24h] decimal(33, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var532 sysname;
    SELECT @var532 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CurrencyRateDetail]') AND [c].[name] = N'Percent_change_1h');
    IF @var532 IS NOT NULL EXEC(N'ALTER TABLE [CurrencyRateDetail] DROP CONSTRAINT [' + @var532 + '];');
    ALTER TABLE [CurrencyRateDetail] ALTER COLUMN [Percent_change_1h] decimal(33, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var533 sysname;
    SELECT @var533 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CurrencyRateDetail]') AND [c].[name] = N'Market_cap');
    IF @var533 IS NOT NULL EXEC(N'ALTER TABLE [CurrencyRateDetail] DROP CONSTRAINT [' + @var533 + '];');
    ALTER TABLE [CurrencyRateDetail] ALTER COLUMN [Market_cap] decimal(33, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var534 sysname;
    SELECT @var534 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ConvertFundHistory]') AND [c].[name] = N'SourcePrice');
    IF @var534 IS NOT NULL EXEC(N'ALTER TABLE [ConvertFundHistory] DROP CONSTRAINT [' + @var534 + '];');
    ALTER TABLE [ConvertFundHistory] ALTER COLUMN [SourcePrice] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var535 sysname;
    SELECT @var535 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ConvertFundHistory]') AND [c].[name] = N'Price');
    IF @var535 IS NOT NULL EXEC(N'ALTER TABLE [ConvertFundHistory] DROP CONSTRAINT [' + @var535 + '];');
    ALTER TABLE [ConvertFundHistory] ALTER COLUMN [Price] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var536 sysname;
    SELECT @var536 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ConvertFundHistory]') AND [c].[name] = N'DestinationPrice');
    IF @var536 IS NOT NULL EXEC(N'ALTER TABLE [ConvertFundHistory] DROP CONSTRAINT [' + @var536 + '];');
    ALTER TABLE [ConvertFundHistory] ALTER COLUMN [DestinationPrice] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var537 sysname;
    SELECT @var537 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CommissionPolicy]') AND [c].[name] = N'MinAmount');
    IF @var537 IS NOT NULL EXEC(N'ALTER TABLE [CommissionPolicy] DROP CONSTRAINT [' + @var537 + '];');
    ALTER TABLE [CommissionPolicy] ALTER COLUMN [MinAmount] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var538 sysname;
    SELECT @var538 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CommissionPolicy]') AND [c].[name] = N'MaxAmount');
    IF @var538 IS NOT NULL EXEC(N'ALTER TABLE [CommissionPolicy] DROP CONSTRAINT [' + @var538 + '];');
    ALTER TABLE [CommissionPolicy] ALTER COLUMN [MaxAmount] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var539 sysname;
    SELECT @var539 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CoinListRequest]') AND [c].[name] = N'TrnFee');
    IF @var539 IS NOT NULL EXEC(N'ALTER TABLE [CoinListRequest] DROP CONSTRAINT [' + @var539 + '];');
    ALTER TABLE [CoinListRequest] ALTER COLUMN [TrnFee] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var540 sysname;
    SELECT @var540 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CoinListRequest]') AND [c].[name] = N'TotalSupply');
    IF @var540 IS NOT NULL EXEC(N'ALTER TABLE [CoinListRequest] DROP CONSTRAINT [' + @var540 + '];');
    ALTER TABLE [CoinListRequest] ALTER COLUMN [TotalSupply] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var541 sysname;
    SELECT @var541 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CoinListRequest]') AND [c].[name] = N'MaxSupply');
    IF @var541 IS NOT NULL EXEC(N'ALTER TABLE [CoinListRequest] DROP CONSTRAINT [' + @var541 + '];');
    ALTER TABLE [CoinListRequest] ALTER COLUMN [MaxSupply] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var542 sysname;
    SELECT @var542 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CoinListRequest]') AND [c].[name] = N'IssuePrice');
    IF @var542 IS NOT NULL EXEC(N'ALTER TABLE [CoinListRequest] DROP CONSTRAINT [' + @var542 + '];');
    ALTER TABLE [CoinListRequest] ALTER COLUMN [IssuePrice] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var543 sysname;
    SELECT @var543 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CoinListRequest]') AND [c].[name] = N'CirculatingSupply');
    IF @var543 IS NOT NULL EXEC(N'ALTER TABLE [CoinListRequest] DROP CONSTRAINT [' + @var543 + '];');
    ALTER TABLE [CoinListRequest] ALTER COLUMN [CirculatingSupply] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var544 sysname;
    SELECT @var544 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ChargeRuleMaster]') AND [c].[name] = N'MinAmount');
    IF @var544 IS NOT NULL EXEC(N'ALTER TABLE [ChargeRuleMaster] DROP CONSTRAINT [' + @var544 + '];');
    ALTER TABLE [ChargeRuleMaster] ALTER COLUMN [MinAmount] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var545 sysname;
    SELECT @var545 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ChargeRuleMaster]') AND [c].[name] = N'MaxAmount');
    IF @var545 IS NOT NULL EXEC(N'ALTER TABLE [ChargeRuleMaster] DROP CONSTRAINT [' + @var545 + '];');
    ALTER TABLE [ChargeRuleMaster] ALTER COLUMN [MaxAmount] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var546 sysname;
    SELECT @var546 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ChargeRuleMaster]') AND [c].[name] = N'ChargeValue');
    IF @var546 IS NOT NULL EXEC(N'ALTER TABLE [ChargeRuleMaster] DROP CONSTRAINT [' + @var546 + '];');
    ALTER TABLE [ChargeRuleMaster] ALTER COLUMN [ChargeValue] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var547 sysname;
    SELECT @var547 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ChargePolicy]') AND [c].[name] = N'MinAmount');
    IF @var547 IS NOT NULL EXEC(N'ALTER TABLE [ChargePolicy] DROP CONSTRAINT [' + @var547 + '];');
    ALTER TABLE [ChargePolicy] ALTER COLUMN [MinAmount] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var548 sysname;
    SELECT @var548 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ChargePolicy]') AND [c].[name] = N'MaxAmount');
    IF @var548 IS NOT NULL EXEC(N'ALTER TABLE [ChargePolicy] DROP CONSTRAINT [' + @var548 + '];');
    ALTER TABLE [ChargePolicy] ALTER COLUMN [MaxAmount] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var549 sysname;
    SELECT @var549 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ChargeConfigurationDetail]') AND [c].[name] = N'TakerCharge');
    IF @var549 IS NOT NULL EXEC(N'ALTER TABLE [ChargeConfigurationDetail] DROP CONSTRAINT [' + @var549 + '];');
    ALTER TABLE [ChargeConfigurationDetail] ALTER COLUMN [TakerCharge] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var550 sysname;
    SELECT @var550 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ChargeConfigurationDetail]') AND [c].[name] = N'MinAmount');
    IF @var550 IS NOT NULL EXEC(N'ALTER TABLE [ChargeConfigurationDetail] DROP CONSTRAINT [' + @var550 + '];');
    ALTER TABLE [ChargeConfigurationDetail] ALTER COLUMN [MinAmount] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var551 sysname;
    SELECT @var551 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ChargeConfigurationDetail]') AND [c].[name] = N'MaxAmount');
    IF @var551 IS NOT NULL EXEC(N'ALTER TABLE [ChargeConfigurationDetail] DROP CONSTRAINT [' + @var551 + '];');
    ALTER TABLE [ChargeConfigurationDetail] ALTER COLUMN [MaxAmount] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var552 sysname;
    SELECT @var552 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ChargeConfigurationDetail]') AND [c].[name] = N'MakerCharge');
    IF @var552 IS NOT NULL EXEC(N'ALTER TABLE [ChargeConfigurationDetail] DROP CONSTRAINT [' + @var552 + '];');
    ALTER TABLE [ChargeConfigurationDetail] ALTER COLUMN [MakerCharge] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var553 sysname;
    SELECT @var553 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ChargeConfigurationDetail]') AND [c].[name] = N'ChargeValue');
    IF @var553 IS NOT NULL EXEC(N'ALTER TABLE [ChargeConfigurationDetail] DROP CONSTRAINT [' + @var553 + '];');
    ALTER TABLE [ChargeConfigurationDetail] ALTER COLUMN [ChargeValue] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var554 sysname;
    SELECT @var554 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[BalanceStatistics]') AND [c].[name] = N'StartingBalance');
    IF @var554 IS NOT NULL EXEC(N'ALTER TABLE [BalanceStatistics] DROP CONSTRAINT [' + @var554 + '];');
    ALTER TABLE [BalanceStatistics] ALTER COLUMN [StartingBalance] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    DECLARE @var555 sysname;
    SELECT @var555 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[BalanceStatistics]') AND [c].[name] = N'EndingBalance');
    IF @var555 IS NOT NULL EXEC(N'ALTER TABLE [BalanceStatistics] DROP CONSTRAINT [' + @var555 + '];');
    ALTER TABLE [BalanceStatistics] ALTER COLUMN [EndingBalance] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    CREATE TABLE [UserProfitStatistics] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [UserId] bigint NOT NULL,
        [Day] int NOT NULL,
        [Month] int NOT NULL,
        [Year] int NOT NULL,
        [CurrencyName] nvarchar(max) NOT NULL,
        [StartingBalance] decimal(28, 18) NOT NULL,
        [EndingBalance] decimal(28, 18) NOT NULL,
        [DepositionAmount] decimal(28, 18) NOT NULL,
        [WithdrawAmount] decimal(28, 18) NOT NULL,
        [ProfitAmount] decimal(28, 18) NOT NULL,
        [ProfitPer] decimal(28, 18) NOT NULL,
        CONSTRAINT [PK_UserProfitStatistics] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190131113630_DecimalPointChangeV4')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190131113630_DecimalPointChangeV4', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190201063049_marketcap_coinname')
BEGIN
    DECLARE @var556 sysname;
    SELECT @var556 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TrnChargeLog]') AND [c].[name] = N'IsMaker');
    IF @var556 IS NOT NULL EXEC(N'ALTER TABLE [TrnChargeLog] DROP CONSTRAINT [' + @var556 + '];');
    ALTER TABLE [TrnChargeLog] ALTER COLUMN [IsMaker] smallint NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190201063049_marketcap_coinname')
BEGIN
    ALTER TABLE [CurrencyRateMaster] ADD [CurrencyName] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190201063049_marketcap_coinname')
BEGIN
    DECLARE @var557 sysname;
    SELECT @var557 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CurrencyRateDetail]') AND [c].[name] = N'Volume_24h');
    IF @var557 IS NOT NULL EXEC(N'ALTER TABLE [CurrencyRateDetail] DROP CONSTRAINT [' + @var557 + '];');
    ALTER TABLE [CurrencyRateDetail] ALTER COLUMN [Volume_24h] decimal(33, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190201063049_marketcap_coinname')
BEGIN
    DECLARE @var558 sysname;
    SELECT @var558 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CurrencyRateDetail]') AND [c].[name] = N'Price');
    IF @var558 IS NOT NULL EXEC(N'ALTER TABLE [CurrencyRateDetail] DROP CONSTRAINT [' + @var558 + '];');
    ALTER TABLE [CurrencyRateDetail] ALTER COLUMN [Price] decimal(33, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190201063049_marketcap_coinname')
BEGIN
    DECLARE @var559 sysname;
    SELECT @var559 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CurrencyRateDetail]') AND [c].[name] = N'Percent_change_7d');
    IF @var559 IS NOT NULL EXEC(N'ALTER TABLE [CurrencyRateDetail] DROP CONSTRAINT [' + @var559 + '];');
    ALTER TABLE [CurrencyRateDetail] ALTER COLUMN [Percent_change_7d] decimal(33, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190201063049_marketcap_coinname')
BEGIN
    DECLARE @var560 sysname;
    SELECT @var560 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CurrencyRateDetail]') AND [c].[name] = N'Percent_change_24h');
    IF @var560 IS NOT NULL EXEC(N'ALTER TABLE [CurrencyRateDetail] DROP CONSTRAINT [' + @var560 + '];');
    ALTER TABLE [CurrencyRateDetail] ALTER COLUMN [Percent_change_24h] decimal(33, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190201063049_marketcap_coinname')
BEGIN
    DECLARE @var561 sysname;
    SELECT @var561 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CurrencyRateDetail]') AND [c].[name] = N'Percent_change_1h');
    IF @var561 IS NOT NULL EXEC(N'ALTER TABLE [CurrencyRateDetail] DROP CONSTRAINT [' + @var561 + '];');
    ALTER TABLE [CurrencyRateDetail] ALTER COLUMN [Percent_change_1h] decimal(33, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190201063049_marketcap_coinname')
BEGIN
    DECLARE @var562 sysname;
    SELECT @var562 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CurrencyRateDetail]') AND [c].[name] = N'Market_cap');
    IF @var562 IS NOT NULL EXEC(N'ALTER TABLE [CurrencyRateDetail] DROP CONSTRAINT [' + @var562 + '];');
    ALTER TABLE [CurrencyRateDetail] ALTER COLUMN [Market_cap] decimal(33, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190201063049_marketcap_coinname')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190201063049_marketcap_coinname', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190204122253_apptype')
BEGIN
    ALTER TABLE [TradePoolQueueV1] ADD [IsAPITrade] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190204122253_apptype')
BEGIN
    ALTER TABLE [DepositCounterMaster] ADD [AppType] int NOT NULL DEFAULT 0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190204122253_apptype')
BEGIN
    CREATE TABLE [APIOrderSettlement] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [TrnNo] bigint NOT NULL,
        [PairID] bigint NOT NULL,
        [PairName] nvarchar(max) NULL,
        [OldStatus] smallint NOT NULL,
        [NewStatus] smallint NOT NULL,
        [Price] decimal(28, 18) NOT NULL,
        [Qty] decimal(28, 18) NOT NULL,
        [OldQty] decimal(28, 18) NOT NULL,
        [NewQty] decimal(28, 18) NOT NULL,
        [SettledQty] decimal(28, 18) NOT NULL,
        [APIPrice] decimal(28, 18) NOT NULL,
        [APISettledQty] decimal(28, 18) NOT NULL,
        [APIRemainQty] decimal(28, 18) NOT NULL,
        CONSTRAINT [PK_APIOrderSettlement] PRIMARY KEY ([TrnNo])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190204122253_apptype')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190204122253_apptype', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190204133708_Changedecimalsize')
BEGIN
    DECLARE @var563 sysname;
    SELECT @var563 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[UserProfitStatistics]') AND [c].[name] = N'WithdrawAmount');
    IF @var563 IS NOT NULL EXEC(N'ALTER TABLE [UserProfitStatistics] DROP CONSTRAINT [' + @var563 + '];');
    ALTER TABLE [UserProfitStatistics] ALTER COLUMN [WithdrawAmount] decimal(35, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190204133708_Changedecimalsize')
BEGIN
    DECLARE @var564 sysname;
    SELECT @var564 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[UserProfitStatistics]') AND [c].[name] = N'StartingBalance');
    IF @var564 IS NOT NULL EXEC(N'ALTER TABLE [UserProfitStatistics] DROP CONSTRAINT [' + @var564 + '];');
    ALTER TABLE [UserProfitStatistics] ALTER COLUMN [StartingBalance] decimal(35, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190204133708_Changedecimalsize')
BEGIN
    DECLARE @var565 sysname;
    SELECT @var565 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[UserProfitStatistics]') AND [c].[name] = N'ProfitPer');
    IF @var565 IS NOT NULL EXEC(N'ALTER TABLE [UserProfitStatistics] DROP CONSTRAINT [' + @var565 + '];');
    ALTER TABLE [UserProfitStatistics] ALTER COLUMN [ProfitPer] decimal(35, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190204133708_Changedecimalsize')
BEGIN
    DECLARE @var566 sysname;
    SELECT @var566 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[UserProfitStatistics]') AND [c].[name] = N'ProfitAmount');
    IF @var566 IS NOT NULL EXEC(N'ALTER TABLE [UserProfitStatistics] DROP CONSTRAINT [' + @var566 + '];');
    ALTER TABLE [UserProfitStatistics] ALTER COLUMN [ProfitAmount] decimal(35, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190204133708_Changedecimalsize')
BEGIN
    DECLARE @var567 sysname;
    SELECT @var567 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[UserProfitStatistics]') AND [c].[name] = N'EndingBalance');
    IF @var567 IS NOT NULL EXEC(N'ALTER TABLE [UserProfitStatistics] DROP CONSTRAINT [' + @var567 + '];');
    ALTER TABLE [UserProfitStatistics] ALTER COLUMN [EndingBalance] decimal(35, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190204133708_Changedecimalsize')
BEGIN
    DECLARE @var568 sysname;
    SELECT @var568 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[UserProfitStatistics]') AND [c].[name] = N'DepositionAmount');
    IF @var568 IS NOT NULL EXEC(N'ALTER TABLE [UserProfitStatistics] DROP CONSTRAINT [' + @var568 + '];');
    ALTER TABLE [UserProfitStatistics] ALTER COLUMN [DepositionAmount] decimal(35, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190204133708_Changedecimalsize')
BEGIN
    DECLARE @var569 sysname;
    SELECT @var569 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TrnChargeLog]') AND [c].[name] = N'IsMaker');
    IF @var569 IS NOT NULL EXEC(N'ALTER TABLE [TrnChargeLog] DROP CONSTRAINT [' + @var569 + '];');
    ALTER TABLE [TrnChargeLog] ALTER COLUMN [IsMaker] smallint NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190204133708_Changedecimalsize')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190204133708_Changedecimalsize', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190205094853_addbizuserregirtortype')
BEGIN
    ALTER TABLE [BizUser] ADD [RegTypeId] int NOT NULL DEFAULT 0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190205094853_addbizuserregirtortype')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190205094853_addbizuserregirtortype', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190205101818_refnoaddedtochargelogtbl')
BEGIN
    ALTER TABLE [TrnChargeLog] ADD [TrnRefNo] bigint NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190205101818_refnoaddedtochargelogtbl')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190205101818_refnoaddedtochargelogtbl', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190206130044_CancelOnLP')
BEGIN
    ALTER TABLE [TransactionRequest] ADD [IsCancel] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190206130044_CancelOnLP')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190206130044_CancelOnLP', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190207053635_SiteTokenMaster')
BEGIN
    CREATE TABLE [SiteTokenMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [CurrencyID] bigint NOT NULL,
        [BaseCurrencyID] bigint NOT NULL,
        [RateType] smallint NOT NULL,
        [Rate] decimal(28, 18) NOT NULL,
        [MinLimit] decimal(28, 18) NOT NULL,
        [MaxxLimit] decimal(28, 18) NOT NULL,
        [DailyLimit] decimal(28, 18) NOT NULL,
        [WeeklyLimit] decimal(28, 18) NOT NULL,
        [MonthlyLimit] decimal(28, 18) NOT NULL,
        [Note] nvarchar(max) NULL,
        CONSTRAINT [PK_SiteTokenMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190207053635_SiteTokenMaster')
BEGIN
    CREATE TABLE [SiteTokenRateType] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [TokenType] nvarchar(max) NULL,
        CONSTRAINT [PK_SiteTokenRateType] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190207053635_SiteTokenMaster')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190207053635_SiteTokenMaster', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190207073326_SiteTokenMasterV1')
BEGIN
    EXEC sp_rename N'[SiteTokenMaster].[MaxxLimit]', N'MaxLimit', N'COLUMN';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190207073326_SiteTokenMasterV1')
BEGIN
    ALTER TABLE [SiteTokenMaster] ADD [BaseCurrencySMSCode] nvarchar(max) NOT NULL DEFAULT N'';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190207073326_SiteTokenMasterV1')
BEGIN
    ALTER TABLE [SiteTokenMaster] ADD [CurrencySMSCode] nvarchar(max) NOT NULL DEFAULT N'';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190207073326_SiteTokenMasterV1')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190207073326_SiteTokenMasterV1', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190207125733_margintradingrequesttbl')
BEGIN
    ALTER TABLE [LeverageMaster] ADD [IsAutoApprove] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190207125733_margintradingrequesttbl')
BEGIN
    ALTER TABLE [LeverageMaster] ADD [SafetyMarginPer] decimal(28, 18) NOT NULL DEFAULT 0.0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190207125733_margintradingrequesttbl')
BEGIN
    CREATE TABLE [MarginWalletTopupRequest] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [WalletTypeID] bigint NOT NULL,
        [FromWalletID] bigint NOT NULL,
        [ToWalletID] bigint NOT NULL,
        [UserID] bigint NOT NULL,
        [LeverageID] bigint NOT NULL,
        [IsAutoApprove] smallint NOT NULL,
        [RequestRemarks] nvarchar(500) NOT NULL,
        [Amount] decimal(28, 18) NOT NULL,
        [TrnDate] datetime2 NOT NULL,
        [LeverageAmount] decimal(28, 18) NOT NULL,
        [ChargeAmount] decimal(28, 18) NOT NULL,
        [SafetyMarginAmount] decimal(28, 18) NOT NULL,
        [CreditAmount] decimal(28, 18) NOT NULL,
        [ApprovedBy] bigint NOT NULL,
        [ApprovedDate] datetime2 NOT NULL,
        [ApprovedRemarks] nvarchar(500) NULL,
        [SystemRemarks] nvarchar(500) NULL,
        [Status] int NOT NULL,
        CONSTRAINT [PK_MarginWalletTopupRequest] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190207125733_margintradingrequesttbl')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190207125733_margintradingrequesttbl', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190208104630_SiteTokenConversationEntity')
BEGIN
    CREATE TABLE [SiteTokenConversion] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [GUID] uniqueidentifier NOT NULL,
        [UserID] bigint NOT NULL,
        [SourceCurrencyID] bigint NOT NULL,
        [SourceCurrency] nvarchar(max) NULL,
        [TargerCurrencyID] bigint NOT NULL,
        [TargerCurrency] nvarchar(max) NULL,
        [SourceCurrencyQty] decimal(28, 18) NOT NULL,
        [TargerCurrencyQty] decimal(28, 18) NOT NULL,
        [SourceToBasePrice] decimal(28, 18) NOT NULL,
        [SourceToBaseQty] decimal(28, 18) NOT NULL,
        [TokenPrice] decimal(28, 18) NOT NULL,
        [SiteTokenMasterID] bigint NOT NULL,
        CONSTRAINT [PK_SiteTokenConversion] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190208104630_SiteTokenConversationEntity')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190208104630_SiteTokenConversationEntity', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190208130634_SiteTokenMasterPairID')
BEGIN
    ALTER TABLE [SiteTokenMaster] ADD [PairID] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190208130634_SiteTokenMasterPairID')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190208130634_SiteTokenMasterPairID', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190209061958_TemplateCategorymasterForServiceType')
BEGIN
    ALTER TABLE [TemplateCategoryMaster] ADD [CommServiceTypeID] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190209061958_TemplateCategorymasterForServiceType')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190209061958_TemplateCategorymasterForServiceType', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190209071215_changeRequestTypeDatatype')
BEGIN
    DECLARE @var570 sysname;
    SELECT @var570 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RequestFormatMaster]') AND [c].[name] = N'RequestType');
    IF @var570 IS NOT NULL EXEC(N'ALTER TABLE [RequestFormatMaster] DROP CONSTRAINT [' + @var570 + '];');
    ALTER TABLE [RequestFormatMaster] ALTER COLUMN [RequestType] bigint NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190209071215_changeRequestTypeDatatype')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190209071215_changeRequestTypeDatatype', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190209081453_SiteTokenNewColumn')
BEGIN
    ALTER TABLE [SiteTokenConversion] ADD [StatusMsg] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190209081453_SiteTokenNewColumn')
BEGIN
    ALTER TABLE [SiteTokenConversion] ADD [TimeStamp] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190209081453_SiteTokenNewColumn')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190209081453_SiteTokenNewColumn', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211095803_FeedExchange')
BEGIN
    DECLARE @var571 sysname;
    SELECT @var571 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[MarginWalletTopupRequest]') AND [c].[name] = N'ApprovedDate');
    IF @var571 IS NOT NULL EXEC(N'ALTER TABLE [MarginWalletTopupRequest] DROP CONSTRAINT [' + @var571 + '];');
    ALTER TABLE [MarginWalletTopupRequest] ALTER COLUMN [ApprovedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211095803_FeedExchange')
BEGIN
    DECLARE @var572 sysname;
    SELECT @var572 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[MarginWalletTopupRequest]') AND [c].[name] = N'ApprovedBy');
    IF @var572 IS NOT NULL EXEC(N'ALTER TABLE [MarginWalletTopupRequest] DROP CONSTRAINT [' + @var572 + '];');
    ALTER TABLE [MarginWalletTopupRequest] ALTER COLUMN [ApprovedBy] bigint NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211095803_FeedExchange')
BEGIN
    CREATE TABLE [FeedLimitCounts] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [MethodID] bigint NOT NULL,
        [LimitCount] bigint NOT NULL,
        [UserID] bigint NOT NULL,
        CONSTRAINT [PK_FeedLimitCounts] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211095803_FeedExchange')
BEGIN
    CREATE TABLE [SocketFeedConfiguration] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [MethodID] bigint NOT NULL,
        [FeedLimitID] bigint NOT NULL,
        CONSTRAINT [PK_SocketFeedConfiguration] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211095803_FeedExchange')
BEGIN
    CREATE TABLE [SocketFeedLimits] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [MaxSize] bigint NOT NULL,
        [MinSize] bigint NOT NULL,
        [RowLenghtSize] bigint NOT NULL,
        [MaxRowCount] bigint NOT NULL,
        [MaxRecordCount] bigint NOT NULL,
        [MinRecordCount] bigint NOT NULL,
        [MaxLimit] bigint NOT NULL,
        [MinLimit] bigint NOT NULL,
        [LimitType] smallint NOT NULL,
        CONSTRAINT [PK_SocketFeedLimits] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211095803_FeedExchange')
BEGIN
    CREATE TABLE [SocketMethods] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [MethodName] nvarchar(30) NOT NULL,
        [ReturnMethodName] nvarchar(30) NOT NULL,
        [PublicOrPrivate] smallint NOT NULL,
        [EnumCode] smallint NOT NULL,
        CONSTRAINT [PK_SocketMethods] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211095803_FeedExchange')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190211095803_FeedExchange', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211105617_velocityRuleforUserRoleManagement')
BEGIN
    CREATE TABLE [FeildMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [FeildName] nvarchar(max) NULL,
        [SubModuleID] bigint NOT NULL,
        CONSTRAINT [PK_FeildMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211105617_velocityRuleforUserRoleManagement')
BEGIN
    CREATE TABLE [ModuleMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [ModuleName] nvarchar(max) NULL,
        CONSTRAINT [PK_ModuleMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211105617_velocityRuleforUserRoleManagement')
BEGIN
    CREATE TABLE [SubModuleMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [SubModuleName] nvarchar(max) NULL,
        [ModuleID] bigint NOT NULL,
        CONSTRAINT [PK_SubModuleMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211105617_velocityRuleforUserRoleManagement')
BEGIN
    CREATE TABLE [ToolMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [ToolName] nvarchar(max) NULL,
        [SubModuleID] bigint NOT NULL,
        CONSTRAINT [PK_ToolMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211105617_velocityRuleforUserRoleManagement')
BEGIN
    CREATE TABLE [UserAccessRights] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [UserID] bigint NOT NULL,
        CONSTRAINT [PK_UserAccessRights] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211105617_velocityRuleforUserRoleManagement')
BEGIN
    CREATE TABLE [UserAssignModule<long>] (
        [ModuleID] bigint NOT NULL IDENTITY,
        [ModuleName] nvarchar(max) NULL,
        [UserAccessRightsId] bigint NULL,
        CONSTRAINT [PK_UserAssignModule<long>] PRIMARY KEY ([ModuleID]),
        CONSTRAINT [FK_UserAssignModule<long>_UserAccessRights_UserAccessRightsId] FOREIGN KEY ([UserAccessRightsId]) REFERENCES [UserAccessRights] ([Id]) ON DELETE NO ACTION
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211105617_velocityRuleforUserRoleManagement')
BEGIN
    CREATE TABLE [UserAssignSubModule<long>] (
        [SubModuleID] bigint NOT NULL IDENTITY,
        [SubModuleName] nvarchar(max) NULL,
        [View] smallint NOT NULL,
        [Create] smallint NOT NULL,
        [Edit] smallint NOT NULL,
        [Delete] smallint NOT NULL,
        [UserAssignModule<long>ModuleID] bigint NULL,
        CONSTRAINT [PK_UserAssignSubModule<long>] PRIMARY KEY ([SubModuleID]),
        CONSTRAINT [FK_UserAssignSubModule<long>_UserAssignModule<long>_UserAssignModule<long>ModuleID] FOREIGN KEY ([UserAssignModule<long>ModuleID]) REFERENCES [UserAssignModule<long>] ([ModuleID]) ON DELETE NO ACTION
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211105617_velocityRuleforUserRoleManagement')
BEGIN
    CREATE TABLE [UserAssignFeildRights<long>] (
        [FeildID] bigint NOT NULL IDENTITY,
        [FeildName] nvarchar(max) NULL,
        [UserAssignSubModule<long>SubModuleID] bigint NULL,
        CONSTRAINT [PK_UserAssignFeildRights<long>] PRIMARY KEY ([FeildID]),
        CONSTRAINT [FK_UserAssignFeildRights<long>_UserAssignSubModule<long>_UserAssignSubModule<long>SubModuleID] FOREIGN KEY ([UserAssignSubModule<long>SubModuleID]) REFERENCES [UserAssignSubModule<long>] ([SubModuleID]) ON DELETE NO ACTION
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211105617_velocityRuleforUserRoleManagement')
BEGIN
    CREATE TABLE [UserAssignToolRights<long>] (
        [ToolID] bigint NOT NULL IDENTITY,
        [ToolName] nvarchar(max) NULL,
        [UserAssignSubModule<long>SubModuleID] bigint NULL,
        CONSTRAINT [PK_UserAssignToolRights<long>] PRIMARY KEY ([ToolID]),
        CONSTRAINT [FK_UserAssignToolRights<long>_UserAssignSubModule<long>_UserAssignSubModule<long>SubModuleID] FOREIGN KEY ([UserAssignSubModule<long>SubModuleID]) REFERENCES [UserAssignSubModule<long>] ([SubModuleID]) ON DELETE NO ACTION
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211105617_velocityRuleforUserRoleManagement')
BEGIN
    CREATE INDEX [IX_UserAssignFeildRights<long>_UserAssignSubModule<long>SubModuleID] ON [UserAssignFeildRights<long>] ([UserAssignSubModule<long>SubModuleID]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211105617_velocityRuleforUserRoleManagement')
BEGIN
    CREATE INDEX [IX_UserAssignModule<long>_UserAccessRightsId] ON [UserAssignModule<long>] ([UserAccessRightsId]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211105617_velocityRuleforUserRoleManagement')
BEGIN
    CREATE INDEX [IX_UserAssignSubModule<long>_UserAssignModule<long>ModuleID] ON [UserAssignSubModule<long>] ([UserAssignModule<long>ModuleID]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211105617_velocityRuleforUserRoleManagement')
BEGIN
    CREATE INDEX [IX_UserAssignToolRights<long>_UserAssignSubModule<long>SubModuleID] ON [UserAssignToolRights<long>] ([UserAssignSubModule<long>SubModuleID]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211105617_velocityRuleforUserRoleManagement')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190211105617_velocityRuleforUserRoleManagement', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211113533_velocityRuleforUserRoleManagementv1')
BEGIN
    ALTER TABLE [UserAssignModule<long>] DROP CONSTRAINT [FK_UserAssignModule<long>_UserAccessRights_UserAccessRightsId];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211113533_velocityRuleforUserRoleManagementv1')
BEGIN
    ALTER TABLE [UserAssignSubModule<long>] DROP CONSTRAINT [FK_UserAssignSubModule<long>_UserAssignModule<long>_UserAssignModule<long>ModuleID];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211113533_velocityRuleforUserRoleManagementv1')
BEGIN
    ALTER TABLE [UserAssignToolRights<long>] DROP CONSTRAINT [FK_UserAssignToolRights<long>_UserAssignSubModule<long>_UserAssignSubModule<long>SubModuleID];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211113533_velocityRuleforUserRoleManagementv1')
BEGIN
    DROP TABLE [FeildMaster];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211113533_velocityRuleforUserRoleManagementv1')
BEGIN
    DROP TABLE [UserAssignFeildRights<long>];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211113533_velocityRuleforUserRoleManagementv1')
BEGIN
    ALTER TABLE [UserAssignToolRights<long>] DROP CONSTRAINT [PK_UserAssignToolRights<long>];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211113533_velocityRuleforUserRoleManagementv1')
BEGIN
    ALTER TABLE [UserAssignSubModule<long>] DROP CONSTRAINT [PK_UserAssignSubModule<long>];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211113533_velocityRuleforUserRoleManagementv1')
BEGIN
    ALTER TABLE [UserAssignModule<long>] DROP CONSTRAINT [PK_UserAssignModule<long>];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211113533_velocityRuleforUserRoleManagementv1')
BEGIN
    EXEC sp_rename N'[UserAssignToolRights<long>]', N'UserAssignToolRights';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211113533_velocityRuleforUserRoleManagementv1')
BEGIN
    EXEC sp_rename N'[UserAssignSubModule<long>]', N'UserAssignSubModule';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211113533_velocityRuleforUserRoleManagementv1')
BEGIN
    EXEC sp_rename N'[UserAssignModule<long>]', N'UserAssignModule';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211113533_velocityRuleforUserRoleManagementv1')
BEGIN
    EXEC sp_rename N'[UserAssignToolRights].[IX_UserAssignToolRights<long>_UserAssignSubModule<long>SubModuleID]', N'IX_UserAssignToolRights_UserAssignSubModule<long>SubModuleID', N'INDEX';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211113533_velocityRuleforUserRoleManagementv1')
BEGIN
    EXEC sp_rename N'[UserAssignSubModule].[IX_UserAssignSubModule<long>_UserAssignModule<long>ModuleID]', N'IX_UserAssignSubModule_UserAssignModule<long>ModuleID', N'INDEX';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211113533_velocityRuleforUserRoleManagementv1')
BEGIN
    EXEC sp_rename N'[UserAssignModule].[IX_UserAssignModule<long>_UserAccessRightsId]', N'IX_UserAssignModule_UserAccessRightsId', N'INDEX';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211113533_velocityRuleforUserRoleManagementv1')
BEGIN
    ALTER TABLE [UserAssignToolRights] ADD CONSTRAINT [PK_UserAssignToolRights] PRIMARY KEY ([ToolID]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211113533_velocityRuleforUserRoleManagementv1')
BEGIN
    ALTER TABLE [UserAssignSubModule] ADD CONSTRAINT [PK_UserAssignSubModule] PRIMARY KEY ([SubModuleID]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211113533_velocityRuleforUserRoleManagementv1')
BEGIN
    ALTER TABLE [UserAssignModule] ADD CONSTRAINT [PK_UserAssignModule] PRIMARY KEY ([ModuleID]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211113533_velocityRuleforUserRoleManagementv1')
BEGIN
    CREATE TABLE [FieldMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [FieldName] nvarchar(max) NULL,
        [SubModuleID] bigint NOT NULL,
        CONSTRAINT [PK_FieldMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211113533_velocityRuleforUserRoleManagementv1')
BEGIN
    CREATE TABLE [UserAssignFieldRights] (
        [FieldID] bigint NOT NULL IDENTITY,
        [FieldName] nvarchar(max) NULL,
        [UserAssignSubModule<long>SubModuleID] bigint NULL,
        CONSTRAINT [PK_UserAssignFieldRights] PRIMARY KEY ([FieldID]),
        CONSTRAINT [FK_UserAssignFieldRights_UserAssignSubModule_UserAssignSubModule<long>SubModuleID] FOREIGN KEY ([UserAssignSubModule<long>SubModuleID]) REFERENCES [UserAssignSubModule] ([SubModuleID]) ON DELETE NO ACTION
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211113533_velocityRuleforUserRoleManagementv1')
BEGIN
    CREATE INDEX [IX_UserAssignFieldRights_UserAssignSubModule<long>SubModuleID] ON [UserAssignFieldRights] ([UserAssignSubModule<long>SubModuleID]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211113533_velocityRuleforUserRoleManagementv1')
BEGIN
    ALTER TABLE [UserAssignModule] ADD CONSTRAINT [FK_UserAssignModule_UserAccessRights_UserAccessRightsId] FOREIGN KEY ([UserAccessRightsId]) REFERENCES [UserAccessRights] ([Id]) ON DELETE NO ACTION;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211113533_velocityRuleforUserRoleManagementv1')
BEGIN
    ALTER TABLE [UserAssignSubModule] ADD CONSTRAINT [FK_UserAssignSubModule_UserAssignModule_UserAssignModule<long>ModuleID] FOREIGN KEY ([UserAssignModule<long>ModuleID]) REFERENCES [UserAssignModule] ([ModuleID]) ON DELETE NO ACTION;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211113533_velocityRuleforUserRoleManagementv1')
BEGIN
    ALTER TABLE [UserAssignToolRights] ADD CONSTRAINT [FK_UserAssignToolRights_UserAssignSubModule_UserAssignSubModule<long>SubModuleID] FOREIGN KEY ([UserAssignSubModule<long>SubModuleID]) REFERENCES [UserAssignSubModule] ([SubModuleID]) ON DELETE NO ACTION;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211113533_velocityRuleforUserRoleManagementv1')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190211113533_velocityRuleforUserRoleManagementv1', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211120018_velocityRuleforUserRoleManagementv2')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190211120018_velocityRuleforUserRoleManagementv2', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211121029_velocityRuleforUserRoleManagementv3')
BEGIN
    ALTER TABLE [UserAssignFieldRights] DROP CONSTRAINT [FK_UserAssignFieldRights_UserAssignSubModule_UserAssignSubModule<long>SubModuleID];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211121029_velocityRuleforUserRoleManagementv3')
BEGIN
    ALTER TABLE [UserAssignSubModule] DROP CONSTRAINT [FK_UserAssignSubModule_UserAssignModule_UserAssignModule<long>ModuleID];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211121029_velocityRuleforUserRoleManagementv3')
BEGIN
    ALTER TABLE [UserAssignToolRights] DROP CONSTRAINT [FK_UserAssignToolRights_UserAssignSubModule_UserAssignSubModule<long>SubModuleID];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211121029_velocityRuleforUserRoleManagementv3')
BEGIN
    EXEC sp_rename N'[UserAssignToolRights].[UserAssignSubModule<long>SubModuleID]', N'UserAssignSubModuleSubModuleID', N'COLUMN';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211121029_velocityRuleforUserRoleManagementv3')
BEGIN
    EXEC sp_rename N'[UserAssignToolRights].[IX_UserAssignToolRights_UserAssignSubModule<long>SubModuleID]', N'IX_UserAssignToolRights_UserAssignSubModuleSubModuleID', N'INDEX';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211121029_velocityRuleforUserRoleManagementv3')
BEGIN
    EXEC sp_rename N'[UserAssignSubModule].[UserAssignModule<long>ModuleID]', N'UserAssignModuleModuleID', N'COLUMN';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211121029_velocityRuleforUserRoleManagementv3')
BEGIN
    EXEC sp_rename N'[UserAssignSubModule].[IX_UserAssignSubModule_UserAssignModule<long>ModuleID]', N'IX_UserAssignSubModule_UserAssignModuleModuleID', N'INDEX';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211121029_velocityRuleforUserRoleManagementv3')
BEGIN
    EXEC sp_rename N'[UserAssignFieldRights].[UserAssignSubModule<long>SubModuleID]', N'UserAssignSubModuleSubModuleID', N'COLUMN';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211121029_velocityRuleforUserRoleManagementv3')
BEGIN
    EXEC sp_rename N'[UserAssignFieldRights].[IX_UserAssignFieldRights_UserAssignSubModule<long>SubModuleID]', N'IX_UserAssignFieldRights_UserAssignSubModuleSubModuleID', N'INDEX';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211121029_velocityRuleforUserRoleManagementv3')
BEGIN
    ALTER TABLE [UserAssignFieldRights] ADD CONSTRAINT [FK_UserAssignFieldRights_UserAssignSubModule_UserAssignSubModuleSubModuleID] FOREIGN KEY ([UserAssignSubModuleSubModuleID]) REFERENCES [UserAssignSubModule] ([SubModuleID]) ON DELETE NO ACTION;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211121029_velocityRuleforUserRoleManagementv3')
BEGIN
    ALTER TABLE [UserAssignSubModule] ADD CONSTRAINT [FK_UserAssignSubModule_UserAssignModule_UserAssignModuleModuleID] FOREIGN KEY ([UserAssignModuleModuleID]) REFERENCES [UserAssignModule] ([ModuleID]) ON DELETE NO ACTION;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211121029_velocityRuleforUserRoleManagementv3')
BEGIN
    ALTER TABLE [UserAssignToolRights] ADD CONSTRAINT [FK_UserAssignToolRights_UserAssignSubModule_UserAssignSubModuleSubModuleID] FOREIGN KEY ([UserAssignSubModuleSubModuleID]) REFERENCES [UserAssignSubModule] ([SubModuleID]) ON DELETE NO ACTION;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190211121029_velocityRuleforUserRoleManagementv3')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190211121029_velocityRuleforUserRoleManagementv3', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190212042655_addcolMarginChargePer')
BEGIN
    ALTER TABLE [BizUserRole] DROP CONSTRAINT [FK_BizUserRole_BizRoles_RoleId];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190212042655_addcolMarginChargePer')
BEGIN
    ALTER TABLE [BizUserRole] DROP CONSTRAINT [FK_BizUserRole_BizUser_UserId];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190212042655_addcolMarginChargePer')
BEGIN
    ALTER TABLE [BizUserRole] DROP CONSTRAINT [PK_BizUserRole];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190212042655_addcolMarginChargePer')
BEGIN
    EXEC sp_rename N'[BizUserRole]', N'UserRoleMapping';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190212042655_addcolMarginChargePer')
BEGIN
    EXEC sp_rename N'[UserRoleMapping].[IX_BizUserRole_RoleId]', N'IX_UserRoleMapping_RoleId', N'INDEX';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190212042655_addcolMarginChargePer')
BEGIN
    ALTER TABLE [LeverageMaster] ADD [MarginChargePer] decimal(28, 18) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190212042655_addcolMarginChargePer')
BEGIN
    ALTER TABLE [UserRoleMapping] ADD CONSTRAINT [PK_UserRoleMapping] PRIMARY KEY ([UserId], [RoleId]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190212042655_addcolMarginChargePer')
BEGIN
    CREATE TABLE [RoleHistory] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [ModificationDetail] nvarchar(250) NOT NULL,
        [UserId] bigint NOT NULL,
        [Module] int NOT NULL,
        [IPAddress] nvarchar(max) NULL,
        CONSTRAINT [PK_RoleHistory] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190212042655_addcolMarginChargePer')
BEGIN
    CREATE TABLE [RoleMaster] (
        [Id] int NOT NULL IDENTITY,
        [Name] nvarchar(max) NULL,
        [NormalizedName] nvarchar(max) NULL,
        [ConcurrencyStamp] nvarchar(max) NULL,
        [RoleDescription] nvarchar(250) NULL,
        [PermissionGroupID] bigint NOT NULL,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        CONSTRAINT [PK_RoleMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190212042655_addcolMarginChargePer')
BEGIN
    ALTER TABLE [UserRoleMapping] ADD CONSTRAINT [FK_UserRoleMapping_BizRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [BizRoles] ([Id]) ON DELETE CASCADE;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190212042655_addcolMarginChargePer')
BEGIN
    ALTER TABLE [UserRoleMapping] ADD CONSTRAINT [FK_UserRoleMapping_BizUser_UserId] FOREIGN KEY ([UserId]) REFERENCES [BizUser] ([Id]) ON DELETE CASCADE;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190212042655_addcolMarginChargePer')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190212042655_addcolMarginChargePer', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190212045452_removeUserrolemapping')
BEGIN
    ALTER TABLE [UserRoleMapping] DROP CONSTRAINT [FK_UserRoleMapping_BizRoles_RoleId];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190212045452_removeUserrolemapping')
BEGIN
    ALTER TABLE [UserRoleMapping] DROP CONSTRAINT [FK_UserRoleMapping_BizUser_UserId];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190212045452_removeUserrolemapping')
BEGIN
    ALTER TABLE [UserRoleMapping] DROP CONSTRAINT [PK_UserRoleMapping];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190212045452_removeUserrolemapping')
BEGIN
    EXEC sp_rename N'[UserRoleMapping]', N'BizUserRole';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190212045452_removeUserrolemapping')
BEGIN
    EXEC sp_rename N'[BizUserRole].[IX_UserRoleMapping_RoleId]', N'IX_BizUserRole_RoleId', N'INDEX';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190212045452_removeUserrolemapping')
BEGIN
    ALTER TABLE [BizUserRole] ADD CONSTRAINT [PK_BizUserRole] PRIMARY KEY ([UserId], [RoleId]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190212045452_removeUserrolemapping')
BEGIN
    ALTER TABLE [BizUserRole] ADD CONSTRAINT [FK_BizUserRole_BizRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [BizRoles] ([Id]) ON DELETE CASCADE;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190212045452_removeUserrolemapping')
BEGIN
    ALTER TABLE [BizUserRole] ADD CONSTRAINT [FK_BizUserRole_BizUser_UserId] FOREIGN KEY ([UserId]) REFERENCES [BizUser] ([Id]) ON DELETE CASCADE;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190212045452_removeUserrolemapping')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190212045452_removeUserrolemapping', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190212055954_addnewcolWalletTrnLimitConfiguration')
BEGIN
    ALTER TABLE [WalletTrnLimitConfiguration] ADD [HourlyTrnAmount] decimal(28, 18) NOT NULL DEFAULT 0.0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190212055954_addnewcolWalletTrnLimitConfiguration')
BEGIN
    ALTER TABLE [WalletTrnLimitConfiguration] ADD [HourlyTrnCount] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190212055954_addnewcolWalletTrnLimitConfiguration')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190212055954_addnewcolWalletTrnLimitConfiguration', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190212082357_VelocityruleRemovePrimarykey')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190212082357_VelocityruleRemovePrimarykey', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190212101542_VelocityruleRemovePrimarykeyv1')
BEGIN
    DROP TABLE [UserAssignFieldRights];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190212101542_VelocityruleRemovePrimarykeyv1')
BEGIN
    DROP TABLE [UserAssignToolRights];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190212101542_VelocityruleRemovePrimarykeyv1')
BEGIN
    DROP TABLE [UserAssignSubModule];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190212101542_VelocityruleRemovePrimarykeyv1')
BEGIN
    DROP TABLE [UserAssignModule];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190212101542_VelocityruleRemovePrimarykeyv1')
BEGIN
    DROP TABLE [UserAccessRights];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190212101542_VelocityruleRemovePrimarykeyv1')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190212101542_VelocityruleRemovePrimarykeyv1', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190212102004_VelocityruleRemovePrimarykeyv2')
BEGIN
    CREATE TABLE [UserAccessRights] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [UserID] bigint NOT NULL,
        CONSTRAINT [PK_UserAccessRights] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190212102004_VelocityruleRemovePrimarykeyv2')
BEGIN
    CREATE TABLE [UserAssignModule] (
        [ID] bigint NOT NULL IDENTITY,
        [ModuleID] bigint NOT NULL,
        [ModuleName] nvarchar(max) NULL,
        [UserAccessRightsId] bigint NULL,
        CONSTRAINT [PK_UserAssignModule] PRIMARY KEY ([ID]),
        CONSTRAINT [FK_UserAssignModule_UserAccessRights_UserAccessRightsId] FOREIGN KEY ([UserAccessRightsId]) REFERENCES [UserAccessRights] ([Id]) ON DELETE NO ACTION
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190212102004_VelocityruleRemovePrimarykeyv2')
BEGIN
    CREATE TABLE [UserAssignSubModule] (
        [ID] bigint NOT NULL IDENTITY,
        [SubModuleID] bigint NOT NULL,
        [SubModuleName] nvarchar(max) NULL,
        [View] smallint NOT NULL,
        [Create] smallint NOT NULL,
        [Edit] smallint NOT NULL,
        [Delete] smallint NOT NULL,
        [UserAssignModuleID] bigint NULL,
        CONSTRAINT [PK_UserAssignSubModule] PRIMARY KEY ([ID]),
        CONSTRAINT [FK_UserAssignSubModule_UserAssignModule_UserAssignModuleID] FOREIGN KEY ([UserAssignModuleID]) REFERENCES [UserAssignModule] ([ID]) ON DELETE NO ACTION
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190212102004_VelocityruleRemovePrimarykeyv2')
BEGIN
    CREATE TABLE [UserAssignFieldRights] (
        [ID] bigint NOT NULL IDENTITY,
        [FieldID] bigint NOT NULL,
        [FieldName] nvarchar(max) NULL,
        [UserAssignSubModuleID] bigint NULL,
        CONSTRAINT [PK_UserAssignFieldRights] PRIMARY KEY ([ID]),
        CONSTRAINT [FK_UserAssignFieldRights_UserAssignSubModule_UserAssignSubModuleID] FOREIGN KEY ([UserAssignSubModuleID]) REFERENCES [UserAssignSubModule] ([ID]) ON DELETE NO ACTION
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190212102004_VelocityruleRemovePrimarykeyv2')
BEGIN
    CREATE TABLE [UserAssignToolRights] (
        [ID] bigint NOT NULL IDENTITY,
        [ToolID] bigint NOT NULL,
        [ToolName] nvarchar(max) NULL,
        [UserAssignSubModuleID] bigint NULL,
        CONSTRAINT [PK_UserAssignToolRights] PRIMARY KEY ([ID]),
        CONSTRAINT [FK_UserAssignToolRights_UserAssignSubModule_UserAssignSubModuleID] FOREIGN KEY ([UserAssignSubModuleID]) REFERENCES [UserAssignSubModule] ([ID]) ON DELETE NO ACTION
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190212102004_VelocityruleRemovePrimarykeyv2')
BEGIN
    CREATE INDEX [IX_UserAssignFieldRights_UserAssignSubModuleID] ON [UserAssignFieldRights] ([UserAssignSubModuleID]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190212102004_VelocityruleRemovePrimarykeyv2')
BEGIN
    CREATE INDEX [IX_UserAssignModule_UserAccessRightsId] ON [UserAssignModule] ([UserAccessRightsId]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190212102004_VelocityruleRemovePrimarykeyv2')
BEGIN
    CREATE INDEX [IX_UserAssignSubModule_UserAssignModuleID] ON [UserAssignSubModule] ([UserAssignModuleID]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190212102004_VelocityruleRemovePrimarykeyv2')
BEGIN
    CREATE INDEX [IX_UserAssignToolRights_UserAssignSubModuleID] ON [UserAssignToolRights] ([UserAssignSubModuleID]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190212102004_VelocityruleRemovePrimarykeyv2')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190212102004_VelocityruleRemovePrimarykeyv2', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190212125242_addAffiliateEntity')
BEGIN
    CREATE TABLE [AffiliateLinkClick] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [AffiliateUserId] bigint NOT NULL,
        [PromotionTypeId] bigint NOT NULL,
        [LinkDetail] nvarchar(max) NULL,
        CONSTRAINT [PK_AffiliateLinkClick] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190212125242_addAffiliateEntity')
BEGIN
    CREATE TABLE [AffiliatePromotionMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [PromotionType] nvarchar(max) NULL,
        CONSTRAINT [PK_AffiliatePromotionMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190212125242_addAffiliateEntity')
BEGIN
    CREATE TABLE [AffiliatePromotionShare] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [AffiliateUserId] bigint NOT NULL,
        [PromotionTypeId] bigint NOT NULL,
        [PromotionDetail] nvarchar(max) NULL,
        CONSTRAINT [PK_AffiliatePromotionShare] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190212125242_addAffiliateEntity')
BEGIN
    CREATE TABLE [AffiliatePromotionUserTypeMapping] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [AffiliateUserId] bigint NOT NULL,
        [PromotionTypeId] bigint NOT NULL,
        CONSTRAINT [PK_AffiliatePromotionUserTypeMapping] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190212125242_addAffiliateEntity')
BEGIN
    CREATE TABLE [AffiliateSchemeDetail] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [SchemeMappingId] bigint NOT NULL,
        [Level] int NOT NULL,
        [MinimumValue] decimal(28, 18) NOT NULL,
        [MaximumValue] decimal(28, 18) NOT NULL,
        [CreditWalletTypeId] bigint NOT NULL,
        [CommissionType] int NOT NULL,
        [CommissionValue] decimal(28, 18) NOT NULL,
        [DistributionType] int NOT NULL,
        CONSTRAINT [PK_AffiliateSchemeDetail] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190212125242_addAffiliateEntity')
BEGIN
    CREATE TABLE [AffiliateSchemeMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [SchemeType] nvarchar(max) NOT NULL,
        [SchemeName] nvarchar(max) NOT NULL,
        CONSTRAINT [PK_AffiliateSchemeMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190212125242_addAffiliateEntity')
BEGIN
    CREATE TABLE [AffiliateSchemeTypeMapping] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [SchemeMstId] bigint NOT NULL,
        [SchemeTypeMstId] bigint NOT NULL,
        [MinimumDepositionRequired] decimal(28, 18) NOT NULL,
        [DepositWalletTypeId] bigint NOT NULL,
        [CommissionTypeInterval] int NOT NULL,
        [Description] nvarchar(max) NULL,
        CONSTRAINT [PK_AffiliateSchemeTypeMapping] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190212125242_addAffiliateEntity')
BEGIN
    CREATE TABLE [AffiliateSchemeTypeMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [SchemeTypeName] nvarchar(max) NOT NULL,
        [Description] nvarchar(max) NULL,
        CONSTRAINT [PK_AffiliateSchemeTypeMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190212125242_addAffiliateEntity')
BEGIN
    CREATE TABLE [AffiliateUserMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [UserId] bigint NOT NULL,
        [ParentId] bigint NOT NULL,
        [UserBit] bigint NOT NULL,
        [SchemeMstId] bigint NOT NULL,
        CONSTRAINT [PK_AffiliateUserMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190212125242_addAffiliateEntity')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190212125242_addAffiliateEntity', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190213060325_addLimitDesc')
BEGIN
    ALTER TABLE [SocketFeedLimits] ADD [LimitDesc] nvarchar(50) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190213060325_addLimitDesc')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190213060325_addLimitDesc', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190213120455_Affiliate_User_Promotion')
BEGIN
    ALTER TABLE [AffiliateUserMaster] ADD [PromotionTypeId] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190213120455_Affiliate_User_Promotion')
BEGIN
    ALTER TABLE [AffiliateUserMaster] ADD [ReferCode] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190213120455_Affiliate_User_Promotion')
BEGIN
    ALTER TABLE [AffiliatePromotionUserTypeMapping] ADD [DecryptedCode] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190213120455_Affiliate_User_Promotion')
BEGIN
    ALTER TABLE [AffiliatePromotionUserTypeMapping] ADD [PromotionLink] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190213120455_Affiliate_User_Promotion')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190213120455_Affiliate_User_Promotion', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190214113036_leveragecharge')
BEGIN
    ALTER TABLE [LeverageMaster] ADD [LeverageChargeDeductionType] int NOT NULL DEFAULT 0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190214113036_leveragecharge')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190214113036_leveragecharge', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190215055955_RefrralSystem')
BEGIN
    ALTER TABLE [BizUser] ADD [ReferralCode] nvarchar(8) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190215055955_RefrralSystem')
BEGIN
    CREATE TABLE [ReferralChannel] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [UserId] int NOT NULL,
        [ReferralChannelTypeId] int NOT NULL,
        [ReferralChannelServiceId] int NOT NULL,
        [ReferralReceiverAddress] nvarchar(1000) NULL,
        CONSTRAINT [PK_ReferralChannel] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190215055955_RefrralSystem')
BEGIN
    CREATE TABLE [ReferralChannelType] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [ChannelTypeName] nvarchar(100) NOT NULL,
        CONSTRAINT [PK_ReferralChannelType] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190215055955_RefrralSystem')
BEGIN
    CREATE TABLE [ReferralPayType] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [PayTypeName] nvarchar(50) NOT NULL,
        CONSTRAINT [PK_ReferralPayType] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190215055955_RefrralSystem')
BEGIN
    CREATE TABLE [ReferralService] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [ReferralServiceTypeId] int NOT NULL,
        [ReferralPayTypeId] int NOT NULL,
        [CurrencyId] bigint NOT NULL,
        [Description] nvarchar(max) NOT NULL,
        [ReferMinCount] int NOT NULL,
        [ReferMaxCount] int NOT NULL,
        [BenefitPay] decimal(18, 2) NOT NULL,
        [ExpireDate] datetime2 NOT NULL,
        CONSTRAINT [PK_ReferralService] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190215055955_RefrralSystem')
BEGIN
    CREATE TABLE [ReferralServiceType] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [ServiceTypeName] nvarchar(256) NOT NULL,
        CONSTRAINT [PK_ReferralServiceType] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190215055955_RefrralSystem')
BEGIN
    CREATE TABLE [ReferralUser] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [UserId] int NOT NULL,
        [ReferUserId] int NOT NULL,
        [ReferralServiceId] int NOT NULL,
        CONSTRAINT [PK_ReferralUser] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190215055955_RefrralSystem')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190215055955_RefrralSystem', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190215110243_MarginTrading')
BEGIN
    CREATE TABLE [ServiceMasterMargin] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Name] nvarchar(30) NOT NULL,
        [SMSCode] nvarchar(6) NOT NULL,
        [ServiceType] smallint NOT NULL,
        [LimitId] bigint NOT NULL,
        [WalletTypeID] bigint NOT NULL,
        CONSTRAINT [PK_ServiceMasterMargin] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190215110243_MarginTrading')
BEGIN
    CREATE TABLE [SettledTradeTransactionQueueMargin] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [TrnNo] bigint NOT NULL,
        [TrnDate] datetime2 NOT NULL,
        [MemberID] bigint NOT NULL,
        [TrnType] smallint NOT NULL,
        [TrnTypeName] nvarchar(max) NULL,
        [PairID] bigint NOT NULL,
        [PairName] nvarchar(max) NOT NULL,
        [OrderWalletID] bigint NOT NULL,
        [OrderAccountID] nvarchar(max) NULL,
        [DeliveryWalletID] bigint NOT NULL,
        [DeliveryAccountID] nvarchar(max) NULL,
        [BuyQty] decimal(28, 18) NOT NULL,
        [BidPrice] decimal(28, 18) NOT NULL,
        [SellQty] decimal(28, 18) NOT NULL,
        [AskPrice] decimal(28, 18) NOT NULL,
        [Order_Currency] nvarchar(max) NULL,
        [OrderTotalQty] decimal(28, 18) NOT NULL,
        [Delivery_Currency] nvarchar(max) NULL,
        [DeliveryTotalQty] decimal(28, 18) NOT NULL,
        [StatusCode] bigint NOT NULL,
        [StatusMsg] nvarchar(max) NULL,
        [TrnRefNo] bigint NULL,
        [IsCancelled] smallint NOT NULL,
        [SettledBuyQty] decimal(28, 18) NOT NULL,
        [SettledSellQty] decimal(28, 18) NOT NULL,
        [SettledDate] datetime2 NULL,
        [TakerPer] decimal(28, 18) NOT NULL,
        CONSTRAINT [PK_SettledTradeTransactionQueueMargin] PRIMARY KEY ([TrnNo])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190215110243_MarginTrading')
BEGIN
    CREATE TABLE [TradeBuyerListMarginV1] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [TrnNo] bigint NOT NULL,
        [PairID] bigint NOT NULL,
        [PairName] nvarchar(max) NULL,
        [Price] decimal(28, 18) NOT NULL,
        [Qty] decimal(28, 18) NOT NULL,
        [DeliveredQty] decimal(28, 18) NOT NULL,
        [RemainQty] decimal(28, 18) NOT NULL,
        [OrderType] smallint NOT NULL,
        [IsProcessing] smallint NOT NULL,
        [IsAPITrade] smallint NOT NULL,
        CONSTRAINT [PK_TradeBuyerListMarginV1] PRIMARY KEY ([TrnNo])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190215110243_MarginTrading')
BEGIN
    CREATE TABLE [TradePairDetailMargin] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [PairId] bigint NOT NULL,
        [BuyMinQty] decimal(28, 18) NOT NULL,
        [BuyMaxQty] decimal(28, 18) NOT NULL,
        [SellMinQty] decimal(28, 18) NOT NULL,
        [SellMaxQty] decimal(28, 18) NOT NULL,
        [SellPrice] decimal(28, 18) NOT NULL,
        [BuyPrice] decimal(28, 18) NOT NULL,
        [BuyMinPrice] decimal(28, 18) NOT NULL,
        [BuyMaxPrice] decimal(28, 18) NOT NULL,
        [SellMinPrice] decimal(28, 18) NOT NULL,
        [SellMaxPrice] decimal(28, 18) NOT NULL,
        [BuyFees] decimal(28, 18) NOT NULL,
        [SellFees] decimal(28, 18) NOT NULL,
        [FeesCurrency] nvarchar(max) NOT NULL,
        [ChargeType] smallint NULL,
        [OpenOrderExpiration] bigint NULL,
        [IsMarketTicker] int NOT NULL,
        CONSTRAINT [PK_TradePairDetailMargin] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190215110243_MarginTrading')
BEGIN
    CREATE TABLE [TradePairMasterMargin] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL,
        [PairName] nvarchar(max) NOT NULL,
        [SecondaryCurrencyId] bigint NOT NULL,
        [WalletMasterID] bigint NOT NULL,
        [BaseCurrencyId] bigint NOT NULL,
        CONSTRAINT [PK_TradePairMasterMargin] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190215110243_MarginTrading')
BEGIN
    CREATE TABLE [TradePairStasticsMargin] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [PairId] bigint NOT NULL,
        [CurrentRate] decimal(28, 18) NOT NULL,
        [LTP] decimal(28, 18) NOT NULL,
        [ChangePer24] decimal(28, 18) NOT NULL,
        [ChangeVol24] decimal(28, 18) NOT NULL,
        [High24Hr] decimal(28, 18) NOT NULL,
        [Low24Hr] decimal(28, 18) NOT NULL,
        [HighWeek] decimal(28, 18) NOT NULL,
        [LowWeek] decimal(28, 18) NOT NULL,
        [High52Week] decimal(28, 18) NOT NULL,
        [Low52Week] decimal(28, 18) NOT NULL,
        [CurrencyPrice] decimal(28, 18) NOT NULL,
        [UpDownBit] smallint NOT NULL,
        [TranDate] datetime2 NOT NULL,
        [ChangeValue] decimal(28, 18) NOT NULL,
        [CronDate] datetime2 NOT NULL,
        CONSTRAINT [PK_TradePairStasticsMargin] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190215110243_MarginTrading')
BEGIN
    CREATE TABLE [TradePoolQueueMarginV1] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [PairID] bigint NOT NULL,
        [MakerTrnNo] bigint NOT NULL,
        [MakerType] nvarchar(max) NULL,
        [MakerPrice] decimal(28, 18) NOT NULL,
        [MakerQty] decimal(28, 18) NOT NULL,
        [TakerTrnNo] bigint NOT NULL,
        [TakerType] nvarchar(max) NULL,
        [TakerPrice] decimal(28, 18) NOT NULL,
        [TakerQty] decimal(28, 18) NOT NULL,
        [TakerDisc] decimal(28, 18) NOT NULL,
        [TakerLoss] decimal(28, 18) NOT NULL,
        [IsAPITrade] smallint NOT NULL,
        CONSTRAINT [PK_TradePoolQueueMarginV1] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190215110243_MarginTrading')
BEGIN
    CREATE TABLE [TradeSellerListMarginV1] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [TrnNo] bigint NOT NULL,
        [PairID] bigint NOT NULL,
        [PairName] nvarchar(max) NULL,
        [Price] decimal(28, 18) NOT NULL,
        [Qty] decimal(28, 18) NOT NULL,
        [ReleasedQty] decimal(28, 18) NOT NULL,
        [SelledQty] decimal(28, 18) NOT NULL,
        [RemainQty] decimal(28, 18) NOT NULL,
        [OrderType] smallint NOT NULL,
        [IsProcessing] smallint NOT NULL,
        [IsAPITrade] smallint NOT NULL,
        CONSTRAINT [PK_TradeSellerListMarginV1] PRIMARY KEY ([TrnNo])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190215110243_MarginTrading')
BEGIN
    CREATE TABLE [TradeStopLossMargin] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [TrnNo] bigint NOT NULL,
        [ordertype] smallint NOT NULL,
        [StopPrice] decimal(28, 18) NOT NULL,
        [LTP] decimal(28, 18) NOT NULL,
        [RangeMin] decimal(28, 18) NOT NULL,
        [RangeMax] decimal(28, 18) NOT NULL,
        [MarketIndicator] smallint NOT NULL,
        [PairID] bigint NOT NULL,
        [ISFollowersReq] smallint NOT NULL,
        [FollowingTo] bigint NOT NULL,
        [LeaderTrnNo] bigint NOT NULL,
        [FollowTradeType] nvarchar(max) NULL,
        CONSTRAINT [PK_TradeStopLossMargin] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190215110243_MarginTrading')
BEGIN
    CREATE TABLE [TradeTransactionQueueMargin] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [TrnNo] bigint NOT NULL,
        [TrnDate] datetime2 NOT NULL,
        [MemberID] bigint NOT NULL,
        [TrnType] smallint NOT NULL,
        [TrnTypeName] nvarchar(max) NULL,
        [PairID] bigint NOT NULL,
        [PairName] nvarchar(max) NOT NULL,
        [OrderWalletID] bigint NOT NULL,
        [OrderAccountID] nvarchar(max) NULL,
        [DeliveryWalletID] bigint NOT NULL,
        [DeliveryAccountID] nvarchar(max) NULL,
        [BuyQty] decimal(28, 18) NOT NULL,
        [BidPrice] decimal(28, 18) NOT NULL,
        [SellQty] decimal(28, 18) NOT NULL,
        [AskPrice] decimal(28, 18) NOT NULL,
        [Order_Currency] nvarchar(max) NULL,
        [OrderTotalQty] decimal(28, 18) NOT NULL,
        [Delivery_Currency] nvarchar(max) NULL,
        [DeliveryTotalQty] decimal(28, 18) NOT NULL,
        [StatusCode] bigint NOT NULL,
        [StatusMsg] nvarchar(max) NULL,
        [IsCancelled] smallint NOT NULL,
        [SettledBuyQty] decimal(28, 18) NOT NULL,
        [SettledSellQty] decimal(28, 18) NOT NULL,
        [SettledDate] datetime2 NULL,
        [ordertype] smallint NOT NULL,
        [IsAPITrade] smallint NOT NULL,
        [IsExpired] smallint NOT NULL,
        [APIStatus] nvarchar(max) NULL,
        [IsAPICancelled] smallint NOT NULL,
        CONSTRAINT [PK_TradeTransactionQueueMargin] PRIMARY KEY ([TrnNo])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190215110243_MarginTrading')
BEGIN
    CREATE TABLE [TransactionQueueMargin] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [GUID] uniqueidentifier NOT NULL,
        [TrnDate] datetime2 NOT NULL,
        [TrnMode] smallint NOT NULL,
        [TrnType] smallint NOT NULL,
        [MemberID] bigint NOT NULL,
        [MemberMobile] nvarchar(max) NULL,
        [SMSCode] nvarchar(10) NOT NULL,
        [TransactionAccount] nvarchar(200) NOT NULL,
        [Amount] decimal(28, 18) NOT NULL,
        [ServiceID] bigint NOT NULL,
        [SerProID] bigint NOT NULL,
        [ProductID] bigint NOT NULL,
        [RouteID] bigint NOT NULL,
        [StatusCode] bigint NOT NULL,
        [StatusMsg] nvarchar(max) NULL,
        [VerifyDone] smallint NOT NULL,
        [TrnRefNo] nvarchar(max) NULL,
        [AdditionalInfo] nvarchar(max) NULL,
        [ChargePer] decimal(28, 18) NULL,
        [ChargeRs] decimal(28, 18) NULL,
        [ChargeType] smallint NULL,
        [DebitAccountID] nvarchar(max) NULL,
        [IsVerified] smallint NOT NULL,
        [IsInternalTrn] smallint NOT NULL,
        [EmailSendDate] datetime2 NOT NULL,
        [CallStatus] smallint NOT NULL,
        CONSTRAINT [PK_TransactionQueueMargin] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190215110243_MarginTrading')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190215110243_MarginTrading', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190215120350_AccessPermissionGroup')
BEGIN
    DECLARE @var573 sysname;
    SELECT @var573 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[UserAssignToolRights]') AND [c].[name] = N'ToolName');
    IF @var573 IS NOT NULL EXEC(N'ALTER TABLE [UserAssignToolRights] DROP CONSTRAINT [' + @var573 + '];');
    ALTER TABLE [UserAssignToolRights] DROP COLUMN [ToolName];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190215120350_AccessPermissionGroup')
BEGIN
    DECLARE @var574 sysname;
    SELECT @var574 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[UserAssignSubModule]') AND [c].[name] = N'SubModuleName');
    IF @var574 IS NOT NULL EXEC(N'ALTER TABLE [UserAssignSubModule] DROP CONSTRAINT [' + @var574 + '];');
    ALTER TABLE [UserAssignSubModule] DROP COLUMN [SubModuleName];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190215120350_AccessPermissionGroup')
BEGIN
    DECLARE @var575 sysname;
    SELECT @var575 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[UserAssignModule]') AND [c].[name] = N'ModuleName');
    IF @var575 IS NOT NULL EXEC(N'ALTER TABLE [UserAssignModule] DROP CONSTRAINT [' + @var575 + '];');
    ALTER TABLE [UserAssignModule] DROP COLUMN [ModuleName];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190215120350_AccessPermissionGroup')
BEGIN
    DECLARE @var576 sysname;
    SELECT @var576 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[UserAssignFieldRights]') AND [c].[name] = N'FieldName');
    IF @var576 IS NOT NULL EXEC(N'ALTER TABLE [UserAssignFieldRights] DROP CONSTRAINT [' + @var576 + '];');
    ALTER TABLE [UserAssignFieldRights] DROP COLUMN [FieldName];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190215120350_AccessPermissionGroup')
BEGIN
    ALTER TABLE [UserAssignToolRights] ADD [Status] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190215120350_AccessPermissionGroup')
BEGIN
    ALTER TABLE [UserAssignSubModule] ADD [Status] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190215120350_AccessPermissionGroup')
BEGIN
    ALTER TABLE [UserAssignModule] ADD [Status] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190215120350_AccessPermissionGroup')
BEGIN
    ALTER TABLE [UserAssignFieldRights] ADD [Status] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190215120350_AccessPermissionGroup')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190215120350_AccessPermissionGroup', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190218064903_aaBackgroundCallMasterEntity')
BEGIN
    CREATE TABLE [BackgroundCallMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [BathNo] nvarchar(max) NOT NULL,
        [BgTaskType] smallint NOT NULL,
        [BgTaskCallDate] datetime2 NOT NULL,
        [Remarks] nvarchar(max) NOT NULL,
        CONSTRAINT [PK_BackgroundCallMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190218064903_aaBackgroundCallMasterEntity')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190218064903_aaBackgroundCallMasterEntity', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190219065146_APIConfiguration')
BEGIN
    EXEC sp_rename N'[ReferralService].[BenefitPay]', N'RewardsPay', N'COLUMN';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190219065146_APIConfiguration')
BEGIN
    ALTER TABLE [ReferralService] ADD [ActiveDate] datetime2 NOT NULL DEFAULT '0001-01-01T00:00:00.0000000';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190219065146_APIConfiguration')
BEGIN
    CREATE TABLE [APIPlanDetail] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [APIPlanMasterID] bigint NOT NULL,
        [MaxPerMinute] bigint NOT NULL,
        [MaxPerDay] bigint NOT NULL,
        [MaxPerMonth] bigint NOT NULL,
        [MaxOrderPerSec] bigint NOT NULL,
        [MaxRecPerRequest] bigint NOT NULL,
        [MaxReqSize] bigint NOT NULL,
        [MaxResSize] bigint NOT NULL,
        [WhitelistedEndPoints] int NOT NULL,
        [ConcurrentEndPoints] int NOT NULL,
        [HistoricalDataMonth] int NOT NULL,
        CONSTRAINT [PK_APIPlanDetail] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190219065146_APIConfiguration')
BEGIN
    CREATE TABLE [APIPlanMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [PlanName] nvarchar(50) NOT NULL,
        [Price] decimal(18, 8) NOT NULL,
        [Charge] decimal(18, 8) NOT NULL,
        [PlanValidity] datetime2 NOT NULL,
        [PlanDesc] nvarchar(max) NULL,
        CONSTRAINT [PK_APIPlanMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190219065146_APIConfiguration')
BEGIN
    CREATE TABLE [APIPlanMethodConfiguration] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [RestMethodID] bigint NOT NULL,
        [APIPlanMasterID] bigint NOT NULL,
        CONSTRAINT [PK_APIPlanMethodConfiguration] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190219065146_APIConfiguration')
BEGIN
    CREATE TABLE [RestMethods] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [MethodName] nvarchar(50) NOT NULL,
        [IsReadOnly] smallint NOT NULL,
        [IsFullAccess] smallint NOT NULL,
        CONSTRAINT [PK_RestMethods] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190219065146_APIConfiguration')
BEGIN
    CREATE TABLE [UserAPIKeyDetails] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [AliasName] nvarchar(50) NOT NULL,
        [APIPermission] smallint NOT NULL,
        [SecretKey] nvarchar(max) NULL,
        [APIKey] nvarchar(max) NULL,
        [IPAccess] smallint NOT NULL,
        [APIPlanMasterID] bigint NOT NULL,
        [APIPlanDeatilID] bigint NOT NULL,
        [ExpireDate] datetime2 NOT NULL,
        [UserID] bigint NOT NULL,
        CONSTRAINT [PK_UserAPIKeyDetails] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190219065146_APIConfiguration')
BEGIN
    CREATE TABLE [WhiteListIPEndPoint] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [APIKeyDetailsID] bigint NOT NULL,
        [APIPlanDeatilID] bigint NOT NULL,
        [IPAddress] nvarchar(max) NULL,
        [UserID] nvarchar(max) NULL,
        CONSTRAINT [PK_WhiteListIPEndPoint] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190219065146_APIConfiguration')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190219065146_APIConfiguration', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190219094504_APIConfigurationV1')
BEGIN
    DECLARE @var577 sysname;
    SELECT @var577 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[APIPlanMaster]') AND [c].[name] = N'Price');
    IF @var577 IS NOT NULL EXEC(N'ALTER TABLE [APIPlanMaster] DROP CONSTRAINT [' + @var577 + '];');
    ALTER TABLE [APIPlanMaster] ALTER COLUMN [Price] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190219094504_APIConfigurationV1')
BEGIN
    DECLARE @var578 sysname;
    SELECT @var578 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[APIPlanMaster]') AND [c].[name] = N'Charge');
    IF @var578 IS NOT NULL EXEC(N'ALTER TABLE [APIPlanMaster] DROP CONSTRAINT [' + @var578 + '];');
    ALTER TABLE [APIPlanMaster] ALTER COLUMN [Charge] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190219094504_APIConfigurationV1')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190219094504_APIConfigurationV1', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190219095325_APIConfigurationV2')
BEGIN
    DECLARE @var579 sysname;
    SELECT @var579 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[APIPlanMaster]') AND [c].[name] = N'PlanValidity');
    IF @var579 IS NOT NULL EXEC(N'ALTER TABLE [APIPlanMaster] DROP CONSTRAINT [' + @var579 + '];');
    ALTER TABLE [APIPlanMaster] DROP COLUMN [PlanValidity];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190219095325_APIConfigurationV2')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190219095325_APIConfigurationV2', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190219095518_APIConfigurationV3')
BEGIN
    ALTER TABLE [APIPlanMaster] ADD [PlanValidity] int NOT NULL DEFAULT 0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190219095518_APIConfigurationV3')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190219095518_APIConfigurationV3', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190219112154_AffiliatePromotionUserTypeMapping_ShortLink')
BEGIN
    ALTER TABLE [AffiliatePromotionUserTypeMapping] ADD [ShortLink] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190219112154_AffiliatePromotionUserTypeMapping_ShortLink')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190219112154_AffiliatePromotionUserTypeMapping_ShortLink', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190220073934_ForAddUserAssignModuleNameColumn')
BEGIN
    EXEC sp_rename N'[UserAccessRights].[UserID]', N'GroupID', N'COLUMN';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190220073934_ForAddUserAssignModuleNameColumn')
BEGIN
    ALTER TABLE [UserAssignToolRights] ADD [ToolName] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190220073934_ForAddUserAssignModuleNameColumn')
BEGIN
    ALTER TABLE [UserAssignSubModule] ADD [SubModuleName] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190220073934_ForAddUserAssignModuleNameColumn')
BEGIN
    ALTER TABLE [UserAssignModule] ADD [ModuleName] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190220073934_ForAddUserAssignModuleNameColumn')
BEGIN
    ALTER TABLE [UserAssignFieldRights] ADD [FieldName] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190220073934_ForAddUserAssignModuleNameColumn')
BEGIN
    CREATE TABLE [PermissionGroupMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [GroupName] nvarchar(50) NOT NULL,
        [GroupDescription] nvarchar(100) NULL,
        [AccessRightId] bigint NOT NULL,
        [IPAddress] nvarchar(max) NULL,
        [LinkedRoles] bigint NOT NULL,
        CONSTRAINT [PK_PermissionGroupMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190220073934_ForAddUserAssignModuleNameColumn')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190220073934_ForAddUserAssignModuleNameColumn', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190220102143_GroupRoleMapping')
BEGIN
    DECLARE @var580 sysname;
    SELECT @var580 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[UserAPIKeyDetails]') AND [c].[name] = N'ExpireDate');
    IF @var580 IS NOT NULL EXEC(N'ALTER TABLE [UserAPIKeyDetails] DROP CONSTRAINT [' + @var580 + '];');
    ALTER TABLE [UserAPIKeyDetails] DROP COLUMN [ExpireDate];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190220102143_GroupRoleMapping')
BEGIN
    ALTER TABLE [UserAPIKeyDetails] ADD [WhiteListIPEndPointID] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190220102143_GroupRoleMapping')
BEGIN
    ALTER TABLE [MarginWalletTopupRequest] ADD [IsChargeDeducted] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190220102143_GroupRoleMapping')
BEGIN
    ALTER TABLE [APIPlanMaster] ADD [Priority] int NOT NULL DEFAULT 0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190220102143_GroupRoleMapping')
BEGIN
    ALTER TABLE [APIPlanDetail] ADD [APIKeyLimit] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190220102143_GroupRoleMapping')
BEGIN
    CREATE TABLE [GroupRoleMapping] (
        [PermissionGroupId] bigint NOT NULL,
        [RoleId] bigint NOT NULL,
        CONSTRAINT [PK_GroupRoleMapping] PRIMARY KEY ([PermissionGroupId], [RoleId])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190220102143_GroupRoleMapping')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190220102143_GroupRoleMapping', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190220110926_GroupRoleMappingResolveConflict')
BEGIN
    DECLARE @var581 sysname;
    SELECT @var581 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WhiteListIPEndPoint]') AND [c].[name] = N'IPAddress');
    IF @var581 IS NOT NULL EXEC(N'ALTER TABLE [WhiteListIPEndPoint] DROP CONSTRAINT [' + @var581 + '];');
    ALTER TABLE [WhiteListIPEndPoint] ALTER COLUMN [IPAddress] nvarchar(max) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190220110926_GroupRoleMappingResolveConflict')
BEGIN
    ALTER TABLE [WhiteListIPEndPoint] ADD [AliasName] nvarchar(50) NOT NULL DEFAULT N'';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190220110926_GroupRoleMappingResolveConflict')
BEGIN
    ALTER TABLE [BizRoles] ADD [CreatedBy] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190220110926_GroupRoleMappingResolveConflict')
BEGIN
    ALTER TABLE [BizRoles] ADD [CreatedDate] datetime2 NOT NULL DEFAULT '0001-01-01T00:00:00.0000000';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190220110926_GroupRoleMappingResolveConflict')
BEGIN
    ALTER TABLE [BizRoles] ADD [PermissionGroupID] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190220110926_GroupRoleMappingResolveConflict')
BEGIN
    ALTER TABLE [BizRoles] ADD [Status] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190220110926_GroupRoleMappingResolveConflict')
BEGIN
    ALTER TABLE [BizRoles] ADD [UpdatedBy] bigint NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190220110926_GroupRoleMappingResolveConflict')
BEGIN
    ALTER TABLE [BizRoles] ADD [UpdatedDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190220110926_GroupRoleMappingResolveConflict')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190220110926_GroupRoleMappingResolveConflict', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190220123001_addMarginEntity')
BEGIN
    CREATE TABLE [MarginBlockWalletTrnTypeMaster] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [WalletTypeID] bigint NOT NULL,
        [TrnTypeID] bigint NOT NULL,
        CONSTRAINT [PK_MarginBlockWalletTrnTypeMaster] PRIMARY KEY ([WalletTypeID], [TrnTypeID]),
        CONSTRAINT [AK_MarginBlockWalletTrnTypeMaster_TrnTypeID_WalletTypeID] UNIQUE ([TrnTypeID], [WalletTypeID])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190220123001_addMarginEntity')
BEGIN
    CREATE TABLE [MarginTransactionAccount] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [BatchNo] bigint NOT NULL,
        [RefNo] bigint NOT NULL,
        [TrnDate] datetime2 NOT NULL,
        [WalletID] bigint NOT NULL,
        [CrAmt] decimal(28, 18) NOT NULL,
        [DrAmt] decimal(28, 18) NOT NULL,
        [Remarks] nvarchar(150) NOT NULL,
        [IsSettled] smallint NOT NULL,
        [Type] int NOT NULL,
        CONSTRAINT [PK_MarginTransactionAccount] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190220123001_addMarginEntity')
BEGIN
    CREATE TABLE [MarginUserRoleMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [RoleName] nvarchar(20) NOT NULL,
        [RoleType] nvarchar(20) NOT NULL,
        CONSTRAINT [PK_MarginUserRoleMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190220123001_addMarginEntity')
BEGIN
    CREATE TABLE [MarginWalletAuthorizeUserMaster] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [WalletID] bigint NOT NULL,
        [UserID] bigint NOT NULL,
        [OrgID] bigint NOT NULL,
        [RoleID] bigint NOT NULL,
        CONSTRAINT [PK_MarginWalletAuthorizeUserMaster] PRIMARY KEY ([UserID], [WalletID])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190220123001_addMarginEntity')
BEGIN
    CREATE TABLE [MarginWalletLedger] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [WalletId] bigint NOT NULL,
        [ToWalletId] bigint NOT NULL,
        [TrnDate] datetime2 NOT NULL,
        [ServiceTypeID] int NOT NULL,
        [TrnType] int NOT NULL,
        [TrnNo] bigint NOT NULL,
        [CrAmt] decimal(28, 18) NOT NULL,
        [DrAmt] decimal(28, 18) NOT NULL,
        [PreBal] decimal(28, 18) NOT NULL,
        [PostBal] decimal(28, 18) NOT NULL,
        [Remarks] nvarchar(100) NOT NULL,
        [Type] int NOT NULL,
        CONSTRAINT [PK_MarginWalletLedger] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190220123001_addMarginEntity')
BEGIN
    CREATE TABLE [MarginWalletMaster] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [Walletname] nvarchar(50) NOT NULL,
        [Balance] decimal(28, 18) NOT NULL,
        [WalletTypeID] bigint NOT NULL,
        [IsValid] bit NOT NULL,
        [AccWalletID] nvarchar(16) NOT NULL,
        [UserID] bigint NOT NULL,
        [PublicAddress] nvarchar(50) NOT NULL,
        [IsDefaultWallet] tinyint NOT NULL,
        [ExpiryDate] datetime2 NULL,
        [OrgID] bigint NULL,
        [WalletUsageType] smallint NOT NULL,
        [OutBoundBalance] decimal(28, 18) NOT NULL,
        [InBoundBalance] decimal(28, 18) NOT NULL,
        CONSTRAINT [PK_MarginWalletMaster] PRIMARY KEY ([AccWalletID])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190220123001_addMarginEntity')
BEGIN
    CREATE TABLE [MarginWalletTransactionOrder] (
        [OrderID] bigint NOT NULL IDENTITY,
        [UpdatedDate] datetime2 NULL,
        [TrnDate] datetime2 NOT NULL,
        [OWalletID] bigint NOT NULL,
        [DWalletID] bigint NOT NULL,
        [Amount] decimal(28, 18) NOT NULL,
        [WalletType] nvarchar(10) NOT NULL,
        [OTrnNo] bigint NOT NULL,
        [DTrnNo] bigint NOT NULL,
        [Status] int NOT NULL,
        [StatusMsg] nvarchar(50) NOT NULL,
        [ChargeAmount] decimal(28, 18) NOT NULL,
        CONSTRAINT [PK_MarginWalletTransactionOrder] PRIMARY KEY ([OrderID])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190220123001_addMarginEntity')
BEGIN
    CREATE TABLE [MarginWalletTransactionQueue] (
        [TrnNo] bigint NOT NULL IDENTITY,
        [Guid] uniqueidentifier NOT NULL,
        [TrnType] int NOT NULL,
        [Amount] decimal(28, 18) NOT NULL,
        [TrnRefNo] bigint NOT NULL,
        [TrnDate] datetime2 NOT NULL,
        [UpdatedDate] datetime2 NULL,
        [WalletID] bigint NOT NULL,
        [WalletType] nvarchar(10) NOT NULL,
        [MemberID] bigint NOT NULL,
        [TimeStamp] nvarchar(50) NOT NULL,
        [Status] int NOT NULL,
        [StatusMsg] nvarchar(50) NOT NULL,
        [SettedAmt] decimal(28, 18) NOT NULL,
        [AllowedChannelID] bigint NOT NULL,
        [WalletTrnType] int NOT NULL,
        [WalletDeductionType] int NOT NULL,
        [HoldChargeAmount] decimal(28, 18) NOT NULL,
        [DeductedChargeAmount] decimal(28, 18) NOT NULL,
        [ErrorCode] bigint NULL,
        CONSTRAINT [PK_MarginWalletTransactionQueue] PRIMARY KEY ([TrnNo])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190220123001_addMarginEntity')
BEGIN
    CREATE TABLE [MarginWalletTypeMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [WalletTypeName] nvarchar(7) NOT NULL,
        [Description] nvarchar(100) NOT NULL,
        [IsDepositionAllow] smallint NOT NULL,
        [IsWithdrawalAllow] smallint NOT NULL,
        [IsTransactionWallet] smallint NOT NULL,
        [IsDefaultWallet] smallint NULL,
        [ConfirmationCount] smallint NULL,
        [IsLocal] smallint NULL,
        CONSTRAINT [PK_MarginWalletTypeMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190220123001_addMarginEntity')
BEGIN
    CREATE TABLE [MarginWalletUsagePolicy] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [PolicyName] nvarchar(50) NOT NULL,
        [WalletType] bigint NOT NULL,
        [AllowedIP] nvarchar(max) NOT NULL,
        [AllowedLocation] nvarchar(max) NOT NULL,
        [AuthenticationType] int NOT NULL,
        [StartTime] float NULL,
        [EndTime] float NULL,
        [HourlyTrnCount] bigint NOT NULL,
        [HourlyTrnAmount] decimal(28, 18) NOT NULL,
        [DailyTrnCount] bigint NOT NULL,
        [DailyTrnAmount] decimal(28, 18) NOT NULL,
        [MonthlyTrnCount] bigint NOT NULL,
        [MonthlyTrnAmount] decimal(28, 18) NOT NULL,
        [WeeklyTrnCount] bigint NOT NULL,
        [WeeklyTrnAmount] decimal(28, 18) NOT NULL,
        [YearlyTrnCount] bigint NOT NULL,
        [YearlyTrnAmount] decimal(28, 18) NOT NULL,
        [LifeTimeTrnCount] bigint NOT NULL,
        [LifeTimeTrnAmount] decimal(28, 18) NOT NULL,
        [MinAmount] decimal(28, 18) NOT NULL,
        [MaxAmount] decimal(28, 18) NOT NULL,
        CONSTRAINT [PK_MarginWalletUsagePolicy] PRIMARY KEY ([WalletType])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190220123001_addMarginEntity')
BEGIN
    CREATE TABLE [MarginWTrnTypeMaster] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [TrnTypeId] bigint NOT NULL,
        [TrnTypeName] nvarchar(50) NOT NULL,
        [Discription] nvarchar(50) NOT NULL,
        CONSTRAINT [PK_MarginWTrnTypeMaster] PRIMARY KEY ([TrnTypeId])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190220123001_addMarginEntity')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190220123001_addMarginEntity', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190220140714_SubScribePlan')
BEGIN
    DECLARE @var582 sysname;
    SELECT @var582 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WhiteListIPEndPoint]') AND [c].[name] = N'APIPlanDeatilID');
    IF @var582 IS NOT NULL EXEC(N'ALTER TABLE [WhiteListIPEndPoint] DROP CONSTRAINT [' + @var582 + '];');
    ALTER TABLE [WhiteListIPEndPoint] DROP COLUMN [APIPlanDeatilID];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190220140714_SubScribePlan')
BEGIN
    DECLARE @var583 sysname;
    SELECT @var583 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[UserAPIKeyDetails]') AND [c].[name] = N'WhiteListIPEndPointID');
    IF @var583 IS NOT NULL EXEC(N'ALTER TABLE [UserAPIKeyDetails] DROP CONSTRAINT [' + @var583 + '];');
    ALTER TABLE [UserAPIKeyDetails] DROP COLUMN [WhiteListIPEndPointID];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190220140714_SubScribePlan')
BEGIN
    ALTER TABLE [APIPlanMaster] ADD [IPAddress] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190220140714_SubScribePlan')
BEGIN
    ALTER TABLE [APIPlanMaster] ADD [IsPlanRecursive] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190220140714_SubScribePlan')
BEGIN
    CREATE TABLE [MarginTransactionBlockedChannel] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [ChannelID] bigint NOT NULL,
        [TrnType] bigint NOT NULL,
        CONSTRAINT [PK_MarginTransactionBlockedChannel] PRIMARY KEY ([ChannelID], [TrnType])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190220140714_SubScribePlan')
BEGIN
    CREATE TABLE [MarginUserWalletBlockTrnTypeMaster] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [WalletID] bigint NOT NULL,
        [WTrnTypeMasterID] bigint NOT NULL,
        [Remarks] nvarchar(150) NULL,
        CONSTRAINT [PK_MarginUserWalletBlockTrnTypeMaster] PRIMARY KEY ([WalletID], [WTrnTypeMasterID])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190220140714_SubScribePlan')
BEGIN
    CREATE TABLE [PublicAPIKeyPolicy] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [AddMaxLimit] int NOT NULL,
        [AddPerDayFrequency] int NOT NULL,
        [AddFrequency] int NOT NULL,
        [DeleteMaxLimit] int NOT NULL,
        [DeletePerDayFrequency] int NOT NULL,
        [DeleteFrequency] int NOT NULL,
        CONSTRAINT [PK_PublicAPIKeyPolicy] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190220140714_SubScribePlan')
BEGIN
    CREATE TABLE [SubScribePlan] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [APIPlanMasterID] bigint NOT NULL,
        [ExpiryDate] datetime2 NULL,
        [Price] bigint NOT NULL,
        [Charge] bigint NOT NULL,
        [TotalAmt] bigint NOT NULL,
        [SubscribeStatus] smallint NOT NULL,
        [RenewalStatus] smallint NOT NULL,
        [ActivationDate] datetime2 NULL,
        [Perticuler] nvarchar(max) NULL,
        [DebitedAccountID] nvarchar(max) NULL,
        [DebitedCurrency] nvarchar(max) NULL,
        CONSTRAINT [PK_SubScribePlan] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190220140714_SubScribePlan')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190220140714_SubScribePlan', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190221064818_APIPlanMaster')
BEGIN
    DECLARE @var584 sysname;
    SELECT @var584 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[UserAPIKeyDetails]') AND [c].[name] = N'APIPlanDeatilID');
    IF @var584 IS NOT NULL EXEC(N'ALTER TABLE [UserAPIKeyDetails] DROP CONSTRAINT [' + @var584 + '];');
    ALTER TABLE [UserAPIKeyDetails] DROP COLUMN [APIPlanDeatilID];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190221064818_APIPlanMaster')
BEGIN
    DECLARE @var585 sysname;
    SELECT @var585 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[APIPlanDetail]') AND [c].[name] = N'APIKeyLimit');
    IF @var585 IS NOT NULL EXEC(N'ALTER TABLE [APIPlanDetail] DROP CONSTRAINT [' + @var585 + '];');
    ALTER TABLE [APIPlanDetail] DROP COLUMN [APIKeyLimit];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190221064818_APIPlanMaster')
BEGIN
    EXEC sp_rename N'[APIPlanMaster].[IPAddress]', N'CreatedIPAddress', N'COLUMN';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190221064818_APIPlanMaster')
BEGIN
    DECLARE @var586 sysname;
    SELECT @var586 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WhiteListIPEndPoint]') AND [c].[name] = N'UserID');
    IF @var586 IS NOT NULL EXEC(N'ALTER TABLE [WhiteListIPEndPoint] DROP CONSTRAINT [' + @var586 + '];');
    ALTER TABLE [WhiteListIPEndPoint] ALTER COLUMN [UserID] bigint NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190221064818_APIPlanMaster')
BEGIN
    DECLARE @var587 sysname;
    SELECT @var587 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SubScribePlan]') AND [c].[name] = N'TotalAmt');
    IF @var587 IS NOT NULL EXEC(N'ALTER TABLE [SubScribePlan] DROP CONSTRAINT [' + @var587 + '];');
    ALTER TABLE [SubScribePlan] ALTER COLUMN [TotalAmt] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190221064818_APIPlanMaster')
BEGIN
    DECLARE @var588 sysname;
    SELECT @var588 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SubScribePlan]') AND [c].[name] = N'Price');
    IF @var588 IS NOT NULL EXEC(N'ALTER TABLE [SubScribePlan] DROP CONSTRAINT [' + @var588 + '];');
    ALTER TABLE [SubScribePlan] ALTER COLUMN [Price] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190221064818_APIPlanMaster')
BEGIN
    DECLARE @var589 sysname;
    SELECT @var589 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SubScribePlan]') AND [c].[name] = N'Charge');
    IF @var589 IS NOT NULL EXEC(N'ALTER TABLE [SubScribePlan] DROP CONSTRAINT [' + @var589 + '];');
    ALTER TABLE [SubScribePlan] ALTER COLUMN [Charge] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190221064818_APIPlanMaster')
BEGIN
    DECLARE @var590 sysname;
    SELECT @var590 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ReferralChannel]') AND [c].[name] = N'UserId');
    IF @var590 IS NOT NULL EXEC(N'ALTER TABLE [ReferralChannel] DROP CONSTRAINT [' + @var590 + '];');
    ALTER TABLE [ReferralChannel] ALTER COLUMN [UserId] bigint NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190221064818_APIPlanMaster')
BEGIN
    ALTER TABLE [APIPlanMaster] ADD [ConcurrentEndPoints] int NOT NULL DEFAULT 0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190221064818_APIPlanMaster')
BEGIN
    ALTER TABLE [APIPlanMaster] ADD [HistoricalDataMonth] int NOT NULL DEFAULT 0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190221064818_APIPlanMaster')
BEGIN
    ALTER TABLE [APIPlanMaster] ADD [MaxOrderPerSec] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190221064818_APIPlanMaster')
BEGIN
    ALTER TABLE [APIPlanMaster] ADD [MaxPerDay] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190221064818_APIPlanMaster')
BEGIN
    ALTER TABLE [APIPlanMaster] ADD [MaxPerMinute] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190221064818_APIPlanMaster')
BEGIN
    ALTER TABLE [APIPlanMaster] ADD [MaxPerMonth] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190221064818_APIPlanMaster')
BEGIN
    ALTER TABLE [APIPlanMaster] ADD [MaxRecPerRequest] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190221064818_APIPlanMaster')
BEGIN
    ALTER TABLE [APIPlanMaster] ADD [MaxReqSize] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190221064818_APIPlanMaster')
BEGIN
    ALTER TABLE [APIPlanMaster] ADD [MaxResSize] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190221064818_APIPlanMaster')
BEGIN
    ALTER TABLE [APIPlanMaster] ADD [PlanValidityType] int NOT NULL DEFAULT 0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190221064818_APIPlanMaster')
BEGIN
    ALTER TABLE [APIPlanMaster] ADD [WhitelistedEndPoints] int NOT NULL DEFAULT 0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190221064818_APIPlanMaster')
BEGIN
    ALTER TABLE [APIPlanDetail] ADD [IsPlanRecursive] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190221064818_APIPlanMaster')
BEGIN
    ALTER TABLE [APIPlanDetail] ADD [PlanValidity] int NOT NULL DEFAULT 0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190221064818_APIPlanMaster')
BEGIN
    CREATE TABLE [TradeGraphDetailMargin] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [PairId] bigint NOT NULL,
        [DataDate] datetime2 NOT NULL,
        [TranNo] bigint NOT NULL,
        [Volume] decimal(28, 18) NOT NULL,
        [ChangePer] decimal(28, 18) NOT NULL,
        [High24Hr] decimal(28, 18) NOT NULL,
        [Low24Hr] decimal(28, 18) NOT NULL,
        [TodayClose] decimal(28, 18) NOT NULL,
        [TodayOpen] decimal(28, 18) NOT NULL,
        [HighWeek] decimal(28, 18) NOT NULL,
        [LowWeek] decimal(28, 18) NOT NULL,
        [High52Week] decimal(28, 18) NOT NULL,
        [Low52Week] decimal(28, 18) NOT NULL,
        [LTP] decimal(28, 18) NOT NULL,
        [BidPrice] decimal(28, 18) NOT NULL,
        [Quantity] decimal(28, 18) NOT NULL,
        CONSTRAINT [PK_TradeGraphDetailMargin] PRIMARY KEY ([Id], [TranNo]),
        CONSTRAINT [AK_TradeGraphDetailMargin_TranNo] UNIQUE ([TranNo])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190221064818_APIPlanMaster')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190221064818_APIPlanMaster', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190221115057_AffiliatePromotionLimitConfiguration')
BEGIN
    ALTER TABLE [WhiteListIPEndPoint] ADD [IPType] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190221115057_AffiliatePromotionLimitConfiguration')
BEGIN
    ALTER TABLE [UserAssignFieldRights] ADD [IsVisibility] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190221115057_AffiliatePromotionLimitConfiguration')
BEGIN
    ALTER TABLE [GroupRoleMapping] ADD CONSTRAINT [AK_GroupRoleMapping_RoleId] UNIQUE ([RoleId]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190221115057_AffiliatePromotionLimitConfiguration')
BEGIN
    CREATE TABLE [AffiliatePromotionLimitConfiguration] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [PromotionType] bigint NOT NULL,
        [HourlyLimit] bigint NOT NULL,
        [DailyLimit] bigint NOT NULL,
        CONSTRAINT [PK_AffiliatePromotionLimitConfiguration] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190221115057_AffiliatePromotionLimitConfiguration')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190221115057_AffiliatePromotionLimitConfiguration', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190222055630_UserSubscribeAPIPlan')
BEGIN
    DROP TABLE [SubScribePlan];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190222055630_UserSubscribeAPIPlan')
BEGIN
    ALTER TABLE [FieldMaster] ADD [Visibility] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190222055630_UserSubscribeAPIPlan')
BEGIN
    CREATE TABLE [TradeCancelQueueMargin] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [TrnNo] bigint NOT NULL,
        [DeliverServiceID] bigint NOT NULL,
        [TrnDate] datetime2 NOT NULL,
        [PendingBuyQty] decimal(28, 18) NOT NULL,
        [DeliverQty] decimal(28, 18) NOT NULL,
        [OrderType] smallint NULL,
        [DeliverBidPrice] decimal(28, 18) NULL,
        [StatusMsg] nvarchar(max) NOT NULL,
        [OrderID] bigint NOT NULL,
        [SettledDate] datetime2 NULL,
        CONSTRAINT [PK_TradeCancelQueueMargin] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190222055630_UserSubscribeAPIPlan')
BEGIN
    CREATE TABLE [UserSubscribeAPIPlan] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [APIPlanMasterID] bigint NOT NULL,
        [ExpiryDate] datetime2 NULL,
        [Price] decimal(28, 18) NOT NULL,
        [Charge] decimal(28, 18) NOT NULL,
        [TotalAmt] decimal(28, 18) NOT NULL,
        [UserID] bigint NOT NULL,
        [RenewalStatus] smallint NULL,
        [ActivationDate] datetime2 NULL,
        [Perticuler] nvarchar(max) NULL,
        [DebitedAccountID] nvarchar(max) NULL,
        [DebitedCurrency] nvarchar(max) NULL,
        CONSTRAINT [PK_UserSubscribeAPIPlan] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190222055630_UserSubscribeAPIPlan')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190222055630_UserSubscribeAPIPlan', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190222105151_MarginChargeConfiguration')
BEGIN
    ALTER TABLE [AffiliateLinkClick] ADD [IPAddress] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190222105151_MarginChargeConfiguration')
BEGIN
    CREATE TABLE [MarginChargeConfigurationDetail] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [ChargeConfigurationMasterID] bigint NOT NULL,
        [ChargeDistributionBasedOn] smallint NOT NULL,
        [ChargeType] bigint NOT NULL,
        [DeductionWalletTypeId] bigint NOT NULL,
        [ChargeValue] decimal(28, 18) NOT NULL,
        [ChargeValueType] smallint NOT NULL,
        [MakerCharge] decimal(28, 18) NOT NULL,
        [TakerCharge] decimal(28, 18) NOT NULL,
        [MinAmount] decimal(28, 18) NOT NULL,
        [MaxAmount] decimal(28, 18) NOT NULL,
        [Remarks] nvarchar(max) NULL,
        CONSTRAINT [PK_MarginChargeConfigurationDetail] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190222105151_MarginChargeConfiguration')
BEGIN
    CREATE TABLE [MarginChargeConfigurationMaster] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [WalletTypeID] bigint NOT NULL,
        [TrnType] bigint NOT NULL,
        [KYCComplaint] smallint NOT NULL,
        [SlabType] smallint NOT NULL,
        [SpecialChargeConfigurationID] bigint NOT NULL,
        [Remarks] nvarchar(max) NULL,
        CONSTRAINT [PK_MarginChargeConfigurationMaster] PRIMARY KEY ([WalletTypeID], [TrnType], [KYCComplaint], [SpecialChargeConfigurationID]),
        CONSTRAINT [AK_MarginChargeConfigurationMaster_KYCComplaint_SpecialChargeConfigurationID_TrnType_WalletTypeID] UNIQUE ([KYCComplaint], [SpecialChargeConfigurationID], [TrnType], [WalletTypeID])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190222105151_MarginChargeConfiguration')
BEGIN
    CREATE TABLE [MarginSpecialChargeConfiguration] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [TrnDate] datetime2 NOT NULL,
        [Remarks] nvarchar(max) NULL,
        CONSTRAINT [PK_MarginSpecialChargeConfiguration] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190222105151_MarginChargeConfiguration')
BEGIN
    CREATE TABLE [MarginTrnChargeLog] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [BatchNo] nvarchar(max) NULL,
        [TrnNo] bigint NOT NULL,
        [TrnType] bigint NOT NULL,
        [Amount] decimal(28, 18) NOT NULL,
        [MakerCharge] decimal(28, 18) NULL,
        [TakerCharge] decimal(28, 18) NULL,
        [Charge] decimal(28, 18) NULL,
        [StakingChargeMasterID] bigint NULL,
        [ChargeConfigurationDetailID] bigint NULL,
        [TimeStamp] nvarchar(max) NULL,
        [DWalletID] bigint NOT NULL,
        [OWalletID] bigint NOT NULL,
        [DUserID] bigint NOT NULL,
        [OuserID] bigint NOT NULL,
        [WalletTypeID] bigint NOT NULL,
        [SlabType] smallint NOT NULL,
        [Remarks] nvarchar(max) NULL,
        [ChargeConfigurationMasterID] bigint NULL,
        [IsMaker] smallint NULL,
        [TrnRefNo] bigint NULL,
        CONSTRAINT [PK_MarginTrnChargeLog] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190222105151_MarginChargeConfiguration')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190222105151_MarginChargeConfiguration', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190223055900_MarginMarket')
BEGIN
    CREATE TABLE [MarketMargin] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [CurrencyName] nvarchar(max) NOT NULL,
        [isBaseCurrency] smallint NOT NULL,
        [ServiceID] bigint NOT NULL,
        CONSTRAINT [PK_MarketMargin] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190223055900_MarginMarket')
BEGIN
    CREATE TABLE [ServiceDetailMargin] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [ServiceId] bigint NOT NULL,
        [ServiceDetailJson] text NULL,
        CONSTRAINT [PK_ServiceDetailMargin] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190223055900_MarginMarket')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190223055900_MarginMarket', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190223080656_AutoRenew')
BEGIN
    ALTER TABLE [UserSubscribeAPIPlan] ADD [IsAutoRenew] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190223080656_AutoRenew')
BEGIN
    ALTER TABLE [UserSubscribeAPIPlan] ADD [NextAutoRenewId] bigint NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190223080656_AutoRenew')
BEGIN
    ALTER TABLE [UserSubscribeAPIPlan] ADD [PaymentStatus] smallint NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190223080656_AutoRenew')
BEGIN
    ALTER TABLE [UserSubscribeAPIPlan] ADD [RenewDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190223080656_AutoRenew')
BEGIN
    ALTER TABLE [UserSubscribeAPIPlan] ADD [RenewStatus] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190223080656_AutoRenew')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190223080656_AutoRenew', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190223113508_RenewDays')
BEGIN
    ALTER TABLE [UserSubscribeAPIPlan] ADD [RenewDays] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190223113508_RenewDays')
BEGIN
    ALTER TABLE [BizUser] ADD [IsCreatedByAdmin] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190223113508_RenewDays')
BEGIN
    ALTER TABLE [BizUser] ADD [Status] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190223113508_RenewDays')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190223113508_RenewDays', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190223113934_RenewalStatus')
BEGIN
    DECLARE @var591 sysname;
    SELECT @var591 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[UserSubscribeAPIPlan]') AND [c].[name] = N'RenewalStatus');
    IF @var591 IS NOT NULL EXEC(N'ALTER TABLE [UserSubscribeAPIPlan] DROP CONSTRAINT [' + @var591 + '];');
    ALTER TABLE [UserSubscribeAPIPlan] DROP COLUMN [RenewalStatus];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190223113934_RenewalStatus')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190223113934_RenewalStatus', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190225105137_FavouritePairMargin')
BEGIN
    CREATE TABLE [FavouritePairMargin] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [UserId] bigint NOT NULL,
        [PairId] bigint NOT NULL,
        CONSTRAINT [PK_FavouritePairMargin] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190225105137_FavouritePairMargin')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190225105137_FavouritePairMargin', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190226042803_FrequencyType')
BEGIN
    DECLARE @var592 sysname;
    SELECT @var592 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletLimitConfiguration]') AND [c].[name] = N'LifeTime');
    IF @var592 IS NOT NULL EXEC(N'ALTER TABLE [WalletLimitConfiguration] DROP CONSTRAINT [' + @var592 + '];');
    ALTER TABLE [WalletLimitConfiguration] ALTER COLUMN [LifeTime] decimal(28, 18) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190226042803_FrequencyType')
BEGIN
    ALTER TABLE [ReferralUser] ADD [ReferralChannelTypeId] int NOT NULL DEFAULT 0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190226042803_FrequencyType')
BEGIN
    ALTER TABLE [ReferralChannelType] ADD [DailyLimit] int NOT NULL DEFAULT 0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190226042803_FrequencyType')
BEGIN
    ALTER TABLE [ReferralChannelType] ADD [HourlyLimit] int NOT NULL DEFAULT 0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190226042803_FrequencyType')
BEGIN
    ALTER TABLE [ReferralChannelType] ADD [MonthlyLimit] int NOT NULL DEFAULT 0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190226042803_FrequencyType')
BEGIN
    ALTER TABLE [ReferralChannelType] ADD [WeeklyLimit] int NOT NULL DEFAULT 0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190226042803_FrequencyType')
BEGIN
    ALTER TABLE [PublicAPIKeyPolicy] ADD [AddFrequencyType] int NOT NULL DEFAULT 0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190226042803_FrequencyType')
BEGIN
    ALTER TABLE [PublicAPIKeyPolicy] ADD [DeleteFrequencyType] int NOT NULL DEFAULT 0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190226042803_FrequencyType')
BEGIN
    CREATE TABLE [ReferralUserClick] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [UserId] bigint NOT NULL,
        [ServiceId] bigint NOT NULL,
        [LinkDetail] nvarchar(max) NULL,
        [IPAddress] nvarchar(max) NULL,
        CONSTRAINT [PK_ReferralUserClick] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190226042803_FrequencyType')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190226042803_FrequencyType', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190228123104_affiliatecommcron')
BEGIN
    ALTER TABLE [AffiliateSchemeTypeMapping] ADD [CommissionHour] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190228123104_affiliatecommcron')
BEGIN
    CREATE TABLE [AffiliateCommissionCron] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [SchemeMappingId] bigint NOT NULL,
        [Remarks] nvarchar(max) NULL,
        CONSTRAINT [PK_AffiliateCommissionCron] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190228123104_affiliatecommcron')
BEGIN
    CREATE TABLE [AffiliateCommissionHistory] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [TrnRefNo] bigint NOT NULL,
        [CronRefNo] bigint NOT NULL,
        [FromWalletId] bigint NOT NULL,
        [ToWalletId] bigint NOT NULL,
        [Amount] decimal(28, 18) NOT NULL,
        [AffiliateUserId] bigint NOT NULL,
        [SchemeMappingId] bigint NOT NULL,
        [TrnUserId] bigint NOT NULL,
        [Remarks] nvarchar(max) NULL,
        CONSTRAINT [PK_AffiliateCommissionHistory] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190228123104_affiliatecommcron')
BEGIN
    CREATE TABLE [ServiceStasticsMargin] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [ServiceId] bigint NOT NULL,
        [MarketCap] decimal(28, 18) NOT NULL,
        [VolGlobal] decimal(28, 18) NOT NULL,
        [MaxSupply] bigint NOT NULL,
        [CirculatingSupply] bigint NOT NULL,
        [IssuePrice] decimal(18, 2) NOT NULL,
        [IssueDate] datetime2 NOT NULL,
        CONSTRAINT [PK_ServiceStasticsMargin] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190228123104_affiliatecommcron')
BEGIN
    CREATE TABLE [ServiceTypeMappingMargin] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [ServiceId] bigint NOT NULL,
        [TrnType] bigint NOT NULL,
        CONSTRAINT [PK_ServiceTypeMappingMargin] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190228123104_affiliatecommcron')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190228123104_affiliatecommcron', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190304050042_AddNewColForCharge')
BEGIN
    DECLARE @var593 sysname;
    SELECT @var593 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ReferralUserClick]') AND [c].[name] = N'LinkDetail');
    IF @var593 IS NOT NULL EXEC(N'ALTER TABLE [ReferralUserClick] DROP CONSTRAINT [' + @var593 + '];');
    ALTER TABLE [ReferralUserClick] DROP COLUMN [LinkDetail];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190304050042_AddNewColForCharge')
BEGIN
    EXEC sp_rename N'[ReferralUserClick].[ServiceId]', N'ReferralServiceId', N'COLUMN';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190304050042_AddNewColForCharge')
BEGIN
    ALTER TABLE [TrnChargeLog] ADD [ConvertedAmount] decimal(28, 18) NOT NULL DEFAULT 0.0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190304050042_AddNewColForCharge')
BEGIN
    ALTER TABLE [ReferralUserClick] ADD [ReferralChannelTypeId] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190304050042_AddNewColForCharge')
BEGIN
    ALTER TABLE [ChargeConfigurationDetail] ADD [IsCurrencyConverted] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190304050042_AddNewColForCharge')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190304050042_AddNewColForCharge', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190304061727_RenameColOriginalAmount')
BEGIN
    EXEC sp_rename N'[TrnChargeLog].[ConvertedAmount]', N'OriginalAmount', N'COLUMN';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190304061727_RenameColOriginalAmount')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190304061727_RenameColOriginalAmount', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190304105411_APIKeyWhitelistIPConfig')
BEGIN
    DECLARE @var594 sysname;
    SELECT @var594 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PermissionGroupMaster]') AND [c].[name] = N'AccessRightId');
    IF @var594 IS NOT NULL EXEC(N'ALTER TABLE [PermissionGroupMaster] DROP CONSTRAINT [' + @var594 + '];');
    ALTER TABLE [PermissionGroupMaster] DROP COLUMN [AccessRightId];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190304105411_APIKeyWhitelistIPConfig')
BEGIN
    DECLARE @var595 sysname;
    SELECT @var595 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PermissionGroupMaster]') AND [c].[name] = N'LinkedRoles');
    IF @var595 IS NOT NULL EXEC(N'ALTER TABLE [PermissionGroupMaster] DROP CONSTRAINT [' + @var595 + '];');
    ALTER TABLE [PermissionGroupMaster] DROP COLUMN [LinkedRoles];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190304105411_APIKeyWhitelistIPConfig')
BEGIN
    ALTER TABLE [WhiteListIPEndPoint] ADD [APIPlanID] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190304105411_APIKeyWhitelistIPConfig')
BEGIN
    DECLARE @var596 sysname;
    SELECT @var596 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TrnChargeLog]') AND [c].[name] = N'OriginalAmount');
    IF @var596 IS NOT NULL EXEC(N'ALTER TABLE [TrnChargeLog] DROP CONSTRAINT [' + @var596 + '];');
    ALTER TABLE [TrnChargeLog] ALTER COLUMN [OriginalAmount] decimal(28, 18) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190304105411_APIKeyWhitelistIPConfig')
BEGIN
    CREATE TABLE [APIKeyWhitelistIPConfig] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [APIKeyID] bigint NOT NULL,
        [IPId] bigint NOT NULL,
        CONSTRAINT [PK_APIKeyWhitelistIPConfig] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190304105411_APIKeyWhitelistIPConfig')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190304105411_APIKeyWhitelistIPConfig', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190304105820_APIPlanConfigurationHistory')
BEGIN
    CREATE TABLE [APIPlanConfigurationHistory] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [PlanName] nvarchar(50) NOT NULL,
        [Price] decimal(28, 18) NOT NULL,
        [Charge] decimal(28, 18) NOT NULL,
        [PlanDesc] nvarchar(max) NULL,
        [Priority] int NOT NULL,
        [MaxPerMinute] bigint NOT NULL,
        [MaxPerDay] bigint NOT NULL,
        [MaxPerMonth] bigint NOT NULL,
        [MaxOrderPerSec] bigint NOT NULL,
        [MaxRecPerRequest] bigint NOT NULL,
        [MaxReqSize] bigint NOT NULL,
        [MaxResSize] bigint NOT NULL,
        [WhitelistedEndPoints] int NOT NULL,
        [ConcurrentEndPoints] int NOT NULL,
        [HistoricalDataMonth] int NOT NULL,
        [IsPlanRecursive] smallint NOT NULL,
        [PlanValidity] int NOT NULL,
        [PlanValidityType] int NOT NULL,
        [CreatedIPAddress] nvarchar(max) NULL,
        CONSTRAINT [PK_APIPlanConfigurationHistory] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190304105820_APIPlanConfigurationHistory')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190304105820_APIPlanConfigurationHistory', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190304123748_APIPlanConfigurationHistoryAddCol')
BEGIN
    ALTER TABLE [APIPlanConfigurationHistory] ADD [LastModifyBy] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190304123748_APIPlanConfigurationHistoryAddCol')
BEGIN
    ALTER TABLE [APIPlanConfigurationHistory] ADD [LastModifyDate] datetime2 NOT NULL DEFAULT '0001-01-01T00:00:00.0000000';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190304123748_APIPlanConfigurationHistoryAddCol')
BEGIN
    ALTER TABLE [APIPlanConfigurationHistory] ADD [ModifyDetails] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190304123748_APIPlanConfigurationHistoryAddCol')
BEGIN
    ALTER TABLE [APIPlanConfigurationHistory] ADD [PlanID] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190304123748_APIPlanConfigurationHistoryAddCol')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190304123748_APIPlanConfigurationHistoryAddCol', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190305054105_AddnewColDeductChargetType')
BEGIN
    ALTER TABLE [ChargeConfigurationDetail] ADD [DeductChargetType] smallint NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190305054105_AddnewColDeductChargetType')
BEGIN
    ALTER TABLE [APIPlanDetail] ADD [UserId] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190305054105_AddnewColDeductChargetType')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190305054105_AddnewColDeductChargetType', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190305101953_CreateTradingChargeTypeMaster')
BEGIN
    CREATE TABLE [TradingChargeTypeMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Type] smallint NOT NULL,
        [TypeName] nvarchar(max) NOT NULL,
        CONSTRAINT [PK_TradingChargeTypeMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190305101953_CreateTradingChargeTypeMaster')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190305101953_CreateTradingChargeTypeMaster', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190305134223_ReferralRewards')
BEGIN
    DECLARE @var597 sysname;
    SELECT @var597 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[APIPlanDetail]') AND [c].[name] = N'IsPlanRecursive');
    IF @var597 IS NOT NULL EXEC(N'ALTER TABLE [APIPlanDetail] DROP CONSTRAINT [' + @var597 + '];');
    ALTER TABLE [APIPlanDetail] DROP COLUMN [IsPlanRecursive];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190305134223_ReferralRewards')
BEGIN
    DECLARE @var598 sysname;
    SELECT @var598 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[APIPlanDetail]') AND [c].[name] = N'PlanValidity');
    IF @var598 IS NOT NULL EXEC(N'ALTER TABLE [APIPlanDetail] DROP CONSTRAINT [' + @var598 + '];');
    ALTER TABLE [APIPlanDetail] DROP COLUMN [PlanValidity];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190305134223_ReferralRewards')
BEGIN
    EXEC sp_rename N'[APIPlanDetail].[APIPlanMasterID]', N'APIPlanID', N'COLUMN';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190305134223_ReferralRewards')
BEGIN
    ALTER TABLE [UserSubscribeAPIPlan] ADD [CustomeLimitId] bigint NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190305134223_ReferralRewards')
BEGIN
    ALTER TABLE [APIPlanMethodConfiguration] ADD [CustomeLimitId] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190305134223_ReferralRewards')
BEGIN
    CREATE TABLE [ReferralRewards] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [UserId] bigint NOT NULL,
        [ReferralServiceId] bigint NOT NULL,
        [ReferralPayRewards] decimal(18, 2) NOT NULL,
        CONSTRAINT [PK_ReferralRewards] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190305134223_ReferralRewards')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190305134223_ReferralRewards', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190306112855_NewEntityDepositionRecon')
BEGIN
    DECLARE @var599 sysname;
    SELECT @var599 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[UserSubscribeAPIPlan]') AND [c].[name] = N'CustomeLimitId');
    IF @var599 IS NOT NULL EXEC(N'ALTER TABLE [UserSubscribeAPIPlan] DROP CONSTRAINT [' + @var599 + '];');
    ALTER TABLE [UserSubscribeAPIPlan] ALTER COLUMN [CustomeLimitId] bigint NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190306112855_NewEntityDepositionRecon')
BEGIN
    CREATE TABLE [DepositionRecon] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [TrnNo] bigint NOT NULL,
        [TrnRefNo] bigint NOT NULL,
        [OldStatus] smallint NOT NULL,
        [NewStatus] smallint NOT NULL,
        [ActionType] smallint NOT NULL,
        [Remarks] nvarchar(250) NULL,
        [ReconBy] smallint NOT NULL,
        [ReconDate] datetime2 NOT NULL,
        CONSTRAINT [PK_DepositionRecon] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190306112855_NewEntityDepositionRecon')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190306112855_NewEntityDepositionRecon', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190307100537_addColQRCodeANDChargeCurrency')
BEGIN
    ALTER TABLE [UserAPIKeyDetails] ADD [QRCode] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190307100537_addColQRCodeANDChargeCurrency')
BEGIN
    ALTER TABLE [TransactionQueue] ADD [ChargeCurrency] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190307100537_addColQRCodeANDChargeCurrency')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190307100537_addColQRCodeANDChargeCurrency', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190307115448_AddParentIDForMenuRights')
BEGIN
    ALTER TABLE [UserAssignSubModule] ADD [ParentID] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190307115448_AddParentIDForMenuRights')
BEGIN
    ALTER TABLE [UserAssignModule] ADD [ParentID] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190307115448_AddParentIDForMenuRights')
BEGIN
    ALTER TABLE [SubModuleMaster] ADD [ParentID] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190307115448_AddParentIDForMenuRights')
BEGIN
    ALTER TABLE [ModuleMaster] ADD [ParentID] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190307115448_AddParentIDForMenuRights')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190307115448_AddParentIDForMenuRights', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190308052109_addKycBit')
BEGIN
    ALTER TABLE [WalletTrnLimitConfiguration] DROP CONSTRAINT [PK_WalletTrnLimitConfiguration];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190308052109_addKycBit')
BEGIN
    ALTER TABLE [TransactionPolicy] DROP CONSTRAINT [AK_TransactionPolicy_RoleId_TrnType];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190308052109_addKycBit')
BEGIN
    ALTER TABLE [TransactionPolicy] DROP CONSTRAINT [PK_TransactionPolicy];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190308052109_addKycBit')
BEGIN
    ALTER TABLE [WalletTrnLimitConfiguration] ADD [IsKYCEnable] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190308052109_addKycBit')
BEGIN
    ALTER TABLE [TransactionPolicy] ADD [IsKYCEnable] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190308052109_addKycBit')
BEGIN
    ALTER TABLE [WalletTrnLimitConfiguration] ADD CONSTRAINT [AK_WalletTrnLimitConfiguration_IsKYCEnable_TrnType_WalletType] UNIQUE ([IsKYCEnable], [TrnType], [WalletType]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190308052109_addKycBit')
BEGIN
    ALTER TABLE [WalletTrnLimitConfiguration] ADD CONSTRAINT [PK_WalletTrnLimitConfiguration] PRIMARY KEY ([TrnType], [WalletType], [IsKYCEnable]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190308052109_addKycBit')
BEGIN
    ALTER TABLE [TransactionPolicy] ADD CONSTRAINT [AK_TransactionPolicy_IsKYCEnable_RoleId_TrnType] UNIQUE ([IsKYCEnable], [RoleId], [TrnType]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190308052109_addKycBit')
BEGIN
    ALTER TABLE [TransactionPolicy] ADD CONSTRAINT [PK_TransactionPolicy] PRIMARY KEY ([TrnType], [RoleId], [IsKYCEnable]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190308052109_addKycBit')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190308052109_addKycBit', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190308101931_EntityUserAPILimitCount')
BEGIN
    CREATE TABLE [UserAPILimitCount] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [PerDayCount] bigint NOT NULL,
        [PerDayUpdatedDate] datetime2 NOT NULL,
        [PerMonthCount] bigint NOT NULL,
        [PerMonthUpdatedDate] datetime2 NOT NULL,
        [TotalCall] bigint NOT NULL,
        [UserID] bigint NOT NULL,
        [PlanID] bigint NOT NULL,
        [SubscribeID] bigint NOT NULL,
        CONSTRAINT [PK_UserAPILimitCount] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190308101931_EntityUserAPILimitCount')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190308101931_EntityUserAPILimitCount', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190309045924_AddNewChargeCol')
BEGIN
    ALTER TABLE [UserAPILimitCount] ADD [PerMinCount] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190309045924_AddNewChargeCol')
BEGIN
    ALTER TABLE [UserAPILimitCount] ADD [PerMinUpdatedDate] datetime2 NOT NULL DEFAULT '0001-01-01T00:00:00.0000000';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190309045924_AddNewChargeCol')
BEGIN
    ALTER TABLE [MarginTrnChargeLog] ADD [OriginalAmount] decimal(28, 18) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190309045924_AddNewChargeCol')
BEGIN
    ALTER TABLE [MarginChargeConfigurationDetail] ADD [DeductChargetType] smallint NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190309045924_AddNewChargeCol')
BEGIN
    ALTER TABLE [MarginChargeConfigurationDetail] ADD [IsCurrencyConverted] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190309045924_AddNewChargeCol')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190309045924_AddNewChargeCol', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190309050117_AddNewChargeCol932019')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190309050117_AddNewChargeCol932019', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190309050307_MarginChargeColAdded')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190309050307_MarginChargeColAdded', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190311093825_APIReqResStatistics')
BEGIN
    ALTER TABLE [RestMethods] ADD [Path] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190311093825_APIReqResStatistics')
BEGIN
    CREATE TABLE [APIReqResStatistics] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [MethodID] bigint NOT NULL,
        [IPId] bigint NOT NULL,
        [UserID] bigint NOT NULL,
        [SuccessCount] bigint NOT NULL,
        [FaliureCount] bigint NOT NULL,
        CONSTRAINT [PK_APIReqResStatistics] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190311093825_APIReqResStatistics')
BEGIN
    CREATE TABLE [PublicAPIReqResLog] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [MethodID] bigint NOT NULL,
        [Path] nvarchar(max) NULL,
        [HTTPErrorCode] nvarchar(max) NULL,
        [HTTPStatusCode] nvarchar(max) NULL,
        [Device] nvarchar(max) NULL,
        [Browser] nvarchar(max) NULL,
        [Host] nvarchar(max) NULL,
        CONSTRAINT [PK_PublicAPIReqResLog] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190311093825_APIReqResStatistics')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190311093825_APIReqResStatistics', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190311095000_AddcolMethodType')
BEGIN
    ALTER TABLE [RestMethods] ADD [MethodType] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190311095000_AddcolMethodType')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190311095000_AddcolMethodType', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190311105146_ChangeDatatypeMethodType')
BEGIN
    DECLARE @var600 sysname;
    SELECT @var600 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RestMethods]') AND [c].[name] = N'MethodType');
    IF @var600 IS NOT NULL EXEC(N'ALTER TABLE [RestMethods] DROP CONSTRAINT [' + @var600 + '];');
    ALTER TABLE [RestMethods] ALTER COLUMN [MethodType] smallint NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190311105146_ChangeDatatypeMethodType')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190311105146_ChangeDatatypeMethodType', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190311113155_APIPlanMethodConfigurationHistory')
BEGIN
    CREATE TABLE [APIPlanMethodConfigurationHistory] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [APIPlanHistoryID] bigint NOT NULL,
        [RestMethodID] bigint NOT NULL,
        [APIPlanMasterID] bigint NOT NULL,
        [CustomeLimitId] bigint NOT NULL,
        CONSTRAINT [PK_APIPlanMethodConfigurationHistory] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190311113155_APIPlanMethodConfigurationHistory')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190311113155_APIPlanMethodConfigurationHistory', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190311131047_ChangeStringLength2019')
BEGIN
    DECLARE @var601 sysname;
    SELECT @var601 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletTransactionQueues]') AND [c].[name] = N'StatusMsg');
    IF @var601 IS NOT NULL EXEC(N'ALTER TABLE [WalletTransactionQueues] DROP CONSTRAINT [' + @var601 + '];');
    ALTER TABLE [WalletTransactionQueues] ALTER COLUMN [StatusMsg] nvarchar(100) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190311131047_ChangeStringLength2019')
BEGIN
    DECLARE @var602 sysname;
    SELECT @var602 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[MarginWalletTransactionQueue]') AND [c].[name] = N'StatusMsg');
    IF @var602 IS NOT NULL EXEC(N'ALTER TABLE [MarginWalletTransactionQueue] DROP CONSTRAINT [' + @var602 + '];');
    ALTER TABLE [MarginWalletTransactionQueue] ALTER COLUMN [StatusMsg] nvarchar(100) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190311131047_ChangeStringLength2019')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190311131047_ChangeStringLength2019', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190312063903_AddColMethodTypeIPAddress')
BEGIN
    ALTER TABLE [PublicAPIReqResLog] ADD [IPAddress] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190312063903_AddColMethodTypeIPAddress')
BEGIN
    ALTER TABLE [PublicAPIReqResLog] ADD [MethodType] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190312063903_AddColMethodTypeIPAddress')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190312063903_AddColMethodTypeIPAddress', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190312064943_UpdateDataTypeHTTPErrorCodeHTTPStatusCode')
BEGIN
    DECLARE @var603 sysname;
    SELECT @var603 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PublicAPIReqResLog]') AND [c].[name] = N'HTTPStatusCode');
    IF @var603 IS NOT NULL EXEC(N'ALTER TABLE [PublicAPIReqResLog] DROP CONSTRAINT [' + @var603 + '];');
    ALTER TABLE [PublicAPIReqResLog] ALTER COLUMN [HTTPStatusCode] bigint NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190312064943_UpdateDataTypeHTTPErrorCodeHTTPStatusCode')
BEGIN
    DECLARE @var604 sysname;
    SELECT @var604 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PublicAPIReqResLog]') AND [c].[name] = N'HTTPErrorCode');
    IF @var604 IS NOT NULL EXEC(N'ALTER TABLE [PublicAPIReqResLog] DROP CONSTRAINT [' + @var604 + '];');
    ALTER TABLE [PublicAPIReqResLog] ALTER COLUMN [HTTPErrorCode] bigint NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190312064943_UpdateDataTypeHTTPErrorCodeHTTPStatusCode')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190312064943_UpdateDataTypeHTTPErrorCodeHTTPStatusCode', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190312100712_DepositHistoryNewColAdd_WalletId')
BEGIN
    ALTER TABLE [DepositHistory] ADD [WalletId] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190312100712_DepositHistoryNewColAdd_WalletId')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190312100712_DepositHistoryNewColAdd_WalletId', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190313063004_AddnewColWhitelistIP')
BEGIN
    ALTER TABLE [PublicAPIReqResLog] ADD [WhitelistIP] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190313063004_AddnewColWhitelistIP')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190313063004_AddnewColWhitelistIP', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190313133746_addTrnwallettypeidcol')
BEGIN
    ALTER TABLE [AffiliateCommissionHistory] ADD [TrnWalletTypeId] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190313133746_addTrnwallettypeidcol')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190313133746_addTrnwallettypeidcol', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190314043422_AddTrnwallettypeidcol2019')
BEGIN
    ALTER TABLE [AffiliateSchemeDetail] ADD [TrnWalletTypeId] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190314043422_AddTrnwallettypeidcol2019')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190314043422_AddTrnwallettypeidcol2019', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190314102302_APIMethodsEntity')
BEGIN
    CREATE TABLE [APIMethodConfiguration] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [ParentID] bigint NOT NULL,
        [MethodID] bigint NOT NULL,
        [MethodType] bigint NOT NULL,
        CONSTRAINT [PK_APIMethodConfiguration] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190314102302_APIMethodsEntity')
BEGIN
    CREATE TABLE [APIMethods] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [MethodName] nvarchar(50) NOT NULL,
        [IsReadOnly] smallint NOT NULL,
        [IsFullAccess] smallint NOT NULL,
        CONSTRAINT [PK_APIMethods] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190314102302_APIMethodsEntity')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190314102302_APIMethodsEntity', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190315073349_AddUsdColInStatasticsDetail')
BEGIN
    ALTER TABLE [StatasticsDetail] ADD [USDAmount] decimal(18, 2) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190315073349_AddUsdColInStatasticsDetail')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190315073349_AddUsdColInStatasticsDetail', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190318125501_addkeyinmappingtbl')
BEGIN
    ALTER TABLE [AffiliateSchemeTypeMapping] DROP CONSTRAINT [PK_AffiliateSchemeTypeMapping];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190318125501_addkeyinmappingtbl')
BEGIN
    DECLARE @var605 sysname;
    SELECT @var605 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RestMethods]') AND [c].[name] = N'IsFullAccess');
    IF @var605 IS NOT NULL EXEC(N'ALTER TABLE [RestMethods] DROP CONSTRAINT [' + @var605 + '];');
    ALTER TABLE [RestMethods] DROP COLUMN [IsFullAccess];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190318125501_addkeyinmappingtbl')
BEGIN
    DECLARE @var606 sysname;
    SELECT @var606 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[RestMethods]') AND [c].[name] = N'IsReadOnly');
    IF @var606 IS NOT NULL EXEC(N'ALTER TABLE [RestMethods] DROP CONSTRAINT [' + @var606 + '];');
    ALTER TABLE [RestMethods] DROP COLUMN [IsReadOnly];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190318125501_addkeyinmappingtbl')
BEGIN
    ALTER TABLE [AffiliateSchemeTypeMapping] ADD CONSTRAINT [PK_AffiliateSchemeTypeMapping] PRIMARY KEY ([SchemeMstId], [SchemeTypeMstId]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190318125501_addkeyinmappingtbl')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190318125501_addkeyinmappingtbl', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190320053551_addcolinAffiliateCommissionHistory')
BEGIN
    ALTER TABLE [AffiliateCommissionHistory] ADD [CommissionPer] decimal(28, 18) NOT NULL DEFAULT 0.0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190320053551_addcolinAffiliateCommissionHistory')
BEGIN
    ALTER TABLE [AffiliateCommissionHistory] ADD [Level] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190320053551_addcolinAffiliateCommissionHistory')
BEGIN
    ALTER TABLE [AffiliateCommissionHistory] ADD [TransactionAmount] decimal(28, 18) NOT NULL DEFAULT 0.0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190320053551_addcolinAffiliateCommissionHistory')
BEGIN
    ALTER TABLE [AffiliateCommissionHistory] ADD [TrnDate] datetime2 NOT NULL DEFAULT '0001-01-01T00:00:00.0000000';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190320053551_addcolinAffiliateCommissionHistory')
BEGIN
    CREATE TABLE [TradingRecon] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [TrnNo] bigint NOT NULL,
        [OldStatus] smallint NOT NULL,
        [NewStatus] smallint NOT NULL,
        [Remarks] nvarchar(max) NOT NULL,
        CONSTRAINT [PK_TradingRecon] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190320053551_addcolinAffiliateCommissionHistory')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190320053551_addcolinAffiliateCommissionHistory', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190322051006_addColServiceIDAPIPlanMaster')
BEGIN
    ALTER TABLE [UserSubscribeAPIPlan] ADD [ServiceID] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190322051006_addColServiceIDAPIPlanMaster')
BEGIN
    ALTER TABLE [APIPlanMaster] ADD [Currency] nvarchar(6) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190322051006_addColServiceIDAPIPlanMaster')
BEGIN
    ALTER TABLE [APIPlanMaster] ADD [ServiceID] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190322051006_addColServiceIDAPIPlanMaster')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190322051006_addColServiceIDAPIPlanMaster', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190322053436_addColServiceIDAPIPlanConfigurationHistory')
BEGIN
    ALTER TABLE [APIPlanConfigurationHistory] ADD [Currency] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190322053436_addColServiceIDAPIPlanConfigurationHistory')
BEGIN
    ALTER TABLE [APIPlanConfigurationHistory] ADD [ServiceID] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190322053436_addColServiceIDAPIPlanConfigurationHistory')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190322053436_addColServiceIDAPIPlanConfigurationHistory', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190323081619_TradeQueueV1NewErrorCodeStatus')
BEGIN
    ALTER TABLE [TradePoolQueueV1] ADD [StatusCode] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190323081619_TradeQueueV1NewErrorCodeStatus')
BEGIN
    ALTER TABLE [TradePoolQueueV1] ADD [StatusMsg] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190323081619_TradeQueueV1NewErrorCodeStatus')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190323081619_TradeQueueV1NewErrorCodeStatus', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190323104340_AddNewColInRouteConfigAndUserSubscribePlan')
BEGIN
    ALTER TABLE [UserSubscribeAPIPlan] ADD [ChannelID] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190323104340_AddNewColInRouteConfigAndUserSubscribePlan')
BEGIN
    ALTER TABLE [RouteConfiguration] ADD [AccNoStartsWith] nvarchar(30) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190323104340_AddNewColInRouteConfigAndUserSubscribePlan')
BEGIN
    ALTER TABLE [RouteConfiguration] ADD [AccNoValidationRegex] nvarchar(80) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190323104340_AddNewColInRouteConfigAndUserSubscribePlan')
BEGIN
    ALTER TABLE [RouteConfiguration] ADD [AccountNoLen] int NOT NULL DEFAULT 0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190323104340_AddNewColInRouteConfigAndUserSubscribePlan')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190323104340_AddNewColInRouteConfigAndUserSubscribePlan', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190325095746_AddDateCol2')
BEGIN
    ALTER TABLE [AffiliateCommissionCron] ADD [FromDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190325095746_AddDateCol2')
BEGIN
    ALTER TABLE [AffiliateCommissionCron] ADD [ToDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190325095746_AddDateCol2')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190325095746_AddDateCol2', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190325122400_AddNewColInReferralRewards')
BEGIN
    ALTER TABLE [ReferralRewards] ADD [CommissionCroneID] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190325122400_AddNewColInReferralRewards')
BEGIN
    ALTER TABLE [ReferralRewards] ADD [CommissionCurrecyId] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190325122400_AddNewColInReferralRewards')
BEGIN
    ALTER TABLE [ReferralRewards] ADD [LifeTimeUserCount] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190325122400_AddNewColInReferralRewards')
BEGIN
    ALTER TABLE [ReferralRewards] ADD [NewUserCount] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190325122400_AddNewColInReferralRewards')
BEGIN
    ALTER TABLE [ReferralRewards] ADD [ReferralPayTypeId] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190325122400_AddNewColInReferralRewards')
BEGIN
    ALTER TABLE [ReferralRewards] ADD [SumChargeAmount] decimal(28, 18) NOT NULL DEFAULT 0.0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190325122400_AddNewColInReferralRewards')
BEGIN
    ALTER TABLE [ReferralRewards] ADD [SumOfTransaction] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190325122400_AddNewColInReferralRewards')
BEGIN
    ALTER TABLE [ReferralRewards] ADD [TransactionCurrencyId] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190325122400_AddNewColInReferralRewards')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190325122400_AddNewColInReferralRewards', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190325124822_ModuleTypeMasterAddColSubModuleMaster')
BEGIN
    ALTER TABLE [SubModuleMaster] ADD [GUID] uniqueidentifier NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190325124822_ModuleTypeMasterAddColSubModuleMaster')
BEGIN
    ALTER TABLE [SubModuleMaster] ADD [ParentGUID] uniqueidentifier NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190325124822_ModuleTypeMasterAddColSubModuleMaster')
BEGIN
    ALTER TABLE [SubModuleMaster] ADD [Type] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190325124822_ModuleTypeMasterAddColSubModuleMaster')
BEGIN
    CREATE TABLE [ModuleTypeMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [TypeName] nvarchar(20) NULL,
        [TypeValue] nvarchar(20) NULL,
        CONSTRAINT [PK_ModuleTypeMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190325124822_ModuleTypeMasterAddColSubModuleMaster')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190325124822_ModuleTypeMasterAddColSubModuleMaster', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190326060530_addnewfieldsInReferralRewards')
BEGIN
    ALTER TABLE [ReferralUser] ADD [IsCommissionCredited] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190326060530_addnewfieldsInReferralRewards')
BEGIN
    DECLARE @var607 sysname;
    SELECT @var607 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ReferralRewards]') AND [c].[name] = N'ReferralPayRewards');
    IF @var607 IS NOT NULL EXEC(N'ALTER TABLE [ReferralRewards] DROP CONSTRAINT [' + @var607 + '];');
    ALTER TABLE [ReferralRewards] ALTER COLUMN [ReferralPayRewards] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190326060530_addnewfieldsInReferralRewards')
BEGIN
    ALTER TABLE [ReferralRewards] ADD [CommissionAmount] decimal(28, 18) NOT NULL DEFAULT 0.0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190326060530_addnewfieldsInReferralRewards')
BEGIN
    ALTER TABLE [ReferralRewards] ADD [FromWalletId] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190326060530_addnewfieldsInReferralRewards')
BEGIN
    ALTER TABLE [ReferralRewards] ADD [ToWalletId] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190326060530_addnewfieldsInReferralRewards')
BEGIN
    ALTER TABLE [ReferralRewards] ADD [TrnRefNo] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190326060530_addnewfieldsInReferralRewards')
BEGIN
    ALTER TABLE [ReferralRewards] ADD [TrnUserId] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190326060530_addnewfieldsInReferralRewards')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190326060530_addnewfieldsInReferralRewards', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190326070833_addRemarksField')
BEGIN
    ALTER TABLE [TokenStakingHistory] ADD [Remarks] nvarchar(200) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190326070833_addRemarksField')
BEGIN
    ALTER TABLE [ReferralRewards] ADD [TransactionAmount] decimal(28, 18) NOT NULL DEFAULT 0.0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190326070833_addRemarksField')
BEGIN
    ALTER TABLE [ReferralRewards] ADD [TrnDate] datetime2 NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190326070833_addRemarksField')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190326070833_addRemarksField', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190326110206_addIsReferCommGiven')
BEGIN
    ALTER TABLE [TrnChargeLog] ADD [IsReferCommGiven] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190326110206_addIsReferCommGiven')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190326110206_addIsReferCommGiven', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190326133907_marginx')
BEGIN
    ALTER TABLE [MarginWalletTopupRequest] ADD [Leverage] decimal(28, 18) NOT NULL DEFAULT 0.0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190326133907_marginx')
BEGIN
    ALTER TABLE [LeverageMaster] ADD [InstantChargePer] decimal(28, 18) NOT NULL DEFAULT 0.0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190326133907_marginx')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190326133907_marginx', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190327073912_ModuleUtilityMaster')
BEGIN
    ALTER TABLE [SubModuleMaster] ADD [ModuleDomainType] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190327073912_ModuleUtilityMaster')
BEGIN
    CREATE TABLE [ModuleCRUDOptMaster] (
        [Id] bigint NOT NULL,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [OptName] nvarchar(20) NULL,
        [OptValue] nvarchar(20) NULL,
        CONSTRAINT [PK_ModuleCRUDOptMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190327073912_ModuleUtilityMaster')
BEGIN
    CREATE TABLE [ModuleDomainMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [DomainName] nvarchar(20) NULL,
        CONSTRAINT [PK_ModuleDomainMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190327073912_ModuleUtilityMaster')
BEGIN
    CREATE TABLE [ModuleUtilityMaster] (
        [Id] bigint NOT NULL,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [UtilityName] nvarchar(20) NULL,
        [UtilityValue] nvarchar(20) NULL,
        CONSTRAINT [PK_ModuleUtilityMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190327073912_ModuleUtilityMaster')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190327073912_ModuleUtilityMaster', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190327074757_removeModuleTypeMaster')
BEGIN
    DROP TABLE [ModuleTypeMaster];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190327074757_removeModuleTypeMaster')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190327074757_removeModuleTypeMaster', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190327075300_UpdateColIDModuleTypeMaster')
BEGIN
    CREATE TABLE [ModuleTypeMaster] (
        [Id] bigint NOT NULL,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [TypeName] nvarchar(20) NULL,
        [TypeValue] nvarchar(20) NULL,
        CONSTRAINT [PK_ModuleTypeMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190327075300_UpdateColIDModuleTypeMaster')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190327075300_UpdateColIDModuleTypeMaster', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190328065833_ModuleGroupAccessControl')
BEGIN
    DROP TABLE [ModuleCRUDOptMaster];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190328065833_ModuleGroupAccessControl')
BEGIN
    DROP TABLE [ModuleDomainMaster];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190328065833_ModuleGroupAccessControl')
BEGIN
    DROP TABLE [ModuleUtilityMaster];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190328065833_ModuleGroupAccessControl')
BEGIN
    DECLARE @var608 sysname;
    SELECT @var608 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SubModuleMaster]') AND [c].[name] = N'ModuleDomainType');
    IF @var608 IS NOT NULL EXEC(N'ALTER TABLE [SubModuleMaster] DROP CONSTRAINT [' + @var608 + '];');
    ALTER TABLE [SubModuleMaster] DROP COLUMN [ModuleDomainType];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190328065833_ModuleGroupAccessControl')
BEGIN
    ALTER TABLE [UserAccessRights] ADD [UserID] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190328065833_ModuleGroupAccessControl')
BEGIN
    ALTER TABLE [BizUser] ADD [GroupID] int NOT NULL DEFAULT 2;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190328065833_ModuleGroupAccessControl')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190328065833_ModuleGroupAccessControl', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190328072835_SubModuleGroupAccessControl')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190328072835_SubModuleGroupAccessControl', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190328095911_reAddModuleCRUDOptMaster')
BEGIN
    DROP TABLE [ModuleTypeMaster];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190328095911_reAddModuleCRUDOptMaster')
BEGIN
    CREATE TABLE [ModuleCRUDOptMaster] (
        [Id] bigint NOT NULL,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [OptName] nvarchar(20) NULL,
        [OptValue] nvarchar(20) NULL,
        CONSTRAINT [PK_ModuleCRUDOptMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190328095911_reAddModuleCRUDOptMaster')
BEGIN
    CREATE TABLE [ModuleDomainMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [DomainName] nvarchar(20) NULL,
        CONSTRAINT [PK_ModuleDomainMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190328095911_reAddModuleCRUDOptMaster')
BEGIN
    CREATE TABLE [ModuleUtilityMaster] (
        [Id] bigint NOT NULL,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [UtilityName] nvarchar(20) NULL,
        [UtilityValue] nvarchar(20) NULL,
        CONSTRAINT [PK_ModuleUtilityMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190328095911_reAddModuleCRUDOptMaster')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190328095911_reAddModuleCRUDOptMaster', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190328100306_reAddModuleTypeMaster')
BEGIN
    CREATE TABLE [ModuleTypeMaster] (
        [Id] bigint NOT NULL,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [TypeName] nvarchar(20) NULL,
        [TypeValue] nvarchar(20) NULL,
        CONSTRAINT [PK_ModuleTypeMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190328100306_reAddModuleTypeMaster')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190328100306_reAddModuleTypeMaster', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190328102439_ModuleGroupAccess')
BEGIN
    DROP TABLE [ModuleCRUDOptMaster];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190328102439_ModuleGroupAccess')
BEGIN
    DROP TABLE [ModuleDomainMaster];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190328102439_ModuleGroupAccess')
BEGIN
    DROP TABLE [ModuleUtilityMaster];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190328102439_ModuleGroupAccess')
BEGIN
    CREATE TABLE [ModuleGroupAccess] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [GroupID] int NOT NULL,
        [UtilityTypes] nvarchar(max) NULL,
        [CrudTypes] nvarchar(max) NULL,
        [SubModuleID] int NOT NULL,
        CONSTRAINT [PK_ModuleGroupAccess] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190328102439_ModuleGroupAccess')
BEGIN
    CREATE TABLE [ModuleGroupMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [GroupName] nvarchar(50) NOT NULL,
        [GroupDescription] nvarchar(100) NOT NULL,
        [RoleID] int NOT NULL,
        [ModuleDomainID] int NOT NULL,
        CONSTRAINT [PK_ModuleGroupMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190328102439_ModuleGroupAccess')
BEGIN
    CREATE TABLE [SubModuleFormMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [ModuleGroupAccessID] int NOT NULL,
        [CrudTypes] nvarchar(max) NULL,
        [FieldID] nvarchar(max) NULL,
        CONSTRAINT [PK_SubModuleFormMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190328102439_ModuleGroupAccess')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190328102439_ModuleGroupAccess', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190328111555_UpdateMasterModuleEntity2')
BEGIN
    CREATE TABLE [ModuleCRUDOptMaster] (
        [Id] bigint NOT NULL,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [OptName] nvarchar(20) NULL,
        [OptValue] nvarchar(20) NULL,
        CONSTRAINT [PK_ModuleCRUDOptMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190328111555_UpdateMasterModuleEntity2')
BEGIN
    CREATE TABLE [ModuleDomainMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [DomainName] nvarchar(20) NULL,
        CONSTRAINT [PK_ModuleDomainMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190328111555_UpdateMasterModuleEntity2')
BEGIN
    CREATE TABLE [ModuleUtilityMaster] (
        [Id] bigint NOT NULL,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [UtilityName] nvarchar(20) NULL,
        [UtilityValue] nvarchar(20) NULL,
        CONSTRAINT [PK_ModuleUtilityMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190328111555_UpdateMasterModuleEntity2')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190328111555_UpdateMasterModuleEntity2', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190328114215_addColModuleDomainType')
BEGIN
    ALTER TABLE [SubModuleMaster] ADD [ModuleDomainType] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190328114215_addColModuleDomainType')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190328114215_addColModuleDomainType', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190328125656_ProfitLossMargin')
BEGIN
    CREATE TABLE [MarginPNLAccount] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [TrnNo] bigint NOT NULL,
        [WTrnNo] bigint NOT NULL,
        [OpenPositionMasterID] bigint NOT NULL,
        [SettledQty] decimal(28, 18) NOT NULL,
        [AvgLandingBuy] decimal(28, 18) NOT NULL,
        [AvgLandingSell] decimal(28, 18) NOT NULL,
        [ProfitAmount] decimal(28, 18) NOT NULL,
        [UserID] bigint NOT NULL,
        [ProfitCurrencyName] nvarchar(max) NULL,
        [ProfitWalletID] bigint NOT NULL,
        CONSTRAINT [PK_MarginPNLAccount] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190328125656_ProfitLossMargin')
BEGIN
    CREATE TABLE [OpenPositionDetail] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [OpenPositionMasterID] bigint NOT NULL,
        [Guid] uniqueidentifier NOT NULL,
        [Qty] decimal(28, 18) NOT NULL,
        [BidPrice] decimal(28, 18) NOT NULL,
        [LandingPrice] decimal(28, 18) NOT NULL,
        [CurrencyName] nvarchar(max) NOT NULL,
        [TrnType] smallint NOT NULL,
        [TrnNo] bigint NOT NULL,
        [WTrnNo] bigint NOT NULL,
        [SystemRemarks] nvarchar(max) NOT NULL,
        CONSTRAINT [PK_OpenPositionDetail] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190328125656_ProfitLossMargin')
BEGIN
    CREATE TABLE [OpenPositionMaster] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [PairID] bigint NOT NULL,
        [BatchNo] uniqueidentifier NOT NULL,
        [UserID] bigint NOT NULL,
        CONSTRAINT [PK_OpenPositionMaster] PRIMARY KEY ([PairID], [UserID], [BatchNo]),
        CONSTRAINT [AK_OpenPositionMaster_BatchNo_PairID_UserID] UNIQUE ([BatchNo], [PairID], [UserID])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190328125656_ProfitLossMargin')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190328125656_ProfitLossMargin', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190329070626_AddedColInTokenUnstakingHistory')
BEGIN
    ALTER TABLE [TradePoolQueueMarginV1] ADD [StatusCode] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190329070626_AddedColInTokenUnstakingHistory')
BEGIN
    ALTER TABLE [TradePoolQueueMarginV1] ADD [StatusMsg] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190329070626_AddedColInTokenUnstakingHistory')
BEGIN
    ALTER TABLE [TokenUnStakingHistory] ADD [DegradeStakingAmount] decimal(28, 18) NOT NULL DEFAULT 0.0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190329070626_AddedColInTokenUnstakingHistory')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190329070626_AddedColInTokenUnstakingHistory', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190330093638_addLanguagePreferenceMaster')
BEGIN
    DECLARE @var609 sysname;
    SELECT @var609 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[OpenPositionDetail]') AND [c].[name] = N'SystemRemarks');
    IF @var609 IS NOT NULL EXEC(N'ALTER TABLE [OpenPositionDetail] DROP CONSTRAINT [' + @var609 + '];');
    ALTER TABLE [OpenPositionDetail] ALTER COLUMN [SystemRemarks] nvarchar(100) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190330093638_addLanguagePreferenceMaster')
BEGIN
    DECLARE @var610 sysname;
    SELECT @var610 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[OpenPositionDetail]') AND [c].[name] = N'CurrencyName');
    IF @var610 IS NOT NULL EXEC(N'ALTER TABLE [OpenPositionDetail] DROP CONSTRAINT [' + @var610 + '];');
    ALTER TABLE [OpenPositionDetail] ALTER COLUMN [CurrencyName] nvarchar(10) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190330093638_addLanguagePreferenceMaster')
BEGIN
    DECLARE @var611 sysname;
    SELECT @var611 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[MarginPNLAccount]') AND [c].[name] = N'ProfitCurrencyName');
    IF @var611 IS NOT NULL EXEC(N'ALTER TABLE [MarginPNLAccount] DROP CONSTRAINT [' + @var611 + '];');
    ALTER TABLE [MarginPNLAccount] ALTER COLUMN [ProfitCurrencyName] nvarchar(10) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190330093638_addLanguagePreferenceMaster')
BEGIN
    ALTER TABLE [BizUser] ADD [PreferedLanguage] nvarchar(5) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190330093638_addLanguagePreferenceMaster')
BEGIN
    CREATE TABLE [LanguagePreferenceMaster] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [LanguageId] nvarchar(max) NOT NULL,
        [PreferedLanguage] nvarchar(5) NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [Icon] nvarchar(max) NOT NULL,
        CONSTRAINT [PK_LanguagePreferenceMaster] PRIMARY KEY ([PreferedLanguage])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190330093638_addLanguagePreferenceMaster')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190330093638_addLanguagePreferenceMaster', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190330100946_AddNewColSubModuleMaster')
BEGIN
    ALTER TABLE [SubModuleMaster] ADD [Controller] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190330100946_AddNewColSubModuleMaster')
BEGIN
    ALTER TABLE [SubModuleMaster] ADD [MethodName] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190330100946_AddNewColSubModuleMaster')
BEGIN
    ALTER TABLE [SubModuleMaster] ADD [Path] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190330100946_AddNewColSubModuleMaster')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190330100946_AddNewColSubModuleMaster', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190402130042_AddColumnTradingRecon')
BEGIN
    ALTER TABLE [TradingRecon] ADD [StatusCode] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190402130042_AddColumnTradingRecon')
BEGIN
    ALTER TABLE [TradingRecon] ADD [StatusMsg] nvarchar(max) NOT NULL DEFAULT N'';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190402130042_AddColumnTradingRecon')
BEGIN
    ALTER TABLE [TradeTransactionQueueMargin] ADD [ISOrderBySystem] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190402130042_AddColumnTradingRecon')
BEGIN
    ALTER TABLE [TradeTransactionQueueMargin] ADD [IsWithoutAmtHold] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190402130042_AddColumnTradingRecon')
BEGIN
    ALTER TABLE [TradeSellerListMarginV1] ADD [ISOrderBySystem] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190402130042_AddColumnTradingRecon')
BEGIN
    ALTER TABLE [TradeSellerListMarginV1] ADD [IsWithoutAmtHold] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190402130042_AddColumnTradingRecon')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190402130042_AddColumnTradingRecon', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190403115736_marginloanchanges')
BEGIN
    DROP TABLE [MarginWalletTopupRequest];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190403115736_marginloanchanges')
BEGIN
    DECLARE @var612 sysname;
    SELECT @var612 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[MarginWalletMaster]') AND [c].[name] = N'WalletUsageType');
    IF @var612 IS NOT NULL EXEC(N'ALTER TABLE [MarginWalletMaster] DROP CONSTRAINT [' + @var612 + '];');
    ALTER TABLE [MarginWalletMaster] ALTER COLUMN [WalletUsageType] int NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190403115736_marginloanchanges')
BEGIN
    DECLARE @var613 sysname;
    SELECT @var613 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[LeverageMaster]') AND [c].[name] = N'MarginChargePer');
    IF @var613 IS NOT NULL EXEC(N'ALTER TABLE [LeverageMaster] DROP CONSTRAINT [' + @var613 + '];');
    ALTER TABLE [LeverageMaster] ALTER COLUMN [MarginChargePer] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190403115736_marginloanchanges')
BEGIN
    CREATE TABLE [MarginLoanRequest] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [WalletTypeID] bigint NOT NULL,
        [FromWalletID] bigint NOT NULL,
        [ToWalletID] bigint NOT NULL,
        [UserID] bigint NOT NULL,
        [LeverageID] bigint NOT NULL,
        [IsAutoApprove] smallint NOT NULL,
        [RequestRemarks] nvarchar(500) NOT NULL,
        [Amount] decimal(28, 18) NOT NULL,
        [TrnDate] datetime2 NOT NULL,
        [LeverageAmount] decimal(28, 18) NOT NULL,
        [ChargeAmount] decimal(28, 18) NOT NULL,
        [SafetyMarginAmount] decimal(28, 18) NOT NULL,
        [CreditAmount] decimal(28, 18) NOT NULL,
        [ApprovedBy] bigint NULL,
        [ApprovedDate] datetime2 NULL,
        [ApprovedRemarks] nvarchar(500) NULL,
        [SystemRemarks] nvarchar(500) NULL,
        [Status] int NOT NULL,
        [IsChargeDeducted] smallint NOT NULL,
        [Leverage] decimal(28, 18) NOT NULL,
        [MaxLeverage] decimal(28, 18) NOT NULL,
        [TotalSafetyCharge] decimal(28, 18) NOT NULL,
        [DailyChargePer] decimal(28, 18) NOT NULL,
        [LastChargeCalculated] datetime2 NULL,
        CONSTRAINT [PK_MarginLoanRequest] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190403115736_marginloanchanges')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190403115736_marginloanchanges', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190403125259_AddEntityVisibility_FieldRequirer_AccessRights')
BEGIN
    EXEC sp_rename N'[FieldMaster].[Visibility]', N'Required', N'COLUMN';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190403125259_AddEntityVisibility_FieldRequirer_AccessRights')
BEGIN
    ALTER TABLE [SubModuleFormMaster] ADD [Visibility] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190403125259_AddEntityVisibility_FieldRequirer_AccessRights')
BEGIN
    ALTER TABLE [FieldMaster] ADD [AccressRight] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190403125259_AddEntityVisibility_FieldRequirer_AccessRights')
BEGIN
    CREATE TABLE [ModuleAccessRightsMaster] (
        [Id] bigint NOT NULL,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [AccessRightName] nvarchar(20) NULL,
        [AccessRightValue] nvarchar(20) NULL,
        CONSTRAINT [PK_ModuleAccessRightsMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190403125259_AddEntityVisibility_FieldRequirer_AccessRights')
BEGIN
    CREATE TABLE [ModuleFieldRequirerMaster] (
        [Id] bigint NOT NULL,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Name] nvarchar(20) NULL,
        [Value] nvarchar(20) NULL,
        CONSTRAINT [PK_ModuleFieldRequirerMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190403125259_AddEntityVisibility_FieldRequirer_AccessRights')
BEGIN
    CREATE TABLE [ModuleVisibilityMaster] (
        [Id] bigint NOT NULL,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [VisibilityName] nvarchar(20) NULL,
        [VisibilityValue] nvarchar(20) NULL,
        CONSTRAINT [PK_ModuleVisibilityMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190403125259_AddEntityVisibility_FieldRequirer_AccessRights')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190403125259_AddEntityVisibility_FieldRequirer_AccessRights', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190404044554_AddGUIDToFieldMaster')
BEGIN
    ALTER TABLE [FieldMaster] ADD [GUID] uniqueidentifier NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190404044554_AddGUIDToFieldMaster')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190404044554_AddGUIDToFieldMaster', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190404123135_margincharge')
BEGIN
    ALTER TABLE [MarginLoanRequest] ADD [SafetyWalletID] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190404123135_margincharge')
BEGIN
    CREATE TABLE [LoanChargeDetail] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [BatchNo] bigint NOT NULL,
        [LoanID] bigint NOT NULL,
        [UserID] bigint NOT NULL,
        [SafetyWalletID] bigint NOT NULL,
        [MarginWalletID] bigint NOT NULL,
        [TrnDate] datetime2 NOT NULL,
        [LoanAmount] decimal(28, 18) NOT NULL,
        [Leverage] decimal(28, 18) NOT NULL,
        [LeverageMax] decimal(28, 18) NOT NULL,
        [SafetyPreBal] decimal(28, 18) NOT NULL,
        [MarginPreBal] decimal(28, 18) NOT NULL,
        [DailyChargePer] decimal(28, 18) NOT NULL,
        [DailyChargeValue] decimal(28, 18) NOT NULL,
        [MarginChargeCase] int NOT NULL,
        [ErrorCode] int NOT NULL,
        [ErrorMsg] nvarchar(250) NULL,
        CONSTRAINT [PK_LoanChargeDetail] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190404123135_margincharge')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190404123135_margincharge', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190405052749_AddedPKOnWalletTypeName')
BEGIN
    ALTER TABLE [WalletTypeMasters] DROP CONSTRAINT [PK_WalletTypeMasters];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190405052749_AddedPKOnWalletTypeName')
BEGIN
    ALTER TABLE [WalletTypeMasters] ADD CONSTRAINT [PK_WalletTypeMasters] PRIMARY KEY ([WalletTypeName]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190405052749_AddedPKOnWalletTypeName')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190405052749_AddedPKOnWalletTypeName', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190405103153_AddNewReferelEntity')
BEGIN
    CREATE TABLE [ReferralSchemeTypeMapping] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [PayTypeId] bigint NOT NULL,
        [ServiceTypeMstId] bigint NOT NULL,
        [MinimumDepositionRequired] decimal(28, 18) NOT NULL,
        [Description] nvarchar(max) NULL,
        [FromDate] datetime2 NOT NULL,
        [ToDate] datetime2 NOT NULL,
        CONSTRAINT [PK_ReferralSchemeTypeMapping] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190405103153_AddNewReferelEntity')
BEGIN
    CREATE TABLE [ReferralServiceDetail] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [SchemeTypeMappingId] bigint NOT NULL,
        [MaximumLevel] bigint NOT NULL,
        [MaximumCoin] bigint NOT NULL,
        [MinimumValue] decimal(28, 18) NOT NULL,
        [MaximumValue] decimal(28, 18) NOT NULL,
        [CreditWalletTypeId] bigint NOT NULL,
        [CommissionType] int NOT NULL,
        [CommissionValue] decimal(28, 18) NOT NULL,
        CONSTRAINT [PK_ReferralServiceDetail] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190405103153_AddNewReferelEntity')
BEGIN
    CREATE TABLE [ReferralUserLevelMapping] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [UserId] bigint NOT NULL,
        [ReferUserId] bigint NOT NULL,
        [Level] bigint NOT NULL,
        [IsCommissionCredited] smallint NOT NULL,
        CONSTRAINT [PK_ReferralUserLevelMapping] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190405103153_AddNewReferelEntity')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190405103153_AddNewReferelEntity', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190408103238_marginchargeorder')
BEGIN
    CREATE TABLE [MarginChargeOrder] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [BatchNo] bigint NOT NULL,
        [LoanID] bigint NOT NULL,
        [UserID] bigint NOT NULL,
        [TrnDate] datetime2 NOT NULL,
        [Amount] decimal(28, 18) NOT NULL,
        [PairID] bigint NOT NULL,
        [MarginChargeCase] int NOT NULL,
        [TrnRefNo] bigint NOT NULL,
        [Guid] nvarchar(max) NULL,
        [DebitAccountID] nvarchar(max) NULL,
        [CreditAccountID] nvarchar(max) NULL,
        [SMSCode] nvarchar(max) NULL,
        CONSTRAINT [PK_MarginChargeOrder] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190408103238_marginchargeorder')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190408103238_marginchargeorder', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190409112055_MarginChargeOrderTwocolumn')
BEGIN
    ALTER TABLE [OpenPositionMaster] ADD [BaseCurrency] nvarchar(10) NOT NULL DEFAULT N'';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190409112055_MarginChargeOrderTwocolumn')
BEGIN
    ALTER TABLE [MarginChargeOrder] ADD [BaseCurrency] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190409112055_MarginChargeOrderTwocolumn')
BEGIN
    ALTER TABLE [MarginChargeOrder] ADD [Remarks] nvarchar(250) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190409112055_MarginChargeOrderTwocolumn')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190409112055_MarginChargeOrderTwocolumn', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190410064800_addIsTradingCommissionCredited')
BEGIN
    ALTER TABLE [ReferralUserLevelMapping] ADD [IsTradingCommissionCredited] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190410064800_addIsTradingCommissionCredited')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190410064800_addIsTradingCommissionCredited', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190411045950_AddColBalCheckMethodTypeInThirdParty')
BEGIN
    ALTER TABLE [ThirdPartyAPIConfiguration] ADD [BalCheckMethodType] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190411045950_AddColBalCheckMethodTypeInThirdParty')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190411045950_AddColBalCheckMethodTypeInThirdParty', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190411061130_userloanavgentity')
BEGIN
    ALTER TABLE [MarginLoanRequest] ADD [UserLoanMasterID] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190411061130_userloanavgentity')
BEGIN
    CREATE TABLE [UserLoanMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [SMSCode] nvarchar(max) NOT NULL,
        [WalletTypeID] bigint NOT NULL,
        [ToWalletID] bigint NOT NULL,
        [UserID] bigint NOT NULL,
        [Amount] decimal(28, 18) NOT NULL,
        [TrnDate] datetime2 NOT NULL,
        [LeverageAmount] decimal(28, 18) NOT NULL,
        [SafetyMarginAmount] decimal(28, 18) NOT NULL,
        [CreditAmount] decimal(28, 18) NOT NULL,
        [SystemRemarks] nvarchar(500) NULL,
        [Status] int NOT NULL,
        [Leverage] decimal(28, 18) NOT NULL,
        [MaxLeverage] decimal(28, 18) NOT NULL,
        [TotalSafetyCharge] decimal(28, 18) NOT NULL,
        [DailyChargePer] decimal(28, 18) NOT NULL,
        [LastChargeCalculated] datetime2 NULL,
        [SafetyWalletID] bigint NOT NULL,
        CONSTRAINT [PK_UserLoanMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190411061130_userloanavgentity')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190411061130_userloanavgentity', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190412130717_withdwmarginentity')
BEGIN
    CREATE TABLE [WithdrawLoanMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [LoanID] nvarchar(max) NOT NULL,
        [SMSCode] nvarchar(max) NOT NULL,
        [WalletTypeID] bigint NOT NULL,
        [ToWalletID] bigint NOT NULL,
        [SafetyWalletID] bigint NOT NULL,
        [ProfitWalletID] bigint NOT NULL,
        [UserID] bigint NOT NULL,
        [TrnDate] datetime2 NOT NULL,
        [SafetyMarginAmount] decimal(28, 18) NOT NULL,
        [ProfitMarginAmount] decimal(28, 18) NOT NULL,
        [CreditAmount] decimal(28, 18) NOT NULL,
        [SystemRemarks] nvarchar(500) NULL,
        [StatusMessage] nvarchar(100) NULL,
        CONSTRAINT [PK_WithdrawLoanMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190412130717_withdwmarginentity')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190412130717_withdwmarginentity', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190415124833_margincolumns')
BEGIN
    ALTER TABLE [WithdrawLoanMaster] ADD [ChargeAmount] decimal(28, 18) NOT NULL DEFAULT 0.0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190415124833_margincolumns')
BEGIN
    ALTER TABLE [WithdrawLoanMaster] ADD [ErrorCode] int NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190415124833_margincolumns')
BEGIN
    ALTER TABLE [MarginLoanRequest] ADD [UpgradeLoanID] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190415124833_margincolumns')
BEGIN
    CREATE TABLE [CloseOpenPostionMargin] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [UserID] bigint NOT NULL,
        [PairID] bigint NOT NULL,
        [TrnRefNo] nvarchar(max) NULL,
        CONSTRAINT [PK_CloseOpenPostionMargin] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190415124833_margincolumns')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190415124833_margincolumns', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190417052618_profitperloan')
BEGIN
    ALTER TABLE [UserLoanMaster] ADD [ProfitAmount] decimal(28, 18) NOT NULL DEFAULT 0.0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190417052618_profitperloan')
BEGIN
    ALTER TABLE [OpenPositionMaster] ADD [LoanID] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190417052618_profitperloan')
BEGIN
    ALTER TABLE [MarginPNLAccount] ADD [LoanID] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190417052618_profitperloan')
BEGIN
    CREATE TABLE [SiteTokenConversionMargin] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [GUID] uniqueidentifier NOT NULL,
        [UserID] bigint NOT NULL,
        [SourceCurrencyID] bigint NOT NULL,
        [SourceCurrency] nvarchar(max) NULL,
        [TargerCurrencyID] bigint NOT NULL,
        [TargerCurrency] nvarchar(max) NULL,
        [SourceCurrencyQty] decimal(28, 18) NOT NULL,
        [TargerCurrencyQty] decimal(28, 18) NOT NULL,
        [SourceToBasePrice] decimal(28, 18) NOT NULL,
        [SourceToBaseQty] decimal(28, 18) NOT NULL,
        [TokenPrice] decimal(28, 18) NOT NULL,
        [SiteTokenMasterID] bigint NOT NULL,
        [TimeStamp] nvarchar(max) NULL,
        [StatusMsg] nvarchar(max) NULL,
        CONSTRAINT [PK_SiteTokenConversionMargin] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190417052618_profitperloan')
BEGIN
    CREATE TABLE [SiteTokenMasterMargin] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [CurrencyID] bigint NOT NULL,
        [BaseCurrencyID] bigint NOT NULL,
        [CurrencySMSCode] nvarchar(max) NOT NULL,
        [BaseCurrencySMSCode] nvarchar(max) NOT NULL,
        [RateType] smallint NOT NULL,
        [PairID] bigint NOT NULL,
        [Rate] decimal(28, 18) NOT NULL,
        [MinLimit] decimal(28, 18) NOT NULL,
        [MaxLimit] decimal(28, 18) NOT NULL,
        [DailyLimit] decimal(28, 18) NOT NULL,
        [WeeklyLimit] decimal(28, 18) NOT NULL,
        [MonthlyLimit] decimal(28, 18) NOT NULL,
        [Note] nvarchar(max) NULL,
        CONSTRAINT [PK_SiteTokenMasterMargin] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190417052618_profitperloan')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190417052618_profitperloan', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190417072140_ProfitAmountChargeTableMargin')
BEGIN
    ALTER TABLE [LoanChargeDetail] ADD [LoanProfit] decimal(28, 18) NOT NULL DEFAULT 0.0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190417072140_ProfitAmountChargeTableMargin')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190417072140_ProfitAmountChargeTableMargin', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190417141712_currencytype_wallettype')
BEGIN
    ALTER TABLE [WalletTypeMasters] ADD [CurrencyTypeID] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190417141712_currencytype_wallettype')
BEGIN
    ALTER TABLE [MarginWalletTypeMaster] ADD [CurrencyTypeID] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190417141712_currencytype_wallettype')
BEGIN
    ALTER TABLE [MarginChargeOrder] ADD [LoanProfit] decimal(28, 18) NOT NULL DEFAULT 0.0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190417141712_currencytype_wallettype')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190417141712_currencytype_wallettype', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190418065331_addresstype')
BEGIN
    ALTER TABLE [AddressMasters] ADD [AddressType] int NOT NULL DEFAULT 0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190418065331_addresstype')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190418065331_addresstype', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190418093024_AddCol_UtilityTypes_CrudTypes')
BEGIN
    ALTER TABLE [SubModuleMaster] ADD [CrudTypes] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190418093024_AddCol_UtilityTypes_CrudTypes')
BEGIN
    ALTER TABLE [SubModuleMaster] ADD [UtilityTypes] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190418093024_AddCol_UtilityTypes_CrudTypes')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190418093024_AddCol_UtilityTypes_CrudTypes', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190419061636_margincurrencypk')
BEGIN
    ALTER TABLE [MarginWalletTypeMaster] DROP CONSTRAINT [PK_MarginWalletTypeMaster];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190419061636_margincurrencypk')
BEGIN
    ALTER TABLE [MarginWalletTypeMaster] ADD CONSTRAINT [PK_MarginWalletTypeMaster] PRIMARY KEY ([WalletTypeName]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190419061636_margincurrencypk')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190419061636_margincurrencypk', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190423094948_AddColBalCheckURLInThirdParty')
BEGIN
    ALTER TABLE [ThirdPartyAPIConfiguration] ADD [BalCheckRequestBody] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190423094948_AddColBalCheckURLInThirdParty')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190423094948_AddColBalCheckURLInThirdParty', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190426052254_cronmaster')
BEGIN
    CREATE TABLE [CronMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Name] nvarchar(100) NOT NULL,
        CONSTRAINT [PK_CronMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190426052254_cronmaster')
BEGIN
    CREATE TABLE [MarginTradingAllowToUser] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [UserId] bigint NOT NULL,
        CONSTRAINT [PK_MarginTradingAllowToUser] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190426052254_cronmaster')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190426052254_cronmaster', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190429050557_AddDepositionEntity')
BEGIN
    CREATE TABLE [MarginAddressMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [WalletId] bigint NOT NULL,
        [Address] nvarchar(50) NULL,
        [IsDefaultAddress] tinyint NOT NULL,
        [SerProID] bigint NOT NULL,
        [AddressLable] nvarchar(50) NOT NULL,
        [OriginalAddress] nvarchar(50) NOT NULL,
        [GUID] nvarchar(max) NULL,
        [AddressType] int NOT NULL,
        CONSTRAINT [PK_MarginAddressMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190429050557_AddDepositionEntity')
BEGIN
    CREATE TABLE [MarginDepositCounterLog] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [NewTxnID] nvarchar(max) NULL,
        [PreviousTrnID] nvarchar(max) NULL,
        [LastTrnID] nvarchar(max) NULL,
        [LastLimit] bigint NOT NULL,
        [NextBatchPrvID] nvarchar(max) NULL,
        [DepositCounterMasterId] bigint NOT NULL,
        CONSTRAINT [PK_MarginDepositCounterLog] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190429050557_AddDepositionEntity')
BEGIN
    CREATE TABLE [MarginDepositCounterMaster] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [RecordCount] int NOT NULL,
        [Limit] bigint NOT NULL,
        [LastTrnID] nvarchar(max) NULL,
        [MaxLimit] bigint NOT NULL,
        [WalletTypeID] bigint NOT NULL,
        [SerProId] bigint NOT NULL,
        [PreviousTrnID] nvarchar(max) NULL,
        [prevIterationID] nvarchar(max) NULL,
        [TPSPickupStatus] bigint NOT NULL,
        [AppType] int NOT NULL,
        CONSTRAINT [PK_MarginDepositCounterMaster] PRIMARY KEY ([WalletTypeID], [SerProId]),
        CONSTRAINT [AK_MarginDepositCounterMaster_SerProId_WalletTypeID] UNIQUE ([SerProId], [WalletTypeID])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190429050557_AddDepositionEntity')
BEGIN
    CREATE TABLE [MarginDepositHistory] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [TrnID] nvarchar(100) NOT NULL,
        [SMSCode] nvarchar(max) NOT NULL,
        [Address] nvarchar(50) NOT NULL,
        [Confirmations] bigint NOT NULL,
        [Amount] decimal(28, 18) NOT NULL,
        [StatusMsg] nvarchar(100) NOT NULL,
        [TimeEpoch] nvarchar(max) NOT NULL,
        [ConfirmedTime] nvarchar(max) NOT NULL,
        [EpochTimePure] nvarchar(max) NULL,
        [OrderID] bigint NOT NULL,
        [IsProcessing] tinyint NOT NULL,
        [FromAddress] nvarchar(50) NOT NULL,
        [APITopUpRefNo] nvarchar(max) NULL,
        [SystemRemarks] nvarchar(max) NULL,
        [RouteTag] nvarchar(max) NULL,
        [SerProID] bigint NOT NULL,
        [UserId] bigint NOT NULL,
        [IsInternalTrn] smallint NULL,
        [WalletId] bigint NOT NULL,
        CONSTRAINT [PK_MarginDepositHistory] PRIMARY KEY ([TrnID], [Address]),
        CONSTRAINT [AK_MarginDepositHistory_Address_TrnID] UNIQUE ([Address], [TrnID])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190429050557_AddDepositionEntity')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190429050557_AddDepositionEntity', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190429092759_addChargeCurrencyCol')
BEGIN
    ALTER TABLE [TransactionQueueMargin] ADD [ChargeCurrency] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190429092759_addChargeCurrencyCol')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190429092759_addChargeCurrencyCol', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190501074254_closepositionwallet')
BEGIN
    CREATE TABLE [DepositionRequired] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [UserID] bigint NOT NULL,
        [SMSCode] nvarchar(max) NOT NULL,
        [Amount] decimal(28, 18) NOT NULL,
        [LoanID] bigint NOT NULL,
        [WalletID] bigint NOT NULL,
        [TrnType] int NOT NULL,
        [TrnRefNo] nvarchar(max) NULL,
        [ReceivedDate] datetime2 NULL,
        CONSTRAINT [PK_DepositionRequired] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190501074254_closepositionwallet')
BEGIN
    CREATE TABLE [MarginCloseUserPositionWallet] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [UserID] bigint NOT NULL,
        [WalletTypeID] bigint NOT NULL,
        [SMSCode] nvarchar(max) NULL,
        [TrnRefNo] nvarchar(max) NULL,
        [LoanID] bigint NOT NULL,
        [ErrorCode] bigint NOT NULL,
        [ErrorMessage] nvarchar(max) NULL,
        CONSTRAINT [PK_MarginCloseUserPositionWallet] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190501074254_closepositionwallet')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190501074254_closepositionwallet', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190501113826_priorityInMarketPair')
BEGIN
    ALTER TABLE [TradePairMasterMargin] ADD [Priority] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190501113826_priorityInMarketPair')
BEGIN
    ALTER TABLE [TradePairMaster] ADD [Priority] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190501113826_priorityInMarketPair')
BEGIN
    ALTER TABLE [MarketMargin] ADD [Priority] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190501113826_priorityInMarketPair')
BEGIN
    ALTER TABLE [Market] ADD [Priority] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190501113826_priorityInMarketPair')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190501113826_priorityInMarketPair', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190502064603_AddColumnCountryMasterCountryDialingCode')
BEGIN
    ALTER TABLE [CountryMaster] ADD [CountryDialingCode] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190502064603_AddColumnCountryMasterCountryDialingCode')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190502064603_AddColumnCountryMasterCountryDialingCode', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190502071601_ChangeServiceProConfiguration')
BEGIN
    DECLARE @var614 sysname;
    SELECT @var614 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ServiceProConfiguration]') AND [c].[name] = N'SecretKey');
    IF @var614 IS NOT NULL EXEC(N'ALTER TABLE [ServiceProConfiguration] DROP CONSTRAINT [' + @var614 + '];');
    ALTER TABLE [ServiceProConfiguration] ALTER COLUMN [SecretKey] nvarchar(100) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190502071601_ChangeServiceProConfiguration')
BEGIN
    DECLARE @var615 sysname;
    SELECT @var615 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ServiceProConfiguration]') AND [c].[name] = N'APIKey');
    IF @var615 IS NOT NULL EXEC(N'ALTER TABLE [ServiceProConfiguration] DROP CONSTRAINT [' + @var615 + '];');
    ALTER TABLE [ServiceProConfiguration] ALTER COLUMN [APIKey] nvarchar(100) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190502071601_ChangeServiceProConfiguration')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190502071601_ChangeServiceProConfiguration', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190502114038_ChangeCountrymasterColumn')
BEGIN
    DECLARE @var616 sysname;
    SELECT @var616 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CountryMaster]') AND [c].[name] = N'CountryName');
    IF @var616 IS NOT NULL EXEC(N'ALTER TABLE [CountryMaster] DROP CONSTRAINT [' + @var616 + '];');
    ALTER TABLE [CountryMaster] ALTER COLUMN [CountryName] nvarchar(100) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190502114038_ChangeCountrymasterColumn')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190502114038_ChangeCountrymasterColumn', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190506082531_AddColInAddressAndMarginAddressMaster')
BEGIN
    ALTER TABLE [ServiceProConfiguration] ADD [Param1] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190506082531_AddColInAddressAndMarginAddressMaster')
BEGIN
    ALTER TABLE [ServiceProConfiguration] ADD [Param2] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190506082531_AddColInAddressAndMarginAddressMaster')
BEGIN
    ALTER TABLE [ServiceProConfiguration] ADD [Param3] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190506082531_AddColInAddressAndMarginAddressMaster')
BEGIN
    ALTER TABLE [ServiceProConfiguration] ADD [Param4] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190506082531_AddColInAddressAndMarginAddressMaster')
BEGIN
    ALTER TABLE [ServiceProConfiguration] ADD [Param5] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190506082531_AddColInAddressAndMarginAddressMaster')
BEGIN
    ALTER TABLE [MarginAddressMaster] ADD [TxnID] nvarchar(150) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190506082531_AddColInAddressAndMarginAddressMaster')
BEGIN
    ALTER TABLE [AddressMasters] ADD [TxnID] nvarchar(150) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190506082531_AddColInAddressAndMarginAddressMaster')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190506082531_AddColInAddressAndMarginAddressMaster', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190513074855_addEntitySubscribeNewsLetter')
BEGIN
    CREATE TABLE [SubscribeNewsLetter] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Email] nvarchar(max) NULL,
        [NormalizedEmail] nvarchar(max) NULL,
        CONSTRAINT [PK_SubscribeNewsLetter] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190513074855_addEntitySubscribeNewsLetter')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190513074855_addEntitySubscribeNewsLetter', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190513122330_AddColIsStopConvertAmount')
BEGIN
    ALTER TABLE [ServiceProviderDetail] ADD [IsStopConvertAmount] int NOT NULL DEFAULT 0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190513122330_AddColIsStopConvertAmount')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190513122330_AddColIsStopConvertAmount', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190514063811_AddNewEntityBlockUnblockUserAddress')
BEGIN
    ALTER TABLE [DepositHistory] ADD [FlushTrnHash] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190514063811_AddNewEntityBlockUnblockUserAddress')
BEGIN
    ALTER TABLE [DepositHistory] ADD [IsFlushAddProcess] int NOT NULL DEFAULT 0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190514063811_AddNewEntityBlockUnblockUserAddress')
BEGIN
    ALTER TABLE [DepositCounterMaster] ADD [FlushAddressEnable] int NOT NULL DEFAULT 0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190514063811_AddNewEntityBlockUnblockUserAddress')
BEGIN
    CREATE TABLE [BlockUnblockUserAddress] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [UserID] bigint NOT NULL,
        [WalletID] bigint NOT NULL,
        [Address] nvarchar(50) NOT NULL,
        [WalletTypeID] bigint NOT NULL,
        [TrnHash] nvarchar(max) NULL,
        [Remarks] nvarchar(150) NULL,
        CONSTRAINT [PK_BlockUnblockUserAddress] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190514063811_AddNewEntityBlockUnblockUserAddress')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190514063811_AddNewEntityBlockUnblockUserAddress', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190516080928_AddTimeCol')
BEGIN
    ALTER TABLE [DepositCounterMaster] ADD [EndTime] float NOT NULL DEFAULT 0E0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190516080928_AddTimeCol')
BEGIN
    ALTER TABLE [DepositCounterMaster] ADD [StartTime] float NOT NULL DEFAULT 0E0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190516080928_AddTimeCol')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190516080928_AddTimeCol', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190520053754_isprocessingmrgn')
BEGIN
    ALTER TABLE [WalletTransactionQueues] ADD [IsProcessing] int NOT NULL DEFAULT 0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190520053754_isprocessingmrgn')
BEGIN
    ALTER TABLE [MarginWalletTransactionQueue] ADD [IsProcessing] int NOT NULL DEFAULT 0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190520053754_isprocessingmrgn')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190520053754_isprocessingmrgn', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190520071919_AddNewEntityDestroyFundReq')
BEGIN
    ALTER TABLE [BlockUnblockUserAddress] ADD [IsDestroyed] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190520071919_AddNewEntityDestroyFundReq')
BEGIN
    CREATE TABLE [DestroyFundRequest] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Address] nvarchar(max) NULL,
        [Remarks] nvarchar(max) NULL,
        CONSTRAINT [PK_DestroyFundRequest] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190520071919_AddNewEntityDestroyFundReq')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190520071919_AddNewEntityDestroyFundReq', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190520113004_AddNewEntityTokenTransferHistory')
BEGIN
    CREATE TABLE [TokenTransferHistory] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [FromAddress] nvarchar(max) NOT NULL,
        [ToAddress] nvarchar(max) NOT NULL,
        [Amount] decimal(18, 2) NOT NULL,
        [TrnHash] nvarchar(max) NULL,
        CONSTRAINT [PK_TokenTransferHistory] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190520113004_AddNewEntityTokenTransferHistory')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190520113004_AddNewEntityTokenTransferHistory', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190522053552_AddNewEntityTokenSupplyHistory')
BEGIN
    ALTER TABLE [RouteConfiguration] ADD [ContractAddress] nvarchar(100) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190522053552_AddNewEntityTokenSupplyHistory')
BEGIN
    CREATE TABLE [TokenSupplyHistory] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [WalletTypeId] bigint NOT NULL,
        [ContractAddress] nvarchar(100) NOT NULL,
        [Amount] decimal(28, 18) NOT NULL,
        [IsIncrease] smallint NOT NULL,
        [Remarks] nvarchar(max) NULL,
        CONSTRAINT [PK_TokenSupplyHistory] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190522053552_AddNewEntityTokenSupplyHistory')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190522053552_AddNewEntityTokenSupplyHistory', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190523051641_AddNewEntityTransferFeeHistory')
BEGIN
    ALTER TABLE [TokenTransferHistory] ADD [Remarks] nvarchar(max) NOT NULL DEFAULT N'';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190523051641_AddNewEntityTransferFeeHistory')
BEGIN
    DECLARE @var617 sysname;
    SELECT @var617 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TokenSupplyHistory]') AND [c].[name] = N'Remarks');
    IF @var617 IS NOT NULL EXEC(N'ALTER TABLE [TokenSupplyHistory] DROP CONSTRAINT [' + @var617 + '];');
    ALTER TABLE [TokenSupplyHistory] ALTER COLUMN [Remarks] nvarchar(max) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190523051641_AddNewEntityTransferFeeHistory')
BEGIN
    DECLARE @var618 sysname;
    SELECT @var618 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[DestroyFundRequest]') AND [c].[name] = N'Remarks');
    IF @var618 IS NOT NULL EXEC(N'ALTER TABLE [DestroyFundRequest] DROP CONSTRAINT [' + @var618 + '];');
    ALTER TABLE [DestroyFundRequest] ALTER COLUMN [Remarks] nvarchar(max) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190523051641_AddNewEntityTransferFeeHistory')
BEGIN
    DECLARE @var619 sysname;
    SELECT @var619 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[DestroyFundRequest]') AND [c].[name] = N'Address');
    IF @var619 IS NOT NULL EXEC(N'ALTER TABLE [DestroyFundRequest] DROP CONSTRAINT [' + @var619 + '];');
    ALTER TABLE [DestroyFundRequest] ALTER COLUMN [Address] nvarchar(max) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190523051641_AddNewEntityTransferFeeHistory')
BEGIN
    CREATE TABLE [TransferFeeHistory] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [WalletTypeId] bigint NOT NULL,
        [ContractAddress] nvarchar(max) NOT NULL,
        [BasePoint] int NOT NULL,
        [Maxfee] int NOT NULL,
        [Minfee] int NOT NULL,
        [Remarks] nvarchar(150) NOT NULL,
        CONSTRAINT [PK_TransferFeeHistory] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190523051641_AddNewEntityTransferFeeHistory')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190523051641_AddNewEntityTransferFeeHistory', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190524071753_CryptoLTPwatcher')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190524071753_CryptoLTPwatcher', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190524080811_CryptoLTPwatcherv1')
BEGIN
    CREATE TABLE [CryptoWatcher] (
        [Id] bigint NOT NULL IDENTITY,
        [LTP] decimal(18, 2) NOT NULL,
        [Pair] nvarchar(max) NOT NULL,
        [LPType] smallint NOT NULL,
        CONSTRAINT [PK_CryptoWatcher] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190524080811_CryptoLTPwatcherv1')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190524080811_CryptoLTPwatcherv1', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190524103824_CryptoLTPwatcherv2')
BEGIN
    DECLARE @var620 sysname;
    SELECT @var620 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CryptoWatcher]') AND [c].[name] = N'LTP');
    IF @var620 IS NOT NULL EXEC(N'ALTER TABLE [CryptoWatcher] DROP CONSTRAINT [' + @var620 + '];');
    ALTER TABLE [CryptoWatcher] ALTER COLUMN [LTP] decimal(28, 18) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190524103824_CryptoLTPwatcherv2')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190524103824_CryptoLTPwatcherv2', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190524105837_addProviderCoinmapping')
BEGIN
    CREATE TABLE [ProviderWalletTypeMapping] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [WalletTypeId] bigint NOT NULL,
        [ServiceProviderId] bigint NOT NULL,
        CONSTRAINT [PK_ProviderWalletTypeMapping] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190524105837_addProviderCoinmapping')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190524105837_addProviderCoinmapping', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190525054850_CreateTradingConfiguration')
BEGIN
    CREATE TABLE [TradingConfiguration] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Name] nvarchar(200) NOT NULL,
        CONSTRAINT [PK_TradingConfiguration] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190525054850_CreateTradingConfiguration')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190525054850_CreateTradingConfiguration', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190528061235_AddedNewEntityForLiquidity')
BEGIN
    ALTER TABLE [WalletTransactionQueues] ADD [LPType] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190528061235_AddedNewEntityForLiquidity')
BEGIN
    ALTER TABLE [TransactionQueue] ADD [IsVerifiedByAdmin] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190528061235_AddedNewEntityForLiquidity')
BEGIN
    ALTER TABLE [RouteConfiguration] ADD [IsAdminApprovalRequired] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190528061235_AddedNewEntityForLiquidity')
BEGIN
    CREATE TABLE [LPCharge] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [WalletID] bigint NOT NULL,
        [ChargeValue] decimal(28, 18) NOT NULL,
        [ChargeType] int NOT NULL,
        CONSTRAINT [PK_LPCharge] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190528061235_AddedNewEntityForLiquidity')
BEGIN
    CREATE TABLE [LPTransactionAccount] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [BatchNo] bigint NOT NULL,
        [RefNo] bigint NOT NULL,
        [TrnDate] datetime2 NOT NULL,
        [WalletID] bigint NOT NULL,
        [CrAmt] decimal(28, 18) NOT NULL,
        [DrAmt] decimal(28, 18) NOT NULL,
        [Remarks] nvarchar(150) NOT NULL,
        [IsSettled] smallint NOT NULL,
        [Type] int NOT NULL,
        CONSTRAINT [PK_LPTransactionAccount] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190528061235_AddedNewEntityForLiquidity')
BEGIN
    CREATE TABLE [LPWalletLedger] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [WalletId] bigint NOT NULL,
        [ToWalletId] bigint NOT NULL,
        [TrnDate] datetime2 NOT NULL,
        [ServiceTypeID] int NOT NULL,
        [TrnType] int NOT NULL,
        [TrnNo] bigint NOT NULL,
        [CrAmt] decimal(28, 18) NOT NULL,
        [DrAmt] decimal(28, 18) NOT NULL,
        [PreBal] decimal(28, 18) NOT NULL,
        [PostBal] decimal(28, 18) NOT NULL,
        [Remarks] nvarchar(100) NOT NULL,
        [Type] int NOT NULL,
        CONSTRAINT [PK_LPWalletLedger] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190528061235_AddedNewEntityForLiquidity')
BEGIN
    CREATE TABLE [LPWalletMaster] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [Walletname] nvarchar(50) NOT NULL,
        [Balance] decimal(28, 18) NOT NULL,
        [WalletTypeID] bigint NOT NULL,
        [IsValid] bit NOT NULL,
        [AccWalletID] uniqueidentifier NOT NULL,
        [SerProID] bigint NOT NULL,
        [IsDefaultWallet] tinyint NOT NULL,
        [ExpiryDate] datetime2 NULL,
        [OrgID] bigint NULL,
        [WalletUsageType] smallint NOT NULL,
        [OutBoundBalance] decimal(28, 18) NOT NULL,
        [InBoundBalance] decimal(28, 18) NOT NULL,
        CONSTRAINT [PK_LPWalletMaster] PRIMARY KEY ([WalletTypeID], [SerProID]),
        CONSTRAINT [AK_LPWalletMaster_SerProID_WalletTypeID] UNIQUE ([SerProID], [WalletTypeID])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190528061235_AddedNewEntityForLiquidity')
BEGIN
    CREATE TABLE [LPWalletMismatch] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [WalletID] bigint NOT NULL,
        [TPBalance] decimal(28, 18) NOT NULL,
        [SystemBalance] decimal(28, 18) NOT NULL,
        [MismatchaingAmount] decimal(28, 18) NOT NULL,
        [ResolvedBy] bigint NOT NULL,
        [ResolvedDate] datetime2 NOT NULL,
        [ResolvedRemarks] nvarchar(150) NULL,
        CONSTRAINT [PK_LPWalletMismatch] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190528061235_AddedNewEntityForLiquidity')
BEGIN
    CREATE TABLE [WithdrawAdminRequest] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [TrnNo] bigint NOT NULL,
        [ApprovedBy] bigint NOT NULL,
        [ApprovalDate] datetime2 NULL,
        [Remarks] nvarchar(150) NULL,
        CONSTRAINT [PK_WithdrawAdminRequest] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190528061235_AddedNewEntityForLiquidity')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190528061235_AddedNewEntityForLiquidity', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190529100030_APIPriceAddCoulmn')
BEGIN
    ALTER TABLE [TradeTransactionQueue] ADD [APIPrice] decimal(28, 18) NOT NULL DEFAULT 0.0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190529100030_APIPriceAddCoulmn')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190529100030_APIPriceAddCoulmn', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190530075430_addTrnHashCol')
BEGIN
    DECLARE @var621 sysname;
    SELECT @var621 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[WalletTransactionQueues]') AND [c].[name] = N'LPType');
    IF @var621 IS NOT NULL EXEC(N'ALTER TABLE [WalletTransactionQueues] DROP CONSTRAINT [' + @var621 + '];');
    ALTER TABLE [WalletTransactionQueues] ALTER COLUMN [LPType] int NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190530075430_addTrnHashCol')
BEGIN
    ALTER TABLE [TransferFeeHistory] ADD [TrnHash] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190530075430_addTrnHashCol')
BEGIN
    ALTER TABLE [TokenSupplyHistory] ADD [TrnHash] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190530075430_addTrnHashCol')
BEGIN
    ALTER TABLE [DestroyFundRequest] ADD [TrnHash] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190530075430_addTrnHashCol')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190530075430_addTrnHashCol', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190530111314_removePKfromAPIOrderSettlement')
BEGIN
    ALTER TABLE [APIOrderSettlement] DROP CONSTRAINT [PK_APIOrderSettlement];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190530111314_removePKfromAPIOrderSettlement')
BEGIN
    ALTER TABLE [APIOrderSettlement] ADD CONSTRAINT [PK_APIOrderSettlement] PRIMARY KEY ([Id]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190530111314_removePKfromAPIOrderSettlement')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190530111314_removePKfromAPIOrderSettlement', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190531073153_ArbitragePhase1')
BEGIN
    CREATE TABLE [MarketArbitrage] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [CurrencyName] nvarchar(max) NOT NULL,
        [isBaseCurrency] smallint NOT NULL,
        [ServiceID] bigint NOT NULL,
        [Priority] smallint NOT NULL,
        CONSTRAINT [PK_MarketArbitrage] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190531073153_ArbitragePhase1')
BEGIN
    CREATE TABLE [ServiceMasterArbitrage] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Name] nvarchar(30) NOT NULL,
        [SMSCode] nvarchar(6) NOT NULL,
        [ServiceType] smallint NOT NULL,
        [LimitId] bigint NOT NULL,
        [WalletTypeID] bigint NOT NULL,
        CONSTRAINT [PK_ServiceMasterArbitrage] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190531073153_ArbitragePhase1')
BEGIN
    CREATE TABLE [SettledTradeTransactionQueueArbitrage] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [TrnNo] bigint NOT NULL,
        [TrnDate] datetime2 NOT NULL,
        [MemberID] bigint NOT NULL,
        [TrnType] smallint NOT NULL,
        [TrnTypeName] nvarchar(max) NULL,
        [PairID] bigint NOT NULL,
        [PairName] nvarchar(max) NOT NULL,
        [OrderWalletID] bigint NOT NULL,
        [OrderAccountID] nvarchar(max) NULL,
        [DeliveryWalletID] bigint NOT NULL,
        [DeliveryAccountID] nvarchar(max) NULL,
        [BuyQty] decimal(28, 18) NOT NULL,
        [BidPrice] decimal(28, 18) NOT NULL,
        [SellQty] decimal(28, 18) NOT NULL,
        [AskPrice] decimal(28, 18) NOT NULL,
        [Order_Currency] nvarchar(max) NULL,
        [OrderTotalQty] decimal(28, 18) NOT NULL,
        [Delivery_Currency] nvarchar(max) NULL,
        [DeliveryTotalQty] decimal(28, 18) NOT NULL,
        [StatusCode] bigint NOT NULL,
        [StatusMsg] nvarchar(max) NULL,
        [TrnRefNo] bigint NULL,
        [IsCancelled] smallint NOT NULL,
        [SettledBuyQty] decimal(28, 18) NOT NULL,
        [SettledSellQty] decimal(28, 18) NOT NULL,
        [SettledDate] datetime2 NULL,
        [TakerPer] decimal(28, 18) NOT NULL,
        CONSTRAINT [PK_SettledTradeTransactionQueueArbitrage] PRIMARY KEY ([TrnNo])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190531073153_ArbitragePhase1')
BEGIN
    CREATE TABLE [TradeBuyerListArbitrageV1] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [TrnNo] bigint NOT NULL,
        [PairID] bigint NOT NULL,
        [PairName] nvarchar(max) NULL,
        [Price] decimal(28, 18) NOT NULL,
        [Qty] decimal(28, 18) NOT NULL,
        [DeliveredQty] decimal(28, 18) NOT NULL,
        [RemainQty] decimal(28, 18) NOT NULL,
        [OrderType] smallint NOT NULL,
        [IsProcessing] smallint NOT NULL,
        [IsAPITrade] smallint NOT NULL,
        CONSTRAINT [PK_TradeBuyerListArbitrageV1] PRIMARY KEY ([TrnNo])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190531073153_ArbitragePhase1')
BEGIN
    CREATE TABLE [TradePairDetailArbitrage] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [PairId] bigint NOT NULL,
        [BuyMinQty] decimal(28, 18) NOT NULL,
        [BuyMaxQty] decimal(28, 18) NOT NULL,
        [SellMinQty] decimal(28, 18) NOT NULL,
        [SellMaxQty] decimal(28, 18) NOT NULL,
        [SellPrice] decimal(28, 18) NOT NULL,
        [BuyPrice] decimal(28, 18) NOT NULL,
        [BuyMinPrice] decimal(28, 18) NOT NULL,
        [BuyMaxPrice] decimal(28, 18) NOT NULL,
        [SellMinPrice] decimal(28, 18) NOT NULL,
        [SellMaxPrice] decimal(28, 18) NOT NULL,
        [BuyFees] decimal(28, 18) NOT NULL,
        [SellFees] decimal(28, 18) NOT NULL,
        [FeesCurrency] nvarchar(max) NOT NULL,
        [ChargeType] smallint NULL,
        [OpenOrderExpiration] bigint NULL,
        [IsMarketTicker] int NOT NULL,
        CONSTRAINT [PK_TradePairDetailArbitrage] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190531073153_ArbitragePhase1')
BEGIN
    CREATE TABLE [TradePairMasterArbitrage] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL,
        [PairName] nvarchar(max) NOT NULL,
        [SecondaryCurrencyId] bigint NOT NULL,
        [WalletMasterID] bigint NOT NULL,
        [BaseCurrencyId] bigint NOT NULL,
        [Priority] smallint NOT NULL,
        CONSTRAINT [PK_TradePairMasterArbitrage] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190531073153_ArbitragePhase1')
BEGIN
    CREATE TABLE [TradePairStasticsArbitrage] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [PairId] bigint NOT NULL,
        [CurrentRate] decimal(28, 18) NOT NULL,
        [LTP] decimal(28, 18) NOT NULL,
        [ChangePer24] decimal(28, 18) NOT NULL,
        [ChangeVol24] decimal(28, 18) NOT NULL,
        [High24Hr] decimal(28, 18) NOT NULL,
        [Low24Hr] decimal(28, 18) NOT NULL,
        [HighWeek] decimal(28, 18) NOT NULL,
        [LowWeek] decimal(28, 18) NOT NULL,
        [High52Week] decimal(28, 18) NOT NULL,
        [Low52Week] decimal(28, 18) NOT NULL,
        [CurrencyPrice] decimal(28, 18) NOT NULL,
        [UpDownBit] smallint NOT NULL,
        [TranDate] datetime2 NOT NULL,
        [ChangeValue] decimal(28, 18) NOT NULL,
        [CronDate] datetime2 NOT NULL,
        CONSTRAINT [PK_TradePairStasticsArbitrage] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190531073153_ArbitragePhase1')
BEGIN
    CREATE TABLE [TradeSellerListArbitrageV1] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [TrnNo] bigint NOT NULL,
        [PairID] bigint NOT NULL,
        [PairName] nvarchar(max) NULL,
        [Price] decimal(28, 18) NOT NULL,
        [Qty] decimal(28, 18) NOT NULL,
        [ReleasedQty] decimal(28, 18) NOT NULL,
        [SelledQty] decimal(28, 18) NOT NULL,
        [RemainQty] decimal(28, 18) NOT NULL,
        [OrderType] smallint NOT NULL,
        [IsProcessing] smallint NOT NULL,
        [IsAPITrade] smallint NOT NULL,
        CONSTRAINT [PK_TradeSellerListArbitrageV1] PRIMARY KEY ([TrnNo])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190531073153_ArbitragePhase1')
BEGIN
    CREATE TABLE [TradeStopLossArbitrage] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [TrnNo] bigint NOT NULL,
        [ordertype] smallint NOT NULL,
        [StopPrice] decimal(28, 18) NOT NULL,
        [LTP] decimal(28, 18) NOT NULL,
        [RangeMin] decimal(28, 18) NOT NULL,
        [RangeMax] decimal(28, 18) NOT NULL,
        [MarketIndicator] smallint NOT NULL,
        [PairID] bigint NOT NULL,
        [ISFollowersReq] smallint NOT NULL,
        [FollowingTo] bigint NOT NULL,
        [LeaderTrnNo] bigint NOT NULL,
        [FollowTradeType] nvarchar(max) NULL,
        CONSTRAINT [PK_TradeStopLossArbitrage] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190531073153_ArbitragePhase1')
BEGIN
    CREATE TABLE [TradeTransactionQueueArbitrage] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [TrnNo] bigint NOT NULL,
        [TrnDate] datetime2 NOT NULL,
        [MemberID] bigint NOT NULL,
        [TrnType] smallint NOT NULL,
        [TrnTypeName] nvarchar(max) NULL,
        [PairID] bigint NOT NULL,
        [PairName] nvarchar(max) NOT NULL,
        [OrderWalletID] bigint NOT NULL,
        [OrderAccountID] nvarchar(max) NULL,
        [DeliveryWalletID] bigint NOT NULL,
        [DeliveryAccountID] nvarchar(max) NULL,
        [BuyQty] decimal(28, 18) NOT NULL,
        [BidPrice] decimal(28, 18) NOT NULL,
        [SellQty] decimal(28, 18) NOT NULL,
        [AskPrice] decimal(28, 18) NOT NULL,
        [Order_Currency] nvarchar(max) NULL,
        [OrderTotalQty] decimal(28, 18) NOT NULL,
        [Delivery_Currency] nvarchar(max) NULL,
        [DeliveryTotalQty] decimal(28, 18) NOT NULL,
        [StatusCode] bigint NOT NULL,
        [StatusMsg] nvarchar(max) NULL,
        [IsCancelled] smallint NOT NULL,
        [SettledBuyQty] decimal(28, 18) NOT NULL,
        [SettledSellQty] decimal(28, 18) NOT NULL,
        [SettledDate] datetime2 NULL,
        [ordertype] smallint NOT NULL,
        [IsAPITrade] smallint NOT NULL,
        [IsExpired] smallint NOT NULL,
        [APIStatus] nvarchar(max) NULL,
        [IsAPICancelled] smallint NOT NULL,
        [APIPrice] decimal(28, 18) NOT NULL,
        CONSTRAINT [PK_TradeTransactionQueueArbitrage] PRIMARY KEY ([TrnNo])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190531073153_ArbitragePhase1')
BEGIN
    CREATE TABLE [TransactionQueueArbitrage] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [GUID] uniqueidentifier NOT NULL,
        [TrnDate] datetime2 NOT NULL,
        [TrnMode] smallint NOT NULL,
        [TrnType] smallint NOT NULL,
        [MemberID] bigint NOT NULL,
        [MemberMobile] nvarchar(max) NULL,
        [SMSCode] nvarchar(10) NOT NULL,
        [TransactionAccount] nvarchar(200) NOT NULL,
        [Amount] decimal(28, 18) NOT NULL,
        [ServiceID] bigint NOT NULL,
        [SerProID] bigint NOT NULL,
        [ProductID] bigint NOT NULL,
        [RouteID] bigint NOT NULL,
        [StatusCode] bigint NOT NULL,
        [StatusMsg] nvarchar(max) NULL,
        [VerifyDone] smallint NOT NULL,
        [TrnRefNo] nvarchar(max) NULL,
        [ChargeCurrency] nvarchar(max) NULL,
        [AdditionalInfo] nvarchar(max) NULL,
        [ChargePer] decimal(28, 18) NULL,
        [ChargeRs] decimal(28, 18) NULL,
        [ChargeType] smallint NULL,
        [DebitAccountID] nvarchar(max) NULL,
        [IsVerified] smallint NOT NULL,
        [IsInternalTrn] smallint NOT NULL,
        [IsVerifiedByAdmin] smallint NOT NULL,
        [EmailSendDate] datetime2 NOT NULL,
        [CallStatus] smallint NOT NULL,
        CONSTRAINT [PK_TransactionQueueArbitrage] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190531073153_ArbitragePhase1')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190531073153_ArbitragePhase1', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190603134025_addDepositCounterForNEO')
BEGIN
    CREATE TABLE [NEODepositCounter] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [RecordCount] int NOT NULL,
        [Limit] bigint NOT NULL,
        [LastTrnID] nvarchar(max) NULL,
        [MaxLimit] bigint NOT NULL,
        [WalletTypeID] bigint NOT NULL,
        [SerProId] bigint NOT NULL,
        [PreviousTrnID] nvarchar(max) NULL,
        [prevIterationID] nvarchar(max) NULL,
        [FlushAddressEnable] int NOT NULL,
        [TPSPickupStatus] bigint NOT NULL,
        [AppType] int NOT NULL,
        [StartTime] float NOT NULL,
        [EndTime] float NOT NULL,
        [AddressId] bigint NOT NULL,
        [PickUpDate] datetime2 NOT NULL,
        CONSTRAINT [PK_NEODepositCounter] PRIMARY KEY ([WalletTypeID], [SerProId], [AddressId]),
        CONSTRAINT [AK_NEODepositCounter_AddressId_SerProId_WalletTypeID] UNIQUE ([AddressId], [SerProId], [WalletTypeID])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190603134025_addDepositCounterForNEO')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190603134025_addDepositCounterForNEO', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190604080711_grapharbitrage')
BEGIN
    CREATE TABLE [TradeGraphDetailArbitrage] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [PairId] bigint NOT NULL,
        [DataDate] datetime2 NOT NULL,
        [TranNo] bigint NOT NULL,
        [Volume] decimal(28, 18) NOT NULL,
        [ChangePer] decimal(28, 18) NOT NULL,
        [High24Hr] decimal(28, 18) NOT NULL,
        [Low24Hr] decimal(28, 18) NOT NULL,
        [TodayClose] decimal(28, 18) NOT NULL,
        [TodayOpen] decimal(28, 18) NOT NULL,
        [HighWeek] decimal(28, 18) NOT NULL,
        [LowWeek] decimal(28, 18) NOT NULL,
        [High52Week] decimal(28, 18) NOT NULL,
        [Low52Week] decimal(28, 18) NOT NULL,
        [LTP] decimal(28, 18) NOT NULL,
        [BidPrice] decimal(28, 18) NOT NULL,
        [Quantity] decimal(28, 18) NOT NULL,
        CONSTRAINT [PK_TradeGraphDetailArbitrage] PRIMARY KEY ([Id], [TranNo]),
        CONSTRAINT [AK_TradeGraphDetailArbitrage_TranNo] UNIQUE ([TranNo])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190604080711_grapharbitrage')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190604080711_grapharbitrage', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190604100619_ArbitrageExchangeconfigurationEntity')
BEGIN
    CREATE TABLE [LimitsArbitrage] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [MinAmt] decimal(28, 18) NOT NULL,
        [MaxAmt] decimal(28, 18) NOT NULL,
        [MinAmtDaily] decimal(28, 18) NOT NULL,
        [MaxAmtDaily] decimal(28, 18) NOT NULL,
        [MinAmtWeekly] decimal(28, 18) NOT NULL,
        [MaxAmtWeekly] decimal(28, 18) NOT NULL,
        [MinAmtMonthly] decimal(28, 18) NOT NULL,
        [MaxAmtMonthly] decimal(28, 18) NOT NULL,
        [MinRange] bigint NOT NULL,
        [Maxrange] bigint NOT NULL,
        [MinRangeDaily] bigint NOT NULL,
        [MaxRangeDaily] bigint NOT NULL,
        [MinRangeWeekly] bigint NOT NULL,
        [MaxRangeWeekly] bigint NOT NULL,
        [MinRangeMonthly] bigint NOT NULL,
        [MaxRangeMonthly] bigint NOT NULL,
        CONSTRAINT [PK_LimitsArbitrage] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190604100619_ArbitrageExchangeconfigurationEntity')
BEGIN
    CREATE TABLE [RouteConfigurationArbitrage] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [RouteName] nvarchar(30) NOT NULL,
        [ServiceID] bigint NOT NULL,
        [SerProDetailID] bigint NOT NULL,
        [ProductID] bigint NOT NULL,
        [Priority] smallint NOT NULL,
        [StatusCheckUrl] nvarchar(max) NULL,
        [ValidationUrl] nvarchar(max) NULL,
        [TransactionUrl] nvarchar(max) NULL,
        [LimitId] bigint NOT NULL,
        [OpCode] nvarchar(50) NULL,
        [TrnType] int NOT NULL,
        [IsDelayAddress] tinyint NOT NULL,
        [ProviderWalletID] nvarchar(100) NULL,
        [ConvertAmount] decimal(22, 2) NOT NULL,
        [ConfirmationCount] int NOT NULL,
        [OrderType] bigint NOT NULL,
        [PairId] bigint NOT NULL,
        [GasLimit] bigint NOT NULL,
        [AccountNoLen] int NOT NULL,
        [AccNoStartsWith] nvarchar(30) NULL,
        [AccNoValidationRegex] nvarchar(80) NULL,
        [ContractAddress] nvarchar(100) NULL,
        [IsAdminApprovalRequired] smallint NOT NULL,
        CONSTRAINT [PK_RouteConfigurationArbitrage] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190604100619_ArbitrageExchangeconfigurationEntity')
BEGIN
    CREATE TABLE [ServiceProConfigurationArbitrage] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [AppKey] nvarchar(50) NOT NULL,
        [APIKey] nvarchar(100) NOT NULL,
        [SecretKey] nvarchar(100) NOT NULL,
        [UserName] nvarchar(50) NOT NULL,
        [Password] nvarchar(50) NOT NULL,
        [Param1] nvarchar(max) NULL,
        [Param2] nvarchar(max) NULL,
        [Param3] nvarchar(max) NULL,
        [Param4] nvarchar(max) NULL,
        [Param5] nvarchar(max) NULL,
        CONSTRAINT [PK_ServiceProConfigurationArbitrage] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190604100619_ArbitrageExchangeconfigurationEntity')
BEGIN
    CREATE TABLE [ServiceProviderDetailArbitrage] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [ServiceProID] bigint NOT NULL,
        [ProTypeID] bigint NOT NULL,
        [AppTypeID] bigint NOT NULL,
        [TrnTypeID] bigint NOT NULL,
        [LimitID] bigint NOT NULL,
        [DemonConfigID] bigint NOT NULL,
        [ServiceProConfigID] bigint NOT NULL,
        [ThirPartyAPIID] bigint NOT NULL,
        [SerProDetailName] nvarchar(max) NULL,
        [IsStopConvertAmount] int NOT NULL,
        CONSTRAINT [PK_ServiceProviderDetailArbitrage] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190604100619_ArbitrageExchangeconfigurationEntity')
BEGIN
    CREATE TABLE [ServiceProviderMasterArbitrage] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [ProviderName] nvarchar(60) NOT NULL,
        CONSTRAINT [PK_ServiceProviderMasterArbitrage] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190604100619_ArbitrageExchangeconfigurationEntity')
BEGIN
    CREATE TABLE [ServiceProviderTypeArbitrage] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [ServiveProTypeName] nvarchar(20) NOT NULL,
        CONSTRAINT [PK_ServiceProviderTypeArbitrage] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190604100619_ArbitrageExchangeconfigurationEntity')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190604100619_ArbitrageExchangeconfigurationEntity', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190605080754_ArbitragequeueandAPILog')
BEGIN
    CREATE TABLE [APIOrderSettlementArbitrage] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [TrnNo] bigint NOT NULL,
        [PairID] bigint NOT NULL,
        [PairName] nvarchar(max) NULL,
        [OldStatus] smallint NOT NULL,
        [NewStatus] smallint NOT NULL,
        [Price] decimal(28, 18) NOT NULL,
        [Qty] decimal(28, 18) NOT NULL,
        [OldQty] decimal(28, 18) NOT NULL,
        [NewQty] decimal(28, 18) NOT NULL,
        [SettledQty] decimal(28, 18) NOT NULL,
        [APIPrice] decimal(28, 18) NOT NULL,
        [APISettledQty] decimal(28, 18) NOT NULL,
        [APIRemainQty] decimal(28, 18) NOT NULL,
        CONSTRAINT [PK_APIOrderSettlementArbitrage] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190605080754_ArbitragequeueandAPILog')
BEGIN
    CREATE TABLE [TradePoolQueueArbitrageV1] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [PairID] bigint NOT NULL,
        [MakerTrnNo] bigint NOT NULL,
        [MakerType] nvarchar(max) NULL,
        [MakerPrice] decimal(28, 18) NOT NULL,
        [MakerQty] decimal(28, 18) NOT NULL,
        [TakerTrnNo] bigint NOT NULL,
        [TakerType] nvarchar(max) NULL,
        [TakerPrice] decimal(28, 18) NOT NULL,
        [TakerQty] decimal(28, 18) NOT NULL,
        [TakerDisc] decimal(28, 18) NOT NULL,
        [TakerLoss] decimal(28, 18) NOT NULL,
        [IsAPITrade] smallint NOT NULL,
        [StatusCode] bigint NOT NULL,
        [StatusMsg] nvarchar(max) NULL,
        CONSTRAINT [PK_TradePoolQueueArbitrageV1] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190605080754_ArbitragequeueandAPILog')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190605080754_ArbitragequeueandAPILog', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190605112501_ArbitrageCryptoWatchNRoute')
BEGIN
    CREATE TABLE [ArbitrageLPWalletMaster] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [Walletname] nvarchar(50) NOT NULL,
        [Balance] decimal(28, 18) NOT NULL,
        [WalletTypeID] bigint NOT NULL,
        [IsValid] bit NOT NULL,
        [AccWalletID] uniqueidentifier NOT NULL,
        [SerProID] bigint NOT NULL,
        [IsDefaultWallet] tinyint NOT NULL,
        [ExpiryDate] datetime2 NULL,
        [OrgID] bigint NULL,
        [WalletUsageType] smallint NOT NULL,
        [OutBoundBalance] decimal(28, 18) NOT NULL,
        [InBoundBalance] decimal(28, 18) NOT NULL,
        CONSTRAINT [PK_ArbitrageLPWalletMaster] PRIMARY KEY ([WalletTypeID], [SerProID]),
        CONSTRAINT [AK_ArbitrageLPWalletMaster_SerProID_WalletTypeID] UNIQUE ([SerProID], [WalletTypeID])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190605112501_ArbitrageCryptoWatchNRoute')
BEGIN
    CREATE TABLE [ArbitrageTransactionAccount] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [BatchNo] bigint NOT NULL,
        [RefNo] bigint NOT NULL,
        [TrnDate] datetime2 NOT NULL,
        [WalletID] bigint NOT NULL,
        [CrAmt] decimal(28, 18) NOT NULL,
        [DrAmt] decimal(28, 18) NOT NULL,
        [Remarks] nvarchar(150) NOT NULL,
        [IsSettled] smallint NOT NULL,
        [Type] int NOT NULL,
        CONSTRAINT [PK_ArbitrageTransactionAccount] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190605112501_ArbitrageCryptoWatchNRoute')
BEGIN
    CREATE TABLE [ArbitrageWalletLedger] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [WalletId] bigint NOT NULL,
        [ToWalletId] bigint NOT NULL,
        [TrnDate] datetime2 NOT NULL,
        [ServiceTypeID] int NOT NULL,
        [TrnType] int NOT NULL,
        [TrnNo] bigint NOT NULL,
        [CrAmt] decimal(28, 18) NOT NULL,
        [DrAmt] decimal(28, 18) NOT NULL,
        [PreBal] decimal(28, 18) NOT NULL,
        [PostBal] decimal(28, 18) NOT NULL,
        [Remarks] nvarchar(100) NOT NULL,
        [Type] int NOT NULL,
        CONSTRAINT [PK_ArbitrageWalletLedger] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190605112501_ArbitrageCryptoWatchNRoute')
BEGIN
    CREATE TABLE [ArbitrageWalletMaster] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [WalletName] nvarchar(50) NOT NULL,
        [Balance] decimal(28, 18) NOT NULL,
        [WalletTypeID] bigint NOT NULL,
        [IsValid] bit NOT NULL,
        [AccWalletID] nvarchar(50) NOT NULL,
        [UserID] bigint NOT NULL,
        [IsDefaultWallet] tinyint NOT NULL,
        [ExpiryDate] datetime2 NULL,
        [OrgID] bigint NULL,
        [WalletUsageType] smallint NOT NULL,
        [OutBoundBalance] decimal(28, 18) NOT NULL,
        [InBoundBalance] decimal(28, 18) NOT NULL,
        CONSTRAINT [PK_ArbitrageWalletMaster] PRIMARY KEY ([AccWalletID])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190605112501_ArbitrageCryptoWatchNRoute')
BEGIN
    CREATE TABLE [ArbitrageWalletTransactionOrder] (
        [OrderID] bigint NOT NULL IDENTITY,
        [UpdatedDate] datetime2 NULL,
        [TrnDate] datetime2 NOT NULL,
        [OWalletID] bigint NOT NULL,
        [DWalletID] bigint NOT NULL,
        [Amount] decimal(28, 18) NOT NULL,
        [WalletType] nvarchar(10) NOT NULL,
        [OTrnNo] bigint NOT NULL,
        [DTrnNo] bigint NOT NULL,
        [Status] int NOT NULL,
        [StatusMsg] nvarchar(50) NOT NULL,
        [ChargeAmount] decimal(28, 18) NOT NULL,
        CONSTRAINT [PK_ArbitrageWalletTransactionOrder] PRIMARY KEY ([OrderID])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190605112501_ArbitrageCryptoWatchNRoute')
BEGIN
    CREATE TABLE [ArbitrageWalletTransactionQueue] (
        [TrnNo] bigint NOT NULL IDENTITY,
        [Guid] uniqueidentifier NOT NULL,
        [TrnType] int NOT NULL,
        [Amount] decimal(28, 18) NOT NULL,
        [TrnRefNo] bigint NOT NULL,
        [TrnDate] datetime2 NOT NULL,
        [UpdatedDate] datetime2 NULL,
        [WalletID] bigint NOT NULL,
        [WalletType] nvarchar(10) NOT NULL,
        [MemberID] bigint NOT NULL,
        [TimeStamp] nvarchar(50) NOT NULL,
        [Status] int NOT NULL,
        [StatusMsg] nvarchar(100) NOT NULL,
        [SettedAmt] decimal(28, 18) NOT NULL,
        [AllowedChannelID] bigint NOT NULL,
        [WalletTrnType] int NOT NULL,
        [WalletDeductionType] int NOT NULL,
        [HoldChargeAmount] decimal(28, 18) NOT NULL,
        [DeductedChargeAmount] decimal(28, 18) NOT NULL,
        [ErrorCode] bigint NULL,
        [IsProcessing] int NOT NULL,
        CONSTRAINT [PK_ArbitrageWalletTransactionQueue] PRIMARY KEY ([TrnNo])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190605112501_ArbitrageCryptoWatchNRoute')
BEGIN
    CREATE TABLE [ArbitrageWalletTypeMaster] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [WalletTypeName] nvarchar(7) NOT NULL,
        [Description] nvarchar(100) NOT NULL,
        [IsDepositionAllow] smallint NOT NULL,
        [IsWithdrawalAllow] smallint NOT NULL,
        [IsTransactionWallet] smallint NOT NULL,
        [IsDefaultWallet] smallint NULL,
        [ConfirmationCount] smallint NULL,
        [IsLocal] smallint NULL,
        [CurrencyTypeID] bigint NOT NULL,
        CONSTRAINT [PK_ArbitrageWalletTypeMaster] PRIMARY KEY ([WalletTypeName])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190605112501_ArbitrageCryptoWatchNRoute')
BEGIN
    CREATE TABLE [CryptoWatcherArbitrage] (
        [Id] bigint NOT NULL IDENTITY,
        [LTP] decimal(28, 18) NOT NULL,
        [Pair] nvarchar(max) NOT NULL,
        [LPType] smallint NOT NULL,
        CONSTRAINT [PK_CryptoWatcherArbitrage] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190605112501_ArbitrageCryptoWatchNRoute')
BEGIN
    CREATE TABLE [LPArbitrageLPTransactionAccount] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [BatchNo] bigint NOT NULL,
        [RefNo] bigint NOT NULL,
        [TrnDate] datetime2 NOT NULL,
        [WalletID] bigint NOT NULL,
        [CrAmt] decimal(28, 18) NOT NULL,
        [DrAmt] decimal(28, 18) NOT NULL,
        [Remarks] nvarchar(150) NOT NULL,
        [IsSettled] smallint NOT NULL,
        [Type] int NOT NULL,
        CONSTRAINT [PK_LPArbitrageLPTransactionAccount] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190605112501_ArbitrageCryptoWatchNRoute')
BEGIN
    CREATE TABLE [LPArbitrageWalletLedger] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [WalletId] bigint NOT NULL,
        [ToWalletId] bigint NOT NULL,
        [TrnDate] datetime2 NOT NULL,
        [ServiceTypeID] int NOT NULL,
        [TrnType] int NOT NULL,
        [TrnNo] bigint NOT NULL,
        [CrAmt] decimal(28, 18) NOT NULL,
        [DrAmt] decimal(28, 18) NOT NULL,
        [PreBal] decimal(28, 18) NOT NULL,
        [PostBal] decimal(28, 18) NOT NULL,
        [Remarks] nvarchar(100) NOT NULL,
        [Type] int NOT NULL,
        CONSTRAINT [PK_LPArbitrageWalletLedger] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190605112501_ArbitrageCryptoWatchNRoute')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190605112501_ArbitrageCryptoWatchNRoute', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190606064105_ArbitrageUserRole')
BEGIN
    CREATE TABLE [ArbitrageWalletAuthorizeUserMaster] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [WalletID] bigint NOT NULL,
        [UserID] bigint NOT NULL,
        [OrgID] bigint NOT NULL,
        [RoleID] bigint NOT NULL,
        CONSTRAINT [PK_ArbitrageWalletAuthorizeUserMaster] PRIMARY KEY ([UserID], [WalletID])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190606064105_ArbitrageUserRole')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190606064105_ArbitrageUserRole', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190606122643_ArbitrageAllowOrderType')
BEGIN
    CREATE TABLE [AllowesOrderTypeArbitrage] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [SerProDetailID] bigint NOT NULL,
        [OrderType] bigint NOT NULL,
        CONSTRAINT [PK_AllowesOrderTypeArbitrage] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190606122643_ArbitrageAllowOrderType')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190606122643_ArbitrageAllowOrderType', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190607073125_addEntity_TradeCancelQueueArbitrage')
BEGIN
    CREATE TABLE [TradeCancelQueueArbitrage] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [TrnNo] bigint NOT NULL,
        [DeliverServiceID] bigint NOT NULL,
        [TrnDate] datetime2 NOT NULL,
        [PendingBuyQty] decimal(28, 18) NOT NULL,
        [DeliverQty] decimal(28, 18) NOT NULL,
        [OrderType] smallint NULL,
        [DeliverBidPrice] decimal(28, 18) NULL,
        [StatusMsg] nvarchar(max) NOT NULL,
        [OrderID] bigint NOT NULL,
        [SettledDate] datetime2 NULL,
        CONSTRAINT [PK_TradeCancelQueueArbitrage] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190607073125_addEntity_TradeCancelQueueArbitrage')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190607073125_addEntity_TradeCancelQueueArbitrage', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190607094559_addIsIntAmountAllowcol')
BEGIN
    ALTER TABLE [ServiceMaster] ADD [IsIntAmountAllow] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190607094559_addIsIntAmountAllowcol')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190607094559_addIsIntAmountAllowcol', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190610052057_AddArbitrageLPAddressMaster')
BEGIN
    CREATE TABLE [ArbitrageLPAddressMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [WalletId] bigint NOT NULL,
        [Address] nvarchar(70) NULL,
        [IsDefaultAddress] tinyint NOT NULL,
        [SerProID] bigint NOT NULL,
        [AddressLable] nvarchar(50) NOT NULL,
        [OriginalAddress] nvarchar(70) NOT NULL,
        [GUID] nvarchar(max) NULL,
        [AddressType] int NOT NULL,
        [TxnID] nvarchar(150) NULL,
        [WalletTypeId] bigint NOT NULL,
        CONSTRAINT [PK_ArbitrageLPAddressMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190610052057_AddArbitrageLPAddressMaster')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190610052057_AddArbitrageLPAddressMaster', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190610102238_addChargeEntity')
BEGIN
    ALTER TABLE [LPArbitrageLPTransactionAccount] DROP CONSTRAINT [PK_LPArbitrageLPTransactionAccount];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190610102238_addChargeEntity')
BEGIN
    ALTER TABLE [ArbitrageLPWalletMaster] DROP CONSTRAINT [AK_ArbitrageLPWalletMaster_SerProID_WalletTypeID];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190610102238_addChargeEntity')
BEGIN
    ALTER TABLE [ArbitrageLPWalletMaster] DROP CONSTRAINT [PK_ArbitrageLPWalletMaster];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190610102238_addChargeEntity')
BEGIN
    EXEC sp_rename N'[LPArbitrageLPTransactionAccount]', N'LPArbitrageTransactionAccount';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190610102238_addChargeEntity')
BEGIN
    EXEC sp_rename N'[ArbitrageLPWalletMaster]', N'LPArbitrageWalletMaster';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190610102238_addChargeEntity')
BEGIN
    ALTER TABLE [ArbitrageWalletTransactionQueue] ADD [LPType] int NOT NULL DEFAULT 0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190610102238_addChargeEntity')
BEGIN
    ALTER TABLE [LPArbitrageTransactionAccount] ADD CONSTRAINT [PK_LPArbitrageTransactionAccount] PRIMARY KEY ([Id]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190610102238_addChargeEntity')
BEGIN
    ALTER TABLE [LPArbitrageWalletMaster] ADD CONSTRAINT [AK_LPArbitrageWalletMaster_SerProID_WalletTypeID] UNIQUE ([SerProID], [WalletTypeID]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190610102238_addChargeEntity')
BEGIN
    ALTER TABLE [LPArbitrageWalletMaster] ADD CONSTRAINT [PK_LPArbitrageWalletMaster] PRIMARY KEY ([WalletTypeID], [SerProID]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190610102238_addChargeEntity')
BEGIN
    CREATE TABLE [ArbitrageChargeConfigurationDetail] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [ChargeConfigurationMasterID] bigint NOT NULL,
        [ChargeDistributionBasedOn] smallint NOT NULL,
        [ChargeType] bigint NOT NULL,
        [ChargeValue] decimal(28, 18) NOT NULL,
        [ChargeValueType] smallint NOT NULL,
        [MakerCharge] decimal(28, 18) NOT NULL,
        [TakerCharge] decimal(28, 18) NOT NULL,
        [Remarks] nvarchar(max) NULL,
        [IsCurrencyConverted] smallint NOT NULL,
        [MarkUpValue] decimal(28, 18) NOT NULL,
        [MarkUpValueType] smallint NOT NULL,
        CONSTRAINT [PK_ArbitrageChargeConfigurationDetail] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190610102238_addChargeEntity')
BEGIN
    CREATE TABLE [ArbitrageChargeConfigurationMaster] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [WalletTypeID] bigint NOT NULL,
        [PairId] bigint NOT NULL,
        [SerProId] bigint NOT NULL,
        [TrnType] bigint NOT NULL,
        [KYCComplaint] smallint NOT NULL,
        [Remarks] nvarchar(max) NULL,
        CONSTRAINT [PK_ArbitrageChargeConfigurationMaster] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190610102238_addChargeEntity')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190610102238_addChargeEntity', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190610130144_addServiceDetailArbitrageEntity')
BEGIN
    CREATE TABLE [ProductConfigurationArbitrage] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [ProductName] nvarchar(30) NOT NULL,
        [ServiceID] bigint NOT NULL,
        [CountryID] bigint NOT NULL,
        CONSTRAINT [PK_ProductConfigurationArbitrage] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190610130144_addServiceDetailArbitrageEntity')
BEGIN
    CREATE TABLE [ServiceDetailArbitrage] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [ServiceId] bigint NOT NULL,
        [ServiceDetailJson] text NULL,
        CONSTRAINT [PK_ServiceDetailArbitrage] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190610130144_addServiceDetailArbitrageEntity')
BEGIN
    CREATE TABLE [ServiceStasticsArbitrage] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [ServiceId] bigint NOT NULL,
        [MarketCap] decimal(28, 18) NOT NULL,
        [VolGlobal] decimal(28, 18) NOT NULL,
        [MaxSupply] bigint NOT NULL,
        [CirculatingSupply] bigint NOT NULL,
        [IssuePrice] decimal(18, 2) NOT NULL,
        [IssueDate] datetime2 NOT NULL,
        CONSTRAINT [PK_ServiceStasticsArbitrage] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190610130144_addServiceDetailArbitrageEntity')
BEGIN
    CREATE TABLE [ServiceTypeMappingArbitrage] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [ServiceId] bigint NOT NULL,
        [TrnType] bigint NOT NULL,
        CONSTRAINT [PK_ServiceTypeMappingArbitrage] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190610130144_addServiceDetailArbitrageEntity')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190610130144_addServiceDetailArbitrageEntity', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190610132629_addArbitrageTrnChargeLogEntity')
BEGIN
    CREATE TABLE [ArbitrageTrnChargeLog] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [BatchNo] nvarchar(max) NULL,
        [Type] smallint NOT NULL,
        [TrnNo] bigint NOT NULL,
        [TrnType] bigint NOT NULL,
        [Amount] decimal(28, 18) NOT NULL,
        [MakerCharge] decimal(28, 18) NULL,
        [TakerCharge] decimal(28, 18) NULL,
        [Charge] decimal(28, 18) NULL,
        [MarkUpValue] decimal(28, 18) NOT NULL,
        [ChargeConfigurationDetailID] bigint NULL,
        [TimeStamp] nvarchar(max) NULL,
        [DWalletID] bigint NOT NULL,
        [OWalletID] bigint NOT NULL,
        [DUserID] bigint NOT NULL,
        [OuserID] bigint NOT NULL,
        [WalletTypeID] bigint NOT NULL,
        [PairId] bigint NOT NULL,
        [Remarks] nvarchar(max) NULL,
        [ChargeConfigurationMasterID] bigint NULL,
        [IsMaker] smallint NULL,
        [TrnRefNo] bigint NULL,
        CONSTRAINT [PK_ArbitrageTrnChargeLog] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190610132629_addArbitrageTrnChargeLogEntity')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190610132629_addArbitrageTrnChargeLogEntity', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190611053710_AddTopUpEntity')
BEGIN
    CREATE TABLE [ArbitrageDepositFund] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [TrnID] nvarchar(1000) NULL,
        [SMSCode] nvarchar(50) NOT NULL,
        [FromSerProId] bigint NOT NULL,
        [ToserProId] bigint NOT NULL,
        [Address] nvarchar(100) NULL,
        [Amount] decimal(28, 18) NOT NULL,
        [IsProcessing] smallint NOT NULL,
        [ToAddress] nvarchar(50) NOT NULL,
        [SystemRemarks] nvarchar(100) NOT NULL,
        [TrnNo] bigint NOT NULL,
        [RouteTag] nvarchar(max) NOT NULL,
        [UserId] bigint NOT NULL,
        [TrnDate] datetime2 NOT NULL,
        [ProviderWalletID] nvarchar(50) NOT NULL,
        [ApprovedBy] bigint NOT NULL,
        [ApprovedDate] datetime2 NULL,
        CONSTRAINT [PK_ArbitrageDepositFund] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190611053710_AddTopUpEntity')
BEGIN
    CREATE TABLE [ArbitrageThirdPartyAPIConfiguration] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [APIName] nvarchar(30) NOT NULL,
        [APISendURL] nvarchar(max) NOT NULL,
        [APIValidateURL] nvarchar(max) NULL,
        [APIBalURL] nvarchar(max) NULL,
        [APIStatusCheckURL] nvarchar(max) NULL,
        [APIRequestBody] nvarchar(max) NULL,
        [BalCheckRequestBody] nvarchar(max) NULL,
        [TransactionIdPrefix] nvarchar(max) NULL,
        [MerchantCode] nvarchar(max) NULL,
        [ResponseSuccess] nvarchar(max) NULL,
        [ResponseFailure] nvarchar(max) NULL,
        [ResponseHold] nvarchar(max) NULL,
        [AuthHeader] nvarchar(max) NULL,
        [ContentType] nvarchar(max) NULL,
        [MethodType] nvarchar(max) NULL,
        [BalCheckMethodType] nvarchar(max) NULL,
        [HashCode] nvarchar(max) NULL,
        [HashCodeRecheck] nvarchar(max) NULL,
        [HashType] smallint NOT NULL,
        [AppType] smallint NOT NULL,
        [ParsingDataID] bigint NOT NULL,
        [TimeStamp] nvarchar(max) NULL,
        CONSTRAINT [PK_ArbitrageThirdPartyAPIConfiguration] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190611053710_AddTopUpEntity')
BEGIN
    CREATE TABLE [ArbitrageThirdPartyAPIResponseConfiguration] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [BalanceRegex] nvarchar(max) NULL,
        [StatusRegex] nvarchar(max) NULL,
        [StatusMsgRegex] nvarchar(max) NULL,
        [ResponseCodeRegex] nvarchar(max) NULL,
        [ErrorCodeRegex] nvarchar(max) NULL,
        [TrnRefNoRegex] nvarchar(max) NULL,
        [OprTrnRefNoRegex] nvarchar(max) NULL,
        [Param1Regex] nvarchar(max) NULL,
        [Param2Regex] nvarchar(max) NULL,
        [Param3Regex] nvarchar(max) NULL,
        CONSTRAINT [PK_ArbitrageThirdPartyAPIResponseConfiguration] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190611053710_AddTopUpEntity')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190611053710_AddTopUpEntity', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190611054700_AddArbitrageTransactionRequest')
BEGIN
    CREATE TABLE [ArbitrageTransactionRequest] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [TrnNo] bigint NOT NULL,
        [ServiceID] bigint NOT NULL,
        [SerProID] bigint NOT NULL,
        [SerProDetailID] bigint NOT NULL,
        [RequestData] nvarchar(max) NOT NULL,
        [ResponseTime] datetime2 NOT NULL,
        [ResponseData] nvarchar(max) NULL,
        [TrnID] nvarchar(max) NULL,
        [OprTrnID] nvarchar(max) NULL,
        [IsCancel] smallint NOT NULL,
        CONSTRAINT [PK_ArbitrageTransactionRequest] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190611054700_AddArbitrageTransactionRequest')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190611054700_AddArbitrageTransactionRequest', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190611064741_addColToTransactionQueueArbitrageEntity')
BEGIN
    ALTER TABLE [TransactionQueueArbitrage] ADD [LPType] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190611064741_addColToTransactionQueueArbitrageEntity')
BEGIN
    ALTER TABLE [TransactionQueueArbitrage] ADD [ProviderID] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190611064741_addColToTransactionQueueArbitrageEntity')
BEGIN
    ALTER TABLE [ServiceMasterArbitrage] ADD [IsIntAmountAllow] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190611064741_addColToTransactionQueueArbitrageEntity')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190611064741_addColToTransactionQueueArbitrageEntity', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190611080545_renameColSerProDetailID')
BEGIN
    EXEC sp_rename N'[TransactionQueueArbitrage].[ProviderID]', N'SerProDetailID', N'COLUMN';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190611080545_renameColSerProDetailID')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190611080545_renameColSerProDetailID', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190611115719_addColToCryptoWatcherArbitrage')
BEGIN
    ALTER TABLE [CryptoWatcherArbitrage] ADD [ChangePer] decimal(28, 18) NOT NULL DEFAULT 0.0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190611115719_addColToCryptoWatcherArbitrage')
BEGIN
    ALTER TABLE [CryptoWatcherArbitrage] ADD [Fees] decimal(28, 18) NOT NULL DEFAULT 0.0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190611115719_addColToCryptoWatcherArbitrage')
BEGIN
    ALTER TABLE [CryptoWatcherArbitrage] ADD [PairId] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190611115719_addColToCryptoWatcherArbitrage')
BEGIN
    ALTER TABLE [CryptoWatcherArbitrage] ADD [UpDownBit] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190611115719_addColToCryptoWatcherArbitrage')
BEGIN
    ALTER TABLE [CryptoWatcherArbitrage] ADD [Volume] decimal(28, 18) NOT NULL DEFAULT 0.0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190611115719_addColToCryptoWatcherArbitrage')
BEGIN
    ALTER TABLE [ArbitrageWalletTransactionQueue] ADD [PairID] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190611115719_addColToCryptoWatcherArbitrage')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190611115719_addColToCryptoWatcherArbitrage', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190612122430_addArbitrageUserProfitStatistics')
BEGIN
    CREATE TABLE [ArbitrageUserProfitStatistics] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [UserId] bigint NOT NULL,
        [Day] int NOT NULL,
        [Month] int NOT NULL,
        [Year] int NOT NULL,
        [CurrencyName] nvarchar(max) NOT NULL,
        [USDStartingBalance] decimal(35, 18) NOT NULL,
        [StartingBalance] decimal(35, 18) NOT NULL,
        [EndingBalance] decimal(35, 18) NOT NULL,
        [USDEndingBalance] decimal(35, 18) NOT NULL,
        [DepositionAmount] decimal(35, 18) NOT NULL,
        [USDDepositionAmount] decimal(35, 18) NOT NULL,
        [WithdrawAmount] decimal(35, 18) NOT NULL,
        [USDWithdrawAmount] decimal(35, 18) NOT NULL,
        [ProfitAmount] decimal(35, 18) NOT NULL,
        [USDProfitAmount] decimal(35, 18) NOT NULL,
        [ProfitPer] decimal(35, 18) NOT NULL,
        CONSTRAINT [PK_ArbitrageUserProfitStatistics] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190612122430_addArbitrageUserProfitStatistics')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190612122430_addArbitrageUserProfitStatistics', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190613071915_AddNewColInArbitrageWalletTypeMaster')
BEGIN
    ALTER TABLE [ArbitrageWalletTypeMaster] ADD [IsLeaverageAllow] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190613071915_AddNewColInArbitrageWalletTypeMaster')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190613071915_AddNewColInArbitrageWalletTypeMaster', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190613113619_compositKeyinCryptowatcherArbitrage')
BEGIN
    ALTER TABLE [CryptoWatcherArbitrage] DROP CONSTRAINT [PK_CryptoWatcherArbitrage];
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190613113619_compositKeyinCryptowatcherArbitrage')
BEGIN
    ALTER TABLE [TransactionQueueArbitrage] ADD [IsSmartArbitrage] smallint NOT NULL DEFAULT CAST(0 AS smallint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190613113619_compositKeyinCryptowatcherArbitrage')
BEGIN
    DECLARE @var622 sysname;
    SELECT @var622 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ServiceProConfigurationArbitrage]') AND [c].[name] = N'SecretKey');
    IF @var622 IS NOT NULL EXEC(N'ALTER TABLE [ServiceProConfigurationArbitrage] DROP CONSTRAINT [' + @var622 + '];');
    ALTER TABLE [ServiceProConfigurationArbitrage] ALTER COLUMN [SecretKey] nvarchar(500) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190613113619_compositKeyinCryptowatcherArbitrage')
BEGIN
    DECLARE @var623 sysname;
    SELECT @var623 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ServiceProConfigurationArbitrage]') AND [c].[name] = N'APIKey');
    IF @var623 IS NOT NULL EXEC(N'ALTER TABLE [ServiceProConfigurationArbitrage] DROP CONSTRAINT [' + @var623 + '];');
    ALTER TABLE [ServiceProConfigurationArbitrage] ALTER COLUMN [APIKey] nvarchar(500) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190613113619_compositKeyinCryptowatcherArbitrage')
BEGIN
    DECLARE @var624 sysname;
    SELECT @var624 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ServiceProConfiguration]') AND [c].[name] = N'SecretKey');
    IF @var624 IS NOT NULL EXEC(N'ALTER TABLE [ServiceProConfiguration] DROP CONSTRAINT [' + @var624 + '];');
    ALTER TABLE [ServiceProConfiguration] ALTER COLUMN [SecretKey] nvarchar(500) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190613113619_compositKeyinCryptowatcherArbitrage')
BEGIN
    DECLARE @var625 sysname;
    SELECT @var625 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ServiceProConfiguration]') AND [c].[name] = N'APIKey');
    IF @var625 IS NOT NULL EXEC(N'ALTER TABLE [ServiceProConfiguration] DROP CONSTRAINT [' + @var625 + '];');
    ALTER TABLE [ServiceProConfiguration] ALTER COLUMN [APIKey] nvarchar(500) NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190613113619_compositKeyinCryptowatcherArbitrage')
BEGIN
    ALTER TABLE [CryptoWatcherArbitrage] ADD CONSTRAINT [PK_CryptoWatcherArbitrage] PRIMARY KEY ([LPType], [PairId]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190613113619_compositKeyinCryptowatcherArbitrage')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190613113619_compositKeyinCryptowatcherArbitrage', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190617080000_addEntityDemonConfigurationArbitrage')
BEGIN
    CREATE TABLE [DemonConfigurationArbitrage] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [IPAdd] nvarchar(15) NOT NULL,
        [PortAdd] int NOT NULL,
        [Url] nvarchar(200) NOT NULL,
        CONSTRAINT [PK_DemonConfigurationArbitrage] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190617080000_addEntityDemonConfigurationArbitrage')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190617080000_addEntityDemonConfigurationArbitrage', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190617115151_AddNewEntityTranStatusCheckReqArbitrage')
BEGIN
    CREATE TABLE [TransactionStatusCheckRequestArbitrage] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [TrnNo] bigint NOT NULL,
        [SerProDetailID] bigint NOT NULL,
        [RequestData] nvarchar(max) NULL,
        [ResponseTime] datetime2 NOT NULL,
        [ResponseData] nvarchar(max) NULL,
        [TrnID] nvarchar(max) NULL,
        [OprTrnID] nvarchar(max) NULL,
        CONSTRAINT [PK_TransactionStatusCheckRequestArbitrage] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190617115151_AddNewEntityTranStatusCheckReqArbitrage')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190617115151_AddNewEntityTranStatusCheckReqArbitrage', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190617140012_AddNewEntityActivityTypeLog')
BEGIN
    CREATE TABLE [ActivityTypeLog] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [UserID] bigint NOT NULL,
        [ActivityType] int NOT NULL,
        [ActivityDate] datetime2 NOT NULL,
        [OldValue] nvarchar(max) NULL,
        [NewValue] nvarchar(max) NULL,
        CONSTRAINT [PK_ActivityTypeLog] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190617140012_AddNewEntityActivityTypeLog')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190617140012_AddNewEntityActivityTypeLog', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190618081100_addActivityTypeHour')
BEGIN
    CREATE TABLE [ActivityTypeHour] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [ActivityHour] int NOT NULL,
        [ActivityType] int NOT NULL,
        CONSTRAINT [PK_ActivityTypeHour] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190618081100_addActivityTypeHour')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190618081100_addActivityTypeHour', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190618121424_addColToDeviceMaster')
BEGIN
    ALTER TABLE [DeviceMaster] ADD [ExpiryTime] datetime2 NOT NULL DEFAULT '0001-01-01T00:00:00.0000000';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190618121424_addColToDeviceMaster')
BEGIN
    ALTER TABLE [DeviceMaster] ADD [Guid] uniqueidentifier NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190618121424_addColToDeviceMaster')
BEGIN
    ALTER TABLE [DeviceMaster] ADD [IPAddress] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190618121424_addColToDeviceMaster')
BEGIN
    ALTER TABLE [DeviceMaster] ADD [Location] nvarchar(max) NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190618121424_addColToDeviceMaster')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190618121424_addColToDeviceMaster', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190618134548_arbitragechargeentity')
BEGIN
    CREATE TABLE [ChargeConfigurationDetailArbitrage] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [ChargeConfigurationMasterID] bigint NOT NULL,
        [ChargeDistributionBasedOn] smallint NOT NULL,
        [ChargeType] bigint NOT NULL,
        [DeductionWalletTypeId] bigint NOT NULL,
        [ChargeValue] decimal(28, 18) NOT NULL,
        [ChargeValueType] smallint NOT NULL,
        [MakerCharge] decimal(28, 18) NOT NULL,
        [TakerCharge] decimal(28, 18) NOT NULL,
        [MinAmount] decimal(28, 18) NOT NULL,
        [MaxAmount] decimal(28, 18) NOT NULL,
        [Remarks] nvarchar(max) NULL,
        [IsCurrencyConverted] smallint NOT NULL,
        [DeductChargetType] smallint NULL,
        CONSTRAINT [PK_ChargeConfigurationDetailArbitrage] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190618134548_arbitragechargeentity')
BEGIN
    CREATE TABLE [ChargeConfigurationMasterArbitrage] (
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [Id] bigint NOT NULL IDENTITY,
        [WalletTypeID] bigint NOT NULL,
        [TrnType] bigint NOT NULL,
        [KYCComplaint] smallint NOT NULL,
        [SlabType] smallint NOT NULL,
        [SpecialChargeConfigurationID] bigint NOT NULL,
        [Remarks] nvarchar(max) NULL,
        CONSTRAINT [PK_ChargeConfigurationMasterArbitrage] PRIMARY KEY ([WalletTypeID], [TrnType], [KYCComplaint], [SpecialChargeConfigurationID]),
        CONSTRAINT [AK_ChargeConfigurationMasterArbitrage_KYCComplaint_SpecialChargeConfigurationID_TrnType_WalletTypeID] UNIQUE ([KYCComplaint], [SpecialChargeConfigurationID], [TrnType], [WalletTypeID])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190618134548_arbitragechargeentity')
BEGIN
    CREATE TABLE [TrnChargeLogArbitrage] (
        [Id] bigint NOT NULL IDENTITY,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] bigint NOT NULL,
        [UpdatedBy] bigint NULL,
        [UpdatedDate] datetime2 NULL,
        [Status] smallint NOT NULL,
        [BatchNo] nvarchar(max) NULL,
        [TrnNo] bigint NOT NULL,
        [TrnType] bigint NOT NULL,
        [Amount] decimal(28, 18) NOT NULL,
        [MakerCharge] decimal(28, 18) NULL,
        [TakerCharge] decimal(28, 18) NULL,
        [Charge] decimal(28, 18) NULL,
        [StakingChargeMasterID] bigint NULL,
        [ChargeConfigurationDetailID] bigint NULL,
        [TimeStamp] nvarchar(max) NULL,
        [DWalletID] bigint NOT NULL,
        [OWalletID] bigint NOT NULL,
        [DUserID] bigint NOT NULL,
        [OuserID] bigint NOT NULL,
        [WalletTypeID] bigint NOT NULL,
        [SlabType] smallint NOT NULL,
        [Remarks] nvarchar(max) NULL,
        [ChargeConfigurationMasterID] bigint NULL,
        [IsMaker] smallint NULL,
        [TrnRefNo] bigint NULL,
        [OriginalAmount] decimal(28, 18) NULL,
        [IsReferCommGiven] smallint NOT NULL,
        CONSTRAINT [PK_TrnChargeLogArbitrage] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190618134548_arbitragechargeentity')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190618134548_arbitragechargeentity', N'2.1.8-servicing-32085');
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190619060139_addnewcolTransactionPolicy')
BEGIN
    ALTER TABLE [TransactionPolicy] ADD [DailyVelocityAddressAmount] decimal(28, 18) NOT NULL DEFAULT 0.0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190619060139_addnewcolTransactionPolicy')
BEGIN
    ALTER TABLE [TransactionPolicy] ADD [DailyVelocityAddressCount] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190619060139_addnewcolTransactionPolicy')
BEGIN
    ALTER TABLE [TransactionPolicy] ADD [MonthlyVelocityAddressAmount] decimal(28, 18) NOT NULL DEFAULT 0.0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190619060139_addnewcolTransactionPolicy')
BEGIN
    ALTER TABLE [TransactionPolicy] ADD [MonthlyVelocityAddressCount] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190619060139_addnewcolTransactionPolicy')
BEGIN
    ALTER TABLE [TransactionPolicy] ADD [WeeklyVelocityAddressAmount] decimal(28, 18) NOT NULL DEFAULT 0.0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190619060139_addnewcolTransactionPolicy')
BEGIN
    ALTER TABLE [TransactionPolicy] ADD [WeeklyVelocityAddressCount] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190619060139_addnewcolTransactionPolicy')
BEGIN
    ALTER TABLE [TransactionPolicy] ADD [YearlyVelocityAddressAmount] decimal(28, 18) NOT NULL DEFAULT 0.0;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190619060139_addnewcolTransactionPolicy')
BEGIN
    ALTER TABLE [TransactionPolicy] ADD [YearlyVelocityAddressCount] bigint NOT NULL DEFAULT CAST(0 AS bigint);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190619060139_addnewcolTransactionPolicy')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190619060139_addnewcolTransactionPolicy', N'2.1.8-servicing-32085');
END;

GO

