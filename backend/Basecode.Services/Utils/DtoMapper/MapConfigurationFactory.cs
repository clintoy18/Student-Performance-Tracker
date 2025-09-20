// <copyright file="MapConfigurationFactory.cs" company="Alliance Software Inc">
// Copyright (c) Alliance Software Inc. All rights reserved.
// </copyright>

namespace Basecode.Services.Utils.DtoMapper
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Reflection;
    using AutoMapper;

    public static class MapConfigurationFactory
    {
        public static IMapper Scan<TType>(Func<AssemblyName, bool> assemblyFilter = null)
        {
            var target = typeof(TType).Assembly;

            bool LoadAllFilter(AssemblyName x) => true;

            var assembliesToLoad = target.GetReferencedAssemblies()
                .Where(assemblyFilter ?? LoadAllFilter)
                .Select(Assembly.Load)
                .ToList();

            assembliesToLoad.Add(target);

            return LoadMapsFromAssemblies(assembliesToLoad.ToArray());
        }

        public static IMapper LoadMapsFromAssemblies(params Assembly[] assemblies)
        {
            var types = assemblies.SelectMany(a => a.GetExportedTypes()).ToArray();
            return LoadAllMappings(types);
        }

        public static IMapper LoadAllMappings(IList<Type> types)
        {
            var config = new MapperConfiguration(cfg =>
            {
                LoadStandardMappings(cfg, types);
                LoadCustomMappings(cfg, types);
            });

            return config.CreateMapper();
        }

        public static void LoadCustomMappings(IMapperConfigurationExpression config, IList<Type> types)
        {
            var instancesToMap = (from t in types
                                  from i in t.GetInterfaces()
                                  where typeof(ICustomMap).IsAssignableFrom(t) &&
                                        !t.IsAbstract &&
                                        !t.IsInterface
                                  select (ICustomMap)Activator.CreateInstance(t)).ToArray();

            foreach (var map in instancesToMap)
            {
                map.CreateMappings(config);
            }
        }

        public static void LoadStandardMappings(IMapperConfigurationExpression config, IList<Type> types)
        {
            if (config != null)
            {
                var mapsFrom = (from t in types
                                from i in t.GetInterfaces()
                                where i.IsGenericType && i.GetGenericTypeDefinition() == typeof(IMapFrom<>) &&
                                      !t.IsAbstract &&
                                      !t.IsInterface
                                select new
                                {
                                    Source = i.GetGenericArguments()[0],
                                    Destination = t,
                                }).ToArray();

                foreach (var map in mapsFrom)
                {
                    config.CreateMap(map.Source, map.Destination);
                }

                var mapsTo = (from t in types
                              from i in t.GetInterfaces()
                              where i.IsGenericType && i.GetGenericTypeDefinition() == typeof(IMapTo<>) &&
                                    !t.IsAbstract &&
                                    !t.IsInterface
                              select new
                              {
                                  Source = i.GetGenericArguments()[0],
                                  Destination = t,
                              }).ToArray();

                foreach (var map in mapsTo)
                {
                    config.CreateMap(map.Source, map.Destination);
                }
            }
        }
    }
}
