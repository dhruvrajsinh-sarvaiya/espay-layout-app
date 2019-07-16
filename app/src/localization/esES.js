const esES = {
    appName: "CoolDex",

    //Main Screen Bottom Menus
    homeTitle: "Casa",
    marketTitle: 'Mercados',
    tradesTitle: 'Oficios',
    Funds: 'Fondos',
    Accounts: "Cuenta",
    accountSettings: 'Configuraciones de la cuenta',

    //Splash Screen
    WelcomeTo: 'bienvenido a',
    welcome: 'Bienvenida',

    //Market Pair List
    pair: 'Par',
    vol: 'Vol',
    volume: 'Volumen',
    data: 'Datos',
    lastPrice: 'Ultimo precio',
    low: 'Bajo',
    high: 'Alto',
    twentyFourHourChange: '24h Chg%',
    favourites: 'Favoritos',
    favorite: 'Favorito',
    deposit: 'Depósito',
    withdrawal: 'Retirada',
    more: 'Más',
    bid: 'Puja',
    ask: 'Pedir',
    buy: 'Comprar',
    sell: 'Venderse',
    reports: 'Informes',
    time: 'Vez',
    price: 'Precio',
    orderhistory: 'Historial de pedidos',
    openorder: 'Orden abierta',
    orderDetail: 'Detalle de la orden',
    partialOrder: 'Orden parcial',
    hideotherpair: 'Ocultar otros pares',
    cancelall: 'Cancelar todo',
    editFavoriteTitle: 'Editar favoritos',
    done: 'Hecho',
    top: 'Cima',
    sort: 'Ordenar',
    order: 'orden',
    openOrder: 'Ordenes abiertas',
    type: 'Tipo',
    fee: 'Honorarios',
    txnDate: 'Txn fecha',
    tradedetail: 'Detalle el Comercio',
    sides: [{ value: 'Defecto' }, { value: 'Vender Orden' }, { value: 'Órdenes de compra' }],
    decimals: [{ value: '3 Decimales' }, { value: '4 Decimales' }, { value: '5 Decimales' }, { value: '6 Decimales' }],
    marketPrice: 'Precio de mercado',
    optimalMarketPrice: 'Precio de mercado óptimo',
    stop: 'Parar',
    limit: 'Límite',
    market: 'Mercado',
    stopLimit: 'Stop-limit',
    spot: 'Lugar',
    equivalent: 'Equivalente',
    total: 'Total',
    available: 'Avbl',

    creditWalletMessage: "El monedero de crédito está desactivado o no está configurado",
    debitwalletMessage: "La cartera de débito está deshabilitada o no está configurada",

    marketTrades: 'Comercio Mercado',
    name: 'Nombre',
    // tradeDetailGraphTabNames: ['Línea', 'Profundidad'],
    tradeDetailGraphTabNames: ['Línea'],
    tradeDetailTabNames: ['Libro', 'Comercio Mercado'],
    digits: [
        { value: '8', },
        { value: '7', },
        { value: '6' },
        { value: '5' },
    ],
    lineChartTypes: [
        { value: 'Línea' }, { value: '1m' }, { value: '5m' }, { value: '15m' }, { value: '30m' },
        { value: '1H' }, { value: '2H' }, { value: '4H' }, { value: '6H' }, { value: '12H' },
        { value: '1D' }, { value: '2W' }, { value: '4M' },
    ],
    userid: 'Usuario ID',
    currencyPair: 'Par de Divisas',
    select_type: 'Seleccione Tipo',
    select_status: 'Seleccione Estado',
    on: 'En',
    off: 'Apagado',
    charts: 'Cartas',
    summary: 'Resumen',
    currentRate: 'Tasa actual',
    high24h: '24h de altura',
    low24h: '24h baja',
    orders: 'Pedidos',
    orderCreated: 'Orden creada',
    settled_on: 'Ubicado en',

    //Top Gainer & Loser
    topGainerLoser: 'Los mejores ganadores y perdedores',
    topGainer: 'Ganador Superior',
    topLoser: 'Perdedor Superior',
    changePer: 'ChangePer',
    changePercentage: 'Porcentaje de cambio',
    changeValue: 'Valor de cambio',
    selectOrderType: 'Seleccione el tipo de orden',
    vol_24h: '24H Vol',
    h: 'H',
    l: 'L',

    //Market Search List
    searchHere2: 'Por favor ingrese palabras clave',
    cancel: 'Cancelar',

    //Transaction Charge
    all: 'Todas',
    selectCurrency: 'Seleccione Moneda',

    submit: "Enviar",
    Username: "Nombre de usuario",
    Password: "Contraseña",
    RememberMe: "Recuérdame",
    Withdrawal: "Retirada",
    Please_Select: 'Por favor Seleccione',
    Initialize: 'Inicializar',
    historyStatusList: [
        { value: 'Por favor Seleccione', code: -1 },
        { value: 'Inicializar', code: 0 },
        { value: 'Éxito', code: 1 },
        { value: 'Fracasado', code: 3 },
        { value: 'Pendiente', code: 6 },
        { value: 'Rechazado', code: 9 },
    ],
    OperatorFail: 'OperatorFail',
    SystemFail: 'SystemFail',
    Hold: 'Sostener',
    Refunded: 'Reintegrado',
    Pending: 'Pendiente',
    Rejected: 'Rechazado',
    txnid: "TxnID",

    searchHere: 'Busca aquí...',
    noRecordsFound: 'No hay registros todavía',
    noChartDataFound: 'No se han encontrado datos gráficos',

    //For Withdraw History Module
    Withdraw_History: "Retira historia",
    Coin: "Acuñar",
    Amount: "importe",
    Date: "Fecha",
    Information: "Información",
    Status: "Estatus",
    Address: "Dirección",
    Loading: "Cargando..",

    //Withdraw Request Validation
    Select_Coin: "Seleccionar Acuñar",
    Select_Wallet: "Seleccionar billetera",
    ScanQRCode: 'Por favor escanee el código QR.',
    Select_Source_Address: "Seleccionar direccion",
    Enter_Address: "Ingresa direccion",
    Enter_Withdraw_Amount: "Ingresar cantidad retirada",
    Enter_Lable: 'Introducir etiqueta',
    WhiteList_Store: 'Lista blanca y tienda',
    WDMaxWithdraw: 'La cantidad debe ser mayor que el retiro mínimo',
    WDMinWithdraw: 'La cantidad debe ser menor que el máximo retirado',
    Mini_Withdrawal: 'Retiro mínimo',
    Max_Withdrawal: 'Retiro máximo',
    Withdraw_Limit_Msg: 'No se retire directamente a un crowdfound o IOC. No acreditaremos tokens de su cuenta desde esa caja fuerte.',
    WDLessthenBalance: 'La cantidad debe ser menor que el saldo disponible',
    WDLessthenLimit: 'La cantidad debe ser inferior al límite de retiro diario',

    //From Constant Utils Content
    SERVER_ERROR_MSG: "O servidor está temporariamente impossibilitado de processar sua solicitação. Tente depois.",
    NETWORK_MESSAGE: "Não conectado à Internet. Por favor, verifique a conectividade com a Internet.",
    SLOW_INTERNET: "Sua conexão com a internet pode ser lenta. Por favor, conecte-se a conexão de internet funcionando.",
    SESSION_EXPIRE: "La sesión ha caducado.",

    //For Deposit
    Copy_Address: "Copiar dirección",
    Copy_SuccessFul: "Copia exitosa",
    Generate_NewAddres: "Generar nueva dirección",
    DepositHistory: "Historial de Depósitos",
    Ava_Bal: "Saldo disponible",
    Limit: "Límite",
    Deposits: "Depositar",
    copy: 'Dupdo',
    Info: 'Info',

    //cms screens title
    policy: 'Póliza',
    Privacy_Policy: "Política de privacidad",
    AML_Policy: "Política ALD",
    Refund_Policy: "Politica de reembolso",
    About_Us: "Sobre nosotros",
    Contact_Us: "Contáctenos",
    News_Section: "Noticias",
    myAccount: "Mi cuenta",
    Terms_Condition: "Términos & Condiciones",
    Support: "Apoyar",
    Settings: "Settings",
    Security: "Seguridad",
    RefereAndEarn: "Referir & Ganar",
    Announcement: "Announcement",
    Sitemap: "Sitemap",
    faq: "FAQs",
    list_coin: "Moneda de lista",
    fees_charges: "Honorarios y cargos",
    coin_info: "Moneda Info",
    create: 'Crear',
    apiKey: 'Clave API',
    secretKey: 'Llave secreta',
    TERMCONDITION: "Términos y Condiciones",
    Reply_Complain: "Responder Queja",
    Raise_Complain: "elevar Queja",
    Upload: 'Subir',
    raiseComplainSuccessfully: 'Su queja planteada con éxito',

    //For Transfer In History
    TransferInHistory: "TransferIn historia",
    TransferInHistoryDetail: "TransferIn historia Detalles",
    TransferInOutStatusSuccess: "Éxito",
    TxnID: "TxnID",
    AccountNo: "CuentaNo",
    Order_id: "Identificación de la Orden",
    Member_code: "Código de miembro",
    Confirmations: "Confirmaciones",
    Conf: 'Conf.',

    //For Transfer Out History
    TransferoutHistory: "TransferOut historia",
    TransferoutHistoryDetail: "TransferOut historia Detalles",
    Trn_No: "Trn No",
    Pre_Bal: "Pre Bal",
    Post_Bal: "Post Bal",
    Trn_Date: "trn Fecha",
    Result_DateTime: "Fecha de resultado",
    Txn_Amount: "TXN CANTIDAD",
    Balance: "Equilibrar",
    Balances: "Saldos",

    //For Transaction History
    history: "Historia",

    //For From Date And ToDate Validation
    date_selection: "Seleccione fecha",
    dateGreterValidation: "Desde Fecha no puede ser mayor que a Fecha",
    dateDaysValidation: "No se puede ver el informe de más de 10 días.",
    Show_ButtonText: "Show",
    From_Date: "Desde Fecha",
    To_Date: "A par fecha",

    //For Token Convert
    SiteTokenConversion: "Conversión de token de sitio",
    TotalAmount: "Total Importe",
    Enter_Amount: "Introducirse Importe",
    SiteTokenHistory: "Sitio Token Historial",
    From_Address: "A partir de Dirección",
    Price: "Precio",
    Total: "Total",
    ConverToSiteToken: 'Convertir A Tokens del Sitio',
    ConvertToToken: 'Convertir A Token',
    TokenValue: 'Token Value',
    selectToken: 'Seleccionar Token',
    Details: 'Detalles',
    Tokens: 'Tokens',
    NetTotal: 'Total neto',
    Receive: 'Usted recibirá',
    Min_Limit_Conversion: 'Límite Mínimo',
    Max_Limit_Conversion: 'Límite Máximo',
    Balance_Validation: 'Usted don\'t tiene suficiente Equilibrio',
    Token_Calculation_Validation: 'Por Favor realice el cálculo',
    Min_Token_Validation: 'You can not convert Token Less Then Minimum Limit.',
    Max_Token_Validation: 'No puedes convertir un Token mayor que el límite máximo.',
    Target_Currency: 'Divisas de Objetivo',
    SourceQuantity: 'Fuente cantidad',
    TargetQuantity: 'objetivo Cantidad',
    SourceToPrice: 'Fuente a Precio',
    TargetToPrice: 'Objetivo a precio',
    TokenPrice: 'Token Precio',
    convertTokenMinLimit: 'Tienes que convertir el mínimo {Param1} Fichas.',
    convertTokenMaxLimit: 'Puedes convertir maximo {Param2} Fichas.',
    amountTokenValidation: 'Por favor ingrese el token o la cantidad',
    sameCurrencyValidation: 'No puedes seleccionar la misma moneda',

    //For Limit Control
    LimitControl: "Limits Control",
    LimitNotice1: "Administrar cada hora, diario y / o transacción",
    LimitNotice2: "Límites para esta billetera. Las transacciones sobre un límite especificado requieren la aprobación del administrador. Para cambiar estos límites, contacta con soporte.",
    LimitPerHour: "Límite por hora",
    LimitPerDay: "Limite por dia",
    LimitPerTrn: "Límite por transacción",
    Save: "Salvar",
    LimitPerHourValidation: "Ingrese límite por hora",
    LimitPerDayValidation: "Ingrese límite por día",
    LimitPerTrnValidation: "Ingrese límite por transacción",
    LifeTimeLimitValidation: "Introduzca el límite de tiempo de vida",
    StartTimeValidation: "Introduzca la hora de inicio",
    EndTimeValidation: "Introduzca la hora de finalización",
    TradingLimits: "Comercio",
    WithdrawLimits: "Retirar",
    DepositLimits: "Deposita",
    APICallLimits: "APICall",
    LifeTimeLimit: 'Límite de tiempo de vida',
    StartTime: 'Hora de inicio',
    EndTime: 'Hora de finalización',

    //For Token Stacking
    Token_Stack: "Token Stacking",
    Marker: "Marcador",
    Taker: "Tomador",
    Select_Type: "Seleccione tipo",
    TokenStacking_History: "Token Stacking History",
    Type: "Tipo",
    Marker_Charges: "Cargos de marcador",
    Taker_Charges: "Taker Cargos",
    Charges: "cargos(%)",
    Selected: "Seleccionado",

    //For Address Whitelisting For Withdrawal
    Add_Withdrawal_Address: "Añadir dirección de retirada",
    Label: "Etiqueta",
    Add_WhiteList: "Añadir a blanca lista",
    Enter_Label: "Introducir etiqueta",
    Label_Excced_Limit: "La etiqueta no debe exceder los 20 caracteres.",
    TurnON_Whitelist_Function: "Por favor, active primero la función de retirada de la lista blanca",
    WhiteList_ON: "Whitelist ON",
    WhiteList_OFF: "Whitelist OFF",
    Whitelist_Address_History: "Historial de direcciones de la lista blanca",
    Remove_Whitelist: "Eliminar de lista blanca",
    Delete: "Borrar",
    Whitelisted_Record: "Mostrar solo las direcciones en lista blanca",
    WhiteListed: "Whitelisted",

    //for Listing coin
    coinList: 'Lista de monedas',

    //for sign up screen / register
    Email: 'Email',
    Confirm_Password: 'Confirmar contraseña',
    Confirm_Email: 'Confirmar correo electrónico',
    Login: 'Iniciar sesión',
    Register: 'Registro',
    reset_google_title: 'Restablecer la autenticación de Google',
    reset_sms_title: 'Restablecer autenticación de SMS',

    google_auth_reset_msg: 'Si anteriormente había guardado su clave de recuperación de 16 dígitos para Google Authenticator cuando lo configuró por primera vez en su teléfono, puede usar esta clave de recuperación para restaurar rápidamente su aplicación Google Authenticator, sin tener que restablecer manualmente su Google Authenticator.',

    google_auth_option1_msg: 'El reinicio hará que su cuenta pierda la protección de Google Authenticator. Para evitar la pérdida de activos, asegúrese de que su correo electrónico y contraseña de inicio de sesión sean seguros, y vuelva a enlazar Google Authenticator inmediatamente después de que el restablecimiento sea exitoso.',

    google_auth_option2_msg: 'El restablecimiento de su Google Authenticator es muy manual y, a menudo, lleva más de dos días. Tenga en cuenta que sus retiros se desactivarán durante 48 horas después de que se produzca el restablecimiento.',

    google_confirmation_msg: 'Te enviamos un correo electrónico de confirmación. Por favor, siga las instrucciones para restablecer la verificación de Google.',

    sms_auth_reset_msg: 'If your phone number is still able to receive the SMS verification code, you can disable the phone number at the accounts Two-factor Authentication without resetting.',

    sms_auth_option1_msg: 'El reinicio hará que su cuenta pierda la protección del Autenticador de SMS. Para evitar la pérdida de activos, asegúrese de que su correo electrónico y contraseña de inicio de sesión sean seguros, y vuelva a enlazar el Autenticador de SMS inmediatamente después de que el restablecimiento sea exitoso.',

    sms_auth_option2_msg: 'El restablecimiento de su SMS Authenticator es muy manual y, a menudo, demora dos días. Tenga en cuenta que sus retiros se desactivarán durante 48 horas después de que se produzca el restablecimiento.',

    sms_confirmation_msg: 'Te enviamos un correo electrónico de confirmación. Por favor, siga las instrucciones para restablecer la verificación de SMS.',

    common_confirmation_msg: 'Si no ha recibido el correo electrónico, haga lo siguiente: \ n \ nCompruebe el correo no deseado u otras carpetas. \ nCompruebe que el cliente de correo funciona normalmente. ',

    reset_pswd_msg: '* Por motivos de seguridad, no se permiten retiros durante las 24 horas posteriores a la modificación de los métodos de seguridad..',

    confirm_your_reset_request: 'Confirme su solicitud de reinicio',
    backToLogin: 'Volver al inicio de sesión',
    eagerToJoin: '¿Estás ansioso por unirte?',
    quickSignUp: 'Registro rápido',
    signUpWithProfile: 'Regístrese con los detalles de su perfil',

    //for login with 2FA
    TwoFA_text: '2FA',
    GoogleAuthentication: 'Autenticación de Google',
    SMSAuthentication: 'Autenticación de SMS',
    authentication_code_validate: 'Ingrese el código de autenticación',
    authentication_code_length_validate: 'El código de autenticación debe tener 6 dígitos.',

    //for login
    username_validate: 'Introduzca su nombre de usuario',
    password_validate: 'Introducir la contraseña',

    //For Filter Drawar
    Reset: 'Reajustar',
    Apply: 'Aplicar',

    //for forgot password
    email: 'correo electrónico',
    enterEmail: 'Ingrese correo electrónico',

    //for reset password
    new_password: 'Nueva contraseña',
    repeat_password: 'Confirmar contraseña',
    confirm_password_validate: 'Ingresar Confirmar Contraseña',
    password_match_validate: 'Contraseña y Confirmar contraseña deben ser iguales',

    action: 'Acción',

    //For IP Whitelist
    ipTitle: 'IP',
    deviceTitle: 'Dispositivo',
    dateTimeTitle: 'Fecha y Hora',
    ipAddress: 'Su Direccion IP',
    ipWhitelisting: 'Lista blanca de IP',
    add: 'Añadir',
    aliasName: 'Apodo',
    aliasNameValidation: 'El nombre de alias no debe estar vacío.',
    addIpToWhiteListTitle: 'Añadir IP a la lista blanca',
    updateIpToWhiteListTitle: 'Actualizar IP a la lista blanca',
    Enable: 'Habilitar',
    Disable: 'Inhabilitar',
    Please_Enter_IpAddress: 'Por favor, Introduzca Dirección IP',

    //For Login History
    Login_History: 'Historial de inicio de sesión',

    //For Ip History
    Ip_History: 'Historia de IP',
    EnterProperIpAddress: 'Introduzca la dirección IP correcta',

    //KYC Module
    identityAuthentication: 'Autenticación de identidad',
    verification_string: 'Por favor, asegúrese de usar su identidad real para hacer esta verificación',
    surname: 'Apellido',
    givanname: 'Nombre de pila',
    valididentitycard: 'Tarjeta de identidad válida',
    cardfrontside: 'Cargar imagen de carnet de identidad frontal',
    cardbackside: 'Cargar imagen de tarjeta de identidad',
    photoid_note: 'Subir imagen de Selfie con foto y nota',
    choosefile: 'Elija el archivo',
    cardfrontside_string: 'Si no tiene un pasaporte, cargue una foto del frente de su Licencia de conducir o documento de identificación nacional',
    cardbackside_string: 'Por favor, asegúrese de que la foto esté completa y esté visible, en formato JPG. La tarjeta de identificación debe estar en el período válido.',
    photoid_note_string: 'Por favor, proporcione una foto de usted sosteniendo su tarjeta de identidad en la parte frontal. En la misma imagen, haga una referencia a la fecha de hoy mostrada. Asegúrese de que su cara sea claramente visible y que todos los detalles del pasaporte sean claramente legibles.',
    enter_surname: 'Ingrese el apellido',
    enter_name: 'Ingrese su nombre',
    photoid_varification1: 'Cara claramente visible',
    photoid_varification2: 'Identificación con foto claramente visible',
    photoid_varification3: 'Nota con la fecha de hoy.',
    kyc_personal_actionbar_title: 'Verificación de identidad personal',
    UpdateLevel: 'Nivel de actualización',
    Select_IdentityCard: 'Seleccionar tarjeta de identidad',
    ElectricityBill: 'Factura de Electricidad',
    DrivingLicence: 'Permiso de conducir',
    AadhaarCard: 'Tarjeta de Aadhaar',

    //Login With Pin and Pattern
    loginWithPinTitle: 'Iniciar sesión con Pin',
    loginWithPatternTitle: 'Iniciar sesión con el patrón',
    pin: 'Alfiler',
    pattern: 'patrón',
    changePin: 'Cambiar PIN',
    changePattern: 'Patrón de cambio',
    patternNormalMessage: 'Dibuja tu patrón',
    patternRightMessage: 'Patrón coincidente exitosamente',
    patternWrongMessage: 'Patrón no coincide, inténtalo de nuevo',
    patternVerifyMessage: 'Verificar patrón',
    patternValidateMessage: 'El patrón debe contener un mínimo de 3 puntos',

    //For Preferences Module
    EnableDarkMode: "Habilitar modo oscuro",
    Preferences: 'Preferencias',
    language: 'Idioma',
    NotificationSettings: 'Configuración de las notificaciones',

    // Referral Program
    ReferrelProgram: 'Programa de referencia',
    inviteShareMessage: '{user} Invited you to Join {appName} - Fast, Simple and Safe CryptoExchange Platform ! Use my unique {referralId} {referralLink} to get an assured reward now ! Visit Our Website - {websiteLink} and SignUp now !',

    // Session Module of MyAccount
    Session: 'Sesiones',
    withdrawalAddressManagement: 'Gestión de direcciones de retirada',

    //for security questions
    edit: 'editar',

    //for Security image message
    enter_message: 'Entrar mensaje',

    //security
    phoneNumber: 'Número de teléfono',
    phoneNumberValidation: 'El número de teléfono debe ser de 10 dígitos.',
    GoogleAuthenticator: 'Google Authenticator',
    enabled: 'Habilitado',
    disabled: 'Discapacitado',
    incorrectPassword: 'Por favor, introduzca la contraseña correcta.',
    old_password: 'Contraseña anterior',
    old_password_validate: 'Ingresar contraseña antigua',
    changePassword: 'Cambia la contraseña',
    googleAuthIntroMessagePart1: 'Para empezar, necesitarás instalar el ',
    googleAuthIntroMessagePart2: ' aplicación en su teléfono.',
    googleAuthBackupKeyTitle: 'Clave de respaldo',
    googleAuthBackupKeyMessage: 'Por favor guarde esta llave en papel. Esta clave le permitirá recuperar su autenticación de Google en caso de pérdida del teléfono.',
    next: 'Next',
    disableGoogleAuthentication: 'Deshabilitar Google Auth',

    firstName: 'Nombre de pila',
    lastName: 'Apellido',
    firstNameValidate: 'Ingrese el primer nombre',
    lastNameValidate: 'Introduzca el apellido',
    countryVaildate: 'Seleccionar país',
    updateProfileTitle: 'Actualizar perfil',
    select_your_image: 'Seleccionar imagen',

    //For Fee & Limit Patterns
    Exchange: "Intercambiar",
    Fee: "Honorarios",
    Fee_Calculation_Type: "honorarios Cálculo Tipo",
    Apply_Fee_Range: "Aplicar honorario En Rango",
    Fee_Amount: "honorario Importe",
    LimitType: "Tipo límite",

    //For Device Whitelist
    DeviceWhitelist: "Lista blanca de dispositivo",
    DeviceAddress: "Dirección del dispositivo",
    DeviceName: "Nombre del dispositivo",
    IPAddress: "Dirección IP",
    Location: "Ubicación",
    AddDevicetoWhitelist: "Añadir dispositivo a la lista blanca",
    current_device: 'Dispositivo actual',

    //For Complain 
    closed: 'Cerrado',
    open: 'Abierto',
    complaint: 'Queja',
    complaint_list: 'List de queja',
    complaint_id: 'Queja Id',
    status: 'estado',
    subject: 'Tema',
    remarks: 'Observaciones',
    description: 'descripción',
    updated_at: 'actualizado en',
    created_at: 'Creado en',
    id: 'carné de identidad',
    postreply: 'Enviar respuesta',
    recheck: 'Volver a comprobar',
    urgent: 'Urgente',
    medium: 'Medio',
    priority: 'Prioridad',

    // Announcements Module of MyAccount
    Announcements: 'anuncio',
    AnnouncementSection: 'Sección de anuncios',

    //For SignUp
    SignUp: 'Regístrate',
    Validate_MobileNo: 'Ingrese el número de móvil',
    MobileNo: 'número de teléfono móvil',
    VerifyOtp: "Verificar OTP",
    ResendOtp: "Reenviar OTP",

    //for new signupscreen
    Generate_OTP: 'Generar OTP',
    Enter_Email_validation: 'Por favor, introduzca la dirección de correo electrónico',
    Enter_Valid_Email: 'Por favor ingrese una dirección de correo electrónico válida',


    //For MembershipLevels
    Membershiplevel: "Níveis de adesão",
    Depositfee: "Tasa de depósito",
    Withdrawelfee: "Cargo por retiro",
    Tradingfee: "Cuota de Trading",
    WithdrawelLimit: "Límite de Retiro 24h",
    upgradeNow: "Actualizar ahora",
    Year: 'Año',
    Standard: 'Estándar',

    //Logout
    logOff: 'Desconectarse',
    Success: 'Éxito',
    Failed: 'Fracasado',
    Important: 'Importante',

    //For SignUp Normal
    ReferalId: 'Referal Id',
    Optional: 'Optional',
    password_length_validate: 'La contraseña debe tener al menos 6 y un máximo de 30 caracteres',
    Prev: 'Anterior',
    Strong_Password_Validation: 'La contraseña debe contener al menos 1 carácter especial mayúscula 1 minúscula 1 número 1',

    //For Normal Login
    Forgot_your_password: '¿Olvidaste tu contraseña?',
    Exit: 'Salida',
    OK: 'bueno',
    Exit_Message: '¿De verdad quieres salir de la aplicación?',

    //app intro title and text
    appIntroTitle1: 'Intercambio seguro',
    appIntroTitle2: 'Billetera',
    appIntroTitle3: 'Analítica',

    appIntroText1: 'Envíe y reciba de forma segura sus activos digitales en cualquier momento y en cualquier lugar.',
    appIntroText2: 'Toma el control de tus activos digitales. Creación y gestión de múltiples billeteras bitcoin en la aplicación.',
    appIntroText3: 'Mantenga un registro de todas sus transacciones con representación gráfica en un solo clic.',

    // loginwith2fa
    lost_msg: 'Perdió su autenticador',
    New_Password: 'Introduzca nueva contraseña',
    confirm: 'Confirmar',

    update: 'Actualizar',
    //For View Fund
    ShowBalance: 'Mostrar Todos los saldos',
    HideBalance: 'Ocultar saldos Todos',

    //Wallet Configuration
    Wallet_Configuration: 'Configuración de monedero',

    //View Profile
    ViewProfile: 'Ver perfil',
    Verfiy: 'Verificar',
    Verified: 'Verificado',
    KYCStatus: 'Estado de KYC',
    KYCLevel: 'Nivel de KYC',

    //  newssectiondetail & refer&earn & contact us & deviceWhitelist
    NewStack: 'NewStack',
    Referrel_Code: 'código de referencia',
    referral_id: 'Referido ID',
    Referral_Link: 'Enlace de referencia',
    Share_Referrel_Code: 'Compartir Código de Referencia',
    E_mail_blank: 'E-mail no puede estar en blanco',
    subject_blank: 'Por favor ingrese el asunto',
    Description_blank: 'Por favor ingrese la descripción',
    Devicename_blank: 'El nombre del dispositivo no debe estar vacío',
    Location_blank: 'La ubicación no debe estar vacía',
    Enter_valid_Code: 'Introduzca un código válido de 6 dígitos',
    contact_submit_success: 'Contacto agregado exitosamente',
    ForgotpasswordTitle: 'olvidó contraseña',
    contact_us_note: '* Carácter especial no permitido en Asunto y Descripción.',

    //cms related strings
    terms_of_service: "Términos de servicio",
    legal_statement: "Sentencia legal",
    application_center: "Centro de aplicaciones",
    withdraw_text: 'retirar',
    type_validation_text: 'Tipo No puede estar en blanco',
    subject_validation_text: 'sujeto no puede estar en blanco',
    description_validation_text: 'Descripción No puede estar en blanco',
    warning: 'Advertencia',
    license_key_expired_text: 'Su LicenseKey ha caducado. Póngase en contacto con su proveedor de servicios para renovarlo.',
    license_trial_expired_text: 'Su licencia de prueba ha caducado. Para continuar usando este servicio, obtenga una licencia de usuario válida.',
    authentication_validation_text: 'No tienes autenticación para usar este servicio..',
    authentication_contact_validation_text: 'No tiene autenticación para usar este servicio. Póngase en contacto con su proveedor de servicios.',
    inccrrect_code_text: 'Código incorrecto !!! Por favor, póngase en contacto con su proveedor.',
    coin_name_validation: 'Introduzca el nombre de la moneda',
    file_validation: 'Selecciona cualquier archivo',
    email_validation: 'Ingrese el correo electrónico apropiado',

    //For Google Authenticator
    App_Install_Message: 'Por favor, instale la aplicación Google Authenticator primero.',
    ScanQR_Code_Message: 'Si no puede escanear el código QR, ingrese este código manualmente en la aplicación.',
    EnableGoogleAuthentication: 'Habilitar Google Auth',

    // Amount Message: 
    AmountGreaterThanZero: 'cantidad debe ser superior a 0',
    AmountLessBalance: 'El total debe ser menor que el saldo disponible.',
    AmountNotEmpty: 'La cantidad no puede estar vacía',
    PriceNotEmpty: 'precio no puede estar vacío.',
    PriceGreaterThanZero: 'El precio debe ser mayor que 0.',
    StopNotEmpty: 'Stop Value no puede estar vacío.',
    StopGreaterThanZero: 'El valor de parada debe ser mayor que 0.',
    LimitNotEmpty: 'valor límite no puede estar vacío.',
    LimitGreaterThanZero: 'El valor límite debe ser mayor que 0.',
    InsufficientBalance: 'Saldo insuficiente',
    MinimumBidPrice: 'El precio mínimo debe ser mayor que ',
    MaximumBidPrice: 'El precio máximo debe ser menor o igual que ',
    ChangePassword_Validation_Msg: 'La contraseña antigua y la nueva contraseña no pueden ser iguales',

    //For Google Authenticator
    PleaseEnter: 'POR FAVOR INGRESE',
    verificationCodeMessage: 'El código de verificación recibido en tu móvil',
    verificationSMSMessage: 'La contraseña de una sola vez recibida en su ID de usuario',
    DontReceivedCode: 'Código no recibido ?',
    Resend_In: 'Reenviar en',
    Verification: 'Verificación',
    Enter_Subject: 'Ingresar Asunto',

    //Submit Request Screen
    CoinName: 'Acuñar Name',
    TransactionId: 'ID transacción',

    //Fee and Charges Screen
    Fees_Trading: 'Honorarios para Comercio',
    Starking: 'Starking Of',
    UNQ_Value: 'Valor UNQ',
    Maker_Fee: 'Maker Fee',
    Taker_Fee: 'Taker Fee',
    Fee_Deposit: 'Tasa por deposito',
    Fee_Withdrawal: 'Tasa por retirada',
    Min_Withdrawal: 'Min retirada',
    Trn_Fee: 'Cuota Trn',

    // static string change
    Currency: 'Moneda',
    Edit_Profile: 'Editar perfil',
    Basic: 'BASIC',
    RecentOrder: 'Orden reciente',
    MyOrder: 'Mi pedido',

    //For Funds
    UnSettledBalance: 'Saldo sin liquidar',
    UnClearedBalance: 'Equilibrio Descapitalizado',
    ShadowBalance: 'Balance de sombras',
    StackingBalance: 'Balance de apilamiento',
    WalletDetails: 'Detalles de la cartera',

    // User Ledger
    UserLedger: 'Usuario Ledger',
    TxnDetail: 'Txn Detail',
    Credit: 'Crédito',
    Debit: 'Débito',
    Cr: 'Cr',
    Dr: 'Dr',

    //for coin info
    issue_date: 'Fecha de asunto',
    circulating_supply: 'Suministro de circulación',
    alogrithm: 'Algoritmo',
    issue_price: 'Precio de emisión',
    proof_type: 'Tipo de prueba',
    total_supply: 'Oferta total',
    max_supply: 'máximo Suministro',
    website: 'Sitio web',
    introduction: 'Introducción',
    source_code: 'Código fuente',
    update_info_validate: 'No se encontraron cambios para la actualización.',
    subject_length_validation: 'El sujeto debe tener entre 2 y 100 caracteres.',
    description_length_validation: 'La descripción debe estar entre 10 y 300 caracteres',
    alert: 'Alert',
    logout_message: '¿Estás seguro de que quieres cerrar sesión?',
    no_text: 'No',
    yes_text: 'sí',
    delete_message: '¿Estás seguro de que quieres eliminar?',
    get_started_text: 'Empezar',
    account_created_text: 'Su cuenta ha sido creada, verifíquela haciendo clic en el enlace de activación que se ha enviado a su correo electrónico',
    resend_main_text: 'Reenviar Confirmar correo electrónico',
    hey: 'Oye',
    IpAddress: 'Dirección IP',
    Mobile: 'Móvil',
    EmailId: 'Id de correo electrónico',
    facebook: 'facebook',
    saveImageSuccess: 'Imagen guardar con éxito',
    day: 'Día',
    week: 'Semana',
    month: 'Mes',

    "activityNotification.message.2251": "Monto invalido. TrnNo: {Param1}",

    "activityNotification.message.4031": "Solicitud inválida Detalle TrnNo: {Param1}",
    "activityNotification.message.4034": "Solicitud inválida Detalle TrnNo: {Param1}",

    "activityNotification.message.4235": "La cartera o la cartera no válida está deshabilitada. TrnNo: {Param1}",
    "activityNotification.message.4237": "Dirección no encontrada o la lista blanca está desactivada. TrnNo: {Param1}",
    "activityNotification.message.4238": "Beneficiario no encontrado. TrnNo: {Param1}",
    "activityNotification.message.4239": "Dirección inválida. TrnNo: {Param1}",
    "activityNotification.message.4241": "Cartera no encontrada. TrnNo: {Param1}",
    "activityNotification.message.4248": "InvalidTrnType. TrnNo : {Param1}",
    "activityNotification.message.4277": "La validación de límite diaria falla para el número de transacción {Param1}",
    "activityNotification.message.4278": "Error en la validación del límite por hora para el número de transacción {Param1}",

    "activityNotification.message.4279": "La validación del límite de transacción falla para el número de transacción {Param1}",

    "activityNotification.message.4280": "Fallo de validación de límite para el número de transacción {Param1}",
    "activityNotification.message.4281": "Error de validación de tiempo para el número de transacción {Param1}",
    "activityNotification.message.4282": "La validación del límite de por vida falla para el número de transacción {Param1}",
    "activityNotification.message.4299": "La validación del límite diario maestro falla para el número de transacción {Param1}",

    "activityNotification.message.4300": "La validación del límite horario maestro falla para el número de transacción {Param1}",
    "activityNotification.message.4301": "La validación del límite de transacción falla para el número de transacción {Param1}",
    "activityNotification.message.4302": "La validación del límite maestro falla para el número de transacción {Param1}",
    "activityNotification.message.4303": "La validación de la hora maestra falla para el número de transacción {Param1}",
    "activityNotification.message.4304": "La validación del límite de vida útil maestra falla para el número de transacción {Param1}",
    "activityNotification.message.4345": "Saldo insuficiente. TrnNo: {Param1}",
    "activityNotification.message.4377": "Ref. De comercio no válido TrnNo: {Param1}",
    "activityNotification.message.4375": "Solicitud duplicada para el mismo número de referencia TrnNo: {Param1}",
    "activityNotification.message.4378": "La cartera o la cartera no válida está deshabilitada. TrnNo: {Param1}",
    "activityNotification.message.4379": "Superar el límite de sombra. TrnNo: {Param1}",

    "activityNotification.message.4433": "No puedes retirarte a tu propia dirección. TrnNo: {Param1}",
    "activityNotification.message.4453": "La cantidad debe estar entre {Param2} y {Param3} del límite maestro. TrnNo: {Param1}",
    "activityNotification.message.4454": "La cantidad debe ser menor que el límite diario de los maestros {Param3}. TrnNo: {Param1}",

    "activityNotification.message.4570": "Par no válido seleccionado para el número de transacción {Param1}",
    "activityNotification.message.4571": "Cantidad o precio no válido para el número de transacción {Param1}",
    "activityNotification.message.4572": "Cantidad de pedido e importe no válidos para el número de transacción {Param1}",
    "activityNotification.message.4575": "Importe no válido para el número de transacción {Param1}",
    "activityNotification.message.4576": "Transacción duplicada para la misma dirección, intente después de 10 minutos. TrnNo: {Param1}",
    "activityNotification.message.4577": "No puedes retirarte a tu propia dirección. TrnNo: {Param1}",
    "activityNotification.message.4579": "La cantidad debe estar entre: {Param2} y {Param3} para el número de transacción {Param1}",
    "activityNotification.message.4580": "El precio debe estar entre: {Param2} y {Param3} para el número de transacción {Param1}",
    "activityNotification.message.4585": "Servicio o producto no disponible. TrnNo: {Param1}",

    "activityNotification.message.4620": "ID de cuenta de débito no válida para el número de transacción {Param1}",
    "activityNotification.message.4624": "ID de cuenta de débito no válida. TrnNo: {Param1}",
    "activityNotification.message.4625": "ID de cuenta de crédito no válida para el número de transacción {Param1}",
    "activityNotification.message.4670": "Tipo de orden no válido para el número de transacción {Param1}",

    "activityNotification.message.6000": "Su billetera {Param1} está acreditada para {Param2} Transacción TrnNo: {Param3}",
    "activityNotification.message.6001": "Su billetera {Param1} está debitada por {Param2} Transacción TrnNo: {Param3}",
    "activityNotification.message.6002": "Nueva dirección creada con éxito para el monedero: {Param1}",
    "activityNotification.message.6003": "Nuevo límite creado con éxito para el monedero: {Param1}",
    "activityNotification.message.6004": "Nuevo límite actualizado exitosamente para el monedero: {Param1}",
    "activityNotification.message.6005": "Nuevo beneficiario agregado exitosamente para el tipo de billetera: {Param1}",
    "activityNotification.message.6006": "Detalles del beneficiario actualizados con éxito para el tipo de monedero: {Param1}",
    "activityNotification.message.6007": "Su lista blanca se cambió {Param1} con éxito",
    "activityNotification.message.6008": "Los monederos predeterminados se crean correctamente.",
    "activityNotification.message.6009": "Monedero: {Param1} creado con éxito.",
    "activityNotification.message.6010": "Su Transacton creó con éxito el Precio = {Param1}, Qty = {Param2}.",
    "activityNotification.message.6011": "Su Transacton se estableció. Precio = {Param1}, Cantidad = {Param2}, Total = {Param3}",
    "activityNotification.message.6012": "Su Transacton Parcial resuelto. Precio = {Param1}, Cantidad = {Param2}, Total = {Param3}",
    "activityNotification.message.6013": "¡¡Convertir {Param1} a {Param2} Presentar con éxito !!",
    "activityNotification.message.6014": "Your Order TrnNo.{Param1} Cancelled Successfully.",
    "activityNotification.message.6015": "Error de validación de transacción TrnNo: {Param1}",
    "activityNotification.message.6016": "Transacción fallida TrnNo: {Param1}",
    "activityNotification.message.6017": "Transacción exitosa Número de transacción: {Param1}",
    "activityNotification.message.6018": "Su transacción de retiro: {Param1} cantidad: {Param2} {Param3} de la billetera: {Param4} se crea",

    "activityNotification.message.6035": "Su {Param1} Monto de saldo de billetera: {Param2} se retiene para la transacción No: {Param3}",
    "activityNotification.message.6036": "Perfil de usuario Actualización exitosa completa",
    "activityNotification.message.6037": "{Param1} Inicio de sesión completo exitoso",
    "activityNotification.message.6038": "{Param1} en reenviar OTP éxito",
    "activityNotification.message.6039": "{Param1} en enviar OTP con éxito",
    "activityNotification.message.6040": "Autenticación de dos factores {Param1} activa",
    "activityNotification.message.6041": "Autenticación de dos factores {Param1} desactivada",
    "activityNotification.message.6042": "Su {Param1} saldo de monedero Monto: {Param2} versión para TrnNo: {Param3}",
    "activityNotification.message.6043": "Direcciones de retiro {Param1} con éxito",
    "activityNotification.message.6044": "Direcciones de retiro {Param1} con éxito",
    "activityNotification.message.6045": "Direcciones de retiro {Param1} con éxito",
    "activityNotification.message.6046": "Has iniciado sesión desde otro dispositivo.",
    "activityNotification.message.6047": "Su billetera {Param1} está retenida para {Param2} Número de referencia de transacción: {Param3}",
    "activityNotification.message.6048": "Se libera su billetera {Param1} para {Param2} Número de referencia de transacción: {Param3}",
    "activityNotification.message.6049": "Su billetera {Param1} está deducida para {Param2} Número de referencia de transacción: {Param3}",
    "activityNotification.message.6052": "El límite por día no puede ser inferior a {Param1}",
    "activityNotification.message.6053": "El límite por día no puede más que {Param1}",
    "activityNotification.message.6054": "El límite por hora no puede ser inferior a {Param1}",
    "activityNotification.message.6055": "El límite por hora no puede más que {Param1}",
    "activityNotification.message.6056": "El límite por transacción no puede ser inferior a {Param1}",
    "activityNotification.message.6057": "El límite por transacción no puede más que {Param1}",

    "activityNotification.message.7012": "Error interno. TrnNo: {Param1}",
    "activityNotification.message.7066": "No se permite el retiro de la dirección propia. TrnNo: {Param1}",
    "activityNotification.message.7067": "Dirección no coincidencia. TrnNo: {Param1}",

    "activityNotification.message.21047": "Límite de retiro diario del sistema alcanzado para {Param1} {Param2}",
    "activityNotification.message.21071": "Saldo insuficiente para la carga",

    //For Chat Screen
    Chat: 'Charla',
    blockChat: 'Estás bloqueado.',
    unBlockChat: 'Estás desbloqueado.',

    pleaseTryAfterSometime: 'Por favor, intente después de algún tiempo.',

    //for device whitelist screen
    activity: 'Actividad',
    messagesend: 'Mensaje enviado',
    msgblankvalidation: 'El mensaje no puede estar en blanco',

    // backoffice trade module
    Withdraw: 'Retirar',
    TradeSummary: 'Resumen comercial',
    Profit: 'Lucro',

    // for front marketitem
    Bal: 'Bal',
    At_Price: 'A PRECIOS',
    Pay_Total: 'Pagarás Total',
    Min: 'Min',

    // Social Profile Module
    // Leader Profile Configuration
    LeaderProfileConfig: 'Configuración del perfil de líder',
    ProfileVisibility: 'Visibilidad del perfil',
    MaxNoFollowerAllow: 'El número máximo de seguidores puede permitir',
    EnterMaxFollowerAllow: 'Introduzca el número máximo de seguidores para permitir',
    ProfileVisibilityArray: [{ value: 'Por favor seleccione' }, { value: 'Pública' }, { value: 'Privada' }],

    // Follower Profile Configuration
    FollowerProfileConfig: 'Configuración del perfil del seguidor',
    CanCopyTrade: '¿Se puede copiar el comercio?',
    CanMirrorTrade: '¿Puede Mirror Trade?',
    TradeLimit: 'Límite de comercio',
    TradeLimitValidation: 'Entrar en el límite de comercio',
    CopyTrade: 'Copia comercial',
    MirrorTrade: 'Comercio de espejos',
    TradeTypeValidation: 'Por favor seleccione el tipo de comercio',
    TradeLimitValueValidation: 'Establezca el valor límite de comercio entre 1 y 99',

    // Social Profile Subscription
    SocialProfileSubscription: 'Assinatura de perfil social',
    Leader: 'Líder',
    CanHaveFollower: 'Pode ter seguidores?',
    CanFollowLeader: 'Pode seguir líderes?',
    MinTradeVolume: 'Volume Mínimo de Negociação',
    Subscribe: 'Suscribir',
    UnSubscribe: 'Desuscribirse',
    CreateNewWatchList: 'Crear nueva lista de seguimiento',
    EnterNewWatchList: 'Ingresar Nuevo Grupo de Lista de Observación',
    AddToNewList: 'Añadir a la nueva lista',
    SocialProfileDash: 'Panel de Perfil Social',
    TopLeader: 'Líder superior',
    NoOfFollowers: 'No de seguidores',
    SocialProfile: 'Perfil social',
    HistoricalPerformance: 'Performance historica',
    SocialTrading: 'Comercio Social',
    SocialTradingDesc: 'Red de comercio social para intercambiar ideas sobre situaciones de mercado con una comunidad comercial de inversores.',
    SubscribeNow: 'Suscríbase ahora',
    Followers: 'Seguidoras',
    WatchList: 'Lista de vigilancia',
    Followed: 'Seguido',

    // Activity Log
    activityType: 'Tipo de actividad',
    moduleType: 'Tipo de módulo',
    activityLogHistory: 'Historial de registro de actividades',
    activityLogHistoryDetail: 'Historial de registro detallado',
    deviceId: 'ID del dispositivo',
    Unauthorized: 'No autorizado',
    BadRequest: 'Solicitud incorrecta',
    InternalError: 'Error interno',
    IpAddressValidation: 'Introduzca una dirección IP válida',

    //Stacking History
    Staking: 'Replanteo',
    UnStaking: 'Desempaquetado',
    Fixed_Deposit: 'Deposito reparado',
    Charge: 'Cargar',
    Fixed: 'Fijo',
    Range: 'Distancia',
    GetQuote: 'Obtener cotización',
    Select_Plan: 'Seleccione plan',
    StakingDetails: 'Detalles de replanteo',
    MaturityDetails: 'Detalles de vencimiento',
    Stacked: "Apiladas",
    AvailAmt: "Avail. Amt",
    Interest: 'Interesar',
    Maturity: 'Madurez',
    Received: 'Rcvd',

    //For Add Stacking Plan
    Stacking_Type: 'Tipo de apilamiento',
    Slab_Type: 'Tipo de losa',
    Auto_Unstacking_Enable: 'Habilitar el desapilado automático',
    Interest_Type: 'Tipo de interés',
    Interest_Amount: 'Cantidad de interés',
    Percentage: 'Porcentaje',
    Renew_Unstacking_Period: 'Renovar período de descanso',
    Maturity_Currency: 'Moneda de Vencimiento',
    Staking_Before_Maturity_Charge: 'Replanteo antes del vencimiento',

    //Stacking Configuration
    added_msg: 'agregado con éxito',
    UnstakingDate: 'Fecha UnStaking',
    MaturityDate: 'Fecha de vencimiento',
    Maturity_Amount: 'Maturity Amount',

    //For My Wallet Module
    MyWallets: 'Mis carteras',
    WalletUserList: 'Wallet Users',
    UserName: 'Nombre de usuario',
    RoleName: 'Nombre de Rol',
    AddNewUser: 'Añadir Nuevo Usuario',
    EmailAddress: 'Dirección de correo electrónico',
    InviteMessage: 'Mensaje de invite',
    RolesData: [
        { value: 'Admin', },
        { value: 'Gastador', },
        { value: 'Espectador', },
    ],
    PendingRequests: 'Solicitudes de billetera pendientes',
    JoinMessage: 'te ha invitado a unirte como',
    wallet: 'Billetera',
    WalletName: 'Billetera',
    selectRoleMsg: 'Seleccionar rol',
    User: 'Usuaria',
    OutBounded: 'OutBounded',
    InBound: 'InBound',

    // Trading Summary
    TradingSummary: 'Resumen de Trading',
    TradingSummaryDetail: 'Detalle de Resumen de Trading',
    transactionNo: 'Transacción No',

    startEndTimeValidation: 'La hora de inicio debe ser menor que la hora de finalización',

    //social profile leader list
    noOfFollwerFollow: 'No De Seguidor Seguir',
    profile: 'Perfil',
    leaders: 'Lideres',
    follow: 'Seguir a todos',
    unFollow: 'No seguir todo',

    // for tell a friend
    TellAFriend: 'Dile a un amigo',
    TaptoCopy: 'Toque para copiar',
    ClicktoShare: 'Haga clic para compartir',
    CopiedtoClipboard: '¡Copiado al portapapeles!',
    copy_link: 'Copiar link',
    Twitter: 'Twitter',
    Whatsapp: 'Whatsapp',
    google_plus: 'Google +',
    Pinterest: 'Pinterest',
    Resend: 'Reenviar',
    DeductionAmount: 'Cantidad de deducción',

    //For List Empty View
    Empty_List_Link_Msg: 'Por qué no {module} ¿ahora?',

    Choose_Coin: 'Elegir moneda',

    //Login noraml screen
    joinCooldex: '¡Únete a Cooldex!',

    //for Deposit
    Important_Message: 'No deposite ningún otro activo digital en la dirección anterior. Está destinado a ser utilizado SOLAMENTE con {Name} y, si se usa incorrectamente, puede perder sus activos permanentemente.' + '\n\n' + 'Depositar en la dirección anterior requiere la confirmación de toda la red, por lo que estará disponible después de 15 confirmaciones y estará disponible para retirarse después de 30 confirmaciones.' + '\n\n' + 'Nuestro monto de depósito mínimo: {MinAmount} {Coin} Cualquier depósito menor al mínimo no será acreditado o reembolsado.' + '\n\n' + 'Su dirección de depósito cambiará solo cuando se le notifique previamente por anuncio y correo electrónico, por lo que es muy probable que no cambie.' + '\n\n' + 'Mantenga su computadora y dispositivos a salvo y recuerde siempre proteger toda la información de sus niños.',
    SaveQRCode: 'Guardar código QR',

    //For Withdraw
    Confirm: 'Confirmar',
    Important_Message_Withdraw: 'Cantidad mínima de retiro: {MinAmount} {Coin}.' + '\n\n' + 'Para asegurarse de que sus fondos estén seguros, su solicitud de retiro se revisará manualmente si se realizan cambios en su estrategia de seguridad o contraseña en las últimas 24 horas. Espere a que uno de nuestros empleados lo llame o le envíe un correo electrónico de confirmación.' + '\n\n' + 'Mantenga su computadora y dispositivos a salvo y recuerde siempre proteger toda la información de sus niños.',
    Withdraw_Address: 'Intrekken Adres',
    Available: 'Beschikbaar',

    // loan and loan history
    Loan: 'Préstamo',
    BTC: 'BTC',
    USDT: 'USDT',
    Loaned: 'Prestado',
    Rate: 'Tarifa',

    //for Funds screen
    higher: 'Mayor',
    lower: 'Inferior',
    invested: 'Invertido',

    //for my point cards screen
    on_orders: 'En pedidos',
    transfer: 'Transferir',

    //CMS Tell A Friend New
    howDoesItWork: '¿Como funciona?',
    inviteFriends: 'Invitar a amigos',
    yourInvitationCode: 'Su código de invitación',
    copyCode: 'Copiar código',
    ShareApp: 'Compartir aplicación',

    // Transfer Screen
    Fiat: 'Fíat',

    // Fiat
    Margin: 'Margen',

    // for front Survey
    Survey: 'estudio',
    SurveyResults: 'Resultados de la estudio',
    Option: 'Opción',
    TotalAnswer: 'Respuesta total',

    // HelpCenter Front
    HelpCenter: 'Centro de ayuda',

    // for margin screen 
    Hide_small_balances: 'Ocultar saldos pequeños',
    Search: 'Buscar',
    Estimated: 'Estimado',
    Estimated_Net_Value: 'Valor neto estimado (BTC) ',

    // for Exchange Screen
    Estimated_Total_Value: 'Valor total estimado (BTC)',
    Estimated_Value: 'Estimado (USD)',
    orderManagement: 'Gestión de pedidos',
    services: 'Servicios',
    fiatDetail: 'Buy digital assets with fiat money.',
    index: 'Índice',
    indexDetail: 'The weather vane of digital assets',
    fundDetail: 'An autonomous index product',
    marginDetail: 'An investimento that is several times the amount of your original fund.',
    learnMore: 'Aprende más',

    //for new coins dashboard
    new_coins: 'Nuevas monedas',

    //for market search 
    selectedCurrency: 'Moneda seleccionada',

    // for fiat screen
    PaymentMethod: 'Método de pago',
    BUY: 'COMPRAR',
    SELL: 'VENDER',

    //For Wallet Sharing
    WalletSharing: 'Compartir billetera',

    // for modal google Auth
    paste: 'Pegar',
    code: 'Código',
    lostYourAuthenticator: 'Perdió su autenticador',
    contactToSupport: 'Por favor, póngase en contacto con el servicio al cliente: support@cooldex.pro',
    googleAuthenticationCode: 'Código de autenticación de Google',
    vertical: 'Vertical',

    //for Survey
    feature_survey: 'características Encuesta',
    coin_list_survey: 'Lista de monedas Encuesta',
    feedback_survey: 'Realimentación Encuesta',
    riskRate: 'Tasa de riesgo',
    liquidationPrice: 'Precio de liquidación',
    riskRateTitle: '¿Qué significa la tasa de riesgo?',
    riskRateDetail1: 'Si su cuenta de margen alcanza una tasa de riesgo demasiado alta, se cierra automáticamente.',
    riskRateDetail2: 'Actualmente, su límite es del 110%, así que tenga cuidado de mantenerse alejado de eso.',
    riskRateButton: 'lo entiendo',

    //social Profile Follower List
    followerList: 'Lista de seguidores',
    tradeType: 'Tipo de comercio',
    mirror: 'Espejo',

    //for Affiliate SignUp
    scheme_type: 'esquema Tipo',
    select_scheme_type: 'Select Scheme Type',
    notConfirm: 'Sin confirmar',

    // for Affiliate Dashboard
    affiliate: 'Afiliado',
    sendMails: 'Enviar correos',
    sendSMS: 'Enviar SMS',
    shareOnFacebook: 'Enlace Compartir en Facebook',
    shareOnTwitter: 'Enlace Compartir en Twitter',
    totalSignUp: 'Inscripción total',
    affiliateLink: 'Haga clic en el enlace de afiliados',
    commissionReport: 'Informe de la comisión',

    //social Profile My Watch List
    myWatchList: 'Mi lista de seguimiento',
    leaderName: 'Nombre del líder',
    groupName: 'Nombre del grupo',

    //For Leader Board List 
    LeaderBoard: 'Líder Tablero',
    LeaderName: 'Nombre de líder',
    TopLeaderList: 'Lista Top 25 Líder',
    profitLossSmall: 'P/L',
    Qty: 'Qty',

    //affiliate commission type
    commission_pattern: 'Comisión Patrón',
    commission_count_on: 'Comisión Contar En',

    //social profile portfolio
    portfolio: 'portafolio',
    bothDateRequired: 'Ambas fechas son requeridas desde la fecha y hasta la fecha',
    orderType: 'Tipo de orden',
    portfolioDetail: 'Detalle de la cartera',
    yourPrice: 'Tu precio',
    isCencel: 'Esta cancelado',
    no: 'No',

    //for referral program
    your_commission_rate: 'Tu Comisión Tarifa',
    referral_friends: 'Remisión Amigos',
    enstimated_commission_value: 'Enstimado Comisión Valor',
    program_details: 'Programa Detalles',
    important_notice: 'Importante darse cuenta',

    //affiliate click on link report
    send: 'Enviar',
    clickOnLinkReport: 'Haga clic en Informe de enlace',
    failure: 'Fracaso',
    level: 'Nivel',
    commissionReportDetail: 'Detalle del informe de la comisión',
    commission: 'Comisión',
    earning: 'Ganador',
    buyTrade: 'Compra-Comercio',
    sellTrade: 'Venta-Comercio',

    //For send email report
    sendMailReport: 'Enviar informe de correo',
    createdDate: 'Fecha de creación',
    sendSmsReport: 'Enviar informe SMS',
    facebookShareReport: 'Facebook Compartir Informe',
    twitterShareReport: 'Twitter Compartir Informe',
    signupReport: 'Informe de Inscripción Total',
    dashboard: 'salpicadero',

    myProfile: 'Mi perfil',
    emailMobile: 'ID de correo electrónico / número de móvil',
    enterEmailorMobile: 'Por favor, introduzca ID de correo electrónico / No. móvil',
    sendOTP: 'Enviar OTP',

    // for Margin Wallet Ledger
    ledger_id: 'Ledger Id',
    crAmount: 'Monto de crédito',
    drAmount: 'Monto de débito',
    margin: 'Margen',
    marginWalletLedger: 'Margin Wallet Ledger',

    TrnId: 'Tridid',
    UnStaking_Type: 'Tipo de desempaquetado',
    Full: 'Completo',
    Partial: 'Parcial',

    // For Margin wallets 
    MarginWallets: 'Billeteras de Margen ',
    SafetyWallets: 'Safety Wallets',
    ProfitWallets: 'Lucro Billeteras ',
    WalletUsageType: 'Wallet Usage Type',
    OutBoundBalance: 'Out Bound Balance',
    InBoundBalance: 'In Bound Balance',
    Role: 'Rol',
    ExpiryOn: 'Caducidad On',

    // for refere and Earn (referal data usercount)
    invites: 'Invita',
    clicks: 'hacer clic',
    participant: 'Partícipe',
    converts: 'Converso',
    sms: 'SMS',
    Facebook: 'Facebook',
    messenger: 'Mensajero',
    linkedin: 'Linkedin',
    telegram: 'Telegrama',

    AddNewAddress: 'Agregar nueva dirección',

    //For Create Margin Wallet and Confirmation
    CreateMarginWallet: 'Crear margen Monedero',
    AddLeverage: 'Añadir Apalancamiento',
    WalletBalanaceValidation: 'La cantidad no puede gretear entonces saldo de la cartera',
    ConfirmLeverage: 'Confirmar apalancamiento',
    FinalCreaditAmount: 'Monto final de crédito',
    LeverageAmount: 'Cantidad Apalancamiento',
    LeveragePer: 'Apalancamiento(%)',
    ChageAmount: 'Cantidad Cobrar',
    SafteyMarginAmount: 'Cantidad de margen de seguridad',

    // for API Plan
    apiPlan: 'Plan de api',
    planValidity: 'Validez del plan',
    concurrentIpAddressLimit: 'Límite de direcciones IP simultáneas',
    historicalData: 'Información histórica',
    maxRequestSize: 'Max. Tamaño de solicitud',
    maxResponseSize: 'Max. Tamaño de respuesta',
    whiteListIpAddressLimit: 'Límite de direcciones IP de la lista blanca',
    concurrentIpAddressAllow: 'Dirección IP concurrente Permitir',
    subscribedSuccessfully: 'Suscrito con éxito',
    areYouSureToSubscribe: 'Estás seguro de que quieres suscribirte?',
    paymentStatus: 'Estado de pago',
    upgrade: 'Mejorar',
    downgrade: 'Degradar',
    subscriptionStatus: 'Estado de suscripcion',
    requestedON: 'Solicitada EN',
    activatedON: 'activada en',
    autoRenew: 'auto renovación',
    nextRenewalOn: 'Próxima renovación en',
    renewalStatus: 'Estado de renovación',
    validityPeriod: 'Periodo de validez',
    recursive: '¿Recursiva?',
    ExpiryDate: 'Fecha de caducidad',
    subscriptionAmount: 'Cantidad de suscripción',
    renewNow: 'Renovar ahora',
    stopAutoRenew: 'Detener la renovación automática',
    upgradeWarning: 'Una vez que actualice / baje la calificación de su plan, todas las claves generadas y sus detalles se perderán. Después de confirmar esta acción, debe generar nuevas claves de apis para acceder a la API pública.',
    notDone: 'No hecho',
    readOnlyApiMethods: 'Métodos Api de solo lectura',
    fullAccessApiMethods: 'Métodos de acceso completo de la API',
    subscribed: 'Suscrito',
    viewMore: 'Ver más',
    noApiPlanAvailable: 'No hay planes API disponibles para la suscripción',
    areYouSureToUpgrade: '¿Estás seguro de que quieres actualizar?',
    areYouSureToDowngrade: '¿Estás seguro de que quieres bajar de categoría?',
    renewApiPlanSubscription: 'Renovar la suscripción al plan API',
    apiPlanName: 'Nombre del plan API',
    alreadySetAutoPlan: 'Su plan ya está activado Renovar automáticamente',
    areYouSureToRenewPlan: '¿Estás seguro de que quieres renovar ahora?',
    requested: 'Pedido',
    areYouSureToRenewPlanWorth: '¿Está seguro de que desea renovar el APIPlan de {PlanName} por {NetTotal}?',
    autoRenewSubtitle: 'Configure su renovación automática de la suscripción del plan API',
    autoRenewBeforeExpiry: 'Renovación automática antes del vencimiento',
    renewalDate: 'Fecha de renovación',
    renewPlanBefore10Day: 'Puede renovar su plan como máximo antes de 10 días.',
    renewPlanBefore1Day: 'No puede renovar su plan como mínimo antes de 1 día.',
    areYouSureToAutoRenewalApi: '¿Está seguro de que desea habilitar la renovación automática de {PlanName} APIPlan antes de {Days} días de la fecha de caducidad {ExpiryDate}?',
    planDesc: 'Descripción del plan',
    stopAutoRenewSubtitle: 'Detener la renovación automática de su suscripción al plan API',
    nextRenewalDate: 'Próxima fecha de renovación',
    areYouSureToStopApiPlan: '¿Está seguro de que desea detener la renovación automática de {PlanName} APIPlan? Si detiene su renovación automática, expirará en {RenewalDate} y ya no se renovará automáticamente. No se preocupe, su acceso con este APIPlan continuará hasta esta fecha.',
    stopApiSuccessfully: 'API Plan Establecer Detener Auto Renovar con éxito.',
    renewApiSuccessfully: 'Plan API renovar con éxito.',
    autoRenewApiSuccessfully: 'El plan API establece la renovación automática con éxito.',
    setCustomLimits: 'Establecer límites personalizados',
    customLimits: 'Límites personalizados',
    customLimitsDesc: 'Establezca límites personalizados para el plan de clave de API pública comprado. El límite personalizado se aplicará para la accesibilidad de la Clave de API pública generada.',
    maxRecInRequest: 'Max. Expedientes en solicitud ',
    enterMaxCallPerDay: 'Enter max. llamadas por día ',
    enterMaxCallPerMin: 'Enter max. llamadas por minuto ',
    enterMaxCallPerMonth: 'Enter max. llamadas por mes ',
    enterMaxOrderPerSecond: 'Enter max. pedido realizado por segundo ',
    enterMaxRecInRequest: 'Enter max. Expedientes en solicitud ',
    enterWhiteListIpAddressLimit: 'Ingresar Límite de direcciones IP de lista blanca',
    enterConcurrentIpAddressAllow: 'Ingresar dirección IP simultánea permitida',
    enterMaxRequestSize: 'Enter Max. Tamaño de solicitud ',
    enterMaxResponseSize: 'Enter Max. Tamaño de respuesta ',
    enterHistoricalData: 'Ingrese datos históricos',
    setAsDefault: 'Establecer como predeterminado',
    editCustomLimits: 'Edit Custom Limits',
    customLimitAddedSuccessfully: 'Límite API personalizado personalizado agregado exitosamente.',
    customLimitUpdatedSuccessfully: 'Límite API personalizado personalizado actualizado con éxito',
    setDefaultSuccessfully: 'Establecer el límite personalizado predeterminado con éxito',
    customLimitAlert: 'Esto borrará todos los límites del conjunto personalizado anterior (si corresponde) y aplicará los límites predeterminados según el plan comprado. ¿Está seguro de que desea establecer límites a los valores predeterminados?',
    upgradedSuccessfully: 'Plan actualizado con éxito',
    downgradSuccessfully: 'Plan degradado con éxito',
    expire: 'Expirar',
    enterDays: 'Entrar dias',
    maxCallDay: 'Max.calls / dia',
    maxCallMin: 'Max.Calls / min',
    maxCallMonth: 'Max.Callos / mes',
    maxOrderPlacedSec: 'Orden máxima colocada / seg.',
    planDetail: 'Detalle del plan',
    subscription: 'Suscripción',
    apiMethods: 'Métodos API',
    expireOn: 'Expira el',
    renewCycle: 'Renovar ciclo',
    renew: 'Renovar',
    readOnly: 'Solo lectura',
    fullAccess: 'Acceso completo',
    apiLimits: 'Límites API',
    changePlan: 'Cambio de plan',
    notSubscribed: 'No suscrito',
    yourPlanAlreadySubscribe: 'Tu plan de API ya está suscrito.',
    noApiMethodRequested: 'No se requiere método API',
    follwerLimit: 'Establezca el número de seguidor entre {minValue} a {maxValue} de definido por admin.',
    follwerLimitShortMsg: 'Establecer seguidor entre {minValue} a {maxValue}',

    LeverageReport: 'Informe de apalancamiento',
    FromWallet: 'De la cartera',
    ToWallet: 'A la cartera',
    ChargeAmount: 'Precio a cobrar',
    MarginAmount: 'Cantidad de Margen',
    CreditAmount: 'Monto de crédito',

    // For referral data
    referralInviteEmail: 'Referencias Invitar correo electrónico',
    referralInviteSms: 'Referencia invita SMS',
    referUserName: 'Refer UserName',
    referralParticipant: 'Participante de referencia',
    receiverUsername: 'Nombre de usuario del receptor',
    referralInvite: 'Invitación de referencia',
    clickOnReferralLink: 'Haga clic en el enlace de referencia',
    reward: 'Recompensa',
    userName: 'Nombre de usuario',
    ChannelType: 'Tipo de canal',
    PayType: 'Tipo de pago',
    Receiver: 'Receptor',
    ServiceSlab: 'Losa de servicio',
    invite: 'Invitación',

    // for generate api key
    alias_name: 'Alias nombre',
    generate_api_key: 'Generar API Clave',
    generate_now: 'Generar Ahora',
    plan_name: 'Plan nombre',
    note_text: 'Nota',
    view_rights: 'Ver Derechos',
    admin_rights: 'Admin Derechos',
    api_permission: 'API permiso',
    add_apikey_Note: 'El permiso de API no puede actualizarse después de que se genere la clave pública. Por favor asegúrese de proporcionar los derechos de acceso correctos.',

    //apikey
    apiAccess: 'Acceso api',
    viewOnly: 'Sólo vista',
    adminOnly: 'Sólo administrador',
    ipAccess: 'Acceso IP',
    restrictedAccess: 'Acceso restringido',
    unRestrictedAccess: 'Acceso no restingido',
    inProcess: 'En proceso',
    viewPublicApiKey: 'Ver clave pública de Api',
    totalApiKeys: 'Total Api Keys',
    allowedAccess: 'Acceso permitido',
    restrictAccessToWhitelist: 'Restringir el acceso a IP de lista blanca solamente (recomendado)',
    unrestrictedAccess: 'Acceso no restringido (menos seguro)',
    securityApiKeyWarningNote: "Guarde sus llaves en algún lugar seguro. Mientras tanto, por razones de seguridad, tenga en cuenta que no comparta las claves generadas con todos. Si en cualquier caso las claves API se pierden, no es recuperable",
    securityWhitelistWarningNote: 'Una vez que elige Restringir el acceso, no puede Desnudarlo de nuevo. Una vez que la lista de direcciones IP de la lista blanca se haya configurado correctamente, no se puede actualizar o eliminar o no se puede agregar una nueva IP. Por favor asegúrese de haber incluido en la lista blanca la dirección IP precisa.',
    totalLimits: 'Límites totales',
    currentIPAddress: 'Dirección IP actual',
    whitelistedIPAddress: 'Dirección IP en lista blanca',
    apiKeyDeleteNote: 'Una vez que elimine esta Clave de API pública, el acceso se revocará de inmediato y todos los servicios relacionados con esta Clave de API pública se suspenderán permanentemente. ¿Está seguro de que desea eliminar esta clave de API pública?',
    deleteApiKey: 'Excluir a chave APi',
    enter_proper: 'Entrar Apropiado',

    // margin Trading History
    marginTradingHistory: 'Historial de comercio de margen',

    // Affiliate
    parentUser: 'Usuario principal',
    parentUserName: 'Nombre de usuario principal',
    parentEmail: 'Correo electrónico de los padres',
    parentMobile: 'Móvil para padres',
    userEmail: 'Email del usuario',

    depth: 'Profundidad',

    //add api key succes screen
    securitySuccesScreenNote: 'Almacene su clave API en un lugar seguro. No se mostrará de nuevo.',
    api_key_generate_success_message: 'Api Key se ha generado',
    update_button_security_message: 'Una vez que haga clic en el botón de actualización, se congelarán las configuraciones y no se podrán hacer cambios a estas configuraciones. Por favor, confirme las ipaddresses una vez. ¿Estás seguro de que quieres actualizar la configuración?',

    //for add whitelisted ip
    whitelist_ip_address: 'Lista blanca DIRECCIÓN IP',
    your_current_ip_address: 'Su actual DIRECCIÓN IP',
    unique_alias_name: 'Único Alias Nombre',
    add_whitelist_ip_security_message: 'Esto restringirá el acceso de clave pública solo a la dirección IP en la lista blanca. ¿Está seguro de que desea agregar esta dirección IP a la lista blanca?',
    whitelist_ip: 'Lista blanca IP',
    concurrent_ip: 'Concurrente IP',
    ip_type: 'IP Tipo',

    // for Discover Screen
    AD: 'ANUNCIO',
    LatestTrends: 'Últimas tendencias',
    ExplorebyCategory: 'Explorar por categoría',
    Discover: 'Descubrir',

    Active: 'Activo',
    Inactive: 'Inactivo',

    coins: 'Monedas',
    helpAndSupport: 'Ayuda y apoyo',

    // Referral messages 
    invited: 'Invitada',
    via: 'via',
    referralMessage: 'Te recomiendo como me gustó la aplicación.',

    // Affiliate Screen
    affiliateAnalytics: 'Analítica de afiliados',
    monthlyAverageEarning: 'Ganancia promedio mensual',
    statistics: 'Estadística',
    earnings: 'Ganancias',
    saleAmt: 'Venta Amt',
    commi: 'Commi.',
    from: 'Desde',
    to: 'A',
    emailLinkInvite: 'Enlace de afiliado enviado por correo electrónico',
    smsLinkInvite: 'Enlace de afiliado enviado por SMS',
    twitterLinkInvite: 'Enlace de afiliación enviado por Twitter',
    facebookLinkInvite: 'Enlace de afiliación enviado por Facebook',
    affiliateLinkInvite: 'Enviado a través de enlace',
    earnedBy: 'Ganado por',
    scheme: 'Esquema',

    enter: 'Entrar',
    select: 'Seleccionar',

    //Detail Screen
    TransactionDetail: 'Detalles de la transacción',
    TransactionAmount: 'cantidad de transacción',

    //Languages
    languageTitle: 'Elegir idioma',
    languageSubtitle: 'Toca para elegir tu idioma preferido',
    continue: 'Continuar',

    levAmount: 'Lev.Amount',
    lev: 'Lev',
    currentIp: 'IP actual',
    concurrent: 'Concurrente',

    // referral program
    referralProgram: 'Programa de referencia',
    referEarnReward: 'Referir y ganar recompensas !',
    referralAnalytics: 'Referral Analytics',
    inviteViaEmailSMS: 'Invitar a través de correo electrónico o SMS',
    referrals: 'Referencias',
    share: 'Compartir',
    count: 'contar',

    keys: 'Llaves',
    key: 'Llave',
    secret: 'Secreta',
    access: 'ACCESO',
    api: 'API',
    view: 'Ver',

    //fees
    fees: 'Matrícula',
    feesForTrading: 'Tarifas para el comercio',
    chargeCurrency: 'Moneda de carga',
    feeForDeposit: 'Tasa por deposito',
    feeForWithDrawal: 'Tasa por retiro',
    free: 'Gratis',
    withdrwalKeyNote: 'Ajustaremos las tarifas de retiro según las condiciones de la cadena de bloques regularmente',
    stl_qty: 'Stl.Qty',

    invalidAddress: 'Dirección inválida',
    invalidAmount: 'Montante inválido',

    agree: 'De acuerdo',
    Are_you_sure: '¿Estás seguro?',
    withdrawMailMsg: 'Una vez que haya presentado su solicitud de retiro. Le enviaremos un correo electrónico de confirmación. \n\nDespués de hacer un retiro, puede seguir su progreso en la página de historial.',

    bought: 'COMPRÓ',
    sold: 'VENDIDO',
    cir_Supply: 'Cir.Supply',
    qrcode: 'Código QR',
    requestDetailsMessage: 'Por favor ingrese los detalles de la solicitud. Nuestro personal de soporte lo responderá lo antes posible.',
    subscribePlan: 'Plan de suscripción',

    // Add Currency Logo 
    CoinConfiguration: 'Configuración de la moneda',
    coinConfigurationImage: 'Subir imagen de moneda',
    Image_Validation: 'Por favor suba el logotipo de la moneda',

    //commission Report
    trnRefno: 'Trn RefNo',
    affliateUserId: 'ID de usuario afiliado',
    schemeMappingId: 'SchemeMapping Id',
    trnAmount: 'Cantidad de Trn',
    cronRefNo: 'Cron RefNo',
    fromAcWalletId: 'De Ac WalletId',
    toAcWalletId: 'Para Ac WalletId',
    affiliateUserName: 'Nombre de usuario de afiliados',
    affliateEmail: 'Correo electrónico de afiliados',
    schemeMapping: 'Mapeo de esquemas',
    trnUserId: 'ID de usuario Trn',
    trnUserName: 'Nombre de usuario Trn',
    trnEmail: 'Trn Email',
    trnWalletTypeId: 'Trn WalletTypeID',
    sec: 'Sec.',
    affliateUser: 'Usuario Afiliado',

    // Cancel Orders
    cancelOrder: 'Cancelar orden',
    cancelAllMessage: 'Esto cancelará todos sus pedidos a la vez. ¿Seguro que quieres cancelar todos los pedidos?',
    cancelMessage: 'Esto cancelará todas sus órdenes {type} a la vez. ¿Está seguro de que desea cancelar todos los pedidos de {type}?',
    cancelSingleOrder: '¿Seguro que quieres cancelar este pedido?',
    ordersNotAvailable: 'Pedidos no disponibles',
    cancelAllOrders: 'Cancelar todos los pedidos',
    cancelLimitsOrders: 'Cancelar órdenes de limites',
    cancelMarketsOrders: 'Cancelar órdenes de mercado',
    cancelStopLimitsOrders: 'Cancelar órdenes de límite de parada',

    trading: 'Comercio',

    //api key
    createdOn: 'Creado en',
    selectIPAccess: 'Seleccione acceso IP',
    apiKeyGenrated: 'Api Key Generated SuccessFullyy',

    deviceOs: 'Dispositivo os',

    // for affiliate Invites friends
    affiliateLinkText: 'Enlace de afiliado',
    enterEmailId: 'Ingrese ID de correo electrónico',
    emailids: 'ID de correo electrónico..',
    allowMultipleEmailIdsMessage: 'Permitir múltiples ID de correo electrónico con (,) separados por comas.',
    enterMobileNos: 'Introduzca números de móvil',
    mobileNos: 'Nos móviles..',
    allowMultipleMobileNosMessage: 'Permitir múltiples números móviles con (,) separados por comas.',
    shareOnTwittertext: 'Twitter',
    shareOnFacebooktext: 'Facebook',
    shareWith: 'Compartir con',
    invalidEmailId: 'ID de correo electrónico no válida',
    invalidMobileNo: 'MobileNO no válido',

    // for Margin Profit Loss Report
    marginProfitLossReport: 'Informe de pérdida de ganancias de margen',
    bidPrice: 'Precio de oferta',
    landingPrice: 'Precio de aterrizaje',
    selectPair: 'Seleccione Par',

    // for Open Position Report
    openPositionReport: 'Informe de posición abierta',

    //For Deleverage
    Deleverage: 'Desapalancamiento',
    loanId: 'ID de préstamo',
    profitAmount: 'Cantidad de ganancias',
    ConverttoSiteToken: 'Convertir a token de sitio',
    SessionError: 'Error de sesion!',
    Logout: 'Cerrar sesión!',
    NetworkError: 'Error de red!',

    PleaseSelectType: 'Por favor seleccione el tipo',
    download: 'Descargar',
    Staking_Success_Msg: 'Replanteo realizado con éxito.',

    licenseExpired: 'Su LicenseKey ha caducado. Póngase en contacto con su proveedor de servicios para renovarlo.',
    trialExpire: 'Su licencia de prueba ha caducado. Para continuar usando este servicio, obtenga una licencia de usuario válida.',
    notAuthorized: 'No tienes autenticación para utilizar este servicio.',
    contactServiceProvider: 'No tiene autenticación para usar este servicio. Póngase en contacto con su proveedor de servicios.',
    incorrectCodeContactProvider: 'Código incorrecto !!! Por favor, póngase en contacto con su proveedor.',

    backToLogin: 'Atrás para iniciar sesión',
};

export default esES;