#pragma checksum "D:\GitHub\NewClone\espay-layout-beta\dotnetapi\CleanArchitecture.Web\Views\ToDo\Index.cshtml" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "26cca6b0a44435fb8b2b206b6eecef660f2d8585"
// <auto-generated/>
#pragma warning disable 1591
[assembly: global::Microsoft.AspNetCore.Razor.Hosting.RazorCompiledItemAttribute(typeof(AspNetCore.Views_ToDo_Index), @"mvc.1.0.view", @"/Views/ToDo/Index.cshtml")]
[assembly:global::Microsoft.AspNetCore.Mvc.Razor.Compilation.RazorViewAttribute(@"/Views/ToDo/Index.cshtml", typeof(AspNetCore.Views_ToDo_Index))]
namespace AspNetCore
{
    #line hidden
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.Rendering;
    using Microsoft.AspNetCore.Mvc.ViewFeatures;
#line 1 "D:\GitHub\NewClone\espay-layout-beta\dotnetapi\CleanArchitecture.Web\Views\_ViewImports.cshtml"
using CleanArchitecture.Web;

#line default
#line hidden
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"26cca6b0a44435fb8b2b206b6eecef660f2d8585", @"/Views/ToDo/Index.cshtml")]
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"00d5fe07225ac11e829459118ab0972d26438d9b", @"/Views/_ViewImports.cshtml")]
    public class Views_ToDo_Index : global::Microsoft.AspNetCore.Mvc.Razor.RazorPage<IEnumerable<CleanArchitecture.Core.Entities.ToDoItem>>
    {
        #pragma warning disable 1998
        public async override global::System.Threading.Tasks.Task ExecuteAsync()
        {
#line 1 "D:\GitHub\NewClone\espay-layout-beta\dotnetapi\CleanArchitecture.Web\Views\ToDo\Index.cshtml"
  
    ViewData["Title"] = "ToDo List";

#line default
#line hidden
            BeginContext(107, 39, true);
            WriteLiteral("<h2>To Do Items (MVC View)</h2>\r\n<ul>\r\n");
            EndContext();
#line 7 "D:\GitHub\NewClone\espay-layout-beta\dotnetapi\CleanArchitecture.Web\Views\ToDo\Index.cshtml"
 foreach (var item in Model)
{

#line default
#line hidden
            BeginContext(179, 8, true);
            WriteLiteral("    <li>");
            EndContext();
            BeginContext(188, 10, false);
#line 9 "D:\GitHub\NewClone\espay-layout-beta\dotnetapi\CleanArchitecture.Web\Views\ToDo\Index.cshtml"
   Write(item.Title);

#line default
#line hidden
            EndContext();
            BeginContext(198, 5, true);
            WriteLiteral("<br/>");
            EndContext();
            BeginContext(204, 16, false);
#line 9 "D:\GitHub\NewClone\espay-layout-beta\dotnetapi\CleanArchitecture.Web\Views\ToDo\Index.cshtml"
                   Write(item.Description);

#line default
#line hidden
            EndContext();
            BeginContext(220, 7, true);
            WriteLiteral("</li>\r\n");
            EndContext();
#line 10 "D:\GitHub\NewClone\espay-layout-beta\dotnetapi\CleanArchitecture.Web\Views\ToDo\Index.cshtml"
}

#line default
#line hidden
            BeginContext(230, 7, true);
            WriteLiteral("</ul>\r\n");
            EndContext();
        }
        #pragma warning restore 1998
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.ViewFeatures.IModelExpressionProvider ModelExpressionProvider { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.IUrlHelper Url { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.IViewComponentHelper Component { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.Rendering.IJsonHelper Json { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.Rendering.IHtmlHelper<IEnumerable<CleanArchitecture.Core.Entities.ToDoItem>> Html { get; private set; }
    }
}
#pragma warning restore 1591
