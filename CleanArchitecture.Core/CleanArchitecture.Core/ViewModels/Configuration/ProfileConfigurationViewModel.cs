using CleanArchitecture.Core.ApiModels;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.Configuration
{

    public class ProfileConfigurationViewModel : TrackerViewModel
    {
        [Required]
        [StringLength(200)]
        public string ConfigType { get; set; }

        [Required]
        [StringLength(250)]
        public string ConfigKey { get; set; }

        [Required]
        [StringLength(250)]
        public string ConfigValue { get; set; }

        public bool IsEnable { get; set; }

        public bool IsDeleted { get; set; }
    }


    // For Get Config Data List
    public class ProfileConfigurationModel
    {
        public long Id { get; set; }
        public string ConfigType { get; set; }
        public string ConfigKey { get; set; }
        public string ConfigValue { get; set; }
    }

    public class LeaderAdminPolicyModel : TrackerViewModel
    {
        [Required(ErrorMessage = "1,Please select visible profile type.,12001")]
        public int Default_Visibility_of_Profile { get; set; }

        [Required(ErrorMessage = "1,Please enter min Number follower can follow.,12029")]
        public int Min_Number_of_Followers_can_Follow { get; set; }

        [Required(ErrorMessage = "1,Please enter max Number follower can follow.,12002")]
        public int Max_Number_Followers_can_Follow { get; set; }


        #region
        //[Required(ErrorMessage = "1,Please enter min Balance follower account to follow.,12003")]
        //[DataType(DataType.Currency)]
        //[Column(TypeName = "decimal(18, 2)")]
        //public decimal Min_Balance_Require_in_Follower_Account_to_Follow { get; set; }

        ////[Required(ErrorMessage = "1,Please enter min trade volum requir.,4001")]
        ////[Range(1, 100)]
        //[DataType(DataType.Currency)]
        //[Column(TypeName = "decimal(18, 2)")]
        //public decimal Min_Trade_Volume_Requir { get; set; }

        //[Required(ErrorMessage = "1,Please select min trade volume time.,12004")]
        //public int Min_Trade_Volume_Requir_in_Time { get; set; }

        //// [Required(ErrorMessage = "1,Please enter subscription charge.,4001")]
        ////[Range(1, 100)]
        //[DataType(DataType.Currency)]
        //[Column(TypeName = "decimal(18, 2)")]
        //public decimal Subscription_Charge { get; set; }

        //[Required(ErrorMessage = "1,Please select subscription charge frequency type.,12005")]
        //public int Subscription_Charge_Frequency { get; set; }

        //[Required(ErrorMessage = "1,Please select pair watchlist.,12006")]
        //public int Can_Add_Pair_to_Watchlist { get; set; }
        //public int Max_Number_of_Pairs_to_Allow_in_Watchlist { get; set; }
        #endregion
    }




    public class LeaderAdminPolicyResponse : BizResponseClass
    {
    }

    /// <summary>
    /// //////////////////////////////////Follower model
    /// </summary>

    public class FollowerAdminModel : TrackerViewModel
    {
        [Required(ErrorMessage = "1,Please select copy trade option (Yes/No).,12011")]        // [StringLength(50, ErrorMessage = "1,Please enter a valid User Name,4002")]        
        public int Can_Copy_Trade { get; set; }

        [Required(ErrorMessage = "1,Please Select mirror trade option (Yes/No).,12012")]
        public int Can_Mirror_Trade { get; set; }

        [Required(ErrorMessage = "1,Please enter max number of leader to allow follower.,12030")]
        public int Maximum_Number_of_Leaders_to_Allow_Follow { get; set; }

        //[Required(ErrorMessage = "1,Please select pair watchlist.,12006")]
        public int Can_Add_Leader_to_Watchlist { get; set; }

        public int Max_Number_of_Leader_to_Allow_in_Watchlist { get; set; }

        #region
        //[Required(ErrorMessage = "1,Please select auto copy trade option (Yes/No).,12013")]
        //public int Enable_Auto_Copy_Trade_Functionality { get; set; }

        //[Required(ErrorMessage = "1,Please enter minimum copy trade percentage.,12014")]
        //public int Minimum_Copy_Trade_Percentage { get; set; }

        //[Required(ErrorMessage = "1,Please enter default copy trade percentage.,12015")]
        //public int Default_Copy_Trade_Percentage { get; set; }

        //[Required(ErrorMessage = "1,Please enter maxium copy trade percentage.,12016")]
        //public int Maximum_Copy_Trade_Percentage { get; set; }



        ////[Required(ErrorMessage = "1,Please enter min Balance follower account to follow.,7003")]
        //[DataType(DataType.Currency)]
        //[Column(TypeName = "decimal(18, 2)")]
        //public decimal Maximum_Transaction_Amount_Limit { get; set; }


        ////[Required(ErrorMessage = "1,Please Select mirror trade.,7002")]
        //public int Maximum_Number_of_Transactions_Limit { get; set; }

        //[DataType(DataType.Currency)]
        //[Column(TypeName = "decimal(18, 2)")]
        //public decimal Subscription_Charge { get; set; }

        //[Required(ErrorMessage = "1,Please select subscription charge frequency type.,12005")]
        //public int Subscription_Charge_Frequency { get; set; }

        #endregion
    }

    public class FollowerAdminPolicyResponse : BizResponseClass
    {
    }

    ///////////////// Get Leader policy Get 
    ///

    public class LeaderAdminPolicyGetModel
    {
        //[Required(ErrorMessage = "1,Please select visible profile type.,12001")]
        public int Default_Visibility_of_Profile { get; set; }

        //[Required(ErrorMessage = "1,Please enter min Number follower can follow.,12002")]
        public int Min_Number_of_Followers_can_Follow { get; set; }

        //[Required(ErrorMessage = "1,Please enter max Number follower can follow.,12002")]
        public int Max_Number_Followers_can_Follow { get; set; }

        public DateTime UpdatedDate { get; set; }
        public string UserName { get; set; }

        #region
        ////[Required(ErrorMessage = "1,Please enter min Balance follower account to follow.,12003")]
        //[DataType(DataType.Currency)]
        //[Column(TypeName = "decimal(18, 2)")]
        //public decimal Min_Balance_Require_in_Follower_Account_to_Follow { get; set; }

        ////[Required(ErrorMessage = "1,Please enter min trade volum requir.,4001")]
        ////[Range(1, 100)]
        //[DataType(DataType.Currency)]
        //[Column(TypeName = "decimal(18, 2)")]
        //public decimal Min_Trade_Volume_Requir { get; set; }

        ////[Required(ErrorMessage = "1,Please select min trade volume time.,12004")]
        //public int Min_Trade_Volume_Requir_in_Time { get; set; }

        //// [Required(ErrorMessage = "1,Please enter subscription charge.,4001")]
        ////[Range(1, 100)]
        //[DataType(DataType.Currency)]
        //[Column(TypeName = "decimal(18, 2)")]
        //public decimal Subscription_Charge { get; set; }

        ////[Required(ErrorMessage = "1,Please select subscription charge frequency type.,12005")]
        //public int Subscription_Charge_Frequency { get; set; }

        ////[Required(ErrorMessage = "1,Please select pair watchlist.,12006")]
        //public int Can_Add_Pair_to_Watchlist { get; set; }
        //public int Max_Number_of_Pairs_to_Allow_in_Watchlist { get; set; }
        #endregion

    }


    public class LeaderPolicyResponse : BizResponseClass
    {
        public LeaderAdminPolicyGetModel LeaderAdminPolicy { get; set; }
    }
    // /////////////////Get follower policy Get 

    public class FollowerAdminPolicyGetModel
    {
        //[Required(ErrorMessage = "1,Please select copy trade option (Yes/No).,12011")]        // [StringLength(50, ErrorMessage = "1,Please enter a valid User Name,4002")]        
        public int Can_Copy_Trade { get; set; }

        //[Required(ErrorMessage = "1,Please Select mirror trade option (Yes/No).,12012")]
        public int Can_Mirror_Trade { get; set; }

        //[Required(ErrorMessage = "1,Please Select mirror trade.,7002")]
        public int Maximum_Number_of_Leaders_to_Allow_Follow { get; set; }

        //[Required(ErrorMessage = "1,Please select pair watchlist.,12006")]
        public int Can_Add_Leader_to_Watchlist { get; set; }

        public int Max_Number_of_Leader_to_Allow_in_Watchlist { get; set; }

        public DateTime UpdatedDate { get; set; }
        public string UserName { get; set; }

        #region
        ////[Required(ErrorMessage = "1,Please select auto copy trade option (Yes/No).,12013")]
        //public int Enable_Auto_Copy_Trade_Functionality { get; set; }

        ////[Required(ErrorMessage = "1,Please enter minimum copy trade percentage.,12014")]
        //public int Minimum_Copy_Trade_Percentage { get; set; }

        ////[Required(ErrorMessage = "1,Please enter default copy trade percentage.,12015")]
        //public int Default_Copy_Trade_Percentage { get; set; }

        ////[Required(ErrorMessage = "1,Please enter maxium copy trade percentage.,12016")]
        //public int Maximum_Copy_Trade_Percentage { get; set; }

        ////[Required(ErrorMessage = "1,Please enter min Balance follower account to follow.,7003")]
        //[DataType(DataType.Currency)]
        //[Column(TypeName = "decimal(18, 2)")]
        //public decimal Maximum_Transaction_Amount_Limit { get; set; }


        ////[Required(ErrorMessage = "1,Please Select mirror trade.,7002")]
        //public int Maximum_Number_of_Transactions_Limit { get; set; }

        //[DataType(DataType.Currency)]
        //[Column(TypeName = "decimal(18, 2)")]
        //public decimal Subscription_Charge { get; set; }

        ////[Required(ErrorMessage = "1,Please select subscription charge frequency type.,12005")]
        //public int Subscription_Charge_Frequency { get; set; }
        #endregion

    }

    public class FollowerPolicyResponse : BizResponseClass
    {
        public FollowerAdminPolicyGetModel FollowerAdminPolicy { get; set; }
    }

    // Front Leader Policy
    public class FrontLeaderProfile
    {
        public FrontLeaderProfile()
        {
            FrontLeaderProfileList = new List<FrontLeaderProfile>();
        }
        public long ConfigId { get; set; }
        public string ConfigKey { get; set; }
        public string configValue { get; set; }
        public long UserProfileConfigId { get; set; }
        public int? UserId { get; set; }
        public string UserConfigValue { get; set; }
        public List<FrontLeaderProfile> FrontLeaderProfileList { get; set; }
    }

    public class LeaderFrontPolicyModel : TrackerViewModel
    {

        [Required(ErrorMessage = "1,Please select visible profile type.,12001")]
        public int Default_Visibility_of_Profile { get; set; }

        [Required(ErrorMessage = "1,Please enter max Number follower can follow.,12002")]
        public int Max_Number_Followers_can_Follow { get; set; }



        #region
        //[Required(ErrorMessage = "1,Please enter min Balance follower account to follow.,12003")]
        //[DataType(DataType.Currency)]
        //[Column(TypeName = "decimal(18, 2)")]
        //public decimal Min_Balance_Require_in_Follower_Account_to_Follow { get; set; }


        ////[Required(ErrorMessage = "1,Please enter min trade volum requir.,4001")]
        ////[Range(1, 100)]
        //[DataType(DataType.Currency)]
        //[Column(TypeName = "decimal(18, 2)")]
        //public decimal Min_Trade_Volume_Requir { get; set; }

        //[Required(ErrorMessage = "1,Please select min trade volume time.,12004")]
        //public int Min_Trade_Volume_Requir_in_Time { get; set; }

        //// [Required(ErrorMessage = "1,Please enter subscription charge.,4001")]
        ////[Range(1, 100)]
        //[DataType(DataType.Currency)]
        //[Column(TypeName = "decimal(18, 2)")]
        //public decimal Subscription_Charge { get; set; }

        //[Required(ErrorMessage = "1,Please select subscription charge frequency type.,12005")]
        //public int Subscription_Charge_Frequency { get; set; }

        //[Required(ErrorMessage = "1,Please select pair watchlist.,12006")]
        //public int Can_Add_Pair_to_Watchlist { get; set; }
        //public int Max_Number_of_Pairs_to_Allow_in_Watchlist { get; set; }
        #endregion
    }

    public class GetLeaderFrontPolicyModel  //: TrackerViewModel
    {

        [Required(ErrorMessage = "1,Please select visible profile type.,12001")]
        public int Default_Visibility_of_Profile { get; set; }

        public int Min_Number_of_Followers_can_Follow { get; set; }

        [Required(ErrorMessage = "1,Please enter max Number follower can follow.,12002")]
        public int Max_Number_Followers_can_Follow { get; set; }
    }
    public class GetLeaderFollowerCountModel  //: TrackerViewModel
    {
        public int Max_Number_Followers_can_Follow { get; set; }
        public int TotalFollower { get; set; }
    }
    public class LeaderFrontPolicyResponse : BizResponseClass
    {

    }
    public class LeaderFrontPolicyerrorResponse : BizResponseClass
    {
        public int Min_Follower { get; set; }
        public int Max_Follower { get; set; }
    }

    public class LeaderFrontConfigResponse : BizResponseClass
    {
        public GetLeaderFrontPolicyModel LeaderFrontConfiguration { get; set; }
    }

    // front follower get 
    public class FollowerFrontModel : TrackerViewModel
    {
        public string LeaderId { get; set; }

        [Required(ErrorMessage = "1,Please select copy trade option (Yes/No).,12011")]        // [StringLength(50, ErrorMessage = "1,Please enter a valid User Name,4002")]        
        public int Can_Copy_Trade { get; set; }

        [Required(ErrorMessage = "1,Please Select mirror trade option (Yes/No).,12012")]
        public int Can_Mirror_Trade { get; set; }

        [Range(0, 9999999999999999.99)]
        [Column(TypeName = "decimal(18, 2)")]
        public decimal Trade_Percentage { get; set; }

        //[Required(ErrorMessage = "1,Please select auto copy trade option (Yes/No).,12013")]
        //public int Enable_Auto_Copy_Trade_Functionality { get; set; }

        //[Required(ErrorMessage = "1,Please enter minimum copy trade percentage.,12014")]
        //public int Minimum_Copy_Trade_Percentage { get; set; }

        //[Required(ErrorMessage = "1,Please enter default copy trade percentage.,12015")]
        //public int Default_Copy_Trade_Percentage { get; set; }

        //[Required(ErrorMessage = "1,Please enter maxium copy trade percentage.,12016")]
        //public int Maximum_Copy_Trade_Percentage { get; set; }

        ////[Required(ErrorMessage = "1,Please Select mirror trade.,7002")]
        //public int Maximum_Number_of_Leaders_to_Allow_Follow { get; set; }

        //[Required(ErrorMessage = "1,Please enter min Balance follower account to follow.,7003")]
        //[DataType(DataType.Currency)]
        //[Column(TypeName = "decimal(18, 2)")]
        //[Range(0, 9999999999.99999999), Column(TypeName = "decimal(18, 8)")]

        //[Required(ErrorMessage = "1,Please enter maximum transection amount limit (par day).,12027")]
        //[Range(0, 9999999999999999.99), DataType(DataType.Currency)]
        //[Column(TypeName = "decimal(18, 2)")]
        //public decimal Maximum_Transaction_Amount_Limit { get; set; }


        //[Required(ErrorMessage = "1,Please enter maximum transection number limit (par day).,12028")]
        //public int Maximum_Number_of_Transactions_Limit { get; set; }
    }

    public class FollowerServiceFrontModel //: TrackerViewModel
    {
        public string LeaderId { get; set; }

        [Required(ErrorMessage = "1,Please select copy trade option (Yes/No).,12011")]        // [StringLength(50, ErrorMessage = "1,Please enter a valid User Name,4002")]        
        public int Can_Copy_Trade { get; set; }

        [Required(ErrorMessage = "1,Please Select mirror trade option (Yes/No).,12012")]
        public int Can_Mirror_Trade { get; set; }

        //[Range(0, 9999999999999999.99)]
        //[Column(TypeName = "decimal(18, 2)")]
        //public decimal Trade_Percentage { get; set; }

        [Range(0, 9999999999999999.99)]
        [Column(TypeName = "decimal(18, 2)")]
        [Required(ErrorMessage = "1,Please enter default copy trade percentage.,12015")]
        public decimal Default_Copy_Trade_Percentage { get; set; }
    }

    public class FollowerFrontResponse : BizResponseClass
    {

    }

    public class FollowerFrontConfigResponse : BizResponseClass
    {
        public FollowerServiceFrontModel FollowerFrontConfiguration { get; set; }

    }

    /////////////////////////////////////////////
    ///Get Leader List Front 
    ///
    public class LeaderModel
    {
        public int RowsCount { get; set; }
        public long RowNumber { get; set; }
        public int LeaderId { get; set; }
        public string UserName { get; set; }
        public int NoOfFollowerFollow { get; set; }
        public string MaxFollowerKey { get; set; }
        public string adminFollowerLimit { get; set; }
        public string UserMaxLimit { get; set; }
        public string DefaultVisibilityKey { get; set; }
        public string AdminDefaultVisibility { get; set; }
        public string UserDefaultVisible { get; set; }
    }

    public class GetLeaderModel
    {
        //public long RowNumber { get; set; }
        public int LeaderId { get; set; }
        public string LeaderName { get; set; }
        public int NoOfFollowerFollow { get; set; }
        //public string MaxFollowerKey { get; set; }
        //public int adminFollowerLimit { get; set; }
        //public int UserMaxLimit { get; set; }
        //public string DefaultVisibilityKey { get; set; }
        //public string AdminDefaultVisibility { get; set; }
        public string UserDefaultVisible { get; set; }
        public bool IsFollow { get; set; }
        public bool IsWatcher { get; set; }
    }

    public class LeaderListModel
    {
        public int TotalCount { get; set; }
        public List<GetLeaderModel> LeaderList { get; set; }
    }

    public class LeaderListFrontResponse : BizResponseClass
    {
        public int TotalCount { get; set; }
        public List<GetLeaderModel> LeaderList { get; set; }
    }

    public class GetLeaderWithWatchModel
    {       
        //public long RowNumber { get; set; }
        public int LeaderId { get; set; }
        public string LeaderName { get; set; }
        public int NoOfFollowerFollow { get; set; }
        //public string MaxFollowerKey { get; set; }
        //public int adminFollowerLimit { get; set; }
        //public int UserMaxLimit { get; set; }
        //public string DefaultVisibilityKey { get; set; }
        //public string AdminDefaultVisibility { get; set; }
        public string UserDefaultVisible { get; set; }
        public bool IsFollow { get; set; }
        public bool IsWatcher { get; set; }
        public long[] GroupId { get; set; }      
    }

    public class LeaderListWithGroupModel
    {
        public int TotalCount { get; set; }
        public List<GetLeaderWithWatchModel> LeaderList { get; set; }
    }
    public class LeaderListWithGroupResponse : BizResponseClass
    {
        public int TotalCount { get; set; }
        public List<GetLeaderWithWatchModel> LeaderList { get; set; }
    }

    public class GetWatcherModel
    {
        //public long WatchId { get; set; }
        public long GroupId { get; set; }
        public string GroupName { get; set; }
        public long LeaderId { get; set; }
        public string LeaderName { get; set; }
    }


    //public class GetWatcherWiseLeaderModel
    //{
    //    public List<GetGroupModel> GroupList { get; set; }
    //}

    //public class GetGroupModel
    //{
    //    public int Id { get; set; }
    //    public string GroupName { get; set; }
    //    public List<GetWatcherModel> GetWatchWiseLeaderData { get; set; }
    //}

    //public class GroupData
    //{
    //    public int Id { get; set; }
    //    public string GroupName { get; set; }
    //}


    //public class GetFollowerwiseWatchData
    //{
    //    public List<GetGroupModel> GroupData { get; set; }

    //}


    public class WatcherWiseLeaderResponse : BizResponseClass
    {
        public int TotalCount { get; set; }
        public List<GetWatcherModel> WatcherList { get; set; }
    }



    /////// Get Leder wise Follower Config  list
    /// <summary>
    /// 
    /// </summary>


    //public class  GetLeaderwiseFollower
    //{
    //    public GetLeaderwiseFollower()
    //    {
    //        FollowerList = new List<FollowerList>();
    //        FollowerConfigList = new List<FollowerConfigList>();
    //    }
    //    public GetProfile GetProfileType { get; set; }
    //    public List<FollowerList> FollowerList { get; set; }
    //    public List<FollowerConfigList> FollowerConfigList { get; set; }
    //}

    public class GetProfileType
    {
        public int Id { get; set; }
        public bool ProfileType { get; set; }
    }




    public class FollowerList
    {
        public long Id { get; set; }
        public long LeaderId { get; set; }
        public long FolowerId { get; set; }
    }

    public class FollowerConfigList
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Mobile { get; set; }
        public long Id { get; set; }
        public string ConfigKey { get; set; }
        public string ConfigValue { get; set; }
        public string userconfig { get; set; }
        public int Follower { get; set; }
        public long Leader { get; set; }
    }


    public class LeaderwiseFollower
    {
        public bool ProfileType { get; set; }

        public List<ConfigListFollower> FollowerList { get; set; }


    }

    public class ConfigListFollower
    {
        public long Id { get; set; }
        public string UserName { get; set; }
        // public string Email { get; set; }
        public string Mobile { get; set; }
        public string ConfigKey { get; set; }
        //public string ConfigValue { get; set; }
        public string userconfig { get; set; }
        public decimal TradePercentage { get; set; }
        //public long Follower { get; set; }
        //public long Leader { get; set; }
    }

    public class LeaderwiseFollowerResponse : BizResponseClass
    {
        public int Totalcount { get; set; }
        public List<ConfigListFollower> FollowerList { get; set; }
    }

    //Leader wise Followers
    public class LeaderwiseFollowersList
    {
        //public bool ProfileType { get; set; }
        public int Totalcount { get; set; }
        public List<ConfigListFollower> FollowerList { get; set; }
    }


    // Follower Wise leader List
    public class FollowersLeaderModel
    {
        public int RowsCount { get; set; }
        public long RowNumber { get; set; }
        public int LeaderId { get; set; }
        public long FollowerId { get; set; }
        public string UserName { get; set; }
        public int NoOfFollowerFollow { get; set; }
        public string MaxFollowerKey { get; set; }
        public string adminFollowerLimit { get; set; }
        public string UserMaxLimit { get; set; }
        public string DefaultVisibilityKey { get; set; }
        public string AdminDefaultVisibility { get; set; }
        public string UserDefaultVisible { get; set; }
    }

    public class GetFollowerWiseLeaderModel
    {
        //public long RowNumber { get; set; }
        public int LeaderId { get; set; }
        public long FollowerId { get; set; }
        public string LeaderName { get; set; }
        public int NoOfFollowerFollow { get; set; }
        //public string MaxFollowerKey { get; set; }
        //public int adminFollowerLimit { get; set; }
        //public int UserMaxLimit { get; set; }
        //public string DefaultVisibilityKey { get; set; }
        //public string AdminDefaultVisibility { get; set; }
        public string UserDefaultVisible { get; set; }
        public bool IsFollow { get; set; }
    }

    public class FollowersLeaderListModel
    {
        public int TotalCount { get; set; }
        public List<GetFollowerWiseLeaderModel> LeaderList { get; set; }
    }

    public class LeaderListResponse : BizResponseClass
    {
        public int TotalCount { get; set; }
        public List<GetFollowerWiseLeaderModel> LeaderList { get; set; }
    }
}

