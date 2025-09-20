using System;
using Basecode.Data.EFCore;
using Basecode.Data.Interfaces;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.IdentityModel.Tokens;

namespace Basecode.Data.EFCore
{
    public interface IRepositoryReadOnly<T> : IReadRepository<T>
    where T : class
    {
    }
}
