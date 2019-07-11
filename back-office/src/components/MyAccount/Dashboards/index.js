/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : MyAccount Dashboards
*/
import DynamicLoadComponent from './DynamicLoadComponent';
import UserDashboard from './UserDashboard';
import CustomersDashboard from './CustomersDashboard';
import RoleDashboard from './RoleDashboard';
import ReportDashboard from './ReportDashboard';
import AddCustomerDashboard from './AddCustomerDashboard';
import ListCustomerDashboard from './ListCustomerDashboard';
import ListUserDashboard from './ListUserDashboard';
import ListRoleDashboard from './ListRoleDashboard';
import HelpNSupoortDashboard from './HelpNSupoortDashboard';
import ListKYCVerifyWdgt from './ListKYCVerifyWdgt';
import EditKYCVerifyWdgt from './EditKYCVerifyWdgt';
import PasswordPolicyConfigurationDashboard from './PasswordPolicyConfigurationDashboard';
import AddPasswordPolicyConfig from './AddPasswordPolicyConfig';
import ListPasswordPolicyConfig from './ListPasswordPolicyConfig';
import SocialTradingPolicyDashboard from './SocialTradingPolicyDashboard';
import LeaderProfileDashboard from './LeaderProfileDashboard';
import FollowerProfileDashboard from './FollowerProfileDashboard';
import ManageAccountDashboard from './ManageAccountDashboard';
import AffiliateManagementDashboard from './AffiliateManagementDashboard';
import UserManagementDashboard from './UserManagementDashboard';
import RuleManagementDashboard from './RuleManagementDashboard';
import RoleManagementDashboard from './RoleManagementDashboard';
import UserPermissionGroups from './UserPermissionGroups';
import RuleModuleDashboard from './RuleModuleDashboard';
import RuleSubModuleDashboard from './RuleSubModuleDashboard';
import RuleFieldsDashboard from './RuleFieldsDashboard';
import RuleToolDashboard from './RuleToolDashboard';
import AddEditRuleModule from './AddEditRuleModule';
import AddEditRuleSubModule from './AddEditRuleSubModule';
import AddEditRuleField from './AddEditRuleField';
import AddEditRuleTool from './AddEditRuleTool';
import ListRuleModule from './ListRuleModule';
import ListRuleSubModule from './ListRuleSubModule';
import ListRuleField from './ListRuleField';
import ListRuleTool from './ListRuleTool';
import AddEditPermissionGroup from './AddEditPermissionGroup';
import ListPermissionGroup from './ListPermissionGroup';
import AssignRole from './AssignRole';
import ViewRoleDetails from './ViewRoleDetails';
import AffiliateSchemeDashboard from './AffiliateSchemeDashboard';
import AffiliateSchemeTypeDashboard from './AffiliateSchemeTypeDashboard';
import AffiliatePromotionDashboard from './AffiliatePromotionDashboard';
import ListAffiliateScheme from './ListAffiliateScheme';
import ListAffiliateSchemeType from './ListAffiliateSchemeType';
import ListAffiliatePromotion from './ListAffiliatePromotion';
import AddEditAffiliateScheme from './AddEditAffiliateScheme';
import AddEditAffiliateSchemeType from './AddEditAffiliateSchemeType';
import AddEditAffiliatePromotion from './AddEditAffiliatePromotion';
import SetPermission from './Permissions';
import SecurityDashboard from './SecurityDashboard';
import PersonalInformationDashboard from './PersonalInformationDashboard';
import ChangePasswordDashboard from './ChangePasswordDashboard';
import SecurityQuestionDashboard from './SecurityQuestionDashboard';
import IPWhitelistDashboard from './IPWhitelistDashboard';
import AllowIPDashboard from './AllowIPDashboard';
import ListIPWhitelistDashboard from './ListIPWhitelistDashboard';
import ListDeviceWhitelistDashboard from './ListDeviceWhitelistDashboard';
import LoginHistoryDashboard from './LoginHistoryDashboard';
import IPHistoryDashboard from './IPHistoryDashboard';
import ComplainReportDashboard from './ComplainReportDashboard';
import ComplainReplyDashboard from './ComplainReplyDashboard';
import UserSignupReportDashboard from './UserSignupReportDashboard';
import ListUserSignupReportDashboard from './ListUserSignupReportDashboard';
import ListActivityLogDashboard from './ListActivityLogDashboard';
import SLAConfigurationDashboard from './SLAConfigurationDashboard';
import AddSLAPriorityDashboard from './AddSLAPriorityDashboard';
import ListSLAPriorityDashboard from './ListSLAPriorityDashboard';
import EditSLAConfigurationDashboard from './EditSLAConfigurationDashboard';
import IPProfilingDashboard from './IPProfilingDashboard';
import AllowIPRangeDashboard from './AllowIPRangeDashboard';
import ListIPRangeDashboard from './ListIPRangeDashboard';
import EditPasswordPolicy from './EditPasswordPolicy';
import ProfileConfigDashboard from './ProfileConfigDashboard';
import AddProfileConfigDashboard from './AddProfileConfigDashboard';
import ListProfileConfigDashboard from './ListProfileConfigDashboard';
import EditProfileConfigDashboard from './EditProfileConfigDashboard';
import ProviderBalanceCheck from './ProviderBalanceCheck';

//Create By Sanjay
import AppConfigurationDashboard from './AppConfigurationDashboard';
import ReferralSystemDashboard from './ReferralSystemDashboard';
import ReferralRewardConfigDashboard from './ReferralRewardConfigDashboard';
import ListReferralPayType from './ListReferralPayType';
import ReferralPayTypeDashboard from './ReferralPayTypeDashboard';
import AddReferralPayType from './AddReferralPayType';
import ReferralChannelTypeDashboard from './ReferralChannelTypeDashboard';
import ListReferralChannelType from './ListReferralChannelType';
import AddReferralChannelType from './AddReferralChannelType';
import ReferralServiceTypeDashboard from './ReferralServiceTypeDashboard';
import UpdateReferralServiceType from './UpdateReferralServiceType';
import ListReferralServiceType from './ListReferralServiceType';
import AddReferralServiceType from './AddReferralServiceType';
import AddReferralRewardConfig from "./AddReferralRewardConfig";
import ListReferralRewardConfig from './ListReferralRewardConfig';
import ListReferralInvite from './ListReferralInvite';
import UpdateReferralRewardConfig from './UpdateReferralRewardConfig';
import ListInviteVieEmailAndSMS from './ListInviteVieEmailAndSMS';
import ListSocialMediaInvite from './ListSocialMediaInvite';
import ListReferralParticipate from './ListReferralParticipate';
import ListReferralRewards from './ListReferralRewards';
import TwoFactoreAuthWdgtBlk from './TwoFactoreAuthWdgtBlk';

//Added By Bharat Jograna
import ClickOnReferralLinkReport from './ClickOnReferralLinkReport';
import RoleAssignHistory from './RoleAssignHistory';
import AddEditRole from './AddEditRole';
import ListAffiliateFacebookShareReport from './ListAffiliateFacebookShareReport';
import ListAffiliateTwitterShareReport from './ListAffiliateTwitterShareReport';
import ListAffiliateClickOnLinkReport from './ListAffiliateClickOnLinkReport';
import UpdateAssignRole from './UpdateAssignRole';
import ListUnassignUserRole from './ListUnassignUserRole';
import AssignRoleToUnassign from './AssignRoleToUnassign';
import AffiliateSchemeTypeMappingDashboard from './AffiliateSchemeTypeMappingDashboard';
import ListAffiliateSchemeTypeMapping from './ListAffiliateSchemeTypeMapping';
import AddEditAffiliateSchemeTypeMapping from './AddEditAffiliateSchemeTypeMapping';
import ReferralServiceDetailDashboard from './ReferralServiceDetailDashboard';
import ListReferralServiceDetail from './ListReferralServiceDetail';
import AddEditReferralServiceDetail from './AddEditReferralServiceDetail';

//Added by Saloni
import AffiliateReportDashboard from './AffiliateReportDashboard';
import ListAffiliateSignupReport from './ListAffiliateSignupReport';
import ListAffiliateCommissionReport from './ListAffiliateCommissionReport';
import ListAffiliateEmailSentReport from './ListAffiliateEmailSentReport';
import ListAffiliateSmsSentReport from './ListAffiliateSmsSentReport';
import AddEditUser from './AddEditUser';
import ListUser from './ListUser';
import SocialTradingHistory from './SocialTradingHistory';
import AffiliateSchemeDetailDashboard from './AffiliateSchemeDetailDashboard';
import ListAffiliateSchemeDetail from './ListAffiliateSchemeDetail';
import AddEditAffiliateSchemeDetail from './AddEditAffiliateSchemeDetail';
import AddEditReferralSchemeTypeMapping from './AddEditReferralSchemeTypeMapping';
import ListReferralSchemeTypeMapping from './ListReferralSchemeTypeMapping';
import ReferralSchemeTypeMappingDashboard from './ReferralSchemeTypeMappingDashboard';
export * from './DashboardPageTitle';

//Added By Kevin
export * from './PresonalDashboard';

export {
    DynamicLoadComponent,
    UserDashboard,
    CustomersDashboard,
    RoleDashboard,
    ReportDashboard,
    AddCustomerDashboard,
    ListCustomerDashboard,
    ListUserDashboard,
    ListRoleDashboard,
    HelpNSupoortDashboard,
    ListKYCVerifyWdgt,
    EditKYCVerifyWdgt,
    PasswordPolicyConfigurationDashboard,
    AddPasswordPolicyConfig,
    ListPasswordPolicyConfig,
    SocialTradingPolicyDashboard,
    LeaderProfileDashboard,
    FollowerProfileDashboard,
    ManageAccountDashboard,
    AffiliateManagementDashboard,
    UserManagementDashboard,
    RuleManagementDashboard,
    RoleManagementDashboard,
    UserPermissionGroups,
    RuleModuleDashboard,
    RuleSubModuleDashboard,
    RuleFieldsDashboard,
    RuleToolDashboard,
    AddEditRuleModule,
    AddEditRuleSubModule,
    AddEditRuleField,
    AddEditRuleTool,
    ListRuleModule,
    ListRuleSubModule,
    ListRuleField,
    ListRuleTool,
    AddEditPermissionGroup,
    ListPermissionGroup,
    AssignRole,
    ViewRoleDetails,
    AffiliateSchemeDashboard,
    AffiliateSchemeTypeDashboard,
    AffiliatePromotionDashboard,
    ListAffiliateScheme,
    ListAffiliateSchemeType,
    ListAffiliatePromotion,
    AddEditAffiliateScheme,
    AddEditAffiliateSchemeType,
    AddEditAffiliatePromotion,
    SetPermission,

    //Added By Kevin Ladani
    SecurityDashboard,
    IPHistoryDashboard,
    AllowIPDashboard,
    ListDeviceWhitelistDashboard,
    IPWhitelistDashboard,
    ListIPWhitelistDashboard,
    ChangePasswordDashboard,
    PersonalInformationDashboard,
    SecurityQuestionDashboard,
    LoginHistoryDashboard,
    ComplainReportDashboard,
    ComplainReplyDashboard,
    UserSignupReportDashboard,
    ListUserSignupReportDashboard,
    ListActivityLogDashboard,
    SLAConfigurationDashboard,
    AddSLAPriorityDashboard,
    ListSLAPriorityDashboard,
    EditSLAConfigurationDashboard,
    IPProfilingDashboard,
    AllowIPRangeDashboard,
    ListIPRangeDashboard,
    EditPasswordPolicy,
    ProfileConfigDashboard,
    AddProfileConfigDashboard,
    ListProfileConfigDashboard,
    EditProfileConfigDashboard,
    ProviderBalanceCheck,

    //Create By Sanjay 
    AppConfigurationDashboard,
    ReferralSystemDashboard,
    ReferralRewardConfigDashboard,
    ReferralPayTypeDashboard,
    ListReferralPayType,
    AddReferralPayType,
    ReferralChannelTypeDashboard,
    ListReferralChannelType,
    AddReferralChannelType,
    ReferralServiceTypeDashboard,
    UpdateReferralServiceType,
    ListReferralServiceType,
    AddReferralServiceType,
    AddReferralRewardConfig,
    ListReferralRewardConfig,
    ListReferralInvite,
    UpdateReferralRewardConfig,
    ListInviteVieEmailAndSMS,
    ListSocialMediaInvite,
    ListReferralParticipate,
    ListReferralRewards,
    TwoFactoreAuthWdgtBlk,

    //Added By Bharat Jograna
    ClickOnReferralLinkReport,
    RoleAssignHistory,
    AddEditRole,
    ListAffiliateFacebookShareReport,
    ListAffiliateTwitterShareReport,
    ListAffiliateClickOnLinkReport,
    UpdateAssignRole,
    ListUnassignUserRole,
    AssignRoleToUnassign,
    AffiliateSchemeTypeMappingDashboard,
    ListAffiliateSchemeTypeMapping,
    AddEditAffiliateSchemeTypeMapping,
    ReferralServiceDetailDashboard,
    ListReferralServiceDetail,
    AddEditReferralServiceDetail,

    //Added By Saloni
    AffiliateReportDashboard,
    ListAffiliateSignupReport,
    ListAffiliateCommissionReport,
    ListAffiliateEmailSentReport,
    ListAffiliateSmsSentReport,
    AddEditUser,
    ListUser,
    SocialTradingHistory,
    AffiliateSchemeDetailDashboard,
    ListAffiliateSchemeDetail,
    AddEditAffiliateSchemeDetail,
    ReferralSchemeTypeMappingDashboard,
    ListReferralSchemeTypeMapping,
    AddEditReferralSchemeTypeMapping
}