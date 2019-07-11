/**
 * App Widgets
 */
import React from 'react';
import Loadable from 'react-loadable';
import PreloadWidget from 'Components/PreloadLayout/PreloadWidget';

const MyLoadingComponent = () => (
   <PreloadWidget />
)

const DailySales = Loadable({
   loader: () => import("./DailySales"),
   loading: MyLoadingComponent
});

const ToDoListWidget = Loadable({
   loader: () => import("./TodoListWidget"),
   loading: MyLoadingComponent
});

const SupportRequest = Loadable({
   loader: () => import("./SupportRequest"),
   loading: MyLoadingComponent
});

const NewCustomersWidget = Loadable({
   loader: () => import("./NewCustomers"),
   loading: MyLoadingComponent
});

const Notifications = Loadable({
   loader: () => import("./Notifications"),
   loading: MyLoadingComponent
});

const UserProfile = Loadable({
   loader: () => import("./UserProfile"),
   loading: MyLoadingComponent
});

const QuoteOFTheDay = Loadable({
   loader: () => import("./QuoteOfTheDay"),
   loading: MyLoadingComponent
});

const NewEmailsWidget = Loadable({
   loader: () => import("./NewEmails"),
   loading: MyLoadingComponent
});

const ProjectManagement = Loadable({
   loader: () => import("./ProjectManagement"),
   loading: MyLoadingComponent
});

const ProjectTaskManagement = Loadable({
   loader: () => import("./ProjectTaskManagement"),
   loading: MyLoadingComponent
})

const LatestPost = Loadable({
   loader: () => import("./LatestPost"),
   loading: MyLoadingComponent
})

const ActivityBoard = Loadable({
   loader: () => import("./ActivityBoard"),
   loading: MyLoadingComponent
})

const TrafficChannel = Loadable({
   loader: () => import("./TrafficChannel"),
   loading: MyLoadingComponent
})

const PersonalSchedule = Loadable({
   loader: () => import("./PersonalSchedule"),
   loading: MyLoadingComponent
})

const Space = Loadable({
   loader: () => import("./Space"),
   loading: MyLoadingComponent
})

const BookingInfo = Loadable({
   loader: () => import("./BookingInfo"),
   loading: MyLoadingComponent
})

const StockExchange = Loadable({
   loader: () => import("./StockExchange"),
   loading: MyLoadingComponent
})

const TwitterFeeds = Loadable({
   loader: () => import("./TwitterFeed"),
   loading: MyLoadingComponent
})

const OurLocations = Loadable({
   loader: () => import("./OurLocations"),
   loading: MyLoadingComponent
})

const BlogLayoutOne = Loadable({
   loader: () => import("./BlogLayoutOne"),
   loading: MyLoadingComponent
})

const BlogLayoutTwo = Loadable({
   loader: () => import("./BlogLayoutTwo"),
   loading: MyLoadingComponent
})

const BlogLayoutThree = Loadable({
   loader: () => import("./BlogLayoutThree"),
   loading: MyLoadingComponent
})

const ShareFriends = Loadable({
   loader: () => import("./ShareFriends"),
   loading: MyLoadingComponent
})

const PromoCoupons = Loadable({
   loader: () => import("./PromoCoupons"),
   loading: MyLoadingComponent
})

const Rating = Loadable({
   loader: () => import("./Rating"),
   loading: MyLoadingComponent
})

const VisitorAreaChartWidget = Loadable({
   loader: () => import("./VisitorAreaChart"),
   loading: MyLoadingComponent
})

const OrdersAreaChartWidget = Loadable({
   loader: () => import("./OrdersAreaChart"),
   loading: MyLoadingComponent
})

const OverallTrafficStatusWidget = Loadable({
   loader: () => import("./OverallTrafficStatus"),
   loading: MyLoadingComponent
})

const TotalSalesWidget = Loadable({
   loader: () => import("./TotalSales"),
   loading: MyLoadingComponent
})

const NetProfitWidget = Loadable({
   loader: () => import("./NetProfit"),
   loading: MyLoadingComponent
})

const TaxStatsWidget = Loadable({
   loader: () => import("./TaxStats"),
   loading: MyLoadingComponent
})

const ExpensesWidget = Loadable({
   loader: () => import("./Expenses"),
   loading: MyLoadingComponent
})

const EmailStatisticsVersion2Widget = Loadable({
   loader: () => import("./EmailStatisticsVersion2"),
   loading: MyLoadingComponent
})

const TotalEarnsChartWidget = Loadable({
   loader: () => import("./TotalEarnsChart"),
   loading: MyLoadingComponent
})

const BandWidthAreaChartWidget = Loadable({
   loader: () => import("./BandWidthAreaChart"),
   loading: MyLoadingComponent
})

const BandWidthUsageBarChartWidget = Loadable({
   loader: () => import("./BandWidthUsageBarChart"),
   loading: MyLoadingComponent
})

const ProductStatsWidget = Loadable({
   loader: () => import("./ProductStats"),
   loading: MyLoadingComponent
})

const EmailStaticsWidget = Loadable({
   loader: () => import("./EmailStatics"),
   loading: MyLoadingComponent
})

const RevenueWidget = Loadable({
   loader: () => import("./Revenue"),
   loading: MyLoadingComponent
})

const TrafficSourcesWidget = Loadable({
   loader: () => import("./TrafficSourcesWidget"),
   loading: MyLoadingComponent
})

const SiteVisitorChartWidget = Loadable({
   loader: () => import("./SiteVisitorsChart"),
   loading: MyLoadingComponent
})

const CommentsWidget = Loadable({
   loader: () => import("./Comments"),
   loading: MyLoadingComponent
})

const TopSellingWidget = Loadable({
   loader: () => import("./TopSellingWidget"),
   loading: MyLoadingComponent
})

const RecentOrdersWidget = Loadable({
   loader: () => import("./RecentOrders"),
   loading: MyLoadingComponent
})

const SocialCompaninesWidget = Loadable({
   loader: () => import("./SocialCompanies"),
   loading: MyLoadingComponent
})

const Reminders = Loadable({
   loader: () => import("./Reminders"),
   loading: MyLoadingComponent
})

const Notes = Loadable({
   loader: () => import("./Notes"),
   loading: MyLoadingComponent
})

const SocialFeedsWidget = Loadable({
   loader: () => import("./SocialFeedsWidget"),
   loading: MyLoadingComponent
})

const OrderStatusWidget = Loadable({
   loader: () => import("./OrderStatus"),
   loading: MyLoadingComponent
})

const RecentActivity = Loadable({
   loader: () => import("./RecentActivity"),
   loading: MyLoadingComponent
})

const CurrentTimeLocation = Loadable({
   loader: () => import("./CurrentTimeLocation"),
   loading: MyLoadingComponent
})

const CurrentDateWidget = Loadable({
   loader: () => import("./CurrentDate"),
   loading: MyLoadingComponent
})

const TodayOrdersStatsWidget = Loadable({
   loader: () => import("./TotalOrderStats"),
   loading: MyLoadingComponent
})

const ActivityWidget = Loadable({
   loader: () => import("./Activity"),
   loading: MyLoadingComponent
})

const SessionSlider = Loadable({
   loader: () => import("./SessionSlider"),
   loading: MyLoadingComponent
})

const AgencyWelcomeBlock = Loadable({
   loader: () => import("./AgencyWelcomeBlock"),
   loading: MyLoadingComponent
})

const TopHeadlines = Loadable({
   loader: () => import("./TopHeadlines"),
   loading: MyLoadingComponent
})

const Subscribers = Loadable({
   loader: () => import("./Subscribers"),
   loading: MyLoadingComponent
})

const NewslaterCampaign = Loadable({
   loader: () => import("./NewslaterCampaign"),
   loading: MyLoadingComponent
})

const TopAuthors = Loadable({
   loader: () => import("./TopAuthors"),
   loading: MyLoadingComponent
})

const TopNews = Loadable({
   loader: () => import("./TopNews"),
   loading: MyLoadingComponent
})

const TwitterFeedsV2 = Loadable({
   loader: () => import("./TwitterFeedsV2"),
   loading: MyLoadingComponent
})

export {
   DailySales,
   ToDoListWidget,
   SupportRequest,
   NewCustomersWidget,
   Notifications,
   UserProfile,
   QuoteOFTheDay,
   NewEmailsWidget,
   ProjectManagement,
   ProjectTaskManagement,
   LatestPost,
   ActivityBoard,
   TrafficChannel,
   PersonalSchedule,
   Space,
   BookingInfo,
   StockExchange,
   TwitterFeeds,
   OurLocations,
   BlogLayoutOne,
   BlogLayoutTwo,
   BlogLayoutThree,
   ShareFriends,
   PromoCoupons,
   Rating,
   VisitorAreaChartWidget,
   OrdersAreaChartWidget,
   OverallTrafficStatusWidget,
   TotalSalesWidget,
   NetProfitWidget,
   TaxStatsWidget,
   ExpensesWidget,
   EmailStatisticsVersion2Widget,
   TotalEarnsChartWidget,
   BandWidthAreaChartWidget,
   BandWidthUsageBarChartWidget,
   ProductStatsWidget,
   EmailStaticsWidget,
   RevenueWidget,
   TrafficSourcesWidget,
   SiteVisitorChartWidget,
   CommentsWidget,
   TopSellingWidget,
   RecentOrdersWidget,
   SocialCompaninesWidget,
   Reminders,
   Notes,
   SocialFeedsWidget,
   OrderStatusWidget,
   RecentActivity,
   CurrentTimeLocation,
   CurrentDateWidget,
   TodayOrdersStatsWidget,
   ActivityWidget,
   SessionSlider,
   AgencyWelcomeBlock,
   TopHeadlines,
   Subscribers,
   NewslaterCampaign,
   TopAuthors,
   TopNews,
   TwitterFeedsV2
}