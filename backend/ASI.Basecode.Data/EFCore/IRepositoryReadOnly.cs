using System;
using ASI.Basecode.Data.EFCore;
using System.Collections.Generic;
using ASI.Basecode.Data.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.IdentityModel.Tokens;

namespace ASI.Basecode.Data.EFCore
{
    public interface IRepositoryReadOnly<T> : IReadRepository<T>
    where T : class
    {
    }
}
