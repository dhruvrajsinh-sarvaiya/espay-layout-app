﻿using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;

namespace CleanArchitecture.Infrastructure.EFLocalizer
{
   public class EFStringLocalizer : IStringLocalizer
    {
        private readonly CleanArchitectureContext _context;       

        public EFStringLocalizer(CleanArchitectureContext context)
        {
            _context = context;
        }

        public LocalizedString this[string name]
        {
            get
            {
                var value = GetString(name);
                return new LocalizedString(name, value ?? name, resourceNotFound: value == null);
            }
        }

        public LocalizedString this[string name, params object[] arguments]
        {
            get
            {
                var format = GetString(name);
                var value = string.Format(format ?? name, arguments);
                return new LocalizedString(name, value, resourceNotFound: format == null);
            }
        }

        public IStringLocalizer WithCulture(CultureInfo culture)
        {
            CultureInfo.DefaultThreadCurrentCulture = culture;
            return new EFStringLocalizer(_context);
        }

        public IEnumerable<LocalizedString> GetAllStrings(bool includeAncestorCultures)
        {
            return _context.Resources
                .Include(r => r.Culture)
                .Where(r => r.Culture.Name == CultureInfo.CurrentCulture.Name)
                .Select(r => new LocalizedString(r.Key, r.Value, true));
        }

        private string GetString(string name)
        {
            return _context.Resources
                .Include(r => r.Culture)
                .Where(r => r.Culture.Name == CultureInfo.CurrentCulture.Name)
                .FirstOrDefault(r => r.Key == name)?.Value;
        }

        //IEnumerable<LocalizedString> IStringLocalizer.GetAllStrings(bool includeParentCultures)
        //{
        //    throw new NotImplementedException();
        //}

        //IStringLocalizer IStringLocalizer.WithCulture(CultureInfo culture)
        //{
        //    throw new NotImplementedException();
        //}
    }
}
