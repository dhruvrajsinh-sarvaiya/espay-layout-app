const ptPT = {
    appName: "CoolDex",

    //Main Screen Bottom Menus
    homeTitle: "Casa",
    marketTitle: 'Mercados',
    tradesTitle: 'Comércio',
    Funds: 'Fundos',
    Accounts: "Conta",
    accountSettings: 'Configurações da conta',

    //Splash Screen
    WelcomeTo: 'bem-vindo ao',
    welcome: 'Bem vinda',

    //Market Pair List
    pair: 'Par',
    vol: 'Vol',
    volume: 'Volume',
    data: 'Dados',
    lastPrice: 'Último preço',
    low: 'Baixo',
    high: 'Alto',
    twentyFourHourChange: '24h Chg%',
    favourites: 'Favoritos',
    favorite: 'Favorito',
    deposit: 'Depósito',
    withdrawal: 'Retirada',
    more: 'Mais',
    bid: 'Oferta',
    ask: 'Pergunte',
    buy: 'Comprar',
    sell: 'Vender',
    reports: 'Relatórios',
    time: 'Tempo',
    price: 'Preço',
    orderhistory: 'Histórico de pedidos',
    openorder: 'Ordem aberta',
    orderDetail: 'Detalhe do pedido',
    partialOrder: 'Pedido Parcial',
    hideotherpair: 'Ocultar outros pares',
    cancelall: 'Cancelar tudo',
    editFavoriteTitle: 'Editar favoritos',
    done: 'Feito',
    top: 'Topo',
    sort: 'Ordenar',
    order: 'ordem',
    openOrder: 'Pedidos em aberto',
    type: 'Tipo',
    fee: 'Taxa',
    txnDate: 'Txn Data',
    tradedetail: 'Detalhe do comércio',
    sides: [{ value: 'Revelia' }, { value: 'Vender Ordem' }, { value: 'Ordens de compra' }],
    decimals: [{ value: '3 Decimais' }, { value: '4 Decimais' }, { value: '5 Decimais' }, { value: '6 Decimais' }],
    marketPrice: 'Preço de mercado',
    optimalMarketPrice: 'Optimal Preço de Mercado',
    stop: 'Pare',
    limit: 'Limite',
    market: 'Mercado',
    stopLimit: 'Stop-limit',
    spot: 'Spot',
    equivalent: 'Equivalente',
    total: 'Total',
    available: 'Avbl',

    creditWalletMessage: "Carteira de crédito é desativada ou não definida",
    debitWalletMessage: "Carteira de Débito é Desativada ou Não Definida",

    marketTrades: 'Comércio de mercado',
    name: 'Nome',
    // tradeDetailGraphTabNames: ['Linha', 'Diepte'],
    tradeDetailGraphTabNames: ['Linha'],
    tradeDetailTabNames: ['Livro', 'Comércio de mercado'],
    digits: [
        { value: '8', },
        { value: '7', },
        { value: '6' },
        { value: '5' },
    ],
    lineChartTypes: [
        { value: 'Linha' }, { value: '1m' }, { value: '5m' }, { value: '15m' }, { value: '30m' },
        { value: '1H' }, { value: '2H' }, { value: '4H' }, { value: '6H' }, { value: '12H' },
        { value: '1D' }, { value: '2W' }, { value: '4M' },
    ],
    userid: 'Usuário ID',
    currencyPair: 'Par de Moedas',
    select_type: 'Selecione o Tipo',
    select_status: 'Selecione Status',
    on: 'Em',
    off: 'Desligado',
    charts: 'Gráficos',
    summary: 'Resumo',
    currentRate: 'Taxa atual',
    high24h: '24h alta',
    low24h: '24h baixo',
    orders: 'Ordens',
    orderCreated: 'Pedido criado',
    settled_on: 'Liquidado em',

    //Top Gainer & Loser
    topGainerLoser: 'Top Gainers e perdedores',
    topGainer: 'Gainer Superior',
    topLoser: 'Melhor Perdedor',
    changePer: 'ChangePer',
    changePercentage: 'Porcentagem de mudança',
    changeValue: 'Alterar valor',
    selectOrderType: 'Selecione o tipo de pedido',
    vol_24h: '24H Vol',
    h: 'H',
    l: 'L',

    //Market Search List
    searchHere2: 'Por favor, insira Palavras-chave',
    cancel: 'Cancelar',

    //Transaction Charge
    all: 'Todos',
    selectCurrency: 'Selecione Moeda',
    submit: "Enviar",
    Username: "Username",
    Password: "SEnha",
    RememberMe: "Lembre de mim",
    Withdrawal: "Retirada",
    Please_Select: 'Por favor Selecione',
    Initialize: 'Inicializar',
    historyStatusList: [
        { value: 'Por favor Selecione', code: -1 },
        { value: 'Inicializar', code: 0 },
        { value: 'Sucesso', code: 1 },
        { value: 'Fracassado', code: 3 },
        { value: 'Pendente', code: 6 },
        { value: 'Rejeitado', code: 9 },
    ],
    OperatorFail: 'OperatorFail',
    SystemFail: 'SystemFail',
    Hold: 'Aguarde',
    Refunded: 'Devolveu',
    Pending: 'Pendente',
    Rejected: 'Rejeitado',
    txnid: "TxnID",

    searchHere: 'Procure aqui...',
    noRecordsFound: 'Ainda sem registros',
    noChartDataFound: 'Nenhum dado do gráfico foi encontrado',

    //For Withdraw History Module
    Withdraw_History: "Retira Histórico",
    Coin: "Moeda",
    Amount: "Montante",
    Date: "datar",
    Information: "informação",
    Status: "Status",
    Address: "Endereço",
    Loading: "Carregando..",

    //Withdraw Request Validation
    Select_Coin: "Selecione Moeda",
    Select_Wallet: "Selecione Wallet",
    ScanQRCode: 'Por favor, leia o código QR.',
    Select_Source_Address: "Selecione o endereço",
    Enter_Address: "Insira endereço",
    Enter_Withdraw_Amount: "Enter retirar Montante",
    Enter_Lable: 'Digite o rótulo',
    WhiteList_Store: 'Whitelist e Store',
    WDMaxWithdraw: 'O valor deve ser maior que o mínimo de retirada',
    WDMinWithdraw: 'O valor deve ser menor que a retirada máxima',
    Mini_Withdrawal: 'Retirada Mínima',
    Max_Withdrawal: 'Retirada Máxima',
    Withdraw_Limit_Msg: 'Não se retire diretamente para um crowdfound ou IOC. Não creditaremos na sua conta fichas desse seguro.',
    WDLessthenBalance: 'O valor deve ser menor que o saldo disponível',
    WDLessthenLimit: 'O valor deve ser menor que o limite diário de retirada',

    //From Constant Utils Content
    SERVER_ERROR_MSG: "O servidor está temporariamente impossibilitado de processar sua solicitação. Tente mais tarde.",
    NETWORK_MESSAGE: "Não conectado à Internet. Por favor, verifique a conectividade com a Internet.",
    SLOW_INTERNET: "Sua conexão com a internet pode ser lenta. Por favor, conecte-se a conexão de internet funcionando.",
    SESSION_EXPIRE: "A sessão expirou.",

    //For Deposit
    Copy_Address: "Copiar endereço",
    Copy_SuccessFul: "cópia sucedida",
    Generate_NewAddres: "Gerar novo endereço",
    DepositHistory: "História depósito",
    Ava_Bal: "Saldo disponível",
    Limit: "Limite",
    Deposits: "Depósito",
    copy: 'cópia de',
    Info: 'Info',

    //cms screens title
    policy: 'apólice',
    Privacy_Policy: "Política de Privacidade",
    AML_Policy: "Política de AML",
    Refund_Policy: "Politica de reembolso",
    About_Us: "Sobre nós",
    Contact_Us: "Contate-Nos",
    News_Section: "Notícia",
    myAccount: "Minha conta",
    Terms_Condition: "Terms & Condition",
    Support: "Apoio",
    Settings: "ConFigurações",
    Security: "Segurança",
    RefereAndEarn: "Referir & Ganhar",
    Announcement: "Announcement",
    Sitemap: "Sitemap",
    faq: "FAQs",
    list_coin: "Moeda lista",
    fees_charges: "Taxas e encargos",
    coin_info: "Informação da Moeda",
    create: 'Criar',
    apiKey: 'Chave API',
    secretKey: 'Chave secreta',
    TERMCONDITION: "Termos & Condições",
    Reply_Complain: "Responder Complaint",
    Raise_Complain: "Levantar Reclamação",
    Upload: 'Envio',
    raiseComplainSuccessfully: 'Sua reclamação foi levantada com sucesso',

    //For Transfer In History
    TransferInHistory: "História transferrina",
    TransferInHistoryDetail: "História transferrina Detalhe",
    TransferInOutStatusSuccess: "Sucesso",
    TxnID: "TxnID",
    AccountNo: "AccountNo",
    Order_id: "ID do pedido",
    Member_code: "ID do membro",
    Confirmations: "Confirmações",
    Conf: 'Conf.',

    //For Transfer Out History
    TransferoutHistory: "Histórico TransferOut",
    TransferoutHistoryDetail: "Detalhe do histórico do TransferOut",
    Trn_No: "Trn Não",
    Pre_Bal: "Pre Bal",
    Post_Bal: "Post Bal",
    Trn_Date: "Trn Date",
    Result_DateTime: "Data do resultado",
    Txn_Amount: "TXN MONTANTE",
    Balance: "Equilibrar",
    Balances: "Saldos",

    //For Transaction History
    history: "Histórico",

    //For From Date And ToDate Validation
    date_selection: "Selecione data",
    dateGreterValidation: "A Partir De data não pode ser maior que Até a presente data",
    dateDaysValidation: "Você não pode visualizar mais de 10 dias de relatório",
    Show_ButtonText: "mostrar",
    From_Date: "A Partir De data",
    To_Date: "Até a presente data",

    //For Token Convert
    SiteTokenConversion: "Conversão de token de site",
    TotalAmount: "Total Montante",
    Enter_Amount: "Digite Montante",
    SiteTokenHistory: "Histórico do Token do Site",
    From_Address: "A partir Endereço",
    Price: "Preço",
    Total: "Total",
    ConverToSiteToken: 'Converter em tokens de site',
    ConvertToToken: 'Converter em token',
    TokenValue: 'Token Value',
    selectToken: 'Selecione Token',
    Details: 'Detalhes',
    Tokens: 'Tokens',
    NetTotal: 'Total Líquido',
    Receive: 'You Will Receive',
    Min_Limit_Conversion: 'Limite Mínimo',
    Max_Limit_Conversion: 'Limite máximo',
    Balance_Validation: 'Você Don\'t tem saldo suficiente',
    Token_Calculation_Validation: 'Por favor, execute o cálculo',
    Min_Token_Validation: 'Você não pode converter Token Less Then Minimum Limit.',
    Max_Token_Validation: 'Você não pode converter token maior que o limite máximo.',
    Target_Currency: 'Moeda Alvo',
    SourceQuantity: 'Fonte Quantidade',
    TargetQuantity: 'Quantidade Alvo',
    SourceToPrice: 'Source To Fonte para Preco',
    TargetToPrice: 'Alvo para preço',
    TokenPrice: 'Token Preco',
    convertTokenMinLimit: 'Você tem que converter Mínimo {Param1} Tokens.',
    convertTokenMaxLimit: 'Você pode converter o máximo {Param2} Tokens.',
    amountTokenValidation: 'Por favor insira Token ou Montante',
    sameCurrencyValidation: 'Você não pode selecionar a mesma moeda',

    //For Limit Control
    LimitControl: "Controle de limite",
    LimitNotice1: "Gerenciar de hora em hora, diariamente e / ou transação",
    LimitNotice2: "limites para esta carteira. Transações por cima um especificado limite exigem aprovação do administrador. Para alterar esses limites, contato Apoio",
    LimitPerHour: "Limite por hora",
    LimitPerDay: "Limite por dia",
    LimitPerTrn: "Limite por transação",
    Save: "Salve",
    LimitPerHourValidation: "Digite limite por horas",
    LimitPerDayValidation: "Digite limite por dia",
    LimitPerTrnValidation: "Insira o limite por transação",
    LifeTimeLimitValidation: "Insira o limite de tempo de vida",
    StartTimeValidation: "Hora de início",
    EndTimeValidation: "Insira o horário de término",
    TradingLimits: "Negociação",
    WithdrawLimits: "Retirar",
    DepositLimits: "Depósito",
    APICallLimits: "APICall",
    LifeTimeLimit: 'Limite de tempo de vida',
    StartTime: 'Hora de início',
    EndTime: 'Fim do tempo',

    //For Token Stacking
    Token_Stack: "Empilhamento de token",
    Marker: "Marcador",
    Taker: "Tomador",
    Select_Type: "Selecione o tipo",
    TokenStacking_History: "Token Stacking History",
    Type: "Tipo",
    Marker_Charges: "Encargos marcador",
    Taker_Charges: "Encargos Taker",
    Charges: "Encargos(%)",
    Selected: "Selecionado",


    //For Address Whitelisting For Withdrawal
    Add_Withdrawal_Address: "Adicionar de retirada endereço",
    Label: "Rótulo",
    Add_WhiteList: "Adicionar à lista de autorizações",
    Enter_Label: "Digite rótulo",
    Label_Excced_Limit: "O rótulo não deve exceder 20 caracteres",
    TurnON_Whitelist_Function: "Por favor, ligue a função lista branca primeiro",
    WhiteList_ON: "Whitelist ON",
    WhiteList_OFF: "Whitelist OFF",
    Whitelist_Address_History: "Histórico de Endereços do WhiteList",
    Remove_Whitelist: "Remover da lista de permissões",
    Delete: "Excluir",
    Whitelisted_Record: "Exibir apenas endereços da lista branca",
    WhiteListed: "Whitelisted",

    //for Listing coin
    coinList: 'Lista de Moedas',

    //for sign up screen / register
    Email: 'Email',
    Confirm_Password: 'Confirme a senha',
    Confirm_Email: 'confirmar e-mail',
    Login: 'entrar',
    Register: 'registo',
    reset_google_title: 'Redefinir a Autenticação do Google',
    reset_sms_title: 'Redefinir a autenticação por SMS',

    google_auth_reset_msg: 'Se você salvou sua chave de recuperação de 16 dígitos para o Google Authenticator antes de configurá-la em seu telefone, poderá usar essa chave de recuperação para restaurar rapidamente seu aplicativo Google Authenticator, sem precisar redefinir manualmente seu Google Authenticator.',

    google_auth_option1_msg: 'A redefinição fará com que sua conta perca a proteção do Google Authenticator. Para evitar a perda de recursos, verifique se seu e-mail e senha de login estão protegidos e vincule o Google Authenticator imediatamente após a redefinição ser bem-sucedida.',

    google_auth_option2_msg: 'A redefinição do seu Google Authenticator é muito manual e geralmente leva dois dias. Observe que suas retiradas serão desativadas por 48 horas após a redefinição ocorrer.',

    google_confirmation_msg: 'Enviamos um email de confirmação para você. Siga as instruções para redefinir a verificação do Google.',

    sms_auth_reset_msg: 'Se o seu número de telefone ainda puder receber o código de verificação de SMS, você poderá desativar o número de telefone nas contas Autenticação de dois fatores sem redefinir.',

    sms_auth_option1_msg: 'A redefinição fará com que sua conta perca a proteção do SMS Authenticator. Para evitar a perda de ativos, certifique-se de que seu e-mail e senha de login estejam protegidos e vincule o SMS Authenticator imediatamente após a redefinição ser bem-sucedida.',

    sms_auth_option2_msg: 'A redefinição do seu autenticador SMS é muito manual e geralmente leva mais de dois dias. Observe que suas retiradas serão desativadas por 48 horas após a redefinição ocorrer.',

    sms_confirmation_msg: 'Enviamos um email de confirmação para você. Por favor, siga as instruções para redefinir a verificação por SMS.',

    common_confirmation_msg: 'Se você ainda não recebeu o email, faça o seguinte: \ n \ nVerifique spam ou outras pastas. \ nVerifique se o cliente de e-mail funciona normalmente. ',

    reset_pswd_msg: '* Para propósitos de segurança, nenhum saque é permitido por 24 horas após a modificação dos métodos de segurança..',

    confirm_your_reset_request: 'confirme sua solicitação de redefinição',
    backToLogin: 'Volte ao login',
    eagerToJoin: 'Ansioso para participar?',
    quickSignUp: 'Quick SignUp',
    signUpWithProfile: 'Inscreva-se com os detalhes do seu perfil',

    //for login with 2FA
    TwoFA_text: '2FA',
    GoogleAuthentication: 'Autenticação do Google',
    SMSAuthentication: 'Autenticação SMS',
    authentication_code_validate: 'Digite o código de autenticação',
    authentication_code_length_validate: 'O código de autenticação deve ter 6 dígitos.',

    //for login
    username_validate: 'Insira nome de usuário',
    password_validate: 'Digite a senha',

    //For Filter Drawar
    Reset: 'Restabelecer',
    Apply: 'Aplique',

    //for forgot password
    email: 'O email',
    enterEmail: 'Digite o email',

    //for reset password
    new_password: 'Nova senha',
    repeat_password: 'Confirme a Senha',
    confirm_password_validate: 'Insira Confirmar Senha',
    password_match_validate: 'Senha e Confirmar Senha devem ser as mesmas',

    action: 'Açao',

    //For IP Whitelist
    ipTitle: 'IP',
    deviceTitle: 'Dispositivo',
    dateTimeTitle: 'Data Hora',
    ipAddress: 'Seu Endereço IP',
    ipWhitelisting: 'IP Whitelist',
    add: 'Adicionar',
    aliasName: 'Nome do alias',
    aliasNameValidation: 'O nome do alias não deve estar vazio.',
    addIpToWhiteListTitle: 'Adicionar IP à lista de permissões',
    updateIpToWhiteListTitle: 'Atualizar o IP para a lista de permissões',
    Enable: 'Habilitar',
    Disable: 'Desabilitar',
    Please_Enter_IpAddress: 'Por favor insira o endereço IP',

    //For Login History
    Login_History: 'Histórico de Login',

    //For Ip History
    Ip_History: 'Histórico de IP',
    EnterProperIpAddress: 'Digite o endereço IP apropriado',

    //KYC Module
    identityAuthentication: 'Autenticação de Identidade',
    verification_string: 'Por favor, certifique-se de usar sua identidade real para fazer esta verificação',
    surname: 'Sobrenome',
    givanname: 'Nome dado',
    valididentitycard: 'Cartão de identidade válido',
    cardfrontside: 'Carregar Imagem de Identity Card Front Side',
    cardbackside: 'Carregar imagem de Identent Card Back Side',
    photoid_note: 'Carregar imagem de Selfie com foto ID e nota',
    choosefile: 'Escolher arquivo',
    cardfrontside_string: 'Se você não tiver um passaporte, faça o upload de uma foto da frente da sua carteira de habilitação ou documento de identidade nacional.',
    cardbackside_string: 'Certifique-se de que a foto esteja completa e visível, no formato JPG. O cartão de identificação deve estar no período válido.',
    photoid_note_string: 'Por favor, forneça uma foto sua segurando a frente da sua carteira de identidade. Na mesma imagem, faça uma referência à data de hoje exibida. Certifique-se de que seu rosto esteja bem visível e que todos os detalhes do passaporte estejam claramente legíveis.',
    enter_surname: 'Digite o sobrenome',
    enter_name: 'Insira o nome',
    photoid_varification1: 'Rosto claramente visível',
    photoid_varification2: 'ID da foto claramente visível',
    photoid_varification3: 'Observe com a data de hoje',
    kyc_personal_actionbar_title: 'Verificação de identidade pessoal',
    UpdateLevel: 'Atualizar nível',
    Select_IdentityCard: 'Selecione cartão de identidade',
    ElectricityBill: 'Conta de eletricidade',
    DrivingLicence: 'Carta de Condução',
    AadhaarCard: 'Cartão Aadhaar',

    //Login With Pin and Pattern
    loginWithPinTitle: 'Entrar com Pin',
    loginWithPatternTitle: 'Login com padrão',
    pin: 'PIN',
    pattern: 'padrão',
    changePin: 'Pino de Mudança',
    changePattern: 'Mudar Padrão',
    patternNormalMessage: 'Desenhe seu padrão',
    patternRightMessage: 'Padrão correspondido com sucesso',
    patternWrongMessage: 'O padrão não corresponde, tente novamente',
    patternVerifyMessage: 'Verificar padrão',
    patternValidateMessage: 'O padrão deve conter no mínimo 3 pontos',

    //For Preferences Module
    EnableDarkMode: "Ativar o modo escuro",
    Preferences: 'Preferências',
    language: 'Língua',
    NotificationSettings: 'Configurações de notificação',

    // Referral Program
    ReferrelProgram: 'Programa de referência',
    inviteShareMessage: '{user} Invited you to Join {appName} - Fast, Simple and Safe CryptoExchange Platform ! Use my unique {referralId} {referralLink} to get an assured reward now ! Visit Our Website - {websiteLink} and SignUp now !',

    // Session Module of MyAccount
    Session: 'Sessões',
    withdrawalAddressManagement: 'Gerenciamento de endereços de retirada',

    //for security questions
    edit: 'Editar',

    //for Security image message
    enter_message: 'Digite a mensagem',

    //security
    phoneNumber: 'Número de telefone',
    phoneNumberValidation: 'O número de telefone deve ter 10 dígitos.',
    GoogleAuthenticator: 'Google Authenticator',
    enabled: 'Ativado',
    disabled: 'Desativado',
    incorrectPassword: 'Por favor, digite a senha correta.',
    old_password: 'Senha Antiga',
    old_password_validate: 'Digite a senha antiga',
    changePassword: 'Mudar senha',
    googleAuthIntroMessagePart1: 'Para começar, você precisará instalar o ',
    googleAuthIntroMessagePart2: ' aplicação no seu telefone.',
    googleAuthBackupKeyTitle: 'Chave de backup',
    googleAuthBackupKeyMessage: 'Por favor, salve esta chave no papel. Essa chave permitirá que você recupere sua Autenticação do Google em caso de perda de telefone.',
    next: 'Próximo',
    disableGoogleAuthentication: 'Desativar o Google Auth',

    firstName: 'Primeiro nome',
    lastName: 'Último nome',
    firstNameValidate: 'Introduza o primeiro nome',
    lastNameValidate: 'Insira o último nome',
    countryVaildate: 'Selecione o pais',
    updateProfileTitle: 'Atualizar perfil',
    select_your_image: 'Selecione a imagem',

    //For Fee & Limit Patterns
    Exchange: "Troca",
    Fee: "Taxa",
    Fee_Calculation_Type: "Tipo de cálculo de Taxa",
    Apply_Fee_Range: "Aplicar Taxa no intervalo",
    Fee_Amount: "Taxa Montante",
    LimitType: "Tipo limite",

    //For Device Whitelist
    DeviceWhitelist: "Whitelist de dispositivo",
    DeviceAddress: "Endereço do dispositivo",
    DeviceName: "Nome do dispositivo",
    IPAddress: "Endereço de IP",
    Location: "Localização",
    AddDevicetoWhitelist: "Adicionar dispositivo à lista de permissões",
    current_device: 'Dispositivo atual',

    //For Complain 
    closed: 'Fechadas',
    open: 'Abrir',
    complaint: 'Queixa',
    complaint_list: 'Listar Reclamações',
    complaint_id: 'ID de reclamação',
    status: 'Status',
    subject: 'Sujeito',
    remarks: 'Observações',
    description: 'descrição',
    updated_at: 'atualizado em',
    created_at: 'Criado em',
    id: 'Id',
    postreply: 'Resposta ao post',
    recheck: 'Recheck',
    urgent: 'Urgente',
    medium: 'Média',
    priority: 'Prioridade',

    // Announcements Module of MyAccount
    Announcements: 'Anúncios',
    AnnouncementSection: 'Seção de anúncio',

    //For SignUp
    SignUp: 'Inscrever-se',
    Validate_MobileNo: 'Digite o número do celular',
    MobileNo: 'Celular Não',
    VerifyOtp: "Verifique OTP",
    ResendOtp: "Reenviar OTP",

    //for new signupscreen
    Generate_OTP: 'Gere OTP',
    Enter_Email_validation: 'Por favor, digite o endereço de e-mail',
    Enter_Valid_Email: 'Por favor insira o endereço de e-mail válido',

    //For MembershipLevels
    Membershiplevel: "Níveis de adesão",
    Depositfee: "Taxa de depósito",
    Withdrawelfee: "Taxa de retirada",
    Tradingfee: "Taxa de Negociação",
    WithdrawelLimit: "Limite de Retirada de 24h",
    upgradeNow: "Atualize agora",
    Year: 'Ano',
    Standard: 'Padrão',

    //Logout
    logOff: 'Sair',
    Success: 'Sucesso',
    Failed: 'Fracassado',
    Important: 'Importante',

    //For SignUp Normal
    ReferalId: 'Referal Id',
    Optional: 'Optional',
    password_length_validate: 'A senha deve ter no mínimo 6 e no máximo 30 caracteres',
    Prev: 'Anterior',
    Strong_Password_Validation: 'A senha deve conter pelo menos 1 caractere maiúsculo 1 minúsculas 1 número 1 caractere especial',

    //For Normal Login
    Forgot_your_password: 'Esqueceu sua senha?',
    Exit: 'Saída',
    OK: 'OK',
    Exit_Message: 'Você realmente quer sair do aplicativo?',

    //app intro title and text
    appIntroTitle1: 'Troca Segura',
    appIntroTitle2: 'carteira',
    appIntroTitle3: 'Analytics',

    appIntroText1: 'Envie e receba seus ativos digitais com segurança a qualquer momento em qualquer lugar.',
    appIntroText2: 'Assuma o controle de seus ativos digitais. Múltipla criação e gerenciamento de carteira de bitcoin no aplicativo',
    appIntroText3: 'Acompanhe todas as suas transações com representação gráfica em um único clique.',

    // loginwith2fa
    lost_msg: 'Perdeu seu autenticador',
    New_Password: 'Insira a nova senha',
    confirm: 'confirme',

    update: 'Atualizar',
    //For View Fund
    ShowBalance: 'Mostrar Todos os Saldos',
    HideBalance: 'Ocultar Todos saldos',

    //Wallet Configuration
    Wallet_Configuration: 'Carteira Configuração',

    //View Profile
    ViewProfile: 'Ver perfil',
    Verfiy: 'Verificar',
    Verified: 'Verificado',
    KYCStatus: 'KYC Status',
    KYCLevel: 'Nível KYC',

    //  newssectiondetail & refer&earn & contact us & deviceWhitelist
    NewStack: 'NewStack',
    Referrel_Code: 'Código de Referencia',
    referral_id: 'Referência ID',
    Referral_Link: 'Link de referência',
    Share_Referrel_Code: 'Compartilhar código de referência',
    E_mail_blank: 'E-mail não pode ficar em branco',
    subject_blank: 'Por favor, digite o assunto',
    Description_blank: 'Por favor, insira a descrição',
    Devicename_blank: 'O nome do dispositivo não deve estar vazio',
    Location_blank: 'O local não pode estar vazio',
    Enter_valid_Code: 'Digite o código válido de 6 dígitos',
    contact_submit_success: 'Contato adicionado com sucesso',
    ForgotpasswordTitle: 'Esqueceu a senha',
    contact_us_note: '* Caractere especial não permitido no assunto e descrição',

    //cms related strings
    terms_of_service: "Termos de serviço",
    legal_statement: "Declaração Legal",
    application_center: "Application Center",
    withdraw_text: 'retirar',
    type_validation_text: 'Tipo não pode estar em branco',
    subject_validation_text: 'Assunto não pode ficar em branco',
    description_validation_text: 'Descrição não pode ser em branco',
    warning: 'Aviso',
    license_key_expired_text: 'Sua LicenseKey expirou. Entre em contato com o seu provedor de serviços para renová-lo.',
    license_trial_expired_text: 'Sua licença de avaliação expirou. Para continuar usando este serviço, obtenha uma licença de usuário válida.',
    authentication_validation_text: 'Você não tem autenticação para usar este serviço.',
    authentication_contact_validation_text: 'Você não tem autenticação para usar este serviço. Entre em contato com seu provedor de serviços.',
    inccrrect_code_text: 'Código incorreto !!! Entre em contato com seu provedor.',
    coin_name_validation: 'Digite o nome da moeda',
    file_validation: 'Selecione qualquer arquivo',
    email_validation: 'Digite o email apropriado',

    //For Google Authenticator
    App_Install_Message: 'Por favor, instale o Google Authenticator App primeiro.',
    ScanQR_Code_Message: 'Se você não conseguir digitalizar o código QR, insira este código manualmente no aplicativo.',
    EnableGoogleAuthentication: 'Ativar o Google Auth',

    // Amount Message: 
    AmountGreaterThanZero: 'O valor deve ser maior que 0',
    AmountLessBalance: 'O total deve ser menor que o saldo disponível.',
    AmountNotEmpty: 'O valor não pode estar vazio',
    PriceNotEmpty: 'O preço não pode estar vazio.',
    PriceGreaterThanZero: 'O preço deve ser maior que 0.',
    StopNotEmpty: 'O valor de parada não pode estar vazio.',
    StopGreaterThanZero: 'O valor de parada deve ser maior que 0.',
    LimitNotEmpty: 'Valor limite não pode estar vazio.',
    LimitGreaterThanZero: 'O valor limite deve ser maior que 0.',
    InsufficientBalance: 'Saldo insuficiente',
    MinimumBidPrice: 'O preço mínimo deve ser maior que ',
    MaximumBidPrice: 'O preço máximo deve ser menor ou igual a ',
    ChangePassword_Validation_Msg: 'O antigo e novo senha não podem ser iguais',

    //For Google Authenticator
    PleaseEnter: 'POR FAVOR ENTER',
    verificationCodeMessage: 'O código de verificação recebido no seu celular',
    verificationSMSMessage: 'A senha única recebida no seu UserId',
    DontReceivedCode: 'Código não recebido ?',
    Resend_In: 'Reenviar em',
    Verification: 'Verificação',
    Enter_Subject: 'Digite o Assunto',

    //Submit Request Screen
    CoinName: 'Coin Name',
    TransactionId: 'ID de transação',

    //Fee and Charges Screen
    Fees_Trading: 'Fees For Trading',
    Starking: 'Starking Of',
    UNQ_Value: 'Valor de UNQ',
    Maker_Fee: 'Maker Taxa',
    Taker_Fee: 'Taker Taxa',
    Fee_Deposit: 'Taxa para depósito',
    Fee_Withdrawal: 'Taxa Para retirada',
    Min_Withdrawal: 'Min Retirada',
    Trn_Fee: 'Taxa Trn',

    // static string change
    Currency: 'moeda',
    Edit_Profile: 'Editar Perfil',
    Basic: 'Basic',
    RecentOrder: 'Recente ordem',
    MyOrder: 'o meu pedido',

    //For Funds
    UnSettledBalance: 'Saldo não resolvido',
    UnClearedBalance: 'Saldo não corrigido',
    ShadowBalance: 'Balanço Sombrio',
    StackingBalance: 'Equilíbrio de empilhamento',
    WalletDetails: 'Detalhes da carteira',

    // User Ledger
    UserLedger: 'User Ledger',
    TxnDetail: 'Txn Detail',
    Credit: 'Crédito',
    Debit: 'Débito',
    Cr: 'Cr',
    Dr: 'Dr',

    //for coin info
    issue_date: 'Data de emissão',
    circulating_supply: 'Fornecimento Circulante',
    alogrithm: 'Algoritmo',
    issue_price: 'Preço de Emissão',
    proof_type: 'Tipo de prova',
    total_supply: 'Oferta Total',
    max_supply: 'máximo Fornecem',
    website: 'sítio Web',
    introduction: 'Introdução',
    source_code: 'Código fonte',
    update_info_validate: 'Nenhuma alteração encontrada para updation.',
    subject_length_validation: 'O assunto deve estar entre 2 e 100 caracteres',
    description_length_validation: 'Descrição deve ser entre 10 e 300 caracteres',
    alert: 'Alert',
    logout_message: 'Tem certeza que deseja sair?',
    no_text: 'Não',
    yes_text: 'sim',
    delete_message: 'Tem certeza de que deseja excluir?',
    get_started_text: 'Iniciar',
    account_created_text: 'Sua conta foi criada, por favor, verifique, clicando no link de ativação que foi enviado para o seu e-mail',
    resend_main_text: 'Reenviar Confirmar E-mail',
    hey: 'Ei',
    IpAddress: 'Endereço de IP',
    Mobile: 'Móvel',
    EmailId: 'Identificação do email',
    facebook: 'facebook',
    saveImageSuccess: 'Salvar imagem com sucesso',
    day: 'Dia',
    week: 'Semana',
    month: 'Mês',

    "activityNotification.message.2251": "Montante inválido. TrnNo: {Param1}",

    "activityNotification.message.4031": "Detalhe da solicitação inválida. TrnNo: {Param1}",
    "activityNotification.message.4034": "Detalhe da solicitação inválida. TrnNo: {Param1}",

    "activityNotification.message.4235": "Carteira ou carteira inválida está desativada. TrnNo: {Param1}",
    "activityNotification.message.4237": "O endereço não encontrado ou a lista de permissões está desativado. TrnNo: {Param1}",
    "activityNotification.message.4238": "Beneficiário não encontrado. TrnNo: {Param1}",
    "activityNotification.message.4239": "Endereço inválido. TrnNo: {Param1}",
    "activityNotification.message.4241": "Carteira não encontrada. TrnNo: {Param1}",
    "activityNotification.message.4248": "InvalidTrnType. TrnNo: {Param1}",
    "activityNotification.message.4277": "Validação de limite diário falhou para o número de transação {Param1}",
    "activityNotification.message.4278": "Validação de limite por hora falhou para o número de transação {Param1}",

    "activityNotification.message.4279": "Validação de limite de transação falha para o número de transação {Param1}",

    "activityNotification.message.4280": "Falha na validação de limite para o número de transação {Param1}",
    "activityNotification.message.4281": "A validação de tempo falha para o número de transação {Param1}",
    "activityNotification.message.4282": "A validação do limite de duração falha para o número de transação {Param1}",
    "activityNotification.message.4299": "Falha na validação do limite diário mestre para o número de transação {Param1}",

    "activityNotification.message.4300": "A validação do limite horário mestre falha para o número de transação {Param1}",
    "activityNotification.message.4301": "Validação de limite de transação falha para o número de transação {Param1}",
    "activityNotification.message.4302": "Falha na validação do limite principal para o número de transação {Param1}",
    "activityNotification.message.4303": "Falha na validação do horário principal para o número de transação {Param1}",
    "activityNotification.message.4304": "A validação do limite de tempo de vida principal falha para o número de transação {Param1}",
    "activityNotification.message.4345": "Saldo insuficiente. TrnNo: {Param1}",
    "activityNotification.message.4377": "Negociação inválida RefNo. TrnNo: {Param1}",
    "activityNotification.message.4375": "Solicitação duplicada para a mesma referência TrnNo: {Param1}",
    "activityNotification.message.4378": "Carteira ou carteira inválida está desativada. TrnNo: {Param1}",
    "activityNotification.message.4379": "Exceder Limite de Sombra. TrnNo: {Param1}",

    "activityNotification.message.4433": "Você não pode retirar para o próprio endereço. TrnNo: {Param1}",
    "activityNotification.message.4453": "O valor deve ser entre {Param2} e {Param3} do limite mestre. TrnNo: {Param1}",
    "activityNotification.message.4454": "O valor deve ser menor que o limite diário do Masters {Param3}. TrnNo: {Param1}",

    "activityNotification.message.4570": "Par inválido selecionado para o número de transação {Param1}",
    "activityNotification.message.4571": "Quantidade ou preço inválido para o número de transação {Param1}",
    "activityNotification.message.4572": "Quantidade e valor de pedido inválido para o número de transação {Param1}",
    "activityNotification.message.4575": "Montante inválido para o número de transação {Param1}",
    "activityNotification.message.4576": "Transação duplicada para o mesmo endereço, por favor, tente após 10 minutos. TrnNo: {Param1}",
    "activityNotification.message.4577": "Você não pode retirar para o próprio endereço. TrnNo: {Param1}",
    "activityNotification.message.4579": "O valor deve estar entre: {Param2} e {Param3} para o número de transação {Param1}",
    "activityNotification.message.4580": "O preço deve estar entre: {Param2} e {Param3} para o número de transação {Param1}",
    "activityNotification.message.4585": "Serviço ou Produto não disponível. TrnNo: {Param1}",

    "activityNotification.message.4620": "ID da conta de débito inválido para o número de transação {Param1}",
    "activityNotification.message.4624": "ID da conta de débito inválida. TrnNo: {Param1}",
    "activityNotification.message.4625": "ID da conta de crédito inválido para o número de transação {Param1}",
    "activityNotification.message.4670": "Tipo de pedido inválido para o número de transação {Param1}",

    "activityNotification.message.6000": "Sua {Param1} carteira é creditada para {Param2} Transação TrnNo: {Param3}",
    "activityNotification.message.6001": "Sua {Param1} carteira é debitada por {Param2} Transação TrnNo: {Param3}",
    "activityNotification.message.6002": "Novo endereço criado com sucesso para a carteira: {Param1}",
    "activityNotification.message.6003": "Novo limite criado com êxito para a Google Wallet: {Param1}",
    "activityNotification.message.6004": "Novo limite atualizado com sucesso para a Google Wallet: {Param1}",
    "activityNotification.message.6005": "Novo beneficiário adicionado com sucesso ao tipo de carteira: {Param1}",
    "activityNotification.message.6006": "Detalhes do beneficiário atualizados com sucesso para o tipo de carteira: {Param1}",
    "activityNotification.message.6007": "Sua lista de permissões é alterada {Param1} com êxito",
    "activityNotification.message.6008": "Carteiras padrão são criadas com sucesso.",
    "activityNotification.message.6009": "Carteira: {Param1} criada com sucesso.",
    "activityNotification.message.6010": "Sua Transação foi criada com sucesso Preço = {Param1}, Qty = {Param2}.",
    "activityNotification.message.6011": "Sua transação liquidada. Preço = {Param1}, Qty = {Param2}, Total = {Param3}",
    "activityNotification.message.6012": "Sua transação parcial liquidada. Preço = {Param1}, Qty = {Param2}, Total = {Param3}",
    "activityNotification.message.6013": "Converta {Param1} para {Param2} Submit Successfully !!",
    "activityNotification.message.6014": "Your Order TrnNo.{Param1} Cancelled Successfully.",
    "activityNotification.message.6015": "Falha de validação de transação TrnNo: {Param1}",
    "activityNotification.message.6016": "Falha na transação TrnNo: {Param1}",
    "activityNotification.message.6017": "Sucesso da transação Número da transação: {Param1}",
    "activityNotification.message.6018": "Sua transação de saque: valor {Param1}: {Param2} {Param3} da carteira: {Param4} foi criado",

    "activityNotification.message.6035": "Seu valor de saldo da Carteira {Param1}: {Param2} é retido para o número de transação: {Param3}",
    "activityNotification.message.6036": "Sucesso de atualização de perfil de usuário completo",
    "activityNotification.message.6037": "{Param1} Login completo do sucesso",
    "activityNotification.message.6038": "{Param1} em reenviar sucesso OTP completo",
    "activityNotification.message.6039": "{Param1} em enviar sucesso OTP completo",
    "activityNotification.message.6040": "{Param1} autenticação de dois fatores ativa",
    "activityNotification.message.6041": "{Param1} autenticação de dois fatores desativada",
    "activityNotification.message.6042": "Seu saldo de carteira {Param1} Montante: {Param2} lançamento para TrnNo: {Param3}",
    "activityNotification.message.6043": "Endereços de retirada {Param1} com sucesso",
    "activityNotification.message.6044": "Endereços de retirada {Param1} com sucesso",
    "activityNotification.message.6045": "Endereços de retirada {Param1} com sucesso",
    "activityNotification.message.6046": "Você está conectado a partir de outro dispositivo.",
    "activityNotification.message.6047": "Sua carteira {Param1} está em espera para {Param2} Número de referência da transação: {Param3}",
    "activityNotification.message.6048": "Sua carteira {Param1} foi liberada para {Param2} Número de referência da transação: {Param3}",
    "activityNotification.message.6049": "Sua carteira {Param1} é deduzida para o número de referência da transação {Param2}: {Param3}",
    "activityNotification.message.6052": "Limite por dia não pode ser menor que o {Param1}",
    "activityNotification.message.6053": "Limite por dia não pode ser mais do que o {Param1}",
    "activityNotification.message.6054": "Limite por hora não pode ser menor que o {Param1}",
    "activityNotification.message.6055": "Limite por hora não pode ser maior que o {Param1}",
    "activityNotification.message.6056": "Limite por transação não pode ser menor que o {Param1}",
    "activityNotification.message.6057": "Limite por transação não pode mais do que {Param1}",

    "activityNotification.message.7012": "Erro interno. TrnNo: {Param1}",
    "activityNotification.message.7066": "Retirada de endereço próprio não permitido. TrnNo: {Param1}",
    "activityNotification.message.7067": "Endereço incompatível. TrnNo: {Param1}",

    "activityNotification.message.21047": "Limite diário de retirada do sistema atingido para {Param1} {Param2}",
    "activityNotification.message.21071": "Saldo insuficiente para cobrança",

    //For Chat Screen
    Chat: 'Bate-papo',
    blockChat: 'Você está bloqueado.',
    unBlockChat: 'Você está desbloqueado.',

    pleaseTryAfterSometime: 'Por favor, tente depois de algum tempo.',

    //for device whitelist screen
    activity: 'Atividade',
    messagesend: 'Mensagem enviada',
    msgblankvalidation: 'A mensagem não pode ficar em branco',

    // trade module
    Withdraw: 'Retirar',
    TradeSummary: 'Resumo do comércio',
    Profit: 'Lucro',

    // for front marketitem
    Bal: 'Bal',
    At_Price: 'AT PREÇO',
    Pay_Total: 'Você pagará Total',
    Min: 'Min',

    // Social Profile Module
    // Leader Profile Configuration
    LeaderProfileConfig: 'Configuração do perfil do líder',
    ProfileVisibility: 'Visibilidade do perfil',
    MaxNoFollowerAllow: 'Número máximo de seguidores pode permitir',
    EnterMaxFollowerAllow: 'Insira o número máximo de seguidores para permitir',
    ProfileVisibilityArray: [{ value: 'Por favor selecione' }, { value: 'Pública' }, { value: 'Privada' }],

    // Follower Profile Configuration
    FollowerProfileConfig: 'Configuração do perfil do seguidor',
    CanCopyTrade: 'Pode copiar o comércio?',
    CanMirrorTrade: 'Pode espelhar o comércio?',
    TradeLimit: 'Limite de comércio',
    TradeLimitValidation: 'Insira o limite comercial',
    CopyTrade: 'Copiar Comércio',
    MirrorTrade: 'Comércio Espelho',
    TradeTypeValidation: 'Por favor selecione o tipo de comércio',
    TradeLimitValueValidation: 'Definir valor de limite comercial entre 1 e 99',

    // Social Profile Subscription
    SocialProfileSubscription: 'Assinatura de perfil social',
    Leader: 'Líder',
    CanHaveFollower: 'Pode ter seguidores?',
    CanFollowLeader: 'Pode seguir líderes?',
    MinTradeVolume: 'Volume Mínimo de Negociação',
    Subscribe: 'Se inscrever',
    UnSubscribe: 'Cancelar subscrição',
    CreateNewWatchList: 'Criar nova lista de acompanhamento',
    EnterNewWatchList: 'Insira o novo grupo de lista de observação',
    AddToNewList: 'Adicionar a nova lista',
    SocialProfileDash: 'Painel de perfil social',
    TopLeader: 'Líder Principal',
    NoOfFollowers: 'Nenhum dos seguidores',
    SocialProfile: 'Perfil Social',
    HistoricalPerformance: 'Performance Histórica',
    SocialTrading: 'Negociação Social',
    SocialTradingDesc: 'Rede de Negociação Social para debater situações de mercado com uma comunidade comercial de investidores.',
    SubscribeNow: 'Inscreva-se agora',
    Followers: 'Seguidoras',
    WatchList: 'Lista de observação',
    Followed: 'Seguida',

    // Activity Log
    activityType: 'Tipo de atividade',
    moduleType: 'Tipo de Módulo',
    activityLogHistory: 'Histórico do log de atividades',
    activityLogHistoryDetail: 'Histórico do registro de detalhes',
    deviceId: 'ID de dispositivo',
    Unauthorized: 'Não autorizado',
    BadRequest: 'Pedido ruim',
    InternalError: 'Erro interno',
    IpAddressValidation: 'Digite o endereço IP válido',

    //Stacking History
    Staking: 'Staking',
    UnStaking: 'Desatualização',
    Fixed_Deposit: 'Depósito Fixo',
    Charge: 'Carregar',
    Fixed: 'Fixo',
    Range: 'Alcance',
    GetQuote: 'Obter cotação',
    Select_Plan: 'Selecione o plano',
    StakingDetails: 'Staking Details',
    MaturityDetails: 'Detalhes de maturidade',
    Stacked: "Empilhada",
    AvailAmt: "Avail. Amt",
    Interest: 'Interesse',
    Maturity: 'Maturidade',
    Received: 'Rcvd',

    //For Add Stacking Plan
    Stacking_Type: 'Tipo de empilhamento',
    Slab_Type: 'Tipo de laje',
    Auto_Unstacking_Enable: 'Desativar Ativação Automática',
    Interest_Type: 'Tipo de interesse',
    Interest_Amount: 'Montante de juros',
    Percentage: 'Percentagem',
    Renew_Unstacking_Period: 'Renovar Período Não Aproveitado',
    Maturity_Currency: 'Moeda de Maturidade',
    Staking_Before_Maturity_Charge: 'Estacando antes do vencimento',

    //Stacking Configuration
    added_msg: 'Added Succesfully',
    UnstakingDate: 'UnStaking Date',
    MaturityDate: 'Maturity Date',
    Maturity_Amount: 'Maturity Amount',

    //For My Wallet Module
    MyWallets: 'Minhas carteiras',
    WalletUserList: 'Usuários de carteira',
    UserName: 'Nome de usuário',
    RoleName: 'Role Name',
    AddNewUser: 'Adicionar Novo usuário',
    EmailAddress: 'Endereço de e-mail',
    InviteMessage: 'Convidar Mensagem',
    RolesData: [
        { value: 'Admin', },
        { value: 'Gastador', },
        { value: 'Visualizador', },
    ],
    PendingRequests: 'Solicitações de carteira pendentes',
    JoinMessage: 'has Invite you to join as',
    wallet: 'Carteira',
    WalletName: 'Carteira',
    selectRoleMsg: 'Selecione o papel',
    User: 'Usuário',
    OutBounded: 'OutBounded',
    InBound: 'InBound',

    // Trading Summary
    TradingSummary: 'Resumo de Negociação',
    TradingSummaryDetail: 'Detalhe do Resumo de Negociação',
    transactionNo: 'Transação Não',

    startEndTimeValidation: 'A hora de início deve ser menor que o horário de término',

    //social profile leader list
    noOfFollwerFollow: 'Não De Seguidor Seguir',
    profile: 'Perfil',
    leaders: 'Líderes',
    follow: 'Siga todos',
    unFollow: 'deixar de seguir',

    // for tell a friend
    TellAFriend: 'Diga à um amigo',
    TaptoCopy: 'Toque para Copiar',
    ClicktoShare: 'Clique para compartilhar',
    CopiedtoClipboard: 'Copiado para a área de transferência!',
    copy_link: 'Link de cópia',
    Twitter: 'Twitter',
    Whatsapp: 'Whatsapp',
    google_plus: 'Google +',
    Pinterest: 'Pinterest',
    Resend: 'Reenviar',
    DeductionAmount: 'Quantia de Dedução',

    //For List Empty View
    Empty_List_Link_Msg: 'Por que não {module} agora?',

    Choose_Coin: 'Escolha moedas',

    //Login noraml screen
    joinCooldex: 'Junte-se ao Cooldex!',

    //for Deposit
    Important_Message: 'Não deposite nenhum outro ativo digital no endereço acima. Ele deve ser usado APENAS com o {Name} e, se usado incorretamente, você poderá perder seus ativos permanentemente.' + '\n\n' + 'O depósito no endereço acima requer confirmação de toda a rede, de modo que estará disponível após 15 confirmações e estará disponível para retirada após 30 confirmações.' + '\n\n' + 'Nosso valor de depósito mínimo: {MinAmount} {Coin} Qualquer depósito inferior ao mínimo não será creditado ou reembolsado.' + '\n\n' + 'O seu endereço de depósito só será alterado quando previamente notificado por anúncio e e-mail, pelo que provavelmente não será alterado.' + '\n\n' + 'Mantenha seu computador e dispositivos seguros e lembre-se sempre de proteger todas as suas informações.',
    SaveQRCode: 'Salvar o código QR',

    //For Withdraw
    Confirm: 'confirme',
    Important_Message_Withdraw: 'Quantidade mínima de retirada: {MinAmount} {Coin}.' + '\n\n' + 'Para garantir que seus fundos sejam seguros, sua solicitação de saque será revisada manualmente caso sejam feitas alterações em sua estratégia de segurança ou senha nas últimas 24 horas. Aguarde até que um de nossos funcionários ligue para você ou envie um e-mail de confirmação.' + '\n\n' + 'Mantenha seu computador e dispositivos seguros e lembre-se sempre de proteger todas as suas informações.',
    Withdraw_Address: 'Retirar Endereço',
    Available: 'acessível',

    // loan and loan history
    Loan: 'Empréstimo',
    BTC: 'BTC',
    USDT: 'USDT',
    Loaned: 'Emprestado',
    Rate: 'Taxa',

    //for Funds screen
    higher: 'Superior',
    lower: 'Mais baixo',
    invested: 'Investido',

    //for my point cards screen
    on_orders: 'Em pedidos',
    transfer: 'Transferir',

    //CMS Tell A Friend New
    howDoesItWork: 'Como funciona?',
    inviteFriends: 'Convide amigos',
    yourInvitationCode: 'Seu código de convite',
    copyCode: 'Copiar Código',
    ShareApp: 'Compartilhe o aplicativo',

    // Transfer Screen
    Fiat: 'Fiat',

    // Fiat
    Margin: 'Margem',

    // for front Survey
    Survey: 'pesquisar',
    SurveyResults: 'Resultados da pesquisa',
    Option: 'Opção',
    TotalAnswer: 'Resposta Total',

    // HelpCenter Front
    HelpCenter: 'Centro de ajuda',

    // for margin screen 
    Hide_small_balances: 'Esconder o pequeno equilíbrio',
    Search: 'Procurar',
    Estimated: 'Estimado',
    Estimated_Net_Value: 'Valor líquido estimado (BTC)',

    // for Exchange Screen
    Estimated_Total_Value: 'Valor Total Estimado (BTC)',
    Estimated_Value: 'Estimado (USD)',
    orderManagement: 'Gerenciamento de pedidos',
    services: 'Serviços',
    fiatDetail: 'Buy digital assets with fiat money.',
    index: 'Índice',
    indexDetail: 'The weather vane of digital assets',
    fundDetail: 'An autonomous index product',
    marginDetail: 'An investimento that is several times the amount of your original fund.',
    learnMore: 'Saber mais',

    //for new coins dashboard
    new_coins: 'Novas moedas',

    //for market search 
    selectedCurrency: 'Moeda Selecionada',

    // for fiat screen
    PaymentMethod: 'Método de pagamento',
    BUY: 'COMPRAR',
    SELL: 'VENDER',

    //For Wallet Sharing
    WalletSharing: 'Compartilhamento de carteira',

    // for modal google Auth
    paste: 'Colar',
    code: 'Código',
    lostYourAuthenticator: 'Perdeu seu autenticador',
    contactToSupport: 'Por favor entre em contato com o atendimento ao cliente: support@cooldex.pro',
    googleAuthenticationCode: 'Código de Autenticação do Google',
    vertical: 'Vertical',

    //for Survey
    feature_survey: 'Característico Pesquisa',
    coin_list_survey: 'Lista de Moedas Pesquisa',
    feedback_survey: 'Comentários Pesquisa',
    long: 'Longo',
    short: 'Baixo',
    riskRate: 'Taxa de Risco',
    liquidationPrice: 'Preço de Liquidação',
    riskRateTitle: 'O que significa Taxa de Risco?',
    riskRateDetail1: 'Se a sua conta de margem atingir uma taxa de risco muito alta, ela será fechada automaticamente.',
    riskRateDetail2: 'Atualmente, seu limite é de 110%, então tenha cuidado para ficar longe disso!',
    riskRateButton: 'entendi',

    //social Profile Follower List
    followerList: 'Lista de seguidores',
    tradeType: 'Tipo de comércio',
    mirror: 'Espelho',

    //for Affiliate SignUp
    scheme_type: 'Esquema Tipo',
    select_scheme_type: 'Selecione o tipo de esquema',
    notConfirm: 'Não confirme',

    // for Affiliate Dashboard
    affiliate: 'Afiliado',
    sendMails: 'Enviar mails',
    sendSMS: 'Enviar SMS',
    shareOnFacebook: 'Link Compartilhar no Facebook',
    shareOnTwitter: 'Link Compartilhar no Twitter',
    totalSignUp: 'Inscrição total',
    affiliateLink: 'Clique no link afiliado',
    commissionReport: 'Relatório da Comissão',

    //social Profile My Watch List
    myWatchList: 'Minha lista de observação',
    leaderName: 'Nome do Líder',
    groupName: 'Nome do grupo',

    //For Leader Board List 
    LeaderBoard: 'Líder Placa',
    LeaderName: 'Nome do Líder',
    TopLeaderList: 'Lista Top 25 Líder',
    profitLossSmall: 'P/L',
    Qty: 'Qty',

    //affiliate commission type
    commission_pattern: 'Comissão Padrão',
    commission_count_on: 'Comissão Contagem Em',

    //social profile portfolio
    portfolio: 'Portfólio',
    bothDateRequired: 'Ambas as datas são necessárias a partir da data e até a data',
    orderType: 'OrderType',
    portfolioDetail: 'Detalhe da Carteira',
    yourPrice: 'Seu preço',
    isCencel: 'É Cancelar',
    no: 'Não',

    //for referral program
    your_commission_rate: 'Sua taxa de comissão',
    referral_friends: 'Referência Amigos',
    enstimated_commission_value: 'Enstimado Comissão Valor',
    program_details: 'Programa Detalhes',
    important_notice: 'Importante Aviso prévio',

    //affiliate click on link report
    send: 'Mandar',
    clickOnLinkReport: 'Clique no Relatório de Link',
    failure: 'Falha',
    level: 'Nível',
    commissionReportDetail: 'Detalhe do relatório da comissão',
    commission: 'Comissão',
    earning: 'Ganhando',
    buyTrade: 'Buy-Trade',
    sellTrade: 'Sell-Trade',

    //For send email report
    sendMailReport: 'Enviar relatório de email',
    createdDate: 'data criada',
    sendSmsReport: 'Enviar relatório por SMS',
    facebookShareReport: 'Facebook Share Report',
    twitterShareReport: 'Relatório de compartilhamento do Twitter',
    signupReport: 'Relatório de inscrição total',
    dashboard: 'painel de instrumentos',

    myProfile: 'Meu perfil',
    emailMobile: 'ID de e-mail / número de celular',
    enterEmailorMobile: 'Por favor insira o ID do E-mail / Celular',
    sendOTP: 'Enviar OTP',

    // for Margin Wallet Ledger
    ledger_id: 'Ledger Id',
    crAmount: 'Quantidade de crédito',
    drAmount: 'Montante de Débito',
    margin: 'Margem',
    marginWalletLedger: 'Margin Wallet Ledger',

    TrnId: 'Trnid',
    UnStaking_Type: 'Tipo de retirada',
    Full: 'Cheio',
    Partial: 'Parcial',

    // For Margin wallets 
    MarginWallets: 'Margem Carteiras',
    SafetyWallets: 'Segurança Carteiras',
    ProfitWallets: 'Lucro Carteiras',
    WalletUsageType: 'Wallet Usage Type',
    OutBoundBalance: 'Out Bound Balance',
    InBoundBalance: 'In Bound Balance',
    Role: 'Função',
    ExpiryOn: 'Expiração em',

    // for refere and Earn (referal data usercount)
    invites: 'Convites',
    clicks: 'Cliques',
    participant: 'Participante',
    converts: 'Converts',
    sms: 'SMS',
    Facebook: 'Facebook',
    messenger: 'Mensageiro',
    linkedin: 'Linkedin',
    telegram: 'Telegrama',

    AddNewAddress: 'Adicionar novo endereço',

    //For Create Margin Wallet and Confirmation
    CreateMarginWallet: 'Criar carteira de margem',
    AddLeverage: 'Adicionar alavancagem',
    WalletBalanaceValidation: 'Quantidade não pode Gretear Então Wallet Balance',
    ConfirmLeverage: 'Confirme a alavancagem',
    FinalCreaditAmount: 'Montante Final de Crédito',
    LeveragePer: 'Alavancagem(%)',
    ChageAmount: 'Quantidade de carga',
    SafteyMarginAmount: 'Valor da margem de segurança',

    // for API Plan
    apiPlan: 'Plano de Api',
    planValidity: 'Validade do Plano',
    concurrentIpAddressLimit: 'Limite de endereço IP simultâneo',
    historicalData: 'Data histórica',
    maxRequestSize: 'Max. Tamanho da Solicitação',
    maxResponseSize: 'Max. Tamanho da resposta',
    whiteListIpAddressLimit: 'Limite de endereço IP da lista branca',
    concurrentIpAddressAllow: 'Endereço IP simultâneo',
    subscribedSuccessfully: 'Inscrito com sucesso',
    areYouSureToSubscribe: 'Tem certeza de que deseja se inscrever?',
    paymentStatus: 'Status do pagamento',
    upgrade: 'Atualizar',
    downgrade: 'Downgrade',
    subscriptionStatus: 'Status de inscrição',
    requestedON: 'solicitada ON',
    activatedON: 'ativada em',
    autoRenew: 'Auto-renovação',
    nextRenewalOn: 'Próxima Renovação On',
    renewalStatus: 'Status de Renovação',
    validityPeriod: 'Período de validade',
    recursive: 'Recursivo?',
    ExpiryDate: 'Data de validade',
    subscriptionAmount: 'Quantidade de Subscrição',
    renewNow: 'Renove agora',
    stopAutoRenew: 'Parar Renovação Automática',
    upgradeWarning: 'Depois de atualizar / rebaixar seu plano, todas as chaves geradas e seus detalhes serão perdidos. Depois de confirmar essa ação, você precisa gerar novas chaves de API para acessar a API pública.',
    notDone: 'Não realizado',
    readOnlyApiMethods: 'Métodos somente leitura de API',
    fullAccessApiMethods: 'Métodos Api de Acesso Total',
    subscribed: 'Subscrita',
    viewMore: 'Veja mais',
    noApiPlanAvailable: 'Não há planos de API disponíveis para assinatura',
    areYouSureToUpgrade: 'Tem certeza de que deseja atualizar?',
    areYouSureToDowngrade: 'Tem certeza de que deseja fazer downgrade?',
    renewApiPlanSubscription: 'Renovar a assinatura do plano de API',
    apiPlanName: 'Nome do plano da API',
    alreadySetAutoPlan: 'Seu plano já está definido como Renovação Automática',
    areYouSureToRenewPlan: 'Tem certeza de que deseja renovar agora?',
    requested: 'Requeridas',
    areYouSureToRenewPlanWorth: 'Tem certeza de que deseja renovar o APPLlan {PlanName} no valor de {NetTotal}?',
    autoRenewSubtitle: 'Configure sua renovação automática da assinatura do plano da API',
    autoRenewBeforeExpiry: 'Auto Renovar Antes da Expiração',
    renewalDate: 'Data de renovação',
    renewPlanBefore10Day: 'Você pode renovar seu plano máximo antes de 10 dias.',
    renewPlanBefore1Day: 'Você não pode renovar seu plano antes de 1 dia.',
    areYouSureToAutoRenewalApi: 'Tem certeza de que deseja ativar a renovação automática do APIPlan {PlanName} antes de {Days} dias da data de expiração {ExpiryDate}?',
    planDesc: 'Descrição do Plano',
    stopAutoRenewSubtitle: 'Parar Renovação Automática da sua assinatura do plano de API',
    nextRenewalDate: 'Próxima data de renovação',
    areYouSureToStopApiPlan: 'Tem certeza de que deseja interromper a renovação automática do APIPlan {PlanName}? Se você interromper sua renovação automática, ela expirará em {RenewalDate} e não será mais renovada automaticamente. Não se preocupe, seu acesso com este APIPlan continuará até esta data.',
    stopApiSuccessfully: 'Plano de API definido Parar Renovação Automática com Sucesso.',
    renewApiSuccessfully: 'Plano de API Renovar com Sucesso.',
    autoRenewApiSuccessfully: 'Plano de API Definir Renovação Automática com Sucesso.',
    setCustomLimits: 'Definir limites personalizados',
    customLimits: 'Limites Personalizados',
    customLimitsDesc: 'Defina limites personalizados para o plano de chaves de API pública adquirido. O limite personalizado será aplicado para a acessibilidade da chave de API pública gerada.',
    maxRecInRequest: 'Max. Registros no pedido',
    enterMaxCallPerDay: 'Digite max. chamadas por dia',
    enterMaxCallPerMin: 'Digite max. chamadas por minuto',
    enterMaxCallPerMonth: 'Digite max. chamadas por mês',
    enterMaxOrderPerSecond: 'Digite max. encomenda colocada por segundo',
    enterMaxRecInRequest: 'Digite max. Registros no pedido',
    enterWhiteListIpAddressLimit: 'Insira o limite de endereços IP da lista branca',
    enterConcurrentIpAddressAllow: 'Digite o endereço IP simultâneo permitido',
    enterMaxRequestSize: 'Digite o valor máximo Tamanho da Solicitação',
    enterMaxResponseSize: 'Digite o valor máximo Tamanho da resposta',
    enterHistoricalData: 'Inserir dados históricos',
    setAsDefault: 'Definir como padrão',
    editCustomLimits: 'Editar limites personalizados',
    customLimitAddedSuccessfully: 'Limite personalizado da chave da API adicionado com êxito.',
    customLimitUpdatedSuccessfully: 'Limite personalizado da chave da API atualizado com êxito.',
    setDefaultSuccessfully: 'Definir limite personalizado padrão com êxito',
    customLimitAlert: 'Isso limpará todos os limites anteriores do conjunto personalizado (se houver) e aplicará os limites padrão de acordo com o plano adquirido. Tem certeza de que deseja definir limites como padrão?',
    upgradedSuccessfully: 'Plano atualizado com sucesso',
    downgradSuccessfully: 'Plano desatualizado com sucesso',
    expire: 'Expirar',
    enterDays: 'Insira os dias',
    maxCallDay: 'Max.calls / dia',
    maxCallMin: 'Max.Calls / min',
    maxCallMonth: 'Max.Calls / mês',
    maxOrderPlacedSec: 'Máximo de pedidos por segundo',
    planDetail: 'Detalhe do Plano',
    subscription: 'Inscrição',
    apiMethods: 'Métodos da API',
    expireOn: 'Expira em',
    renewCycle: 'Renovar o Ciclo',
    renew: 'Renovar',
    readOnly: 'Somente leitura',
    fullAccess: 'Acesso total',
    apiLimits: 'Limites da API',
    changePlan: 'Plano de Mudança',
    notSubscribed: 'Não inscrito',
    yourPlanAlreadySubscribe: 'Seu plano de api já está inscrito',
    noApiMethodRequested: 'Nenhum método de API solicitado',
    follwerLimit: 'Configure o número de seguidores entre {minValue} e {maxValue} de definir por admin.',
    follwerLimitShortMsg: 'Definir seguidor entre {minValue} para {maxValue}',

    LeverageReport: 'Relatório de alavancagem',
    FromWallet: 'Da carteira',
    ToWallet: 'Para carteira',
    LeverageAmount: 'Quantidade de alavancagem',
    ChargeAmount: 'Quantidade de carga',
    MarginAmount: 'Valor da Margem',
    CreditAmount: 'Quantidade de crédito',

    // For referral data
    referralInviteEmail: 'E-mail de convite de referência',
    referralInviteSms: 'Convite de referência SMS',
    referUserName: 'Referir nome de usuário',
    referralParticipant: 'Participante de referência',
    receiverUsername: 'Nome de Usuário do Receptor',
    referralInvite: 'Convite de referência',
    clickOnReferralLink: 'Clique no link de referência',
    reward: 'Recompensa',
    userName: 'Nome de usuário',
    ChannelType: 'Tipo de canal',
    PayType: 'Tipo de pagamento',
    Receiver: 'Receptor',
    ServiceSlab: 'Laje de serviço',
    invite: 'Convite',

    // for generate api key
    alias_name: 'Alias Nome',
    generate_api_key: 'Gerar API Chave',
    generate_now: 'Gerar Now',
    plan_name: 'Plano Nome',
    note_text: 'Nota',
    view_rights: 'Visão Direitos',
    admin_rights: 'Admin Direitos',
    api_permission: 'API permissão',
    add_apikey_Note: 'A permissão de API não pode ser atualizada depois que a chave pública é gerada. Por favor, certifique-se de que você forneceu os direitos de acesso corretos.',

    //apikey
    apiAccess: 'Acesso Api',
    viewOnly: 'Visualizar apenas',
    adminOnly: 'Apenas Administrador',
    ipAccess: 'Acesso IP',
    restrictedAccess: 'Acesso restrito',
    unRestrictedAccess: 'Acesso irrestrito',
    inProcess: 'Em processo',
    viewPublicApiKey: 'Exibir chave de API pública',
    totalApiKeys: 'Total de chaves de API',
    allowedAccess: 'Acesso permitido',
    restrictAccessToWhitelist: 'Restringir o acesso à somente IP da lista de permissões (recomendado)',
    unrestrictedAccess: 'Acesso não restrito (menos seguro)',
    securityApiKeyWarningNote: "Guarde suas chaves em algum lugar seguro. Enquanto isso, devido a motivos de segurança, lembre-se de não compartilhar chaves geradas para todos. Se, em qualquer caso, as chaves da API forem perdidas, não será recuperável",
    securityWhitelistWarningNote: 'Depois de optar por Restringir o Acesso, não é possível Descompactá-lo novamente.Uma vez que a lista de endereços IP na lista de permissões for configurada com êxito, ela não poderá ser atualizada ou excluída ou nenhum novo IP poderá ser adicionado. Por favor, verifique se você colocou na lista de permissões o IPAddress preciso.',
    totalLimits: 'Limites totais',
    currentIPAddress: 'Endereço IP atual',
    whitelistedIPAddress: 'Endereço IP na lista de desbloqueio',
    apiKeyDeleteNote: 'Depois que você excluir essa chave de API pública, o acesso será revogado imediatamente e todos os serviços relacionados a essa chave de API pública serão descontinuados permanentemente. Tem certeza de que deseja excluir esta chave de API pública?',
    deleteApiKey: 'Excluir a chave APi',
    enter_proper: 'Digite Proper',

    // margin Trading History
    marginTradingHistory: 'Histórico de Negociação de Margem',

    // Affiliate
    parentUser: 'Usuário pai',
    parentUserName: 'Nome de usuário pai',
    parentEmail: 'E-mail dos pais',
    parentMobile: 'Pai Móvel',
    userEmail: 'E-mail do usuário',

    depth: 'Profundidade',

    //add api key succes screen
    securitySuccesScreenNote: 'Armazene sua chave de API em algum lugar seguro. Não será mostrado novamente',
    api_key_generate_success_message: 'A chave da API foi gerada',
    update_button_security_message: 'Depois de clicar no botão de atualização, as configurações serão congeladas e nenhuma alteração poderá ser feita nessas configurações. por favor confirme os ipaddresses uma vez. Tem certeza de que deseja atualizar as configurações?',

    //for add whitelisted ip
    whitelist_ip_address: 'WhiteList IP Endereço',
    your_current_ip_address: 'Seu Atual IP Endereço',
    unique_alias_name: 'Único Alias Nome',
    add_whitelist_ip_security_message: 'Isso restringirá o Acesso à Chave Pública ao Somente Endereço IP da Lista de Permissões. Tem certeza de que deseja colocar esse endereço IP na lista de permissões?',
    whitelist_ip: 'WhiteList IP',
    concurrent_ip: 'Concorrente IP',
    ip_type: 'IP Tipo',

    // for Discover Screen
    AD: 'DE ANÚNCIOS',
    LatestTrends: 'Últimas tendências',
    ExplorebyCategory: 'Explorar por categoria',
    Discover: 'Discover',

    Active: 'Active',
    Inactive: 'InAtiva',

    coins: 'Moedas',
    helpAndSupport: 'Ajuda e suporte',

    // Referral messages 
    invited: 'Convidamos',
    via: 'via',
    referralMessage: 'Referindo-se a você como gostei do aplicativo.',

    // Affiliate Screen
    affiliateAnalytics: 'Analytics afiliado',
    monthlyAverageEarning: 'Ganho Médio Mensal',
    statistics: 'Estatisticas',
    earnings: 'Ganhos',
    saleAmt: 'Venda Amt',
    commi: 'Commi.',
    from: 'De',
    to: 'Para',
    emailLinkInvite: 'Link de afiliado enviado via e-mail',
    smsLinkInvite: 'Link de afiliado enviado via SMS',
    twitterLinkInvite: 'Link de afiliado enviado via Twitter',
    facebookLinkInvite: 'Link de afiliado enviado via Facebook',
    affiliateLinkInvite: 'Enviado via link',
    earnedBy: 'Ganha por',
    scheme: 'Esquema',

    enter: 'Entrar',
    select: 'Selecione',

    //Detail Screen
    TransactionDetail: 'Detalhes da transação',
    TransactionAmount: 'Montante de Transação',

    //Languages
    languageTitle: 'Escolha o idioma',
    languageSubtitle: 'Toque para escolher o seu idioma preferido',
    continue: 'Continuar',

    levAmount: 'Lev.Amount',
    lev: 'Lev',
    currentIp: 'IP ATUAL',
    concurrent: 'Concorrente',

    // referral program
    referralProgram: 'Programa de referência',
    referEarnReward: 'Indique e ganhe recompensas !',
    referralAnalytics: 'Referral Analytics',
    inviteViaEmailSMS: 'Convidar via e-mail ou SMS',
    referrals: 'Referências',
    share: 'Compartilhar',
    count: 'Contagem',

    keys: 'Chaves',
    key: 'Chave',
    secret: 'Segredo',
    access: 'ACESSO',
    api: 'API',
    view: 'Visão',

    //fees
    fees: 'Honorários',
    feesForTrading: 'Taxas para negociação',
    chargeCurrency: 'Moeda de cobrança',
    feeForDeposit: 'Taxa para depósito',
    feeForWithDrawal: 'Taxa para retirada',
    free: 'Livre',
    withdrwalKeyNote: 'Vamos ajustar as taxas de retirada de acordo com as condições Blockchain regularmente',
    stl_qty: 'Stl.Qty',

    invalidAddress: 'Endereço inválido',
    invalidAmount: 'Monto invalido',

    agree: 'Aceita',
    Are_you_sure: 'Você tem certeza?',
    withdrawMailMsg: 'Depois de enviar sua solicitação de retirada. nós enviaremos um email de confirmação. \n\nDepois de fazer uma retirada, você pode acompanhar seu progresso na página do histórico.',

    bought: 'COMPROU',
    sold: 'VENDIDO',
    cir_Supply: 'Cir.Supply',
    qrcode: 'Código QR',
    requestDetailsMessage: 'Por favor, insira os detalhes da solicitação. Nossa equipe de suporte responderá o mais breve possível.',
    subscribePlan: 'Subscreva o plano',

    // Add Currency Logo 
    CoinConfiguration: 'Configuração de moedas',
    coinConfigurationImage: 'Carregar imagem de moeda',
    Image_Validation: 'Por favor, envie o logotipo da moeda',

    //commission Report
    trnRefno: 'Trn RefNo',
    affliateUserId: 'UserId de afiliado',
    schemeMappingId: 'ID do SchemeMapping',
    trnAmount: 'Quantidade Trn',
    cronRefNo: 'Cron RefNo',
    fromAcWalletId: 'De Ac WalletId',
    toAcWalletId: 'Para o Google WalletId',
    affiliateUserName: 'Nome de usuário afiliado',
    affliateEmail: 'E-mail de afiliado',
    schemeMapping: 'Mapeamento de esquema',
    trnUserId: 'Trn UserID',
    trnUserName: 'Trn UserName',
    trnEmail: 'Trn Email',
    trnWalletTypeId: 'Trn WalletTypeID',
    sec: 'Sec.',
    affliateUser: 'Usuário afiliado',

    // Cancel Orders
    cancelOrder: 'Cancelar pedido',
    cancelAllMessage: 'Isso cancelará todos os seus pedidos de uma só vez. Tem certeza de que deseja cancelar todos os pedidos?',
    cancelMessage: 'Isso cancelará todos os seus {type} pedidos de uma só vez. Tem certeza de que deseja cancelar todos os {type} pedidos?',
    cancelSingleOrder: 'Tem certeza de que deseja cancelar este pedido?',
    ordersNotAvailable: 'Pedidos não disponíveis',
    cancelAllOrders: 'Cancelar todos os pedidos',
    cancelLimitsOrders: 'Cancelar pedidos de limite',
    cancelMarketsOrders: 'Cancelar ordens de mercado',
    cancelStopLimitsOrders: 'Cancelar pedidos de limites',

    trading: 'Negociação',

    //api key
    createdOn: 'Criado em',
    selectIPAccess: 'Selecione o acesso IP',
    apiKeyGenrated: 'Api Key Generated SuccessFully',

    deviceOs: 'SO do dispositivo',

    // for affiliate Invites friends
    affiliateLinkText: 'Link afiliado',
    enterEmailId: 'Insira o ID do email',
    emailids: 'IDs de e-mail..',
    allowMultipleEmailIdsMessage: 'Permitir vários IDs de email com (,) separados por vírgula.',
    enterMobileNos: 'Insira os números móveis',
    mobileNos: 'Números móveis..',
    allowMultipleMobileNosMessage: 'Permitir vários números de celular com (,) separados por vírgula.',
    shareOnTwittertext: 'Twitter',
    shareOnFacebooktext: 'Facebook',
    shareWith: 'Compartilhar com',
    invalidEmailId: 'ID de email inválido',
    invalidMobileNo: 'MobileNO Inválido',

    // for Margin Profit Loss Report
    marginProfitLossReport: 'Relatório de perda de lucro de margem',
    bidPrice: 'Preço de oferta',
    landingPrice: 'Preço de aterragem',
    selectPair: 'Selecione o par',

    // for Open Position Report
    openPositionReport: 'Relatório de posição aberta',

    //For Deleverage
    Deleverage: 'Desalavancagem',
    loanId: 'ID do Empréstimo',
    profitAmount: 'Lucro Montante',
    ConverttoSiteToken: 'Converter em token de site',
    SessionError: 'Erro de sessão!',
    Logout: 'Sair!',
    NetworkError: 'Erro de rede!',

    PleaseSelectType: 'Por favor selecione o tipo',
    download: 'Baixar',
    Staking_Success_Msg: 'Staking feito com sucesso.',

    licenseExpired: 'Sua LicenseKey expirou. Entre em contato com seu provedor de serviços para renová-lo.',
    trialExpire: 'Sua licença de avaliação expirou. Para continuar usando este serviço, obtenha uma licença de usuário válida.',
    notAuthorized: 'Você não tem autenticação para usar este serviço.',
    contactServiceProvider: 'Você não tem autenticação para usar este serviço. Entre em contato com o seu provedor de serviços.',
    incorrectCodeContactProvider: 'Código incorreto !!! Por favor, entre em contato com seu provedor.',
};

export default ptPT;